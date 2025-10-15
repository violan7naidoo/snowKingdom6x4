// Define all possible symbols
export type SymbolId = 
  | 'WILD'
  | 'SCATTER'
  | 'CROWN'
  | 'DRAGON'
  | 'LEOPARD'
  | 'QUEEN'
  | 'STONE'
  | 'WOLF'
  | 'ACE'
  | 'JACK'
  | 'QUEEN_CARD'
  | 'KING'
  | 'TEN';

interface SymbolConfig {
  id: SymbolId;
  name: string;
  payout: { [key: number]: number };
  image: string; // Path to the image
}

export const SYMBOLS: Record<SymbolId, SymbolConfig> = {
  WILD: { 
    id: 'WILD', 
    name: 'Wild', 
    payout: { 2: 5, 3: 20, 4: 100, 5: 500, 6: 2000 },
    image: '/images/symbols/Wild.png' 
  },
  SCATTER: { 
    id: 'SCATTER', 
    name: 'Scatter', 
    payout: { 3: 5, 4: 30, 5: 150, 6: 1000 },
    image: '/images/symbols/Scatter.png' 
  },
  CROWN: { 
    id: 'CROWN', 
    name: 'Crown', 
    payout: { 3: 1.5, 4: 15, 5: 75, 6: 300 },
    image: '/images/symbols/Crown.png' 
  },
  DRAGON: { 
    id: 'DRAGON', 
    name: 'Dragon', 
    payout: { 3: 1.2, 4: 12, 5: 60, 6: 250 },
    image: '/images/symbols/Dragon.png' 
  },
  LEOPARD: { 
    id: 'LEOPARD', 
    name: 'Leopard', 
    payout: { 3: 1, 4: 10, 5: 50, 6: 200 },
    image: '/images/symbols/Leopard.png' 
  },
  QUEEN: { 
    id: 'QUEEN', 
    name: 'Queen', 
    payout: { 3: 0.8, 4: 8, 5: 40, 6: 150 },
    image: '/images/symbols/Queen.png' 
  },
  STONE: { 
    id: 'STONE', 
    name: 'Stone', 
    payout: { 3: 0.6, 4: 6, 5: 30, 6: 120 },
    image: '/images/symbols/Stone.png' 
  },
  WOLF: { 
    id: 'WOLF', 
    name: 'Wolf', 
    payout: { 3: 0.5, 4: 5, 5: 25, 6: 100 },
    image: '/images/symbols/Wolf.png' 
  },
  ACE: { 
    id: 'ACE', 
    name: 'Ace', 
    payout: { 3: 0.4, 4: 4, 5: 20, 6: 80 },
    image: '/images/symbols/A.png' 
  },
  JACK: { 
    id: 'JACK', 
    name: 'Jack', 
    payout: { 3: 0.3, 4: 3, 5: 15, 6: 60 },
    image: '/images/symbols/J.png' 
  },
  QUEEN_CARD: { 
    id: 'QUEEN_CARD', 
    name: 'Queen Card', 
    payout: { 3: 0.2, 4: 2, 5: 10, 6: 40 },
    image: '/images/symbols/Q.png' 
  },
  KING: { 
    id: 'KING', 
    name: 'King', 
    payout: { 3: 0.1, 4: 1, 5: 5, 6: 20 },
    image: '/images/symbols/K.png' 
  },
  TEN: { 
    id: 'TEN', 
    name: 'Ten', 
    payout: { 3: 0.05, 4: 0.5, 5: 2.5, 6: 10 },
    image: '/images/symbols/10.png' 
  },
};

// Reel strips configuration
export const REEL_STRIPS: SymbolId[][] = [
  // Reel 1
  ['WILD', 'TEN', 'KING', 'QUEEN_CARD', 'JACK', 'ACE', 'WOLF', 'STONE', 'QUEEN', 'LEOPARD', 'DRAGON', 'CROWN', 'SCATTER'],
  // Reel 2
  ['TEN', 'KING', 'QUEEN_CARD', 'JACK', 'ACE', 'WOLF', 'STONE', 'QUEEN', 'LEOPARD', 'DRAGON', 'CROWN', 'SCATTER', 'WILD'],
  // Reel 3
  ['KING', 'QUEEN_CARD', 'JACK', 'ACE', 'WOLF', 'STONE', 'QUEEN', 'LEOPARD', 'DRAGON', 'CROWN', 'SCATTER', 'WILD', 'TEN'],
  // Reel 4
  ['QUEEN_CARD', 'JACK', 'ACE', 'WOLF', 'STONE', 'QUEEN', 'LEOPARD', 'DRAGON', 'CROWN', 'SCATTER', 'WILD', 'TEN', 'KING'],
  // Reel 5
  ['JACK', 'ACE', 'WOLF', 'STONE', 'QUEEN', 'LEOPARD', 'DRAGON', 'CROWN', 'SCATTER', 'WILD', 'TEN', 'KING', 'QUEEN_CARD'],
  // Reel 6
  ['ACE', 'WOLF', 'STONE', 'QUEEN', 'LEOPARD', 'DRAGON', 'CROWN', 'SCATTER', 'WILD', 'TEN', 'KING', 'QUEEN_CARD', 'JACK'],
];

export const SCATTER_SYMBOL: SymbolId = 'SCATTER';
