import React, { useState } from 'react';
import Dashboard from '../components/Dashbord';
import SearchAdd from '../components/Searchadd';
import Films     from './Films';

export default function UserInterface({ currentTheme }) {
  const [view, setView] = useState('dashboard');

  switch (view) {
    case 'search':
      return (
        <SearchAdd
          onBack={() => setView('dashboard')}
          onFilmAdded={() => setView('films')}
          currentTheme={currentTheme}
        />
      );

    case 'films':
      return (
        <Films
          onBack={() => setView('dashboard')}
          currentTheme={currentTheme}
        />
      );

    case 'dashboard':
    default:
      return (
        <Dashboard
          onGoToSearch={() => setView('search')}
          onGoToFilms={() => setView('films')}
          currentTheme={currentTheme}
        />
      );
  }
}