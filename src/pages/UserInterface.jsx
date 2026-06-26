import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from '../components/Dashbord';
import SearchAdd from '../components/Searchadd';
import Films     from './Films';
import { fetchMyFilms, fetchStats, toggleFlag } from '../utils/filmsApi';

// onIconicUnlock : callback vers App.jsx pour mettre à jour user.iconique en temps réel
export default function UserInterface({ currentTheme, user, onLogout, onIconicUnlock }) {
  const [view,          setView]          = useState('dashboard');
  const [films,         setFilms]         = useState([]);
  const [stats,         setStats]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [initialFilter, setInitialFilter] = useState('tous');

  // ── Chargement initial ─────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [myFilms, myStats] = await Promise.all([fetchMyFilms(), fetchStats()]);
      setFilms(myFilms);
      setStats(myStats);
    } catch (err) {
      console.error('Erreur chargement films:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Logo → dashboard ───────────────────────────────────────────────────────
  useEffect(() => {
    const goHome = () => setView('dashboard');
    window.addEventListener('seenit:go-dashboard', goHome);
    return () => window.removeEventListener('seenit:go-dashboard', goHome);
  }, []);

  // ── Ajout d'un film ────────────────────────────────────────────────────────
  const handleFilmAdded = (newFilm) => {
    const updatedFilms = [newFilm, ...films];
    setFilms(updatedFilms);

    // Recharge les stats
    fetchStats().then(setStats).catch(() => {});
    setView('films');

    // 🔑 Vérification Iconic : si on vient d'atteindre 100 films
    // Le backend a déjà mis iconique: true en BDD lors du addFilm.
    // Si le film renvoyé par l'API contient un champ `iconique: true` (optionnel),
    // on notifie App.jsx pour mettre à jour le state en temps réel.
    if (newFilm.iconique === true && !user?.iconique) {
      onIconicUnlock?.();
    }

    // Alternative : on compare le count local
    if (updatedFilms.length >= 100 && !user?.iconique) {
      onIconicUnlock?.();
    }
  };

  // ── Toggle favori / coup de cœur (optimiste) ──────────────────────────────
  const handleToggle = async (filmId, field) => {
    setFilms(prev => prev.map(f => f._id === filmId ? { ...f, [field]: !f[field] } : f));
    try {
      await toggleFlag(filmId, field);
    } catch {
      // Rollback si erreur
      setFilms(prev => prev.map(f => f._id === filmId ? { ...f, [field]: !f[field] } : f));
    }
  };

  // ── Navigation avec filtre ─────────────────────────────────────────────────
  const goToFilms = (filter = 'tous') => {
    setInitialFilter(filter);
    setView('films');
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  switch (view) {
    case 'search':
      return (
        <SearchAdd
          onBack={() => setView('dashboard')}
          onFilmAdded={handleFilmAdded}
          currentTheme={currentTheme}
        />
      );

    case 'films':
      return (
        <Films
          films={films}
          loading={loading}
          initialFilter={initialFilter}
          onBack={() => { setInitialFilter('tous'); setView('dashboard'); }}
          onToggle={handleToggle}
          onGoToSearch={() => setView('search')}
          currentTheme={currentTheme}
        />
      );

    default:
      return (
        <Dashboard
          stats={stats}
          films={films}
          loading={loading}
          onGoToSearch={() => setView('search')}
          onGoToFilms={goToFilms}
          onToggle={handleToggle}
          currentTheme={currentTheme}
          user={user}
        />
      );
  }
}