// scripts/reconcileVotes.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Nécessaire pour les requêtes HTTP dans Node

// Charger les variables d'environnement
dotenv.config();

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // SERVICE_ROLE obligatoire
const MONETBIL_SERVICE_KEY = process.env.MONETBIL_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getSuccessfulPayments() {
  try {
    const response = await fetch('https://api.monetbil.com/payment/v1/checkPayment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: MONETBIL_SERVICE_KEY,
        status: 1 // Transactions réussies
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    return [];
  }
}

async function reconcileVotes() {
  console.log('Début de la réconciliation...');
  
  // 1. Récupérer les transactions
  const payments = await getSuccessfulPayments();
  
  if (!payments.length) {
    console.log('Aucune transaction trouvée');
    return;
  }

  // 2. Traiter chaque transaction
  for (const payment of payments) {
    try {
      const candidateId = payment.item_ref?.split('_')[2];
      if (!candidateId) continue;

      const voteCount = getVoteCountFromAmount(payment.amount);
      
      // Vérifier si le vote existe déjà
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('transaction_id', payment.transaction_UUID)
        .single();

      if (existingVote) {
        console.log(`Vote déjà existant pour ${payment.transaction_UUID}`);
        continue;
      }

      // Insérer le nouveau vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          candidate_id: candidateId,
          voter_name: payment.user || 'Anonyme',
          voter_phone: payment.phonenumber?.replace('237', '') || '',
          amount: payment.amount,
          vote_count: voteCount,
          transaction_id: payment.transaction_UUID,
          payment_status: 'completed'
        });

      if (voteError) throw voteError;

      // Mettre à jour le compteur
      const { error: rpcError } = await supabase.rpc('increment_votes', {
        candidate_id: candidateId,
        increment: voteCount
      });

      if (rpcError) throw rpcError;

      console.log(`✅ Vote enregistré: ${payment.transaction_UUID}`);

    } catch (error) {
      console.error(`❌ Erreur sur ${payment.transaction_UUID}:`, error.message);
    }
  }
}

function getVoteCountFromAmount(amount) {
  const tiers = {
    100: 1,
    450: 5,
    800: 10,
    1800: 25
  };
  return tiers[amount] || Math.floor(amount / 100);
}

// Exécution
reconcileVotes()
  .then(() => console.log('Réconciliation terminée'))
  .catch(err => console.error('Erreur globale:', err));