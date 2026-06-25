import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import NavFirst       from './components/NavFirst';
import LandingPage    from './pages/LandingPage';
import Auth           from './pages/Auth';
import UserInterface  from './pages/UserInterface';

import { verifySession, getUser, logout, syncTheme } from './utils/auth';

const THEMES = [
  {
    id: 'crimson',
    name: 'Salle Obscure',
    bg: '#09090B',
    card: '#18181B',
    accent: '#E11D48',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textMuted: '#94a3b8',
    textInverse: '#09090B',
    borderSubtle: 'rgba(255,255,255,0.08)',
    borderMedium: 'rgba(255,255,255,0.15)',
    isLight: false,
    marbleOverlay: null,
  },
  {
    id: 'midnight',
    name: 'Nuit',
    bg: '#0F172A',
    card: '#1E293B',
    accent: '#F59E0B',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textMuted: '#94a3b8',
    textInverse: '#0F172A',
    borderSubtle: 'rgba(255,255,255,0.08)',
    borderMedium: 'rgba(255,255,255,0.15)',
    isLight: false,
    marbleOverlay: null,
  },
  {
    id: 'matrix',
    name: 'Sci-Fi',
    bg: '#022C22',
    card: '#064E3B',
    accent: '#10B981',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textMuted: '#94a3b8',
    textInverse: '#022C22',
    borderSubtle: 'rgba(255,255,255,0.08)',
    borderMedium: 'rgba(255,255,255,0.15)',
    isLight: false,
    marbleOverlay: null,
  },
  {
    id: 'noir',
    name: 'Film Noir',
    bg: '#0A0A0A',
    card: '#171717',
    accent: '#F5F5F5',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textMuted: '#94a3b8',
    textInverse: '#0A0A0A',
    borderSubtle: 'rgba(255,255,255,0.08)',
    borderMedium: 'rgba(255,255,255,0.15)',
    isLight: false,
    marbleOverlay: null,
  },
  {
    id: 'vintage',
    name: 'Pellicule',
    bg: '#292524',
    card: '#44403C',
    accent: '#D97706',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textMuted: '#475569',
    textInverse: '#292524',
    borderSubtle: 'rgba(255,255,255,0.08)',
    borderMedium: 'rgba(255,255,255,0.15)',
    isLight: false,
    marbleOverlay: null,
  },
  {
    id: 'iconic',
    name: 'Iconic ✦',
    bg: '#F0EDE8',
    card: '#E8E4DC',
    accent: '#C9960C',
    textPrimary: '#1A1612',
    textSecondary: '#4A4540',
    textMuted: '#7A7570',
    textInverse: '#F0EDE8',
    borderSubtle: 'rgba(26,22,18,0.10)',
    borderMedium: 'rgba(26,22,18,0.20)',
    isLight: true,
    marbleOverlay: true,
    locked: true
  },
];

export default function App() {
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
  const [user,         setUser]          = useState(null);
  const [authChecked,  setAuthChecked]   = useState(false); // évite le flash

  // ── Vérification session au démarrage ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      const savedUser = await verifySession();
      if (savedUser) {
        setUser(savedUser);
        // Restaure le thème sauvegardé (sauf si iconic et pas débloqué)
        const savedTheme = THEMES.find(t => t.id === savedUser.theme);
        if (savedTheme && !(savedTheme.locked)) {
          setCurrentTheme(savedTheme);
        }
      }
      setAuthChecked(true);
    })();
  }, []);

// ── Changement de thème (avec sync BDD si connecté) ───────────────────────
const handleThemeChange = (theme) => {
  // On retire la ligne "if (theme.locked) return;" 
  // car la logique de sécurité est déjà gérée dans NavFirst
  setCurrentTheme(theme);
  syncTheme(theme.id); // fire-and-forget
};
  // ── Login callback ─────────────────────────────────────────────────────────
  const handleLogin = (userData) => {
    setUser(userData);
    const savedTheme = THEMES.find(t => t.id === userData.theme);
    if (savedTheme && !savedTheme.locked) setCurrentTheme(savedTheme);
  };

  // ── Logout explicite ───────────────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    setUser(null);
    setCurrentTheme(THEMES[0]); // reset thème
  };

  // Évite le flash (blanc → landing ou user)
  if (!authChecked) return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'var(--bg-color)', color: 'var(--text-muted)'
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        SeenIt…
      </div>
    </div>
  );

  return (
    <BrowserRouter>
{currentTheme.id === 'iconic' && (
  <style>{`
    .iconic-marble-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      opacity: 0.55;
      background-image: url("...");
      background-size: 900px 700px;
      background-repeat: repeat;
    }

    .iconic-top-border::before {
      content: '';
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(201,150,12,0.4) 20%,
        rgba(201,150,12,0.9) 50%,
        rgba(201,150,12,0.4) 80%,
        transparent 100%
      );
      z-index: 1000;
    }
  `}</style>
)}
<div
  className={`min-h-screen flex flex-col transition-colors duration-700 ${
    currentTheme.isLight ? 'iconic-top-border' : ''
   }`}
  style={{
    '--bg-color': currentTheme.bg,
    '--card-color': currentTheme.card,
    '--accent-color': currentTheme.accent,
    '--text-primary': currentTheme.textPrimary,
    '--text-secondary': currentTheme.textSecondary,
    '--text-muted': currentTheme.textMuted,
    '--text-inverse': currentTheme.textInverse,
    '--border-subtle': currentTheme.borderSubtle,
    '--border-medium': currentTheme.borderMedium,
    backgroundColor: currentTheme.bg,
    color: currentTheme.textPrimary,
  }}
>
{currentTheme.id === 'iconic' && (
        <div className="iconic-marble-bg" />
      )}
        <NavFirst
          currentTheme={currentTheme}
          setCurrentTheme={handleThemeChange}
          themes={THEMES}
          isLoggedIn={!!user}
          onLogout={handleLogout}
          user={user}
        />
        <Routes>
          {/* Landing — accessible à tous */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth — redirige vers /user si déjà connecté */}
          <Route
            path="/auth"
            element={user ? <Navigate to="/user" replace /> : <Auth onLogin={handleLogin} />}
          />

          {/* User space — redirige vers /auth si pas connecté */}
          <Route
            path="/user"
            element={user
              ? <UserInterface currentTheme={currentTheme} user={user} onLogout={handleLogout} />
              : <Navigate to="/auth" replace />
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}