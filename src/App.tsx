import { useCallback, useEffect, useState } from "react";
import words from "./wordList.json";
import HangmanWord from "./HangmanWord";
import HangmenDrawing from "./HangmenDrawing";
import Keyboard from "./Keyboard";

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}


function App() {
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)];
  });
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLosser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
  .split("")
  .every((letter) => guessedLetters.includes(letter));


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


  useEffect(()=>{
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if(key !== 'Enter') return
      

      e.preventDefault()
      setGuessedLetters([])
      setWordToGuess(getWord())


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
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isLosser
          ? "You lost! Try Again!"
          : isWinner
          ? "You won!"
          : "Guess the word!"}
      </div>
      <HangmenDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord reveal={isLosser} guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard 
          disabled={isLosser || isWinner}
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
