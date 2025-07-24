export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  period: number;
  group: number;
  color: string;
}

export interface Card {
  id: string;
  element: Element;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  isHuman: boolean;
  score: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  deck: Card[];
  discardPile: Card[];
  phase: 'setup' | 'playing' | 'ended';
  winner: string | null;
  turn: number;
  gameMode: 'ai' | 'local' | 'online';
  roomId?: string;
  isHost?: boolean;
}

export interface HandType {
  name: string;
  description: string;
  points: number;
  cards?: Card[];
}

export interface GameRoom {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  isPrivate: boolean;
  status: 'waiting' | 'playing' | 'finished';
  createdAt: Date;
}

export interface OnlineGameState extends GameState {
  roomId: string;
  hostId: string;
}