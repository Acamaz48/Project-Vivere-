import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";
import Dashboard from "@/pages/Dashboard";
import Eventos from "@/pages/Eventos";
import Inventario from "@/pages/Inventario";
import Configuracoes from "@/pages/Configuracoes";
import GestaoDepositos from "@/pages/GestaodeDepositos";
import CatalogoDeMateriais from "@/pages/CatalogodeMateriais";
import GestaoDeUsuarios from "@/pages/GestaoDeUsuarios"; 

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { usuario } = useAuth();
  return usuario ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { usuario } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={usuario ? <Navigate to="/dashboard" /> : <LoginForm />} 
      />
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/eventos" 
        element={<ProtectedRoute><Eventos /></ProtectedRoute>} 
      />
      <Route 
        path="/inventario" 
        element={<ProtectedRoute><Inventario /></ProtectedRoute>} 
      />
      <Route 
        path="/configuracoes" 
        element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} 
      />
      <Route 
        path="/configuracoes/depositos" 
        element={<ProtectedRoute><GestaoDepositos /></ProtectedRoute>} 
      />
      <Route 
        path="/configuracoes/materiais" 
        element={<ProtectedRoute><CatalogoDeMateriais /></ProtectedRoute>} 
      />
      <Route 
        path="/configuracoes/usuarios" 
        element={<ProtectedRoute><GestaoDeUsuarios /></ProtectedRoute>} 
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
