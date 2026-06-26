import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- HELPER : classes texte adaptées au thème ---
function useThemeStyles() {
  return {
    textPrimary:   { color: 'var(--text-primary)' },
    textSecondary: { color: 'var(--text-secondary)' },
    textMuted:     { color: 'var(--text-muted)' },
    textAccent:    { color: 'var(--accent-color)' },
    bgCard:        { backgroundColor: 'var(--card-color)' },
    bgMain:        { backgroundColor: 'var(--bg-color)' },
    borderSubtle:  { borderColor: 'var(--border-subtle)' },
    borderMedium:  { borderColor: 'var(--border-medium)' },
  };
}

export default function Connexion({ onSwitch, onLogin }) {
  const ts = useThemeStyles();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); // 👈 État pour le message de bienvenue
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    // 1. Validation locale : On s'assure que c'est bien un format Gmail
    const emailLower = email.toLowerCase().trim();
    if (!emailLower.endsWith('@gmail.com')) {
      setLoading(false);
      return setError("Le format de l'identifiant doit être une adresse @gmail.com valide.");
    }

    try {
      const response = await fetch('https://seenit-backend-n8ve.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailLower, password }),
      });

      const data = await response.json();

      // 2. Si le serveur renvoie une erreur (401, 404, etc.)
      if (!response.ok) {
        throw new Error(data.message || "Identifiants incorrects ou introuvables.");
      }

      // 3. Cas de succès complet
      const { token, user } = data;
      localStorage.setItem('seenit_token', token);
      localStorage.setItem('seenit_user', JSON.stringify(user));

      setSuccessMsg(`🍿 Bon retour dans la salle, ${user.username} ! Préparation de ton siège...`);
      setLoading(false);

      // Petit délai de 1.5 seconde pour afficher l'animation de succès avant de sauter sur la page utilisateur
      setTimeout(() => {
        if (onLogin) onLogin(user);
        navigate('/user');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Impossible de contacter le serveur.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center px-8 sm:px-12 py-6 animate-[fadeIn_0.5s_ease-out] font-sans overflow-y-auto lg:overflow-hidden"
         style={{ backgroundColor: 'var(--card-color)' }}>

      {/* Titre */}
      <div className="mb-3 text-center lg:text-left">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-[1.1] mb-1" style={ts.textPrimary}>
          Bon retour sur <br className="hidden lg:block"/>
          <span className="py-1 inline-block transition-colors duration-1000 shadow-2xl px-2" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>
            SeenIt
          </span>
        </h2>
        <p className="text-sm sm:text-base font-medium" style={ts.textSecondary}>
          Prêt à archiver ton dernier chef-d'œuvre ?
        </p>
      </div>

      {/* 🔴 Affichage des erreurs dynamiques */}
      {error && (
        <div className="p-3 mb-2 text-sm text-red-500 bg-red-100/10 border border-red-500/30 rounded-lg text-center font-semibold animate-[headShake_0.5s_ease-in-out]">
          {error}
        </div>
      )}

      {/* 🟢 Affichage du message de bienvenue */}
      {successMsg && (
        <div className="p-3 mb-2 text-sm text-green-500 bg-green-100/10 border border-green-500/30 rounded-lg flex items-center justify-center gap-2 font-bold animate-[bounce_0.5s_ease-in-out]">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      <form className="space-y-3" onSubmit={handleSubmit}>

        {/* Champ Email / Identifiant */}
        <div className="space-y-1">
          <label className="text-sm font-bold ml-1" style={ts.textSecondary}>Identifiant (Gmail)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail size={18} style={ts.textMuted} />
            </div>
            <input
              type="text"
              placeholder="votre.email@gmail.com"
              value={email}
              disabled={loading || !!successMsg}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              className="w-full border rounded-xl pl-11 pr-4 py-3 focus:outline-none transition-colors text-sm font-medium placeholder-[color:var(--text-muted)] focus:border-[var(--accent-color)] disabled:opacity-50"
              style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Champ Mot de passe */}
        <div className="space-y-1">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-bold" style={ts.textSecondary}>Mot de passe</label>
            <a href="#" className="text-xs font-bold hover:underline" style={ts.textAccent}>Oublié ?</a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={18} style={ts.textMuted} />
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              disabled={loading || !!successMsg}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              className="w-full border rounded-xl pl-11 pr-4 py-3 focus:outline-none transition-colors text-sm font-medium placeholder-[color:var(--text-muted)] focus:border-[var(--accent-color)] disabled:opacity-50"
              style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Bouton Principal */}
        <button
          type="submit"
          disabled={loading || !!successMsg}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 mt-4 rounded-xl font-bold text-base transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 shadow-[0_8px_16px_rgba(0,0,0,0.3)] group disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}
        >
          {loading ? 'Connexion en cours...' : successMsg ? 'Accès autorisé...' : 'Entrer en salle'}
          {!loading && !successMsg && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      {/* Séparateur */}
      <div className="flex items-center my-4">
        <div className="flex-grow border-t" style={ts.borderSubtle}></div>
        <span className="px-3 text-[10px] font-bold uppercase tracking-wider" style={ts.textMuted}>Ou</span>
        <div className="flex-grow border-t" style={ts.borderSubtle}></div>
      </div>

      {/* Bouton Google */}
      <button 
        type="button"
        disabled={loading || !!successMsg}
        className="w-full border font-bold text-sm rounded-xl py-3 transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continuer avec Google
      </button>

      {/* Switch Mobile */}
      <p className="text-center mt-5 text-sm font-medium lg:hidden" style={ts.textSecondary}>
        Pas encore de compte ?{' '}
        <button 
          onClick={onSwitch} 
          disabled={loading || !!successMsg}
          className="font-bold hover:underline disabled:opacity-50" 
          style={ts.textAccent}
        >
          Prendre un ticket
        </button>
      </p>
    </div>
  );
}