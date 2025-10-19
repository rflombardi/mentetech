import { Post, Categoria } from "@/types/blog";

export const categorias: Categoria[] = [
  {
    id: "1",
    nome: "Automação de Processos",
    slug: "automacao-processos",
    descricao: "Como usar IA para automatizar tarefas repetitivas",
    cor: "#3D5AFE"
  },
  {
    id: "2", 
    nome: "Atendimento ao Cliente",
    slug: "atendimento-cliente",
    descricao: "Chatbots e IA conversacional para PMEs",
    cor: "#7C4DFF"
  },
  {
    id: "3",
    nome: "Análise de Dados",
    slug: "analise-dados", 
    descricao: "Business Intelligence e analytics com IA",
    cor: "#00E5FF"
  },
  {
    id: "4",
    nome: "Marketing Digital",
    slug: "marketing-digital",
    descricao: "IA aplicada ao marketing e vendas",
    cor: "#FF6B35"
  }
];

export const posts: Post[] = [
  {
    id: "1",
    titulo: "Como Implementar Chatbots em Pequenas Empresas: Guia Completo 2024",
    resumo: "Descubra como chatbots podem revolucionar o atendimento ao cliente da sua PME, reduzindo custos em até 60% e aumentando a satisfação dos clientes.",
    conteudo_html: `
      <h2>Por que sua PME precisa de um chatbot?</h2>
      <p>O atendimento ao cliente é um dos pilares mais importantes de qualquer negócio. Para pequenas e médias empresas brasileiras, que muitas vezes operam com equipes enxutas, encontrar formas eficientes de atender bem os clientes sem comprometer o orçamento é fundamental.</p>
      
      <p>Os chatbots representam uma solução inteligente para esse desafio, oferecendo:</p>
      
      <ul>
        <li><strong>Disponibilidade 24/7:</strong> Seus clientes podem ser atendidos a qualquer hora do dia</li>
        <li><strong>Redução de custos:</strong> Automatize respostas para perguntas frequentes</li>
        <li><strong>Qualificação de leads:</strong> Colete informações importantes antes do atendimento humano</li>
        <li><strong>Escalabilidade:</strong> Atenda múltiplos clientes simultaneamente</li>
      </ul>
      
      <h2>Tipos de chatbot para PMEs</h2>
      
      <h3>1. Chatbots de Regras (Rule-based)</h3>
      <p>Ideais para começar, funcionam com fluxos pré-determinados. Perfeitos para FAQ e processos simples como:</p>
      <ul>
        <li>Informações sobre produtos e serviços</li>
        <li>Horários de funcionamento</li>
        <li>Agendamento de consultas</li>
        <li>Suporte básico</li>
      </ul>
      
      <h3>2. Chatbots com IA (AI-powered)</h3>
      <p>Mais avançados, utilizam processamento de linguagem natural. Recomendados quando:</p>
      <ul>
        <li>Você tem um volume alto de conversas</li>
        <li>Precisa de respostas mais naturais</li>
        <li>Quer análises de sentimento</li>
        <li>Deseja aprendizado contínuo</li>
      </ul>
      
      <h2>Passo a passo para implementação</h2>
      
      <h3>Etapa 1: Definindo objetivos</h3>
      <p>Antes de escolher a ferramenta, defina claramente:</p>
      <ul>
        <li>Quais problemas você quer resolver</li>
        <li>Qual o volume de atendimentos atual</li>
        <li>Quais são as perguntas mais frequentes</li>
        <li>Qual o orçamento disponível</li>
      </ul>
      
      <h3>Etapa 2: Escolhendo a plataforma</h3>
      <p>Para PMEs brasileiras, recomendamos:</p>
      
      <h4>Opções Nacionais:</h4>
      <ul>
        <li><strong>Blip (Take):</strong> R$ 49/mês - Excelente suporte em português</li>
        <li><strong>Botmaker:</strong> R$ 97/mês - Interface intuitiva</li>
        <li><strong>Huggy:</strong> R$ 79/mês - Foco em e-commerce</li>
      </ul>
      
      <h4>Opções Internacionais:</h4>
      <ul>
        <li><strong>Tidio:</strong> US$ 29/mês - Ótimo custo-benefício</li>
        <li><strong>Intercom:</strong> US$ 39/mês - Recursos avançados</li>
        <li><strong>Zendesk Chat:</strong> US$ 14/mês - Integração completa</li>
      </ul>
    `,
    tags: ["chatbot", "atendimento", "automação", "pme"],
    categoria_id: "2",
    data_publicacao: "2024-01-15",
    slug: "como-implementar-chatbots-pequenas-empresas-guia-completo",
    imagem_url: "/chatbot-hero.jpg",
    tempo_leitura: 8,
    autor: "Mente Tech",
    status: "PUBLICADO",
    publicado: true,
    visualizacoes: 1250
  },
  {
    id: "2", 
    titulo: "IA Generativa para Criação de Conteúdo: Como PMEs Podem Economizar 70% em Marketing",
    resumo: "Aprenda a usar ferramentas de IA generativa para criar conteúdo profissional para redes sociais, blog e campanhas publicitárias sem precisar de uma agência.",
    conteudo_html: `
      <h2>A Revolução da IA Generativa no Marketing</h2>
      <p>A inteligência artificial generativa chegou para democratizar a criação de conteúdo. Hoje, pequenas e médias empresas podem produzir materiais de marketing de alta qualidade sem depender exclusivamente de agências ou designers caros.</p>
      
      <h2>Principais ferramentas para PMEs</h2>
      
      <h3>Para Textos e Copy</h3>
      <ul>
        <li><strong>ChatGPT:</strong> US$ 20/mês - Ideal para posts, e-mails e descrições</li>
        <li><strong>Jasper AI:</strong> US$ 49/mês - Foco em marketing</li>
        <li><strong>Copy.ai:</strong> US$ 36/mês - Templates prontos</li>
      </ul>
      
      <h3>Para Imagens e Design</h3>
      <ul>
        <li><strong>Midjourney:</strong> US$ 10/mês - Qualidade profissional</li>
        <li><strong>DALL-E 3:</strong> Integrado ao ChatGPT Plus</li>
        <li><strong>Canva AI:</strong> R$ 54,90/mês - Interface brasileira</li>
      </ul>
      
      <h2>Estratégias práticas por canal</h2>
      
      <h3>Instagram e Facebook</h3>
      <p>Crie uma presença consistente com:</p>
      <ul>
        <li>Posts carrossel explicativos sobre seus serviços</li>
        <li>Stories com dicas e bastidores</li>
        <li>Reels educativos sobre seu mercado</li>
        <li>Legendas engajantes com CTAs claros</li>
      </ul>
      
      <h3>LinkedIn (B2B)</h3>
      <ul>
        <li>Artigos de thought leadership</li>
        <li>Posts sobre tendências do setor</li>
        <li>Cases de sucesso e resultados</li>
        <li>Networking estratégico</li>
      </ul>
      
      <h3>Blog Corporativo</h3>
      <ul>
        <li>Artigos SEO otimizados</li>
        <li>Guias e tutoriais</li>
        <li>FAQ expandido</li>
        <li>Cases e depoimentos</li>
      </ul>
    `,
    tags: ["ia generativa", "marketing digital", "conteúdo", "economia"],
    categoria_id: "4", 
    data_publicacao: "2024-01-10",
    slug: "ia-generativa-criacao-conteudo-pmes-economia-marketing",
    imagem_url: "/ai-marketing.jpg",
    tempo_leitura: 12,
    autor: "Mente Tech",
    status: "PUBLICADO",
    publicado: true,
    visualizacoes: 890
  },
  {
    id: "3",
    titulo: "Automação de Vendas com IA: Como Aumentar Conversões em 45% sem Contratar Vendedores",
    resumo: "Descubra como ferramentas de IA podem qualificar leads, nutrir prospects e fechar mais vendas automaticamente, liberando sua equipe para focar em clientes de alto valor.",
    conteudo_html: `
      <h2>O Funil de Vendas Automatizado</h2>
      <p>A automação de vendas com IA não substitui o relacionamento humano, mas potencializa cada etapa do processo comercial. Para PMEs, isso significa poder competir com empresas maiores usando tecnologia inteligente.</p>
      
      <h2>Etapas da automação inteligente</h2>
      
      <h3>1. Captação e Qualificação de Leads</h3>
      <p>Use IA para identificar prospects de qualidade:</p>
      <ul>
        <li><strong>Lead Scoring automático:</strong> Pontue leads com base no comportamento</li>
        <li><strong>Análise de intenção de compra:</strong> Identifique sinais de interesse</li>
        <li><strong>Segmentação inteligente:</strong> Agrupe leads por perfil e necessidade</li>
        <li><strong>Enriquecimento de dados:</strong> Complete informações automaticamente</li>
      </ul>
      
      <h3>2. Nutrição Personalizada</h3>
      <ul>
        <li>E-mails sequenciais personalizados</li>
        <li>Conteúdo baseado no perfil do lead</li>
        <li>Timing otimizado por IA</li>
        <li>Ofertas dinâmicas por segmento</li>
      </ul>
      
      <h3>3. Fechamento Assistido</h3>
      <ul>
        <li>Alertas para oportunidades quentes</li>
        <li>Sugestões de próximos passos</li>
        <li>Previsão de conversão</li>
        <li>Otimização de propostas</li>
      </ul>
      
      <h2>Ferramentas recomendadas</h2>
      
      <h3>CRM com IA</h3>
      <ul>
        <li><strong>HubSpot:</strong> Gratuito até 1M contatos</li>
        <li><strong>Pipedrive:</strong> R$ 65/mês por usuário</li>
        <li><strong>RD Station:</strong> R$ 69/mês - Focado no mercado brasileiro</li>
      </ul>
      
      <h3>Automação de E-mail</h3>
      <ul>
        <li><strong>Mailchimp:</strong> Gratuito até 10k e-mails</li>
        <li><strong>ActiveCampaign:</strong> US$ 15/mês</li>
        <li><strong>ConvertKit:</strong> US$ 25/mês</li>
      </ul>
    `,
    tags: ["automação", "vendas", "crm", "conversão"],
    categoria_id: "1",
    data_publicacao: "2024-01-05", 
    slug: "automacao-vendas-ia-aumentar-conversoes-sem-vendedores",
    imagem_url: "/sales-automation.jpg",
    tempo_leitura: 10,
    autor: "Mente Tech",
    status: "AGENDADO",
    data_publicacao_agendada: "2024-01-28T09:00:00Z",
    publicado: false,
    visualizacoes: 0
  }
];