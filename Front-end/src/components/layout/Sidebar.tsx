
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Package, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { usuario, logout, isAdmin } = useAuth();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const navigationItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/eventos', icon: Calendar, label: 'Eventos' },
    { to: '/inventario', icon: Package, label: 'Inventário' },
    ...(isAdmin() ? [{ to: '/configuracoes', icon: Settings, label: 'Configurações' }] : [])
  ];

  return (
    <div className={`bg-vivere-dark text-vivere-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col`}>
      {/* Header com Logo */}
      <div className="p-4 border-b border-gray-600">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/faee6796-dc50-4a19-8ec3-6808d391d856.png" 
                alt="Vivere Logo" 
                className="w-8 h-8"
              />
              <span className="font-title font-bold text-lg">VIVERE ERP</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-vivere-white hover:bg-gray-700"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-vivere-red text-vivere-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-vivere-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-600">
        {!isCollapsed && (
          <div className="mb-3">
            <p className="text-sm font-medium text-vivere-white">{usuario?.nome}</p>
            <p className="text-xs text-gray-400">{usuario?.perfil}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full text-gray-300 hover:bg-gray-700 hover:text-vivere-white justify-start"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {!isCollapsed && 'Sair'}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
