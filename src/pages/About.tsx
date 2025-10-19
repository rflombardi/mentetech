import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Sparkles, Target, CheckCircle2, Rocket, Lightbulb, Users } from "lucide-react";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout showSidebar={false}>
      {/* SEO Meta Tags */}
      <div className="sr-only">
        <h1>Sobre o Mente Tech - Inteligência Artificial e Tecnologia para PMEs</h1>
      </div>

      <article className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Sobre Nós
          </h1>
          <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full mb-6"></div>
        </div>

        {/* Introduction */}
        <Card className="p-8 md:p-12 mb-8 shadow-elegant">
          <p className="text-lg leading-relaxed text-foreground">
            Seja bem-vindo ao <strong className="text-primary">Mente Tech</strong> — o espaço onde inteligência artificial, ciência e tecnologia se encontram para trazer conteúdo inovador, prático e atual. Nossa missão é descomplicar esses temas e fornecer insights valiosos que ajudem nossos leitores a entender como a tecnologia e a IA estão transformando o cenário das pequenas e médias empresas no Brasil — e como aproveitar essa onda de oportunidades que temos pela frente.
          </p>
        </Card>

        {/* A Nossa História */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">A Nossa História</h2>
          </div>
          
          <div className="space-y-4 text-foreground/90 leading-relaxed">
            <p>
              O Mente Tech nasceu com a visão de ser uma referência em conhecimento sobre inovação tecnológica e avanços científicos. Nossa equipe é formada por especialistas apaixonados por explorar o impacto dessas áreas na vida cotidiana e no mundo dos negócios.
            </p>
            <p>
              Acreditamos que a compreensão profunda e a aplicação prática desses conhecimentos são essenciais para o crescimento pessoal e o sucesso empresarial — especialmente para pequenos e médios empreendedores.
            </p>
          </div>
        </section>

        {/* O que você encontra aqui */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">O que você encontra aqui?</h2>
          </div>
          
          <p className="text-foreground/90 leading-relaxed mb-6">
            Nosso conteúdo é pensado para diferentes perfis — desde entusiastas de tecnologia até profissionais em busca de estratégias para aplicar inovação em seus negócios.
          </p>
          
          <p className="text-foreground/90 leading-relaxed mb-8">
            O Mente Tech oferece atualizações, análises e reflexões sobre:
          </p>

          <div className="space-y-6">
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
              <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                1. Inteligência Artificial
              </h3>
              <p className="text-foreground/90 leading-relaxed">
                Exploramos o universo da IA e suas aplicações práticas: automação de processos, algoritmos em marketing e vendas, análise de dados e muito mais. Trazemos também tendências e cases de como essas tecnologias estão sendo usadas para melhorar a experiência do cliente e otimizar operações empresariais.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-secondary">
              <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                <Rocket className="h-5 w-5 text-secondary" />
                2. Ciência e Tecnologia
              </h3>
              <p className="text-foreground/90 leading-relaxed">
                Com a evolução constante em áreas como 5G, Internet das Coisas (IoT), robótica e segurança digital, oferecemos uma curadoria de novidades e ferramentas que estão moldando o futuro. Nosso foco está em como essas inovações impactam diretamente as pequenas e médias empresas.
              </p>
            </Card>
          </div>
        </section>

        {/* Nossa Visão */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Nossa Visão</h2>
          </div>
          
          <Card className="p-8 md:p-10 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="space-y-4 text-foreground/90 leading-relaxed">
              <p>
                Vivemos em uma era de mudanças sem precedentes. A inovação tecnológica e a transformação dos mercados estão reescrevendo as regras dos negócios — e o Mente Tech existe para ajudar você a entender, se adaptar e crescer nesse novo cenário.
              </p>
              <p>
                Acreditamos que a convergência entre novas tecnologias — especialmente a Inteligência Artificial — e o universo das PMEs está gerando oportunidades reais para empresas e indivíduos. Nosso objetivo é oferecer uma abordagem completa e prática, com informações que possam ser aplicadas tanto em grandes decisões estratégicas quanto no dia a dia do empreendedor.
              </p>
            </div>
          </Card>
        </section>

        {/* O que nos diferencia */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">O que nos diferencia?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">
                  Conteúdo Relevante e Atualizado
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Acompanhamos as principais tendências e transformações tecnológicas, publicando regularmente artigos com análises aprofundadas e foco no impacto para PMEs.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">
                  Visão Prática e Aplicável
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Nossos conteúdos são construídos para uso real: ajudam você a melhorar sua estratégia, aplicar IA no negócio, entender o mercado e tomar decisões mais informadas.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">
                  Compromisso com a Comunidade
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Valorizamos o aprendizado colaborativo e incentivamos o diálogo entre leitores. Nossa comunidade é o espaço ideal para trocar ideias e crescer junto com outros apaixonados por tecnologia.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Junte-se ao Mente Tech */}
        <section className="mb-12">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/30 shadow-elegant">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <Rocket className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground text-center">
                Junte-se ao Mente Tech
              </h2>
            </div>
            
            <div className="space-y-4 text-center max-w-3xl mx-auto">
              <p className="text-lg text-foreground/90 leading-relaxed">
                Se você é curioso sobre tecnologia, trabalha com inovação ou apenas quer entender como a IA e a ciência estão transformando o mundo dos negócios, este blog é feito para você.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed">
                Aqui no Mente Tech, acreditamos que <strong className="text-primary">o conhecimento transforma</strong>. Por isso, estamos comprometidos em entregar conteúdo de qualidade, acessível e relevante — sempre com o propósito de ajudar você a inovar, crescer e transformar.
              </p>
            </div>
          </Card>
        </section>
      </article>
    </Layout>
  );
};

export default About;
