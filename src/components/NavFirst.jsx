import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Palette, Crown } from 'lucide-react';

export default function NavFirst({ currentTheme, setCurrentTheme, themes }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuth   = location.pathname === '/auth';
  const isUser   = location.pathname === '/user';
  const isIconic = currentTheme.id === 'iconic';

  // Cycle de thème (mobile)
  const cycleTheme = () => {
    const idx = themes.findIndex(t => t.id === currentTheme.id);
    setCurrentTheme(themes[(idx + 1) % themes.length]);
  };

  return (
    <nav
      className="h-[90px] shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-50 relative"
    >
      {/* ── Logo ── */}
      <Link
        to="/"
        className="text-3xl font-black tracking-tighter flex items-center gap-2 select-none group"
      >
        <span
          className="transition-colors duration-700"
          style={{ color: 'var(--text-primary)' }}
        >
          SeenIt
        </span>
        <span
          className="transition-colors duration-700"
          style={{ color: 'var(--accent-color)' }}
        >
          .
        </span>
        {/* Badge Iconic */}
        {isIconic && (
          <span
            className="flex items-center gap-1 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded border"
            style={{
              borderColor: 'rgba(201,150,12,0.5)',
              color: 'var(--accent-color)',
              backgroundColor: 'rgba(201,150,12,0.08)',
            }}
          >
            <Crown size={8} />
            Iconic
          </span>
        )}
      </Link>

      {/* ── Actions droite ── */}
      <div className="flex items-center gap-3 sm:gap-5">

        {/* Sélecteur desktop */}
        <div
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border transition-colors duration-700 shadow-lg"
          style={{
            backgroundColor: 'var(--card-color)',
            borderColor:     'var(--border-subtle)',
          }}
        >
          <Palette
            className="mr-1 transition-colors duration-700"
            size={15}
            style={{ color: 'var(--text-muted)' }}
          />
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => setCurrentTheme(theme)}
              title={theme.name}
              className={`relative transition-all duration-300 ${
                currentTheme.id === theme.id
                  ? 'ring-2 ring-offset-2 scale-125'
                  : 'opacity-50 hover:opacity-100 hover:scale-110'
              }`}
              style={{
                width:           theme.id === 'iconic' ? '20px' : '16px',
                height:          theme.id === 'iconic' ? '20px' : '16px',
                borderRadius:    theme.id === 'iconic' ? '3px' : '50%',
                backgroundColor: theme.accent,
                ringColor:       currentTheme.id === theme.id ? theme.accent : 'transparent',
                ringOffsetColor: 'var(--card-color)',
                // Border dorée pour Iconic
                border: theme.id === 'iconic' ? '1.5px solid rgba(201,150,12,0.8)' : 'none',
              }}
            >
              {theme.id === 'iconic' && (
                <Crown
                  size={9}
                  className="absolute inset-0 m-auto"
                  style={{ color: '#1A1612' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Cercle thème mobile */}
        <button
          onClick={cycleTheme}
          title={`Thème : ${currentTheme.name}`}
          className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 active:scale-90 shrink-0"
          style={{
            backgroundColor: currentTheme.accent,
            borderColor:     'var(--border-medium)',
          }}
        >
          {isIconic && <Crown size={12} style={{ color: '#1A1612' }} />}
        </button>

        {/* Bouton Connexion */}
        {!isAuth && !isUser && (
          <button
            onClick={() => navigate('/auth')}
            className="text-sm font-bold px-5 sm:px-6 py-2.5 rounded-lg border transition-all duration-300 whitespace-nowrap"
            style={{
              backgroundColor: 'var(--card-color)',
              color:           'var(--text-primary)',
              borderColor:     'var(--border-subtle)',
            }}
          >
            Connexion
          </button>
        )}
      </div>
    </nav>
  );
}