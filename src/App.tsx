import React, { useEffect, useState } from 'react';
import { useGame } from './hooks/useGame';
import { Player } from './types/game';
import { socketService } from './services/socketService';
import Hand from './components/Hand';
import GameBoard from './components/GameBoard';
import ScoreDisplay from './components/ScoreDisplay';
import GameModeSelector from './components/GameModeSelector';
import RoomLobby from './components/RoomLobby';
import LocalGameSetup from './components/LocalGameSetup';
import { Atom, Trophy, RotateCcw, ArrowLeft } from 'lucide-react';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'mode-select' | 'local-setup' | 'online-lobby' | 'game'>('mode-select');
  const [gameMode, setGameMode] = useState<'ai' | 'local' | 'online'>('ai');
  const [isOnlineAvailable, setIsOnlineAvailable] = useState(false);
  const [gamePlayers, setGamePlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [roomId, setRoomId] = useState<string>('');

  const {
    gameState,
    selectedCardIndex,
    hasDrawnThisTurn,
    isHumanTurn,
    currentPlayer,
    drawCard,
    handleCardClick,
    executeAITurn,
    newGame,
    evaluateCurrentHand,
    getCurrentScore,
    gameMode: currentGameMode
  } = useGame(gameMode, gamePlayers);

  const humanPlayer = gameState.players.find(p => p.isHuman)!;
  const aiPlayer = gameState.players.find(p => !p.isHuman);
  const handTypes = evaluateCurrentHand();
  const currentScore = getCurrentScore();

  // Check online availability on mount
  useEffect(() => {
    const checkOnlineAvailability = async () => {
      try {
        await socketService.connect();
        setIsOnlineAvailable(true);
      } catch (error) {
        console.error('オンライン接続に失敗:', error);
        setIsOnlineAvailable(false);
      }
    };
    
    checkOnlineAvailability();
    
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Execute AI turn when it's AI's turn
  useEffect(() => {
    if (currentGameMode === 'ai' && !isHumanTurn && gameState.phase === 'playing') {
      executeAITurn();
    }
  }, [currentGameMode, isHumanTurn, gameState.phase, executeAITurn]);

  const handleModeSelect = (mode: 'ai' | 'local' | 'online') => {
    setGameMode(mode);
    if (mode === 'ai') {
      setCurrentScreen('game');
    } else if (mode === 'local') {
      setCurrentScreen('local-setup');
    } else if (mode === 'online') {
      setCurrentScreen('online-lobby');
    }
  };

  const handleLocalGameStart = (players: Player[]) => {
    setGamePlayers(players);
    setCurrentScreen('game');
  };

  const handleOnlineGameStart = (roomId: string, players: Player[]) => {
    setRoomId(roomId);
    setGamePlayers(players);
    setCurrentScreen('game');
  };

  const handleBackToModeSelect = () => {
    setCurrentScreen('mode-select');
    setGamePlayers([]);
    setRoomId('');
  };

  const getCurrentPlayerForDisplay = () => {
    if (currentGameMode === 'local') {
      return gameState.players[gameState.currentPlayerIndex];
    }
    return humanPlayer;
  };

  const getDisplayTitle = () => {
    if (currentGameMode === 'local') {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      return `${currentPlayer.name}のターン`;
    } else if (currentGameMode === 'online') {
      return `オンライン対戦 - ルーム: ${roomId}`;
    }
    return isHumanTurn ? 'あなたの番' : 'AIの番';
  };

  if (currentScreen === 'mode-select') {
    return (
      <GameModeSelector
        onSelectMode={handleModeSelect}
        isOnlineAvailable={isOnlineAvailable}
      />
    );
  }

  if (currentScreen === 'local-setup') {
    return (
      <LocalGameSetup
        onBackToModeSelect={handleBackToModeSelect}
        onStartGame={handleLocalGameStart}
      />
    );
  }

  if (currentScreen === 'online-lobby') {
    return (
      <RoomLobby
        onBackToModeSelect={handleBackToModeSelect}
        onStartGame={handleOnlineGameStart}
        currentPlayer={{
          id: 'current-user',
          name: 'あなた',
          hand: [],
          isHuman: true,
          score: 0
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Atom className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">元素記号麻雀</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {gameState.turn}ターン目 • {getDisplayTitle()}
              </div>
              <button
                onClick={handleBackToModeSelect}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg
                         hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                メニュー
              </button>
              <button
                onClick={newGame}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
                         hover:bg-blue-700 transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                新しいゲーム
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Game Status */}
        <div className="text-center mb-6">
          {gameState.phase === 'ended' && (
            <div className="bg-green-100 border border-green-400 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center gap-2 text-green-800">
                <Trophy className="w-6 h-6" />
                <span className="text-xl font-bold">
                  {gameState.players.find(p => p.id === gameState.winner)?.name || 'プレイヤー'}の勝ち！
                </span>
              </div>
              <p className="mt-2 text-green-700">
                最終得点: {gameState.players.find(p => p.id === gameState.winner)?.score || 0}点
              </p>
            </div>
          )}
        </div>

        {/* Other Players' Hands */}
        {currentGameMode !== 'local' && (
          <div className="mb-8 space-y-4">
            {gameState.players
              .filter(player => player.id !== (currentGameMode === 'ai' ? 'human' : getCurrentPlayerForDisplay().id))
              .map(player => (
                <Hand
                  key={player.id}
                  cards={player.hand}
                  title={`${player.name} (得点: ${player.score})`}
                  isOpponent={true}
                />
              ))}
          </div>
        )}

        {/* Game Board */}
        <GameBoard
          deckCount={gameState.deck.length}
          topDiscard={gameState.discardPile[gameState.discardPile.length - 1] || null}
          onDrawFromDeck={() => drawCard(false)}
          onDrawFromDiscard={() => drawCard(true)}
          canDrawFromDiscard={
            (currentGameMode === 'local' || isHumanTurn) && 
            !hasDrawnThisTurn && 
            gameState.discardPile.length > 0
            gameState.phase === 'playing'
          }
        />

        {/* Player Instructions */}
        <div className="text-center mb-6">
          {gameState.phase === 'playing' && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              {(currentGameMode === 'local' || isHumanTurn) ? (
                hasDrawnThisTurn ? (
                  <p className="text-lg text-gray-700">
                    捨てるカードを選んでください（手札{getCurrentPlayerForDisplay().hand.length}枚）
                  </p>
                ) : (
                  <p className="text-lg text-gray-700">
                    {gameState.deck.length > 0 ? '山札' : ''}
                    {gameState.deck.length > 0 && gameState.discardPile.length > 0 ? 'または' : ''}
                    {gameState.discardPile.length > 0 ? '捨て札' : ''}
                    からカードを引いてください
                  </p>
                )
              ) : currentGameMode === 'ai' ? (
                <p className="text-lg text-gray-700">
                  AIが考え中...
                </p>
              ) : (
                <p className="text-lg text-gray-700">
                  他のプレイヤーのターンです...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Human Hand */}
        <div className="mb-8">
          <Hand
            cards={getCurrentPlayerForDisplay().hand}
            onCardClick={handleCardClick}
            selectedCardIndex={selectedCardIndex}
            title={`${getCurrentPlayerForDisplay().name} (得点: ${getCurrentPlayerForDisplay().score})`}
          />
        </div>

        {/* Score Display */}
        <div className="max-w-2xl mx-auto">
          <ScoreDisplay handTypes={handTypes} totalScore={currentScore} />
        </div>

        {/* All Players Scores (for local mode) */}
        {currentGameMode === 'local' && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">全プレイヤーの得点</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gameState.players.map((player, index) => (
                <div
                  key={player.id}
                  className={`p-3 rounded-lg border-2 ${
                    index === gameState.currentPlayerIndex
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-800">{player.name}</div>
                  <div className="text-lg font-bold text-blue-600">{player.score}点</div>
                  {index === gameState.currentPlayerIndex && (
                    <div className="text-xs text-blue-600 mt-1">現在のターン</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Rules */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">遊び方</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">基本ルール</h4>
              <ul className="space-y-1">
                <li>• 毎ターン1枚引いて1枚捨てる</li>
                <li>• 手札は常に13枚を維持</li>
                <li>• 6点以上の役を最初に作った人がラウンド勝利</li>
                {currentGameMode === 'local' && (
                  <li>• ローカル対戦：プレイヤーが交代でプレイ</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">役と得点</h4>
              <ul className="space-y-1">
                <li>• ワンペア（同じ元素2枚）: 1点</li>
                <li>• スリーカード: 3点</li>
                <li>• フォーカード: 6点</li>
                <li>• 原子番号ストレート3: 3点</li>
                <li>• 同周期・同族3種: 4点</li>
                <li>• フルハウス: 6点</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;