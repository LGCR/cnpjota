import { CnpjResponseDto } from '@/types/cnpj.dto';
import { cleanCnpj, isValidCnpj } from '@/lib/validators';
import { ValidationError } from '@/types/errors';
import { CnpjProviderManager } from './cnpj-providers.service';
import { cnpjRepository } from '@/repositories/cnpj.repository';

export class CnpjService {
  private providerManager: CnpjProviderManager;
  private cacheDays: number;

  constructor() {
    this.providerManager = new CnpjProviderManager();
    this.cacheDays = parseInt(process.env.CNPJ_CACHE_DAYS || '15');
  }

  /**
   * Consulta CNPJ (com cache e fallback)
   */
  async lookup(cnpj: string): Promise<{ data: CnpjResponseDto; fromCache: boolean }> {
    // Valida e limpa CNPJ
    const cleanedCnpj = cleanCnpj(cnpj);
    
    if (!isValidCnpj(cleanedCnpj)) {
      throw new ValidationError('CNPJ inválido');
    }

    // Busca no cache
    const cached = await cnpjRepository.findByCnpj(cleanedCnpj);

    // Se existe e está atualizado, retorna do cache
    if (cached && !cnpjRepository.isOutdated(cached, this.cacheDays)) {
      return {
        data: cnpjRepository.mapToDto(cached),
        fromCache: true,
      };
    }

    // Consulta APIs externas com fallback
    const { data, source } = await this.providerManager.fetchWithFallback(cleanedCnpj);

    // Salva/atualiza no cache (passando a fonte/ provider)
    await cnpjRepository.upsert(cleanedCnpj, data, source);

    return {
      data,
      fromCache: false,
    };
  }

  /**
   * Busca apenas no cache (não consome APIs externas)
   */
  async getCached(cnpj: string): Promise<CnpjResponseDto | null> {
    const cleanedCnpj = cleanCnpj(cnpj);
    
    if (!isValidCnpj(cleanedCnpj)) {
      throw new ValidationError('CNPJ inválido');
    }

    const cached = await cnpjRepository.findByCnpj(cleanedCnpj);
    
    if (!cached) {
      return null;
    }

    return cnpjRepository.mapToDto(cached);
  }
}

export const cnpjService = new CnpjService();
