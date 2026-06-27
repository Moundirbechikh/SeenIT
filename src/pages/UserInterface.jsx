import React, { useState, useEffect, useCallback } from 'react';
import Dashboard  from '../components/Dashbord';
import SearchAdd  from '../components/Searchadd';
import Films      from './Films';
import Suggestion from '../components/Suggestion';   // ← NOUVEAU
import { fetchMyFilms, fetchStats, toggleFlag } from '../utils/filmsApi';

export default function UserInterface({ currentTheme, user, onLogout, onIconicUnlock }) {
  const [view,          setView]          = useState('dashboard');
  const [films,         setFilms]         = useState([]);
  const [stats,         setStats]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [initialFilter, setInitialFilter] = useState('tous');
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
    setActorSearch('');
    setView('films');
  };

  const goToFilmsByActor = (actorName) => {
    setInitialFilter('tous');
    setActorSearch(actorName);
    setView('films');
  };

  // ── Navigation vers Suggestions (appelée depuis Dashboard et NavFirst) ──
  const goToSuggestions = () => setView('suggestions');

  // Expose goToSuggestions via événement (pour NavFirst)
  useEffect(() => {
    const handler = () => setView('suggestions');
    window.addEventListener('seenit:go-suggestions', handler);
    return () => window.removeEventListener('seenit:go-suggestions', handler);
  }, []);

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
          initialActorSearch={actorSearch}
          onBack={() => { setInitialFilter('tous'); setActorSearch(''); setView('dashboard'); }}
          onToggle={handleToggle}
          onGoToSearch={() => setView('search')}
          currentTheme={currentTheme}
        />
      );

    case 'suggestions':
      return (
        <Suggestion
          onBack={() => setView('dashboard')}
          currentTheme={currentTheme}
          user={user}
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
          onGoToFilmsByActor={goToFilmsByActor}
          onGoToSuggestions={goToSuggestions}   // ← NOUVEAU prop
          onToggle={handleToggle}
          currentTheme={currentTheme}
          user={user}
        />
      );
  }
}