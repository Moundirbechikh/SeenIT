import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from '../components/Dashbord';
import SearchAdd from '../components/Searchadd';
import Films     from './Films';
import { fetchMyFilms, fetchStats, toggleFlag } from '../utils/filmsApi';

export default function UserInterface({ currentTheme, user, onLogout, onIconicUnlock }) {
  const [view,          setView]          = useState('dashboard');
  const [films,         setFilms]         = useState([]);
  const [stats,         setStats]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [initialFilter, setInitialFilter] = useState('tous');

  // 🆕 Filtre acteur : quand on clique sur un acteur Gold dans le dashboard
  // → Films s'ouvre avec ce nom pré-rempli dans la recherche
  const [actorSearch,   setActorSearch]   = useState('');

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

  useEffect(() => {
    const goHome = () => { setView('dashboard'); };
    window.addEventListener('seenit:go-dashboard', goHome);
    return () => window.removeEventListener('seenit:go-dashboard', goHome);
  }, []);

  const handleFilmAdded = (newFilm) => {
    const updatedFilms = [newFilm, ...films];
    setFilms(updatedFilms);
    fetchStats().then(setStats).catch(() => {});
    setView('films');
    if (newFilm.iconique === true && !user?.iconique) onIconicUnlock?.();
    if (updatedFilms.length >= 100 && !user?.iconique) onIconicUnlock?.();
  };

  const handleToggle = async (filmId, field) => {
    setFilms(prev => prev.map(f => f._id === filmId ? { ...f, [field]: !f[field] } : f));
    try {
      await toggleFlag(filmId, field);
    } catch {
      setFilms(prev => prev.map(f => f._id === filmId ? { ...f, [field]: !f[field] } : f));
    }
  };

  const goToFilms = (filter = 'tous') => {
    setInitialFilter(filter);
    setActorSearch('');   // reset acteur
    setView('films');
  };

  // 🆕 Aller vers Films filtré par acteur (depuis le dashboard)
  const goToFilmsByActor = (actorName) => {
    setInitialFilter('tous');
    setActorSearch(actorName);
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
          initialActorSearch={actorSearch}     // 🆕 prop passée à Films
          onBack={() => { setInitialFilter('tous'); setActorSearch(''); setView('dashboard'); }}
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
          onGoToFilmsByActor={goToFilmsByActor}   // 🆕 prop pour le click acteur Gold
          onToggle={handleToggle}
          currentTheme={currentTheme}
          user={user}
        />
      );
  }
}