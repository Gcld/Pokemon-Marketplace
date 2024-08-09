import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import PokemonCard from '../components/PokemonCard';
import Cart from '../components/Cart';
import UserWallet from '../components/UserWallet';
import { getPokemonList, getPokemonDetails } from '../api/pokemonApi';
import { Pokemon } from '@/models/Pokemon';


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

const CartButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const CartItemCount = styled.span`
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  position: absolute;
  top: -5px;
  right: -5px;
`;

const CartContainer = styled.div`
  position: fixed;
  top: 70px;
  right: 20px;
  width: 300px;
  z-index: 1000;
`;

const Home: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<Pokemon[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [balance, setBalance] = useState(1000);
  const existingIds = useRef(new Set<number>());

  const fetchPokemonList = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getPokemonList(nextUrl);
      const newPokemonList = await Promise.all(
        data.results
          .filter((pokemon: any) => {
            const id = parseInt(pokemon.url.split('/')[6]);
            return !existingIds.current.has(id);
          })
          .map(async (pokemon: any) => {
            const details = await getPokemonDetails(pokemon.name);
            existingIds.current.add(details.id);
            return details;
          })
      );
      
      setPokemonList(prevList => {
        const uniqueNewPokemon = newPokemonList.filter(
          newPokemon => !prevList.some(existingPokemon => existingPokemon.id === newPokemon.id)
        );
        return [...prevList, ...uniqueNewPokemon];
      });
      setNextUrl(data.next);
    } catch (err) {
      setError('Failed to fetch Pokémon. Please try again later.');
      console.error('Error fetching Pokémon:', err);
    } finally {
      setLoading(false);
    }
  }, [nextUrl, loading]);

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
      fetchPokemonList();
    }
  }, [loading, nextUrl, fetchPokemonList]);

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

  const handleCheckout = () => {
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
    if (balance >= totalPrice) {
      setBalance(prevBalance => prevBalance - totalPrice);
      setCartItems([]);
      alert('Purchase successful!');
    } else {
      alert('Insufficient funds!');
    }
  };

  const handleAddFunds = (amount: number) => {
    setBalance(prevBalance => prevBalance + amount);
  };

  return (
    <Container>
      <Title>Pokémon Marketplace</Title>
      <UserWallet balance={balance} onAddFunds={handleAddFunds} />
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
      <CartButton onClick={() => setIsCartOpen(!isCartOpen)}>
        Cart
        {cartItems.length > 0 && <CartItemCount>{cartItems.length}</CartItemCount>}
      </CartButton>
      <CartContainer>
        <Cart 
          items={cartItems} 
          onRemove={removeFromCart} 
          onCheckout={handleCheckout}
          isOpen={isCartOpen}
        />
      </CartContainer>
    </Container>
  );
};

export default Home;