import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Evento } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, User, Clock } from 'lucide-react';

interface EventCalendarProps {
  eventos: Evento[];
}

const EventCalendar = ({ eventos }: EventCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

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

  // Eventos no mês atual
  const eventosDoMes = eventos.filter(evento => {
    const eventoDate = new Date(evento.data_inicio);
    const hoje = new Date();
    return (
      eventoDate.getMonth() === hoje.getMonth() &&
      eventoDate.getFullYear() === hoje.getFullYear()
    );
  });

  // Eventos na data selecionada
  const eventosNaData = selectedDate
    ? eventos.filter(evento => {
        const eventoDate = new Date(evento.data_inicio);
        return eventoDate.toDateString() === selectedDate.toDateString();
      })
    : [];

  // Para pintar dias com eventos no calendário
  const hasEventsOnDate = (date: Date) => {
    return eventos.some(evento => {
      const eventoDate = new Date(evento.data_inicio);
      return eventoDate.toDateString() === date.toDateString();
    });
  };

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader>
        <CardTitle className="vivere-subtitle flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-vivere-red" />
          CALENDÁRIO DE EVENTOS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendário */}
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasEvents: hasEventsOnDate,
              }}
              modifiersClassNames={{
                hasEvents: "bg-vivere-red text-white font-bold hover:bg-red-700",
              }}
            />
          </div>

          {/* Eventos do mês */}
          <div>
            <h4 className="font-semibold text-vivere-dark mb-4">
              Eventos do Mês ({eventosDoMes.length})
            </h4>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {eventosDoMes.map(evento => (
                <div key={evento.id} className="p-3 bg-vivere-light-gray rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-vivere-dark text-sm">{evento.nome_evento}</h5>
                    <Badge className={getStatusBadgeColor(evento.status)}>
                      {evento.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <User className="w-3 h-3 mr-1" />
                    {evento.cliente}
                  </div>
                  <div className="flex items-center text-xs text-gray-600 mb-3">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(evento.data_inicio).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eventos da data selecionada */}
          <div>
            <h4 className="font-semibold text-vivere-dark mb-4">
              Eventos em {selectedDate?.toLocaleDateString('pt-BR') || '...'}
              {' '}({eventosNaData.length})
            </h4>
            {eventosNaData.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum evento nesta data.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {eventosNaData.map(evento => (
                  <div key={evento.id} className="p-3 bg-vivere-light-gray rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-vivere-dark text-sm">{evento.nome_evento}</h5>
                      <Badge className={getStatusBadgeColor(evento.status)}>
                        {evento.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-600 mb-2">
                      <User className="w-3 h-3 mr-1" />
                      {evento.cliente}
                    </div>
                    <div className="flex items-center text-xs text-gray-600 mb-3">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(evento.data_inicio).toLocaleDateString('pt-BR')}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full text-xs border-vivere-red text-vivere-red hover:bg-vivere-red hover:text-white"
                          onClick={() => setSelectedEvent(evento)}
                        >
                          Ver Detalhes Rápidos
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-vivere-dark">{evento.nome_evento}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-600">Cliente</p>
                            <p className="font-medium text-vivere-dark">{evento.cliente}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Data de Início</p>
                            <p className="font-medium text-vivere-dark">
                              {new Date(evento.data_inicio).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Data de Fim</p>
                            <p className="font-medium text-vivere-dark">
                              {new Date(evento.data_fim).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <Badge className={getStatusBadgeColor(evento.status)}>
                              {evento.status}
                            </Badge>
                          </div>
                          <Button
                            onClick={() => navigate(`/eventos/${evento.id}`)}
                            className="w-full bg-vivere-red hover:bg-red-700 text-white"
                          >
                            Ver Página Completa
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;
