
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { Plus, Minus } from 'lucide-react';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemName: string;
  currentQuantity: number;
}

const AdjustStockModal = ({ isOpen, onClose, itemId, itemName, currentQuantity }: AdjustStockModalProps) => {
  const [type, setType] = useState<'entrada' | 'saida'>('entrada');
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      toast({
        title: "Erro",
        description: "O motivo é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (quantity <= 0) {
      toast({
        title: "Erro",
        description: "A quantidade deve ser maior que zero",
        variant: "destructive"
      });
      return;
    }

    if (type === 'saida' && quantity > currentQuantity) {
      toast({
        title: "Erro",
        description: "Quantidade de saída não pode ser maior que o estoque atual",
        variant: "destructive"
      });
      return;
    }

    // Simular atualização do estoque
    const newQuantity = type === 'entrada' 
      ? currentQuantity + quantity 
      : currentQuantity - quantity;

    toast({
      title: "Estoque atualizado",
      description: `${itemName}: ${currentQuantity} → ${newQuantity} unidades`,
    });

    // Resetar formulário e fechar modal
    setQuantity(0);
    setReason('');
    setType('entrada');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-vivere-dark">
            Ajustar Estoque - {itemName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-vivere-light-gray p-3 rounded-lg">
            <p className="text-sm text-gray-600">Estoque Atual</p>
            <p className="text-lg font-semibold text-vivere-red">{currentQuantity} unidades</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-vivere-dark mb-3 block">
              Tipo de Movimentação
            </Label>
            <RadioGroup 
              value={type} 
              onValueChange={(value) => setType(value as 'entrada' | 'saida')}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-green-50">
                <RadioGroupItem value="entrada" id="entrada" />
                <Label htmlFor="entrada" className="flex items-center cursor-pointer">
                  <Plus className="w-4 h-4 mr-2 text-green-600" />
                  Entrada
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-red-50">
                <RadioGroupItem value="saida" id="saida" />
                <Label htmlFor="saida" className="flex items-center cursor-pointer">
                  <Minus className="w-4 h-4 mr-2 text-red-600" />
                  Saída
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="quantity" className="text-sm font-medium text-vivere-dark">
              Quantidade
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity || ''}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="mt-1 focus:border-vivere-red focus:ring-vivere-red"
              placeholder="Digite a quantidade"
              required
            />
          </div>

          <div>
            <Label htmlFor="reason" className="text-sm font-medium text-vivere-dark">
              Motivo *
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 focus:border-vivere-red focus:ring-vivere-red"
              placeholder="Ex: Compra, Devolução, Perda, Dano, etc."
              rows={3}
              required
            />
          </div>

          {quantity > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Novo Estoque:</strong> {
                  type === 'entrada' 
                    ? currentQuantity + quantity 
                    : currentQuantity - quantity
                } unidades
              </p>
            </div>
          )}

          <div className="flex space-x-3">
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
              Confirmar Ajuste
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdjustStockModal;
