import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, User, ArrowRight, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function AuthRequired() {
  const { user, isAdmin, isLoading, checkAdminRole } = useAuth();

  const handleRetry = async () => {
    await checkAdminRole();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Acesso Restrito</CardTitle>
          <CardDescription>
            {!user ? (
              "Esta área é restrita aos administradores do blog. Faça login para continuar."
            ) : isLoading ? (
              "Verificando permissões..."
            ) : !isAdmin ? (
              "Você precisa de permissões de administrador para acessar esta área."
            ) : (
              "Redirecionando..."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && !isAdmin && !isLoading && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive mb-1">
                    Sem Permissões de Administrador
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sua conta não possui permissões de administrador. Entre em contato com um administrador existente para solicitar acesso.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            {user && !isAdmin && !isLoading && (
              <Button onClick={handleRetry} variant="outline" className="w-full">
                Reverificar Permissões
              </Button>
            )}
            <Button asChild className="w-full btn-hero">
              <Link to="/">
                <ArrowRight className="mr-2 h-4 w-4" />
                Voltar ao Blog
              </Link>
            </Button>
            {!user && (
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth">
                  <User className="mr-2 h-4 w-4" />
                  Fazer Login
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}