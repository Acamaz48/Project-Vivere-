
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sucesso = await login(email, senha);
      if (!sucesso) {
        toast({
          title: "Erro de Login",
          description: "Email ou senha incorretos",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante o login",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vivere-light-gray">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/ff74affb-81dc-43f2-880a-124b7107613c.png" 
              alt="Vivere Logo" 
              className="w-16 h-16"
            />
          </div>
          <CardTitle className="vivere-title">VIVERE ERP</CardTitle>
          <CardDescription>Sistema de Gestão Empresarial</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@vivere.com.br"
                required
                className="focus:border-vivere-red focus:ring-vivere-red"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="focus:border-vivere-red focus:ring-vivere-red"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-vivere-red hover:bg-red-700 text-vivere-white"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-6 text-sm text-gray-600">
            <p className="font-semibold mb-2">Usuários de teste:</p>
            <div className="space-y-1">
              <p><strong>Admin:</strong> admin@vivere.com.br / admin123</p>
              <p><strong>Gestor:</strong> gestor.marica@vivere.com.br / gestor123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
