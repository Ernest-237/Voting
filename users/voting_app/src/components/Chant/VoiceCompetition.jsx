import { useState, useEffect } from 'react';
import { Heart, X, Check, ChevronRight, Instagram, Facebook, Twitter, User, BookOpen, Award, Calendar, Menu, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Importez useTranslation
import MonetbilPayment from '../Candidates/MonetbilPayment/';
import LanguageSwitcher from '../LanguageSwitcher';

const VoiceCompetition = () => {

     // Utilisez le hook useTranslation
     const { t, i18n } = useTranslation();
  
    // État pour le menu mobile
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Données des candidats (chanteurs)
  const [candidates] = useState([
    {
      id: 1,
      name: "Jean D.",
      team: "Team Lion",
      number: "01",
      photoUrl: "/voice-contestant1.jpg",
      votes: 324,
      description: "Voix puissante spécialisée dans le gospel et la soul. A remporté plusieurs compétitions locales.",
      type: "solo"
    },
    {
      id: 2,
      name: "Marie K.",
      team: "Team Elephant",
      number: "02",
      photoUrl: "/voice-contestant2.jpg",
      votes: 278,
      description: "Artiste polyvalente maîtrisant le jazz et la pop. Connue pour ses interprétations émouvantes.",
      type: "solo"
    },
    {
      id: 3,
      name: "Les Frères B.",
      team: "Team Lion",
      number: "03",
      photoUrl: "/voice-group1.jpg",
      votes: 198,
      description: "Duo fraternel spécialisé dans les harmonies vocales et les reprises acoustiques.",
      type: "group"
    },
    {
      id: 4,
      name: "Sara M.",
      team: "Team Gazelle",
      number: "04",
      photoUrl: "/voice-contestant3.jpg",
      votes: 245,
      description: "Jeune talent avec une voix cristalline, spécialiste des ballades romantiques.",
      type: "solo"
    }
  ]);

  // État pour les modals
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voterName, setVoterName] = useState("");
  const [voterPhone, setVoterPhone] = useState("");
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteAmount, setVoteAmount] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Gestion du vote
  const handleVoteClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowVoteModal(true);
    setVoterName("");
    setVoterPhone("");
    setVoteSuccess(false);
    setVoteAmount(1);
  };

  // Soumettre le vote
  const submitVote = (e) => {
    e.preventDefault();
    
    if (!voterName.trim()) {
      alert(t('vote.validation.nameRequired'));
      return;
    }

    if (!selectedCandidate) {
      alert(t('vote.validation.noCandidate'));
      return;
    }
    
    setShowVoteModal(false);
    setTimeout(() => {
      setShowPaymentModal(true);
    }, 300);
  };

  // Gérer le succès du paiement
  const handlePaymentSuccess = (transactionData) => {
    // Ici vous pourriez envoyer les données au backend
    setVoteSuccess(true);
    setShowPaymentModal(false);
    setShowVoteModal(true);
    
    setTimeout(() => {
      setShowVoteModal(false);
      setSelectedCandidate(null);
    }, 3000);
  };

  // Toggle pour le menu mobile
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">

         {/* Header */}
               <header className="bg-[#96172E] text-white">
                 <div className="container mx-auto">
                   {/* Top Bar */}
                   <div className="flex justify-between items-center py-2 px-4 text-sm border-b border-opacity-20 border-white">
                     <div className="flex space-x-4">
                       <a href="tel:+237000000000" className="hover:text-[#D6B981]">+237 000 000 000</a>
                       <a href="mailto:contact@hitbamas.org" className="hover:text-[#D6B981]">contact@hitbamas.org</a>
                     </div>
         
                     {/* Ajout du sélecteur de langue */}
                     <LanguageSwitcher />
         
                     <div className="hidden md:flex space-x-4">
                       <a href="#" className="hover:text-[#D6B981] flex items-center">
                         <Facebook size={16} className="mr-1" /> Facebook
                       </a>
                       <a href="#" className="hover:text-[#D6B981] flex items-center">
                         <Instagram size={16} className="mr-1" /> Instagram
                       </a>
                       <a href="#" className="hover:text-[#D6B981] flex items-center">
                         <Twitter size={16} className="mr-1" /> Twitter
                       </a>
                     </div>
                   </div>
                   
                   {/* Main Navigation */}
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
                     
                     <button 
                       className="md:hidden text-white hover:text-[#D6B981]"
                       onClick={toggleMobileMenu}
                     >
         
                        {/* Sélecteur de langue pour mobile */}
                        <LanguageSwitcher />
         
                       <Menu size={24} />
                     </button>
                   </div>
                   
                   {/* Menu mobile */}
                    {mobileMenuOpen && (
                     <div className="md:hidden bg-[#96172E] py-2 px-4 animate-fadeIn">
                       <nav className="flex flex-col space-y-3 pb-4">
                         <a href="#" className="hover:text-[#D6B981] font-medium py-2 border-b border-white/10" onClick={toggleMobileMenu}>{t('header.menu.home')}</a>
                         <a href="#candidates" className="hover:text-[#D6B981] font-medium py-2 border-b border-white/10" onClick={toggleMobileMenu}>{t('header.menu.candidates')}</a>
                         <a href="#masters" className="hover:text-[#D6B981] font-medium py-2 border-b border-white/10" onClick={toggleMobileMenu}>{t('header.menu.masters')}</a>
                         <a href="#how-to-vote" className="hover:text-[#D6B981] font-medium py-2 border-b border-white/10" onClick={toggleMobileMenu}>{t('header.menu.howToVote')}</a>
                         <a href="#" className="hover:text-[#D6B981] font-medium py-2" onClick={toggleMobileMenu}>{t('header.menu.contact')}</a>
                         <div className="flex space-x-4 pt-2">
                           <a href="#" className="hover:text-[#D6B981] flex items-center">
                             <Facebook size={16} />
                           </a>
                           <a href="#" className="hover:text-[#D6B981] flex items-center">
                             <Instagram size={16} />
                           </a>
                           <a href="#" className="hover:text-[#D6B981] flex items-center">
                             <Twitter size={16} />
                           </a>
                         </div>
                       </nav>
                     </div>
                   )}
                 </div>
               </header>

               
      {/* Hero Section */}
      <section className="relative h-80 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img 
            src="/voice-banner.jpg" 
            alt="The Voice Competition Banner" 
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">{t('voiceCompetition.title')}</h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-2xl">{t('voiceCompetition.subtitle')}</p>
          <a 
            href="#contestants" 
            className="inline-flex items-center bg-[#96172E] hover:bg-[#7d1427] text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-full transition-colors"
          >
            {t('voiceCompetition.voteNow')}
            <ChevronRight size={20} className="ml-2" />
          </a>
        </div>
      </section>

      {/* Comment voter */}
      <section id="how-to-vote" className="py-12 md:py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800">{t('voiceCompetition.howToVote')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#D6B981]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={24} className="text-[#96172E]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('voiceCompetition.step1')}</h3>
              <p className="text-gray-600">{t('voiceCompetition.step1Desc')}</p>
            </div>
            
            <div className="text-center p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#D6B981]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={24} className="text-[#96172E]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('voiceCompetition.step2')}</h3>
              <p className="text-gray-600">{t('voiceCompetition.step2Desc')}</p>
            </div>
            
            <div className="text-center p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#D6B981]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={24} className="text-[#96172E]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('voiceCompetition.step3')}</h3>
              <p className="text-gray-600">{t('voiceCompetition.step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contestants Section */}
      <section id="contestants" className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{t('voiceCompetition.contestants')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('voiceCompetition.contestantsDesc')}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {candidates.map((candidate) => (
              <div 
                key={candidate.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <Link to={`/contestant/${candidate.id}`} className="block">
                  <div className="relative">
                    <img 
                      src={candidate.photoUrl}
                      alt={candidate.name} 
                      className="w-full h-64 object-cover group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute top-0 left-0 bg-[#96172E] text-white px-3 py-1 font-bold">
                      N°{candidate.number}
                    </div>
                    <div className="absolute top-0 right-0 bg-white/80 backdrop-blur-sm px-3 py-1 m-2 rounded-full flex items-center space-x-1">
                      <Heart size={16} className="text-[#96172E]" />
                      <span className="font-semibold text-gray-800">{candidate.votes}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{candidate.name}</h3>
                    <p className="text-gray-600 mb-2 flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#96172E]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      {candidate.team}
                    </p>
                  </div>
                </Link>
                
                <div className="px-4 pb-4">
                  <button 
                    onClick={() => handleVoteClick(candidate)}
                    className="w-full py-2 bg-[#96172E] hover:bg-[#7d1427] text-white font-medium rounded transition-colors flex items-center justify-center space-x-2"
                  >
                    <Heart size={18} />
                    <span>{t('vote.button')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vote Modal */}
      {showVoteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {voteSuccess ? t('vote.thanks') : `${t('vote.for')} ${selectedCandidate?.name || ''}`}
                </h3>
                <button 
                  onClick={() => setShowVoteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              {voteSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={24} className="text-blue-600" />
                  </div>
                  <p className="text-gray-700 text-lg mb-2">{t('vote.success')}</p>
                  <p className="text-gray-500 text-sm">{t('vote.appreciation')}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src={selectedCandidate?.photoUrl} 
                      alt={selectedCandidate?.name} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{selectedCandidate?.name}</h4>
                      <p className="text-sm text-gray-500">{selectedCandidate?.team} • N°{selectedCandidate?.number}</p>
                    </div>
                  </div>
                  
                  <form onSubmit={submitVote}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('vote.form.name')}
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={voterName}
                          onChange={(e) => setVoterName(e.target.value)}
                          required
                          className="px-4 py-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={t('vote.form.namePlaceholder')}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                          {t('vote.form.voteCount')}
                        </label>
                        <select
                          id="amount"
                          value={voteAmount}
                          onChange={(e) => setVoteAmount(e.target.value)}
                          className="px-4 py-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="1">1 {t('vote.form.vote')} (100 FCFA)</option>
                          <option value="5">5 {t('vote.form.votes')} (450 FCFA)</option>
                          <option value="10">10 {t('vote.form.votes')} (800 FCFA)</option>
                          <option value="25">25 {t('vote.form.votes')} (1 800 FCFA)</option>
                        </select>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {t('vote.form.terms')}
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#1a3a6e] hover:bg-blue-800 text-white font-medium rounded transition-colors flex items-center justify-center space-x-2"
                      >
                        <Heart size={18} />
                        <span>{t('vote.form.confirm')}</span>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <MonetbilPayment
          selectedCandidate={selectedCandidate}
          voteAmount={voteAmount}
          voterName={voterName}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={() => {
            setShowPaymentModal(false);
            setShowVoteModal(true);
          }}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default VoiceCompetition;