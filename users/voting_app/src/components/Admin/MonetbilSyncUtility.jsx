import { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AlertCircle, Upload, Check, RefreshCw } from 'lucide-react';
import Papa from 'papaparse'; // You'll need to install this library: npm install papaparse

// Configuration Supabase - replace with your own keys
const SUPABASE_URL = 'https://vdnbkevncovdssvgyrzr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbmJrZXZuY292ZHNzdmd5cnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDU1MjMsImV4cCI6MjA2MDMyMTUyM30.BLKZQ6GJkPhEa6i79efv7QBmnfP_VtTN-9ON67w4JfY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MonetbilSyncUtility = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Function to get amount based on price
  const getVoteCount = (amount) => {
    amount = parseInt(amount);
    switch(amount) {
      case 100: return 1;
      case 450: return 5;
      case 800: return 10;
      case 1800: return 25;
      default: return 0;
    }
  };

  // Parse CSV data from Monetbil export
  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error)
      });
    });
  };

  // Extract candidate ID from payment reference
  const extractCandidateId = (paymentRef) => {
    // Example: vote_174480884877 or candidate_vote_some-uuid
    if (paymentRef.includes('candidate_vote_')) {
      return paymentRef.split('candidate_vote_')[1];
    }
    return null;
  };

  // Process the Monetbil transactions and update Supabase
  const processTransactions = async (transactions) => {
    const stats = {
      totalProcessed: 0,
      successfulVotes: 0,
      failedVotes: 0,
      updatedCandidates: new Set(),
      votesToAdd: []
    };

    // Get all candidates from Supabase to match transactions
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('id, name, votes');

    if (candidatesError) {
      throw new Error(`Error fetching candidates: ${candidatesError.message}`);
    }

    // Process each transaction
    for (const transaction of transactions) {
      stats.totalProcessed++;

      // Check if this transaction is successful
      if (transaction.Message === 'SUCCESSFULL') {
        // Get the payment reference and amount
        const paymentRef = transaction['Payment Ref.'];
        const amount = parseInt(transaction.Amount);
        
        // Get the candidate ID if available
        let candidateId = extractCandidateId(paymentRef);
        
        // If we can't extract a candidate ID directly, try to find it in the transaction ID
        if (!candidateId) {
          // Try to match with existing candidates based on transaction data
          // This is a fallback if the payment reference doesn't contain the candidate ID
          // For example, you might need to implement custom logic here
          // For now, we'll skip this transaction
          stats.failedVotes++;
          continue;
        }

        // Calculate vote count based on amount
        const voteCount = getVoteCount(amount);
        
        if (voteCount > 0) {
          // Prepare vote data to insert into Supabase
          const voteData = {
            candidate_id: candidateId,
            voter_name: transaction.User || 'Unknown',
            voter_phone: 'Imported from Monetbil',
            amount: amount,
            vote_count: voteCount,
            transaction_id: transaction['Transaction UUID'],
            payment_status: 'completed'
          };
          
          stats.votesToAdd.push(voteData);
          stats.updatedCandidates.add(candidateId);
          stats.successfulVotes += voteCount;
        }
      }
    }

    // Insert all votes in a batch
    if (stats.votesToAdd.length > 0) {
      const { error: votesError } = await supabase
        .from('votes')
        .insert(stats.votesToAdd);

      if (votesError) {
        throw new Error(`Error inserting votes: ${votesError.message}`);
      }
    }

    // Update vote counts for each candidate
    for (const candidateId of stats.updatedCandidates) {
      // Calculate total votes for this candidate
      const candidateVotes = stats.votesToAdd
        .filter(vote => vote.candidate_id === candidateId)
        .reduce((sum, vote) => sum + vote.vote_count, 0);
      
      // Get current vote count for this candidate
      const candidate = candidates.find(c => c.id === candidateId);
      
      if (candidate) {
        // Update candidate vote count
        const { error: updateError } = await supabase
          .from('candidates')
          .update({ votes: candidate.votes + candidateVotes })
          .eq('id', candidateId);
        
        if (updateError) {
          throw new Error(`Error updating candidate ${candidateId}: ${updateError.message}`);
        }
      }
    }

    return stats;
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setError(null);

      // Parse the CSV file
      const transactions = await parseCSV(file);
      
      // Process the transactions
      const stats = await processTransactions(transactions);
      
      setResults(stats);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Refresh candidates data in Supabase based on votes
  const recalculateAllVotes = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Get all votes from Supabase
      const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select('*')
        .eq('payment_status', 'completed');

      if (votesError) {
        throw new Error(`Error fetching votes: ${votesError.message}`);
      }

      // Get all candidates
      const { data: candidates, error: candidatesError } = await supabase
        .from('candidates')
        .select('id, name');

      if (candidatesError) {
        throw new Error(`Error fetching candidates: ${candidatesError.message}`);
      }

      // Calculate vote totals for each candidate
      const voteTotals = {};
      candidates.forEach(candidate => {
        voteTotals[candidate.id] = 0;
      });

      votes.forEach(vote => {
        if (voteTotals[vote.candidate_id] !== undefined) {
          voteTotals[vote.candidate_id] += vote.vote_count;
        }
      });

      // Update each candidate with their vote total
      let updatedCount = 0;
      for (const [candidateId, voteCount] of Object.entries(voteTotals)) {
        const { error: updateError } = await supabase
          .from('candidates')
          .update({ votes: voteCount })
          .eq('id', candidateId);
        
        if (!updateError) {
          updatedCount++;
        }
      }

      setResults({
        totalCandidates: candidates.length,
        updatedCandidates: updatedCount,
        totalVotes: votes.length
      });
    } catch (err) {
      console.error('Error recalculating votes:', err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Synchronisation des Votes Monetbil</h2>
      
      <div className="space-y-6">
        {/* Upload CSV Section */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="font-medium mb-3">Importer les données de transactions Monetbil</h3>
          <p className="text-gray-600 text-sm mb-4">
            Téléchargez le fichier CSV d'exportation du tableau de bord Monetbil pour synchroniser les votes.
          </p>
          
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className={`flex items-center px-4 py-2 rounded font-medium ${
                isProcessing 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-[#96172E] hover:bg-[#7d1427] text-white'
              }`}
            >
              <Upload size={18} className="mr-2" />
              Charger le CSV
            </button>
            
            <button
              onClick={recalculateAllVotes}
              disabled={isProcessing}
              className={`flex items-center px-4 py-2 rounded font-medium ${
                isProcessing 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <RefreshCw size={18} className="mr-2" />
              Recalculer tous les votes
            </button>
          </div>
        </div>
        
        {/* Processing Status */}
        {isProcessing && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-[#96172E]/20 border-t-[#96172E] rounded-full animate-spin mr-3"></div>
            <span className="text-gray-700">Traitement en cours...</span>
          </div>
        )}
        
        {/* Results */}
        {results && !isProcessing && (
          <div className="border rounded-lg p-6 bg-green-50 border-green-200">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-4">
                <Check size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-800 mb-2">Synchronisation terminée avec succès</h3>
                
                <div className="space-y-1 text-sm text-gray-700">
                  {'totalProcessed' in results && (
                    <>
                      <p>Transactions traitées: {results.totalProcessed}</p>
                      <p>Votes ajoutés: {results.successfulVotes}</p>
                      <p>Candidats mis à jour: {results.updatedCandidates?.size || 0}</p>
                      <p>Transactions ignorées: {results.failedVotes}</p>
                    </>
                  )}
                  
                  {'totalCandidates' in results && (
                    <>
                      <p>Candidats mis à jour: {results.updatedCandidates} sur {results.totalCandidates}</p>
                      <p>Votes traités: {results.totalVotes}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="border rounded-lg p-4 bg-red-50 border-red-200 text-red-800">
            <div className="flex items-start">
              <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonetbilSyncUtility;