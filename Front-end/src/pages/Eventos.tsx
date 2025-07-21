import { useEffect, useState } from 'react';
import { Plus, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Eventos = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome_evento: '',
    cliente: '',
    status: 'Confirmado',
    data_inicio: '',
    data_fim: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    carregarEventos();
  }, []);

  const carregarEventos = () => {
    setLoading(true);
    fetch('/api/eventos')
      .then(res => res.json())
      .then(data => {
        setEventos(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar eventos:", error);
        setLoading(false);
      });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Finalizado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    // Validação simples
    if (!formData.nome_evento || !formData.cliente || !formData.data_inicio || !formData.data_fim) {
      setFormError('Preencha todos os campos');
      return;
    }

    setFormLoading(true);
    try {
      const res = await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao criar evento');
      }
      // Atualiza lista
      carregarEventos();
      // Reseta formulário
      setFormData({
        nome_evento: '',
        cliente: '',
        status: 'Confirmado',
        data_inicio: '',
        data_fim: '',
      });
    } catch (error: any) {
      setFormError(error.message);
    }
    setFormLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="vivere-title">LISTAGEM DE EVENTOS</h1>
          <p className="text-gray-600">Gerencie todos os eventos da Vivere Entretenimento</p>
        </div>
        {isAdmin() && (
          <Button
            onClick={() => navigate('/eventos/novo')}
            className="bg-vivere-red hover:bg-red-700 text-vivere-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Novo Evento
          </Button>
        )}
      </div>

      {/* Formulário de criação */}
      {isAdmin() && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 max-w-lg">
          <h2 className="text-lg font-semibold mb-4">Criar Novo Evento</h2>

          <input
            name="nome_evento"
            placeholder="Nome do Evento"
            value={formData.nome_evento}
            onChange={handleInputChange}
            className="w-full mb-3 p-2 border rounded"
            required
          />
          <input
            name="cliente"
            placeholder="Cliente"
            value={formData.cliente}
            onChange={handleInputChange}
            className="w-full mb-3 p-2 border rounded"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full mb-3 p-2 border rounded"
          >
            <option value="Confirmado">Confirmado</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          <label className="block mb-1">Data Início</label>
          <input
            name="data_inicio"
            type="date"
            value={formData.data_inicio}
            onChange={handleInputChange}
            className="w-full mb-3 p-2 border rounded"
            required
          />
          <label className="block mb-1">Data Fim</label>
          <input
            name="data_fim"
            type="date"
            value={formData.data_fim}
            onChange={handleInputChange}
            className="w-full mb-3 p-2 border rounded"
            required
          />
          {formError && <p className="text-red-600 mb-3">{formError}</p>}
          <Button type="submit" disabled={formLoading} className="bg-vivere-red hover:bg-red-700 text-white">
            {formLoading ? 'Salvando...' : 'Salvar Evento'}
          </Button>
        </form>
      )}

      {loading ? (
        <div className="text-center text-gray-500">Carregando eventos...</div>
      ) : eventos.length === 0 ? (
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-500">Comece criando seu primeiro evento</p>
            {isAdmin() && (
              <Button
                onClick={() => navigate('/eventos/novo')}
                className="mt-4 bg-vivere-red hover:bg-red-700 text-vivere-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Evento
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento: any) => (
            <Card key={evento.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-vivere-dark">{evento.nome_evento}</CardTitle>
                  <Badge className={getStatusBadgeColor(evento.status)}>
                    {evento.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Cliente</p>
                    <p className="font-medium text-vivere-dark">{evento.cliente}</p>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(evento.data_inicio).toLocaleDateString('pt-BR')}
                    {evento.data_inicio !== evento.data_fim && (
                      <span> - {new Date(evento.data_fim).toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>

                  <div className="pt-3 border-t">
                    <Button
                      onClick={() => navigate(`/eventos/${evento.id}`)}
                      variant="outline"
                      size="sm"
                      className="w-full border-vivere-red text-vivere-red hover:bg-vivere-red hover:text-vivere-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Eventos;
