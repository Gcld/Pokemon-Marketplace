import axios from 'axios';
import { ExtendedPokemon } from '@/models/extendedPokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';
const DITTO_IMAGE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png';

export const getPokemonList = async (url: string | null): Promise<any> => {
  if (!url) {
    url = `${API_BASE_URL}/pokemon`;
  }

  const response = await axios.get(url);
  return response.data;
};

const legendaryPokemon = [
  'articuno', 'zapdos', 'moltres', 'mewtwo', 'mew',
  'raikou', 'entei', 'suicune', 'lugia', 'ho-oh', 'celebi',
  'regirock', 'regice', 'registeel', 'latias', 'latios', 'kyogre', 'groudon', 'rayquaza', 'jirachi', 'deoxys',
  'uxie', 'mesprit', 'azelf', 'dialga', 'palkia', 'heatran', 'regigigas', 'giratina', 'cresselia', 'phione', 'manaphy', 'darkrai', 'shaymin', 'arceus',
  'victini', 'cobalion', 'terrakion', 'virizion', 'tornadus', 'thundurus', 'reshiram', 'zekrom', 'landorus', 'kyurem', 'keldeo', 'meloetta', 'genesect',
  'xerneas', 'yveltal', 'zygarde', 'diancie', 'hoopa', 'volcanion',
  'type-null', 'silvally', 'tapu-koko', 'tapu-lele', 'tapu-bulu', 'tapu-fini', 'cosmog', 'cosmoem', 'solgaleo', 'lunala', 'nihilego', 'buzzwole', 'pheromosa', 'xurkitree', 'celesteela', 'kartana', 'guzzlord', 'necrozma', 'magearna', 'marshadow', 'poipole', 'naganadel', 'stakataka', 'blacephalon', 'zeraora', 'meltan', 'melmetal',
  'zacian', 'zamazenta', 'eternatus', 'kubfu', 'urshifu', 'regieleki', 'regidrago', 'glastrier', 'spectrier', 'calyrex'
];

const semiLegendaryPokemon = [
  'dragonite', 'tyranitar', 'salamence', 'metagross', 'garchomp',
  'hydreigon', 'goodra', 'kommo-o', 'dragapult', 'gyarados', 'lapras'
];

const specialEvolutions = {
  'eevee': ['vaporeon', 'jolteon', 'flareon', 'espeon', 'umbreon', 'leafeon', 'glaceon', 'sylveon'],
  'tyrogue': ['hitmonlee', 'hitmonchan', 'hitmontop'],
  'wurmple': ['silcoon', 'beautifly', 'cascoon', 'dustox'],
  'poliwag': ['poliwhirl', 'poliwrath', 'politoed'],
  'slowpoke': ['slowbro', 'slowking'],
  'oddish': ['gloom', 'vileplume', 'bellossom'],
  'burmy': ['wormadam', 'mothim'],
  'snorunt': ['glalie', 'froslass'],
  'clamperl': ['huntail', 'gorebyss'],
  'nincada': ['ninjask', 'shedinja']
};

const calculatePokemonPrice = (
  pokemonData: any,
  speciesData: any,
  evolutionChain: string[]
): number => {
  let basePrice = 100; // Aumentamos o preço base para ter mais margem para diferenciação

  // Fator para Pokémon lendários e semi-lendários
  if (legendaryPokemon.includes(pokemonData.name.toLowerCase())) {
    basePrice *= 10; // Lendários têm um preço base muito mais alto
  } else if (semiLegendaryPokemon.includes(pokemonData.name.toLowerCase())) {
    basePrice *= 5; // Semi-lendários têm um preço base alto, mas menor que lendários
  }

  // Verifica se o Pokémon faz parte de uma evolução especial
  for (const [basePokemon, evolutions] of Object.entries(specialEvolutions)) {
    if (evolutions.includes(pokemonData.name.toLowerCase())) {
      const evolutionIndex = evolutions.indexOf(pokemonData.name.toLowerCase());
      basePrice *= (1 + evolutionIndex * 0.2);
      break;
    } else if (pokemonData.name.toLowerCase() === basePokemon) {
      basePrice *= 1.2;
      break;
    }
  }

  // Se não for uma evolução especial, usa a lógica padrão
  if (!Object.values(specialEvolutions).flat().includes(pokemonData.name.toLowerCase())) {
    if (evolutionChain.length === 3) {
      const evolutionIndex = evolutionChain.indexOf(pokemonData.name);
      basePrice *= (1 + evolutionIndex * 0.3);
    } else {
      const evolutionIndex = evolutionChain.indexOf(pokemonData.name);
      basePrice *= (1 + evolutionIndex * 0.2);
    }
  }

  // Ajuste baseado nas estatísticas do Pokémon
  const totalStats = pokemonData.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0);
  basePrice *= (1 + totalStats / 1000); // Reduzimos o impacto das estatísticas

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
      image: response.data.sprites.front_default || DITTO_IMAGE, // Usa a imagem do Ditto como fallback
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
      image: DITTO_IMAGE, // Usa a imagem do Ditto como fallback em caso de erro
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