import { getToken } from './auth';

const API        = 'https://seenit-backend-n8ve.onrender.com/api/films';
const TMDB_IMG   = 'https://image.tmdb.org/t/p/w500';
const TMDB_IMG_SM = 'https://image.tmdb.org/t/p/w200';

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization:  `Bearer ${getToken()}`,
});

// ── Convertit un film BDD → format React ────────────────────────────────────
export const normalizeFilm = (f) => ({
  _id:         f._id,
  tmdbId:      f.tmdbId,
  title:       f.title,
  year:        f.year,
  synopsis:    f.overview || f.synopsis || '',
  posterUrl:   f.posterPath ? `${TMDB_IMG}${f.posterPath}` : (f.posterUrl || ''),
  genres:      (f.genres || []).map(g => {
    // Supporte les deux formats: string ou {id, name}
    const name = typeof g === 'string' ? g : (g.name || '');
    // Normalise Science-Fiction → Sci-Fi
    return name === 'Science-Fiction' ? 'Sci-Fi' : name;
  }).filter(Boolean),
  actors:      (f.actors || []).map(a => ({
    name: a.name  || '',
    role: a.character || a.role || '',
    img:  a.profilePath
      ? `${TMDB_IMG_SM}${a.profilePath}`
      : (a.img || ''),
  })),
  director:    f.director || '',
  voteAverage: f.voteAverage || 0,
  rating:      f.rating,
  section:     f.section,
  comment:     f.comment || '',
  isFavorite:  f.isFavorite || false,
  isHeart:     f.isHeart   || false,
  journal:     f.journal   || [],
  watchedAt:   f.watchedAt,
});

// ── API calls ────────────────────────────────────────────────────────────────

export const fetchMyFilms = async () => {
  const res  = await fetch(`${API}/my`, { headers: headers() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.films.map(normalizeFilm);
};

export const fetchStats = async () => {
  const res  = await fetch(`${API}/stats`, { headers: headers() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const addFilm = async ({ tmdbData, rating, section, comment, isFavorite, isHeart }) => {
  const res  = await fetch(`${API}/add`, {
    method:  'POST',
    headers: headers(),
    body:    JSON.stringify({ tmdbData, rating, section, comment, isFavorite, isHeart }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  // Merge film (données TMDB) + userFilm (données user)
  return normalizeFilm({ ...data.film, ...data.userFilm });
};

export const toggleFlag = async (filmId, field) => {
  const res  = await fetch(`${API}/${filmId}/toggle`, {
    method:  'PUT',
    headers: headers(),
    body:    JSON.stringify({ field }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const deleteFilm = async (filmId) => {
  const res = await fetch(`${API}/${filmId}`, {
    method:  'DELETE',
    headers: headers(),
  });
  if (!res.ok) {
    const d = await res.json();
    throw new Error(d.message);
  }
  return true;
};

// ── Recherche via le backend (proxy TMDB sécurisé) ───────────────────────────
export const searchFilms = async (query) => {
  const res  = await fetch(
    `${API}/search?query=${encodeURIComponent(query)}`,
    { headers: headers() }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.results || [];
};