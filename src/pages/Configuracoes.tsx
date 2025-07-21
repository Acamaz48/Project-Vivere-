import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Building, Users, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const Configuracoes = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="vivere-title">CONFIGURAÇÕES</h1>
        <p className="text-gray-600">Gerenciamento dos dados mestres do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card: Gestão de Depósitos */}
        <Card
          className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate('/configuracoes/depositos')}
        >
          <CardHeader className="text-center">
            <Building className="w-12 h-12 text-vivere-red mx-auto mb-4" />
            <CardTitle className="text-vivere-dark">Gestão de Depósitos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center text-sm">
              Cadastre e gerencie os depósitos da empresa. 
              Não é possível excluir depósitos com estoque ativo.
            </p>
          </CardContent>
        </Card>

        {/* Card: Gestão de Usuários */}
        <Card
          className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate('/configuracoes/usuarios')}
        >
          <CardHeader className="text-center">
            <Users className="w-12 h-12 text-vivere-red mx-auto mb-4" />
            <CardTitle className="text-vivere-dark">Gestão de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center text-sm">
              Crie e gerencie usuários do sistema. 
              Gestores devem ser associados a um depósito.
            </p>
          </CardContent>
        </Card>

        {/* Card: Catálogo de Materiais */}
        <Card
          className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate('/configuracoes/materiais')}
        >
          <CardHeader className="text-center">
            <Package className="w-12 h-12 text-vivere-red mx-auto mb-4" />
            <CardTitle className="text-vivere-dark">Catálogo de Materiais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center text-sm">
              Gerencie o catálogo mestre de materiais. 
              Estoque deve ser adicionado pelos gestores.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informações do sistema */}
      <Card className="bg-vivere-light-gray border-0">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Settings className="w-5 h-5 text-vivere-red" />
            <div>
              <h4 className="font-semibold text-vivere-dark">Sistema de Gestão Completo</h4>
              <p className="text-sm text-gray-600 mt-1">
                Gerencie todos os aspectos do sistema: depósitos, usuários e catálogo de materiais. 
                Os gestores poderão adicionar produtos aos seus inventários baseados no catálogo mestre.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracoes;