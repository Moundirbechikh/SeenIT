import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Palette, Crown, LogOut, Lock, Info } from 'lucide-react'; // Ajout de Info
import InfoModal from './Info'; // <--- Assure-toi que le chemin correspond à ton fichier Info.jsx

export default function NavFirst({ currentTheme, setCurrentTheme, themes, isLoggedIn, onLogout, user }) {
  const location = useNavigate ? useLocation() : { pathname: '/' };
  const navigate  = useNavigate();

  const isAuth   = location.pathname === '/auth';
  const isUser   = location.pathname === '/user';
  const isIconic = currentTheme.id === 'iconic';

  // State pour afficher ou masquer la modale d'info
  const [showInfo, setShowInfo] = useState(false);

  // Tooltip hover sur le bouton Iconic verrouillé
  const [iconicTooltipVisible, setIconicTooltipVisible] = useState(false);

  // Iconic est verrouillé en espace utilisateur si user.iconique !== true
  // En landing/auth, le thème est libre pour tout le monde (preview)
  const isIconicLocked = (theme) => {
    if (theme.id !== 'iconic') return false;
    if (!isUser) return false;       // landing et auth : libre
    return !user?.iconique;          // dans /user : verrouillé si pas débloqué
  };

  const handleLogoClick = (e) => {
    if (isUser) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('seenit:go-dashboard'));
    }
  };

  // Cycle thème mobile (ignore les verrouillés)
  const cycleTheme = () => {
    const available = themes.filter(t => !isIconicLocked(t));
    const idx = available.findIndex(t => t.id === currentTheme.id);
    setCurrentTheme(available[(idx + 1) % available.length]);
  };

  return (
    <>
      {/* ── Modale d'Information (Rendue par-dessus tout grâce à son z-index) ── */}
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

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
          <span className="transition-colors duration-700" style={{ color: 'var(--accent-color)' }}>.</span>
          {isIconic && (
            <span
              className="flex items-center gap-1 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded border"
              style={{
                borderColor: 'rgba(201,150,12,0.5)',
                color: 'var(--accent-color)',
                backgroundColor: 'rgba(201,150,12,0.08)',
              }}
            >
              <Crown size={8} /> Iconic
            </span>
          )}
        </Link>

        {/* ── Actions droite ── */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* ── Bouton d'Information ── */}
          <button
            onClick={() => setShowInfo(true)}
            title="Comment utiliser l'app"
            className="flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 hover:scale-110 active:scale-95"
            style={{ 
              backgroundColor: 'var(--card-color)', 
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)' 
            }}
          >
            <Info size={18} />
          </button>

          {/* ── Sélecteur thème desktop ── */}
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border transition-colors duration-700 shadow-lg"
            style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}
          >
            <Palette className="mr-1 transition-colors duration-700" size={15} style={{ color: 'var(--text-muted)' }} />

            {themes.map(theme => {
              const locked = isIconicLocked(theme);

              return (
                <div
                  key={theme.id}
                  className="relative"
                  onMouseEnter={() => locked && setIconicTooltipVisible(true)}
                  onMouseLeave={() => setIconicTooltipVisible(false)}
                >
                  <button
                    onClick={() => !locked && setCurrentTheme(theme)}
                    title={!locked ? theme.name : undefined}
                    className={`relative transition-all duration-300 ${
                      currentTheme.id === theme.id
                        ? 'ring-2 ring-offset-2 scale-125'
                        : locked
                          ? 'opacity-30 cursor-not-allowed'
                          : 'opacity-50 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{
                      width:             theme.id === 'iconic' ? '20px' : '16px',
                      height:            theme.id === 'iconic' ? '20px' : '16px',
                      borderRadius:      theme.id === 'iconic' ? '3px' : '50%',
                      backgroundColor: theme.accent,
                      border:            theme.id === 'iconic' ? '1.5px solid rgba(201,150,12,0.8)' : 'none',
                    }}
                  >
                    {theme.id === 'iconic' && (
                      locked
                        ? <Lock size={7} className="absolute inset-0 m-auto" style={{ color: '#1A1612' }} />
                        : <Crown size={9} className="absolute inset-0 m-auto" style={{ color: '#1A1612' }} />
                    )}
                  </button>

                  {/* Tooltip "Débloquer à 100 films" — seulement si Iconic verrouillé */}
                  {theme.id === 'iconic' && locked && iconicTooltipVisible && (
                    <div
                      className="absolute right-0 top-full mt-2 z-50 pointer-events-none"
                      style={{ minWidth: '180px' }}
                    >
                      {/* Flèche */}
                      <div
                        className="absolute right-2 -top-1.5 w-3 h-3 rotate-45"
                        style={{ backgroundColor: 'var(--card-color)', border: '1px solid var(--border-medium)', borderRight: 'none', borderBottom: 'none' }}
                      />
                      {/* Boîte */}
                      <div
                        className="rounded-xl px-3 py-2.5 shadow-xl border text-left"
                        style={{
                          backgroundColor: 'var(--card-color)',
                          borderColor: 'rgba(201,150,12,0.35)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Crown size={10} style={{ color: '#C9960C' }} />
                          <span
                            className="text-[10px] font-black uppercase tracking-widest"
                            style={{ color: '#C9960C' }}
                          >
                            Iconic ✦
                          </span>
                        </div>
                        <p className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                          Archive <strong style={{ color: 'var(--text-primary)' }}>100 films</strong> pour débloquer ce thème.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Cercle thème mobile ── */}
          <button
            onClick={cycleTheme}
            title={`Thème : ${currentTheme.name}`}
            className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 active:scale-90 shrink-0"
            style={{ backgroundColor: currentTheme.accent, borderColor: 'var(--border-medium)' }}
          >
            {isIconic && <Crown size={12} style={{ color: '#1A1612' }} />}
          </button>

          {/* ── Bouton Déconnexion (espace utilisateur) ── */}
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

          {/* ── Bouton Connexion (pages publiques) ── */}
          {!isAuth && !isUser && !isLoggedIn && (
            <button
              onClick={() => navigate('/auth')}
              className="text-sm font-bold px-5 sm:px-6 py-2.5 rounded-lg border transition-all duration-300 whitespace-nowrap"
              style={{
                backgroundColor: 'var(--card-color)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              Connexion
            </button>
          )}
        </div>
      </nav>
    </>
  );
}