import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('candidates');
  const [categories, setCategories] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    department: '',
    number: '',
    photoUrl: '',
    description: '',
    type: 'miss',
    categoryId: ''
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  // URL du backend - Ajustez selon votre configuration
  const API_URL = 'http://localhost:3001';
  
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchInitialData();
  }, [activeTab]);

  const checkAuth = () => {
    // Puisque vous n'utilisez pas de token, vous pouvez soit:
    // 1. Supprimer cette vérification
    // 2. Utiliser un autre moyen de vérifier si l'utilisateur est connecté
    // Par exemple, utiliser une variable dans localStorage
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/adminlogin');
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesRes, candidatesRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/categories`),
        fetch(`${API_URL}/api/admin/candidates`),
        fetch(`${API_URL}/api/admin/stats`)
      ]);

      if (!categoriesRes.ok || !candidatesRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const categoriesData = await categoriesRes.json();
      const candidatesData = await candidatesRes.json();
      const statsData = await statsRes.json();

      setCategories(categoriesData.data);
      setCandidates(candidatesData.data);
      setStats(statsData.data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/admin/candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCandidate)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create candidate');
      }

      toast.success('Candidate created successfully!');
      setNewCandidate({
        name: '',
        department: '',
        number: '',
        photoUrl: '',
        description: '',
        type: 'miss',
        categoryId: ''
      });
      fetchInitialData();
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create category');
      }

      toast.success('Category created successfully!');
      setNewCategory({ name: '', description: '' });
      fetchInitialData();
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const toggleCandidateStatus = async (id, currentStatus) => {
    try {
      // Remarque: selon votre route backend, cette fonction pourrait ne pas fonctionner
      // car vous avez une route DELETE mais pas PATCH dans votre API
      const response = await fetch(`${API_URL}/api/admin/candidates/${id}`, {
        method: 'DELETE', // Utilisez DELETE car c'est ce que votre API supporte
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update candidate');
      }

      toast.success(`Candidate deactivated successfully!`);
      fetchInitialData();
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/adminlogin');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">HITBAMAS Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Total Votes</h3>
              <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.totalVotes}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Total Amount</h3>
              <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.totalAmount} FCFA</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Active Candidates</h3>
              <p className="mt-2 text-3xl font-bold text-indigo-600">{candidates.filter(c => c.active).length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Categories</h3>
              <p className="mt-2 text-3xl font-bold text-indigo-600">{categories.length}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('candidates')}
              className={`${activeTab === 'candidates' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Candidates
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`${activeTab === 'categories' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('votes')}
              className={`${activeTab === 'votes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Votes
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            {/* Add Candidate Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Candidate</h2>
              <form onSubmit={handleCreateCandidate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name *</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newCandidate.name}
                      onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newCandidate.department}
                      onChange={(e) => setNewCandidate({...newCandidate, department: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Number</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newCandidate.number}
                      onChange={(e) => setNewCandidate({...newCandidate, number: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Photo URL</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newCandidate.photoUrl}
                      onChange={(e) => setNewCandidate({...newCandidate, photoUrl: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newCandidate.description}
                      onChange={(e) => setNewCandidate({...newCandidate, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type *</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newCandidate.type}
                      onChange={(e) => setNewCandidate({...newCandidate, type: e.target.value})}
                      required
                    >
                      <option value="miss">Miss</option>
                      <option value="master">Master</option>
                      <option value="dance">Dance</option>
                      <option value="chant">Chant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newCandidate.categoryId}
                      onChange={(e) => setNewCandidate({...newCandidate, categoryId: e.target.value})}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Candidate
                  </button>
                </div>
              </form>
            </div>

            {/* Candidates List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Candidates</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {candidates.length > 0 ? (
                      candidates.map((candidate) => (
                        <tr key={candidate.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {candidate.photoUrl && (
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img className="h-10 w-10 rounded-full" src={candidate.photoUrl} alt={candidate.name} />
                                </div>
                              )}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                                <div className="text-sm text-gray-500">{candidate.department || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {candidate.categoryName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {candidate.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {candidate.totalVotes || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${candidate.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {candidate.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => toggleCandidateStatus(candidate.id, candidate.active)}
                              className={`mr-3 ${candidate.active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                            >
                              {candidate.active ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No candidates found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Add Category Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Category</h2>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Categories</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidates</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <tr key={category.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.description || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {candidates.filter(c => c.categoryId === category.id).length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {category.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No categories found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'votes' && stats && (
          <div className="space-y-6">
            {/* Votes Stats */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Voting Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">Votes by Category</h3>
                  <ul className="space-y-2">
                    {stats.byCategory && stats.byCategory.length > 0 ? (
                      stats.byCategory.map(category => (
                        <li key={category.id} className="flex justify-between">
                          <span>{category.name}</span>
                          <span className="font-medium">{category.totalVotes} votes ({category.totalAmount} FCFA)</span>
                        </li>
                      ))
                    ) : (
                      <li>No votes recorded yet</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">Top Candidates</h3>
                  <ul className="space-y-2">
                    {stats.topCandidates && stats.topCandidates.length > 0 ? (
                      stats.topCandidates.map(candidate => (
                        <li key={candidate.id} className="flex justify-between">
                          <span>{candidate.name} ({candidate.type})</span>
                          <span className="font-medium">{candidate.totalVotes} votes</span>
                        </li>
                      ))
                    ) : (
                      <li>No votes recorded yet</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Votes */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Votes</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voter</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Note: Vous devrez ajouter une route pour récupérer les votes récents */}
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        Recent votes will appear here (API endpoint not implemented yet)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;