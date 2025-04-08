import { useState } from 'react';
import { Heart, X, Check, ChevronRight, Instagram, Facebook, Twitter, User, BookOpen, Award, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Données statiques des candidates
  const [candidates] = useState([
    {
      id: 1,
      name: "Aïcha N.",
      department: "Informatique",
      number: "01",
      photoUrl: "/api/placeholder/400/600",
      votes: 254,
      description: "Passionnée par le développement web et le leadership féminin dans la tech. Ambassadrice du club coding de l'école.",
      photos: [
        "/api/placeholder/400/600",
        "/api/placeholder/400/600",
        "/api/placeholder/400/600"
      ]
    },
    {
      id: 2,
      name: "Fatou B.",
      department: "Gestion",
      number: "02",
      photoUrl: "/api/placeholder/400/600",
      votes: 182,
      description: "Étudiante en gestion financière, engagée dans l'entrepreneuriat étudiant et les projets sociaux.",
      photos: [
        "/api/placeholder/400/600",
        "/api/placeholder/400/600",
        "/api/placeholder/400/600"
      ]
    },
    {
      id: 3,
      name: "Ruth K.",
      department: "Réseaux & Télécoms",
      number: "03",
      photoUrl: "/api/placeholder/400/600",
      votes: 176,
      description: "Future ingénieure réseaux, participe activement aux compétitions technologiques nationales.",
      photos: [
        "/api/placeholder/400/600",
        "/api/placeholder/400/600",
        "/api/placeholder/400/600"
      ]
    },
    {
      id: 4,
      name: "Linda M.",
      department: "Marketing Digital",
      number: "04",
      photoUrl: "/api/placeholder/400/600",
      votes: 172,
      description: "Créative et dynamique, elle représente l'école dans les concours de stratégie marketing.",
      photos: [
        "/api/placeholder/400/600",
        "/api/placeholder/400/600",
        "/api/placeholder/400/600"
      ]
    },
    {
      id: 5,
      name: "Estelle D.",
      department: "Comptabilité",
      number: "05",
      photoUrl: "/api/placeholder/400/600",
      votes: 132,
      description: "Précise et méthodique, elle excelle en audit et représente les valeurs académiques de HITBAMAS.",
      photos: [
        "/api/placeholder/400/600",
        "/api/placeholder/400/600",
        "/api/placeholder/400/600"
      ]
    },
    {
      id: 6,
      name: "Sarah T.",
      department: "Droit Digital",
      number: "06",
      photoUrl: "/api/placeholder/400/600",
      votes: 165,
      description: "Spécialisée en protection des données, elle milite pour une éthique numérique à l'école.",
      photos: [
        "/api/placeholder/400/600",
        "/api/placeholder/400/600",
        "/api/placeholder/400/600"
      ]
    }
  ]);

  // Sélection des sponsors
  const sponsors = [
    "/api/placeholder/150/60",
    "/api/placeholder/150/60",
    "/api/placeholder/150/60",
    "/api/placeholder/150/60"
  ];

  // État pour le modal de vote
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voterName, setVoterName] = useState("");
  const [voterPhone, setVoterPhone] = useState("");
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteAmount, setVoteAmount] = useState(1);

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
    
    // Simuler un traitement de vote
    setTimeout(() => {
      // Mettre à jour les votes localement
      const updatedCandidates = candidates.map(c => {
        if (c.id === selectedCandidate.id) {
          return {...c, votes: c.votes + parseInt(voteAmount)};
        }
        return c;
      });
      
      // Mise à jour de l'état
      setVoteSuccess(true);
      
      // Fermer le modal après un délai
      setTimeout(() => {
        setShowVoteModal(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-b from-[#f8f9fa] to-white min-h-screen">
      {/* Header */}
      <header className="bg-[#1a3a6e] text-white">
        <div className="container mx-auto">
          {/* Top Bar */}
          <div className="flex justify-between items-center py-2 px-4 text-sm border-b border-blue-800">
            <div className="flex space-x-4">
              <a href="tel:+237000000000" className="hover:text-blue-200">+237 000 000 000</a>
              <a href="mailto:contact@hitbamas.org" className="hover:text-blue-200">contact@hitbamas.org</a>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-200 flex items-center">
                <Facebook size={16} className="mr-1" /> Facebook
              </a>
              <a href="#" className="hover:text-blue-200 flex items-center">
                <Instagram size={16} className="mr-1" /> Instagram
              </a>
              <a href="#" className="hover:text-blue-200 flex items-center">
                <Twitter size={16} className="mr-1" /> Twitter
              </a>
            </div>
          </div>
          
          {/* Main Navigation */}
          <div className="flex justify-between items-center py-4 px-4">
            <a href="#" className="text-2xl font-bold flex items-center">
              <img src="/logo-hitbamas.png" alt="HITBAMAS" className="h-10 mr-2" />
              MISS MASTER HITBAMAS
            </a>
            
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="hover:text-blue-200 font-medium">Accueil</a>
              <a href="#candidates" className="hover:text-blue-200 font-medium">Candidates</a>
              <a href="#how-to-vote" className="hover:text-blue-200 font-medium">Comment voter</a>
              <a href="#" className="hover:text-blue-200 font-medium">Événements</a>
              <a href="#" className="hover:text-blue-200 font-medium">Contact</a>
            </nav>
            
            <button className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Banner */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img 
            src="/api/placeholder/1600/800" 
            alt="Miss Master HITBAMAS Banner" 
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">MISS MASTER 2025</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">Élisez l'ambassadrice de l'excellence académique et des valeurs de HITBAMAS</p>
          <a 
            href="#candidates" 
            className="inline-flex items-center bg-[#1a3a6e] hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-full transition-colors"
          >
            Voter maintenant
            <ChevronRight size={20} className="ml-2" />
          </a>
        </div>
      </section>
      
      {/* Comment voter */}
      <section id="how-to-vote" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Comment voter ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={24} className="text-[#1a3a6e]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Choisissez votre candidate</h3>
              <p className="text-gray-600">Parcourez les profils des étudiantes candidates et sélectionnez votre favorite.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={24} className="text-[#1a3a6e]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Renseignez vos informations</h3>
              <p className="text-gray-600">Utilisez votre email académique @hitbamas.org pour valider votre vote.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={24} className="text-[#1a3a6e]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Confirmez votre vote</h3>
              <p className="text-gray-600">Validez votre choix et soutenez votre candidate pour la couronne Miss Master.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Candidates Section */}
      <section id="candidates" className="py-16 px-4 bg-[#f8f9fa]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nos Candidates 2025</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Découvrez les étudiantes candidates représentant les différents départements de HITBAMAS.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <div 
                key={candidate.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <Link to={`/candidate/${candidate.id}`} className="block">
                  <div className="relative">
                    <img 
                      src={candidate.photoUrl}
                      alt={candidate.name} 
                      className="w-full h-80 object-cover group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute top-0 left-0 bg-[#1a3a6e] text-white px-4 py-2 font-bold">
                      N°{candidate.number}
                    </div>
                    <div className="absolute top-0 right-0 bg-white/80 backdrop-blur-sm px-3 py-1 m-2 rounded-full flex items-center space-x-1">
                      <Heart size={16} className="text-red-500" />
                      <span className="font-semibold text-gray-800">{candidate.votes}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-xl mb-1">{candidate.name}</h3>
                    <p className="text-gray-600 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-[#1a3a6e]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      {candidate.department}
                    </p>
                  </div>
                </Link>
                
                <div className="px-4 pb-4">
                  <button 
                    onClick={() => handleVoteClick(candidate)}
                    className="w-full py-2 bg-[#1a3a6e] hover:bg-blue-800 text-white font-medium rounded transition-colors flex items-center justify-center space-x-2"
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
      
      {/* Compteurs */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-[#1a3a6e] mb-2">{candidates.length}</div>
              <p className="text-gray-600 uppercase font-medium">Candidates</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-[#1a3a6e] mb-2">
                {candidates.reduce((total, candidate) => total + candidate.votes, 0).toLocaleString()}
              </div>
              <p className="text-gray-600 uppercase font-medium">Votes totaux</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-[#1a3a6e] mb-2">21</div>
              <p className="text-gray-600 uppercase font-medium">Jours restants</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-[#1a3a6e] mb-2">1</div>
              <p className="text-gray-600 uppercase font-medium">Gagnante</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Événements */}
      <section className="py-16 px-4 bg-[#f8f9fa]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Événements à venir</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <img src="/api/placeholder/800/400" alt="Événement" className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar size={16} className="mr-1" />
                  <span>15 Juin 2025 - 18h</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Séance photo officielle</h3>
                <p className="text-gray-600 mb-4">Séance photo des candidates pour la campagne de vote.</p>
                <a href="#" className="text-[#1a3a6e] font-medium hover:underline">En savoir plus</a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <img src="/api/placeholder/800/400" alt="Événement" className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar size={16} className="mr-1" />
                  <span>25 Juin 2025 - 15h</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Débat des candidates</h3>
                <p className="text-gray-600 mb-4">Les candidates présentent leurs projets pour l'école.</p>
                <a href="#" className="text-[#1a3a6e] font-medium hover:underline">En savoir plus</a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <img src="/api/placeholder/800/400" alt="Événement" className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar size={16} className="mr-1" />
                  <span>5 Juillet 2025 - 19h</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Cérémonie de couronnement</h3>
                <p className="text-gray-600 mb-4">Soirée de gala pour élire et couronner Miss Master 2025.</p>
                <a href="#" className="text-[#1a3a6e] font-medium hover:underline">En savoir plus</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sponsors */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-gray-800">Nos partenaires académiques</h2>
          
          <div className="flex flex-wrap justify-center gap-8">
            {sponsors.map((sponsor, index) => (
              <div key={index} className="grayscale hover:grayscale-0 transition-all">
                <img src={sponsor} alt={`Sponsor ${index + 1}`} className="h-12" />
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
                      src={selectedCandidate?.photoUrl} 
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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Votre email HITBAMAS</label>
                        <input
                          id="email"
                          type="email"
                          pattern=".+@hitbamas\.org"
                          title="Veuillez utiliser votre email académique HITBAMAS"
                          required
                          className="px-4 py-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="prenom.nom@hitbamas.org"
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
      
      {/* Footer */}
      <footer className="bg-[#1a3a6e] text-white py-12 px-4">
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