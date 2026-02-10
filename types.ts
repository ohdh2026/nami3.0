
export type UserRole = '관리자' | '선장' | '기관장' | '승무원';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  telegramChatId: string;
  joinedAt: string;
}

export interface Ship {
  id: string;
  name: string;
  capacity: number;
}

export interface SailingLog {
  id: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  captainId: string;
  chiefEngineerId: string;
  crewIds: string[];
  passengerCount: number;
  shipId: string;
  fuelStatus: string;
  notes: string;
  isDraft: boolean;
  createdAt: string;
}

export interface TelegramConfig {
  botToken: string;
  recipients: string[]; // User IDs
}

export const SHIP_LIST: Ship[] = [
  { id: '1', name: '탐나라호', capacity: 300 },
  { id: '2', name: '아일래나호', capacity: 200 },
  { id: '3', name: '가우디호', capacity: 100 },
  { id: '4', name: '인어공주호', capacity: 100 },
];
