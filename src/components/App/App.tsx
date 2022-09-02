import React, { useEffect, useState } from "react";
import "./App.css";
import { Config, Data, Player, Table } from "../interfaces";
import {
  calculateIsGameEnded,
  calculateNewData,
  getInitialData,
  getOtherPlayer,
  getRandomDiceValue,
  getRandomPlayer,
} from "../utils";
import PlayerTable from "../PlayerTable/PlayerTable";
import ConfigSelector from "../ConfigSelector/ConfigSelector";
import WinnerBanner from "../WinnerBanner/WinnerBanner";

function App() {
  const [config, setConfig] = useState<Config | undefined>();
  const [canPlay, setCanPlay] = useState<boolean>(true);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(getRandomPlayer());
  const [diceValue, setDiceValue] = useState<number>(getRandomDiceValue());
  const [data, setData] = useState<Data>(getInitialData());

  const isGameEnded = calculateIsGameEnded(data);

  const rollDice = () => {
    setDiceValue(getRandomDiceValue());
  };

  const putOnLine = (lineIndex: number, player: Player) => {
    const table = data[currentPlayer];
    if (
      table[lineIndex].length < 3 &&
      currentPlayer === player &&
      canPlay &&
      !isGameEnded
    ) {
      setCanPlay(false);

      const newData = calculateNewData(
        data,
        currentPlayer,
        lineIndex,
        diceValue
      );

      setData(newData);

      setTimeout(() => {
        if (!calculateIsGameEnded(newData)) {
          rollDice();
          setCurrentPlayer(getOtherPlayer(currentPlayer));
        }
      }, 500);
      return true;
    }
    return false;
  };

  useEffect(() => {
    setCanPlay(true);
  }, [currentPlayer]);

  if (!config) {
    return <ConfigSelector onConfigUpdate={setConfig} />;
  }

  return (
    <div>
      <div className={`playing-table ${currentPlayer === 1 ? "rotate" : ""}`}>
        {Object.values(data).map((table: Table, playerIndex) => (
          <PlayerTable
            key={playerIndex}
            config={config}
            table={table}
            diceValue={diceValue}
            onLineClick={putOnLine}
            currentPlayer={currentPlayer}
            playerTable={playerIndex + 1 === 2 ? 2 : 1}
          />
        ))}
      </div>
      {isGameEnded && <WinnerBanner data={data} config={config} />}
    </div>
  );
}

export default App;
