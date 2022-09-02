export type Table = Record<number, number[]>;

export interface Data {
  1: Table;
  2: Table;
}

export type Player = 1 | 2;

export interface PlayerConfig {
  name: string;
  avatar: string;
}

export interface Config {
  players: {
    1: PlayerConfig;
    2: PlayerConfig;
  };
}

export interface Score {
  player: Player;
  score: number;
}
