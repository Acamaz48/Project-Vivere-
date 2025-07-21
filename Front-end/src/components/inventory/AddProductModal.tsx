import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { getMateriais } from '@/services/api';

interface Material {
  id: string;
  nome_item: string;
  categoria: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductModal = ({ isOpen, onClose }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    material_id: '',
    quantidade: 0,
    observacao: ''
  });

  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getMateriais()
        .then((data) => setMateriais(data))
        .catch((err) => {
          console.error('Erro ao buscar materiais:', err);
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar os materiais',
            variant: 'destructive'
          });
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.material_id || formData.quantidade <= 0) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios corretamente.',
        variant: 'destructive'
      });
      return;
    }

    const selectedMaterial = materiais.find(
      (m) => m.id === formData.material_id
    );

    try {
      setSubmitting(true);

      const res = await fetch('http://localhost:5000/api/estoque', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          material_id: formData.material_id,
          quantidade: formData.quantidade,
          observacao: formData.observacao
        })
      });

      if (!res.ok) {
        throw new Error('Erro ao adicionar produto ao estoque');
      }

      toast({
        title: 'Sucesso',
        description: `${formData.quantidade} unidades de "${selectedMaterial?.nome_item}" adicionadas ao inventário`
      });

      setFormData({ material_id: '', quantidade: 0, observacao: '' });
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        description: 'Falha ao adicionar produto ao inventário',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-vivere-dark">
            Adicionar Produto ao Inventário
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="material" className="text-sm font-medium text-vivere-dark">
              Material *
            </Label>
            <Select
              value={formData.material_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, material_id: value }))
              }
              disabled={loading || submitting}
            >
              <SelectTrigger className="mt-1 focus:border-vivere-red focus:ring-vivere-red">
                <SelectValue placeholder={loading ? "Carregando materiais..." : "Selecione um material"} />
              </SelectTrigger>
              <SelectContent>
                {materiais.map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.nome_item} - {material.categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantidade" className="text-sm font-medium text-vivere-dark">
              Quantidade *
            </Label>
            <Input
              id="quantidade"
              type="number"
              min="1"
              value={formData.quantidade || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quantidade: parseInt(e.target.value) || 0
                }))
              }
              className="mt-1 focus:border-vivere-red focus:ring-vivere-red"
              placeholder="Digite a quantidade"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <Label htmlFor="observacao" className="text-sm font-medium text-vivere-dark">
              Observação
            </Label>
            <Textarea
              id="observacao"
              value={formData.observacao}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, observacao: e.target.value }))
              }
              className="mt-1 focus:border-vivere-red focus:ring-vivere-red"
              placeholder="Ex: Nota fiscal, fornecedor, etc."
              rows={3}
              disabled={submitting}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-vivere-red hover:bg-red-700 text-white"
              disabled={submitting}
            >
              {submitting ? 'Adicionando...' : 'Adicionar ao Estoque'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
