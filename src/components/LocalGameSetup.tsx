import React, { useState } from 'react';
import { Player } from '../types/game';
import { ArrowLeft, Plus, Trash2, Users } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface LocalGameSetupProps {
  onBackToModeSelect: () => void;
  onStartGame: (players: Player[]) => void;
}

const LocalGameSetup: React.FC<LocalGameSetupProps> = ({
  onBackToModeSelect,
  onStartGame
}) => {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: uuidv4(),
      name: 'プレイヤー1',
      hand: [],
      isHuman: true,
      score: 0
    },
    {
      id: uuidv4(),
      name: 'プレイヤー2',
      hand: [],
      isHuman: true,
      score: 0
    }
  ]);

  const addPlayer = () => {
    if (players.length < 5) {
      setPlayers([...players, {
        id: uuidv4(),
        name: `プレイヤー${players.length + 1}`,
        hand: [],
        isHuman: true,
        score: 0
      }]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].name = name;
    setPlayers(updatedPlayers);
  };

  const startGame = () => {
    onStartGame(players);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">ローカル対戦設定</h2>
          <button
            onClick={onBackToModeSelect}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <Users className="w-5 h-5" />
            プレイヤー設定 ({players.length}人)
          </h3>
          
          <div className="space-y-3">
            {players.map((player, index) => (
              <div key={player.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`プレイヤー${index + 1}の名前`}
                  maxLength={20}
                />
                {players.length > 2 && (
                  <button
                    onClick={() => removePlayer(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {players.length < 5 && (
            <button
              onClick={addPlayer}
              className="mt-4 w-full p-3 border-2 border-dashed border-gray-300 rounded-lg 
                       text-gray-600 hover:border-blue-300 hover:text-blue-600 
                       transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              プレイヤーを追加 (最大5人)
            </button>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-2">ローカル対戦について</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 同じデバイスでプレイヤーが交代でプレイします</li>
            <li>• 各プレイヤーのターンが来たら、デバイスを渡してください</li>
            <li>• 他のプレイヤーの手札は表示されません</li>
            <li>• 2〜5人まで対応しています</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onBackToModeSelect}
            className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            戻る
          </button>
          <button
            onClick={startGame}
            disabled={players.length < 2 || players.some(p => !p.name.trim())}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 
                     text-white font-semibold py-3 px-6 rounded-lg transition-colors
                     flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            ゲーム開始
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalGameSetup;