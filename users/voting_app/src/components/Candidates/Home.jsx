import { useState, useEffect } from 'react';
import { Heart, X, Check, ChevronRight, Instagram, Facebook, Twitter, Menu, Phone, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const SUPABASE_URL = 'https://vdnbkevncovdssvgyrzr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbmJrZXZuY292ZHNzdmd5cnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDU1MjMsImV4cCI6MjA2MDMyMTUyM30.BLKZQ6GJkPhEa6i79efv7QBmnfP_VtTN-9ON67w4JfY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

  // Charger tous les candidats depuis Supabase
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('candidates')
          .select('*')
          .order('number', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        const transformedData = data.map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          photoUrl: candidate.photo_url,
          department: candidate.department,
          type: candidate.type,
          number: candidate.number,
          votes: candidate.votes || 0
        }));
        
        setCandidates(transformedData);
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
    
    if (!voterPhone.trim()) {
      alert("Veuillez entrer votre numéro de téléphone");
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

  // Modifier la fonction confirmPayment pour générer et télécharger un coupon
// Modifier la fonction confirmPayment pour générer et télécharger un coupon
const confirmPayment = async () => {
  try {
    // Générer le contenu du coupon
    const couponContent = `
=================================================
        COUPON DE PAIEMENT - MISS MASTER HITBAMAS
=================================================

INFORMATIONS DU VOTE:
--------------------
Date: ${new Date().toLocaleString()}
ID Référence: VOTE-${Date.now().toString().slice(-8)}

INFORMATIONS ÉLECTEUR:
--------------------
Nom: ${voterName}
Téléphone: ${voterPhone}

INFORMATIONS CANDIDAT:
--------------------
Candidat choisi: ${selectedCandidate?.name}
Numéro du candidat: ${selectedCandidate?.number}
Catégorie: ${selectedCandidate?.type === 'miss' ? 'MISS' : 'MASTER'}
Département: ${selectedCandidate?.department}

DÉTAILS DU PAIEMENT:
------------------
Nombre de votes: ${voteAmount}
Montant à payer: ${getAmount(voteAmount)} FCFA

INSTRUCTIONS:
-----------
1. Présentez ce coupon à l'un des points de paiement suivants:
   - Au gestionaire du service de vote
   - Bureau des élections HITBAMAS
   - Enligne sur whatsapp (+237 695965175)
2. Effectuez le paiement du montant indiqué
3. Conservez votre reçu de paiement
4. Votre vote sera validé après confirmation du paiement

=================================================
        MERCI POUR VOTRE PARTICIPATION!
=================================================
`;

    // Séparer la partie Supabase du téléchargement du coupon
    try {
      // Insérer les données du vote dans Supabase (avec statut "pending" ou similaire)
      const { data: voteData, error: voteError } = await supabase
        .from('votes')
        .insert([{
          candidate_id: selectedCandidate.id,
          voter_name: voterName,
          voter_phone: voterPhone,
          vote_count: parseInt(voteAmount),
          amount: getAmount(voteAmount),
          transaction_id: `coupon-${Date.now()}`,
          payment_status: 'waiting_coupon_payment'
        }]);

      if (voteError) console.error("Erreur Supabase:", voteError);
      // Continuer même en cas d'erreur Supabase
    } catch (supabaseError) {
      console.error("Erreur Supabase:", supabaseError);
      // Continuer même en cas d'erreur Supabase
    }

    // Générer et télécharger le coupon de toute façon
    // Créer un objet Blob avec le contenu du coupon
    const couponBlob = new Blob([couponContent], { type: 'text/plain' });
    
    // Créer une URL pour le blob
    const couponUrl = URL.createObjectURL(couponBlob);
    
    // Créer un élément <a> temporaire pour le téléchargement
    const downloadLink = document.createElement('a');
    downloadLink.href = couponUrl;
    downloadLink.download = `Coupon_Vote_${selectedCandidate?.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    
    // Ajouter l'élément au DOM et déclencher le clic
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    // Nettoyer
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(couponUrl);

    // Fermer le modal de paiement et montrer un message de succès
    setShowPaymentModal(false);
    setVoteSuccess(true);
    setShowVoteModal(true);

    // Fermer automatiquement après quelques secondes
    setTimeout(() => {
      setShowVoteModal(false);
      setSelectedCandidate(null);
      setVoteSuccess(false);
    }, 3000);
    
  } catch (error) {
    console.error("Erreur:", error);
    alert("Une erreur est survenue lors de la génération de votre coupon");
    setShowPaymentModal(false);
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
              <a href="tel:+237 695965175" className="hover:text-[#D6B981]">+237 695965175</a>
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
      
      {/* État de chargement */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#96172E]"></div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mx-auto max-w-2xl my-8">
          <p>Une erreur est survenue lors du chargement des candidats: {error}</p>
        </div>
      )}
      
      {/* Section Candidates - MISS */}
      {!loading && missCandidates.length > 0 && (
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
      {!loading && masterCandidates.length > 0 && (
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
      {!loading && (
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
                <div className="text-3xl font-bold text-[#96172E] mb-2">2</div>
                <p className="text-gray-600 uppercase font-medium text-sm">Jours restants</p>
              </div>
              <div className="p-4 bg-[#D6B981]/10 rounded-lg">
                <div className="text-3xl font-bold text-[#96172E] mb-2">2</div>
                <p className="text-gray-600 uppercase font-medium text-sm">Gagnants</p>
              </div>
            </div>
          </div>
        </section>
      )}
      
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
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={24} className="text-green-600" />
                </div>
                <p className="text-gray-700 text-lg mb-2">Votre coupon a été téléchargé avec succès !</p>
                <p className="text-gray-500 text-sm">Présentez-le à un point de paiement pour finaliser votre vote pour Miss Master HITBAMAS</p>
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
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Votre numéro de téléphone</label>
                        <input
                          id="phone"
                          type="tel"
                          value={voterPhone}
                          onChange={(e) => setVoterPhone(e.target.value)}
                          required
                          className="px-4 py-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Entrez votre numéro"
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
                        className="w-full py-3 bg-[#96172E] hover:bg-[#7d1427] text-white font-medium rounded transition-colors flex items-center justify-center space-x-2"
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
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Finalisez votre paiement</h3>
          <button 
            onClick={() => setShowPaymentModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <MessageSquare className="text-blue-500 mr-2" />
              <h4 className="font-medium text-blue-800">Instructions importantes</h4>
            </div>
            <p className="text-sm text-gray-700">
              🎉 Finalisez votre vote en quelques étapes simples !<br /><br />
              Cher utilisateur, votre voix compte énormément ! Pour valider définitivement votre(vos) vote(s), il vous suffit de :<br /><br />
              1️⃣ Télécharger votre coupon de paiement ci-dessous.<br />
              2️⃣ Présentez ce coupon à l'un des points de paiement suivants :<br />
              <span className="font-semibold">* Kiosque Orange Money sur le campus</span><br />
              <span className="font-semibold">* Bureau des élections HITBAMAS</span><br /><br />
              💡 <span className="font-semibold">Rappel :</span> Votre vote de {voteAmount} fois correspond à un montant de {getAmount(voteAmount)} FCFA.<br /><br />
              Après paiement, conservez votre reçu comme preuve.<br /><br />
              Un immense merci pour votre participation et votre compréhension ! Ensemble, faisons la différence. 🙌
            </p>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-3 border-b">
              <h4 className="font-medium text-gray-800">Récapitulatif de votre vote</h4>
            </div>
            <div className="p-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Candidat</span>
                <span className="font-medium">{selectedCandidate?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Nombre de votes</span>
                <span className="font-medium">{voteAmount}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Montant total</span>
                <span className="font-medium">{getAmount(voteAmount)} FCFA</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Votre numéro</span>
                <span className="font-medium">{voterPhone}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <button 
              className="w-full py-3 bg-[#96172E] hover:bg-[#7d1427] text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
              onClick={confirmPayment}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Télécharger mon coupon de paiement</span>
            </button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            Après avoir effectué le paiement avec votre coupon, votre vote sera définitivement validé.
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      
      {/* Footer */}
      <footer className="bg-[#96172E] text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/hitlogo.jpeg" alt="HITBAMAS" className="h-10 mr-2" />
                <span className="text-xl font-bold">MISS MASTER</span>
              </div>
              <p className="text-gray-300">Concours annuel valorisant l'excellence académique et le leadership des étudiants de HITBAMAS.</p>
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
                <li>+237 695965175</li>
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