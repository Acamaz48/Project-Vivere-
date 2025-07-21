import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DepositoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { nome_deposito: string; endereco: string }) => void;
  deposito?: {
    nome_deposito: string;
    endereco: string;
  } | null;
}

const DepositoModal = ({ isOpen, onClose, onSave, deposito }: DepositoModalProps) => {
  const [formData, setFormData] = useState({
    nome_deposito: '',
    endereco: ''
  });

  useEffect(() => {
    if (deposito) {
      setFormData({
        nome_deposito: deposito.nome_deposito || '',
        endereco: deposito.endereco || ''
      });
    } else {
      setFormData({
        nome_deposito: '',
        endereco: ''
      });
    }
  }, [deposito, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-vivere-dark">
            {deposito ? 'Editar Depósito' : 'Novo Depósito'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome_deposito" className="text-sm font-medium text-vivere-dark">
              Nome do Depósito *
            </Label>
            <Input
              id="nome_deposito"
              value={formData.nome_deposito}
              onChange={(e) => setFormData(prev => ({ ...prev, nome_deposito: e.target.value }))}
              className="mt-1 focus:border-vivere-red focus:ring-vivere-red"
              placeholder="Ex: Maricá, São Gonçalo"
              required
            />
          </div>

          <div>
            <Label htmlFor="endereco" className="text-sm font-medium text-vivere-dark">
              Endereço *
            </Label>
            <Textarea
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
              className="mt-1 focus:border-vivere-red focus:ring-vivere-red"
              placeholder="Endereço completo do depósito"
              rows={3}
              required
            />
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
              {deposito ? 'Salvar Alterações' : 'Criar Depósito'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DepositoModal;
