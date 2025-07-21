import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AlocacaoModal from "@/components/inventory/AlocacaoModal";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

const GestaoAlocacoes = () => {
  const [alocacoes, setAlocacoes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAlocacao, setEditingAlocacao] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/alocacoes")
      .then((res) => res.json())
      .then((data) => {
        setAlocacoes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    setEditingAlocacao(null);
    setModalOpen(true);
  };

  const handleEdit = (alocacao: any) => {
    setEditingAlocacao(alocacao);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/alocacoes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAlocacoes((prev) => prev.filter((a) => a.id !== id));
        toast({ title: "Alocação excluída com sucesso" });
      } else {
        toast({ title: "Erro ao excluir", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const handleSave = async (data: { material: string; depositoId: number; quantidade: number }) => {
    try {
      let res, json;
      if (editingAlocacao) {
        res = await fetch(`/api/alocacoes/${editingAlocacao.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        json = await res.json();
        setAlocacoes((prev) =>
          prev.map((a) => (a.id === json.id ? json : a))
        );
        toast({ title: "Alocação atualizada" });
      } else {
        res = await fetch("/api/alocacoes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        json = await res.json();
        setAlocacoes((prev) => [...prev, json]);
        toast({ title: "Alocação criada" });
      }
      setModalOpen(false);
    } catch {
      toast({ title: "Erro ao salvar alocação", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="vivere-title">GESTÃO DE ALOCAÇÕES</h1>
        <Button
          onClick={handleAdd}
          className="bg-vivere-red hover:bg-red-700 text-vivere-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Alocação
        </Button>
      </div>

      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="vivere-subtitle">Alocações Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-sm">Carregando alocações...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-vivere-light-gray">
                  <TableHead className="font-bold text-vivere-dark">Material</TableHead>
                  <TableHead className="font-bold text-vivere-dark">Depósito</TableHead>
                  <TableHead className="font-bold text-vivere-dark">Quantidade</TableHead>
                  <TableHead className="font-bold text-vivere-dark">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alocacoes.map((a: any) => (
                  <TableRow key={a.id} className="hover:bg-vivere-light-gray">
                    <TableCell className="font-medium text-vivere-dark">{a.material}</TableCell>
                    <TableCell className="text-gray-600">{a.nome_deposito}</TableCell>
                    <TableCell>{a.quantidade}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(a)}
                          className="border-vivere-red text-vivere-red hover:bg-vivere-red hover:text-white"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(a.id)}
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

      <AlocacaoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingAlocacao}
      />
    </div>
  );
};

export default GestaoAlocacoes;
