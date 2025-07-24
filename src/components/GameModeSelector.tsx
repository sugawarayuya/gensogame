import React from 'react';
import { Bot, Users, Wifi, WifiOff } from 'lucide-react';

interface GameModeSelectorProps {
  onSelectMode: (mode: 'ai' | 'local' | 'online') => void;
  isOnlineAvailable: boolean;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  onSelectMode,
  isOnlineAvailable
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          元素記号麻雀
        </h1>
        
        <div className="space-y-4">
          {/* AI対戦 */}
          <button
            onClick={() => onSelectMode('ai')}
            className="w-full p-6 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 
                     hover:border-blue-300 rounded-lg transition-all duration-200 
                     flex items-center gap-4 group"
          >
            <Bot className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-800">AI対戦</h3>
              <p className="text-sm text-gray-600">コンピューターと対戦</p>
            </div>
          </button>

          {/* ローカル対戦 */}
          <button
            onClick={() => onSelectMode('local')}
            className="w-full p-6 bg-green-50 hover:bg-green-100 border-2 border-green-200 
                     hover:border-green-300 rounded-lg transition-all duration-200 
                     flex items-center gap-4 group"
          >
            <Users className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-800">ローカル対戦</h3>
              <p className="text-sm text-gray-600">同じデバイスで交代プレイ</p>
            </div>
          </button>

          {/* オンライン対戦 */}
          <button
            onClick={() => onSelectMode('online')}
            disabled={!isOnlineAvailable}
            className={`w-full p-6 border-2 rounded-lg transition-all duration-200 
                       flex items-center gap-4 group ${
              isOnlineAvailable
                ? 'bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-300'
                : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50'
            }`}
          >
            {isOnlineAvailable ? (
              <Wifi className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
            ) : (
              <WifiOff className="w-8 h-8 text-gray-400" />
            )}
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-800">オンライン対戦</h3>
              <p className="text-sm text-gray-600">
                {isOnlineAvailable ? 'インターネット経由で対戦' : '接続中...'}
              </p>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>ゲームモードを選択してください</p>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelector;