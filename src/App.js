import { useState, useEffect } from "react";

import { NavBar } from "./NavBar";
import { Main } from "./Main";
import { Logo } from "./Logo";
import { Search } from "./Search";
import { NumResults } from "./NumResults";
import { MoviesList } from "./MoviesList";
import { Box } from "./Box";
import { WatchedMoviesList } from "./WatchedMoviesList";
import { WatchedSummary } from "./WatchedSummary";
import { MovieDetails } from "./MovieDetails";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import { useMovies } from "./useMovies";

// export const tempMovieData = [
//     {
//         imdbID: "tt1375666",
//         Title: "Inception",
//         Year: "2010",
//         Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     },
//     {
//         imdbID: "tt0133093",
//         Title: "The Matrix",
//         Year: "1999",
//         Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//     },
//     {
//         imdbID: "tt6751668",
//         Title: "Parasite",
//         Year: "2019",
//         Poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//     },
// ];

// export const tempWatchedData = [
//     {
//         imdbID: "tt1375666",
//         Title: "Inception",
//         Year: "2010",
//         Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//         runtime: 148,
//         imdbRating: 8.8,
//         userRating: 10,
//     },
//     {
//         imdbID: "tt0088763",
//         Title: "Back to the Future",
//         Year: "1985",
//         Poster: "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//         runtime: 116,
//         imdbRating: 8.5,
//         userRating: 9,
//     },
// ];

export const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const API_KEY = process.env.API_KEY;
const API_LINK = `http://www.omdbapi.com/?apikey=${API_KEY}`;

export default function App() {
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    const closeMovie = () => {
        setSelectedId(null);
    };

    const { movies, error, isLoading } = useMovies(query, closeMovie);

    // const [watched, setWatched] = useState([]);

    const [watched, setWatched] = useState(() => {
        const storedValue = localStorage.getItem("watched");
        return JSON.parse(storedValue);
    });

    const handleSelectMovie = (id) => {
        setSelectedId((selectedId) => (selectedId === id ? null : id));
    };

    const handleAddWatched = (movie) => {
        setWatched((prev) => [...prev, movie]);

        // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
    };

    const handleDeleteWatched = (id) => {
        setWatched(watched.filter((mov) => mov.imdbID !== id));
    };

    useEffect(() => {
        localStorage.setItem("watched", JSON.stringify(watched));
    }, [watched]);

    return (
        <>
            <NavBar>
                <Logo />
                <Search query={query} setQuery={setQuery} />
                <NumResults num={movies.length} />
            </NavBar>
            <Main>
                {/* POSSIBLE TO DO BUT NOT RECOMMENDED */}
                {/* <Box element={<MoviesList movies={movies} />} />
                <Box
                    element={
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMoviesList watched={watched} />
                        </>
                    }
                /> */}
                <Box>
                    {/* {isLoading ? <Loader /> : <MoviesList movies={movies} />} */}
                    {!isLoading && !error && <MoviesList movies={movies} onSelectMovielick={handleSelectMovie} />}
                    {error && <ErrorMessage message={error} />}
                    {isLoading && <Loader />}
                </Box>
                <Box>
                    {!selectedId ? (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
                        </>
                    ) : (
                        <MovieDetails
                            selectedId={selectedId}
                            onCloseMovie={closeMovie}
                            API_LINK={API_LINK}
                            onAddWatched={handleAddWatched}
                            watched={watched}
                        />
                    )}
                </Box>
            </Main>
        </>
    );
}
