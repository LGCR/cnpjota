import { prisma } from '@/lib/prisma';
import { CnpjResponseDto } from '@/types/cnpj.dto';
import { CnpjData } from '@prisma/client';

export class CnpjRepository {
  /**
   * Busca CNPJ no cache
   */
  async findByCnpj(cnpj: string): Promise<CnpjData | null> {
    return prisma.cnpjData.findUnique({
      where: { cnpj },
    });
  }

  /**
   * Verifica se dados estão desatualizados (> 15 dias)
   */
  isOutdated(cnpjData: CnpjData, cacheDays: number = 15): boolean {
    const now = new Date();
    const lastUpdate = new Date(cnpjData.lastUpdatedAt);
    const daysDiff = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff >= cacheDays;
  }

  /**
   * Salva ou atualiza dados de CNPJ
   */
  async upsert(cnpj: string, data: CnpjResponseDto, source?: string): Promise<CnpjData> {
    return prisma.cnpjData.upsert({
      where: { cnpj },
      create: {
        cnpj,
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        cnae: data.cnae,
        descricaoCnae: data.descricaoCnae,
        naturezaJuridica: data.naturezaJuridica,
        dataAbertura: data.dataAbertura,
        situacaoCadastral: data.situacaoCadastral,
        dataSituacaoCadastral: data.dataSituacaoCadastral,
        capitalSocial: data.capitalSocial != null ? String(data.capitalSocial) : null,
        porte: data.porte,
        logradouro: data.endereco.logradouro,
        numero: data.endereco.numero,
        complemento: data.endereco.complemento,
        bairro: data.endereco.bairro,
        municipio: data.endereco.municipio,
        uf: data.endereco.uf,
        cep: data.endereco.cep,
        telefone: data.contato.telefone,
        email: data.contato.email,
        socios: data.socios as any,
        source: source || 'unknown',
        lastUpdatedAt: new Date(),
      },
      update: {
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        cnae: data.cnae,
        descricaoCnae: data.descricaoCnae,
        naturezaJuridica: data.naturezaJuridica,
        dataAbertura: data.dataAbertura,
        situacaoCadastral: data.situacaoCadastral,
        dataSituacaoCadastral: data.dataSituacaoCadastral,
        capitalSocial: data.capitalSocial != null ? String(data.capitalSocial) : null,
        porte: data.porte,
        logradouro: data.endereco.logradouro,
        numero: data.endereco.numero,
        complemento: data.endereco.complemento,
        bairro: data.endereco.bairro,
        municipio: data.endereco.municipio,
        uf: data.endereco.uf,
        cep: data.endereco.cep,
        telefone: data.contato.telefone,
        email: data.contato.email,
        socios: data.socios as any,
        source: source || 'unknown',
        lastUpdatedAt: new Date(),
      },
    });
  }

  /**
   * Registra consulta de CNPJ
   */
  async logQuery(
    userId: string,
    cnpj: string,
    cnpjDataId: string | null,
    creditCost: number,
    source: string,
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    await prisma.cnpjQuery.create({
      data: {
        userId,
        cnpj,
        cnpjDataId,
        creditCost,
        source,
        success,
        errorMessage,
      },
    });
  }

  /**
   * Mapeia CnpjData para DTO
   */
  mapToDto(cnpjData: CnpjData): CnpjResponseDto {
    return {
      cnpj: cnpjData.cnpj,
      razaoSocial: cnpjData.razaoSocial,
      nomeFantasia: cnpjData.nomeFantasia,
      cnae: cnpjData.cnae,
      descricaoCnae: cnpjData.descricaoCnae,
      naturezaJuridica: cnpjData.naturezaJuridica,
      dataAbertura: cnpjData.dataAbertura,
      situacaoCadastral: cnpjData.situacaoCadastral,
      dataSituacaoCadastral: cnpjData.dataSituacaoCadastral,
      capitalSocial: cnpjData.capitalSocial ? Number(String(cnpjData.capitalSocial)) : null,
      porte: cnpjData.porte,
      endereco: {
        logradouro: cnpjData.logradouro,
        numero: cnpjData.numero,
        complemento: cnpjData.complemento,
        bairro: cnpjData.bairro,
        municipio: cnpjData.municipio,
        uf: cnpjData.uf,
        cep: cnpjData.cep,
      },
      contato: {
        telefone: cnpjData.telefone,
        email: cnpjData.email,
      },
      socios: cnpjData.socios as any,
      dataAtualizacao: cnpjData.lastUpdatedAt.toISOString(),
    };
  }
}

export const cnpjRepository = new CnpjRepository();
