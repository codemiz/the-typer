import React, { useEffect, useRef, useState } from "react";
import { useLeaderboard } from "./context/leaderboardContext";
import { saveToLeaderboard } from "./appwrite";
import { isDesktop } from "react-device-detect";
import paragraphs from "./paragraphs";

function Typing() {
  const [userInput, setUserInput] = useState("");
  const [name, setName] = useState("");
  const [givenWordsArray, setGivenWordsArray] = useState([]);
  const [typedWordsArray, setTypedWordsArray] = useState([]);
  const [totalWordsTyped, setTotalWordsTyped] = useState(0);
  const [timerBar, setTimerBar] = useState(0);
  const [selectedSection, setSelectedSection] = useState("leaderboard");
  const [correctWords, setCorrectWords] = useState(0);
  const [timeRemainig, setTimeRemaining] = useState(0);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const intervalRef = useRef(null);
  const { leaderboard, loading, setLeaderboard } = useLeaderboard();
  const tagLines = [
    "Test your speed. Rule the leaderboard!",
    "Type fast. Climb high. Show the world your WPM!",
    "How fast are your fingers? Let the world see!",
    "One test. One score. Infinite bragging rights.",
    "Beat the clock. Beat the world.",
    "Your words per minute, the world's envy.",
    "Prove your speed. Earn your spot.",
    "Type like a pro. Rank like a legend.",
    "Speed isn't just a skill — it's a title.",
    "Let your WPM do the talking.",
    "Outtype your friends. Or die trying (just kidding… or not).",
    "Faster fingers = bigger flex. Prove it.",
    "Make typos cry. Become a typing legend.",
    "This isn't just typing — it's a lifestyle.",
    "WPM is your new superpower. Use it wisely.",
    "Your keyboard fears you. The leaderboard needs you.",
    "Type like your reputation depends on it. Because it kinda does.",
    "Step up. Key up. Shut up the doubters.",
    "You vs. the world… in 60 seconds of furious typing.",
    "Got fast fingers? Let the numbers speak.",
  ];
  

  const [randomText] = useState(
    paragraphs[Math.floor(Math.random() * paragraphs.length)]
  );

  const [randomTagLine] = useState(
    tagLines[Math.floor(Math.random() * tagLines.length)]
  );

  useEffect(() => {
    setGivenWordsArray(randomText.split(" "));
  }, []);

  useEffect(() => {
  const inputWords = userInput.trim().split(" ");
  const endsWithSpace = userInput.endsWith(" ");
  const completedWords = endsWithSpace ? inputWords : inputWords.slice(0, -1);

  setTypedWordsArray(completedWords);
  setTotalWordsTyped(completedWords.length);

  let correct = 0;
  completedWords.forEach((word, index) => {
    if (word === givenWordsArray[index]) {
      correct++;
    }
  });

  setCorrectWords(correct);
  setAccuracy(
    completedWords.length > 0
      ? Math.round((correct / completedWords.length) * 100)
      : 0
  );
}, [userInput, givenWordsArray]);


  function startTest() {
    if (isTimerStarted) return;

    setIsTimerStarted(true);

    setCorrectWords(0);
    setTotalWordsTyped(0);
    setAccuracy(0);
    setTimeRemaining(0);

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev >= 59) {
          clearInterval(intervalRef.current);
          setIsTimerStarted(false);
          setSelectedSection("result");
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  }

  useEffect(() => {
    if (selectedSection == "test") {
      setUserInput("");
      setCorrectWords(0);
      setTotalWordsTyped(0);
      setAccuracy(0);
      setTimeRemaining(0);
      setTypedWordsArray([]);
      const randomParagraph =
        paragraphs[Math.floor(Math.random() * paragraphs.length)];
      setGivenWordsArray(randomParagraph.split(" "));
    }
  }, [selectedSection]);

  async function saveScore() {
    setSaveLoading(true);
    const res = await saveToLeaderboard(name || "Anonymous", correctWords);
    if (res) {
      setLeaderboard((prev) => [...prev, res]);
    }
    console.log(leaderboard);

    setSelectedSection("leaderboard");
    setSaveLoading(false);
  }

  useEffect(() => {
    let percentage = (timeRemainig / 60) * 100;
    setTimerBar(percentage);
    // console.log(timerBar);
  }, [timeRemainig]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-blue-200 py-10">
      {selectedSection == "test" && (
        <div className="test w-full max-w-4xl bg-white h-[690px] rounded-2xl shadow-lg p-8 flex flex-col gap-4">
          <h1 className=" text-lg md:text-3xl font-mono font-bold text-blue-500 text-center">
            ⌨️ Typing Test ⌨️
          </h1>

          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto border border-gray-300 shadow text-gray-700 font-mono leading-relaxed text-lg whitespace-pre-wrap">
            {givenWordsArray.map((value, index) => (
              <span
                key={index}
                className={`${
                  index < totalWordsTyped 
                    ? typedWordsArray[index] == value
                      ? "text-green-600"
                      : "text-red-600"
                    : ""
                } ${

                  index == totalWordsTyped  &&
                  "bg-[#cce5ff] rounded p-0.5 font-semibold"
                } `}
              >
                {value + " "}
              </span>
            ))}
          </div>

         
          <textarea
            value={userInput}
            onChange={(e) => {
              startTest();
              setUserInput(e.target.value);
            }}
            rows={6}
            disabled={!isDesktop}
            placeholder="Start typing here..."
            className="resize-none bg-white border border-blue-300 focus:outline-none font-mono focus:ring-2 focus:ring-blue-400 rounded-lg p-4 text-lg shadow-sm"
          ></textarea>
     <div className="flex justify-between text-lg font-mono text-gray-700">
            <p>
              Total Words Typed:{" "}
              <span className="font-semibold">{totalWordsTyped}</span>
            </p>
            <p>
              Accuracy:{" "}
              <span className="font-semibold">{accuracy || "--"}</span>
            </p>
            <p>
              Correct Words:{" "}
              <span className="font-semibold">{correctWords}</span>
            </p>
          </div>
          {isTimerStarted ? (
            <div className=" border w-full h-12 border-gray-400 text-white text-xl font-mono rounded-md cursor-pointer flex ">
              <div
                style={{ width: `${timerBar}%` }}
                className={`h-full bg-blue-400 transition-all duration-700`}
              ></div>
            </div>
          ) : (
            <h4 className="font-mono text-gray-500 text-center">
              The timer will start once you start typing.
            </h4>
          )}
        </div>
      )}
      {selectedSection == "leaderboard" && (
        <div
          className={`leaderboard w-full max-w-4xl h-[690px] bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6`}
        >
          <h1 className=" text-lg md:text-3xl font-mono font-bold text-blue-500 text-center">
            🥇 Leaderboard 🥈
          </h1>
          {loading ? (
            <div className="loading bg-gray-50 rounded-lg p-4 h-[460px] overflow-y-auto border border-gray-300 shadow text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
              <div className="w-full h-16 bg-gray-200 mb-2 animate-pulse"></div>
              <div className="w-full h-16 bg-gray-200 mb-2 animate-pulse"></div>
              <div className="w-full h-16 bg-gray-200 mb-2 animate-pulse"></div>
              <div className="w-full h-16 bg-gray-200 mb-2 animate-pulse"></div>
              <div className="w-full h-16 bg-gray-200 mb-2 animate-pulse"></div>
              <div className="w-full h-16 bg-gray-200 mb-2 animate-pulse"></div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 h-[460px] font-mono overflow-y-auto border border-gray-300 shadow text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
              {leaderboard ? (
                leaderboard
                  .sort((a, b) => b.wpm - a.wpm)
                  .slice(0,20)
                  .map((value, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-400 hover:bg-gray-200 w-full pt-4 pb-1 flex px-2 justify-between"
                    >
                      <span>
                        <span className="font-bold">
                          {(index + 1 == 1 && "🥇") ||
                            (index + 1 == 2 && "🥈") ||
                            (index + 1 == 3 && "🥉") ||
                            index + 1}
                        </span>{" "}
                        {value.name}
                      </span>
                      <span className="font-bold text-xl">
                        {value.wpm}{" "}
                        <span className="font-light text-sm">WPM</span>
                      </span>
                    </div>
                  ))
              ) : (
                <h4 className="text-md font-mono text-center">
                  Failed to load the leaderbaord. Kindly reload the page.
                </h4>
              )}
            </div>
          )}

          <h4 className="md:text-lg text-red-500 md:text-black font-mono text-center">
            {isDesktop
              ? randomTagLine
              : "You can take the test on desktop only."}
          </h4>
          <button
            onClick={() => setSelectedSection("test")}
            className={`bg-blue-400 py-3 hidden md:block text-white text-xl font-mono rounded-md cursor-pointer`}
          >
            Start Test
          </button>
        </div>
      )}
      {selectedSection == "result" && (
        <>
          <div className="md:hidden font-mono">
            Use a PC or laptop to view results.
          </div>
          <div className="hidden md:flex result w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 flex-col gap-6">
            <h1 className="text-3xl font-mono font-bold text-blue-500 text-center">
              🎖️ Your Result 🎖️
            </h1>
            <div className=" rounded-lg p-4 h-44 overflow-y-auto border border-gray-300 shadow text-gray-700 font-mono leading-relaxed text-lg whitespace-pre-wrap">
              {typedWordsArray.map((value, index) => (
                <span
                  key={index}
                  className={`${
                    index < totalWordsTyped - 1
                      ? givenWordsArray[index] == value
                        ? "bg-green-600 text-white p-0.5 m-0.5"
                        : "bg-red-600 text-white p-0.5 m-0.5"
                      : ""
                  } `}
                >
                  {value + " "}
                </span>
              ))}
            </div>

            <div className="result font-mono w-full flex justify-between gap-2">
              <div className="score w-1/4 h-44 bg-blue-200 shadow rounded-md p-2 flex flex-col items-center">
                <p className="text-lg">Typed Words:</p>
                <p className="text-5xl font-bold mt-6">{totalWordsTyped}</p>
              </div>
              <div className="score w-1/4 h-44 bg-purple-200 shadow rounded-md p-2 flex flex-col items-center">
                <p className="text-lg">Accuracy:</p>
                <p className="text-5xl font-bold mt-6">{accuracy || "0"}%</p>
              </div>
              <div className="score w-1/4 h-44 bg-green-200 shadow rounded-md p-2 flex flex-col items-center">
                <p className="text-lg">Words per min:</p>
                <p className="text-5xl font-bold mt-6">{correctWords}</p>
              </div>
              <div className="score w-1/4 h-44 bg-red-200 shadow rounded-md p-2 flex flex-col items-center">
                <p className="text-lg">Rank:</p>
                <p className="text-4xl font-bold mt-6">
                  {(correctWords >= 62 && "Top 0.1%") ||
                    (correctWords >= 60 && "Top 0.3%") ||
                    (correctWords >= 58 && "Top 0.5%") ||
                    (correctWords >= 55 && "Top 1%") ||
                    (correctWords >= 50 && "Top 3%") ||
                    (correctWords >= 47 && "Top 5%") ||
                    (correctWords >= 45 && "Top 7%") ||
                    (correctWords >= 42 && "Top 10%") ||
                    (correctWords >= 40 && "Top 12%") ||
                    (correctWords >= 37 && "Top 15%") ||
                    (correctWords >= 35 &&
                      "Top 17%" | (correctWords >= 32) &&
                      "Top 23%") ||
                    (correctWords >= 30 && "Top 32%") ||
                    (correctWords >= 25 && "Top 45%") ||
                    (correctWords >= 20 && "Top 55%") ||
                    (correctWords >= 15 && "Top 75%") ||
                    (correctWords >= 10 && "Top 85%") ||
                    (correctWords > 0  && "Top 95%") ||
                    (correctWords == 0 && "Top 100%")
                    }
                </p>
              </div>
            </div>
            <div className="w-full flex gap-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-3/4 border border-gray-500 py-3 text-lg rounded-md px-2 font-mono"
                placeholder="Enter your name to show your result on leaderboard"
              />

              <button
                onClick={saveScore}
                className="w-1/4 bg-blue-400 py-3 text-white text-xl font-mono rounded-md cursor-pointer flex justify-center items-center"
              >
                {saveLoading ? (
                  <div className="loading w-7 h-7 border-3 rounded-3xl border-blue-300 border-r-white animate-spin"></div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Typing;
