import axios from 'axios';
import { Pokemon } from '@/models/pokemon';

export const getTypeWeaknesses = async (typeUrl: string): Promise<string[]> => {
  if (!typeUrl) return [];
  try {
    const response = await axios.get(typeUrl);
    return response.data.damage_relations.double_damage_from.map((type: any) => type.name);
  } catch (error) {
    console.error('Error fetching type weaknesses:', error);
    return [];
  }
};

export const getEvolutionChain = (chain: any): string[] => {
  const evolutions: string[] = [chain.species.name];
  let currentChain = chain.evolves_to[0];

  while (currentChain) {
    evolutions.push(currentChain.species.name);
    currentChain = currentChain.evolves_to[0];
  }

  return evolutions;
};

export const isMegaEvolution = (pokemonName: string): boolean => {
    return pokemonName.toLowerCase().endsWith('-mega');
  };
  
  export const getBasePokemonName = (megaPokemonName: string): string => {
    return megaPokemonName.toLowerCase().replace('-mega', '');
  };
  
  export const adjustPokemonPrice = (pokemon: Pokemon, allPokemon: Pokemon[]): number => {
    if (!isMegaEvolution(pokemon.name)) {
      return pokemon.price;
    }
  
    const basePokemonName = getBasePokemonName(pokemon.name);
    const basePokemon = allPokemon.find(p => p.name.toLowerCase() === basePokemonName);
  
    if (basePokemon) {
      return Math.max(basePokemon.price * 1.5, pokemon.price);
    }
  
    return pokemon.price;
  };