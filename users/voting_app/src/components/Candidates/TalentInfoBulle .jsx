import { useState, useEffect } from 'react';
import { Music, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const TalentInfoBulle = () => {
  // État pour contrôler la visibilité de l'infobulle
  const [isVisible, setIsVisible] = useState(true);
  // Animation pour faire "pulser" l'infobulle
  const [isPulsing, setIsPulsing] = useState(false);

  // Effet pour l'animation pulsante
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 2000);
    
    return () => clearInterval(pulseInterval);
  }, []);

  // Si l'infobulle est fermée, ne rien afficher
  if (!isVisible) return null;

  return (
    <div className="fixed right-4 top-1/3 z-40 max-w-xs w-full">
      <div 
        className={`bg-white border-l-4 border-[#D6B981] rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${
          isPulsing ? 'scale-102 shadow-2xl' : 'scale-100'
        }`}
      >
        {/* Bouton de fermeture */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>
        
        {/* Contenu */}
        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className="bg-[#96172E]/10 p-2 rounded-full mr-3">
              <Music size={20} className="text-[#96172E]" />
            </div>
            <h3 className="font-bold text-gray-800">Nouveauté !</h3>
          </div>
          
          <p className="text-gray-600 mb-4 text-sm">
            La compétition bat son plein ! Découvrez également nos talents de 
            <span className="font-semibold"> chant et de danse</span>. 
            Votez pour vos artistes favoris !
          </p>
          
          <Link 
            to="/talents" 
            className="w-full py-2 px-3 bg-[#96172E] hover:bg-[#7d1427] text-white font-medium rounded-md transition-colors flex items-center justify-center space-x-2 text-sm"
          >
            <span>Découvrir les talents</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TalentInfoBulle;