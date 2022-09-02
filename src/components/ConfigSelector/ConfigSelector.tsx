import { useState } from "react";
import { Config, Player, PlayerConfig } from "../interfaces";
import { getFilteredAvatars } from "../utils";

interface Props {
  onConfigUpdate(config: Config): void;
}

const ConfigSelector = ({ onConfigUpdate }: Props) => {
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [playersConfig, setPlayersConfig] = useState<
    Partial<Config["players"]>
  >({});

  const onAvatarSelect = (playerConfig: PlayerConfig) => {
    const newConfig = { ...playersConfig, [currentPlayer]: playerConfig };
    setPlayersConfig(newConfig);
    if (currentPlayer === 1) {
      setCurrentPlayer(2);
    } else {
      onConfigUpdate({ players: newConfig as Config["players"] });
    }
  };

  const freeAvatars = getFilteredAvatars(playersConfig);

  return (
    <div className="endgame">
      <p>Player {currentPlayer}, select your avatar : </p>
      {freeAvatars.map((playerConfig) => {
        const { name, avatar } = playerConfig;
        return (
          <div className="avatar" key={name}>
            <img
              src={avatar}
              alt={name}
              onClick={() => {
                onAvatarSelect(playerConfig);
              }}
            />
            <p>{name}</p>
          </div>
        );
      })}
    </div>
  );
};
export default ConfigSelector;
