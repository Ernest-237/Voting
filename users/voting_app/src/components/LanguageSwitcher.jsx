import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    // Basculer entre français et anglais
    const newLanguage = currentLanguage.includes('fr') ? 'en' : 'fr';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="text-white hover:text-[#D6B981] flex items-center space-x-1"
      aria-label="Changer de langue"
    >
      <Globe size={16} />
      <span className="text-sm font-medium">{currentLanguage.includes('fr') ? 'EN' : 'FR'}</span>
    </button>
  );
};

export default LanguageSwitcher;