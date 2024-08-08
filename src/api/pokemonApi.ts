import axios from 'axios';
import { Pokemon } from '@/models/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemonList = async (page: number, limit: number): Promise<Pokemon[]> => {
    const offset = (page - 1) * limit;
    const response = await axios.get(`${API_BASE_URL}/pokemon`, {
      params: {
        limit,
        offset,
      },
    });
  
    const pokemonList: Pokemon[] = response.data.results.map((result: any, index: number) => ({
      id: offset + index + 1,
      name: result.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${offset + index + 1}.png`,
      price: 10, // Defina o preço desejado para cada Pokémon
      type: 'Unknown', // Defina o tipo desejado para cada Pokémon
    }));
  
    return pokemonList;
  };
  
  export const getPokemonDetails = async (pokemonName: string): Promise<Pokemon> => {
    const response = await axios.get(`${API_BASE_URL}/pokemon/${pokemonName}`);
    const pokemonDetails: Pokemon = {
      id: response.data.id,
      name: response.data.name,
      image: response.data.sprites.front_default,
      price: 10, // Defina o preço desejado para cada Pokémon
      type: response.data.types[0].type.name, // Defina o tipo do Pokémon com base nos dados da API
    };
    return pokemonDetails;
  };