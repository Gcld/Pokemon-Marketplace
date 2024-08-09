import axios from 'axios';
import { ExtendedPokemon } from '@/models/extendedPokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemonList = async (url: string | null): Promise<any> => {
  if (!url) {
    url = `${API_BASE_URL}/pokemon`;
  }

  const response = await axios.get(url);
  return response.data;
};

export const getPokemonDetails = async (pokemonName: string): Promise<ExtendedPokemon> => {
  const response = await axios.get(`${API_BASE_URL}/pokemon/${pokemonName}`);
  const speciesResponse = await axios.get(response.data.species.url);
  const evolutionChainResponse = await axios.get(speciesResponse.data.evolution_chain.url);

  const pokemonDetails: ExtendedPokemon = {
    id: response.data.id,
    name: response.data.name,
    image: response.data.sprites.front_default,
    price: Math.floor(Math.random() * 100) + 10, // Random price between 10 and 109
    type: response.data.types.map((type: any) => type.type.name).join(', '),
    weaknesses: await getTypeWeaknesses(response.data.types[0].type.url),
    attacks: response.data.moves.slice(0, 4).map((move: any) => move.move.name),
    evolutions: getEvolutionChain(evolutionChainResponse.data.chain),
    stats: {
      hp: response.data.stats.find((stat: any) => stat.stat.name === 'hp').base_stat,
      attack: response.data.stats.find((stat: any) => stat.stat.name === 'attack').base_stat,
      defense: response.data.stats.find((stat: any) => stat.stat.name === 'defense').base_stat,
      speed: response.data.stats.find((stat: any) => stat.stat.name === 'speed').base_stat,
    },
  };

  return pokemonDetails;
};

const getTypeWeaknesses = async (typeUrl: string): Promise<string[]> => {
  const response = await axios.get(typeUrl);
  return response.data.damage_relations.double_damage_from.map((type: any) => type.name);
};

const getEvolutionChain = (chain: any): string[] => {
  const evolutions: string[] = [chain.species.name];
  let currentChain = chain.evolves_to[0];

  while (currentChain) {
    evolutions.push(currentChain.species.name);
    currentChain = currentChain.evolves_to[0];
  }

  return evolutions;
};