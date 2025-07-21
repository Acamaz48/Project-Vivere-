
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  material?: any;
}

const MaterialModal = ({ isOpen, onClose, onSave, material }: MaterialModalProps) => {
  const [formData, setFormData] = useState({
    nome_item: '',
    categoria: ''
  });

  useEffect(() => {
    if (material) {
      setFormData({
        nome_item: material.nome_item || '',
        categoria: material.categoria || ''
      });
    } else {
      setFormData({
        nome_item: '',
        categoria: ''
      });
    }
  }, [material]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-vivere-dark">
            {material ? 'Editar Material' : 'Novo Material'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome_item" className="text-sm font-medium text-vivere-dark">
              Nome do Item *
            </Label>
            <Input
              id="nome_item"
              value={formData.nome_item}
              onChange={(e) => setFormData(prev => ({ ...prev, nome_item: e.target.value }))}
              className="mt-1 focus:border-vivere-red focus:ring-vivere-red"
              placeholder="Ex: Cadeira de Plástico Branca"
              required
            />
          </div>

          <div>
            <Label htmlFor="categoria" className="text-sm font-medium text-vivere-dark">
              Categoria *
            </Label>
            <Input
              id="categoria"
              value={formData.categoria}
              onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
              className="mt-1 focus:border-vivere-red focus:ring-vivere-red"
              placeholder="Ex: Mobiliário, Iluminação, Som"
              required
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Adicionar um material aqui apenas o torna disponível no catálogo. 
              O estoque deve ser gerenciado pelos gestores em cada depósito.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-vivere-red hover:bg-red-700 text-white"
            >
              {material ? 'Salvar Alterações' : 'Adicionar Material'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialModal;
