import { useCallback, useEffect, useState } from "react";
import words from "./wordList.json";
import HangmanWord from "./HangmanWord";
import HangmenDrawing from "./HangmenDrawing";
import Keyboard from "./Keyboard";

function App() {
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)];
  });
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

    const addGuessedLetter = useCallback((letter: string) => {
    if(guessedLetters.includes(letter)) return
    setGuessedLetters(current => [...current, letter]);
  }
  , [guessedLetters])


  useEffect(()=>{
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if(!key.match(/[a-z]/i)) return

      e.preventDefault()
      addGuessedLetter(key)


    }
    document.addEventListener('keypress', handler)

      return () => {
        document.removeEventListener('keypress', handler)
    }
  }, [guessedLetters])

  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "2rem", textAlign: "center" }}>Lose Win</div>
      <HangmenDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard 
          activeLetters={guessedLetters.filter(letter =>
            wordToGuess.includes(letter))}
          inactiveLetters={guessedLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default App;
