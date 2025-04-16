import React from 'react';
import { X } from 'lucide-react';

const PaymentPopup = ({ isOpen, onClose, numberOfVotes = 1 }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
        <div className="relative p-6">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-800">
              🎉 Finalisez votre vote en quelques étapes simples !
            </h2>
          </div>
          
          <div className="space-y-4 text-gray-700">
            <p className="font-medium">
              Cher utilisateur, votre voix compte énormément ! Pour valider définitivement 
              votre(vos) vote(s), il vous suffit de :
            </p>
            
            <div className="pl-4 space-y-4">
              <p className="flex items-start">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">1️⃣</span>
                <span className="font-semibold">
                  Effectuer le dépôt correspondant au nombre de votes que vous avez émis.
                </span>
              </p>
              
              <p className="flex items-start">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">2️⃣</span>
                <span className="font-semibold">
                  Utiliser l'un des numéros suivants selon votre opérateur :
                </span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Orange Money Option */}
              <div className="border border-orange-300 rounded-lg p-4 bg-orange-50 hover:shadow-md transition-all">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    Orange
                  </div>
                </div>
                <p className="text-center font-bold text-gray-800">Orange Money</p>
                <p className="text-center text-lg font-semibold text-orange-600">695 96 51 75</p>
              </div>
              
              {/* MTN Mobile Money Option */}
              <div className="border border-yellow-300 rounded-lg p-4 bg-yellow-50 hover:shadow-md transition-all">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    MTN
                  </div>
                </div>
                <p className="text-center font-bold text-gray-800">MTN Mobile Money</p>
                <p className="text-center text-lg font-semibold text-yellow-600">683 50 01 88</p>
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg mt-2">
              <p className="font-medium text-gray-700">
                <span className="font-bold">💡 Exemple :</span> Si vous avez voté {numberOfVotes > 1 ? `${numberOfVotes} fois` : '1 fois'}, 
                effectuez un dépôt équivalent à {numberOfVotes} vote{numberOfVotes > 1 ? 's' : ''}.
              </p>
            </div>
            
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-purple-700">
                Puis faites une capture d'écran et envoyez-la au numéro WhatsApp <span className="font-bold">695 96 51 75</span>
              </p>
            </div>
            
            <p className="text-center font-medium mt-6">
              Un immense merci pour votre participation et votre compréhension ! 
              <br />Ensemble, faisons la différence. 🙌
            </p>
          </div>
          
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors shadow-md"
            >
              J'ai compris
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;