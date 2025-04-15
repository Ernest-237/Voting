import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, User, BookOpen, Award, Calendar } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase - utilisez les mêmes clés que dans votre composant Home
const SUPABASE_URL = 'https://vdnbkevncovdssvgyrzr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbmJrZXZuY292ZHNzdmd5cnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDU1MjMsImV4cCI6MjA2MDMyMTUyM30.BLKZQ6GJkPhEa6i79efv7QBmnfP_VtTN-9ON67w4JfY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CandidatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour le modal de vote
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [voterName, setVoterName] = useState("");
  const [voterPhone, setVoterPhone] = useState("");
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteAmount, setVoteAmount] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        
        // Récupérer le candidat depuis Supabase
        const { data, error } = await supabase
          .from('candidates')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw new Error('Candidat non trouvé');
        }
        
        if (!data) {
          throw new Error('Données du candidat non disponibles');
        }
        
        // Transformer les données pour correspondre au format attendu par le composant
        const transformedData = {
          id: data.id,
          name: data.name,
          photoUrl: data.photo_url,
          department: data.department,
          type: data.type,
          number: data.number,
          votes: data.votes || 0,
          age: data.age,
          speciality: data.speciality,
          level: data.level,
          description: data.description
        };
        
        setCandidate(transformedData);
      } catch (err) {
        console.error("Erreur lors du chargement du candidat:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCandidate();
    }
  }, [id]);

  // Fonction pour gérer le vote
  const handleVoteClick = () => {
    if (!candidate) return;
    
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

    // Passer à l'étape de paiement
    setShowVoteModal(false);
    setTimeout(() => {
      setShowPaymentModal(true);
    }, 300);
  };

  // Gérer le succès du paiement
  const handlePaymentSuccess = async (transactionData) => {
    try {
      // Insérer le vote dans Supabase
      const { data: voteData, error: voteError } = await supabase
        .from('votes')
        .insert([
          {
            candidate_id: candidate.id,
            voter_name: voterName,
            voter_phone: voterPhone,
            vote_count: parseInt(voteAmount),
            amount: getAmount(voteAmount),
            transaction_id: transactionData?.transaction_UUID || 'test-transaction',
            payment_status: 'completed'
          }
        ])
        .select();

      if (voteError) {
        throw voteError;
      }

      // Mettre à jour le nombre de votes du candidat dans Supabase
      const { data: updateData, error: updateError } = await supabase
        .from('candidates')
        .update({ votes: candidate.votes + parseInt(voteAmount) })
        .eq('id', candidate.id)
        .select();

      if (updateError) {
        throw updateError;
      }

      // Mettre à jour localement
      setCandidate(prev => ({
        ...prev,
        votes: prev.votes + parseInt(voteAmount)
      }));
      
      setShowPaymentModal(false);
      
      // Afficher le message de succès
      setVoteSuccess(true);
      setShowVoteModal(true);
      
      // Fermer automatiquement après quelques secondes
      setTimeout(() => {
        setShowVoteModal(false);
        setVoteSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de l'enregistrement de votre vote");
      setShowPaymentModal(false);
      setShowVoteModal(true);
    }
  };

  // Helper pour obtenir le montant du vote
  const getAmount = (votes) => {
    switch(parseInt(votes)) {
      case 1: return 100;
      case 5: return 450;
      case 10: return 800;
      case 25: return 1800;
      default: return 100;
    }
  };

  // Redirection vers la page d'accueil
  const goToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Chargement des informations...</div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-lg text-red-600 mb-4">
          {error || "Candidat non trouvé"}
        </div>
        <button 
          onClick={goToHome}
          className="px-4 py-2 bg-[#96172E] text-white rounded-md flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const candidateType = candidate.type === "miss" ? "Miss" : "Master";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#96172E] text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold flex items-center">
              <img src="/hitlogo.jpeg" alt="HITBAMAS" className="h-8 mr-2" />
              <span>MISS MASTER HITBAMAS</span>
            </Link>
            <button 
              onClick={goToHome}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md flex items-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Retour
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Image du candidat */}
              <div className="md:w-1/2">
                <div className="relative h-96 md:h-full">
                  <img 
                    src={candidate.photoUrl || '/placeholder.jpg'} 
                    alt={candidate.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 bg-[#96172E] text-white px-3 py-1 font-bold">
                    N°{candidate.number || '?'}
                  </div>
                  <div className="absolute top-0 right-0 bg-white/80 backdrop-blur-sm px-3 py-1 m-2 rounded-full flex items-center space-x-1">
                    <Heart size={16} className="text-[#96172E]" />
                    <span className="font-semibold text-gray-800">{candidate.votes || 0}</span>
                  </div>
                </div>
              </div>
              
              {/* Informations du candidat */}
              <div className="md:w-1/2 p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-[#96172E]/10 text-[#96172E] px-3 py-1 rounded-full text-sm font-medium">
                    {candidateType}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{candidate.name}</h1>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <User size={18} className="mr-2 text-[#96172E]" />
                    <span>{candidate.age || '?'} ans</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <BookOpen size={18} className="mr-2 text-[#96172E]" />
                    <span>{candidate.department || "Département non spécifié"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Award size={18} className="mr-2 text-[#96172E]" />
                    <span>{candidate.speciality || "Spécialité non spécifiée"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={18} className="mr-2 text-[#96172E]" />
                    <span>Niveau {candidate.level || "?"}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h2 className="font-semibold text-gray-700 mb-2">À propos</h2>
                  <p className="text-gray-600">
                    {candidate.description || "Aucune description disponible pour ce candidat."}
                  </p>
                </div>
                
                <button 
                  onClick={handleVoteClick}
                  className="w-full py-3 bg-[#96172E] hover:bg-[#7d1427] text-white font-medium rounded-md transition-colors flex items-center justify-center space-x-2"
                >
                  <Heart size={20} />
                  <span>Voter pour {candidate.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de vote */}
      {showVoteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {voteSuccess ? 'Merci pour votre vote!' : 'Voter pour ' + candidate.name}
                </h3>
                <button 
                  onClick={() => setShowVoteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {voteSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-lg mb-2">Votre vote a été enregistré avec succès !</p>
                  <p className="text-gray-500 text-sm">Merci pour votre participation</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src={candidate.photoUrl || '/placeholder.jpg'} 
                      alt={candidate.name} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{candidate.name}</h4>
                      <p className="text-sm text-gray-500">{candidate.department} • N°{candidate.number}</p>
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

      {/* Vous devrez importer votre composant MonetbilPayment ici */}
      {showPaymentModal && (
        <div>
          {/* Remplacez ceci par l'import de votre composant MonetbilPayment */}
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Paiement</h3>
              <p>Intégrez ici votre composant MonetbilPayment</p>
              <div className="flex space-x-4 mt-4">
                <button 
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Annuler
                </button>
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded"
                  onClick={() => handlePaymentSuccess({transaction_UUID: 'test-transaction'})}
                >
                  Simuler paiement réussi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#96172E] text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/hitlogo.jpeg" alt="HITBAMAS" className="h-8 mr-2" />
            <span className="text-xl font-bold">MISS MASTER HITBAMAS</span>
          </div>
          <p className="text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} Miss Master HITBAMAS. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CandidatePage;