import { Config, Data } from "../interfaces";
import { getAvatarFromConfig, getFinalScores } from "../utils";

interface Props {
  config: Config;
  data: Data;
}

const WinnerBanner = ({ data, config }: Props) => {
  const { winner, loser, equality } = getFinalScores(data);
  const { name } = getAvatarFromConfig(config, winner.player);

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
    </div>
  );
};

export default WinnerBanner;
