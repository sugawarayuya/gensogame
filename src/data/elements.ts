import { Element } from '../types/game';

export const ELEMENTS: Element[] = [
  { atomicNumber: 1, symbol: 'H', name: '水素', period: 1, group: 1, color: '#FF6B6B' },
  { atomicNumber: 2, symbol: 'He', name: 'ヘリウム', period: 1, group: 18, color: '#4ECDC4' },
  { atomicNumber: 3, symbol: 'Li', name: 'リチウム', period: 2, group: 1, color: '#FF6B6B' },
  { atomicNumber: 4, symbol: 'Be', name: 'ベリリウム', period: 2, group: 2, color: '#45B7D1' },
  { atomicNumber: 5, symbol: 'B', name: 'ホウ素', period: 2, group: 13, color: '#96CEB4' },
  { atomicNumber: 6, symbol: 'C', name: '炭素', period: 2, group: 14, color: '#FFEAA7' },
  { atomicNumber: 7, symbol: 'N', name: '窒素', period: 2, group: 15, color: '#DDA0DD' },
  { atomicNumber: 8, symbol: 'O', name: '酸素', period: 2, group: 16, color: '#FFB6C1' },
  { atomicNumber: 9, symbol: 'F', name: 'フッ素', period: 2, group: 17, color: '#98FB98' },
  { atomicNumber: 10, symbol: 'Ne', name: 'ネオン', period: 2, group: 18, color: '#4ECDC4' },
  { atomicNumber: 11, symbol: 'Na', name: 'ナトリウム', period: 3, group: 1, color: '#FF6B6B' },
  { atomicNumber: 12, symbol: 'Mg', name: 'マグネシウム', period: 3, group: 2, color: '#45B7D1' },
  { atomicNumber: 13, symbol: 'Al', name: 'アルミニウム', period: 3, group: 13, color: '#96CEB4' },
  { atomicNumber: 14, symbol: 'Si', name: 'ケイ素', period: 3, group: 14, color: '#FFEAA7' },
  { atomicNumber: 15, symbol: 'P', name: 'リン', period: 3, group: 15, color: '#DDA0DD' },
  { atomicNumber: 16, symbol: 'S', name: '硫黄', period: 3, group: 16, color: '#FFB6C1' },
  { atomicNumber: 17, symbol: 'Cl', name: '塩素', period: 3, group: 17, color: '#98FB98' },
  { atomicNumber: 18, symbol: 'Ar', name: 'アルゴン', period: 3, group: 18, color: '#4ECDC4' },
  { atomicNumber: 19, symbol: 'K', name: 'カリウム', period: 4, group: 1, color: '#FF6B6B' },
  { atomicNumber: 20, symbol: 'Ca', name: 'カルシウム', period: 4, group: 2, color: '#45B7D1' },
];

export const getElementBySymbol = (symbol: string): Element | undefined => {
  return ELEMENTS.find(el => el.symbol === symbol);
};

export const getElementByAtomicNumber = (atomicNumber: number): Element | undefined => {
  return ELEMENTS.find(el => el.atomicNumber === atomicNumber);
};