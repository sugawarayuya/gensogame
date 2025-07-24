import React from 'react';
import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType | null;
  isSelectable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Card: React.FC<CardProps> = ({
  card,
  isSelectable = false,
  isSelected = false,
  onClick,
  size = 'medium',
  className = ''
}) => {
  if (!card) {
    return (
      <div className={`
        border-2 border-dashed border-gray-300 rounded-lg
        flex items-center justify-center bg-gray-50
        ${size === 'small' ? 'w-12 h-16' : size === 'large' ? 'w-20 h-28' : 'w-16 h-22'}
        ${className}
      `}>
        <span className="text-gray-400 text-xs">空</span>
      </div>
    );
  }

  const sizeClasses = {
    small: 'w-12 h-16 text-xs',
    medium: 'w-16 h-22 text-sm',
    large: 'w-20 h-28 text-base'
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-lg border-2 shadow-md cursor-pointer transition-all duration-200
        flex flex-col items-center justify-center font-bold
        ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-50 transform -translate-y-2' : ''}
        ${isSelectable ? 'hover:shadow-lg hover:transform hover:-translate-y-1' : ''}
        ${className}
      `}
      style={{ 
        backgroundColor: card.element.color,
        borderColor: isSelected ? '#3B82F6' : '#374151',
        color: '#1F2937'
      }}
      onClick={onClick}
    >
      <div className="text-center">
        <div className="font-black text-lg leading-none">{card.element.symbol}</div>
        <div className="text-xs opacity-80 leading-none mt-1">{card.element.atomicNumber}</div>
        <div className="text-xs opacity-70 leading-none">{card.element.name}</div>
      </div>
    </div>
  );
};

export default Card;