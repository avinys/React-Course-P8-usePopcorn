import { useState } from "react";
import { tempMovieData } from "./App";
import { Movie } from "./Movie";

export function MoviesList({ movies, onSelectMovielick }) {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID} onSelectMovielick={onSelectMovielick} />
            ))}
        </ul>
    );
}
