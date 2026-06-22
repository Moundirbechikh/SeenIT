import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage   from './pages/LandingPage';
import Auth          from './pages/Auth';
import UserInterface from './pages/UserInterface';
import NavFirst      from './components/NavFirst';

export default function App() {
  const themes = [
    { id: 'crimson',  name: 'Salle Obscure', bg: '#09090B', card: '#18181B', accent: '#E11D48' },
    { id: 'midnight', name: 'Nuit',          bg: '#0F172A', card: '#1E293B', accent: '#F59E0B' },
    { id: 'matrix',   name: 'Sci-Fi',        bg: '#022C22', card: '#064E3B', accent: '#10B981' },
    { id: 'noir',     name: 'Film Noir',     bg: '#0A0A0A', card: '#171717', accent: '#F5F5F5' },
    { id: 'vintage',  name: 'Pellicule',     bg: '#292524', card: '#44403C', accent: '#D97706' },
    
    // Le nouveau thème Iconic : Onyx Impérial & Or Liquide
    { 
      id: 'iconic',   
      name: 'Iconic',        
      bg: '#13110E',      // Un noir-bronze ultra chaud (comme l'ombre d'une salle de gala)
      card: '#231F1A',    // Un brun-pierre volcanique texturé et chaud pour détacher tes cartes
      accent: '#E5B842' // Véritable Or Métallique / Or de Galerie d'art pour ton gros bloc
    },
  ];

  const [currentTheme, setCurrentTheme] = useState(themes[0]);

  return (
    <Router>
      <div
        style={{
          '--bg-color':     currentTheme.bg,
          '--card-color':   currentTheme.card,
          '--accent-color': currentTheme.accent,
        }}
        className="min-h-screen w-full bg-[var(--bg-color)] font-sans flex flex-col
          overflow-x-hidden transition-colors duration-1000
          selection:bg-[var(--accent-color)] selection:text-[var(--bg-color)]"
      >
        <NavFirst
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          themes={themes}
        />

        <Routes>
          {/* Landing publique */}
          <Route path="/"     element={<LandingPage />} />

          {/* Authentification */}
          <Route path="/auth" element={<Auth />} />

          {/*
            Espace utilisateur.
            UserInterface gère en interne 3 vues :
              dashboard → /user (défaut)
              search    → clic sur + du Dashboard
              films     → clic sur "voir ma liste"
            Aucune sous-route React Router : navigation d'état simple.
          */}
          <Route path="/user" element={<UserInterface />} />
        </Routes>
      </div>
    </Router>
  );
}