# Melhorias de Segurança - Supabase

Este documento descreve as melhorias de segurança implementadas no projeto.

## ✅ Correções Implementadas

### 1. Políticas RLS Restritas (CRÍTICO - RESOLVIDO)

**Migration:** `20260109000000_security_improvements.sql`

Todas as políticas permissivas foram removidas e substituídas por políticas restritas a admins:

- **Storage (blog-images):** Apenas admins podem fazer upload, modificar e deletar imagens
- **Posts:** Apenas admins podem criar, editar e deletar posts
- **Categorias:** Apenas admins podem criar, editar e deletar categorias

**Impacto:** Previne que usuários não-autorizados modifiquem conteúdo do blog.

---

### 2. CORS Restrito (CRÍTICO - RESOLVIDO)

**Arquivo:** `supabase/functions/send-contact-email/index.ts`

- Removido `Access-Control-Allow-Origin: *`
- Implementada lista de origens permitidas:
  - `https://mentetech.com.br`
  - `https://www.mentetech.com.br`
  - Localhost para desenvolvimento

**Impacto:** Previne que sites externos façam requisições não autorizadas.

---

### 3. Timeout em Requisições HTTP (RESOLVIDO)

**Arquivo:** `supabase/functions/send-contact-email/index.ts`

- Implementada função `fetchWithTimeout()` com timeout de 10 segundos
- Aplicada em todas as chamadas à API do Resend

**Impacto:** Previne que edge functions fiquem travadas indefinidamente.

---

### 4. TypeScript Strict Mode (RESOLVIDO)

**Arquivo:** `supabase/functions/auto-publish-posts/deno.json`

- Habilitado `"strict": true`

**Impacto:** Melhora a segurança de tipos e previne bugs de runtime.

---

### 5. Dependências Atualizadas (RESOLVIDO)

**Arquivo:** `supabase/functions/send-contact-email/index.ts`

- Deno std atualizado de `0.190.0` → `0.224.0`
- Zod atualizado de `v3.22.4` → `v3.23.8`

**Impacto:** Remove vulnerabilidades conhecidas em versões antigas.

---

## ⚠️ Ações Necessárias Antes do Deploy

### 1. Aplicar a Migration de Segurança

```bash
# Execute a migration para aplicar as novas políticas RLS
supabase db push
```

**IMPORTANTE:** Esta migration vai remover permissões de usuários não-admin. Certifique-se de que todos os admins necessários estão configurados na tabela `user_roles`.

---

### 2. Configurar Origens CORS no Código

Edite o arquivo `supabase/functions/send-contact-email/index.ts` e ajuste a lista `ALLOWED_ORIGINS` conforme necessário:

```typescript
const ALLOWED_ORIGINS = [
  "https://mentetech.com.br",           // Seu domínio de produção
  "https://www.mentetech.com.br",       // Variante com www
  "http://localhost:3000",              // Desenvolvimento local (se necessário)
  "http://localhost:5173",              // Vite dev server
];
```

---

### 3. Testar Autenticação Admin

Antes do deploy, teste que:
- ✓ Admins conseguem criar/editar posts
- ✓ Admins conseguem fazer upload de imagens
- ✓ Usuários não-admin são bloqueados
- ✓ O formulário de contato funciona do seu domínio
- ✓ O formulário de contato é bloqueado de outros domínios

---

## 🔴 Problemas Pendentes (Requerem Implementação Adicional)

### 1. Rate Limiting

**Status:** NÃO IMPLEMENTADO (requer serviço externo)

A função `send-contact-email` não tem proteção contra spam/abuse.

**Soluções Recomendadas:**

#### Opção A: Upstash Rate Limit (Recomendado)
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 requests per hour
});

// No handler:
const identifier = req.headers.get("x-forwarded-for") || "anonymous";
const { success } = await ratelimit.limit(identifier);

