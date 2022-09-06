import React, { useCallback, useEffect, useState } from "react";
import { Config, Player, Table } from "../interfaces";
import DiceIcon from "./components/DiceIcon/DiceIcon";
import {
  calculateLinePoints,
  calculateTablePoints,
  callActionFromCode,
  getAvatarFromConfig,
  isLineInTablePerimeter,
  goToPosition,
  getOccurencesOfNumberInArray,
} from "../utils";

interface Props {
  config: Config;
  table: Table;
  diceValue: number;
  currentPlayer: Player;
  playerTable: Player;
  onLineClick(lineIndex: number, currentPlayer: Player): boolean;
}

const PlayerTable = ({
  config,
  playerTable,
  table,
  diceValue,
  currentPlayer,
  onLineClick,
}: Props) => {
  const [selectedLineIndex, setSelectedLineIndex] = useState<number>(-1);
  const { avatar, name } = getAvatarFromConfig(config, playerTable);

  const playerTableIsPlaying = playerTable === currentPlayer;

  const handleClick = useCallback(
    (index: number) => {
      if (isLineInTablePerimeter(index)) {
        const isOk = onLineClick(index, playerTable);
        if (isOk) {
          setSelectedLineIndex(-1);
        }
      }
    },
    [onLineClick, playerTable]
  );

  useEffect(() => {
    const submitLine = () => {
      handleClick(selectedLineIndex);
    };

    const goTo = (position: "left" | "right") => {
      goToPosition(position, table, selectedLineIndex, setSelectedLineIndex);
    };

    const handleKeyDown = ({ code }: KeyboardEvent) => {
      if (playerTableIsPlaying) {
        callActionFromCode(code, submitLine, goTo);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedLineIndex,
    playerTableIsPlaying,
    onLineClick,
    playerTable,
    table,
    handleClick,
  ]);

  useEffect(() => {
    if (playerTableIsPlaying) {
      goToPosition("right", table, selectedLineIndex, setSelectedLineIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerTableIsPlaying]);

  return (
    <div className="player">
      <div className={`dice ${!playerTableIsPlaying ? "hidden" : ""}`}>
        <DiceIcon value={diceValue} />
      </div>
      <div className="cross" />
      <div className="player-total">{calculateTablePoints(table)}</div>
      <div className="player-avatar">
        <img src={avatar} alt={name} />
      </div>
      <div className="table">
        {Object.values(table).map((line, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`line ${
              playerTableIsPlaying && selectedLineIndex === index
                ? "selected"
                : ""
            }`}
          >
            <div className="total">{calculateLinePoints(line)}</div>
            {[0, 1, 2].map((i) => {
              const value = line.length > i && line[i];
              const occ = getOccurencesOfNumberInArray(value || 0, line);
              return (
                <div
                  key={i}
                  className={`line-dice ${
                    occ === 2 ? "twice" : occ === 3 ? "thrice" : ""
                  }`}
                >
                  {value ? (
                    <DiceIcon value={value} />
                  ) : (
                    <div className="empty-dice" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerTable;
