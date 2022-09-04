import React, { useEffect, useState } from "react";
import { Config, Data, Player, Table } from "../interfaces";
import {
  calculateIsGameEnded,
  calculateNewData,
  getInitialData,
  getOtherPlayer,
  getRandomDiceValue,
  getRandomPlayer,
  isLineCompleted,
} from "../utils";
import PlayerTable from "../PlayerTable/PlayerTable";
import ConfigSelector from "../ConfigSelector/ConfigSelector";
import WinnerBanner from "../WinnerBanner/WinnerBanner";

function App() {
  const [isStarting, setIsStarting] = useState<boolean>(true);
  const [config, setConfig] = useState<Config | undefined>();
  const [canPlay, setCanPlay] = useState<boolean>(true);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(getRandomPlayer());
  const [diceValue, setDiceValue] = useState<number>(getRandomDiceValue());
  const [data, setData] = useState<Data>(getInitialData());

  const reset = () => {
    setIsStarting(true);
    setData(getInitialData());
    setDiceValue(getRandomDiceValue());
    setCurrentPlayer(getRandomPlayer());
  };

  const isGameEnded = calculateIsGameEnded(data);

  const rollDice = () => {
    setDiceValue(getRandomDiceValue());
  };

  const putOnLine = (lineIndex: number, player: Player) => {
    const table = data[currentPlayer];
    const canPutOnLine = !isLineCompleted(table, lineIndex);

    console.log({
      lineIndex,
      canPutOnLine,
      canPlay,
      isGameEnded,
      currentPlayer: currentPlayer === player,
    });

    if (canPutOnLine && currentPlayer === player && canPlay && !isGameEnded) {
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

  useEffect(() => {
    setTimeout(() => {
      setIsStarting(false);
      setCanPlay(true);
    }, 1000);
  }, [isStarting]);

  if (!config) {
    return <ConfigSelector onConfigUpdate={setConfig} />;
  }

  return (
    <div className="game">
      {isStarting ? (
        <div>Starting a new game</div>
      ) : (
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
      )}
      {isGameEnded && (
        <WinnerBanner data={data} config={config} onReset={reset} />
      )}
    </div>
  );
}

export default App;
