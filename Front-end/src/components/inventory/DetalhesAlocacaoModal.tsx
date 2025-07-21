import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DetalhesAlocacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  alocacao: {
    material: string;
    categoria: string;
    quantidade: number;
    deposito: string;
    data_alocacao?: string;
    observacao?: string;
  } | null;
}

const DetalhesAlocacaoModal: React.FC<DetalhesAlocacaoModalProps> = ({
  isOpen,
  onClose,
  alocacao,
}) => {
  if (!alocacao) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Alocação</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm text-gray-700">
          <div>
            <strong>Material:</strong> {alocacao.material}
          </div>
          <div>
            <strong>Categoria:</strong> {alocacao.categoria}
          </div>
          <div>
            <strong>Quantidade:</strong> {alocacao.quantidade}
          </div>
          <div>
            <strong>Depósito:</strong> {alocacao.deposito}
          </div>
          {alocacao.data_alocacao && (
            <div>
              <strong>Data:</strong> {new Date(alocacao.data_alocacao).toLocaleDateString()}
            </div>
          )}
          {alocacao.observacao && (
            <div>
              <strong>Observação:</strong> {alocacao.observacao}
            </div>
          )}
        </div>
        <DialogFooter className="pt-4">
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesAlocacaoModal;
