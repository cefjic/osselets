import { useEffect } from "react";
import { Config, Data } from "../interfaces";
import { getAvatarFromConfig, getFinalScores } from "../utils";

interface Props {
  config: Config;
  data: Data;
  onReset(): void;
}

const WinnerBanner = ({ data, config, onReset }: Props) => {
  const { winner, loser, equality } = getFinalScores(data);
  const { name } = getAvatarFromConfig(config, winner.player);

  useEffect(() => {
    const handleKeyDown = ({ code }: KeyboardEvent) => {
      switch (code) {
        case "Enter": {
          onReset();
          break;
        }
        case "Space": {
          onReset();
          break;
        }
        default: {
          break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReset]);

  return (
    <div className="endgame">
      {equality ? (
        <h1>
          Equality ! {winner.score} - {loser.score}
        </h1>
      ) : (
        <h1>
          {name} wins ! {winner.score} - {loser.score}
        </h1>
      )}
      <button onClick={onReset}>Restart</button>
    </div>
  );
};

export default WinnerBanner;
