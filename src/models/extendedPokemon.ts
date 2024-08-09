export interface ExtendedPokemon {
    id: number;
    name: string;
    image: string;
    price: number;
    type: string;
    weaknesses: string[];
    attacks: string[];
    evolutions: string[];
    stats: {
      hp: number;
      attack: number;
      defense: number;
      speed: number;
    };
  }