import type { Material, Deposito, EstoquePorDeposito, Evento, AlocacaoMaterial } from '@/types';

const BASE_URL = "http://192.168.15.21:5000/api";

// --------------------- DEPÓSITOS ---------------------

export const getDepositos = async (): Promise<Deposito[]> => {
  const res = await fetch(`${BASE_URL}/depositos`);
  if (!res.ok) throw new Error("Erro ao buscar depósitos");
  const data = await res.json();
  return data.map((item: any) => ({
    id: item.id.toString(),
    nome_deposito: item.nome_deposito,
    endereco: item.endereco,
  }));
};

export const postDeposito = async (deposito: { nome_deposito: string; endereco: string; }): Promise<Deposito> => {
  const res = await fetch(`${BASE_URL}/depositos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deposito),
  });
  if (!res.ok) throw new Error("Erro ao criar depósito");
  const data = await res.json();
  return {
    id: data.id.toString(),
    nome_deposito: data.nome_deposito,
    endereco: data.endereco,
  };
};

export const putDeposito = async (id: string, deposito: { nome_deposito: string; endereco: string; }): Promise<Deposito> => {
  const res = await fetch(`${BASE_URL}/depositos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deposito),
  });
  if (!res.ok) throw new Error("Erro ao atualizar depósito");
  const data = await res.json();
  return {
    id: data.id.toString(),
    nome_deposito: data.nome_deposito,
    endereco: data.endereco,
  };
};

// --------------------- MATERIAIS ---------------------

export const getMateriais = async (): Promise<Material[]> => {
  const res = await fetch(`${BASE_URL}/materiais`);
  if (!res.ok) throw new Error("Erro ao buscar materiais");
  const data = await res.json();

  return data.map((item: any) => ({
    id: item.id.toString(),
    nome_item: item.nome_item || item.material,
    categoria: item.categoria,
  }));
};

// --------------------- ESTOQUE ---------------------

export const getEstoque = async (): Promise<EstoquePorDeposito[]> => {
  const res = await fetch(`${BASE_URL}/estoque`);
  if (!res.ok) throw new Error("Erro ao buscar estoque");
  const data = await res.json();

  return data.map((item: any) => ({
    ...item,
    id: item.id.toString(),
    material_id: item.material_id?.toString(),
    deposito_id: item.deposito_id?.toString(),
    quantidade_disponivel: Number(item.quantidade_disponivel),
  }));
};

// --------------------- EVENTOS ---------------------

export const getEventos = async (): Promise<Evento[]> => {
  const res = await fetch(`${BASE_URL}/eventos`);
  if (!res.ok) throw new Error("Erro ao buscar eventos");
  const data = await res.json();

  return data.map((item: any) => ({
    id: item.id.toString(),
    nome_evento: item.nome_evento,
    cliente: item.cliente,
    data_inicio: item.data_inicio,
    data_fim: item.data_fim,
    status: item.status,
  }));
};

export const postEvento = async (evento: { nome_evento: string; cliente: string; status?: string; data_inicio: string; data_fim: string; }): Promise<Evento> => {
  const res = await fetch(`${BASE_URL}/eventos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(evento),
  });
  if (!res.ok) throw new Error("Erro ao criar evento");
  const data = await res.json();
  return {
    id: data.id.toString(),
    nome_evento: data.nome_evento,
    cliente: data.cliente,
    data_inicio: data.data_inicio,
    data_fim: data.data_fim,
    status: data.status,
  };
};

export const putEvento = async (id: string, evento: { nome_evento: string; cliente: string; status: string; data_inicio: string; data_fim: string; }): Promise<Evento> => {
  const res = await fetch(`${BASE_URL}/eventos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(evento),
  });
  if (!res.ok) throw new Error("Erro ao atualizar evento");
  const data = await res.json();
  return {
    id: data.id.toString(),
    nome_evento: data.nome_evento,
    cliente: data.cliente,
    data_inicio: data.data_inicio,
    data_fim: data.data_fim,
    status: data.status,
  };
};

// --------------------- ALOCAÇÕES ---------------------

export const getAlocacoes = async (): Promise<AlocacaoMaterial[]> => {
  const res = await fetch(`${BASE_URL}/alocacoes`);
  if (!res.ok) throw new Error("Erro ao buscar alocações");
  const data = await res.json();

  return data.map((item: any) => ({
    ...item,
    id: item.id.toString(),
    evento_id: item.evento_id.toString(),
    material_id: item.material_id.toString(),
    deposito_id: item.deposito_id.toString(),
    quantidade_alocada: Number(item.quantidade_alocada),
  }));
};

export const postAlocacao = async (alocacao: { material: string; deposito: string; quantidade: number; observacao?: string; }): Promise<AlocacaoMaterial> => {
  const res = await fetch(`${BASE_URL}/alocacoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alocacao),
  });
  if (!res.ok) throw new Error("Erro ao criar alocação");
  const data = await res.json();
  return {
    ...data,
    id: data.id.toString(),
  };
};
