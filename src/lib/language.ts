export const changeLanguage = (newLanguage: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', newLanguage);
    
    // Custom event yuborish
    const event = new CustomEvent('languageChange', { detail: newLanguage });
    window.dispatchEvent(event);
  }
};

export const getCurrentLanguage = (): string => {
  if (typeof window === 'undefined') return 'uz';
  return localStorage.getItem('language') || 'uz';
};