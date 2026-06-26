import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';

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

export default function Inscription({ onSwitch, onLoginSuccess }) {
  const ts = useThemeStyles();
  
  // --- ÉTATS DU FORMULAIRE ---
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirm: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- LOGIQUE INSCRIPTION CLASSIQUE ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // 1. Validation Stricte de l'adresse Gmail
    const emailLower = formData.email.toLowerCase().trim();
    if (!emailLower.endsWith('@gmail.com')) {
      return setErrorMsg("Désolé, seules les adresses @gmail.com sont autorisées pour ce club !");
    }

    // 2. Validation de la confirmation du mot de passe
    if (formData.password !== formData.confirm) {
      return setErrorMsg("Les mots de passe ne correspondent pas !");
    }

    setLoading(true);
    try {
      const res = await fetch('https://seenit-backend-n8ve.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Une erreur est survenue lors de l'inscription");

      // Sauvegarde locale du token
      localStorage.setItem('token', data.token);
      
      // Affichage du message de bienvenue
      setSuccessMsg(`🍿 Bienvenue au club, ${data.user.username} ! Ton badge est créé.`);

      // Petit délai de 2 secondes pour laisser le temps de lire le message avant de changer d'écran
      setTimeout(() => {
        if(onLoginSuccess) onLoginSuccess(data.user);
      }, 2000);
      
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center px-6 sm:px-10 py-4 animate-[fadeIn_0.5s_ease-out] font-sans overflow-y-auto lg:overflow-hidden"
         style={{ backgroundColor: 'var(--card-color)' }}>
      
      <div className="mb-3 text-center lg:text-left">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-[1.1] mb-1" style={ts.textPrimary}>
          Rejoins le <br className="hidden lg:block"/>
          <span className="py-1 inline-block transition-colors duration-1000 shadow-2xl px-2" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}>
            Casting
          </span>
        </h2>
        <p className="text-xs sm:text-sm font-medium" style={ts.textSecondary}>
          Crée ton badge de critique pour archiver tes films.
        </p>
      </div>

      {/* 🔴 Affichage des erreurs éventuelles */}
      {errorMsg && (
        <div className="p-3 mb-2 text-sm text-red-500 bg-red-100/10 border border-red-500/30 rounded-lg text-center font-semibold animate-[headShake_0.5s_ease-in-out]">
          {errorMsg}
        </div>
      )}

      {/* 🟢 Affichage du message de bienvenue (Succès) */}
      {successMsg && (
        <div className="p-3 mb-2 text-sm text-green-500 bg-green-100/10 border border-green-500/30 rounded-lg flex items-center justify-center gap-2 font-bold animate-[bounce_0.5s_ease-in-out]">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      <form className="space-y-3" onSubmit={handleRegister}>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-bold ml-1" style={ts.textSecondary}>Nom ou Pseudo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <UserIcon size={16} style={ts.textMuted} />
              </div>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading || !!successMsg}
                placeholder="SpielbergDuDimanche"
                className="w-full border rounded-xl pl-10 pr-3 py-3 focus:outline-none transition-colors text-sm font-medium placeholder-[color:var(--text-muted)] focus:border-[var(--accent-color)] disabled:opacity-50"
                style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold ml-1" style={ts.textSecondary}>Email (Gmail uniquement)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail size={16} style={ts.textMuted} />
              </div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading || !!successMsg}
                placeholder="realisateur@gmail.com"
                className="w-full border rounded-xl pl-10 pr-3 py-3 focus:outline-none transition-colors text-sm font-medium placeholder-[color:var(--text-muted)] focus:border-[var(--accent-color)] disabled:opacity-50"
                style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-bold ml-1" style={ts.textSecondary}>Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock size={16} style={ts.textMuted} />
              </div>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading || !!successMsg}
                placeholder="••••••••"
                className="w-full border rounded-xl pl-10 pr-3 py-3 focus:outline-none transition-colors text-sm font-medium placeholder-[color:var(--text-muted)] focus:border-[var(--accent-color)] disabled:opacity-50"
                style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold ml-1" style={ts.textSecondary}>Confirmation</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock size={16} style={ts.textMuted} />
              </div>
              <input 
                type="password" 
                name="confirm"
                value={formData.confirm}
                onChange={handleChange}
                required
                disabled={loading || !!successMsg}
                placeholder="••••••••"
                className="w-full border rounded-xl pl-10 pr-3 py-3 focus:outline-none transition-colors text-sm font-medium placeholder-[color:var(--text-muted)] focus:border-[var(--accent-color)] disabled:opacity-50"
                style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading || !!successMsg}
          className="w-full flex items-center justify-center gap-2 px-6 py-2.5 mt-2 rounded-xl font-bold text-base transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 shadow-[0_8px_16px_rgba(0,0,0,0.3)] group disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}
        >
          {loading ? "Création du badge..." : successMsg ? "Redirection..." : "Prendre un ticket"}
          {!loading && !successMsg && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      <p className="text-center mt-6 text-xs sm:text-sm font-medium" style={ts.textSecondary}>
        Déjà membre du club ?{' '}
        <button onClick={onSwitch} disabled={loading || !!successMsg} className="font-bold hover:underline disabled:opacity-50" style={ts.textAccent}>
          Aller à mon siège
        </button>
      </p>
    </div>
  );
}