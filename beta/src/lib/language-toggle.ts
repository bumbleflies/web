export type SiteLanguage = 'DE' | 'EN';

interface LanguagePathOptions {
  clickedLanguage: SiteLanguage;
  currentPath: string;
  dePath?: string;
  enPath?: string;
}

/**
 * Prefer a page's explicitly declared translation path. This is necessary for
 * translated pages whose German and English slugs differ.
 */
export function getLanguageTogglePath({
  clickedLanguage,
  currentPath,
  dePath,
  enPath,
}: LanguagePathOptions): string {
  const currentLanguage: SiteLanguage = currentPath.startsWith('/en') ? 'EN' : 'DE';
  const targetLanguage: SiteLanguage = clickedLanguage === currentLanguage
    ? (currentLanguage === 'DE' ? 'EN' : 'DE')
    : clickedLanguage;
  const targetPath = targetLanguage === 'DE' ? dePath : enPath;

  if (targetPath) return targetPath;

  return targetLanguage === 'EN'
    ? (currentPath === '/' ? '/en/' : `/en${currentPath}`)
    : (currentPath.replace(/^\/en/, '') || '/');
}
