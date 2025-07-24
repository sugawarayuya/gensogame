import React from 'react';
import { Card as CardType } from '../types/game';
import Card from './Card';

interface GameBoardProps {
  deckCount: number;
  topDiscard: CardType | null;
  onDrawFromDeck: () => void;
  onDrawFromDiscard: () => void;
  canDrawFromDiscard: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  deckCount,
  topDiscard,
  onDrawFromDeck,
  onDrawFromDiscard,
  canDrawFromDiscard
}) => {
  return (
    <div className="flex justify-center items-center gap-8 py-6">
      {/* Deck */}
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-600 mb-2">山札</h4>
        <div
          className="w-16 h-22 bg-blue-600 rounded-lg border-2 border-gray-700 
                     shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200
                     flex items-center justify-center font-bold text-white text-xs
                     hover:transform hover:scale-105"
          onClick={onDrawFromDeck}
        >
          <div className="text-center">
            <div className="text-lg">🧪</div>
            <div>{deckCount}</div>
          </div>
        </div>
      </div>

      {/* Discard Pile */}
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-600 mb-2">捨て札</h4>
        <div 
          className={`${canDrawFromDiscard ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
          onClick={canDrawFromDiscard ? onDrawFromDiscard : undefined}
        >
          <Card 
            card={topDiscard} 
            size="medium"
            className={canDrawFromDiscard ? 'hover:transform hover:scale-105' : ''}
          />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;