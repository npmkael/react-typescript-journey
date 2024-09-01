import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import MovieBox from "./components/MovieBox";
import { tempMovieDataType } from "./tempMovieModel";
import { tempWatchedDataType } from "./tempWatchMovieModel";
import Logo from "./components/Logo";
import Search from "./components/Search";
import NumResults from "./components/NumResults";

const tempMovieData = [
    {
        imdbID: "tt1375666",
        Title: "Inception",
        Year: "2010",
        Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    },
    {
        imdbID: "tt0133093",
        Title: "The Matrix",
        Year: "1999",
        Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    },
    {
        imdbID: "tt6751668",
        Title: "Parasite",
        Year: "2019",
        Poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
    },
];

const tempWatchedData = [
    {
        imdbID: "tt1375666",
        Title: "Inception",
        Year: "2010",
        Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
        runtime: 148,
        imdbRating: 8.8,
        userRating: 10,
    },
    {
        imdbID: "tt0088763",
        Title: "Back to the Future",
        Year: "1985",
        Poster: "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
        runtime: 116,
        imdbRating: 8.5,
        userRating: 9,
    },
];

const KEY = "fa23eaa3";

function App() {
    const [movies, setMovies] = useState<tempMovieDataType[]>([]);
    const [watched, setWatched] = useState<tempWatchedDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const query = "intderstellar";

    // useEffect for data fetching
    useEffect(function () {
        async function fetchMovies() {
            try {
                setIsLoading(true);
                const res = await fetch(
                    `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`
                );

                if (!res.ok)
                    throw new Error(
                        "Something went wrong with fetching movies"
                    );

                const data = await res.json();
                if (data.Response === "False")
                    throw new Error("Movie not found");

                setMovies(data.Search);
            } catch (err: any) {
                console.error(err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMovies();
    }, []);

    return (
        <>
            <NavBar>
                <Logo />
                <Search />
                <NumResults movie={movies} />
            </NavBar>
            <MovieBox>
                <Box>
                    {/* {isLoading ? <Loader /> : <MovieList movieData={movies} />} */}
                    {isLoading && <Loader />}
                    {!isLoading && !error && <MovieList movieData={movies} />}
                    {error && <ErrorMessage message={error} />}
                </Box>

                <Box>
                    <WatchSummary watchedData={watched} />
                    <WatchedList watchedData={watched} />
                </Box>
            </MovieBox>
        </>
    );
}

function Loader() {
    return <p className="loader">Loading...</p>;
}

interface ErrorMessageProps {
    message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <p className="error">
            <span>🚫</span>
            {message}
        </p>
    );
}

function average(arr: number[]): number {
    return arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
}

interface MovieDataProps {
    movieData: tempMovieDataType[];
}

interface Props {
    children: React.ReactNode;
}

function Box({ children }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && children}
        </div>
    );
}

function MovieList({ movieData }: MovieDataProps) {
    return (
        <ul className="list">
            {movieData?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID} />
            ))}
        </ul>
    );
}

type MovieProps = {
    movie: tempMovieDataType;
};

function Movie({ movie }: MovieProps) {
    return (
        <li>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );
}

interface WatchedMovieProps {
    watchedData: tempWatchedDataType[];
}

function WatchSummary({ watchedData }: WatchedMovieProps) {
    const avgImdbRating: number = average(
        watchedData.map((movie) => movie.imdbRating)
    );
    const avgUserRating: number = average(
        watchedData.map((movie) => movie.userRating)
    );
    const avgRuntime: number = average(
        watchedData.map((movie) => movie.runtime)
    );

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watchedData.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}

function WatchedList({ watchedData }: WatchedMovieProps) {
    return (
        <ul className="list">
            {watchedData.map((movie) => (
                <Watched movie={movie} key={movie.imdbID} />
            ))}
        </ul>
    );
}

type WatchedMovie = {
    movie: tempWatchedDataType;
};

function Watched({ movie }: WatchedMovie) {
    return (
        <li>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>
            </div>
        </li>
    );
}

export default App;
