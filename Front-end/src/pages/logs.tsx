import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Log {
  id: number;
  usuario: string;
  acao: string;
  descricao: string;
  rota_afetada: string;
  data_hora: string;
}

const TelaDeLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    axios.get('/api/logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error('Erro ao carregar logs:', err));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="vivere-title">LOGS DO SISTEMA</h1>
      <p className="text-gray-600">Registro de ações realizadas por usuários no sistema</p>

      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="vivere-subtitle">Histórico de Auditoria</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Rota Afetada</TableHead>
                <TableHead>Data/Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>{log.usuario}</TableCell>
                  <TableCell>{log.acao}</TableCell>
                  <TableCell>{log.descricao}</TableCell>
                  <TableCell>{log.rota_afetada}</TableCell>
                  <TableCell>{new Date(log.data_hora).toLocaleString('pt-BR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelaDeLogs;
