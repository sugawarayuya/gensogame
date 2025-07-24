import { Card, HandType, Player } from '../types/game';
import { ELEMENTS } from '../data/elements';

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  ELEMENTS.forEach(element => {
    for (let i = 0; i < 4; i++) {
      deck.push({
        id: `${element.symbol}-${i}`,
        element
      });
    }
  });
  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const sortHand = (hand: Card[]): Card[] => {
  return [...hand].sort((a, b) => a.element.atomicNumber - b.element.atomicNumber);
};

export const evaluateHand = (hand: Card[]): HandType[] => {
  const handTypes: HandType[] = [];
  
  // Count occurrences of each element
  const elementCounts = new Map<string, { element: any; cards: Card[]; count: number }>();
  hand.forEach(card => {
    const symbol = card.element.symbol;
    if (!elementCounts.has(symbol)) {
      elementCounts.set(symbol, { element: card.element, cards: [], count: 0 });
    }
    const entry = elementCounts.get(symbol)!;
    entry.cards.push(card);
    entry.count++;
  });

  const counts = Array.from(elementCounts.values());
  
  // Check for pairs, three of a kind, four of a kind
  counts.forEach(({ element, cards, count }) => {
    if (count === 4) {
      handTypes.push({
        name: 'フォーカード',
        description: `${element.symbol}を4枚`,
        points: 6,
        cards
      });
    } else if (count === 3) {
      handTypes.push({
        name: 'スリーカード',
        description: `${element.symbol}を3枚`,
        points: 3,
        cards
      });
    } else if (count === 2) {
      handTypes.push({
        name: 'ワンペア',
        description: `${element.symbol}のペア`,
        points: 1,
        cards
      });
    }
  });

  // Check for full house
  const threeKinds = counts.filter(c => c.count === 3);
  const pairs = counts.filter(c => c.count === 2);
  if (threeKinds.length === 1 && pairs.length === 1) {
    handTypes.push({
      name: 'フルハウス',
      description: `${threeKinds[0].element.symbol}のスリーカード + ${pairs[0].element.symbol}のペア`,
      points: 6,
      cards: [...threeKinds[0].cards, ...pairs[0].cards]
    });
  }

  // Check for straights
  const sortedElements = hand.map(c => c.element).sort((a, b) => a.atomicNumber - b.atomicNumber);
  const uniqueElements = Array.from(new Set(sortedElements.map(e => e.atomicNumber)));
  
  if (uniqueElements.length >= 5) {
    for (let i = 0; i <= uniqueElements.length - 5; i++) {
      let isConsecutive = true;
      for (let j = 1; j < 5; j++) {
        if (uniqueElements[i + j] !== uniqueElements[i] + j) {
          isConsecutive = false;
          break;
        }
      }
      if (isConsecutive) {
        const straighCards = hand.filter(c => 
          uniqueElements.slice(i, i + 5).includes(c.element.atomicNumber)
        );
        handTypes.push({
          name: '原子番号ストレート5',
          description: `連続する原子番号5つ: ${uniqueElements.slice(i, i + 5).join('-')}`,
          points: 6,
          cards: straighCards.slice(0, 5)
        });
        break;
      }
    }
  }

  if (uniqueElements.length >= 3) {
    for (let i = 0; i <= uniqueElements.length - 3; i++) {
      let isConsecutive = true;
      for (let j = 1; j < 3; j++) {
        if (uniqueElements[i + j] !== uniqueElements[i] + j) {
          isConsecutive = false;
          break;
        }
      }
      if (isConsecutive) {
        const straighCards = hand.filter(c => 
          uniqueElements.slice(i, i + 3).includes(c.element.atomicNumber)
        );
        handTypes.push({
          name: '原子番号ストレート3',
          description: `連続する原子番号3つ: ${uniqueElements.slice(i, i + 3).join('-')}`,
          points: 3,
          cards: straighCards.slice(0, 3)
        });
        break;
      }
    }
  }

  // Check for same period
  const periodGroups = new Map<number, Card[]>();
  hand.forEach(card => {
    const period = card.element.period;
    if (!periodGroups.has(period)) {
      periodGroups.set(period, []);
    }
    periodGroups.get(period)!.push(card);
  });

  periodGroups.forEach((cards, period) => {
    const uniqueInPeriod = new Set(cards.map(c => c.element.symbol));
    if (uniqueInPeriod.size >= 3) {
      handTypes.push({
        name: '同周期3種',
        description: `第${period}周期の異なる元素3種`,
        points: 4,
        cards: Array.from(uniqueInPeriod).slice(0, 3).map(symbol => 
          cards.find(c => c.element.symbol === symbol)!
        )
      });
    }
  });

  // Check for same group
  const groupGroups = new Map<number, Card[]>();
  hand.forEach(card => {
    const group = card.element.group;
    if (!groupGroups.has(group)) {
      groupGroups.set(group, []);
    }
    groupGroups.get(group)!.push(card);
  });

  groupGroups.forEach((cards, group) => {
    const uniqueInGroup = new Set(cards.map(c => c.element.symbol));
    if (uniqueInGroup.size >= 3) {
      handTypes.push({
        name: '同族3種',
        description: `第${group}族の異なる元素3種`,
        points: 4,
        cards: Array.from(uniqueInGroup).slice(0, 3).map(symbol => 
          cards.find(c => c.element.symbol === symbol)!
        )
      });
    }
  });

  // Check for all different elements (13 unique)
  const uniqueSymbols = new Set(hand.map(c => c.element.symbol));
  if (uniqueSymbols.size === 13) {
    handTypes.push({
      name: '全異種（13種）',
      description: '13枚すべて異なる元素',
      points: 20,
      cards: hand
    });
  }

  // Check for high atomic numbers only (10+)
  const allHighAtomic = hand.every(c => c.element.atomicNumber >= 10);
  if (allHighAtomic) {
    handTypes.push({
      name: '高原子番号のみ',
      description: '原子番号10以上の元素のみ',
      points: 20,
      cards: hand
    });
  }

  return handTypes;
};

