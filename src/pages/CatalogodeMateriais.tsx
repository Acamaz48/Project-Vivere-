import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import MaterialModal from '@/components/configuracoes/MaterialModal';

const CatalogoDeMateriais = () => {
  const [materiais, setMateriais] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/materiais')
      .then(res => res.json())
      .then(data => {
        setMateriais(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar materiais:', err);
        setLoading(false);
      });
  }, []);

  const filteredMateriais = materiais.filter(material => {
    const nome = material.material ?? "";     // aqui: mudou para "material"
    const categoria = material.categoria ?? "";
    const termo = searchTerm.toLowerCase();

    return nome.toLowerCase().includes(termo) || categoria.toLowerCase().includes(termo);
  });

  const handleAdd = () => {
    setEditingMaterial(null);
    setModalOpen(true);
  };

  const handleEdit = (material: any) => {
    setEditingMaterial(material);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/materiais/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMateriais(prev => prev.filter(m => m.id !== id));
        toast({ title: 'Material removido', description: 'O material foi excluído com sucesso' });
      } else {
        toast({ title: 'Erro', description: 'Não foi possível excluir o material', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Erro ao deletar material:', err);
      toast({ title: 'Erro', description: 'Falha na comunicação com o servidor', variant: 'destructive' });
    }
  };

  const handleSave = async (materialData: any) => {
    if (editingMaterial) {
      try {
        const res = await fetch(`/api/materiais/${editingMaterial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(materialData),
        });
        const atualizado = await res.json();

        setMateriais(prev => prev.map(m => m.id === atualizado.id ? atualizado : m));
        toast({ title: 'Material atualizado', description: 'Informações salvas com sucesso' });
      } catch (err) {
        toast({ title: 'Erro', description: 'Erro ao atualizar material', variant: 'destructive' });
      }
    } else {
      try {
        const res = await fetch(`/api/materiais`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(materialData),
        });
        const novo = await res.json();

        setMateriais(prev => [...prev, novo]);
        toast({ title: 'Material adicionado', description: 'Novo material cadastrado' });
      } catch (err) {
        toast({ title: 'Erro', description: 'Erro ao criar material', variant: 'destructive' });
      }
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="vivere-title">CATÁLOGO DE MATERIAIS</h1>
          <p className="text-gray-600">Gerencie o catálogo mestre de produtos</p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-vivere-red hover:bg-red-700 text-vivere-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Material
        </Button>
      </div>

      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="vivere-subtitle">FILTROS</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por nome do material ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:border-vivere-red focus:ring-vivere-red"
          />
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="vivere-subtitle">MATERIAIS CADASTRADOS</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-sm">Carregando materiais...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-vivere-light-gray">
                    <TableHead className="font-bold text-vivere-dark">Nome do Item</TableHead>
                    <TableHead className="font-bold text-vivere-dark">Categoria</TableHead>
                    <TableHead className="font-bold text-vivere-dark">Status</TableHead>
                    <TableHead className="font-bold text-vivere-dark">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMateriais.map((material) => (
                    <TableRow key={material.id} className="hover:bg-vivere-light-gray">
                      <TableCell className="font-medium text-vivere-dark">
                        {material.material} {/* corrigido aqui */}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {material.categoria}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(material)}
                            className="border-vivere-red text-vivere-red hover:bg-vivere-red hover:text-white"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(material.id)}
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

              {filteredMateriais.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum material encontrado</h3>
                  <p className="text-gray-500">Ajuste os filtros ou adicione novos materiais</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <MaterialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        material={editingMaterial}
      />
    </div>
  );
};

export default CatalogoDeMateriais;
