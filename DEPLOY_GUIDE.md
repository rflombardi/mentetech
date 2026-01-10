# Guia de Deploy - Melhorias de Segurança

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:
- [ ] Supabase CLI instalado (`npm install -g supabase`)
- [ ] Acesso ao projeto Supabase (project_id: `lublkrevruvdzhegjicb`)
- [ ] Credenciais de admin configuradas

---

## 🚀 Passo a Passo

### 1. Verificar Alterações nos Arquivos

Os seguintes arquivos foram modificados e estão prontos para deploy:

#### ✅ Migration de Segurança
- **Arquivo:** `supabase/migrations/20260109000000_security_improvements.sql`
- **O que faz:** Restringe políticas RLS para apenas admins

#### ✅ Edge Function - Email de Contato
- **Arquivo:** `supabase/functions/send-contact-email/index.ts`
- **Mudanças:**
  - CORS restrito aos domínios permitidos
  - Timeout de 10s em requisições HTTP
  - Dependências atualizadas (Deno 0.224.0, Zod 3.23.8)

#### ✅ Configuração TypeScript
- **Arquivo:** `supabase/functions/auto-publish-posts/deno.json`
- **Mudança:** `strict: true` habilitado

---

### 2. Aplicar Migration de Segurança

#### Opção A: Via Supabase CLI (Recomendado)

```bash
# 1. Login no Supabase (se ainda não estiver logado)
supabase login

# 2. Link ao projeto (se ainda não estiver linkado)
supabase link --project-ref lublkrevruvdzhegjicb

# 3. Verificar status das migrations
supabase db remote list

# 4. Aplicar a nova migration
supabase db push

# Confirme quando solicitado
```

#### Opção B: Via Supabase Dashboard

1. Acesse: https://supabase.com/dashboard/project/lublkrevruvdzhegjicb/editor
2. Vá para **Database** → **Migrations**
3. Clique em **New Migration**
4. Copie todo o conteúdo de `supabase/migrations/20260109000000_security_improvements.sql`
5. Cole no editor e clique em **Run**

---

### 3. Deploy das Edge Functions

#### Deploy via CLI

```bash
# Deploy da função de email (com as melhorias de segurança)
supabase functions deploy send-contact-email

# Deploy da função de auto-publish (com strict mode habilitado)
supabase functions deploy auto-publish-posts
```

#### Verificar Deploy

```bash
# Listar todas as functions
supabase functions list

# Ver logs em tempo real (útil para debugging)
supabase functions logs send-contact-email --tail
```

---

### 4. Configurar Variáveis de Ambiente (se necessário)

Verifique se as seguintes variáveis estão configuradas no Supabase:

```bash
# Ver secrets atuais
supabase secrets list

# Configurar (se necessário)
supabase secrets set RESEND_API_KEY=your_key_here
supabase secrets set CONTACT_EMAIL=contato@mentetech.com.br
```

**Ou via Dashboard:**
1. Vá para **Edge Functions** → **Settings**
2. Adicione os secrets necessários

---

### 5. Ajustar CORS (IMPORTANTE)

O arquivo `send-contact-email/index.ts` já está configurado com:

```typescript
const ALLOWED_ORIGINS = [
  "https://mentetech.com.br",
  "https://www.mentetech.com.br",
  "http://localhost:3000",
  "http://localhost:5173",
];
```

**Se você precisar adicionar outros domínios:**
1. Edite o array `ALLOWED_ORIGINS` no arquivo
2. Execute novamente: `supabase functions deploy send-contact-email`

---

## 🧪 Testes Pós-Deploy

### Teste 1: Verificar Políticas RLS

```sql
-- Conecte-se ao banco via Dashboard SQL Editor ou psql

-- 1. Verificar políticas de storage
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 2. Verificar políticas de posts
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'posts';

-- 3. Verificar políticas de categorias
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'categorias';
```

**Resultado esperado:** Apenas políticas com "admin" devem existir para INSERT/UPDATE/DELETE.

---

### Teste 2: Formulário de Contato

#### Teste com cURL

```bash
# Teste do seu domínio (deve funcionar)
curl -X POST https://lublkrevruvdzhegjicb.supabase.co/functions/v1/send-contact-email \
  -H "Origin: https://mentetech.com.br" \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{
    "name": "Teste",
    "email": "teste@example.com",
    "subject": "Teste de Segurança",
    "message": "Testando CORS após melhorias",
    "messageId": "123e4567-e89b-12d3-a456-426614174000"
  }'

# Teste de outro domínio (deve falhar ou usar fallback)
curl -X POST https://lublkrevruvdzhegjicb.supabase.co/functions/v1/send-contact-email \
  -H "Origin: https://site-malicioso.com" \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{
    "name": "Hacker",
    "email": "hacker@evil.com",
    "subject": "Teste",
    "message": "Tentando burlar CORS",
    "messageId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

#### Teste no Browser

1. Abra o site: https://mentetech.com.br
2. Teste o formulário de contato
3. Verifique no console se não há erros CORS
4. Confirme que o email foi recebido

---

### Teste 3: Permissões de Admin

#### Como Admin (deve funcionar):

```javascript
// No console do browser, logado como admin
const { data, error } = await supabase
  .from('posts')
  .insert({
    titulo: 'Teste de Segurança',
    slug: 'teste-seguranca',
    resumo: 'Teste',
    conteudo_html: '<p>Teste</p>',
    status: 'RASCUNHO'
  });

