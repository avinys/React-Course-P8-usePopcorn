import { useState, useEffect } from "react";

const API_KEY = process.env.API_KEY;
const API_LINK = `http://www.omdbapi.com/?apikey=${API_KEY}`;

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchMovies() {
            try {
                setIsLoading(true);
                setError("");
                const response = await fetch(`${API_LINK}&s=${query}`, { signal: controller.signal });

                if (!response.ok) {
                    throw new Error("Something went wrong with fetching movies");
                }

                const data = await response.json();

                if (data.Response === "False") throw new Error("Movie not found");

                setMovies(data.Search);
                setError("");
            } catch (e) {
                console.error(e.message);

                if (e.name !== "AbortError") setError(e.message);
            } finally {
                setIsLoading(false);
            }
        }

        if (query.length < 3) {
            setMovies([]);
            setError("");
            return;
        }
        fetchMovies();

        return () => {
            controller.abort();
        };
    }, [query]);

    return { movies, isLoading, error };
}
