import Link from "next/link";
interface MovieDetail {
  Title: string;
  Poster: string;
  Plot: string;
  Year: string;
}


async function getMovie(id: string) {
  const res = await fetch(
    `https://www.omdbapi.com/?i=${id}&apikey=b8416258`,
    { cache: "no-store" }
  );

  const text = await res.text();
  console.log("RESPOSTA BRUTA:", text);

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Erro ao converter JSON");
    return null;
  }
}

export default async function MoviePage({ params }: any) {
  const { id } = await params;

  const movie = await getMovie(id); 

  if (!movie) {
    return <p>Erro ao carregar filme...</p>;
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>{movie.Title}</h1>

      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}
        alt={movie.Title}
        style={{ width: "300px", borderRadius: "10px" }}
      />

      <p><strong>Ano:</strong> {movie.Year}</p>
      <p>{movie.Plot}</p>
      <Link href="/" style={{
  display: "inline-block",
  marginTop: "20px",
  padding: "10px 15px",
  backgroundColor: "#e50914",
  color: "white",
  borderRadius: "5px",
  textDecoration: "none"
}}>
  ← Voltar
</Link>
    </main>
    
  );
} 