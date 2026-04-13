"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year?: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Função para buscar filmes
  const fetchMovies = async (pageNum: number) => {
    try {
      const res = await fetch(`https://www.omdbapi.com/?s=movie&page=${pageNum}&apikey=b8416258`);
      const data = await res.json();
      
      if (data.Search) {
        if (pageNum === 1) {
          setMovies(data.Search);
        } else {
          setMovies(prev => [...prev, ...data.Search]);
        }
        // Se veio menos de 10 filmes, não tem mais páginas
        setHasMore(data.Search.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      setHasMore(false);
    }
  };

  // Carregar primeira página
  useEffect(() => {
    fetchMovies(1).finally(() => setLoading(false));
  }, []);

  // Carregar mais filmes
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchMovies(nextPage);
    setLoadingMore(false);
  };

  const addFavorite = (movie: Movie) => {
    if (!favorites.some(fav => fav.imdbID === movie.imdbID)) {
      setFavorites([...favorites, movie]);
    }
  };

  const removeFavorite = (movieId: string) => {
    setFavorites(favorites.filter(movie => movie.imdbID !== movieId));
  };

  const isFavorite = (movieId: string) => {
    return favorites.some(movie => movie.imdbID === movieId);
  };

  if (loading) {
    return <div style={styles.loading}>🎬 Carregando filmes...</div>;
  }

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>🎬 Catálogo de Filmes</h1>
      <p style={styles.subtitle}>Bem-vindo ao nosso portal de cinema!</p>

      {/* SEÇÃO DE FAVORITOS */}
      <section style={styles.favSection}>
        <h2 style={styles.favTitle}>⭐ Meus Favoritos ({favorites.length})</h2>
        {favorites.length === 0 ? (
          <p style={styles.emptyFav}>Nenhum filme favoritado ainda. Clique na ⭐ para adicionar!</p>
        ) : (
          <div style={styles.favGrid}>
            {favorites.map((movie) => (
              <div key={movie.imdbID} style={styles.favCard}>
                <Link href={`/movie/${movie.imdbID}`}>
                  <img 
                    src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/100x150?text=Sem+Imagem"} 
                    alt={movie.Title}
                    style={styles.favPoster}
                  />
                  <p style={styles.favCardTitle}>{movie.Title}</p>
                </Link>
                <button onClick={() => removeFavorite(movie.imdbID)} style={styles.removeBtn}>
                  ❌ Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SEÇÃO DE TODOS OS FILMES */}
      <h2 style={styles.sectionTitle}>🎞️ Todos os Filmes ({movies.length})</h2>
      <div style={styles.grid}>
        {movies.map((movie) => (
          <div key={movie.imdbID} style={styles.card}>
            <Link href={`/movie/${movie.imdbID}`} style={{ textDecoration: "none" }}>
              <img 
                src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=Sem+Imagem"} 
                alt={movie.Title}
                style={styles.poster}
              />
              <h3 style={styles.movieTitle}>{movie.Title}</h3>
              {movie.Year && <p style={styles.year}>{movie.Year}</p>}
            </Link>
            
            {isFavorite(movie.imdbID) ? (
              <button 
                onClick={() => removeFavorite(movie.imdbID)} 
                style={styles.favoritedBtn}
              >
                ⭐ Favoritado
              </button>
            ) : (
              <button 
                onClick={() => addFavorite(movie)} 
                style={styles.favoriteBtn}
              >
                ☆ Favoritar
              </button>
            )}
          </div>
        ))}
      </div>

      {/* BOTÃO CARREGAR MAIS */}
      {hasMore && (
        <div style={styles.loadMoreContainer}>
          <button 
            onClick={loadMore} 
            disabled={loadingMore}
            style={styles.loadMoreBtn}
          >
            {loadingMore ? "🎬 Carregando..." : "📽️ Carregar Mais Filmes"}
          </button>
        </div>
      )}
    </main>
  );
}

const styles = {
  main: {
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    backgroundColor: "#0a0e27",
    minHeight: "100vh",
    padding: "20px",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "1.5rem",
    color: "#fff",
    backgroundColor: "#0a0e27",
  },
  title: {
    textAlign: "center" as const,
    color: "#e50914",
    fontSize: "2.5rem",
    marginBottom: "10px",
  },
  subtitle: {
    textAlign: "center" as const,
    color: "#ccc",
    marginBottom: "30px",
  },
  favSection: {
    backgroundColor: "#1a1f3a",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "40px",
    border: "1px solid #2a2f4a",
  },
  favTitle: {
    color: "#ffd700",
    marginBottom: "15px",
  },
  emptyFav: {
    color: "#aaa",
    textAlign: "center" as const,
    padding: "20px",
  },
  favGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "15px",
  },
  favCard: {
    backgroundColor: "#0f1433",
    padding: "10px",
    borderRadius: "12px",
    textAlign: "center" as const,
    transition: "transform 0.3s",
    cursor: "pointer",
  },
  favPoster: {
    width: "100%",
    height: "140px",
    objectFit: "cover" as const,
    borderRadius: "8px",
  },
  favCardTitle: {
    color: "#fff",
    fontSize: "0.85rem",
    marginTop: "8px",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: "1.8rem",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "25px",
  },
  card: {
    backgroundColor: "#1a1f3a",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "transform 0.3s, box-shadow 0.3s",
    textAlign: "center" as const,
    paddingBottom: "15px",
  },
  poster: {
    width: "100%",
    height: "300px",
    objectFit: "cover" as const,
  },
  movieTitle: {
    color: "#fff",
    fontSize: "1rem",
    margin: "10px 10px 5px",
  },
  year: {
    color: "#aaa",
    fontSize: "0.85rem",
    margin: "0 10px 10px",
  },
  favoriteBtn: {
    backgroundColor: "#2a2f4a",
    color: "#ffd700",
    border: "1px solid #3a3f5a",
    padding: "8px 12px",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.3s",
  },
  favoritedBtn: {
    backgroundColor: "#ffd700",
    color: "#1a1f3a",
    border: "none",
    padding: "8px 12px",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "bold" as const,
  },
  removeBtn: {
    backgroundColor: "#e50914",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.75rem",
    marginTop: "8px",
  },
  loadMoreContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
    marginBottom: "20px",
  },
  loadMoreBtn: {
    backgroundColor: "#e50914",
    color: "white",
    border: "none",
    padding: "12px 30px",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold" as const,
    transition: "all 0.3s",
  },
};