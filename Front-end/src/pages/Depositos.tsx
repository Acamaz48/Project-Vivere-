import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Deposito {
  id: number;
  nome: string;
  localizacao: string;
}

const Depositos = () => {
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/depositos")
      .then((res) => res.json())
      .then((data) => {
        setDepositos(data);
      })
      .catch((err) => {
        console.error("Erro ao carregar depósitos:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os depósitos",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Depósitos Cadastrados</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <ul className="space-y-2">
            {depositos.map((d) => (
              <li key={d.id} className="border p-2 rounded">
                <strong>{d.nome}</strong> - {d.localizacao}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default Depositos;
