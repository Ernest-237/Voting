// components/Footer.jsx
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#96172E] text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/logo-hitbamas.png" alt="HITBAMAS" className="h-10 mr-2" />
              <span className="text-xl font-bold">MISS MASTER</span>
            </div>
            <p className="text-gray-300">Concours annuel valorisant l'excellence académique et le leadership des étudiantes de HITBAMAS.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="bg-white/10 hover:bg-white/20 h-10 w-10 rounded-full flex items-center justify-center"><Facebook size={20} /></a>
              <a href="#" className="bg-white/10 hover:bg-white/20 h-10 w-10 rounded-full flex items-center justify-center"><Instagram size={20} /></a>
              <a href="#" className="bg-white/10 hover:bg-white/20 h-10 w-10 rounded-full flex items-center justify-center"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Accueil</a></li>
              <li><a href="#candidates" className="text-gray-300 hover:text-white">Candidates</a></li>
              <li><a href="#how-to-vote" className="text-gray-300 hover:text-white">Comment voter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Événements</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Règlement du concours</a></li>
              <li><a href="#" className="hover:text-white">Éditions précédentes</a></li>
              <li><a href="#" className="hover:text-white">Galerie photos</a></li>
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
  );
};

export default Footer;
