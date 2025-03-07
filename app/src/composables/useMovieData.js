import { ref } from "vue";

export function useMovieData(sMoviesCredits, sMoviesDetails, sMoviesProviders, sMoviesVideos) {
  const getMovieData = (source, movieId, key, process = (data) => data) => {
    const movie = source.value.find((item) => item.id === movieId);
    if (!movie) return new Array();

    const data = movie[key];
    return data ? process(data) : "Unknown";
  };

  return { getMovieData };
}
