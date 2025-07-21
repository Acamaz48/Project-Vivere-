import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { Usuario } from '@/types';

// Tipagem do contexto
interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isGestor: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔒 Mock de usuários (simulação de autenticação)
const mockUsuarios: Usuario[] = [
  {
    id: '1',
    nome: 'Admin Vivere',
    email: 'admin@vivere.com.br',
    senha: 'admin123',
    perfil: 'Administrador'
  },
  {
    id: '2',
    nome: 'Gestor Maricá',
    email: 'gestor.marica@vivere.com.br',
    senha: 'gestor123',
    perfil: 'Gestor de Depósito',
    deposito_id: '1'
  }
];

// Componente Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('vivere_usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
  }, []);

  // Função de login
  const login = async (email: string, senha: string): Promise<boolean> => {
    const usuarioEncontrado = mockUsuarios.find(
      (u) => u.email === email && u.senha === senha
    );

    if (usuarioEncontrado) {
      setUsuario(usuarioEncontrado);
      localStorage.setItem('vivere_usuario', JSON.stringify(usuarioEncontrado));
      return true;
    }

    return false;
  };

  // Função de logout
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('vivere_usuario');
  };

  // Verifica se é admin
  const isAdmin = () => (usuario?.perfil || '') === 'Administrador';

  // Verifica se é gestor
  const isGestor = () => (usuario?.perfil || '') === 'Gestor de Depósito';

  return (
    <AuthContext.Provider
      value={{ usuario, login, logout, isAdmin, isGestor }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
