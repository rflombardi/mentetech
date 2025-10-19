# Regras para Desenvolvimento com IA

Este documento descreve a stack tecnológica utilizada neste projeto e as diretrizes para o uso de bibliotecas e componentes, garantindo consistência e boas práticas.

## Stack Tecnológica

*   **Framework:** React
*   **Linguagem:** TypeScript
*   **Build Tool:** Vite
*   **Estilização:** Tailwind CSS
*   **Componentes UI:** shadcn/ui (construído sobre Radix UI)
*   **Roteamento:** React Router
*   **Gerenciamento de Estado/Dados:** React Query
*   **Autenticação e Banco de Dados:** Supabase
*   **Ícones:** Lucide React
*   **Gerenciamento de Tema:** next-themes
*   **Validação de Formulários:** react-hook-form com Zod
*   **Manipulação de Datas:** date-fns
*   **Notificações Toast:** sonner (e `use-toast` do shadcn/ui)

## Regras de Uso de Bibliotecas e Componentes

Para manter a consistência, manutenibilidade e performance do projeto, siga as seguintes regras:

1.  **Componentes UI (shadcn/ui):**
    *   **Prioridade:** Sempre utilize os componentes do `shadcn/ui` para elementos de interface.
    *   **Customização:** Se um componente `shadcn/ui` não atender a uma necessidade específica, crie um novo componente que o envolva ou estenda, ou construa um novo componente do zero usando Tailwind CSS. **Nunca edite os arquivos fonte dos componentes `shadcn/ui` diretamente.**
    *   **Novos Componentes:** Crie um novo arquivo para cada novo componente, mesmo que pequeno. Evite adicionar múltiplos componentes no mesmo arquivo.

2.  **Estilização (Tailwind CSS):**
    *   **Exclusividade:** Utilize exclusivamente Tailwind CSS para toda a estilização. Evite estilos inline ou arquivos CSS separados, a menos que seja estritamente necessário para uma biblioteca de terceiros que não suporte Tailwind.
    *   **Responsividade:** Todos os designs devem ser responsivos e adaptáveis a diferentes tamanhos de tela.

3.  **Roteamento (React Router):**
    *   **Navegação:** Use `react-router-dom` para todas as rotas e navegação no lado do cliente. Mantenha a definição das rotas em `src/App.tsx`.

4.  **Gerenciamento de Dados (React Query):**
    *   **Server State:** Utilize `@tanstack/react-query` para gerenciar o estado do servidor (data fetching, caching, sincronização, etc.).

5.  **Autenticação e Banco de Dados (Supabase):**
    *   **Interação:** Use a biblioteca `@supabase/supabase-js` para todas as interações com o backend do Supabase, incluindo autenticação, banco de dados e armazenamento de arquivos.

6.  **Ícones (Lucide React):**
    *   **Padrão:** Utilize `lucide-react` para todos os ícones na aplicação.

7.  **Formulários (react-hook-form e Zod):**
    *   **Validação:** Implemente formulários usando `react-hook-form` e `zod` para validação de esquemas.

8.  **Datas e Horas (date-fns):**
    *   **Formatação:** Use `date-fns` para todas as operações de manipulação e formatação de datas e horas.

9.  **Notificações (sonner / use-toast):**
    *   **Toasts:** Para notificações de feedback ao usuário, utilize `sonner` ou o `use-toast` do shadcn/ui, conforme a necessidade e o contexto.

10. **Estrutura de Arquivos:**
    *   Mantenha a organização do código em diretórios lógicos: `src/pages/`, `src/components/`, `src/contexts/`, `src/hooks/`, `src/integrations/`, `src/types/`. Nomes de diretórios devem ser em minúsculas.

11. **Simplicidade e Elegância:**
    *   Priorize soluções simples e diretas. Evite over-engineering. Implemente apenas o que foi solicitado, de forma funcional e clara.

12. **Funcionalidade Completa:**
    *   Todas as funcionalidades implementadas devem ser completas e funcionais, sem placeholders ou implementações parciais.