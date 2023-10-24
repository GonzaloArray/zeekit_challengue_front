import { useEffect, useMemo, useState } from "react";
import { getDataMovieResults } from "./service/getDataMovieResults";
import { Movie } from "./type";
import Swal from "sweetalert2";

const getModifityGuess = (movie: Movie, dificulty: number): string => {
  const ramdonGuess = Array.from({ length: movie.name.length }, (_, i) => i)
    .sort(() => (Math.random() >= 0.5 ? 1 : -1))
    .slice(0, Math.max(Math.floor((movie.name.length * dificulty) / 100), 1));

  return movie.name.split("").reduce((currentLetter, nextLetter, index) => {
    currentLetter = currentLetter.concat(
      ramdonGuess.includes(index) ? "_" : nextLetter
    );

    return currentLetter;
  }, "");
};

const getDificultGuess = (number: number): string => {
  // Se puede mejorar con un Object.entries()
  if (number === 20) {
    return "Easy";
  } else if (number === 50) {
    return "Medium";
  } else if (number === 80) {
    return "Hard";
  } else {
    return "Ingrese un dificultad";
  }
};

function App() {
  const [movie, setMovie] = useState<null | Movie>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [live, setLive] = useState<number>(3);
  const [points, setPoints] = useState<number>(0);
  const [dificulty, setDificulty] = useState<number>(50);
  const [historyGuess, setHistoryGuess] = useState<string[]>([]);

  const partial = useMemo(() => {
    if (!movie) return "";

    return getModifityGuess(movie, dificulty);
  }, [movie, dificulty]);

  useEffect(() => {
    setLoading(true);
    getDataMovieResults()
      .then((movies) => {
        setMovie(
          movies.results[Math.floor(Math.random() * movies.results.length)]
        );
      })
      .catch(() => setError(() => true))
      .finally(() => setLoading(false));
  }, [points]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const answer = formData.get("answer")?.toString();

    if (answer?.toLocaleLowerCase() === movie?.name.toLocaleLowerCase()) {
      setPoints(points + 1);
      answer !== undefined && setHistoryGuess([...historyGuess, answer]);
      Swal.fire("Good job!", "You clicked the button!", "success");
    } else {
      setLive(() => live - 1);
      setError(() => true);

      setTimeout(() => {
        setError(() => false);
      }, 1000);

      if (live <= 1) {
        Swal.fire({
          icon: "error",
          title: "Game Over",
          text: "Your Lose!",
        }).then(() => {
          setLive(() => 3);
          setPoints(() => 0);
          setHistoryGuess(() => []);
        });
      }
    }

    e.currentTarget.reset();
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-4xl text-center my-10">Guess Guesser</h2>
      {loading && (
        <h2 className="text-4xl text-center text-blue-800 font-bold">
          Loading ...
        </h2>
      )}
      <section className="flex justify-center items-center gap-8">
        <h2 className="text-center font-bold mb-5">
          Lives: {live} - Score: {points} - Dificult:{" "}
          {getDificultGuess(dificulty)}
        </h2>
        <select
          onChange={(e: React.FormEvent<HTMLSelectElement>) =>
            setDificulty(Number((e.target as HTMLSelectElement).value))
          }
          value={dificulty}
          className="bg-gray-800"
        >
          <option value={20}>Easy</option>
          <option value={50}>Medium</option>
          <option value={80}>Hard</option>
        </select>
      </section>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-[500px] mx-auto"
      >
        <input
          className="p-3 bg-gray-800 rounded-sm tracking-widest"
          type="text"
          readOnly
          value={partial}
        />
        <input
          className="p-3 bg-gray-800 rounded-sm tracking-widest"
          type="text"
          name="answer"
        />
        {error && (
          <span className="text-red-600 transition-all">Error name serie</span>
        )}
        <button
          type="submit"
          className="bg-red-800 p-2 rounded-3xl font-bold hover:bg-red-600 transition-all"
        >
          Send Guess
        </button>
        <button
          className="bg-orange-800 p-2 rounded-3xl font-bold hover:bg-orange-600 transition-all"
          type="button"
          onClick={() => setModal(!modal)}
        >
          {modal ? "Close review" : "Open review"}
        </button>
      </form>

      <section>
        <h2 className="font-bold text-2xl text-center mt-10">
          Movies Success:
        </h2>
        <div>
          {historyGuess.length === 0 && (
            <h2 className="text-center font-bold">-Not guess</h2>
          )}
          {historyGuess.map((guess, index) => (
            <div key={index} className="flex justify-center items-center gap-8">
              <h2 className="text-center font-bold">- {guess}</h2>
            </div>
          ))}
        </div>
      </section>
      <div
        className={`absolute top-0 bottom-0 left-0 right-0 bg-gray-800 p-4 w-[500px] h-[500px] rounded-lg m-auto animate__animated ${
          modal ? "animate__fadeIn" : "animate__fadeOutUp"
        }`}
      >
        <div className="flex gap-10 justify-between items-center mb-7">
          <h2 className="underline text-2xl font-bold">Review</h2>
          <button
            type="button"
            onClick={() => setModal(false)}
            className="bg-red-500 rounded-full px-3 py-1"
          >
            X close
          </button>
        </div>
        <p className="text-ellipsis">{movie?.overview}</p>
      </div>
    </div>
  );
}

export default App;
