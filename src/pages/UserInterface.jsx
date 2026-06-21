import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashbord';
import SearchAdd from '../components/Searchadd';
import Films     from './Films';

/**
 * UserInterface — conteneur des 3 vues utilisateur.
 * La navigation interne ne passe PAS par react-router :
 *  - 'dashboard'  → Dashboard
 *  - 'search'     → SearchAdd (accès via le + du Dashboard)
 *  - 'films'      → Films (accès via "voir ma liste")
 *
 * NavFirst reste visible en permanence via App.jsx (il englobe tout).
 */
export default function UserInterface() {
  const [view, setView] = useState('dashboard');

  switch (view) {

    case 'search':
      return (
        <SearchAdd
          onBack={() => setView('dashboard')}
          onFilmAdded={() => setView('films')}
        />
      );

    case 'films':
      return (
        <Films
          onBack={() => setView('dashboard')}
        />
      );

    case 'dashboard':
    default:
      return (
        <Dashboard
          onGoToSearch={() => setView('search')}
          onGoToFilms={() => setView('films')}
        />
      );
  }
}