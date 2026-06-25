// Toutes les fonctions d'auth sont ici, une seule source de vérité

const API = 'https://seenit-backend-n8ve.onrender.com/api/auth';

export const saveToken = (token) => localStorage.setItem('seenit_token', token);
export const getToken  = ()      => localStorage.getItem('seenit_token');
export const clearToken = ()     => localStorage.removeItem('seenit_token');

export const saveUser = (user) => localStorage.setItem('seenit_user', JSON.stringify(user));
export const getUser  = ()     => {
  try { return JSON.parse(localStorage.getItem('seenit_user')); } 
  catch { return null; }
};
export const clearUser = () => localStorage.removeItem('seenit_user');

// Appelé au démarrage de l'app pour vérifier si le token est encore valide
export const verifySession = async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API}/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) { clearToken(); clearUser(); return null; }
    const data = await res.json();
    saveUser(data.user);
    return data.user;
  } catch {
    return null; // réseau coupé → on ne déconnecte pas, on laisse faire
  }
};

// Sauvegarde le thème en BDD (fire-and-forget)
export const syncTheme = (themeId) => {
  const token = getToken();
  if (!token) return;
  fetch(`${API}/theme`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ theme: themeId })
  }).catch(() => {}); // silencieux si offline
};

export const logout = () => { clearToken(); clearUser(); };