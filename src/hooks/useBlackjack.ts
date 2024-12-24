import { useState, useCallback } from 'react';
import { Card, Hand, Suit, Rank } from '../types/card';
import { calculateHandValue, isBust, isBlackjack } from '../utils/blackjack';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const useBlackjack = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Hand>({ cards: [], value: 0 });
  const [dealerHand, setDealerHand] = useState<Hand>({ cards: [], value: 0 });
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'gameOver'>('betting');
  const [betAmount, setBetAmount] = useState(0.1);

  const createDeck = useCallback(() => {
    const newDeck: Card[] = [];
    SUITS.forEach(suit => {
      RANKS.forEach(rank => {
        newDeck.push({ suit, rank, faceUp: true });
      });
    });
    return shuffle(newDeck);
  }, []);

  const shuffle = (cards: Card[]): Card[] => {
    const newCards = [...cards];
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }
    return newCards;
  };

  const drawCard = (faceUp: boolean = true): Card => {
    if (deck.length === 0) {
      setDeck(createDeck());
    }
    const newDeck = [...deck];
    const card = { ...newDeck.pop()!, faceUp };
    setDeck(newDeck);
    return card;
  };

  const dealNewHand = () => {
    if (deck.length < 4) {
      setDeck(createDeck());
    }

    const pCard1 = drawCard();
    const dCard1 = drawCard();
    const pCard2 = drawCard();
    const dCard2 = drawCard(false);

    const playerCards = [pCard1, pCard2];
    const dealerCards = [dCard1, dCard2];

    const newPlayerHand: Hand = {
      cards: playerCards,
      value: calculateHandValue(playerCards),
    };

    const newDealerHand: Hand = {
      cards: dealerCards,
      value: calculateHandValue(dealerCards),
    };

    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameState('playing');
  };

  const hit = () => {
    const newCard = drawCard();
    const newHand: Hand = {
      cards: [...playerHand.cards, newCard],
      value: calculateHandValue([...playerHand.cards, newCard]),
    };
    setPlayerHand(newHand);

    if (isBust(newHand)) {
      setGameState('gameOver');
    }
  };

  const stand = async () => {
    setGameState('dealerTurn');
    let currentDealerHand = { ...dealerHand };
    
    // Flip dealer's hole card
    currentDealerHand.cards[1].faceUp = true;
    currentDealerHand.value = calculateHandValue(currentDealerHand.cards);
    setDealerHand(currentDealerHand);

    // Dealer draws until 17 or higher
    while (currentDealerHand.value < 17) {
      const newCard = drawCard();
      currentDealerHand = {
        cards: [...currentDealerHand.cards, newCard],
        value: calculateHandValue([...currentDealerHand.cards, newCard]),
      };
      setDealerHand(currentDealerHand);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setGameState('gameOver');
  };

  const getGameResult = () => {
    if (isBust(playerHand)) return 'Player Bust';
    if (isBust(dealerHand)) return 'Dealer Bust - Player Wins';
    if (playerHand.value > dealerHand.value) return 'Player Wins';
    if (dealerHand.value > playerHand.value) return 'Dealer Wins';
    return 'Push';
  };

  return {
    playerHand,
    dealerHand,
    gameState,
    betAmount,
    setBetAmount,
    dealNewHand,
    hit,
    stand,
    getGameResult,
  };
};