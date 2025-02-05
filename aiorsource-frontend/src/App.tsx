import './App.css'
import { useState, useEffect } from 'react';
import { Handler } from './Handler';
import { Data } from './Handler';

function App() {
  const handler = new Handler()

  const [sourceTexts, setSourceTexts] = useState<string[]>([])
  const [randomizedSourceTexts, setRandomizedSourceTexts] = useState<string[]>([])

  const [aiTexts, setAiTexts] = useState<string[]>([])
  const [randomizedAiTexts, setRandomizedAiTexts] = useState<string[]>([])

  const [topic] = useState<string>("sports")
  const [score, setScore] = useState<number>(0)

  const [sourceTextButton1, setSourceTextButton1] = useState<boolean>(false)
  const [button1Text, setButton1Text] = useState<string>("Loading...")
  const [button2Text, setButton2Text] = useState<string>("Loading...")

  // get text on render
  useEffect(() => {
    const getAiText = async () => {
      const source_and_ai_texts: Data = await handler.generate_ai_text(topic)
      const randomized_source_and_ai_texts: Data = handler.getRandomizedText(source_and_ai_texts.sourceText, source_and_ai_texts.aiText)
      setSourceTexts(source_and_ai_texts.sourceText)
      setAiTexts(source_and_ai_texts.aiText)
      setRandomizedSourceTexts(randomized_source_and_ai_texts.sourceText)
      setRandomizedAiTexts(randomized_source_and_ai_texts.aiText)
    }
    getAiText()
  }, []);

  useEffect(() => {
    const content = document.querySelector('.textBox') as HTMLElement;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.id === "btn1" || target.id === "btn2") {
        if (handler.isValid(event, sourceTextButton1)) {
          setScore((prevScore) => prevScore + 1);
          setRandomizedSourceTexts((prev) => prev.slice(0, prev.length - 1));
          setRandomizedAiTexts((prev) => prev.slice(0, prev.length - 1));
        } else {
          setScore(0);
          const randomized_source_and_ai_texts: Data = handler.getRandomizedText(sourceTexts, aiTexts)
          setRandomizedSourceTexts(randomized_source_and_ai_texts.sourceText)
          setRandomizedAiTexts(randomized_source_and_ai_texts.aiText)
        }
        setSourceTextButton1(handler.getRandom());
      }
    };

    if (content) {
      content.addEventListener("click", handleClick);
    }

    return () => {
      if (content) {
        content.removeEventListener("click", handleClick);
      }
    };
  }, [sourceTextButton1, handler]);

  useEffect(() => {
    if (randomizedAiTexts.length > 0) {
      if (sourceTextButton1) {
        setButton1Text(randomizedSourceTexts[randomizedSourceTexts.length - 1])
        setButton2Text(randomizedAiTexts[randomizedAiTexts.length - 1])
      }
      else {
        setButton1Text(randomizedAiTexts[randomizedAiTexts.length - 1])
        setButton2Text(randomizedSourceTexts[randomizedSourceTexts.length - 1])
      }
    }
  }, [randomizedSourceTexts, randomizedAiTexts])

  return (
    <>
      <div id="div1" className='textBox'>
        <div className='padding'>
          <button id="btn1" className='textButton'>
            {button1Text}
          </button>
        </div>
        <div className='centerColumn'>
          <button id="score" className='scoreButton'>
            Score: {score}
          </button>
          <p className='directions'>
            Guess the text from the original source!
          </p>
        </div>
        <div className='padding'>
          <button id="btn2" className='textButton'>
            {button2Text}
          </button>
        </div>
      </div>
    </>
  )
}

export default App;
