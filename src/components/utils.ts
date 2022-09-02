import { Config, Data, Player, Table, Score } from "./interfaces";
import { Avatars } from "./constants";

export const getRandomDiceValue = (): number =>
  Math.floor(Math.random() * 6) + 1;

export const getOccurencesOfNumberInArray = (number: number, array: number[]) =>
  array.reduce((acc, value) => (value === number ? acc + 1 : acc), 0);

export const calculateLinePoints = (line: number[]) =>
  line.reduce((acc, value) => {
    const occ = getOccurencesOfNumberInArray(value, line);
    return acc + value * occ;
  }, 0);

export const calculateTablePoints = (table: Table) =>
  Object.values(table).reduce(
    (acc, line) => acc + calculateLinePoints(line),
    0
  );

export const calculateIsGameEnded = (data: Data): boolean =>
  Object.values(data).reduce(
    (acc, table: Table) =>
      acc ||
      Object.values(table).filter((line) => line.length === 3).length === 3,
    false
  );

export const getOtherPlayer = (currentPlayer: Player): Player =>
  currentPlayer === 1 ? 2 : 1;

export const calculateOtherPlayerTable = (
  data: Data,
  currentPlayer: Player,
  lineIndex: number,
  diceValue: number
): Table => {
  const otherPlayer = getOtherPlayer(currentPlayer);
  const otherTable = data[otherPlayer];
  const otherLineIndex = lineIndex === 0 ? 2 : lineIndex === 2 ? 0 : 1;

  const otherLine = otherTable[otherLineIndex];

  return {
    ...otherTable,
    [otherLineIndex]: otherLine.filter((value) => value !== diceValue),
  };
};

export const calculateCurrentPlayerTable = (
  table: Table,
  lineIndex: number,
  diceValue: number
): Table => ({
  ...table,
  [lineIndex]: [...table[lineIndex], diceValue],
});

export const calculateNewData = (
  data: Data,
  currentPlayer: Player,
  lineIndex: number,
  diceValue: number
): Data => {
  const table = data[currentPlayer];
  const currentPlayerTable = calculateCurrentPlayerTable(
    table,
    lineIndex,
    diceValue
  );

  const otherPlayerTable = calculateOtherPlayerTable(
    data,
    currentPlayer,
    lineIndex,
    diceValue
  );

  return {
    1: currentPlayer === 1 ? currentPlayerTable : otherPlayerTable,
    2: currentPlayer === 2 ? currentPlayerTable : otherPlayerTable,
  };
};

export const getInitialData = (): Data => ({
  1: { 0: [], 1: [], 2: [] },
  2: { 0: [], 1: [], 2: [] },
});

export const getRandomPlayer = (): Player =>
  Math.floor(Math.random() * 2) + 1 === 2 ? 2 : 1;

export const getFilteredAvatars = (
  playersConfig: Partial<Config["players"]>
) => {
  const listNames = Object.values(playersConfig || {}).reduce<string[]>(
    (acc, { name }) => [...acc, name],
    []
  );

  return Avatars.filter(({ name }) => !listNames.includes(name));
};

export const getAvatarFromConfig = (config: Config, player: Player) => {
  return config.players[player];
};

export const getFinalScores = (
  data: Data
): { winner: Score; loser: Score; equality: boolean } => {
  const p1Score: Score = { player: 1, score: calculateTablePoints(data[1]) };
  const p2Score: Score = { player: 2, score: calculateTablePoints(data[2]) };
  const winner: 0 | Player =
    p1Score.score > p2Score.score ? 1 : p2Score.score > p1Score.score ? 2 : 0;

  return {
    equality: winner === 0,
    winner: winner === 1 ? p1Score : p2Score,
    loser: winner === 1 ? p2Score : p1Score,
  };
};
