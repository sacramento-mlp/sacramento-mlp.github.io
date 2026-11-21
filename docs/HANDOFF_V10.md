# HANDOFF — Portal profissional Mário Sacramento — da v0.9 para a v1.0

**Estado:** v0.9 aceite pelo utilizador em 21/11/2026. Iniciar a implementação da v1.0 apenas na **nova conversa ChatGPT**. Este documento é a fonte de passagem de contexto, não uma autorização para publicar artigos ou alterar a marca.

## 1. Identificação
- Repositório GitHub: `sacramento-mlp/sacramento-mlp.github.io`
- Branch de trabalho atual: `main`
- Website: https://sacramento-mlp.github.io/
- GitHub Actions: https://github.com/sacramento-mlp/sacramento-mlp.github.io/actions
- Stack: Astro 5 + TypeScript + CSS + JavaScript progressivo, deploy estático para GitHub Pages.
- GitHub Actions: checkout, Node 22, `npm install`, auditoria de contraste, `astro build`, verificação dos ficheiros publicados, envio/deploy para GitHub Pages.
- O utilizador confirmou que a publicação da v0.9.3 ficou **verde**. É confirmação comunicada pelo utilizador, não auditoria externa independente nem garantia de comportamento em todos os dispositivos.

## 2. Decisões aprovadas (não alterar sem autorização)
1. Identidade visual **D4**, azul/ciano, imagem original `public/brand/ms-logo.png`; não criar aproximações nem substituir o logótipo.
2. Símbolo MS **e** nome «Mário Sacramento» no cabeçalho. Evitar repetições gratuitas do nome nas apresentações.
3. Tipografia moderada: títulos profissionais e equilibrados, não excessivamente grandes.
4. Tema escuro (Dark) por defeito; tema claro alternável. Inglês por defeito, português europeu como segunda língua.
5. Menu e rodapé reutilizáveis, aspeto responsivo, boa experiência em Android e computador.
6. Não realizar despesas. Não anunciar ferramentas inacabadas como produtos disponíveis para aquisição.
7. Artigos publicáveis **apenas mediante autorização editorial expressa**. Publicação e vendas de software não estão autorizadas por esta aprovação da versão.
8. v1.0: **nova conversa**; concluir esta transferência antes de implementar alterações dessa versão.

## 3. Estado funcional confirmado no código do repositório
- Página principal: `src/pages/index.astro` com áreas Sobre, Currículo (ligação), Produtos, Artigos e Contacto.
- Currículo: `src/pages/cv.astro`; descrição técnica, sem inventar formação ou histórico profissional.
- Produtos: `src/pages/produtos/[slug].astro` para `diskguardian`, `windows-technical-toolkit` e `domain-admin-toolkit`. Âmbitos separados.
- Biblioteca: `src/pages/artigos/index.astro`; detalhes `src/pages/artigos/[slug].astro`.
- Catálogo editorial: `src/data/articles.ts`; atualmente tem um exemplo com `published: false`.
- Lista de aprovação: `src/data/publication-approvals.json` atualmente `approvedSlugs: []`.
- Pesquisa local bilingue e filtros por categoria, apenas quando existem artigos públicos: `public/js/articles-filter.js`. Sem dependência de serviços externos de pesquisa.
- Idioma/temas: `public/js/preferences.js` e `public/js/preferences-init.js`.
- Cabeçalho/rodapé: `src/components/SiteHeader.astro` e `SiteFooter.astro`.
- Estilos: `src/styles/global.css` agrega `foundation.css`, `homepage.css`, `mobile.css`, `products.css`, `resume.css`, `articles.css`.
- Sitemap, RSS, robots: `src/pages/sitemap.xml.ts`, `src/pages/rss.xml.ts`, `public/robots.txt`.
- Metadados: canonical, Open Graph e cartões textuais de partilha social nas páginas. Sem imagem `og:image` dedicada.
- SEO não equivale a indexação garantida; só são geradas URLs e entradas de artigo se `published` for verdadeiro.

## 4. Testes e comandos
```bash
npm install
npm run verify:contrast
npm run build
npm run verify:dist
npm run check
```
- `scripts/verify-contrast.mjs` verifica os tokens textuais principais dos temas Dark e Light.
- `scripts/verify-dist.mjs` verifica as seis rotas obrigatórias, os ficheiros públicos, a navegação, o foco, metadados, sitemap, RSS, robots e o allowlist editorial.
- Consultar o último workflow para o **SHA do commit em execução**; não presumir que um teste verde anterior valida futuros commits.
- `npm run check` existe mas pode requerer validação específica; o workflow de deploy usa os outros comandos.

