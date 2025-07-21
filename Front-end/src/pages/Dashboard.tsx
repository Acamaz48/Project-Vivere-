import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Package, Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EventCalendar from '@/components/dashboard/EventCalendar';

const Dashboard = () => {
  const { isAdmin, usuario } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [depositos, setDepositos] = useState([]);
  const [alocacoes, setAlocacoes] = useState([]);

  useEffect(() => {
    fetch('/api/eventos').then(res => res.json()).then(setEventos);
    fetch('/api/estoque').then(res => res.json()).then(setEstoque);
    fetch('/api/depositos').then(res => res.json()).then(setDepositos);
    fetch('/api/alocacoes').then(res => res.json()).then(setAlocacoes);
  }, []);

  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const eventosAtivos = eventos.filter(e => e.status === 'Confirmado' || e.status === 'Em Andamento').length;

  const novasSolicitacoesMes = eventos.filter(e => {
    const data = new Date(e.data_inicio);
    return data >= inicioMes && data <= hoje;
  }).length;

  const eventosAPreparar = alocacoes.filter(aloc => {
    const evento = eventos.find(e => e.id === aloc.evento_id);
    return aloc.deposito_id === usuario?.deposito_id && evento && new Date(evento.data_inicio) > hoje;
  }).length;

  const itensEmBaixoEstoque = estoque.filter(e => 
    e.deposito_id === usuario?.deposito_id && e.quantidade_disponivel < 10
  ).length;

  const totalMateriais = estoque
    .filter(e => e.deposito_id === usuario?.deposito_id)
    .reduce((acc, item) => acc + item.quantidade_disponivel, 0);

  const eventosCalendario = isAdmin() 
    ? eventos 
    : eventos.filter(evento => 
        alocacoes.some(a => 
          a.evento_id === evento.id && 
          a.deposito_id === usuario?.deposito_id
        )
      );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="vivere-title">DASHBOARD</h1>
        <p className="text-gray-600">
          {isAdmin() ? 'Visão geral das operações da Vivere Entretenimento' : 'Visão operacional do depósito'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin() ? (
          <>
            <DashboardCard title="Eventos Ativos" icon={<CheckCircle />} value={eventosAtivos} />
            <DashboardCard title="Novas Solicitações (Mês)" icon={<Calendar />} value={novasSolicitacoesMes} />
            <DashboardCard title="Depósitos" icon={<Users />} value={depositos.length} />
            <DashboardCard title="Taxa de Ocupação" icon={<TrendingUp />} value="85%" />
          </>
        ) : (
          <>
            <DashboardCard title="Eventos a Preparar" icon={<Calendar />} value={eventosAPreparar} />
            <DashboardCard title="Itens em Baixo Estoque" icon={<AlertTriangle />} value={itensEmBaixoEstoque} />
            <DashboardCard title="Total de Materiais" icon={<Package />} value={totalMateriais} />
            <DashboardCard title="Taxa de Ocupação" icon={<TrendingUp />} value="78%" />
          </>
        )}
      </div>

      <EventCalendar eventos={eventosCalendario} />
    </div>
  );
};

const DashboardCard = ({ title, icon, value }: { title: string, icon: JSX.Element, value: string | number }) => (
  <Card className="bg-white shadow-lg border-0">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-vivere-dark">{title}</CardTitle>
      <div className="h-4 w-4 text-vivere-red">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-vivere-red">{value}</div>
    </CardContent>
  </Card>
);

export default Dashboard;
