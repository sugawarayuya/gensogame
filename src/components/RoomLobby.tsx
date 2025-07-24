import React, { useState, useEffect } from 'react';
import { GameRoom, Player } from '../types/game';
import { socketService } from '../services/socketService';
import { Users, Lock, Play, ArrowLeft, Plus } from 'lucide-react';

interface RoomLobbyProps {
  onBackToModeSelect: () => void;
  onStartGame: (roomId: string, players: Player[]) => void;
  currentPlayer: Player;
}

const RoomLobby: React.FC<RoomLobbyProps> = ({
  onBackToModeSelect,
  onStartGame,
  currentPlayer
}) => {
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const roomList = await socketService.getRooms();
      setRooms(roomList);
    } catch (error) {
      console.error('ルーム一覧の取得に失敗:', error);
    }
  };

  const createRoom = async () => {
    if (!newRoomName.trim()) return;
    
    setLoading(true);
    try {
      const room = await socketService.createRoom(newRoomName, maxPlayers, isPrivate);
      const updatedRoom = await socketService.joinRoom(room.id, currentPlayer);
      setCurrentRoom(updatedRoom);
      setShowCreateRoom(false);
      setNewRoomName('');
    } catch (error) {
      console.error('ルーム作成に失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (roomId: string) => {
    setLoading(true);
    try {
      const room = await socketService.joinRoom(roomId, currentPlayer);
      setCurrentRoom(room);
    } catch (error) {
      console.error('ルーム参加に失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const leaveRoom = async () => {
    if (!currentRoom) return;
    
    try {
      await socketService.leaveRoom(currentRoom.id);
      setCurrentRoom(null);
      loadRooms();
    } catch (error) {
      console.error('ルーム退出に失敗:', error);
    }
  };

  const startGame = () => {
    if (!currentRoom) return;
    onStartGame(currentRoom.id, currentRoom.players);
  };

  if (currentRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{currentRoom.name}</h2>
            <button
              onClick={leaveRoom}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              参加者 ({currentRoom.players.length}/{currentRoom.maxPlayers})
            </h3>
            <div className="space-y-2">
              {currentRoom.players.map((player, index) => (
                <div key={player.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium">{player.name}</span>
                  {index === 0 && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      ホスト
                    </span>
                  )}
                </div>
              ))}
              
              {Array.from({ length: currentRoom.maxPlayers - currentRoom.players.length }).map((_, index) => (
                <div key={`empty-${index}`} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg opacity-50">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-gray-500">待機中...</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={startGame}
              disabled={currentRoom.players.length < 2}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 
                       text-white font-semibold py-3 px-6 rounded-lg transition-colors
                       flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              ゲーム開始
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center mt-4">
            最低2人でゲームを開始できます
          </p>
        </div>
      </div>
    );
  }

  if (showCreateRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">ルーム作成</h2>
            <button
              onClick={() => setShowCreateRoom(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ルーム名
              </label>
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ルーム名を入力"
                maxLength={30}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大人数
              </label>
              <select
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={2}>2人</option>
                <option value={3}>3人</option>
                <option value={4}>4人</option>
                <option value={5}>5人</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="private" className="text-sm text-gray-700">
                プライベートルーム
              </label>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setShowCreateRoom(false)}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={createRoom}
              disabled={!newRoomName.trim() || loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 
                       text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? '作成中...' : '作成'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">オンライン対戦ロビー</h2>
          <button
            onClick={onBackToModeSelect}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowCreateRoom(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg 
                     transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            ルーム作成
          </button>
          <button
            onClick={loadRooms}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            更新
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-700">利用可能なルーム</h3>
          {rooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>利用可能なルームがありません</p>
              <p className="text-sm">新しいルームを作成してください</p>
            </div>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {room.isPrivate && <Lock className="w-4 h-4 text-gray-500" />}
                      <h4 className="font-semibold text-gray-800">{room.name}</h4>
                    </div>
                    <span className="text-sm text-gray-500">
                      {room.players.length}/{room.maxPlayers}人
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      room.status === 'waiting' ? 'bg-green-100 text-green-800' :
                      room.status === 'playing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {room.status === 'waiting' ? '待機中' :
                       room.status === 'playing' ? 'プレイ中' : '終了'}
                    </span>
                  </div>
                  <button
                    onClick={() => joinRoom(room.id)}
                    disabled={room.players.length >= room.maxPlayers || room.status !== 'waiting' || loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 
                             text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {loading ? '参加中...' : '参加'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomLobby;