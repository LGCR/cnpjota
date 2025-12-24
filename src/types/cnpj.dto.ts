// DTO padrão de retorno para consulta de CNPJ
export interface CnpjResponseDto {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  cnae: string | null;
  descricaoCnae: string | null;
  naturezaJuridica: string | null;
  dataAbertura: string | null;
  situacaoCadastral: string | null;
  dataSituacaoCadastral: string | null;
  capitalSocial: number | null;
  porte: string | null;
  endereco: {
    logradouro: string | null;
    numero: string | null;
    complemento: string | null;
    bairro: string | null;
    municipio: string | null;
    uf: string | null;
    cep: string | null;
  };
  contato: {
    telefone: string | null;
    email: string | null;
  };
  socios: Socio[] | null;
  dataAtualizacao: string; // Quando foi atualizado
}

export interface Socio {
  nome: string;
  qualificacao: string | null;
  dataEntrada: string | null;
  cpfCnpj: string | null;
}

// DTOs para as APIs externas
export interface BrasilApiResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  codigo_natureza_juridica: number;
  descricao_natureza_juridica: string;
  data_inicio_atividade: string;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  capital_social: number;
  descricao_porte: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  ddd_telefone_1: string;
  qsa: Array<{
    nome_socio: string;
    codigo_qualificacao_socio: number;
    qualificacao_socio: string;
    data_entrada_sociedade: string;
    identificador_de_socio: number;
    cpf_cnpj_socio: string;
  }>;
}

export interface OpenCnpjResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: string;
  data_situacao_cadastral: string;
  matriz_filial: string;
  data_inicio_atividade: string;
  cnae_principal: string;
  cnaes_secundarios: string[];
  cnaes_secundarios_count: number;
  natureza_juridica: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  uf: string;
  municipio: string;
  email: string;
  telefones: Array<{
    ddd: string;
    numero: string;
    is_fax: boolean;
  }>;
  capital_social: string;
  porte_empresa: string;
  opcao_simples: string | null;
  data_opcao_simples: string | null;
  opcao_mei: string | null;
  data_opcao_mei: string | null;
  QSA: Array<{
    nome_socio: string;
    cnpj_cpf_socio: string;
    qualificacao_socio: string;
    data_entrada_sociedade: string;
    identificador_socio: string;
    faixa_etaria: string;
  }>;
}

export interface CnpjaResponse {
  razao_social: string;
  estabelecimento: {
    cnpj: string;
    nome_fantasia: string;
    tipo: string;
    situacao_cadastral: string;
    data_situacao_cadastral: string;
    data_inicio_atividade: string;
    atividade_principal: {
      id: string;
      secao: string;
      divisao: string;
      grupo: string;
      classe: string;
      subclasse: string;
      descricao: string;
    };
    estado: {
      id: number;
      nome: string;
      sigla: string;
      ibge_id: number;
    };
    cidade: {
      id: number;
      nome: string;
      ibge_id: number;
      siafi_id: string;
    };
    bairro: string;
    cep: string;
    ddd1: string;
    telefone1: string;
    email: string;
    logradouro: string;
    numero: string;
    complemento: string;
  };
  natureza_juridica: {
    id: string;
    descricao: string;
  };
  capital_social: number;
  porte: {
    id: string;
    descricao: string;
  };
  socios: Array<{
    nome: string;
    qualificacao: string;
    pais_id: string;
    representante_legal: string;
    nome_representante: string;
    qualificacao_representante: string;
  }>;
}

export interface ReceitaWsResponse {
  cnpj: string;
  nome: string;
  fantasia: string;
  abertura: string;
  atividade_principal: Array<{
    code: string;
    text: string;
  }>;
  natureza_juridica: string;
  situacao: string;
  data_situacao: string;
  capital_social: string;
  porte: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  qsa: Array<{
    nome: string;
    qual: string;
  }>;
}
