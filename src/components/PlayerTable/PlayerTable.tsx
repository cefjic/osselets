import React, { useEffect, useState } from "react";
import { Config, Player, Table } from "../interfaces";
import DiceIcon from "../DiceIcon/DiceIcon";
import {
  calculateLinePoints,
  calculateTablePoints,
  getAvatarFromConfig,
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
  const [selectedLineIndex, setSelectedLineIndex] = useState<number>(0);
  const { avatar, name } = getAvatarFromConfig(config, playerTable);

  const playerTableIsPlaying = playerTable === currentPlayer;

  useEffect(() => {
    const submitLine = () => {
      if (selectedLineIndex >= 0) {
        const isOk = onLineClick(selectedLineIndex, playerTable);
        if (isOk) {
          setSelectedLineIndex(-1);
        }
      }
    };

    const goToLeftLine = () => {
      if (selectedLineIndex > 0) {
        setSelectedLineIndex(selectedLineIndex - 1);
      }
    };

    const goToRightLine = () => {
      if (selectedLineIndex < 2) {
        setSelectedLineIndex(selectedLineIndex + 1);
      }
    };

    const handleKeyDown = ({ code }: KeyboardEvent) => {
      if (playerTableIsPlaying) {
        switch (code) {
          case "Enter": {
            submitLine();
            break;
          }
          case "Space": {
            submitLine();
            break;
          }
          case "KeyA": {
            goToLeftLine();
            break;
          }
          case "ArrowLeft": {
            goToLeftLine();
            break;
          }
          case "KeyD": {
            goToRightLine();
            break;
          }
          case "ArrowRight": {
            goToRightLine();
            break;
          }
          default: {
            break;
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLineIndex, playerTableIsPlaying, onLineClick, playerTable]);

  useEffect(() => {
    if (playerTableIsPlaying) {
      setSelectedLineIndex(0);
    }
  }, [playerTableIsPlaying]);

  return (
    <div className="player">
      <div className={`dice ${!playerTableIsPlaying ? "hidden" : ""}`}>
        <DiceIcon value={diceValue} />
      </div>
      <div className="player-total">{calculateTablePoints(table)}</div>
      <div className="player-avatar">
        <img src={avatar} alt={name} />
      </div>
      <div className="table">
        {Object.values(table).map((line, index) => (
          <div
            key={index}
            onClick={() => onLineClick(index, playerTable)}
            className={`line ${
              playerTableIsPlaying && selectedLineIndex === index
                ? "selected"
                : ""
            }`}
          >
            <div className="total">{calculateLinePoints(line)}</div>
            {line.map((value, i) => (
              <div key={i}>
                <DiceIcon value={value} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerTable;