if (!success) {
  return new Response(
    JSON.stringify({ error: "Too many requests. Please try again later." }),
    { status: 429, headers: corsHeaders }
  );
}
```

**Custo:** Upstash tem plano gratuito para até 10.000 requisições/dia.

#### Opção B: Supabase Database Rate Limit
Criar tabela para tracking de requisições e implementar lógica manual.

---

### 2. Validação de Email Descartável

**Status:** NÃO IMPLEMENTADO

Atualmente aceita emails de domínios temporários como `mailinator.com`, `guerrillamail.com`, etc.

**Solução Recomendada:**

```typescript
// Lista de domínios descartáveis conhecidos
const DISPOSABLE_DOMAINS = [
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  // ... adicionar mais conforme necessário
];

// No schema de validação:
email: z.string()
  .email()
  .refine((email) => {
    const domain = email.split('@')[1].toLowerCase();
    return !DISPOSABLE_DOMAINS.includes(domain);
  }, { message: "Disposable email addresses are not allowed" })
```

**Alternativa:** Usar serviço como [Kickbox](https://kickbox.com/) ou [ZeroBounce](https://www.zerobounce.net/) para validação em tempo real.

---

### 3. Remover Informações Sensíveis do Repositório

**Status:** AÇÃO MANUAL NECESSÁRIA

O arquivo `20250930224050_dd577134-67ca-413a-9db0-0b702b66ff13.sql` contém:
- UUID do admin: `c00b75cc-a74d-4ccd-9679-414d91231568`
- Email no comentário: `rflombardi36@gmail.com`

**Ação Recomendada:**
1. Se o repositório é privado, pode manter
2. Se for público, editar a migration para remover o comentário com email
3. Considerar usar `.env` para configurações sensíveis

---

## 🛡️ Checklist de Segurança Contínua

- [ ] Revisar políticas RLS periodicamente
- [ ] Manter dependências atualizadas
- [ ] Monitorar logs de erro das edge functions
- [ ] Implementar rate limiting antes do lançamento público
- [ ] Configurar alertas para falhas de autenticação
- [ ] Revisar permissões de usuários admin regularmente
- [ ] Fazer backup regular do banco de dados
- [ ] Testar políticas RLS em ambiente de staging antes de produção

---

## 📊 Resumo de Riscos

| Risco | Severidade | Status |
|-------|-----------|---------|
| RLS Permissivo em Storage | 🔴 Crítico | ✅ Resolvido |
| RLS Permissivo em Posts | 🔴 Crítico | ✅ Resolvido |
| CORS Aberto | 🔴 Crítico | ✅ Resolvido |
| Falta de Rate Limiting | 🔴 Crítico | ⚠️ Pendente |
| Falta de Timeout | 🟡 Alto | ✅ Resolvido |
| Strict Mode Desabilitado | 🟡 Alto | ✅ Resolvido |
| Validação de Email | 🟡 Médio | ⚠️ Pendente |
| Dependências Antigas | 🟡 Médio | ✅ Resolvido |
| Info Sensível no Repo | 🟢 Baixo | ⚠️ Avaliar |

---

## 📝 Notas para Deploy

1. **Ordem de Deploy:**
   ```bash
   # 1. Aplicar migration
   supabase db push

   # 2. Deploy edge functions atualizadas
   supabase functions deploy send-contact-email
   supabase functions deploy auto-publish-posts
   ```

2. **Variáveis de Ambiente Necessárias:**
   - `RESEND_API_KEY` - Já configurada
   - `CONTACT_EMAIL` - Já configurada
   - `SUPABASE_URL` - Auto-configurada
   - `SUPABASE_ANON_KEY` - Auto-configurada
   - `SUPABASE_SERVICE_ROLE_KEY` - Auto-configurada

3. **Teste Pós-Deploy:**
   - Testar formulário de contato do site
   - Verificar que usuários não-admin não conseguem editar posts
   - Confirmar que emails estão sendo enviados corretamente
   - Verificar logs das edge functions

---

## 🔗 Recursos Adicionais

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Deno Security Best Practices](https://deno.land/manual/basics/permissions)
- [CORS Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Última Atualização:** 2026-01-09
**Próxima Revisão Recomendada:** 2026-04-09 (3 meses)
