import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

export default function App() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [movieSelected, setMovieSelected] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["films", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query.trim() !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  const openModal = (movie: Movie) => {
    setIsModalOpen(true);
    setMovieSelected(movie);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMovieSelected(null);
  };

  async function handleSubmit(query: string) {
    setQuery(query);
    setCurrentPage(1);
  }

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
      ) : (
        data &&
        data.results.length > 0 && (
          <MovieGrid movies={data.results} onSelect={openModal} />
        )
      )}
      {movieSelected && isModalOpen && (
        <MovieModal movie={movieSelected} onClose={closeModal} />
      )}
      <Toaster />
    </div>
  );
}
