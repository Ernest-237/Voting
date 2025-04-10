import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ChevronLeft, Instagram, Facebook, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MonetbilPayment from './MonetbilPayment';

const CandidatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // États pour le modal de vote et paiement
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [voterName, setVoterName] = useState("");
  const [voterPhone, setVoterPhone] = useState("");
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteAmount, setVoteAmount] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // État pour l'index de la photo actuellement affichée
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Candidat sélectionné
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données du candidat depuis un API
    // Dans une application réelle, vous feriez un appel API ici 
    const fetchCandidate = () => {
      // Données statiques des candidates (à remplacer par un appel API)
      const candidates = [
        {
          id: 1,
          name: "Aïcha N.",
          department: "Informatique",
          number: "01",
          photoUrl: "/hitlogo.jpeg",
          votes: 254,
          description: "Passionnée par le développement web et le leadership féminin dans la tech. Ambassadrice du club coding de l'école.",
          bio: "Aïcha est actuellement en 3ème année d'informatique à HITBAMAS. Elle a rejoint l'école après un baccalauréat scientifique obtenu avec mention très bien. Passionnée par la programmation depuis son plus jeune âge, elle a déjà développé plusieurs applications et sites web pour des associations locales. Elle souhaite devenir une référence dans le domaine du développement web et mobile en Afrique.",
          specialization: "Développement web & mobile, Intelligence artificielle",
          achievements: "Premier prix du hackathon HITBAMAS 2024, Certification Google Developer",
          social: {
            instagram: "aicha_n",
            facebook: "aicha.n",
            twitter: "aicha_dev"
          },
          photos: [
            "/api/placeholder/600/800",
            "/api/placeholder/600/800",
            "/api/placeholder/600/800"
          ],
          type: "miss"
        },
        {
          id: 2,
          name: "Fatou B.",
          department: "Gestion",
          number: "02",
          photoUrl: "/hitlogo.jpeg",
          votes: 182,
          description: "Étudiante en gestion financière, engagée dans l'entrepreneuriat étudiant et les projets sociaux.",
          bio: "Fatou est étudiante en 3ème année de gestion à HITBAMAS. Elle s'est distinguée par son engagement dans plusieurs projets entrepreneuriaux sur le campus. Elle a notamment créé un groupe d'épargne étudiant qui aide les jeunes à financer leurs projets. Fatou est passionnée par la finance inclusive et souhaite développer des solutions pour faciliter l'accès aux services financiers dans les zones rurales.",
          specialization: "Finance, Entrepreneuriat social",
          achievements: "Lauréate du concours d'entrepreneuriat social 2023, Stage à la Banque Africaine de Développement",
          social: {
            instagram: "fatou.b",
            facebook: "fatou.finance",
            twitter: "fatou_b"
          },
          photos: [
            "/api/placeholder/600/800",
            "/api/placeholder/600/800",
            "/api/placeholder/600/800"
          ],
          type: "miss"
        },
        {
          id: 3,
          name: "Ruth K.",
          department: "Réseaux & Télécoms",
          number: "03",
          photoUrl: "/hitlogo.jpeg",
          votes: 176,
          description: "Future ingénieure réseaux, participe activement aux compétitions technologiques nationales.",
          bio: "Ruth est en 4ème année de Réseaux et Télécommunications à HITBAMAS. Elle se spécialise dans la sécurité informatique et les infrastructures cloud. Elle a représenté l'école lors de plusieurs compétitions nationales de cybersécurité. Ruth est également membre active du club de robotique de l'école et participe à la formation des nouveaux étudiants.",
          specialization: "Cybersécurité, Infrastructure cloud, IoT",
          achievements: "Médaille d'argent au challenge national de cybersécurité, Certification Cisco CCNA",
          social: {
            instagram: "ruth_networks",
            facebook: "ruth.k.tech",
            twitter: "ruth_security"
          },
          photos: [
            "/api/placeholder/600/800",
            "/api/placeholder/600/800",
            "/api/placeholder/600/800"
          ],
          type: "miss"
        },
        {
          id: 4,
          name: "Linda M.",
          department: "Marketing Digital",
          number: "04",
          photoUrl: "/hitlogo.jpeg",
          votes: 172,
          description: "Créative et dynamique, elle représente l'école dans les concours de stratégie marketing.",
          bio: "Linda est étudiante en Marketing Digital, actuellement en 3ème année à HITBAMAS. Elle excelle dans la création de contenu et le marketing d'influence. Elle a déjà collaboré avec plusieurs marques locales pour développer leur présence en ligne. Linda est également passionnée de photographie et de design graphique, compétences qu'elle met à profit dans ses projets de marketing.",
          specialization: "Marketing digital, création de contenu, stratégie de marque",
          achievements: "Lauréate du concours national de marketing digital, Stage chez une agence de communication internationale",
          social: {
            instagram: "linda_creative",
            facebook: "linda.marketing",
            twitter: "linda_m_digital"
          },
          photos: [
            "/api/placeholder/600/800",
            "/api/placeholder/600/800",
            "/api/placeholder/600/800"
          ],
          type: "miss"
        },
        {
          id: 5,
          name: "David O.",
          department: "Informatique",
          number: "01",
          photoUrl: "/hitlogo.jpeg",
          votes: 198,
          description: "Passionné de cybersécurité et développement mobile. Champion de plusieurs hackathons nationaux.",
          bio: "David est en 4ème année d'informatique à HITBAMAS, spécialisé en cybersécurité et développement mobile. Il a remporté plusieurs hackathons nationaux et a développé une application de sécurité mobile utilisée par plus de 5000 utilisateurs. David est également mentor pour les étudiants de première année et organise régulièrement des ateliers de programmation sur le campus.",
          specialization: "Cybersécurité, Développement mobile, Intelligence artificielle",
          achievements: "Premier prix hackathon national de cybersécurité, Application mobile avec 5000+ utilisateurs",
          social: {
            instagram: "david.code",
            facebook: "david.security",
            twitter: "david_tech"
          },
          photos: [
            "/api/placeholder/600/800",
            "/api/placeholder/600/800",
            "/api/placeholder/600/800"
          ],
          type: "master"
        },
        {
          id: 6,
          name: "Jean K.",
          department: "Finance",
          number: "02",
          photoUrl: "/hitlogo.jpeg",
          votes: 167,
          description: "Expert en analyse financière et entrepreneur social. Représentant de HITBAMAS aux forums économiques.",
          bio: "Jean est étudiant en Finance, en dernière année à HITBAMAS. Il s'est spécialisé dans l'analyse financière et l'entrepreneuriat social. Il a fondé une startup qui propose des solutions de microfinance pour les petits commerçants. Jean représente régulièrement l'école dans les forums économiques nationaux et internationaux.",
          specialization: "Finance d'entreprise, Microfinance, Entrepreneuriat social",
          achievements: "Lauréat du prix jeune entrepreneur social 2024, Stage à la Banque Mondiale",
          social: {
            instagram: "jean_finance",
            facebook: "jean.entrepreneur",
            twitter: "jean_k_business"
          },
          photos: [
            "/api/placeholder/600/800",
            "/api/placeholder/600/800",
            "/api/placeholder/600/800"
          ],
          type: "master"
        },
        {
          id: 7,
          name: "Koffi P.",
          department: "Génie Logiciel",
          number: "03",
          photoUrl: "/hitlogo.jpeg",
          votes: 163,
          description: "Développeur full-stack et mentor pour les étudiants de première année en informatique.",
          bio: "Koffi est étudiant en Génie Logiciel à HITBAMAS, en 4ème année. Il maîtrise plusieurs langages de programmation et frameworks modernes. Il a développé plusieurs applications web et mobiles, dont certaines sont utilisées par l'administration de l'école. Koffi est également mentor pour les étudiants de première année et anime un club de programmation.",
          specialization: "Développement Full-stack, Architecture logicielle, DevOps",
          achievements: "Développement du système de gestion de bibliothèque de l'école, Stage chez une entreprise tech internationale",
          social: {
            instagram: "koffi_dev",
            facebook: "koffi.coder",
            twitter: "koffi_tech"
          },
          photos: [
            "/api/placeholder/600/800",
            "/api/placeholder/600/800",
            "/api/placeholder/600/800"
          ],
          type: "master"
        },
        {
          id: 8,
          name: "Paul M.",
          department: "Management",
          number: "04",
          photoUrl: "/hitlogo.jpeg",
          votes: 155,
          description: "Spécialiste en gestion de projet et leadership. Impliqué dans plusieurs initiatives entrepreneuriales.",
          bio: "Paul est en dernière année de Management à HITBAMAS. Il s'est spécialisé dans la gestion de projet et le leadership. Il a fondé le club d'entrepreneuriat de l'école et a organisé plusieurs événements de networking avec des professionnels du secteur. Paul a également effectué un stage dans une multinationale où il a contribué à des projets d'optimisation des processus.",
          specialization: "Gestion de projet, Leadership, Innovation managériale",
          achievements: "Président du club d'entrepreneuriat, Stage dans une multinationale de conseil",
          social: {
            instagram: "paul_management",
            facebook: "paul.leadership",
            twitter: "paul_manager"
          },
          photos: [
            "/api/placeholder/600/800",
            "/api/placeholder/600/800",
            "/api/placeholder/600/800"
          ],
          type: "master"
        }
      ];

      const foundCandidate = candidates.find(c => c.id === parseInt(id));
      
      if (foundCandidate) {
        setCandidate(foundCandidate);
      } else {
        // Rediriger vers la page d'accueil si le candidat n'est pas trouvé
        navigate('/');
      }
      
      setLoading(false);
    };

    fetchCandidate();
  }, [id, navigate]);

  // Gestion de l'affichage des photos
  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === candidate.photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === 0 ? candidate.photos.length - 1 : prevIndex - 1
    );
  };

  // Gestion du vote
  const handleVoteClick = () => {
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
    
    // Passer à l'étape de paiement
    setShowVoteModal(false);
    setTimeout(() => {
      setShowPaymentModal(true);
    }, 300);
  };

  // Gérer le succès du paiement
  const handlePaymentSuccess = (transactionData) => {
    // Dans une application réelle, vous mettriez à jour le backend
    // Ici on simule juste un succès local
    setVoteSuccess(true);
    setShowVoteModal(true);
    setShowPaymentModal(false);
    
    // Réinitialiser après un délai
    setTimeout(() => {
      setShowVoteModal(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#96172E]"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Candidat non trouvé</h2>
        <p className="mb-6">Le candidat que vous recherchez n'existe pas.</p>
        <Link to="/" className="bg-[#96172E] text-white px-6 py-2 rounded hover:bg-[#7d1427]">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
      <header className="bg-[#96172E] text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <img src="/hitlogo.jpeg" alt="HITBAMAS" className="h-10 mr-2" />
            <span className="hidden md:inline">MISS MASTER HITBAMAS</span>
            <span className="md:hidden">HITBAMAS</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-[#D6B981] font-medium">Accueil</Link>
            <a href="/#candidates" className="hover:text-[#D6B981] font-medium">Candidates</a>
            <a href="/#masters" className="hover:text-[#D6B981] font-medium">Masters</a>
            <a href="/#how-to-vote" className="hover:text-[#D6B981] font-medium">Comment voter</a>
          </nav>
        </div>
      </header>
      
      {/* Bouton de retour en haut */}
      <div className="container mx-auto px-4 py-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-[#96172E] hover:text-[#7d1427] font-medium"
        >
          <ChevronLeft size={20} className="mr-1" />
          Retour à l'accueil
        </Link>
      </div>
      
      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Informations principales du candidat */}
          <div className="md:flex">
            {/* Galerie photos */}
            <div className="md:w-1/2 relative bg-gray-100">
              <img 
                src={candidate.photos[currentPhotoIndex]} 
                alt={`Photo de ${candidate.name}`} 
                className="w-full h-96 md:h-[600px] object-cover"
              />
              
              {/* Navigation des photos */}
              <div className="absolute inset-x-0 bottom-0 flex justify-between p-4">
                <button 
                  onClick={prevPhoto}
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentPhotoIndex + 1}/{candidate.photos.length}
                </div>
                <button 
                  onClick={nextPhoto}
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transform rotate-180"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
              
              {/* Numéro du candidat */}
              <div className="absolute top-0 left-0 bg-[#96172E] text-white px-4 py-2 font-bold text-xl">
                N°{candidate.number}
              </div>
            </div>
            
            {/* Informations du candidat */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{candidate.name}</h1>
                  <p className="text-lg text-gray-600">{candidate.department}</p>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-full flex items-center space-x-2">
                  <Heart size={20} className="text-[#96172E]" />
                  <span className="font-semibold">{candidate.votes} votes</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Biographie</h2>
                <p className="text-gray-700">{candidate.bio}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Spécialisation</h2>
                  <p className="text-gray-700">{candidate.specialization}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Réalisations</h2>
                  <p className="text-gray-700">{candidate.achievements}</p>
                </div>
              </div>
              
              {/* Réseaux sociaux */}
              <div className="flex space-x-4 mb-8">
                {candidate.social && (
                  <>
                    <a 
                      href={`https://instagram.com/${candidate.social.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-full flex items-center space-x-2"
                    >
                      <Instagram size={16} />
                      <span className="text-sm">@{candidate.social.instagram}</span>
                    </a>
                    <a 
                      href={`https://facebook.com/${candidate.social.facebook}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-full flex items-center space-x-2"
                    >
                      <Facebook size={16} />
                      <span className="text-sm">{candidate.social.facebook}</span>
                    </a>
                    <a 
                      href={`https://twitter.com/${candidate.social.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-full flex items-center space-x-2"
                    >
                      <Twitter size={16} />
                      <span className="text-sm">@{candidate.social.twitter}</span>
                    </a>
                  </>
                )}
              </div>
              
              {/* Bouton de vote */}
              <button 
                onClick={handleVoteClick}
                className="w-full py-3 bg-[#96172E] hover:bg-[#7d1427] text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Heart size={20} />
                <span>Voter pour {candidate.name}</span>
              </button>
            </div>
          </div>
          
          {/* Galerie des photos miniatures */}
          <div className="p-4 md:p-6 border-t border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Photos</h2>
            <div className="grid grid-cols-3 gap-4">
              {candidate.photos.map((photo, index) => (
                <div 
                  key={index}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                    currentPhotoIndex === index ? 'border-[#96172E]' : 'border-transparent'
                  }`}
                  onClick={() => setCurrentPhotoIndex(index)}
                >
                  <img 
                    src={photo} 
                    alt={`${candidate.name} - Photo ${index + 1}`} 
                    className="w-full h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Vote Modal */}
      {showVoteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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
                  <p className="text-gray-500 text-sm">Merci pour votre participation à Miss Master HITBAMAS</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src={candidate.photoUrl} 
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
        <MonetbilPayment
          selectedCandidate={candidate}
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
      <footer className="bg-[#96172E] text-white py-8 px-4 mt-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/hitlogo.jpeg" alt="HITBAMAS" className="h-10 mr-2" />
              <span className="text-xl font-bold">MISS MASTER HITBAMAS</span>
            </div>
            
            <div className="flex space-x-4">
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
          
          <div className="text-center text-gray-300 text-sm mt-6">
            <p>&copy; {new Date().getFullYear()} Miss Master HITBAMAS. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CandidatePage;