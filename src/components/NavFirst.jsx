import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Palette, Crown, LogOut, Lock } from 'lucide-react';

export default function NavFirst({ currentTheme, setCurrentTheme, themes, isLoggedIn, onLogout, user }) {
  const location = useLocation();
  const navigate  = useNavigate();

  const isAuth    = location.pathname === '/auth';
  const isUser    = location.pathname === '/user';
  const isIconic  = currentTheme.id === 'iconic';

  // Sur /user → logo clique → dashboard (pas landing)
  const handleLogoClick = (e) => {
    if (isUser) {
      e.preventDefault();
      // On ne navigue pas, on reste sur /user (le dashboard est déjà là)
      // Si tu as un state interne dans UserInterface pour reset la vue :
      window.dispatchEvent(new CustomEvent('seenit:go-dashboard'));
    }
  };

  const cycleTheme = () => {
    // Skip les themes locked
    const available = themes.filter(t => !t.locked);
    const idx = available.findIndex(t => t.id === currentTheme.id);
    setCurrentTheme(available[(idx + 1) % available.length]);
  };

  return (
    <nav className="h-[90px] shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-50 relative">

      {/* ── Logo ── */}
      <Link
        to={isUser ? '/user' : '/'}
        onClick={handleLogoClick}
        className="text-3xl font-black tracking-tighter flex items-center gap-2 select-none group"
      >
        <span className="transition-colors duration-700" style={{ color: 'var(--text-primary)' }}>
          SeenIt
        </span>
        <span className="transition-colors duration-700" style={{ color: 'var(--accent-color)' }}>
          .
        </span>
        {isIconic && (
          <span className="flex items-center gap-1 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded border"
            style={{ borderColor: 'rgba(201,150,12,0.5)', color: 'var(--accent-color)', backgroundColor: 'rgba(201,150,12,0.08)' }}>
            <Crown size={8} /> Iconic
          </span>
        )}
      </Link>

      {/* ── Actions droite ── */}
      <div className="flex items-center gap-3 sm:gap-5">

        {/* Sélecteur desktop */}
        <div
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border transition-colors duration-700 shadow-lg"
          style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}
        >
          <Palette className="mr-1 transition-colors duration-700" size={15} style={{ color: 'var(--text-muted)' }} />
          {themes.map(theme => {
            // Iconic : verrouillé uniquement si on est dans /user
            const isLocked = theme.locked && isUser;
            return (
              <button
                key={theme.id}
                onClick={() => !isLocked && setCurrentTheme(theme)}
                title={isLocked ? `${theme.name} — Disponible dans ton espace` : theme.name}
                className={`relative transition-all duration-300 ${
                  currentTheme.id === theme.id ? 'ring-2 ring-offset-2 scale-125' : isLocked ? 'opacity-30 cursor-not-allowed' : 'opacity-50 hover:opacity-100 hover:scale-110'
                }`}
                style={{
                  width:           theme.id === 'iconic' ? '20px' : '16px',
                  height:          theme.id === 'iconic' ? '20px' : '16px',
                  borderRadius:    theme.id === 'iconic' ? '3px' : '50%',
                  backgroundColor: theme.accent,
                  border: theme.id === 'iconic' ? '1.5px solid rgba(201,150,12,0.8)' : 'none',
                }}
              >
                {theme.id === 'iconic' && (
                  isLocked
                    ? <Lock size={7} className="absolute inset-0 m-auto" style={{ color: '#1A1612' }} />
                    : <Crown size={9} className="absolute inset-0 m-auto" style={{ color: '#1A1612' }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Cercle thème mobile */}
        <button
          onClick={cycleTheme}
          title={`Thème : ${currentTheme.name}`}
          className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 active:scale-90 shrink-0"
          style={{ backgroundColor: currentTheme.accent, borderColor: 'var(--border-medium)' }}
        >
          {isIconic && <Crown size={12} style={{ color: '#1A1612' }} />}
        </button>

        {/* Bouton Déconnexion (visible uniquement dans /user) */}
        {isUser && isLoggedIn && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-[12px] font-black uppercase tracking-tight px-4 py-3 rounded-xl border-2 transition-all duration-300 hover:opacity-80 active:scale-95"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        )}

        {/* Bouton Connexion (landing + autres pages publiques) */}
        {!isAuth && !isUser && !isLoggedIn && (
          <button
            onClick={() => navigate('/auth')}
            className="text-sm font-bold px-5 sm:px-6 py-2.5 rounded-lg border transition-all duration-300 whitespace-nowrap"
            style={{ backgroundColor: 'var(--card-color)', color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
          >
            Connexion
          </button>
        )}
      </div>
    </nav>
  );
}