import { useState, useEffect, useRef } from "react";
import { StarRating } from "./StarRating";
import { Loader } from "./Loader";
import { useKey } from "./useKey";

export function MovieDetails({ selectedId, onCloseMovie, API_LINK, onAddWatched, watched }) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("");

    const countRef = useRef(0);

    const isWatched = watched.filter((w) => w.imdbID === selectedId).length > 0;
    const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie;

    // if (imdbRating > 8) [isTop, setIsTop] = useState(true);
    // if (imdbRating > 8) return <p>Greatest ever!</p>;

    // React evaluates the default state only on the initial render
    // const [isTop, setIsTop] = useState(imdbRating > 8);
    // console.log(isTop);

    // useEffect(() => {
    //     setIsTop(imdbRating > 8);
    // }, [imdbRating]);

    // const isTop = imdbRating > 8;
    // console.log(isTop);

    // const [avgRating, setAvgRating] = useState(0);

    const handleAdd = () => {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: runtime.split(" ").at(0),
            userRating,
            countRatingDecisions: countRef.current,
        };

        onAddWatched(newWatchedMovie);
        onCloseMovie();

        // setAvgRating(Number(imdbRating));
        // setAvgRating((cur) => (cur + userRating) / 2);
    };

    useEffect(() => {
        async function getMovieDetails() {
            setIsLoading(true);
            const response = await fetch(`${API_LINK}&i=${selectedId}`);
            const data = await response.json();
            setMovie(data);
            setIsLoading(false);
        }
        getMovieDetails();
    }, [API_LINK, selectedId]);

    useEffect(() => {
        if (!title) return;
        document.title = `Movie | ${title}`;

        return () => {
            document.title = "usePopcorn";
        };
    }, [title]);

    useKey("Escape", onCloseMovie);

    useEffect(() => {
        if (userRating) countRef.current += 1;
        console.log("countRef: ", countRef);
    }, [userRating]);

    return (
        <div className="details">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <div className="details-overview">
                            <button className="btn-back" onClick={onCloseMovie}>
                                &larr;
                            </button>
                            <img src={poster} alt={`Poster of ${movie}`} />
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐</span>
                                {imdbRating} IMDb rating
                            </p>
                        </div>
                    </header>
                    {/* <p>{avgRating}</p> */}
                    <section>
                        <div className="rating">
                            {!isWatched ? (
                                <>
                                    <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                                    {userRating > 0 && (
                                        <button className="btn-add" onClick={handleAdd}>
                                            Add to list
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p>
                                    You rated this movie {watchedUserRating}
                                    <span>⭐</span>
                                </p>
                            )}
                        </div>

                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Starring: {actors}</p>
                        <p>Directed by {director}</p>
                    </section>{" "}
                </>
            )}
        </div>
    );
}
