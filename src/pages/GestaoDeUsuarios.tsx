import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash } from 'lucide-react';

interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  tipo: string;
}

const GestaoDeUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [novoUsuario, setNovoUsuario] = useState<Usuario>({
    nome: '',
    email: '',
    senha: '',
    tipo: 'comum',
  });

  const carregarUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios');
      if (!res.ok) throw new Error('Erro ao carregar');
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar usuários',
        variant: 'destructive',
      });
    }
  };

  const salvarUsuario = async () => {
    if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.senha) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario),
      });
      if (!res.ok) throw new Error('Erro ao salvar');
      toast({ title: 'Sucesso', description: 'Usuário criado com sucesso!' });
      setNovoUsuario({ nome: '', email: '', senha: '', tipo: 'comum' });
      carregarUsuarios();
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar usuário',
        variant: 'destructive',
      });
    }
  };

  const excluirUsuario = async (id?: number) => {
    if (!id) return;
    if (!confirm('Tem certeza que deseja remover este usuário?')) return;

    try {
      const res = await fetch(`/api/usuarios?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir');
      toast({ title: 'Usuário removido' });
      carregarUsuarios();
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir usuário',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Usuários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Nome"
              value={novoUsuario.nome}
              onChange={e => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={novoUsuario.email}
              onChange={e => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
            />
            <Input
              placeholder="Senha"
              type="password"
              value={novoUsuario.senha}
              onChange={e => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
            />
            <select
              className="border rounded px-2 py-1"
              aria-label="Tipo de usuário"
              value={novoUsuario.tipo}
              onChange={e => setNovoUsuario({ ...novoUsuario, tipo: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="gestor">Gestor</option>
              <option value="comum">Comum</option>
            </select>
          </div>
          <Button
            onClick={salvarUsuario}
            className="bg-vivere-red hover:bg-red-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> Cadastrar Usuário
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.tipo}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => excluirUsuario(usuario.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestaoDeUsuarios;