## 5. Editorial e segurança
- Não alterar `published: false` nem adicionar slugs a `approvedSlugs` sem autorização específica.
- Os rascunhos em `src/data/articles.ts` estão em **repositório público**: o sinalizador `published: false` impede rotas públicas, não oculta o texto-fonte no GitHub. Nunca colocar rascunhos confidenciais ou dados privados no repositório.
- Os testes de `verify:dist` são uma segunda proteção e não substituem a decisão editorial.
- Documentação: `docs/ARTICLES_EDITORIAL.md`.

## 6. Pendências / limites importantes
- Ainda não há relatórios Lighthouse de desempenho e acessibilidade anexados, nem certificação WCAG. O utilizador comunicou validação geral, mas não foram fornecidas medições detalhadas.
- Revalidar manualmente Android Chrome, desktop, PT/EN, Dark/Light, navegação por teclado, tamanho dos títulos e preservação do monograma D4.
- As redes sociais usam cartões textuais; criar imagem de partilha D4 só com conceito aprovado, sem substituir a marca.
- Rever SEO, textos e factos do CV/produtos antes de comunicação ou comercialização. O portal não prova qualificações, resultados comerciais nem disponibilidade de produtos.
- Evitar reabrir problemas anteriores do cabeçalho partilhado, importações relativas de `/artigos/` e regeneração do catálogo.
- Documentos de referência: `docs/V08_QA_CHECKLIST.md`, `docs/V093_SEO_QA.md`, `docs/V09_TO_V10_ROADMAP.md`.

## 7. Proposta de prioridades da v1.0 (a decidir na nova conversa)
1. Confirmar o último SHA e o estado de Actions, abrir o website real em dispositivos relevantes e estabelecer linha de base de desempenho.
2. Resolver eventuais problemas detetados, sem alterar a identidade aprovada.
3. Decidir a arquitetura de conteúdos a longo prazo (catálogo editorial, edição segura e processo de aprovação).
4. Planear conteúdo original e profissional para o portfólio e artigos **sem publicar nada sem aprovação**.
5. Rever social preview D4, qualidade de partilha, métricas com privacidade e distribuição/SEO com evidência.
6. Definir critérios objetivos de aceitação da v1.0 antes de escrever funcionalidades.

## 8. Registo de versões
- v0.7: navegação e rodapé comuns, correção de páginas, hierarquia visual e títulos equilibrados.
- v0.8: melhorias progressivas de teclado, foco, mobile e contraste; verificações CI.
- v0.9.1: sitemap, robots e RSS.
- v0.9.2: pesquisa e filtros bilingues, testes da lista de aprovação editorial.
- v0.9.3: canonical, Open Graph, cartão de partilha textual, testes SEO, checklist de publicação.
- Aceitação comunicada da v0.9: **21/11/2026**.
- O commit-base de implementação v0.9.3 anterior ao documento de passagem: `116ae0cd81a9c1ca98940fffe09d011678191998`. Este documento e eventuais commits de documentação posteriores terão SHAs mais recentes; verificar `main` ao iniciar.

## 9. Prompt para colar na nova conversa
> Vamos iniciar a v1.0 do meu portal profissional Mário Sacramento, no repositório GitHub `sacramento-mlp/sacramento-mlp.github.io`. Antes de alterar código, lê integralmente `docs/HANDOFF_V10.md`, `docs/V09_TO_V10_ROADMAP.md`, `docs/V093_SEO_QA.md` e `docs/ARTICLES_EDITORIAL.md` diretamente do GitHub; verifica o último commit da branch `main` e o estado do GitHub Actions. Mantém a identidade D4 e o logótipo original, nome no cabeçalho, títulos equilibrados, Dark/EN por defeito, PT e Light como alternativas, e a decisão de não realizar despesas nem publicar artigos ou disponibilizar produtos sem aprovação. Apresenta um plano e critérios de aceitação para a v1.0 e só depois inicia alterações dentro do âmbito autorizado. Não infiras testes Lighthouse, certificação WCAG ou aprovações editoriais que não existem.
