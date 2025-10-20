import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import type { Post, Categoria } from "@/types/blog";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const Layout = ({ children, showSidebar = true }: LayoutProps) => {
  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categorias').select('*').order('nome');
      if (error) throw error;
      return data as Categoria[];
    }
  });

  const { data: postsRecentes } = useQuery({
    queryKey: ['posts', 'recentes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'PUBLICADO')
        .order('data_publicacao', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data as Post[];
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header categorias={categorias || []} />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {showSidebar ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                {children}
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <Sidebar 
                    categorias={categorias || []}
                    postsRecentes={postsRecentes || []}
                    postsPopulares={postsRecentes || []} // Usando recentes como populares por enquanto
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              {children}
            </div>
          )}
        </div>
      </main>
      
      <Footer categorias={categorias || []} />
    </div>
  );
};

export default Layout;