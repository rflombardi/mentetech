import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { AuthRequired } from "@/components/admin/AuthRequired";
import { Skeleton } from "@/components/ui/skeleton";

const ProtectedRoute = () => {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-8 w-96 mx-auto" />
          <p className="text-muted-foreground pt-4">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <AuthRequired />;
  }

  return <Outlet />;
};

export default ProtectedRoute;