import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import AdjustStockModal from '@/components/inventory/AdjustStockModal';
import AddProductModal from '@/components/inventory/AddProductModal';

interface InventarioItem {
  id: number; // ✅ necessário para key
  categoria: string;
  material: string;
  quantidade: number;
}

const Inventario = () => {
  const { isAdmin, isGestor } = useAuth();

  const [inventario, setInventario] = useState<InventarioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventarioItem | null>(null);

  async function loadInventario() {
    setLoading(true);
    try {
      // Aqui: fetch sem host para usar proxy do vite
      const res = await fetch('/api/inventario');
      if (!res.ok) throw new Error('Erro ao buscar inventário');
      const data: InventarioItem[] = await res.json();
      setInventario(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Falha ao carregar inventário.',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventario();
  }, []);

  const inventarioFiltrado = inventario.filter(item => {
    const mat = item.material?.toLowerCase() ?? '';
    const cat = item.categoria?.toLowerCase() ?? '';
    const term = searchTerm.toLowerCase();
    return mat.includes(term) || cat.includes(term);
  });

  const handleAdjustStock = (item: InventarioItem) => {
    setSelectedItem(item);
    setAdjustModalOpen(true);
  };

  const getStatusBadge = (quantidade: number) => {
    if (quantidade === 0) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Sem Estoque</Badge>;
    }
    if (quantidade < 10) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Estoque Baixo</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800 border-green-200">Disponível</Badge>;
  };

  if (loading) return <div>Carregando inventário...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="vivere-title">VISÃO DE ESTOQUE</h1>
          <p className="text-gray-600">
            {isAdmin() ? 'Gerenciamento completo do inventário' : 'Inventário do seu depósito'}
          </p>
        </div>
        {isGestor() && (
          <Button
            onClick={() => setAddProductModalOpen(true)}
            className="bg-vivere-red hover:bg-red-700 text-vivere-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto ao Inventário
          </Button>
        )}
      </div>

      {/* Filtros */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="vivere-subtitle">FILTROS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por material ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus:border-vivere-red focus:ring-vivere-red"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Estoque */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="vivere-subtitle">INVENTÁRIO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-vivere-light-gray">
                  <TableHead className="font-bold text-vivere-dark">Material</TableHead>
                  <TableHead className="font-bold text-vivere-dark">Categoria</TableHead>
                  <TableHead className="font-bold text-vivere-dark">Quantidade</TableHead>
                  <TableHead className="font-bold text-vivere-dark">Status</TableHead>
                  <TableHead className="font-bold text-vivere-dark">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventarioFiltrado.length > 0 ? (
                  inventarioFiltrado.map((item) => (
                    <TableRow key={item.id} className="hover:bg-vivere-light-gray">
                      <TableCell className="font-medium text-vivere-dark">{item.material}</TableCell>
                      <TableCell className="text-gray-600">{item.categoria}</TableCell>
                      <TableCell>
                        <span className="text-lg font-semibold text-vivere-red">{item.quantidade}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.quantidade)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {isAdmin() ? (
                            <span className="text-sm text-gray-500 italic">Somente consulta</span>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleAdjustStock(item)}
                              className="bg-vivere-red hover:bg-red-700 text-white"
                            >
                              <Settings className="w-3 h-3 mr-1" />
                              Ajustar Estoque
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-2" />
                      Nenhum item encontrado. Ajuste os filtros.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modais */}
      {selectedItem && (
        <AdjustStockModal
          isOpen={adjustModalOpen}
          onClose={() => {
            setAdjustModalOpen(false);
            setSelectedItem(null);
            loadInventario();
          }}
          itemId={selectedItem.material}
          itemName={selectedItem.material}
          currentQuantity={selectedItem.quantidade}
        />
      )}

      <AddProductModal
        isOpen={addProductModalOpen}
        onClose={() => {
          setAddProductModalOpen(false);
          loadInventario();
        }}
      />
    </div>
  );
};

export default Inventario;
