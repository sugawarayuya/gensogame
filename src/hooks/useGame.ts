import { useState, useCallback } from 'react';
import { GameState, Player, Card } from '../types/game';
import { createDeck, sortHand, evaluateHand, getTotalScore, canWin, getAIMove } from '../utils/gameLogic';
import { v4 as uuidv4 } from 'uuid';

export const useGame = (gameMode: 'ai' | 'local' | 'online' = 'ai', initialPlayers?: Player[]) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const deck = createDeck();
    
    let players: Player[];
    if (initialPlayers && initialPlayers.length > 0) {
      players = initialPlayers.map((player, index) => ({
        ...player,
        hand: sortHand(deck.slice(index * 13, (index + 1) * 13)),
        score: player.score || 0
      }));
    } else if (gameMode === 'ai') {
      players = [
        {
          id: 'human',
          name: 'あなた',
          hand: sortHand(deck.slice(0, 13)),
          isHuman: true,
          score: 0
        },
        {
          id: 'ai',
          name: 'AI対戦相手',
          hand: sortHand(deck.slice(13, 26)),
          isHuman: false,
          score: 0
        }
      ];
    } else {
      // Default fallback
      players = [
        {
          id: uuidv4(),
          name: 'プレイヤー1',
          hand: sortHand(deck.slice(0, 13)),
          isHuman: true,
          score: 0
        }
      ];
    }

    const remainingDeck = deck.slice(players.length * 13);
    const discardPile = [remainingDeck.pop()!];

    return {
      players,
      currentPlayerIndex: 0,
      deck: remainingDeck,
      discardPile,
      phase: 'playing',
      winner: null,
      turn: 1,
      gameMode
    };
  });

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [hasDrawnThisTurn, setHasDrawnThisTurn] = useState(false);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isHumanTurn = currentPlayer.isHuman || gameState.gameMode === 'local';

  const drawCard = useCallback((fromDiscard: boolean = false) => {
    if (hasDrawnThisTurn || gameState.phase !== 'playing') return;

    setGameState(prevState => {
      const newState = { ...prevState };
      const player = newState.players[newState.currentPlayerIndex];
      
      let newCard: Card;
      if (fromDiscard && newState.discardPile.length > 0) {
        newCard = newState.discardPile.pop()!;
      } else if (newState.deck.length > 0) {
        newCard = newState.deck.pop()!;
      } else {
        return prevState; // Can't draw
      }

      player.hand.push(newCard);
      player.hand = sortHand(player.hand);
      
      return newState;
    });

    setHasDrawnThisTurn(true);
  }, [hasDrawnThisTurn, gameState.phase]);

  const discardCard = useCallback((cardIndex: number) => {
    if (!hasDrawnThisTurn || gameState.phase !== 'playing') return;

    setGameState(prevState => {
      const newState = { ...prevState };
      const player = newState.players[newState.currentPlayerIndex];
      
      const discardedCard = player.hand.splice(cardIndex, 1)[0];
      newState.discardPile.push(discardedCard);
      
      // Check for win condition
      const handTypes = evaluateHand(player.hand);
      if (canWin(player.hand) && getTotalScore(handTypes) >= 6) {
        newState.phase = 'ended';
        newState.winner = player.id;
        player.score += getTotalScore(handTypes);
      } else {
        // Next player's turn
        newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
        if (newState.currentPlayerIndex === 0) {
          newState.turn++;
        }
      }
      
      return newState;
    });

    setSelectedCardIndex(null);
    setHasDrawnThisTurn(false);
  }, [hasDrawnThisTurn, gameState.phase]);

  const handleCardClick = useCallback((cardIndex: number) => {
    if (!isHumanTurn) return;

    if (hasDrawnThisTurn) {
      // Discard the card
      discardCard(cardIndex);
    } else {
      // Select the card
      setSelectedCardIndex(cardIndex === selectedCardIndex ? null : cardIndex);
    }
  }, [isHumanTurn, hasDrawnThisTurn, selectedCardIndex, discardCard]);

  const executeAITurn = useCallback(() => {
    if (gameState.gameMode !== 'ai' || isHumanTurn || gameState.phase !== 'playing') return;

    setTimeout(() => {
      const aiPlayer = gameState.players[gameState.currentPlayerIndex];
      const { drawFromDiscard, discardCard: cardToDiscard } = getAIMove(aiPlayer, gameState.discardPile);
      
      // AI draws a card
      drawCard(drawFromDiscard);
      
      setTimeout(() => {
        // AI discards a card
        const cardIndex = aiPlayer.hand.findIndex(c => c.id === cardToDiscard.id);
        if (cardIndex >= 0) {
          discardCard(cardIndex);
        }
      }, 1000);
    }, 1000);
  }, [isHumanTurn, gameState, drawCard, discardCard]);

  const newGame = useCallback((newPlayers?: Player[]) => {
    const deck = createDeck();
    
    let players: Player[];
    if (newPlayers) {
      players = newPlayers.map((player, index) => ({
        ...player,
        hand: sortHand(deck.slice(index * 13, (index + 1) * 13))
      }));
    } else {
      players = gameState.players.map((player, index) => ({
        ...player,
        hand: sortHand(deck.slice(index * 13, (index + 1) * 13))
      }));
    }

    const remainingDeck = deck.slice(players.length * 13);
    const discardPile = [remainingDeck.pop()!];

    setGameState({
      players,
      currentPlayerIndex: 0,
      deck: remainingDeck,
      discardPile,
      phase: 'playing',
      winner: null,
      turn: 1,
      gameMode: gameState.gameMode
    });

    setSelectedCardIndex(null);
    setHasDrawnThisTurn(false);
  }, [gameState.players, gameState.gameMode]);

  return {
    gameState,
    selectedCardIndex,
    hasDrawnThisTurn,
    isHumanTurn,
    currentPlayer,
    drawCard,
    discardCard,
    handleCardClick,
    executeAITurn,
    newGame,
    evaluateCurrentHand: () => evaluateHand(currentPlayer.hand),
    getCurrentScore: () => getTotalScore(evaluateHand(currentPlayer.hand)),
    gameMode: gameState.gameMode
  };
};