import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import PokemonCard from '../components/PokemonCard';
import Cart from '../components/Cart';
import { getPokemonList, getPokemonDetails } from '../api/pokemonApi';
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

const CartContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
`;

const Home: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<Pokemon[]>([]);

  const fetchPokemonList = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getPokemonList(nextUrl);
      const newPokemonList = await Promise.all(
        data.results.map(async (pokemon: any) => {
          return await getPokemonDetails(pokemon.name);
        })
      );
      
      // Remove duplicatas baseado no ID do Pokémon
      const uniqueNewPokemonList = newPokemonList.filter((newPokemon: Pokemon) => 
        !pokemonList.some(existingPokemon => existingPokemon.id === newPokemon.id)
      );

      setPokemonList(prevList => {
        const updatedList = [...prevList, ...uniqueNewPokemonList];
        const uniqueList = updatedList.filter((pokemon, index, self) =>
          index === self.findIndex((t) => t.id === pokemon.id)
        );
        return uniqueList;
      });
      setNextUrl(data.next);
    } catch (err) {
      setError('Failed to fetch Pokémon. Please try again later.');
      console.error('Error fetching Pokémon:', err);
    } finally {
      setLoading(false);
    }
  }, [nextUrl, loading, pokemonList]);

  useEffect(() => {
    fetchPokemonList();
  }, [fetchPokemonList]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      !loading &&
      nextUrl
    ) {
      setNextUrl(nextUrl);
    }
  }, [loading, nextUrl]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const addToCart = (pokemon: Pokemon) => {
    setCartItems((prevItems) => [...prevItems, pokemon]);
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <Container>
      <Title>Pokémon Marketplace</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <PokemonList>
        {pokemonList.map((pokemon: Pokemon) => (
          <PokemonCard 
            key={pokemon.id} 
            pokemon={pokemon} 
            onAddToCart={() => addToCart(pokemon)}
          />
        ))}
      </PokemonList>
      {loading && <LoadingSpinner />}
      <CartContainer>
        <Cart items={cartItems} onRemove={removeFromCart} />
      </CartContainer>
    </Container>
  );
};

export default Home;