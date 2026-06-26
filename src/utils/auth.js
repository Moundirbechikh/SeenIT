// utils/auth.js — source unique de vérité pour tout ce qui touche à la session

const API = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/auth`
  : 'https://seenit-backend-n8ve.onrender.com/api/auth';

// ── Token ────────────────────────────────────────────────────────────────────
export const saveToken  = (token) => localStorage.setItem('seenit_token', token);
export const getToken   = ()      => localStorage.getItem('seenit_token');
export const clearToken = ()      => localStorage.removeItem('seenit_token');

// ── User local (cache) ────────────────────────────────────────────────────────
export const saveUser  = (user) => localStorage.setItem('seenit_user', JSON.stringify(user));
export const getUser   = ()     => {
  try { return JSON.parse(localStorage.getItem('seenit_user')); }
  catch { return null; }
};
export const clearUser = ()     => localStorage.removeItem('seenit_user');

// ── Vérification session au démarrage ────────────────────────────────────────
// Retourne le user à jour si la session est valide, null sinon.
// Règle : si pas de réseau (fetch échoue), on utilise le cache local
// pour ne pas déconnecter l'utilisateur bêtement.
export const verifySession = async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API}/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      saveUser(data.user);   // met le cache à jour
      return data.user;
    }

    // 401 = token expiré ou inactivité → on déconnecte proprement
    if (res.status === 401) {
      clearToken();
      clearUser();
      return null;
    }

    // Autre erreur serveur (5xx) → on utilise le cache pour ne pas déconnecter
    const cached = getUser();
    return cached;

  } catch {
    // Réseau coupé / offline → cache local
    return getUser();
  }
};

// ── Sauvegarde du thème en BDD (fire-and-forget) ─────────────────────────────
export const syncTheme = (themeId) => {
  const token = getToken();
  if (!token) return;
  fetch(`${API}/theme`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ theme: themeId }),
  }).catch(() => {}); // silencieux si offline
};

// ── Déconnexion ───────────────────────────────────────────────────────────────
export const logout = () => {
  clearToken();
  clearUser();
};