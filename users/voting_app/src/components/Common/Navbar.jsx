// components/Navbar.jsx
import { useState } from 'react';
import { Facebook, Instagram, Twitter, Menu } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="bg-[#96172E] text-white">
      <div className="container mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-2 px-4 text-sm border-b border-opacity-20 border-white">
          <div className="flex space-x-4">
            <a href="tel:+237000000000" className="hover:text-[#D6B981]">+237 000 000 000</a>
            <a href="mailto:contact@hitbamas.org" className="hover:text-[#D6B981]">contact@hitbamas.org</a>
          </div>
          <LanguageSwitcher />
          <div className="hidden md:flex space-x-4">
            <a href="#" className="hover:text-[#D6B981] flex items-center"><Facebook size={16} className="mr-1" /> Facebook</a>
            <a href="#" className="hover:text-[#D6B981] flex items-center"><Instagram size={16} className="mr-1" /> Instagram</a>
            <a href="#" className="hover:text-[#D6B981] flex items-center"><Twitter size={16} className="mr-1" /> Twitter</a>
          </div>
        </div>

        {/* Main Nav */}
        <div className="flex justify-between items-center py-4 px-4">
          <a href="#" className="text-xl md:text-2xl font-bold flex items-center">
            <img src="/hitlogo.jpeg" alt="HITBAMAS" className="h-10 mr-2" />
            <span className="hidden md:inline">MISS MASTER HITBAMAS</span>
            <span className="md:hidden">HITBAMAS</span>
          </a>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-[#D6B981] font-medium">{t('header.menu.home')}</a>
            <a href="#candidates" className="hover:text-[#D6B981] font-medium">{t('header.menu.candidates')}</a>
            <a href="#masters" className="hover:text-[#D6B981] font-medium">{t('header.menu.masters')}</a>
            <a href="#how-to-vote" className="hover:text-[#D6B981] font-medium">{t('header.menu.howToVote')}</a>
            <a href="#" className="hover:text-[#D6B981] font-medium">{t('header.menu.contact')}</a>
          </nav>
          <button className="md:hidden text-white hover:text-[#D6B981]" onClick={toggleMobileMenu}>
            <LanguageSwitcher />
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#96172E] py-2 px-4 animate-fadeIn">
            <nav className="flex flex-col space-y-3 pb-4">
              <a href="#" className="hover:text-[#D6B981]" onClick={toggleMobileMenu}>{t('header.menu.home')}</a>
              <a href="#candidates" className="hover:text-[#D6B981]" onClick={toggleMobileMenu}>{t('header.menu.candidates')}</a>
              <a href="#masters" className="hover:text-[#D6B981]" onClick={toggleMobileMenu}>{t('header.menu.masters')}</a>
              <a href="#how-to-vote" className="hover:text-[#D6B981]" onClick={toggleMobileMenu}>{t('header.menu.howToVote')}</a>
              <a href="#" className="hover:text-[#D6B981]" onClick={toggleMobileMenu}>{t('header.menu.contact')}</a>
              <div className="flex space-x-4 pt-2">
                <a href="#"><Facebook size={16} /></a>
                <a href="#"><Instagram size={16} /></a>
                <a href="#"><Twitter size={16} /></a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
