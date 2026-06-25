import { getToken } from './auth';

const API = 'http://localhost:5000/api/films';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
const TMDB_IMG_SM = 'https://image.tmdb.org/t/p/w200';

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

// Convertit un film BDD → format utilisé par les composants React
export const normalizeFilm = (f) => ({
  _id:        f._id,
  tmdbId:     f.tmdbId,
  title:      f.title,
  year:       f.year,
  synopsis:   f.overview,
  posterUrl:  f.posterPath ? `${TMDB_IMG}${f.posterPath}` : '',
  genres:     (f.genres || []).map(g => g.name).filter(Boolean),
  actors:     (f.actors || []).map(a => ({
    name: a.name,
    role: a.character,
    img:  a.profilePath ? `${TMDB_IMG_SM}${a.profilePath}` : '',
  })),
  director:   f.director,
  voteAverage: f.voteAverage,
  rating:     f.rating,
  section:    f.section,
  comment:    f.comment,
  isFavorite: f.isFavorite,
  isHeart:    f.isHeart,
  journal:    f.journal || [],
  watchedAt:  f.watchedAt,
});

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
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ tmdbData, rating, section, comment, isFavorite, isHeart }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return normalizeFilm({ ...data.film, ...data.userFilm });
};

export const toggleFlag = async (filmId, field) => {
  const res  = await fetch(`${API}/${filmId}/toggle`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({ field }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const deleteFilm = async (filmId) => {
  const res = await fetch(`${API}/${filmId}`, { method: 'DELETE', headers: headers() });
  if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
  return true;
};

export const searchFilms = async (query) => {
  const res = await fetch(`${API}/search?query=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: headers(), // Utilise ta fonction headers() qui contient le bon token !
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.results || [];
};