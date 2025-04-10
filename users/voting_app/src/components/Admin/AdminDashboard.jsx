import { useState, useEffect } from 'react';
import { BarChart, ChevronDown, Download, Eye, Pencil, RefreshCw, Search, Trash2, User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // État pour les données des candidats et les votes
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [stats, setStats] = useState({
    totalVotes: 0,
    totalAmount: 0,
    todayVotes: 0,
    todayAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [authError, setAuthError] = useState(false);
  
  // État pour l'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Vérifier la validité du token auprès du serveur
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/admin/verify-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(false);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        fetchData();
      } else {
        setAuthError(true);
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Récupérer les statistiques générales
      const statsResponse = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const statsData = await statsResponse.json();
      setStats(statsData);
      
      // Récupérer les candidats
      const candidatesResponse = await fetch('/api/admin/candidates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const candidatesData = await candidatesResponse.json();
      setCandidates(candidatesData);
      
      // Récupérer les votes
      const votesResponse = await fetch('/api/admin/votes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const votesData = await votesResponse.json();
      setVotes(votesData);
      
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      setLoading(false);
    }
  };

  const deleteVote = async (voteId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce vote ?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/votes/${voteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        // Rafraîchir les données après suppression
        fetchData();
      } else {
        alert("Erreur lors de la suppression du vote");
      }
    } catch (error) {
      console.error("Erreur de suppression:", error);
      alert("Erreur lors de la suppression du vote");
    }
  };

  const editVote = async (voteId, newAmount) => {
    try {
      const response = await fetch(`/api/admin/votes/${voteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ voteAmount: newAmount })
      });
      
      if (response.ok) {
        // Rafraîchir les données après modification
        fetchData();
      } else {
        alert("Erreur lors de la modification du vote");
      }
    } catch (error) {
      console.error("Erreur de modification:", error);
      alert("Erreur lors de la modification du vote");
    }
  };

  const exportToCSV = () => {
    // Créer les données CSV
    let csvContent = "ID,Date,Nom Candidat,Numéro Candidat,Votant,Téléphone,Nombre de votes,Montant\n";
    
    votes.forEach(vote => {
      const candidate = candidates.find(c => c.id === vote.candidateId) || {};
      csvContent += `${vote.id},${vote.date},${candidate.name || ''},${candidate.number || ''},${vote.voterName},${vote.voterPhone || ''},${vote.voteAmount},${vote.amount} FCFA\n`;
    });
    
    // Créer un lien de téléchargement
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `votes_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtrer les votes selon le terme de recherche
  const filteredVotes = votes.filter(vote => {
    const candidate = candidates.find(c => c.id === vote.candidateId) || {};
    const searchStr = (vote.voterName + ' ' + (candidate.name || '') + ' ' + (vote.voterPhone || '')).toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  // Trier les votes
  const sortedVotes = [...filteredVotes].sort((a, b) => {
    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortConfig.key === 'amount') {
      return sortConfig.direction === 'asc' 
        ? a.amount - b.amount
        : b.amount - a.amount;
    } else if (sortConfig.key === 'voteAmount') {
      return sortConfig.direction === 'asc' 
        ? a.voteAmount - b.voteAmount
        : b.voteAmount - a.voteAmount;
    }
    return 0;
  });

  // Fonction pour changer le tri
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Interface de connexion admin
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
          <div className="flex justify-center mb-6">
            <img src="/hitlogo.jpeg" alt="HITBAMAS" className="h-16" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Administration Miss Master HITBAMAS</h1>
          
          {authError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Identifiants incorrects. Veuillez réessayer.
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#96172E] hover:bg-[#7d1427] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Connexion
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-blue-600 hover:underline">
              Retourner à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Interface principale admin après authentification
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#96172E] text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/hitlogo.jpeg" alt="HITBAMAS" className="h-10" />
            <h1 className="text-xl font-bold">Administration Miss Master HITBAMAS</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-block">Admin</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="flex flex-wrap mb-6 gap-2">
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${selectedTab === 'dashboard' ? 'bg-[#96172E] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            onClick={() => setSelectedTab('dashboard')}
          >
            <span className="flex items-center">
              <BarChart size={18} className="mr-2" />
              Tableau de bord
            </span>
          </button>
          
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${selectedTab === 'votes' ? 'bg-[#96172E] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            onClick={() => setSelectedTab('votes')}
          >
            <span className="flex items-center">
              <Users size={18} className="mr-2" />
              Votes
            </span>
          </button>
          
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${selectedTab === 'candidates' ? 'bg-[#96172E] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            onClick={() => setSelectedTab('candidates')}
          >
            <span className="flex items-center">
              <User size={18} className="mr-2" />
              Candidats
            </span>
          </button>
          
          <div className="ml-auto">
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center"
            >
              <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>
        </div>
        
        {/* Contenu principal */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#96172E]"></div>
          </div>
        ) : (
          <>
            {/* Tableau de bord */}
            {selectedTab === 'dashboard' && (
              <div>
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Total des votes */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-gray-500 text-sm mb-1">Total des votes</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.totalVotes}</div>
                    <div className="mt-2 text-sm text-gray-600">Depuis le début du concours</div>
                  </div>
                  
                  {/* Montant total collecté */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-gray-500 text-sm mb-1">Montant total collecté</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.totalAmount.toLocaleString()} FCFA</div>
                    <div className="mt-2 text-sm text-gray-600">Tous votes confondus</div>
                  </div>
                  
                  {/* Votes aujourd'hui */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-gray-500 text-sm mb-1">Votes aujourd'hui</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.todayVotes}</div>
                    <div className={`mt-2 text-sm ${stats.todayVotes > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                      {stats.todayVotes > 0 ? '+' + stats.todayVotes + ' aujourd\'hui' : 'Aucun vote aujourd\'hui'}
                    </div>
                  </div>
                  
                  {/* Montant aujourd'hui */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-gray-500 text-sm mb-1">Montant aujourd'hui</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.todayAmount.toLocaleString()} FCFA</div>
                    <div className={`mt-2 text-sm ${stats.todayAmount > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                      {stats.todayAmount > 0 ? '+' + stats.todayAmount.toLocaleString() + ' FCFA' : 'Aucun montant aujourd\'hui'}
                    </div>
                  </div>
                </div>
                
                {/* Graphique des votes par candidat */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Votes par candidat</h2>
                  <div className="h-64">
                    {/* Ici vous pourriez intégrer un graphique avec une bibliothèque comme recharts */}
                    <div className="space-y-4">
                      {candidates.sort((a, b) => b.votes - a.votes).map(candidate => (
                        <div key={candidate.id} className="flex flex-col">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              {candidate.name} ({candidate.type === 'miss' ? 'Miss' : 'Master'}) - {candidate.votes} votes
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {Math.round((candidate.votes / stats.totalVotes) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${candidate.type === 'miss' ? 'bg-pink-500' : 'bg-blue-500'}`} 
                              style={{ width: `${(candidate.votes / stats.totalVotes) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Activité récente */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Votes récents</h2>
                    <Link to="#" className="text-sm text-blue-600 hover:underline" onClick={() => setSelectedTab('votes')}>
                      Voir tous les votes
                    </Link>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 text-left text-sm">
                          <th className="py-3 px-4 font-medium">Date</th>
                          <th className="py-3 px-4 font-medium">Votant</th>
                          <th className="py-3 px-4 font-medium">Candidat</th>
                          <th className="py-3 px-4 font-medium">Votes</th>
                          <th className="py-3 px-4 font-medium">Montant</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm">
                        {votes.slice(0, 5).map(vote => {
                          const candidate = candidates.find(c => c.id === vote.candidateId) || {};
                          return (
                            <tr key={vote.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-3 px-4">{new Date(vote.date).toLocaleString()}</td>
                              <td className="py-3 px-4">{vote.voterName}</td>
                              <td className="py-3 px-4 flex items-center">
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${candidate.type === 'miss' ? 'bg-pink-500' : 'bg-blue-500'}`}></span>
                                {candidate.name} (N°{candidate.number})
                              </td>
                              <td className="py-3 px-4">{vote.voteAmount}</td>
                              <td className="py-3 px-4">{vote.amount} FCFA</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Liste des votes */}
            {selectedTab === 'votes' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-wrap justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Liste des votes</h2>
                  
                  <div className="flex flex-wrap mt-4 sm:mt-0 gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                    
                    <button
                      onClick={exportToCSV}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center"
                    >
                      <Download size={18} className="mr-2" />
                      Exporter CSV
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 text-left text-sm">
                        <th className="py-3 px-4 font-medium">ID</th>
                        <th 
                          className="py-3 px-4 font-medium cursor-pointer hover:bg-gray-200"
                          onClick={() => requestSort('date')}
                        >
                          Date
                          {sortConfig.key === 'date' && (
                            <ChevronDown 
                              size={16} 
                              className={`inline ml-1 ${sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}`} 
                            />
                          )}
                        </th>
                        <th className="py-3 px-4 font-medium">Votant</th>
                        <th className="py-3 px-4 font-medium">Téléphone</th>
                        <th className="py-3 px-4 font-medium">Candidat</th>
                        <th 
                          className="py-3 px-4 font-medium cursor-pointer hover:bg-gray-200"
                          onClick={() => requestSort('voteAmount')}
                        >
                          Votes
                          {sortConfig.key === 'voteAmount' && (
                            <ChevronDown 
                              size={16} 
                              className={`inline ml-1 ${sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}`} 
                            />
                          )}
                        </th>
                        <th 
                          className="py-3 px-4 font-medium cursor-pointer hover:bg-gray-200"
                          onClick={() => requestSort('amount')}
                        >
                          Montant
                          {sortConfig.key === 'amount' && (
                            <ChevronDown 
                              size={16} 
                              className={`inline ml-1 ${sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}`} 
                            />
                          )}
                        </th>
                        <th className="py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                      {sortedVotes.map(vote => {
                        const candidate = candidates.find(c => c.id === vote.candidateId) || {};
                        return (
                          <tr key={vote.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4">{vote.id}</td>
                            <td className="py-3 px-4">{new Date(vote.date).toLocaleString()}</td>
                            <td className="py-3 px-4">{vote.voterName}</td>
                            <td className="py-3 px-4">{vote.voterPhone || '-'}</td>
                            <td className="py-3 px-4 flex items-center">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${candidate.type === 'miss' ? 'bg-pink-500' : 'bg-blue-500'}`}></span>
                              {candidate.name} (N°{candidate.number})
                            </td>
                            <td className="py-3 px-4">{vote.voteAmount}</td>
                            <td className="py-3 px-4">{vote.amount} FCFA</td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => {
                                    const newAmount = prompt("Nouveau nombre de votes:", vote.voteAmount);
                                    if (newAmount && !isNaN(newAmount) && parseInt(newAmount) > 0) {
                                      editVote(vote.id, parseInt(newAmount));
                                    }
                                  }}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button 
                                  onClick={() => deleteVote(vote.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      
                      {sortedVotes.length === 0 && (
                        <tr>
                          <td colSpan="8" className="py-8 text-center text-gray-500">
                            Aucun vote trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Liste des candidats */}
            {selectedTab === 'candidates' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Liste des candidats</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 text-left text-sm">
                        <th className="py-3 px-4 font-medium">ID</th>
                        <th className="py-3 px-4 font-medium">Photo</th>
                        <th className="py-3 px-4 font-medium">Nom</th>
                        <th className="py-3 px-4 font-medium">Département</th>
                        <th className="py-3 px-4 font-medium">Numéro</th>
                        <th className="py-3 px-4 font-medium">Type</th>
                        <th className="py-3 px-4 font-medium">Votes</th>
                        <th className="py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                      {candidates.map(candidate => (
                        <tr key={candidate.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4">{candidate.id}</td>
                          <td className="py-3 px-4">
                            <img 
                              src={candidate.photoUrl} 
                              alt={candidate.name} 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </td>
                          <td className="py-3 px-4">{candidate.name}</td>
                          <td className="py-3 px-4">{candidate.department}</td>
                          <td className="py-3 px-4">{candidate.number}</td>
                          <td className="py-3 px-4">
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                candidate.type === 'miss' 
                                  ? 'bg-pink-100 text-pink-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {candidate.type === 'miss' ? 'Miss' : 'Master'}
                            </span>
                          </td>
                          <td className="py-3 px-4">{candidate.votes}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => alert('Fonction de modification à implémenter.')}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <Pencil size={16} />
                              </button>
                              <button 
                                onClick={() => alert('Fonction de suppression à implémenter.')}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {candidates.length === 0 && (
                        <tr>
                          <td colSpan="8" className="py-8 text-center text-gray-500">
                            Aucun candidat enregistré
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
