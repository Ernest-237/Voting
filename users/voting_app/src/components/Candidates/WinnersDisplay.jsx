import { useState, useEffect } from 'react';
import { Trophy, Award, Sparkles, Star, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const WinnersDisplay = ({ supabase }) => {
  const [winners, setWinners] = useState({ miss: null, master: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        setLoading(true);
        
        // Récupérer la gagnante MISS (avec le plus de votes)
        const { data: missData, error: missError } = await supabase
          .from('candidates')
          .select('*')
          .eq('type', 'miss')
          .order('votes', { ascending: false })
          .limit(1);
          
        if (missError) throw missError;
        
        // Récupérer le gagnant MASTER (avec le plus de votes)
        const { data: masterData, error: masterError } = await supabase
          .from('candidates')
          .select('*')
          .eq('type', 'master')
          .order('votes', { ascending: false })
          .limit(1);
          
        if (masterError) throw masterError;
        
        setWinners({
          miss: missData[0] || null,
          master: masterData[0] || null
        });
        
        // Déclencher les confettis
        if (showConfetti) {
          launchConfetti();
        }
        
      } catch (err) {
        console.error("Erreur lors du chargement des gagnants:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
    
    // Nettoyer après 8 secondes
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [supabase]);
  
  // Fonction pour lancer les confettis
  const launchConfetti = () => {
    // Confettis à gauche
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.1, y: 0.5 }
    });
    
    // Confettis à droite
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.9, y: 0.5 }
      });
    }, 250);
    
    // Confettis au centre
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { x: 0.5, y: 0.5 }
      });
    }, 500);
    
    // Animation continue
    let count = 0;
    const interval = setInterval(() => {
      if (count >= 5) {
        clearInterval(interval);
        return;
      }
      
      // Position aléatoire
      const x = Math.random();
      confetti({
        particleCount: 50,
        angle: x < 0.5 ? 60 : 120,
        spread: 55,
        origin: { x, y: 0.6 },
        colors: ['#96172E', '#D6B981', '#FFD700', '#FFFFFF']
      });
      
      count++;
    }, 1000);
  };

  // Animation d'étoiles filantes
  const ShootingStars = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <div 
          key={i}
          className="shooting-star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 6}s`
          }}
        />
      ))}
    </div>
  );

  // État de chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#96172E]"></div>
      </div>
    );
  }

  // Message d'erreur
  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-md mx-auto max-w-2xl my-8">
        <p>Une erreur est survenue lors du chargement des résultats: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0028] to-[#220a3a] py-12 px-4 overflow-hidden">
      {/* Étoiles filantes */}
      <ShootingStars />
      
      {/* Overlay brillant */}
      <div className="absolute inset-0 bg-[url('/sparkles-bg.png')] opacity-20 animate-pulse"></div>
      
      <div className="container mx-auto relative z-10">
        {/* Titre principal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-bounce">
            <span className="inline-block">🏆</span> RÉSULTATS OFFICIELS <span className="inline-block">🏆</span>
          </h1>
          <p className="text-xl text-[#D6B981] animate-pulse">
            Miss & Master HITBAMAS 2025
          </p>
        </div>
        
        {/* Message de remerciement */}
        <div className="max-w-2xl mx-auto text-center mb-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg animate-fadeIn">
          <Trophy className="text-[#FFD700] w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Merci pour votre participation!</h2>
          <p className="text-gray-300">
            L'équipe HITBAMAS tient à remercier chaleureusement tous les participants, 
            votants et sponsors qui ont fait de cet événement un succès extraordinaire.
            Félicitations à nos grands gagnants qui représenteront fièrement notre institution!
          </p>
        </div>
        
        {/* Affichage des gagnants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Gagnante MISS */}
          {winners.miss && (
            <div className="relative animate-floatUp">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-gradient-to-r from-[#FFD700] to-[#D6B981] text-[#96172E] font-bold py-2 px-6 rounded-full shadow-lg flex items-center">
                  <Trophy className="mr-2" />
                  MISS HITBAMAS 2025
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#96172E] to-[#570919] rounded-xl overflow-hidden shadow-2xl border-4 border-[#D6B981] transform hover:scale-105 transition-transform duration-300">
                <div className="relative group">
                  <img 
                    src={winners.miss.photoUrl || '/miss4.jpeg'} 
                    alt={winners.miss.name}
                    className="w-full h-96 object-cover"
                  />
                  
                  {/* Effet de brillance sur l'image */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Couronne animée */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 animate-bounce">
                    <img src="/king.png" alt="Couronne" className="w-16 h-16" />
                  </div>
                  
                  {/* Badge de numéro */}
                  <div className="absolute top-4 left-4 bg-[#D6B981] text-[#96172E] text-lg font-bold h-12 w-12 rounded-full flex items-center justify-center border-2 border-white">
                    №{winners.miss.number}
                  </div>
                  
                  {/* Badge de votes */}
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                    <Heart size={16} className="text-[#96172E]" />
                    <span className="font-semibold text-gray-800">{winners.miss.votes}</span>
                  </div>
                </div>
                
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{winners.miss.name}</h3>
                  <p className="text-[#D6B981] mb-3">{winners.miss.department}</p>
                  
                  {/* Étoiles de décorations */}
                  <div className="flex justify-center space-x-3 mb-4">
                    <Star className="w-6 h-6 text-[#FFD700] animate-pulse" />
                    <Star className="w-6 h-6 text-[#FFD700] animate-pulse delay-300" />
                    <Star className="w-6 h-6 text-[#FFD700] animate-pulse delay-500" />
                  </div>
                  
                  <p className="text-gray-300 italic">"La beauté alliée à l'excellence académique"</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Gagnant MASTER */}
          {winners.master && (
            <div className="relative animate-floatUp delay-300">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-gradient-to-r from-[#FFD700] to-[#D6B981] text-[#96172E] font-bold py-2 px-6 rounded-full shadow-lg flex items-center">
                  <Trophy className="mr-2" />
                  MISTER HITBAMAS 2025
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#96172E] to-[#570919] rounded-xl overflow-hidden shadow-2xl border-4 border-[#D6B981] transform hover:scale-105 transition-transform duration-300">
                <div className="relative group">
                  <img 
                    src={winners.master.photoUrl || '/master4.jpg'} 
                    alt={winners.master.name}
                    className="w-full h-96 object-cover" 
                  />
                  
                  {/* Effet de brillance sur l'image */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Couronne animée */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 animate-bounce">
                    <img src="/king.png" alt="Couronne" className="w-16 h-16" />
                  </div>
                  
                  {/* Badge de numéro */}
                  <div className="absolute top-4 left-4 bg-[#D6B981] text-[#96172E] text-lg font-bold h-12 w-12 rounded-full flex items-center justify-center border-2 border-white">
                    №{winners.master.number}
                  </div>
                  
                  {/* Badge de votes */}
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                    <Heart size={16} className="text-[#96172E]" />
                    <span className="font-semibold text-gray-800">{winners.master.votes}</span>
                  </div>
                </div>
                
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{winners.master.name}</h3>
                  <p className="text-[#D6B981] mb-3">{winners.master.department}</p>
                  
                  {/* Étoiles de décorations */}
                  <div className="flex justify-center space-x-3 mb-4">
                    <Star className="w-6 h-6 text-[#FFD700] animate-pulse" />
                    <Star className="w-6 h-6 text-[#FFD700] animate-pulse delay-300" />
                    <Star className="w-6 h-6 text-[#FFD700] animate-pulse delay-500" />
                  </div>
                  
                  <p className="text-gray-300 italic">"L'excellence et le leadership incarnés"</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Message de conclusion */}
        <div className="mt-16 text-center animate-fadeIn delay-500">
          <Award className="text-[#D6B981] w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Rendez-vous à la cérémonie de couronnement!</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Joignez-vous à nous pour la grande cérémonie de couronnement qui aura lieu 
            le 18 avril 2025 au campus principal de HITBAMAS. Venez célébrer nos gagnants
            et profiter d'une soirée inoubliable!
          </p>
          
          <a 
            href="#"
            className="mt-6 inline-flex items-center bg-[#D6B981] hover:bg-[#c0a674] text-[#96172E] font-medium py-3 px-6 rounded-full transition-colors shadow-lg"
          >
            <Sparkles className="mr-2" />
            Plus d'informations
          </a>
        </div>
      </div>
      
      {/* Style CSS pour les animations */}
      <style jsx>{`
        @keyframes shootingStar {
          0% {
            transform: translate(0, 0) rotate(45deg) scale(0);
            opacity: 0;
          }
          10% {
            transform: translate(-20px, 20px) rotate(45deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-200px, 200px) rotate(45deg) scale(0.2);
            opacity: 0;
          }
        }
        
        .shooting-star {
          position: absolute;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%);
          animation: shootingStar linear forwards;
          transform-origin: center;
        }
        
        .shooting-star::before {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: white;
          top: -2px;
          right: 0;
          box-shadow: 0 0 10px 2px white;
        }
        
        @keyframes floatUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-floatUp {
          animation: floatUp 1s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out forwards;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default WinnersDisplay;