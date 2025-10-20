import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  checkAdminRole: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Função interna para realizar a verificação de admin de forma segura
  const performAdminCheck = async (currentSession: Session | null): Promise<boolean> => {
    if (!currentSession?.user?.id) {
      console.log('❌ Nenhum usuário logado para verificação de admin');
      return false;
    }

    console.log('✅ Usuário logado:', currentSession.user.email);
    console.log('🔍 Verificando role de admin para user_id:', currentSession.user.id);

    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: currentSession.user.id,
        _role: 'admin'
      });

      if (error) {
        console.error('❌ Erro ao verificar role de admin:', error);
        return false;
      }

      console.log('🔐 Resultado has_role:', data);
      console.log(data ? '✅ Usuário É admin' : '❌ Usuário NÃO é admin');
      return !!data;
    } catch (error) {
      console.error('❌ Exceção ao verificar role de admin:', error);
      return false;
    }
  };

  useEffect(() => {
    setIsLoading(true);

    // Verifica a sessão inicial ao carregar a aplicação
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      const isAdminStatus = await performAdminCheck(initialSession);
      setIsAdmin(isAdminStatus);
      setIsLoading(false);
    });

    // Ouve por mudanças no estado de autenticação (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        const isAdminStatus = await performAdminCheck(newSession);
        setIsAdmin(isAdminStatus);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Função exposta para re-verificar manualmente a permissão (usado no botão "Tentar Novamente")
  const checkAdminRole = async (): Promise<boolean> => {
    const isAdminStatus = await performAdminCheck(session);
    setIsAdmin(isAdminStatus);
    return isAdminStatus;
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      return { error: null };
    } catch (error) {
      if (import.meta.env.DEV) console.error('Sign in error:', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu email para confirmar a conta.",
      });
      
      return { error: null };
    } catch (error) {
      if (import.meta.env.DEV) console.error('Sign up error:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Até logo!",
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
        checkAdminRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}