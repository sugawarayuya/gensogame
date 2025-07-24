import React from 'react';
import { HandType } from '../types/game';

interface ScoreDisplayProps {
  handTypes: HandType[];
  totalScore: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ handTypes, totalScore }) => {
  if (handTypes.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-gray-600">まだ役がありません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">現在の得点: {totalScore}点</h3>
      <div className="space-y-2">
        {handTypes.map((handType, index) => (
          <div key={index} className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-green-800">{handType.name}</h4>
                <p className="text-sm text-green-600">{handType.description}</p>
              </div>
              <div className="text-lg font-bold text-green-800">
                {handType.points}点
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreDisplay;