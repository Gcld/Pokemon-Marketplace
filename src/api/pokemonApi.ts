import axios from 'axios';
import { Pokemon } from '../models/Pokemon';
import { calculatePokemonPrice } from '../utils/priceCalculator';
import { getEvolutionChain, getTypeWeaknesses } from '../utils/pokemonUtils';
import { API_BASE_URL, DITTO_IMAGE } from '../data/pokemonData';

export const getPokemonList = async (url: string | null): Promise<any> => {
  if (!url) {
    url = `${API_BASE_URL}/pokemon?limit=20`;
  }
  const response = await axios.get(url);
  return response.data;
};

export const getPokemonDetails = async (pokemonName: string): Promise<Pokemon> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pokemon/${pokemonName}`);
    const speciesResponse = await axios.get(response.data.species.url);
    const evolutionChainResponse = await axios.get(speciesResponse.data.evolution_chain.url);
    
    const evolutionChain = getEvolutionChain(evolutionChainResponse.data.chain);
    const weaknesses = await getTypeWeaknesses(response.data.types[0]?.type.url || '');

    const pokemonDetails: Pokemon = {
      id: response.data.id,
      name: response.data.name,
      image: response.data.sprites.front_default || DITTO_IMAGE,
      price: calculatePokemonPrice(response.data, speciesResponse.data, evolutionChain),
      type: response.data.types.map((type: any) => type.type.name).join(', '),
      weaknesses,
      attacks: response.data.moves.slice(0, 4).map((move: any) => move.move.name),
      evolutions: evolutionChain,
      stats: {
        hp: response.data.stats.find((stat: any) => stat.stat.name === 'hp')?.base_stat || 0,
        attack: response.data.stats.find((stat: any) => stat.stat.name === 'attack')?.base_stat || 0,
        defense: response.data.stats.find((stat: any) => stat.stat.name === 'defense')?.base_stat || 0,
        speed: response.data.stats.find((stat: any) => stat.stat.name === 'speed')?.base_stat || 0,
      },
    };

    return pokemonDetails;
  } catch (error) {
    console.error('Error fetching Pokemon details:', error);
    return {
      id: 0,
      name: pokemonName,
      image: DITTO_IMAGE,
      price: 10,
      type: 'Unknown',
      weaknesses: [],
      attacks: [],
      evolutions: [],
      stats: { hp: 0, attack: 0, defense: 0, speed: 0 },
    };
  }
};