import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Connexion({ onSwitch, onLogin }) {
  const navigate  = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (email === 'admin' && password === 'admin') {
      setError('');
      if (onLogin) onLogin(); // Déclenche le passage au thème Iconic
      navigate('/user');
    } else {
      setError('Identifiants incorrects. Essaie admin / admin.');
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center px-8 sm:px-12 py-6 animate-[fadeIn_0.5s_ease-out] bg-[var(--card-color)] text-slate-100 font-sans overflow-y-auto lg:overflow-hidden">

      {/* Titre */}
      <div className="mb-3 text-center lg:text-left">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[1.1] mb-1">
          Bon retour sur <br className="hidden lg:block"/>
          <span className="bg-[var(--accent-color)] text-[var(--bg-color)] py-1 inline-block transition-colors duration-1000 shadow-2xl">
            SeenIt
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-medium">
          Prêt à archiver ton dernier chef-d'œuvre ?
        </p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>

        {/* Champ Email / Identifiant */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-400 ml-1">Identifiant</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail size={18} className="text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="admin"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              className="w-full bg-[var(--bg-color)] border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-[var(--accent-color)] transition-colors placeholder:text-slate-600 text-sm font-medium"
            />
          </div>
        </div>

        {/* Champ Mot de passe */}
        <div className="space-y-1">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-bold text-slate-400">Mot de passe</label>
            <a href="#" className="text-xs font-bold text-[var(--accent-color)] hover:underline">Oublié ?</a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={18} className="text-slate-500" />
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              className="w-full bg-[var(--bg-color)] border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-[var(--accent-color)] transition-colors placeholder:text-slate-600 text-sm font-medium"
            />
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <p className="text-xs font-bold text-rose-500 ml-1">{error}</p>
        )}

        {/* Bouton Principal */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-[var(--accent-color)] text-[var(--bg-color)] px-6 py-3 mt-4 rounded-xl font-bold text-base transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 shadow-[0_8px_16px_rgba(0,0,0,0.3)] group"
        >
          Entrer en salle
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      {/* Séparateur */}
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ou</span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>

      {/* Bouton Google */}
      <button className="w-full bg-[var(--bg-color)] border border-white/10 text-white font-bold text-sm rounded-xl py-3 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5">
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continuer avec Google
      </button>

      {/* Switch Mobile */}
      <p className="text-center mt-5 text-sm text-slate-400 font-medium lg:hidden">
        Pas encore de compte ?{' '}
        <button onClick={onSwitch} className="text-[var(--accent-color)] font-bold hover:underline">
          Prendre un ticket
        </button>
      </p>
    </div>
  );
}