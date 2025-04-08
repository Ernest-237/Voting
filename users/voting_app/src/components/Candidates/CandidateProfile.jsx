import { useState } from 'react';
import { Heart, ChevronLeft, Share2, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const CandidateProfile = () => {
  const { id } = useParams();
  
  // Données simulées - en pratique vous feriez une requête API
  const candidate = {
    id: 1,
    name: "Aïcha N.",
    department: "Informatique",
    number: "01",
    photoUrl: "/api/placeholder/400/600",
    votes: 254,
    description: "Passionnée par le développement web et le leadership féminin dans la tech. Ambassadrice du club coding de l'école. Aïcha représente les valeurs d'innovation et de persévérance de HITBAMAS. Elle participe activement aux hackathons nationaux et a remporté le prix de la meilleure solution tech lors de l'édition 2024.",
    photos: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ],
    socialMedia: {
      instagram: "aicha_hitbamas",
      facebook: "aicha.hitbamas",
      twitter: "aicha_hitbamas"
    },
    quote: "La technologie n'a pas de genre, seulement du talent et de la passion."
  };

  const [activePhoto, setActivePhoto] = useState(0);
  const [voteSuccess, setVoteSuccess] = useState(false);

  const handleVote = () => {
    // Simuler un vote
    setVoteSuccess(true);
    setTimeout(() => setVoteSuccess(false), 3000);
  };

  return (
    <div className="bg-gradient-to-b from-[#f8f9fa] to-white min-h-screen">
      {/* Header */}
      <header className="bg-[#1a3a6e] text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center hover:text-blue-200">
              <ChevronLeft size={20} className="mr-1" />
              Retour
            </Link>
            <div className="text-xl font-bold">MISS MASTER HITBAMAS</div>
            <button className="text-blue-200 hover:text-white">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Candidate Profile */}
      <div className="container mx-auto px-4 py-8">
        {/* Candidate Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="relative">
              <img 
                src={candidate.photoUrl} 
                alt={candidate.name} 
                className="w-full h-auto rounded-xl shadow-lg"
              />
              <div className="absolute top-4 left-4 bg-[#1a3a6e] text-white px-3 py-1 rounded-full font-bold">
                N°{candidate.number}
              </div>
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              <button 
                onClick={handleVote}
                className="bg-[#1a3a6e] hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full transition-colors flex items-center"
              >
                <Heart size={18} className="mr-2" />
                Voter ({candidate.votes})
              </button>
              
              {voteSuccess && (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm flex items-center">
                  Merci pour votre vote!
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              {candidate.socialMedia.instagram && (
                <a href={`https://instagram.com/${candidate.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#1a3a6e]">
                  <Instagram size={20} />
                </a>
              )}
              {candidate.socialMedia.facebook && (
                <a href={`https://facebook.com/${candidate.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#1a3a6e]">
                  <Facebook size={20} />
                </a>
              )}
              {candidate.socialMedia.twitter && (
                <a href={`https://twitter.com/${candidate.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#1a3a6e]">
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl font-bold mb-2">{candidate.name}</h1>
            
            <div className="flex items-center text-lg text-gray-600 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#1a3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {candidate.department}
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <p className="text-gray-800 italic">"{candidate.quote}"</p>
            </div>
            
            <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-3 text-[#1a3a6e]">Présentation</h3>
              <p className="text-gray-700 mb-6">{candidate.description}</p>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-[#1a3a6e]">Parcours académique</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1a3a6e]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Licence en Informatique</h4>
                      <p className="text-sm text-gray-600">HITBAMAS • 2022-2025</p>
                      <p className="text-gray-700 mt-1">Majeure en Développement Web, Mineure en Cybersécurité</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1a3a6e]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Certifications</h4>
                      <ul className="list-disc list-inside text-gray-700 mt-1 space-y-1">
                        <li>Développeur Full Stack (Google Certification, 2023)</li>
                        <li>Spécialisation en UI/UX (Coursera, 2024)</li>
                        <li>Leadership féminin en tech (Women Techmakers, 2023)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Galerie photos</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidate.photos.map((photo, index) => (
              <div 
                key={index} 
                className="relative group cursor-pointer"
                onClick={() => setActivePhoto(index)}
              >
                <img 
                  src={photo} 
                  alt={`${candidate.name} ${index + 1}`} 
                  className="w-full h-64 object-cover rounded-lg shadow-md group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10v4h4v-4h-4z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects & Engagements */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Projets & Engagements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1a3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Projet Tech</h3>
              </div>
              <p className="text-gray-700 mb-3">Développement d'une application mobile pour faciliter l'accès aux ressources académiques de HITBAMAS.</p>
              <span className="inline-block bg-blue-100 text-[#1a3a6e] text-sm px-3 py-1 rounded-full">Hackathon 2024</span>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1a3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Engagement associatif</h3>
              </div>
              <p className="text-gray-700 mb-3">Co-fondatrice du club "Women in Tech" visant à encourager les étudiantes à s'orienter vers les filières technologiques.</p>
              <span className="inline-block bg-blue-100 text-[#1a3a6e] text-sm px-3 py-1 rounded-full">Leadership</span>
            </div>
          </div>
        </div>

        {/* Video Presentation */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Présentation vidéo</h2>
          
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-xl overflow-hidden shadow-md">
            <div className="w-full h-96 flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-[#1a3a6e] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Modal for Photo View */}
        {activePhoto !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button 
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <X size={32} />
              </button>
              
              <img 
                src={candidate.photos[activePhoto]} 
                alt={`${candidate.name} ${activePhoto + 1}`} 
                className="w-full max-h-[90vh] object-contain"
              />
              
              <div className="flex justify-between mt-4">
                <button 
                  onClick={() => setActivePhoto((activePhoto - 1 + candidate.photos.length) % candidate.photos.length)}
                  className="text-white hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="text-white">
                  {activePhoto + 1} / {candidate.photos.length}
                </div>
                
                <button 
                  onClick={() => setActivePhoto((activePhoto + 1) % candidate.photos.length)}
                  className="text-white hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#1a3a6e] text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/logo-hitbamas.png" alt="HITBAMAS" className="h-8 mr-2" />
              <span className="text-lg font-bold">MISS MASTER HITBAMAS 2025</span>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-200">Conditions</a>
              <a href="#" className="hover:text-blue-200">Confidentialité</a>
              <a href="#" className="hover:text-blue-200">Contact</a>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-6 pt-6 text-center text-sm text-gray-300">
            <p>&copy; {new Date().getFullYear()} Miss Master HITBAMAS. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CandidateProfile;