import React from 'react';
import { Card as CardType } from '../types/game';
import Card from './Card';

interface HandProps {
  cards: CardType[];
  onCardClick?: (cardIndex: number) => void;
  selectedCardIndex?: number;
  title?: string;
  isOpponent?: boolean;
}

const Hand: React.FC<HandProps> = ({
  cards,
  onCardClick,
  selectedCardIndex,
  title,
  isOpponent = false
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
      )}
      <div className="flex flex-wrap gap-2 justify-center">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={isOpponent ? null : card}
            isSelectable={!isOpponent && !!onCardClick}
            isSelected={selectedCardIndex === index}
            onClick={() => !isOpponent && onCardClick?.(index)}
            size="medium"
          />
        ))}
      </div>
    </div>
  );
};

export default Hand;