import React from 'react';
import { X, Search, Star, Film, Heart, Users, Calendar, Crown, ThumbsUp } from 'lucide-react';

export default function Info({ onClose }) {
  // Fonction pour fermer en cliquant à l'extérieur de la modale
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 md:p-12 lg:p-20 transition-all duration-500"
      onClick={handleBackdropClick}
    >
            {/* Styles personnalisés pour la scrollbar du modal */}
            <style dangerouslySetInnerHTML={{__html: `
        .modal-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .modal-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--accent-color) 40%, transparent);
          border-radius: 10px;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--accent-color);
        }
      `}} />
      {/* ── Conteneur Principal Flottant ── */}
      <div 
        className="relative w-full max-w-5xl h-full max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300"
        style={{ 
          backgroundColor: 'var(--bg-color)', 
          borderColor: 'var(--border-subtle)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* ── En-tête ── */}
        <div 
          className="flex items-center justify-between px-6 py-5 border-b shrink-0 sticky top-0 z-10"
          style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--accent-color)', color: '#1A1612' }}>
              <Film size={20} />
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
              Comment utiliser SeenIt ?
            </h2>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:rotate-90 transition-all duration-300 border"
            style={{ 
              backgroundColor: 'var(--bg-color)', 
              borderColor: 'var(--border-subtle)', 
              color: 'var(--text-muted)' 
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Contenu Scrollable ── */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12">
          
          {/* Étape 1 : Ajouter un film */}
          <section className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0 p-4 rounded-2xl border" style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}>
              <Search size={32} style={{ color: 'var(--text-primary)' }} />
            </div>
            <div>
              <h3 className="text-xl font-black mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>1. Chercher et Ajouter</h3>
              <p className="text-sm md:text-base leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                Commence par cliquer sur le bouton <strong>+ Ajouter</strong>. Tape le nom du film que tu viens de voir. SeenIt te proposera une liste de suggestions avec les affiches et les années de sortie. Sélectionne le bon film pour l'ajouter à ta séance.
              </p>
            </div>
          </section>

          {/* Étape 2 : Évaluer */}
          <section className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0 p-4 rounded-2xl border" style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}>
              <Crown size={32} style={{ color: '#C9960C' }} />
            </div>
            <div>
              <h3 className="text-xl font-black mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>2. Le Verdict</h3>
              <p className="text-sm md:text-base leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                Une fois le film sélectionné, c'est l'heure du verdict ! Attribue une catégorie : <strong style={{ color: '#C9960C' }}>Chef-d'œuvre</strong>, <strong>Élite</strong>, <strong>Bien</strong>, <strong>Moyen</strong>, <strong>Déçu</strong> ou <strong>Navet</strong>. Tu peux aussi lui donner une note sur 5 étoiles, ajouter un coup de cœur, et écrire ton propre avis dans ton journal personnel.
              </p>
            </div>
          </section>

          {/* Étape 3 : Archive et Filtres */}
          <section className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0 p-4 rounded-2xl border" style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}>
              <Film size={32} style={{ color: 'var(--text-primary)' }} />
            </div>
            <div>
              <h3 className="text-xl font-black mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>3. Ton Archive (Films Déjà Vus)</h3>
              <p className="text-sm md:text-base leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                Retrouve toute ta collection dans ton tableau de bord. Tu peux voir tes statistiques (nombre de films, moyenne) et filtrer ta liste par catégories, périodes (Ce mois, Cette année), ou même par année de sortie. Clique sur un film pour voir sa fiche détaillée.
              </p>
            </div>
          </section>

          {/* Étape 4 : Acteurs */}
          <section className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0 p-4 rounded-2xl border" style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}>
              <Heart size={32} style={{ color: '#ef4444' }} />
            </div>
            <div>
              <h3 className="text-xl font-black mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>4. Noter les Acteurs</h3>
              <p className="text-sm md:text-base leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                Dans la fiche détaillée d'un film, tu trouveras les têtes d'affiche. Tu peux évaluer la performance de chaque acteur de <strong>1 à 4 cœurs</strong>. Cumule les films pour voir qui deviendra ton "Acteur Récurrent" ou ton "Acteur Gold" !
              </p>
            </div>
          </section>

          {/* Étape 5 : Suggestions */}
          <section className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0 p-4 rounded-2xl border" style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-subtle)' }}>
              <Users size={32} style={{ color: 'var(--text-primary)' }} />
            </div>
            <div>
              <h3 className="text-xl font-black mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>5. Suggestions de la Semaine</h3>
              <p className="text-sm md:text-base leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                Partage jusqu'à <strong>3 films</strong> par semaine avec la communauté ! Remplis ton quota hebdomadaire pour recommander tes coups de cœur, et découvre ce que les autres cinéphiles ont sélectionné dans la rubrique "Sélections de la communauté".
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}