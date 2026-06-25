import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, ArrowRight } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google'; // Import de Google

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- LOGIQUE INSCRIPTION CLASSIQUE ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirm) {
      return setErrorMsg("Les mots de passe ne correspondent pas !");
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Succès ! On sauvegarde le token et on passe à la suite
      localStorage.setItem('token', data.token);
      if(onLoginSuccess) onLoginSuccess(data.user);
      
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIQUE INSCRIPTION GOOGLE ---
  // Cette fonction s'exécute si l'utilisateur clique sur ton bouton personnalisé
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Optionnel : tu peux récupérer les infos de l'utilisateur avec l'access_token ici, 
        // ou l'envoyer au backend si tu utilises flow="auth-code". 
        // Pour plus de simplicité avec "implicit grant", on envoie le token direct.
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        // On envoie un "pseudo" token Google à notre backend pour le valider
        const res = await fetch('http://localhost:5000/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Attention: dans un flux de prod parfait, on enverrait l'ID token.
          // Ici on simule l'envoi des infos vérifiées par Google.
          body: JSON.stringify({ 
            credential: tokenResponse.access_token, // À ajuster selon le flux choisi
            email: userInfo.email,
            name: userInfo.name
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem('token', data.token);
        if(onLoginSuccess) onLoginSuccess(data.user);

      } catch (err) {
        setErrorMsg("Erreur lors de la connexion avec Google.");
      }
    },
    onError: () => setErrorMsg('Échec de la connexion Google'),
  });

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

      {/* Affichage des erreurs éventuelles */}
      {errorMsg && (
        <div className="p-2 mb-2 text-sm text-red-500 bg-red-100/10 border border-red-500/50 rounded-lg text-center">
          {errorMsg}
        </div>
      )}

      <form className="space-y-3" onSubmit={handleRegister}>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-bold ml-1" style={ts.textSecondary}>Nom ou Pseudo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0  pl-3.5 flex items-center pointer-events-none">
                <UserIcon size={16} style={ts.textMuted} />
              </div>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="SpielbergDuDimanche"
                className="w-full border rounded-xl pl-10 pr-3 py-3 focus:outline-none transition-colors text-sm font-medium placeholder-[color:var(--text-muted)] focus:border-[var(--accent-color)]"
                style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold ml-1" style={ts.textSecondary}>Email</label>
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
                placeholder="realisateur@cinema.com"
                className="w-full border rounded-xl pl-10 pr-3 py-3 focus:outline-none transition-colors text-sm font-medium placeholder-[color:var(--text-muted)] focus:border-[var(--accent-color)]"
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
                placeholder="••••••••"
                className="w-full border rounded-xl pl-10 pr-3 py-3 focus:outline-none transition-colors text-sm font-medium placeholder-[color:var(--text-muted)] focus:border-[var(--accent-color)]"
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
                placeholder="••••••••"
                className="w-full border rounded-xl pl-10 pr-3 py-3 focus:outline-none transition-colors text-sm font-medium placeholder-[color:var(--text-muted)] focus:border-[var(--accent-color)]"
                style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-2.5 mt-2 rounded-xl font-bold text-base transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 shadow-[0_8px_16px_rgba(0,0,0,0.3)] group disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-inverse)' }}
        >
          {loading ? "Chargement..." : "Prendre un ticket"}
          {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t" style={ts.borderSubtle}></div>
        <span className="px-3 text-[10px] font-bold uppercase tracking-wider" style={ts.textMuted}>Ou</span>
        <div className="flex-grow border-t" style={ts.borderSubtle}></div>
      </div>

      <button 
        onClick={() => loginWithGoogle()}
        type="button"
        className="w-full border font-bold text-sm rounded-xl py-2.5 transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 hover:opacity-80"
        style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        S'inscrire avec Google
      </button>

      <p className="text-center mt-4 text-xs sm:text-sm font-medium lg:hidden" style={ts.textSecondary}>
        Déjà membre du club ?{' '}
        <button onClick={onSwitch} className="font-bold hover:underline" style={ts.textAccent}>
          Aller à mon siège
        </button>
      </p>
    </div>
  );
}