console.log('Admin insert:', data, error); // Deve funcionar
```

#### Como Usuário Não-Admin (deve falhar):

```javascript
// No console do browser, sem login ou com usuário comum
const { data, error } = await supabase
  .from('posts')
  .insert({
    titulo: 'Tentativa Maliciosa',
    slug: 'hack',
    resumo: 'Hack',
    conteudo_html: '<p>Hack</p>',
    status: 'PUBLICADO'
  });

console.log('Non-admin insert:', data, error); // Deve retornar erro RLS
```

---

### Teste 4: Timeout das Requisições

Simule uma requisição lenta para verificar se o timeout funciona:

```bash
# Monitorar logs da function
supabase functions logs send-contact-email --tail

# Enviar requisição (em outro terminal)
# Se o Resend API estiver lento, deve timeout em 10s
```

---

## ✅ Checklist Final

Após o deploy, confirme que:

- [ ] Migration aplicada com sucesso
- [ ] Edge functions deployed
- [ ] Políticas RLS verificadas (apenas admins podem modificar)
- [ ] CORS funcionando corretamente do seu domínio
- [ ] CORS bloqueando outros domínios
- [ ] Formulário de contato enviando emails
- [ ] Timeout funcionando em requisições HTTP
- [ ] Admins conseguem criar/editar posts
- [ ] Usuários não-admin são bloqueados
- [ ] Logs das functions sem erros

---

## 🔍 Troubleshooting

### Problema: Migration falha

**Erro:** `policy already exists`

**Solução:**
```sql
-- Execute antes da migration
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can update posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can delete posts" ON public.posts;
```

---

### Problema: CORS não funciona

**Sintoma:** Erro no browser: `Access-Control-Allow-Origin`

**Soluções:**
1. Verifique se o domínio está na lista `ALLOWED_ORIGINS`
2. Confirme que fez deploy da function após alterar CORS
3. Limpe cache do browser (Ctrl+Shift+Delete)
4. Verifique logs: `supabase functions logs send-contact-email`

---

### Problema: Admin não consegue editar posts

**Sintoma:** Erro RLS mesmo sendo admin

**Soluções:**
1. Verifique se o usuário está na tabela `user_roles`:
```sql
SELECT * FROM public.user_roles WHERE user_id = 'c00b75cc-a74d-4ccd-9679-414d91231568';
```

2. Verifique se a função `has_role` existe:
```sql
SELECT * FROM pg_proc WHERE proname = 'has_role';
```

3. Teste a função manualmente:
```sql
SELECT has_role('c00b75cc-a74d-4ccd-9679-414d91231568'::uuid, 'admin'::app_role);
-- Deve retornar: true
```

---

### Problema: Timeout ocorre muito cedo/tarde

**Ajustar timeout:**

Edite `send-contact-email/index.ts`:

```typescript
// Linha 128 e 164 - ajuste o valor (em ms)
10000 // 10 segundos (atual)
15000 // 15 segundos (se precisar de mais tempo)
5000  // 5 segundos (se quiser mais restritivo)
```

Deploy novamente após ajuste.

---

## 📊 Monitoramento Contínuo

### Logs Importantes

```bash
# Ver logs das functions
supabase functions logs send-contact-email
supabase functions logs auto-publish-posts

# Ver logs do banco
# (via Dashboard → Database → Logs)
```

### Métricas a Observar

1. **Taxa de erro nas functions**
   - Meta: < 1%
   - Alerta: > 5%

2. **Tempo de resposta do email**
   - Meta: < 5s
   - Alerta: > 10s (timeout)

3. **Tentativas de acesso não-autorizado**
   - Monitorar logs de RLS blocked
   - Investigar padrões suspeitos

---

## 🔗 Links Úteis

- **Dashboard do Projeto:** https://supabase.com/dashboard/project/lublkrevruvdzhegjicb
- **SQL Editor:** https://supabase.com/dashboard/project/lublkrevruvdzhegjicb/editor
- **Edge Functions:** https://supabase.com/dashboard/project/lublkrevruvdzhegjicb/functions
- **Database Logs:** https://supabase.com/dashboard/project/lublkrevruvdzhegjicb/logs/postgres-logs

---

## 📝 Próximas Melhorias Recomendadas

Após estabilizar o deploy atual:

1. **Implementar Rate Limiting** (ver SECURITY_IMPROVEMENTS.md)
2. **Adicionar validação de email descartável**
3. **Configurar alertas de monitoramento**
4. **Implementar backup automatizado**

---

**Criado em:** 2026-01-09
**Autor:** Claude Code
**Versão:** 1.0
