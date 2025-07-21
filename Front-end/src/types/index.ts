export interface Deposito {
  id: string;
  nome_deposito: string;
  endereco: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  perfil: 'Administrador' | 'Gestor de Depósito';
  deposito_id?: string;
}

export interface Material {
  id: string;
  nome_item: string;      // <-- corresponde a "material" no back, tratado no api.ts
  categoria: string;
}

export interface EstoquePorDeposito {
  id: string;
  material_id: string;
  deposito_id: string;
  quantidade_disponivel: number;
  material?: Material;
  deposito?: Deposito;
}

export interface Evento {
  id: string;
  nome_evento: string;
  cliente: string;
  data_inicio: string;
  data_fim: string;
  status: 'Confirmado' | 'Em Andamento' | 'Finalizado' | 'Cancelado' | string;
}

export interface AlocacaoMaterial {
  id: string;
  evento_id: string;
  material_id: string;
  deposito_id: string;
  quantidade_alocada: number;
  evento?: Evento;
  material?: Material;
  deposito?: Deposito;
}

export interface EventoCompleto extends Evento {
  alocacoes: AlocacaoMaterial[];
}
