
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Ship, SailingLog, SHIP_LIST, UserRole, TelegramConfig } from '../types';

interface FerryContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  ships: Ship[];
  logs: SailingLog[];
  setLogs: React.Dispatch<React.SetStateAction<SailingLog[]>>;
  telegramConfig: TelegramConfig;
  setTelegramConfig: React.Dispatch<React.SetStateAction<TelegramConfig>>;
  saveLog: (log: SailingLog) => void;
}

const FerryContext = createContext<FerryContextType | undefined>(undefined);

const INITIAL_USERS: User[] = [
  { id: 'u1', name: '관리자K', role: '관리자', telegramChatId: '12345678', joinedAt: '2024-01-01' },
  { id: 'u2', name: '이선장', role: '선장', telegramChatId: '87654321', joinedAt: '2024-01-05' },
  { id: 'u3', name: '김기관', role: '기관장', telegramChatId: '', joinedAt: '2024-01-10' },
  { id: 'u4', name: '최승무', role: '승무원', telegramChatId: '', joinedAt: '2024-01-12' },
];

const MOCK_LOGS: SailingLog[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `log-${i}`,
  date: new Date(Date.now() - Math.random() * 1000000000).toISOString().split('T')[0],
  departureTime: '09:00',
  arrivalTime: Math.random() > 0.5 ? '10:30' : '', // Some are navigating
  captainId: 'u2',
  chiefEngineerId: 'u3',
  crewIds: ['u4'],
  passengerCount: Math.floor(Math.random() * 100) + 10,
  shipId: String(Math.floor(Math.random() * 4) + 1),
  fuelStatus: '85%',
  notes: i % 5 === 0 ? '기상 악화로 인한 지연 서행' : '특이사항 없음',
  isDraft: false,
  createdAt: new Date().toISOString(),
}));

export const FerryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ferry_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [logs, setLogs] = useState<SailingLog[]>(() => {
    const saved = localStorage.getItem('ferry_logs');
    return saved ? JSON.parse(saved) : MOCK_LOGS;
  });
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>(() => {
    const saved = localStorage.getItem('ferry_tg_config');
    return saved ? JSON.parse(saved) : { botToken: '', recipients: [] };
  });

  useEffect(() => {
    localStorage.setItem('ferry_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ferry_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('ferry_tg_config', JSON.stringify(telegramConfig));
  }, [telegramConfig]);

  const saveLog = (log: SailingLog) => {
    setLogs(prev => {
      const exists = prev.find(l => l.id === log.id);
      if (exists) {
        return prev.map(l => l.id === log.id ? log : l);
      }
      return [log, ...prev];
    });
  };

  return (
    <FerryContext.Provider value={{ 
      currentUser, setCurrentUser, 
      users, setUsers,
      ships: SHIP_LIST, 
      logs, setLogs,
      telegramConfig, setTelegramConfig,
      saveLog 
    }}>
      {children}
    </FerryContext.Provider>
  );
};

export const useFerry = () => {
  const context = useContext(FerryContext);
  if (!context) throw new Error('useFerry must be used within FerryProvider');
  return context;
};
