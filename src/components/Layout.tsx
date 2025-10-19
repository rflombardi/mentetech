import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { categorias, posts } from "@/data/mockData";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const Layout = ({ children, showSidebar = true }: LayoutProps) => {
  // Get recent and popular posts for sidebar
  const postsRecentes = posts.slice(0, 3);
  const postsPopulares = posts.slice(0, 3); // Mock popular posts

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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
                    categorias={categorias}
                    postsRecentes={postsRecentes}
                    postsPopulares={postsPopulares}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;