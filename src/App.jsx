import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage   from './pages/LandingPage';
import Auth          from './pages/Auth';
import UserInterface from './pages/UserInterface';
import NavFirst      from './components/NavFirst';

export default function App() {
  const themes = [
    {
      id: 'crimson',
      name: 'Salle Obscure',
      bg: '#09090B', card: '#18181B', accent: '#E11D48',
      // Mode sombre (défaut)
      textPrimary:   '#FFFFFF',
      textSecondary: '#94A3B8',
      textMuted:     '#475569',
      textInverse:   '#09090B',
      borderSubtle:  'rgba(255,255,255,0.08)',
      borderMedium:  'rgba(255,255,255,0.15)',
      isLight: false,
      marbleOverlay: null,
    },
    {
      id: 'midnight',
      name: 'Nuit',
      bg: '#0F172A', card: '#1E293B', accent: '#F59E0B',
      textPrimary:   '#FFFFFF',
      textSecondary: '#94A3B8',
      textMuted:     '#475569',
      textInverse:   '#0F172A',
      borderSubtle:  'rgba(255,255,255,0.08)',
      borderMedium:  'rgba(255,255,255,0.15)',
      isLight: false,
      marbleOverlay: null,
    },
    {
      id: 'matrix',
      name: 'Sci-Fi',
      bg: '#022C22', card: '#064E3B', accent: '#10B981',
      textPrimary:   '#FFFFFF',
      textSecondary: '#94A3B8',
      textMuted:     '#475569',
      textInverse:   '#022C22',
      borderSubtle:  'rgba(255,255,255,0.08)',
      borderMedium:  'rgba(255,255,255,0.15)',
      isLight: false,
      marbleOverlay: null,
    },
    {
      id: 'noir',
      name: 'Film Noir',
      bg: '#0A0A0A', card: '#171717', accent: '#F5F5F5',
      textPrimary:   '#FFFFFF',
      textSecondary: '#94A3B8',
      textMuted:     '#475569',
      textInverse:   '#0A0A0A',
      borderSubtle:  'rgba(255,255,255,0.08)',
      borderMedium:  'rgba(255,255,255,0.15)',
      isLight: false,
      marbleOverlay: null,
    },
    {
      id: 'vintage',
      name: 'Pellicule',
      bg: '#292524', card: '#44403C', accent: '#D97706',
      textPrimary:   '#FFFFFF',
      textSecondary: '#94A3B8',
      textMuted:     '#475569',
      textInverse:   '#292524',
      borderSubtle:  'rgba(255,255,255,0.08)',
      borderMedium:  'rgba(255,255,255,0.15)',
      isLight: false,
      marbleOverlay: null,
    },
    {
      // ── ICONIC : Marbre Imperial & Or Liquide ──
      id: 'iconic',
      name: 'Iconic ✦',
      bg:   '#F0EDE8',   // Marbre blanc cassé chaud
      card: '#E8E4DC',   // Marbre card légèrement plus sombre
      accent: '#C9960C', // Or profond métallique (pas trop jaune)
      // Inversion complète des textes
      textPrimary:   '#1A1612',  // Quasi-noir chaud (remplace white)
      textSecondary: '#4A4540',  // Gris foncé chaud (remplace slate-400)
      textMuted:     '#7A7570',  // Gris moyen (remplace slate-600)
      textInverse:   '#F0EDE8',  // Blanc cassé (pour texte sur fond accent)
      borderSubtle:  'rgba(26,22,18,0.10)',
      borderMedium:  'rgba(26,22,18,0.20)',
      isLight: true,
      // Effets de marbre : fissures SVG en bg
      marbleOverlay: true,
    },
  ];

  const [currentTheme, setCurrentTheme] = useState(themes[0]);

  const t = currentTheme;

  return (
    <Router>
      {/* Styles globaux du thème Iconic — marbre SVG en fond */}
      {t.isLight && (
        <style>{`
          .iconic-marble-bg {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            opacity: 0.55;
            background-image:
              url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='700' viewBox='0 0 900 700'%3E%3C!-- Fissures principales --%3E%3Cpath d='M120 80 Q200 140 180 220 Q160 300 240 350 Q320 400 290 480 Q260 560 340 620' stroke='%23B8B0A0' stroke-width='1.2' fill='none' opacity='0.6'/%3E%3Cpath d='M120 80 Q125 145 185 225 Q192 235 242 353' stroke='%23C8C0B0' stroke-width='0.5' fill='none' opacity='0.4'/%3E%3Cpath d='M500 0 Q480 90 520 160 Q560 230 530 310 Q500 390 560 450 Q620 510 590 600 Q570 660 620 700' stroke='%23B0A898' stroke-width='1.5' fill='none' opacity='0.5'/%3E%3Cpath d='M500 0 Q485 92 524 163' stroke='%23C0B8A8' stroke-width='0.6' fill='none' opacity='0.35'/%3E%3Cpath d='M750 100 Q700 170 730 250 Q760 330 720 400 Q680 470 710 550' stroke='%23B4ACA0' stroke-width='1.0' fill='none' opacity='0.45'/%3E%3C!-- Fissures secondaires fines --%3E%3Cpath d='M0 300 Q80 290 150 320 Q220 350 300 330 Q380 310 450 340' stroke='%23C0B8AC' stroke-width='0.7' fill='none' opacity='0.35'/%3E%3Cpath d='M600 200 Q650 240 680 300 Q710 360 760 380 Q810 400 860 430 Q900 450 900 470' stroke='%23B8B0A4' stroke-width='0.8' fill='none' opacity='0.3'/%3E%3Cpath d='M200 500 Q260 510 320 490 Q380 470 440 510 Q500 550 560 530' stroke='%23C4BCAC' stroke-width='0.6' fill='none' opacity='0.3'/%3E%3C!-- Micro fissures --%3E%3Cpath d='M180 220 Q195 230 205 250' stroke='%23B0A898' stroke-width='0.5' fill='none' opacity='0.5'/%3E%3Cpath d='M525 160 Q540 175 535 195' stroke='%23B8B0A0' stroke-width='0.4' fill='none' opacity='0.4'/%3E%3Cpath d='M290 350 Q310 355 325 370 Q340 385 335 400' stroke='%23BCBAA8' stroke-width='0.5' fill='none' opacity='0.35'/%3E%3Cpath d='M720 250 Q740 260 745 278' stroke='%23B4AC9C' stroke-width='0.4' fill='none' opacity='0.4'/%3E%3C!-- Veines en or très subtiles --%3E%3Cpath d='M350 150 Q370 200 360 260 Q350 320 380 370' stroke='%23C9960C' stroke-width='0.4' fill='none' opacity='0.15'/%3E%3Cpath d='M650 400 Q670 430 660 470 Q650 510 680 540' stroke='%23C9960C' stroke-width='0.3' fill='none' opacity='0.12'/%3E%3C/svg%3E");
            background-size: 900px 700px;
            background-repeat: repeat;
          }
          .iconic-card-shimmer {
            position: relative;
            overflow: hidden;
          }
          .iconic-card-shimmer::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
              135deg,
              rgba(201,150,12,0.04) 0%,
              rgba(201,150,12,0.00) 40%,
              rgba(201,150,12,0.06) 60%,
              rgba(201,150,12,0.00) 100%
            );
            pointer-events: none;
            z-index: 1;
          }
          /* Ornement doré fin en haut de page */
          .iconic-top-border::before {
            content: '';
            display: block;
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 3px;
            background: linear-gradient(90deg,
              transparent 0%,
              rgba(201,150,12,0.4) 20%,
              rgba(201,150,12,0.9) 50%,
              rgba(201,150,12,0.4) 80%,
              transparent 100%
            );
            z-index: 1000;
          }
        `}</style>
      )}

      <div
        className={`min-h-screen w-full font-sans flex flex-col overflow-x-hidden transition-colors duration-700 selection:bg-[var(--accent-color)] selection:text-[var(--text-inverse)] ${t.isLight ? 'iconic-top-border' : ''}`}
        style={{
          '--bg-color':        t.bg,
          '--card-color':      t.card,
          '--accent-color':    t.accent,
          '--text-primary':    t.textPrimary,
          '--text-secondary':  t.textSecondary,
          '--text-muted':      t.textMuted,
          '--text-inverse':    t.textInverse,
          '--border-subtle':   t.borderSubtle,
          '--border-medium':   t.borderMedium,
          '--is-light':        t.isLight ? '1' : '0',
          backgroundColor:     t.bg,
          color:               t.textPrimary,
        }}
      >
        {/* Marbre de fond — uniquement thème Iconic */}
        {t.isLight && <div className="iconic-marble-bg" />}

        <NavFirst
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          themes={themes}
        />

        <Routes>
          <Route path="/"     element={<LandingPage />} />
          <Route path="/auth" element={
            <Auth onLogin={() => setCurrentTheme(themes.find(th => th.id === 'iconic'))} />
          } />
          <Route path="/user" element={<UserInterface currentTheme={currentTheme} />} />
        </Routes>
      </div>
    </Router>
  );
}