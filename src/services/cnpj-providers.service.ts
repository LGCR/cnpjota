import {
  CnpjResponseDto,
  BrasilApiResponse,
  OpenCnpjResponse,
  CnpjaResponse,
  ReceitaWsResponse,
  Socio,
} from '@/types/cnpj.dto';
import { ExternalApiError } from '@/types/errors';

export interface CnpjProvider {
  name: string;
  priority: number;
  fetch(cnpj: string): Promise<CnpjResponseDto>;
}

/**
 * BrasilAPI - Prioridade 1
 */
export class BrasilApiProvider implements CnpjProvider {
  name = 'BrasilAPI';
  priority = 1;
  private baseUrl = 'https://brasilapi.com.br/api/cnpj/v1';

  async fetch(cnpj: string): Promise<CnpjResponseDto> {
    try {
      const response = await fetch(`${this.baseUrl}/${cnpj}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: BrasilApiResponse = await response.json();
      return this.mapToDto(data);
    } catch (error) {
      throw new ExternalApiError(
        `Erro ao consultar BrasilAPI: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        this.name
      );
    }
  }

  private mapToDto(data: BrasilApiResponse): CnpjResponseDto {
    return {
      cnpj: data.cnpj,
      razaoSocial: data.razao_social,
      nomeFantasia: data.nome_fantasia || null,
      cnae: data.cnae_fiscal?.toString() || null,
      descricaoCnae: data.cnae_fiscal_descricao || null,
      naturezaJuridica: data.descricao_natureza_juridica || null,
      dataAbertura: data.data_inicio_atividade || null,
      situacaoCadastral: data.descricao_situacao_cadastral || null,
      dataSituacaoCadastral: data.data_situacao_cadastral || null,
      capitalSocial: data.capital_social?.toString() || null,
      porte: data.descricao_porte || null,
      endereco: {
        logradouro: data.logradouro || null,
        numero: data.numero || null,
        complemento: data.complemento || null,
        bairro: data.bairro || null,
        municipio: data.municipio || null,
        uf: data.uf || null,
        cep: data.cep || null,
      },
      contato: {
        telefone: data.ddd_telefone_1 || null,
        email: null,
      },
      socios: data.qsa?.map((s) => ({
        nome: s.nome_socio,
        qualificacao: s.qualificacao_socio || null,
        dataEntrada: s.data_entrada_sociedade || null,
        cpfCnpj: s.cpf_cnpj_socio || null,
      })) || null,
      fonte: this.name,
      dataAtualizacao: new Date().toISOString(),
    };
  }
}

/**
 * OpenCNPJ - Prioridade 2
 */
export class OpenCnpjProvider implements CnpjProvider {
  name = 'OpenCNPJ';
  priority = 2;
  private baseUrl = 'https://open.cnpja.com';

  async fetch(cnpj: string): Promise<CnpjResponseDto> {
    try {
      const response = await fetch(`${this.baseUrl}/office/${cnpj}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: OpenCnpjResponse = await response.json();
      return this.mapToDto(data);
    } catch (error) {
      throw new ExternalApiError(
        `Erro ao consultar OpenCNPJ: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        this.name
      );
    }
  }

  private mapToDto(data: OpenCnpjResponse): CnpjResponseDto {
    return {
      cnpj: data.taxId,
      razaoSocial: data.name,
      nomeFantasia: data.alias || null,
      cnae: data.mainActivity?.id?.toString() || null,
      descricaoCnae: data.mainActivity?.text || null,
      naturezaJuridica: data.company?.nature?.text || null,
      dataAbertura: data.founded || null,
      situacaoCadastral: data.status?.text || null,
      dataSituacaoCadastral: data.statusDate || null,
      capitalSocial: data.company?.equity?.toString() || null,
      porte: data.company?.size?.text || null,
      endereco: {
        logradouro: data.address?.street || null,
        numero: data.address?.number || null,
        complemento: data.address?.details || null,
        bairro: data.address?.district || null,
        municipio: data.address?.city || null,
        uf: data.address?.state || null,
        cep: data.address?.zip || null,
      },
      contato: {
        telefone: data.phones?.[0] ? `${data.phones[0].area}${data.phones[0].number}` : null,
        email: data.emails?.[0]?.address || null,
      },
      socios: data.members?.map((m) => ({
        nome: m.name,
        qualificacao: m.role?.text || null,
        dataEntrada: m.since || null,
        cpfCnpj: null,
      })) || null,
      fonte: this.name,
      dataAtualizacao: new Date().toISOString(),
    };
  }
}

/**
 * CNPJá - Prioridade 3
 */
export class CnpjaProvider implements CnpjProvider {
  name = 'CNPJá';
  priority = 3;
  private baseUrl = 'https://api.cnpja.com';

  async fetch(cnpj: string): Promise<CnpjResponseDto> {
    try {
      const response = await fetch(`${this.baseUrl}/office/${cnpj}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: CnpjaResponse = await response.json();
      return this.mapToDto(data);
    } catch (error) {
      throw new ExternalApiError(
        `Erro ao consultar CNPJá: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        this.name
      );
    }
  }

