import axios from 'axios';
import { Pokemon } from '@/models/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemonList = async (url: string | null): Promise<any> => {
  if (!url) {
    url = `${API_BASE_URL}/pokemon`;
  }

  const response = await axios.get(url);
  return response.data;
};

export const getPokemonDetails = async (pokemonName: string): Promise<Pokemon> => {
  const response = await axios.get(`${API_BASE_URL}/pokemon/${pokemonName}`);
  const pokemonDetails: Pokemon = {
    id: response.data.id,
    name: response.data.name,
    image: response.data.sprites.front_default,
    price: 10,
    type: response.data.types[0].type.name,
  };
  return pokemonDetails;
};