export const getTotalScore = (handTypes: HandType[]): number => {
  return handTypes.reduce((total, ht) => total + ht.points, 0);
};

export const canWin = (hand: Card[]): boolean => {
  const handTypes = evaluateHand(hand);
  return handTypes.length > 0;
};

export const getAIMove = (player: Player, discardPile: Card[]): { drawFromDiscard: boolean; discardCard: Card } => {
  const hand = [...player.hand];
  
  // Simple AI: try to complete sets or get rid of high atomic number singletons
  const elementCounts = new Map<string, number>();
  hand.forEach(card => {
    const symbol = card.element.symbol;
    elementCounts.set(symbol, (elementCounts.get(symbol) || 0) + 1);
  });

  // Check if discard pile top card would help
  let drawFromDiscard = false;
  if (discardPile.length > 0) {
    const topDiscard = discardPile[discardPile.length - 1];
    const currentCount = elementCounts.get(topDiscard.element.symbol) || 0;
    if (currentCount >= 1) { // Would make a pair or better
      drawFromDiscard = true;
    }
  }

  // Find card to discard (prefer singletons with high atomic numbers)
  const singletons = hand.filter(card => {
    const count = elementCounts.get(card.element.symbol) || 0;
    return count === 1;
  });

  let discardCard: Card;
  if (singletons.length > 0) {
    // Discard highest atomic number singleton
    discardCard = singletons.reduce((highest, current) => 
      current.element.atomicNumber > highest.element.atomicNumber ? current : highest
    );
  } else {
    // No singletons, discard random card
    discardCard = hand[Math.floor(Math.random() * hand.length)];
  }

  return { drawFromDiscard, discardCard };
};