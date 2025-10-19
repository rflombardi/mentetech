import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import CategoryPage from "./pages/CategoryPage";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { NewsletterProvider } from "@/contexts/NewsletterContext";
import { NewsletterModal } from "@/components/NewsletterModal";
import { useNewsletter } from "@/contexts/NewsletterContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

// Newsletter Modal Component
const NewsletterModalWrapper = () => {
  const { isOpen, closeModal } = useNewsletter();
  return <NewsletterModal open={isOpen} onOpenChange={closeModal} />;
};

// Router component to ensure proper context initialization
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/post/:slug" element={<PostPage />} />
    <Route path="/categoria/:slug" element={<CategoryPage />} />
    <Route path="/sobre" element={<About />} />
    <Route path="/contato" element={<Contact />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NewsletterProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
              <NewsletterModalWrapper />
            </TooltipProvider>
          </NewsletterProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
