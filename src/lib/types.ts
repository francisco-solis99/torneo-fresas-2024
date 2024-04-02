export type Duo = {
  id: number;
  player1: {
    name: string;
  };
  player2: {
    name: string;
  };
};

export type DuoTable = {
  id: number;
  player1: string;
  player2: string;
  groupId: number;
  groupName: string;
};

export type GroupTable = {
  id: number;
  name: string;
};

export type MatchTable = {
  id?: number;
  duo1_id: number;
  duo2_id: number;
  points_d1: number;
  points_d2: number;
  phase_id: number;
};
