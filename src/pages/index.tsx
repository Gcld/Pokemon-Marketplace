import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PokemonCard from '../components/PokemonCard';
import { getPokemonList, getPokemonDetails } from '../api/pokemonApi';
import { ExtendedPokemon } from '@/models/extendedPokemon';

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

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  text-align: center;
  margin: 20px 0;
`;

const Home: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<ExtendedPokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPokemonList = async () => {
      setLoading(true);
      const data = await getPokemonList(nextUrl);
      const detailedPokemonList = await Promise.all(
        data.results.map(async (pokemon: any) => {
          return await getPokemonDetails(pokemon.name);
        })
      );
      setPokemonList((prevList) => [...prevList, ...detailedPokemonList]);
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
        {pokemonList.map((pokemon: ExtendedPokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </PokemonList>
      {loading && <div>Loading...</div>}
    </Container>
  );
};

export default Home;