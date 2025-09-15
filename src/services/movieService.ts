import type { Movie } from "../types/movie";
import axios from "axios";

interface MoviesTMDBResponse {
  results: Movie[];
  total_pages: number;
}

interface Options {
  params: {
    query: string;
    page: number;
  };
  headers: {
    Authorization: string;
  };
}

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
axios.defaults.baseURL = "https://api.themoviedb.org/3/search/movie";

export const fetchMovies = async (query: string, page: number) => {
  const options: Options = {
    params: {
      query: query,
      page: page,
    },
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  const response = await axios.get<MoviesTMDBResponse>("", options);

  return response.data;
};
