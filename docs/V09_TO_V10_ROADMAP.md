# Portal profissional — plano v0.9 e passagem para v1.0

## Projeto
- Repositório: `sacramento-mlp/sacramento-mlp.github.io`, branch `main`
- Website: https://sacramento-mlp.github.io/
- Tecnologia: Astro 5, TypeScript, GitHub Pages / GitHub Actions
- Identidade visual: D4 aprovada, PNG original em `public/brand/ms-logo.png`. Não substituir nem redesenhar sem aprovação.
- Idiomas: inglês por defeito, português europeu alternável.
- Temas: escuro por defeito, tema claro alternável.
- Cabeçalho e rodapé: componentes partilhados.
- Escopo: portfólio profissional, currículo, produtos e biblioteca editorial. Não criar páginas de venda falsas nem anunciar produtos incompletos como disponíveis.

## Histórico validado pelo utilizador
- v0.7: componentes comuns, navegação e tipografia mais equilibrada.
- v0.8: melhorias de acessibilidade, focos, contraste, navegação móvel e verificações automáticas.
- Última confirmação comunicada pelo utilizador: execução do GitHub Actions a verde antes do início da v0.9.
- Atenção: `docs/V08_QA_CHECKLIST.md` ainda exige validação manual em navegadores e medições Lighthouse. Uma Action verde não comprova WCAG nem desempenho medido.

## v0.9 — Biblioteca e descoberta
1. v0.9.1: `sitemap.xml`, `robots.txt`, `rss.xml` e verificações de rotas geradas; estes recursos usam apenas `publishedArticles`.
2. v0.9.2: **implementada, a aguardar validação do GitHub Actions** — pesquisa bilingue sem acentos, filtros por categoria e estado sem resultados na página `/artigos/`. Sem artigos publicados, mantém-se o estado editorial vazio, sem filtros visíveis. A aprovação editorial é reforçada por `src/data/publication-approvals.json` e verificada no build.
3. v0.9.3: **implementação de metadados e verificações guardada, publicação a confirmar** — canonical, Open Graph e cartões sociais de resumo em todas as páginas, testes de SEO no build, checklist em `docs/V093_SEO_QA.md`. A revisão real em Android/desktop e as medições Lighthouse permanecem pendentes; não declarar v0.9 totalmente aceite sem estes ensaios.
4. Revisão de publicação e segurança: verificar que um artigo não aprovado não gera URL, RSS nem sitemap. O ficheiro `src/data/articles.ts` contém atualmente um rascunho com `published: false`. **A origem do repositório é pública; este sistema não é adequado para rascunhos confidenciais.**

## Antes da v1.0
- GitHub Actions aprovado na última alteração.
- Revisão manual de todas as páginas e dos dois temas, PT/EN, em Android e desktop.
- Verificação de acessibilidade por teclado e leitores de ecrã quando disponíveis.
- Medições reais de desempenho, com limitações documentadas.
- Rever conteúdo de produtos, apresentação do currículo e preparação editorial.
- Nenhum artigo pode ser publicado sem autorização explícita.

## Instrução de transição entre conversas
**Quando a v1.0 estiver pronta para ser iniciada**, criar um documento de passagem atualizado, incluindo:
- Estado de implementação por fase e pendências.
- Último commit, estado do CI e URLs de validação.
- Decisões aprovadas, identidade D4 e restrições editoriais.
- Inventário de ficheiros, arquitetura e comandos de testes.
- Lista de riscos, limitações, decisões em aberto e próximas tarefas.
- Prompt de continuação para nova conversa no ChatGPT.

Não iniciar a implementação da v1.0 nesta conversa depois da decisão de transição; a nova conversa será usada para essa fase, conforme pedido do utilizador.

## Última intervenção v0.9.3
- Atualizados os cinco templates Astro com metadados de partilha uniformes.
- Adicionados testes para canonical e Open Graph nas seis rotas públicas obrigatórias.
- Não foi criada nova imagem de partilha nem publicado qualquer artigo.
- Antes de abrir a nova conversa para v1.0, confirmar a execução GitHub Actions posterior a estas alterações e atualizar o commit de referência.
