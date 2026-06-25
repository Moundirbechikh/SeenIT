import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from '../components/Dashbord';
import SearchAdd from '../components/Searchadd';
import Films     from './Films';
import { fetchMyFilms, fetchStats, toggleFlag } from '../utils/filmsApi';

export default function UserInterface({ currentTheme, user, onLogout }) {
  const [view,    setView]    = useState('dashboard');
  const [films,   setFilms]   = useState([]);
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Charge les films + stats au montage
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

  // Écoute le clic logo → dashboard
  useEffect(() => {
    const goHome = () => setView('dashboard');
    window.addEventListener('seenit:go-dashboard', goHome);
    return () => window.removeEventListener('seenit:go-dashboard', goHome);
  }, []);

  // Ajout d'un film depuis SearchAdd
  const handleFilmAdded = (newFilm) => {
    setFilms(prev => [newFilm, ...prev]);
    // Recharge les stats
    fetchStats().then(setStats).catch(() => {});
    setView('films');
  };

  // Toggle favori / coup de cœur (optimiste)
  const handleToggle = async (filmId, field) => {
    // Mise à jour optimiste immédiate
    setFilms(prev => prev.map(f =>
      f._id === filmId ? { ...f, [field]: !f[field] } : f
    ));
    try {
      await toggleFlag(filmId, field);
    } catch {
      // Rollback si erreur
      setFilms(prev => prev.map(f =>
        f._id === filmId ? { ...f, [field]: !f[field] } : f
      ));
    }
  };

  // Navigation avec filtre pré-appliqué (depuis dashboard → films favoris etc.)
  const [initialFilter, setInitialFilter] = useState('tous');

  const goToFilms = (filter = 'tous') => {
    setInitialFilter(filter);
    setView('films');
  };

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