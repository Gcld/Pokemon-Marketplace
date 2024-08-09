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

const semiLegendaryPokemon = [
  'dragonite', 'tyranitar', 'salamence', 'metagross', 'garchomp',
  'hydreigon', 'goodra', 'kommo-o', 'dragapult', 'gyarados'
];

const calculatePokemonPrice = (
  pokemonData: any,
  speciesData: any,
  evolutionChain: string[]
): number => {
  let basePrice = 10; // Preço base (Pikachu)

  // Fator para Pokémon iniciais (assumindo que eles têm 3 evoluções)
  if (evolutionChain.length === 3) {
    const evolutionIndex = evolutionChain.indexOf(pokemonData.name);
    switch (evolutionIndex) {
      case 0: // Forma básica
        basePrice *= 2;
        break;
      case 1: // Primeira evolução
        basePrice *= 3;
        break;
      case 2: // Segunda evolução
        basePrice *= 4;
        break;
    }
  } else {
    // Para Pokémon com menos de 3 evoluções
    const evolutionIndex = evolutionChain.indexOf(pokemonData.name);
    basePrice *= (1 + evolutionIndex * 0.5);
  }

  // Fator para Pokémon lendários
  if (speciesData.is_legendary) {
    basePrice *= 10;
  }

  // Fator para Pokémon semi-lendários
  if (semiLegendaryPokemon.includes(pokemonData.name.toLowerCase())) {
    basePrice *= 5;
  }

  // Ajuste baseado nas estatísticas do Pokémon
  const totalStats = pokemonData.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0);
  basePrice *= (1 + totalStats / 600); // 600 é uma estimativa de estatísticas totais altas

  // Casos especiais
  if (pokemonData.name.toLowerCase() === 'magikarp') {
    return 1; // Magikarp sempre custa 1 Pokédollar
  }

  // Arredonda para o inteiro mais próximo
  return Math.round(basePrice);
};

export const getPokemonDetails = async (pokemonName: string): Promise<ExtendedPokemon> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pokemon/${pokemonName}`);
    
    if (!response.data || !response.data.species || !response.data.species.url) {
      throw new Error('Invalid Pokemon data structure');
    }

    const speciesResponse = await axios.get(response.data.species.url);
    
    if (!speciesResponse.data || !speciesResponse.data.evolution_chain || !speciesResponse.data.evolution_chain.url) {
      throw new Error('Invalid species data structure');
    }

    const evolutionChainResponse = await axios.get(speciesResponse.data.evolution_chain.url);
    
    if (!evolutionChainResponse.data || !evolutionChainResponse.data.chain) {
      throw new Error('Invalid evolution chain data structure');
    }

    const evolutionChain = getEvolutionChain(evolutionChainResponse.data.chain);

    const pokemonDetails: ExtendedPokemon = {
      id: response.data.id,
      name: response.data.name,
      image: response.data.sprites.front_default || '',
      price: calculatePokemonPrice(response.data, speciesResponse.data, evolutionChain),
      type: response.data.types.map((type: any) => type.type.name).join(', '),
      weaknesses: await getTypeWeaknesses(response.data.types[0]?.type.url || ''),
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
    // Retorna um objeto Pokemon com valores padrão em caso de erro
    return {
      id: 0,
      name: pokemonName,
      image: '',
      price: 10,
      type: 'Unknown',
      weaknesses: [],
      attacks: [],
      evolutions: [],
      stats: { hp: 0, attack: 0, defense: 0, speed: 0 },
    };
  }
};

const getTypeWeaknesses = async (typeUrl: string): Promise<string[]> => {
  if (!typeUrl) return [];
  try {
    const response = await axios.get(typeUrl);
    return response.data.damage_relations.double_damage_from.map((type: any) => type.name);
  } catch (error) {
    console.error('Error fetching type weaknesses:', error);
    return [];
  }
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