  private mapToDto(data: CnpjaResponse): CnpjResponseDto {
    return {
      cnpj: data.estabelecimento.cnpj,
      razaoSocial: data.razao_social,
      nomeFantasia: data.estabelecimento.nome_fantasia || null,
      cnae: data.estabelecimento.atividade_principal?.id || null,
      descricaoCnae: data.estabelecimento.atividade_principal?.descricao || null,
      naturezaJuridica: data.natureza_juridica?.descricao || null,
      dataAbertura: data.estabelecimento.data_inicio_atividade || null,
      situacaoCadastral: data.estabelecimento.situacao_cadastral || null,
      dataSituacaoCadastral: data.estabelecimento.data_situacao_cadastral || null,
      capitalSocial: data.capital_social?.toString() || null,
      porte: data.porte?.descricao || null,
      endereco: {
        logradouro: data.estabelecimento.logradouro || null,
        numero: data.estabelecimento.numero || null,
        complemento: data.estabelecimento.complemento || null,
        bairro: data.estabelecimento.bairro || null,
        municipio: data.estabelecimento.cidade?.nome || null,
        uf: data.estabelecimento.estado?.sigla || null,
        cep: data.estabelecimento.cep || null,
      },
      contato: {
        telefone: data.estabelecimento.ddd1 && data.estabelecimento.telefone1
          ? `${data.estabelecimento.ddd1}${data.estabelecimento.telefone1}`
          : null,
        email: data.estabelecimento.email || null,
      },
      socios: data.socios?.map((s) => ({
        nome: s.nome,
        qualificacao: s.qualificacao || null,
        dataEntrada: null,
        cpfCnpj: null,
      })) || null,
      fonte: this.name,
      dataAtualizacao: new Date().toISOString(),
    };
  }
}

/**
 * ReceitaWS - Prioridade 4
 */
export class ReceitaWsProvider implements CnpjProvider {
  name = 'ReceitaWS';
  priority = 4;
  private baseUrl = 'https://www.receitaws.com.br/v1/cnpj';

  async fetch(cnpj: string): Promise<CnpjResponseDto> {
    try {
      const response = await fetch(`${this.baseUrl}/${cnpj}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: ReceitaWsResponse = await response.json();
      
      // ReceitaWS retorna status de erro no corpo
      if ('status' in data && data.status === 'ERROR') {
        throw new Error((data as any).message || 'Erro na API');
      }

      return this.mapToDto(data);
    } catch (error) {
      throw new ExternalApiError(
        `Erro ao consultar ReceitaWS: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        this.name
      );
    }
  }

  private mapToDto(data: ReceitaWsResponse): CnpjResponseDto {
    return {
      cnpj: data.cnpj,
      razaoSocial: data.nome,
      nomeFantasia: data.fantasia || null,
      cnae: data.atividade_principal?.[0]?.code || null,
      descricaoCnae: data.atividade_principal?.[0]?.text || null,
      naturezaJuridica: data.natureza_juridica || null,
      dataAbertura: data.abertura || null,
      situacaoCadastral: data.situacao || null,
      dataSituacaoCadastral: data.data_situacao || null,
      capitalSocial: data.capital_social || null,
      porte: data.porte || null,
      endereco: {
        logradouro: data.logradouro || null,
        numero: data.numero || null,
        complemento: data.complemento || null,
        bairro: data.bairro || null,
        municipio: data.municipio || null,
        uf: data.uf || null,
        cep: data.cep || null,
      },
      contato: {
        telefone: data.telefone || null,
        email: data.email || null,
      },
      socios: data.qsa?.map((s) => ({
        nome: s.nome,
        qualificacao: s.qual || null,
        dataEntrada: null,
        cpfCnpj: null,
      })) || null,
      fonte: this.name,
      dataAtualizacao: new Date().toISOString(),
    };
  }
}

/**
 * Gerenciador de providers com fallback
 */
export class CnpjProviderManager {
  private providers: CnpjProvider[];

  constructor() {
    this.providers = [
      new BrasilApiProvider(),
      new OpenCnpjProvider(),
      new CnpjaProvider(),
      new ReceitaWsProvider(),
    ].sort((a, b) => a.priority - b.priority);
  }

  async fetchWithFallback(cnpj: string): Promise<CnpjResponseDto> {
    const errors: Array<{ provider: string; error: string }> = [];

    for (const provider of this.providers) {
      try {
        console.log(`Tentando ${provider.name}...`);
        const result = await provider.fetch(cnpj);
        console.log(`✓ Sucesso com ${provider.name}`);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error(`✗ Falha em ${provider.name}: ${errorMessage}`);
        errors.push({ provider: provider.name, error: errorMessage });
      }
    }

    throw new ExternalApiError(
      `Todas as APIs falharam ao consultar CNPJ. Detalhes: ${errors.map(e => `${e.provider}: ${e.error}`).join('; ')}`
    );
  }
}
