import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PokemonCard from '../components/PokemonCard';
import { getPokemonList } from '../api/pokemonApi';
import { Pokemon } from '@/models/pokemon';

const Container = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
`;

const PokemonList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 20px;
  margin-bottom: 20px;
`;

const Home: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPokemonList = async () => {
      setLoading(true);
      const data = await getPokemonList(nextUrl);
      const mappedPokemonList: Pokemon[] = data.results.map((pokemon: any, index: number) => ({
        id: pokemonList.length + index + 1,
        name: pokemon.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonList.length + index + 1}.png`,
        price: 10,
        type: 'Unknown',
      }));
      setPokemonList((prevList) => [...prevList, ...mappedPokemonList]);
      setNextUrl(data.next);
      setLoading(false);
    };

    fetchPokemonList();
  }, [nextUrl]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight &&
      !loading &&
      nextUrl
    ) {
      setNextUrl(nextUrl);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, nextUrl]);

  return (
    <Container>
      <Title>Pokémon Marketplace</Title>
      <PokemonList>
        {pokemonList.map((pokemon: Pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </PokemonList>
      {loading && <div>Loading...</div>}
    </Container>
  );
};

export default Home;