export type Article = {
  slug: string;
  date: string;
  category: 'windows' | 'powershell' | 'security' | 'development';
  readMinutes: number;
  published: boolean;
  title: { en: string; pt: string };
  summary: { en: string; pt: string };
  sections: { heading: { en: string; pt: string }; paragraphs: { en: string; pt: string }[] }[];
};

/**
 * Editorial catalog.
 * Only articles with published: true appear publicly.
 * Never include unreviewed claims, private data or untested commands.
 */
export const articles: Article[] = [
  {
    slug: 'check-windows-storage-safely',
    date: '2026-11-20',
    category: 'windows',
    readMinutes: 4,
    published: false,
    title: { en: 'How to check Windows storage safely', pt: 'Como verificar o armazenamento do Windows em segurança' },
    summary: { en: 'A practical, non-destructive checklist to understand disk usage before removing any files.', pt: 'Uma lista de verificação prática e não destrutiva para compreender a utilização do disco antes de eliminar ficheiros.' },
    sections: [
      {
        heading: { en: 'Start with Windows Settings', pt: 'Começa pelas Definições do Windows' },
        paragraphs: [
          { en: 'Open Settings, go to System and select Storage. Windows shows the space used by installed applications, temporary files and other categories. The exact labels can vary by Windows version.', pt: 'Abre as Definições, acede a Sistema e seleciona Armazenamento. O Windows apresenta o espaço utilizado por aplicações instaladas, ficheiros temporários e outras categorias. Os nomes podem variar consoante a versão do Windows.' },
          { en: 'Use this overview to identify where space is being consumed. Do not remove folders merely because they appear large.', pt: 'Utiliza esta vista geral para perceber onde está a ser ocupado o espaço. Não elimines pastas apenas por terem um tamanho elevado.' }
        ]
      },
      {
        heading: { en: 'Check before cleaning', pt: 'Verifica antes de limpar' },
        paragraphs: [
          { en: 'Confirm that important documents are backed up, check which account owns the files and avoid manually deleting unknown system folders.', pt: 'Confirma que os documentos importantes têm cópia de segurança, verifica a que conta pertencem os ficheiros e evita eliminar manualmente pastas de sistema desconhecidas.' },
          { en: 'If you use the built-in temporary files screen, review each selected category before confirming removal. Downloads and Recycle Bin contents may contain files you still need.', pt: 'Se utilizares a área de ficheiros temporários integrada no Windows, revê cada categoria selecionada antes de confirmar a remoção. A pasta Transferências e a Reciclagem podem conter ficheiros de que ainda precisas.' }
        ]
      },
      {
        heading: { en: 'Make changes gradually', pt: 'Faz alterações gradualmente' },
        paragraphs: [
          { en: 'Prefer uninstalling applications through Windows Settings rather than deleting their program folders. After each change, check free space again and make sure your applications still work.', pt: 'Prefere desinstalar aplicações através das Definições do Windows em vez de eliminar as respetivas pastas. Depois de cada alteração, verifica novamente o espaço livre e confirma que as aplicações continuam a funcionar.' }
        ]
      }
    ]
  }
];
export const publishedArticles = articles.filter(article => article.published);
