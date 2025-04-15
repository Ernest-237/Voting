import { useState, useEffect } from 'react';
import { X, Check, AlertCircle, CreditCard, Phone } from 'lucide-react';

const MonetbilPayment = ({ 
  selectedCandidate, 
  voteAmount, 
  voterName,
  onPaymentSuccess, 
  onPaymentFailure, 
  onClose 
}) => {
  // États pour gérer le processus de paiement
  const [paymentStep, setPaymentStep] = useState('select'); // select, process, success, failure
  const [selectedOperator, setSelectedOperator] = useState(''); // MTN ou Orange
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentId, setPaymentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState({});
  const [checkingInterval, setCheckingInterval] = useState(null);

  // Tes identifiants Monetbil
  const serviceKey = "oWrxlUcXLfQcV8D6Jbqt8exOmd65ozgd";
  const serviceSecret = "N9xC8hf4hyMED2Zkn3o4HOkYxc5bsvuPCviVvRYBB9gZK8HWgtgaSbWtxQWZ1zwW";

  // Montants en FCFA selon le nombre de votes
  const getAmount = () => {
    switch(parseInt(voteAmount)) {
      case 1: return 100;
      case 5: return 450;
      case 10: return 800;
      case 25: return 1800;
      default: return 100;
    }
  };

  // Opérateurs disponibles au Cameroun selon la documentation Monetbil
  const operators = [
    { 
      id: 'CM_MTNMOBILEMONEY', 
      name: 'MTN Mobile Money', 
      code: 'CM_MTNMOBILEMONEY',
      logo: '/Mtn-Money-logo.jpeg', // Remplace par ton chemin de logo
      ussd: '*126*1#'
    },
    { 
      id: 'CM_ORANGEMONEY', 
      name: 'Orange Money', 
      code: 'CM_ORANGEMONEY',
      logo: '/Orange-Money-logo.png', // Remplace par ton chemin de logo
      ussd: '#150*1#'
    }
  ];

  // Vérification du format du numéro de téléphone camerounais
  const validatePhoneNumber = (phone) => {
    // Format acceptable: 6 suivi de 8 chiffres (sans le code pays)
    const regex = /^6[0-9]{8}$/;
    return regex.test(phone);
  };

  // Fonction pour initialiser un paiement
  const initiatePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setErrorMessage('Veuillez entrer un numéro de téléphone valide (format: 6XXXXXXXX)');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Construction des données pour l'API Monetbil
      const paymentData = {
        service: serviceKey,
        phonenumber: `237${phoneNumber}`,
        amount: getAmount(),
        operator: selectedOperator,
        country: 'CM',
        currency: 'XAF', 
        item_ref: `candidate_vote_${selectedCandidate.id}`,
        payment_ref: `vote_${Date.now()}`,
        user: voterName,
        first_name: voterName.split(' ')[0],
        last_name: voterName.split(' ').slice(1).join(' '),
        notify_url: 'https://ton-site.com/api/monetbil-notification' // À configurer sur ton serveur
      };

      // Appel à l'API Monetbil
      const response = await fetch('https://api.monetbil.com/payment/v1/placePayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (data.status === 'REQUEST_ACCEPTED') {
        setPaymentId(data.paymentId);
        setPaymentStep('process');
        startCheckingPayment(data.paymentId);
      } else {
        setErrorMessage(`Erreur: ${data.message || 'Échec de la requête'}`);
        setPaymentStep('failure');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initiation du paiement:', error);
      setErrorMessage('Une erreur est survenue lors de la connexion au service de paiement.');
      setPaymentStep('failure');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour vérifier l'état du paiement
const checkPaymentStatus = async (paymentId) => {
  try {
    const response = await fetch('https://api.monetbil.com/payment/v1/checkPayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId: paymentId,
        service: serviceKey
      })
    });

    const data = await response.json();

    if (data.transaction) {
      if (data.transaction.status === 1) { // Succès
        setPaymentStatus(data.transaction);
        stopCheckingPayment();
        
        // Appeler d'abord le callback de succès
        if (onPaymentSuccess) {
          onPaymentSuccess(data.transaction);
        }
        
        // Ensuite seulement changer l'état local
        setPaymentStep('success');
      } else if (data.transaction.status === -1 || data.transaction.status === 0) { // Annulé ou échec
        setErrorMessage(data.transaction.message || 'Paiement annulé ou échoué');
        setPaymentStep('failure');
        stopCheckingPayment();
      }
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du statut de paiement:', error);
  }
};

  // Démarrer la vérification périodique du statut du paiement
  const startCheckingPayment = (paymentId) => {
    // Vérifier toutes les 5 secondes (réduit la fréquence pour éviter trop de requêtes)
    const interval = setInterval(() => {
      checkPaymentStatus(paymentId);
    }, 5000);
    
    setCheckingInterval(interval);
  };

  // Arrêter la vérification périodique
  const stopCheckingPayment = () => {
    if (checkingInterval) {
      clearInterval(checkingInterval);
      setCheckingInterval(null);
    }
  };

  // Nettoyer l'intervalle lors du démontage du composant
  useEffect(() => {
    return () => {
      stopCheckingPayment();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {paymentStep === 'select' && 'Paiement du vote'}
              {paymentStep === 'process' && 'Traitement du paiement'}
              {paymentStep === 'success' && 'Paiement réussi'}
              {paymentStep === 'failure' && 'Échec du paiement'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Étape 1: Sélection de l'opérateur */}
          {paymentStep === 'select' && (
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
                  <p className="text-sm font-medium text-[#96172E] mt-1">{voteAmount} vote{voteAmount > 1 ? 's' : ''} • {getAmount()} FCFA</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Choisissez votre opérateur de paiement</label>
                <div className="grid grid-cols-2 gap-3">
                  {operators.map((operator) => (
                    <button
                      key={operator.id}
                      onClick={() => setSelectedOperator(operator.code)}
                      className={`border rounded-lg p-4 flex flex-col items-center justify-center transition-colors ${
                        selectedOperator === operator.code 
                          ? 'border-[#96172E] bg-[#96172E]/10' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={operator.logo} alt={operator.name} className="h-8 mb-2" />
                      <span className="text-sm font-medium">{operator.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone size={16} className="text-gray-500" />
                  </div>
                  <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                    <span className="text-gray-500">+237</span>
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-24 pr-4 py-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-[#96172E] focus:border-[#96172E]"
                    placeholder="6XXXXXXXX"
                    maxLength="9"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Entrez votre numéro de téléphone Mobile Money sans l'indicatif +237
                </p>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
                  <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="text-xs text-gray-500 mb-4">
                En procédant au paiement, vous acceptez les conditions générales d'utilisation de Monetbil et du concours Miss Master HITBAMAS.
              </div>

              <button
                onClick={initiatePayment}
                disabled={!selectedOperator || !phoneNumber || isLoading}
                className={`w-full py-3 ${
                  !selectedOperator || !phoneNumber || isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#96172E] hover:bg-[#7d1427]'
                } text-white font-medium rounded transition-colors flex items-center justify-center space-x-2`}
              >
                <CreditCard size={18} />
                <span>{isLoading ? 'Traitement en cours...' : 'Procéder au paiement'}</span>
              </button>
            </>
          )}

          {/* Étape 2: Traitement du paiement */}
          {paymentStep === 'process' && (
            <div className="text-center py-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 border-4 border-[#96172E]/20 border-t-[#96172E] rounded-full animate-spin mb-4"></div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">Paiement en cours de traitement</h4>
                <p className="text-gray-600 mb-4">
                  Veuillez confirmer le paiement sur votre téléphone
                </p>
                
                <div className="bg-[#96172E]/10 border border-[#96172E]/20 rounded-lg p-4 w-full max-w-xs mb-4">
                  <p className="text-sm text-center mb-2 text-[#96172E]">Composez le code USSD suivant :</p>
                  <p className="text-xl font-bold text-center text-[#96172E]">
                    {selectedOperator === 'CM_MTNMOBILEMONEY' ? '*126*1#' : '#150*1#'}
                  </p>
                </div>
                
                <p className="text-sm text-gray-500">
                  Veuillez suivre les instructions sur votre téléphone pour confirmer le paiement de <span className="font-medium">{getAmount()} FCFA</span>
                </p>
              </div>
              
              <p className="text-xs text-gray-500">
                Référence de transaction: {paymentId}<br />
                Ce paiement expirera dans 15 minutes
              </p>
              
              <button
                onClick={() => {
                  stopCheckingPayment();
                  setPaymentStep('select');
                }}
                className="mt-6 text-[#96172E] hover:text-[#7d1427] font-medium text-sm"
              >
                Annuler et revenir en arrière
              </button>
            </div>
          )}

          {/* Étape 3: Paiement réussi */}
          {paymentStep === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-green-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                Paiement effectué avec succès !
              </h4>
              <p className="text-gray-600 mb-6">
                Votre vote pour {selectedCandidate?.name} a été enregistré.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h5 className="font-medium mb-2 text-gray-700">Détails de la transaction</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Montant payé:</span>
                    <span className="font-medium">{paymentStatus.amount} {paymentStatus.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Référence:</span>
                    <span>{paymentStatus.transaction_UUID || paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#96172E] hover:bg-[#7d1427] text-white font-medium rounded transition-colors"
              >
                Fermer
              </button>
            </div>
          )}

          {/* Étape 4: Échec du paiement */}
          {paymentStep === 'failure' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                Échec du paiement
              </h4>
              <p className="text-gray-600 mb-6">
                {errorMessage || "Une erreur est survenue lors du traitement de votre paiement."}
              </p>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    setPaymentStep('select');
                    setErrorMessage('');
                  }}
                  className="w-full py-3 bg-[#96172E] hover:bg-[#7d1427] text-white font-medium rounded transition-colors"
                >
                  Réessayer
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonetbilPayment;