import requests

# 🔑 Remplace par ta vraie clé API TMDB v3
TMDB_API_KEY = "b49fefb44a18788dbe8187f4521791ea"
BASE_URL = "https://api.themoviedb.org/3"
# w500 donne une taille idéale pour les cartes de ton interface
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500" 

# 🎬 Les 5 films de ton Hero Section
movies_to_search = [
    "Titanic",
    "Interstellar",
    "Jurassic Park",
    "Matrix",
    "Le Dîner de Cons"
]

def get_movie_poster(title):
    """
    Cherche le titre sur TMDB et retourne l'URL complète de l'affiche.
    """
    search_url = f"{BASE_URL}/search/movie"
    
    # Paramètres de la requête
    params = {
        "api_key": TMDB_API_KEY,
        "query": title,
        "language": "fr-FR", # On priorise les métadonnées en français
        "page": 1
    }

    try:
        response = requests.get(search_url, params=params)
        response.raise_for_status() # Lève une erreur si le statut HTTP n'est pas 200
        data = response.json()

        # Si TMDB trouve au moins un résultat
        if data['results']:
            # On cible le premier film de la liste (le plus pertinent)
            first_result = data['results'][0]
            poster_path = first_result.get('poster_path')
            
            if poster_path:
                # On assemble l'URL de base de l'image avec le chemin spécifique du film
                full_image_url = f"{IMAGE_BASE_URL}{poster_path}"
                return full_image_url
            else:
                return "❌ Affiche absente dans la base de données."
        else:
            return "❌ Film introuvable sur TMDB."

    except requests.exceptions.RequestException as e:
        return f"⚠️ Erreur de connexion à l'API : {e}"

# 🚀 Exécution du script
if __name__ == "__main__":
    print("🍿 Recherche des affiches sur TMDB en cours...\n")
    print("-" * 60)

    for movie in movies_to_search:
        poster_url = get_movie_poster(movie)
        print(f"🎬 Titre  : {movie}")
        print(f"🔗 Poster : {poster_url}")
        print("-" * 60)