import React, { useState } from 'react';
import { Clapperboard, Ticket, Film } from 'lucide-react';
import Connexion from '../components/Connexion';
import Inscription from '../components/Inscription';



export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    // FIX : On force le conteneur à occuper exactement l'espace restant (Écran - Navbar)
    <div className="h-[calc(100vh-96px)] w-full flex items-center justify-center p-4 sm:px-6 relative box-border">
      
      {/* Le cadre principal de ton interface d'authentification */}
      <main className="w-full max-w-6xl h-full max-h-[650px] bg-[var(--card-color)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden flex relative z-10">
        
        {/* Panneau de Connexion / Inscription */}
        <div 
          className={`absolute top-0 left-0 h-full w-full lg:w-1/2 transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] z-10 bg-[var(--card-color)] ${
            isLogin ? 'translate-x-0' : 'lg:translate-x-full'
          }`}
        >
          {isLogin ? (
            <Connexion onSwitch={() => setIsLogin(false)} />
          ) : (
            <Inscription onSwitch={() => setIsLogin(true)} />
          )}
        </div>

        {/* Panneau Décoratif de Droite (Slider) */}
        <div 
          className={`hidden lg:flex absolute top-0 left-1/2 h-full w-1/2 transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] z-20 ${
            isLogin ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="relative w-full h-full bg-[var(--accent-color)] text-[var(--bg-color)] p-12 flex flex-col justify-center items-center overflow-hidden transition-colors duration-1000 shadow-2xl">
            
            <div className="absolute left-2 top-0 bottom-0 w-4 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 15px, var(--bg-color) 15px, var(--bg-color) 30px)' }}></div>
            <div className="absolute right-2 top-0 bottom-0 w-4 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 15px, var(--bg-color) 15px, var(--bg-color) 30px)' }}></div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
              <Film className="animate-[spin_25s_linear_infinite]" size={400} strokeWidth={0.5}/>
            </div>

            <div className="relative z-10 w-full px-8 text-center">
              {isLogin ? (
                <div className="animate-[fadeIn_0.5s_ease-out]">
                  <Ticket className="mx-auto mb-6 opacity-90 drop-shadow-lg" size={72} strokeWidth={1.5}/>
                  <h3 className="text-4xl font-black mb-4 tracking-tighter drop-shadow-md">
                    Nouveau Casting ?
                  </h3>
                  <div className="w-16 h-1 bg-[var(--bg-color)] mx-auto mb-6 opacity-50"></div>
                  <p className="text-lg font-bold opacity-80 mb-10 max-w-sm mx-auto leading-relaxed">
                    Crée ton espace VIP. Archive tes films, lâche tes critiques sans censure et prouve tes goûts cinématographiques.
                  </p>
                  <button 
                    onClick={() => setIsLogin(false)}
                    className="border-4 border-[var(--bg-color)] text-[var(--bg-color)] font-black px-8 py-4 rounded-xl hover:bg-[var(--bg-color)] hover:text-[var(--accent-color)] hover:-translate-y-1 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.2)] text-lg"
                  >
                    Prendre un ticket
                  </button>
                </div>
              ) : (
                <div className="animate-[fadeIn_0.5s_ease-out]">
                  <Clapperboard className="mx-auto mb-6 opacity-90 drop-shadow-lg" size={72} strokeWidth={1.5}/>
                  <h3 className="text-4xl font-black mb-4 tracking-tighter drop-shadow-md">
                    Déjà Réalisateur ?
                  </h3>
                  <div className="w-16 h-1 bg-[var(--bg-color)] mx-auto mb-6 opacity-50"></div>
                  <p className="text-lg font-bold opacity-80 mb-10 max-w-sm mx-auto leading-relaxed">
                    Ta place est numérotée et gardée au chaud. Connecte-toi pour reprendre ton historique là où tu l'as laissé.
                  </p>
                  <button 
                    onClick={() => setIsLogin(true)}
                    className="border-4 border-[var(--bg-color)] text-[var(--bg-color)] font-black px-8 py-4 rounded-xl hover:bg-[var(--bg-color)] hover:text-[var(--accent-color)] hover:-translate-y-1 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.2)] text-lg"
                  >
                    Aller à mon siège
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}