import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface AlocacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { material: string; categoria: string; depositoId: number; quantidade: number }) => void;
  initialData?: {
    material: string;
    categoria: string;
    depositoId: number;
    quantidade: number;
  } | null;
}

const AlocacaoModal: React.FC<AlocacaoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [material, setMaterial] = useState(initialData?.material || "");
  const [categoria, setCategoria] = useState(initialData?.categoria || "");
  const [depositoId, setDepositoId] = useState<number | "">(
    initialData?.depositoId || ""
  );
  const [quantidade, setQuantidade] = useState<number>(initialData?.quantidade || 0);
  const [loading, setLoading] = useState(false);
  const [depositos, setDepositos] = useState<{ id: number; nome_deposito: string }[]>([]);
  const [materiais, setMateriais] = useState<string[]>([]);

  useEffect(() => {
    setMaterial(initialData?.material || "");
    setCategoria(initialData?.categoria || "");
    setDepositoId(initialData?.depositoId || "");
    setQuantidade(initialData?.quantidade || 0);
  }, [initialData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/depositos")
        .then((res) => res.json())
        .then((data) => setDepositos(data))
        .catch(() => {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Falha ao carregar depósitos",
          });
        });

      fetch("/api/materiais")
        .then((res) => res.json())
        .then((data) => setMateriais(data.map((item: any) => item.nome_item)))
        .catch(() => {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Falha ao carregar materiais",
          });
        });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!material.trim() || !categoria.trim() || !depositoId || quantidade <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos corretamente.",
      });
      return;
    }

    setLoading(true);
    onSave({ material, categoria, depositoId: Number(depositoId), quantidade });
    setLoading(false);
  };

  const filteredMateriais = materiais.filter((m) => m.toLowerCase().includes(material.toLowerCase()));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Alocação" : "Nova Alocação"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-vivere-dark">Material *</label>
            <Input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="Nome do material"
              disabled={loading}
              required
              list="materiais-list"
            />
            <datalist id="materiais-list">
              {filteredMateriais.map((m, i) => (
                <option key={i} value={m} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-vivere-dark">Categoria *</label>
            <Input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Categoria do material"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-vivere-dark">Depósito *</label>
            <Select
              onValueChange={(value) => setDepositoId(Number(value))}
              value={depositoId === "" ? undefined : String(depositoId)}
              disabled={loading}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um depósito" />
              </SelectTrigger>
              <SelectContent>
                {depositos.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.nome_deposito}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-vivere-dark">Quantidade *</label>
            <Input
              type="number"
              min={1}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              disabled={loading}
              required
            />
          </div>

          <DialogFooter className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : initialData ? "Salvar Alterações" : "Criar Alocação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AlocacaoModal;
