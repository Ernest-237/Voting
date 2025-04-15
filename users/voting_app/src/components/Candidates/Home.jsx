import { useState, useEffect } from 'react';
import { Heart, X, Check, ChevronRight, Instagram, Facebook, Twitter, User, BookOpen, Award, Calendar, Menu, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Importez useTranslation
import MonetbilPayment from './MonetbilPayment';
import LanguageSwitcher from '../LanguageSwitcher';

const BASE_URL = 'http://localhost:3001'; // à adapter si besoin

const Home = () => {
  // États pour les candidats et le chargement
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

   // État pour le modal de vote et paiement
   const [showVoteModal, setShowVoteModal] = useState(false);
   const [selectedCandidate, setSelectedCandidate] = useState(null);
   const [voterName, setVoterName] = useState("");
   const [voterPhone, setVoterPhone] = useState("");
   const [voteSuccess, setVoteSuccess] = useState(false);
   const [voteAmount, setVoteAmount] = useState(1);
   const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Charger tous les candidats depuis l'API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        // Récupérer toutes les catégories actives
        const categoriesResponse = await fetch(`${BASE_URL}/api/admin/categories`);
        if (!categoriesResponse.ok) {
          throw new Error('Erreur lors du chargement des catégories');
        }
        const categoriesData = await categoriesResponse.json();
        
        if (!categoriesData.success || !categoriesData.data) {
          throw new Error('Aucune catégorie trouvée');
        }
        
        // Pour chaque catégorie, récupérer les candidats
        const allCandidatesPromises = categoriesData.data
          .filter(cat => cat.active)
          .map(async (category) => {
            const response = await fetch(`${BASE_URL}/api/candidates/${category.name}`);
            if (!response.ok) return [];
            const data = await response.json();
            return data.success ? data.data : [];
          });
        
        const allCandidatesArrays = await Promise.all(allCandidatesPromises);
        const allCandidates = allCandidatesArrays.flat();
        
        setCandidates(allCandidates);
      } catch (err) {
        console.error("Erreur lors du chargement des candidats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Filtrer les candidats par type
  const missCandidates = candidates.filter(candidate => candidate.type === "miss");
  const masterCandidates = candidates.filter(candidate => candidate.type === "master");

  // Gestion du vote
  const handleVoteClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowVoteModal(true);
    setVoterName("");
    setVoterPhone("");
    setVoteSuccess(false);
    setVoteAmount(1);
  };

  // Soumettre le vote et passer au paiement
  const submitVote = (e) => {
    e.preventDefault();

    // Validation
    if (!voterName.trim()) {
      alert("Veuillez entrer votre nom");
      return;
    }

    if (!selectedCandidate) {
      alert("Aucun candidat sélectionné");
      return;
    }
    
    // Passer à l'étape de paiement
    setShowVoteModal(false);
    setTimeout(() => {
      setShowPaymentModal(true);
    }, 300);
  };

  // Gérer le succès du paiement
  const handlePaymentSuccess = async (transactionData) => {
    try {
      // Enregistrer le vote dans la base de données
      const response = await fetch(`${BASE_URL}/api/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId: selectedCandidate.id,
          voterName,
          voterPhone,
          voteCount: parseInt(voteAmount),
          amount: getAmount(voteAmount),
          transactionId: transactionData?.transaction_UUID || 'test-transaction'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement du vote');
      }

      // Mettre à jour localement seulement après confirmation du serveur
      const updatedCandidates = candidates.map(c => {
        if (c.id === selectedCandidate.id) {
          return {...c, votes: (c.votes || 0) + parseInt(voteAmount)};
        }
        return c;
      });
      
      setCandidates(updatedCandidates);

      // Fermer d'abord le modal de paiement
      setVoteSuccess(false);

        // Ensuite afficher le message de succès
      setShowVoteModal(true);
      setShowPaymentModal(true);
      
      // Fermer automatiquement après quelques secondes
      setTimeout(() => {
        setShowVoteModal(false);
        setSelectedCandidate(null);
      }, 3000);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de l'enregistrement de votre vote");
      setShowPaymentModal(false);
      setShowVoteModal(true);
    }
  };

  // Helper pour obtenir le montant
  const getAmount = (votes) => {
    switch(parseInt(votes)) {
      case 1: return 100;
      case 5: return 450;
      case 10: return 800;
      case 25: return 1800;
      default: return 100;
    }
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
              <a href="#" className="hover:text-[#D6B981] font-medium">Accueil</a>
              <a href="#candidates" className="hover:text-[#D6B981] font-medium">Candidates</a>
              <a href="#masters" className="hover:text-[#D6B981] font-medium">Masters</a>
              <a href="#" className="hover:text-[#D6B981] font-medium">Comment Voter</a>
              <a href="#" className="hover:text-[#D6B981] font-medium">Contact</a>
            </nav>
            
            <div className="md:hidden flex items-center">
              <button 
                className="text-white hover:text-[#D6B981]"
                onClick={toggleMobileMenu}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
          
          {/* Menu mobile */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#96172E] py-2 px-4">
              <nav className="flex flex-col space-y-3 pb-4">
                <a href="#" className="hover:text-[#D6B981] font-medium py-2 border-b border-white/10" onClick={toggleMobileMenu}>Accueil</a>
                <a href="#candidates" className="hover:text-[#D6B981] font-medium py-2 border-b border-white/10" onClick={toggleMobileMenu}>Candidates</a>
                <a href="#masters" className="hover:text-[#D6B981] font-medium py-2 border-b border-white/10" onClick={toggleMobileMenu}>Masters</a>
                <a href="#" className="hover:text-[#D6B981] font-medium py-2 border-b border-white/10" onClick={toggleMobileMenu}>Comment Voter</a>
                <a href="#" className="hover:text-[#D6B981] font-medium py-2" onClick={toggleMobileMenu}>Contact</a>
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

      {/* Hero Banner */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img 
            src="/hitlogo.jpeg" 
            alt="Miss Master HITBAMAS Banner" 
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Miss & Master HITBAMAS 2025</h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">Découvrez les candidats et votez pour vos favoris</p>
          <a 
            href="#candidates" 
            className="inline-flex items-center bg-[#96172E] hover:bg-[#7d1427] text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-full transition-colors"
          >
            Voir les candidats
            <ChevronRight size={20} className="ml-2" />
          </a>
        </div>
      </section>
      
      {/* Section Candidates - MISS */}
      {missCandidates.length > 0 && (
        <section id="candidates" className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Nos Candidates MISS 2025</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Découvrez les étudiantes candidates représentant les différents départements de HITBAMAS.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {missCandidates.map((candidate) => (
                <div 
                  key={candidate.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <Link to={`/candidate/${candidate.id}`} className="block">
                    <div className="relative">
                      <img 
                        src={candidate.photoUrl || '/placeholder.jpg'}
                        alt={candidate.name} 
                        className="w-full h-64 object-cover group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute top-0 left-0 bg-[#96172E] text-white px-3 py-1 font-bold">
                        N°{candidate.number || '?'}
                      </div>
                      <div className="absolute top-0 right-0 bg-white/80 backdrop-blur-sm px-3 py-1 m-2 rounded-full flex items-center space-x-1">
                        <Heart size={16} className="text-[#96172E]" />
                        <span className="font-semibold text-gray-800">{candidate.votes || 0}</span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{candidate.name}</h3>
                      <p className="text-gray-600 mb-2 flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#96172E]" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        {candidate.department || "Département non spécifié"}
                      </p>
                    </div>
                  </Link>
                  
                  <div className="px-4 pb-4">
                    <button 
                      onClick={() => handleVoteClick(candidate)}
                      className="w-full py-2 bg-[#96172E] hover:bg-[#7d1427] text-white font-medium rounded transition-colors flex items-center justify-center space-x-2"
                    >
                      <Heart size={18} />
                      <span>Voter</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Section Candidates - MASTER */}
      {masterCandidates.length > 0 && (
        <section id="masters" className="py-12 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Nos Candidats MASTER 2025</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Découvrez les étudiants candidats représentant les différents départements de HITBAMAS.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {masterCandidates.map((candidate) => (
                <div 
                  key={candidate.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <Link to={`/candidate/${candidate.id}`} className="block">
                    <div className="relative">
                      <img 
                        src={candidate.photoUrl || '/placeholder.jpg'}
                        alt={candidate.name} 
                        className="w-full h-64 object-cover group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute top-0 left-0 bg-[#96172E] text-white px-3 py-1 font-bold">
                        N°{candidate.number || '?'}
                      </div>
                      <div className="absolute top-0 right-0 bg-white/80 backdrop-blur-sm px-3 py-1 m-2 rounded-full flex items-center space-x-1">
                        <Heart size={16} className="text-[#96172E]" />
                        <span className="font-semibold text-gray-800">{candidate.votes || 0}</span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{candidate.name}</h3>
                      <p className="text-gray-600 mb-2 flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#96172E]" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        {candidate.department || "Département non spécifié"}
                      </p>
                    </div>
                  </Link>
                  
                  <div className="px-4 pb-4">
                    <button 
                      onClick={() => handleVoteClick(candidate)}
                      className="w-full py-2 bg-[#96172E] hover:bg-[#7d1427] text-white font-medium rounded transition-colors flex items-center justify-center space-x-2"
                    >
                      <Heart size={18} />
                      <span>Voter</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Compteurs */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-[#D6B981]/10 rounded-lg">
              <div className="text-3xl font-bold text-[#96172E] mb-2">{candidates.length}</div>
              <p className="text-gray-600 uppercase font-medium text-sm">Candidats</p>
            </div>
            <div className="p-4 bg-[#D6B981]/10 rounded-lg">
              <div className="text-3xl font-bold text-[#96172E] mb-2">
                {candidates.reduce((total, candidate) => total + (candidate.votes || 0), 0).toLocaleString()}
              </div>
              <p className="text-gray-600 uppercase font-medium text-sm">Votes totaux</p>
            </div>
            <div className="p-4 bg-[#D6B981]/10 rounded-lg">
              <div className="text-3xl font-bold text-[#96172E] mb-2">21</div>
              <p className="text-gray-600 uppercase font-medium text-sm">Jours restants</p>
            </div>
            <div className="p-4 bg-[#D6B981]/10 rounded-lg">
              <div className="text-3xl font-bold text-[#96172E] mb-2">2</div>
              <p className="text-gray-600 uppercase font-medium text-sm">Gagnants</p>
            </div>
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
                  {voteSuccess ? 'Merci pour votre vote!' : 'Voter pour ' + (selectedCandidate?.name || '')}
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
                  <p className="text-gray-700 text-lg mb-2">Votre vote a été enregistré avec succès !</p>
                  <p className="text-gray-500 text-sm">Merci pour votre participation à Miss Master HITBAMAS</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src={selectedCandidate?.photoUrl || '/placeholder.jpg'} 
                      alt={selectedCandidate?.name} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{selectedCandidate?.name}</h4>
                      <p className="text-sm text-gray-500">{selectedCandidate?.department} • N°{selectedCandidate?.number}</p>
                    </div>
                  </div>
                  
                  <form onSubmit={submitVote}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Votre nom complet</label>
                        <input
                          id="name"
                          type="text"
                          value={voterName}
                          onChange={(e) => setVoterName(e.target.value)}
                          required
                          className="px-4 py-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Entrez votre nom"
                        />
                      </div>
                      
                      
                      <div>
      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Nombre de votes</label>
      <select
        id="amount"
        value={voteAmount}
        onChange={(e) => setVoteAmount(e.target.value)}
        className="px-4 py-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="1">1 vote (100 FCFA)</option>
        <option value="5">5 votes (450 FCFA)</option>
        <option value="10">10 votes (800 FCFA)</option>
        <option value="25">25 votes (1 800 FCFA)</option>
      </select>
    </div>
                      
    <div className="text-xs text-gray-500">
                        En votant, vous acceptez les règles du concours Miss Master HITBAMAS.
                      </div>
                      
                      <button
                          type="submit"
                                     className="w-full py-3 bg-[#1a3a6e] hover:bg-blue-800 text-white font-medium rounded transition-colors flex items-center justify-center space-x-2"
                                                     >
                                                     <Heart size={18} />
                                                            <span>Confirmer mon vote</span>
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
      {/* Footer */}
      <footer className="bg-[#96172E] text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/logo-hitbamas.png" alt="HITBAMAS" className="h-10 mr-2" />
                <span className="text-xl font-bold">MISS MASTER</span>
              </div>
              <p className="text-gray-300">Concours annuel valorisant l'excellence académique et le leadership des étudiantes de HITBAMAS.</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="bg-white/10 hover:bg-white/20 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="bg-white/10 hover:bg-white/20 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Accueil</a></li>
                <li><a href="#candidates" className="text-gray-300 hover:text-white transition-colors">Candidates</a></li>
                <li><a href="#how-to-vote" className="text-gray-300 hover:text-white transition-colors">Comment voter</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Événements</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Règlement du concours</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Éditions précédentes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Galerie photos</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-300">
                <li>HITBAMAS, Yaoundé</li>
                <li>missmaster@hitbamas.org</li>
                <li>+237 000 000 000</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-gray-300 text-sm">
            <p>&copy; {new Date().getFullYear()} Miss Master HITBAMAS. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;