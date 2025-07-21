import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AlocacaoModal from '@/components/inventory/AlocacaoModal';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import DepositoModal from '@/components/configuracoes/DepositoModal';
import DetalhesAlocacaoModal from '@/components/inventory/DetalhesAlocacaoModal';

const GestaoDepositos = () => {
  const [depositos, setDepositos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAlocacaoOpen, setModalAlocacaoOpen] = useState(false);
  const [editingDeposito, setEditingDeposito] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [alocacoesSelecionadas, setAlocacoesSelecionadas] = useState([]);

  useEffect(() => {
    fetch('/api/depositos')
      .then(res => res.json())
      .then(data => {
        setDepositos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar depósitos:', err);
        setLoading(false);
        toast({
          title: 'Erro',
          description: 'Falha ao carregar depósitos',
          variant: 'destructive',
        });
      });
  }, []);

  const handleAdd = () => {
    setEditingDeposito(null);
    setModalOpen(true);
  };

  const handleEdit = (deposito: any) => {
    setEditingDeposito(deposito);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    toast({
      title: 'Aviso',
      description: 'Não é possível excluir depósitos com estoque ativo ou eventos associados',
      variant: 'destructive',
    });
  };

  const handleSave = async (depositoData: any) => {
    if (editingDeposito) {
      try {
        const res = await fetch(`/api/depositos/${editingDeposito.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(depositoData),
        });
        if (!res.ok) throw new Error('Erro na atualização');
        const updated = await res.json();
        setDepositos(prev => prev.map(d => d.id === updated.id ? updated : d));
        toast({ title: 'Depósito atualizado', description: 'Informações salvas com sucesso' });
      } catch {
        toast({ title: 'Erro', description: 'Falha ao atualizar depósito', variant: 'destructive' });
      }
    } else {
      try {
        const res = await fetch(`/api/depositos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(depositoData),
        });
        if (!res.ok) throw new Error('Erro na criação');
        const novo = await res.json();
        setDepositos(prev => [...prev, novo]);
        toast({ title: 'Depósito criado', description: 'Novo depósito adicionado' });
      } catch {
        toast({ title: 'Erro', description: 'Falha ao criar depósito', variant: 'destructive' });
      }
    }
    setModalOpen(false);
  };

  const handleSaveAlocacao = async (alocacaoData: { material: string; depositoId: number; quantidade: number; categoria: string }) => {
    try {
      const res = await fetch('/api/alocacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alocacaoData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro desconhecido');
      }
      toast({ title: 'Alocação salva', description: 'Material alocado com sucesso' });
      setModalAlocacaoOpen(false);
    } catch (error: any) {
      toast({ title: 'Erro', description: `Falha ao salvar alocação: ${error.message}`, variant: 'destructive' });
    }
  };

  const handleVerAlocacoes = async (depositoId: number) => {
    try {
      const res = await fetch('/api/alocacoes');
      const todas = await res.json();
      const filtradas = todas.filter((a: any) => a.deposito_id === depositoId || a.depositoId === depositoId || a.deposito === depositoId);
      setAlocacoesSelecionadas(filtradas);
      setModalDetalhesOpen(true);
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao buscar alocações', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="vivere-title">GESTÃO DE DEPÓSITOS</h1>
          <p className="text-gray-600">Gerencie os depósitos da empresa</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAdd}
            className="bg-vivere-red hover:bg-red-700 text-vivere-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Depósito
          </Button>

          <Button
            variant="outline"
            onClick={() => setModalAlocacaoOpen(true)}
            className="text-vivere-dark border-vivere-dark"
          >
            Alocar Material
          </Button>
        </div>
      </div>

      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="vivere-subtitle">DEPÓSITOS CADASTRADOS</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-sm">Carregando depósitos...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-vivere-light-gray">
                  <TableHead className="font-bold text-vivere-dark">Nome do Depósito</TableHead>
                  <TableHead className="font-bold text-vivere-dark">Endereço</TableHead>
                  <TableHead className="font-bold text-vivere-dark">Status</TableHead>
                  <TableHead className="font-bold text-vivere-dark">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depositos.map((deposito: any) => (
                  <TableRow key={deposito.id} className="hover:bg-vivere-light-gray">
                    <TableCell className="font-medium text-vivere-dark cursor-pointer" onClick={() => handleVerAlocacoes(deposito.id)}>
                      {deposito.nome_deposito}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {deposito.endereco}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(deposito)}
                          className="border-vivere-red text-vivere-red hover:bg-vivere-red hover:text-white"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(deposito.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DepositoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        deposito={editingDeposito}
      />

      <AlocacaoModal
        isOpen={modalAlocacaoOpen}
        onClose={() => setModalAlocacaoOpen(false)}
        onSave={handleSaveAlocacao}
      />

      <DetalhesAlocacaoModal
        isOpen={modalDetalhesOpen}
        onClose={() => setModalDetalhesOpen(false)}
        alocacoes={alocacoesSelecionadas}
      />
    </div>
  );
};

export default GestaoDepositos;
