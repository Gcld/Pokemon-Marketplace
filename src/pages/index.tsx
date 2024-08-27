import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PokemonCard from '../components/PokemonCard';
import Cart from '../components/Cart';
import UserWallet from '../components/UserWallet';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import { getPokemonList, getPokemonDetails } from '../api/pokemonApi';
import { Pokemon } from '@/models/pokemon';
import { adjustPokemonPrice } from '../utils/pokemonUtils';


const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  background-color: #f5f5f5;
  padding: 20px;
`;

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

const PokemonList = styled(TransitionGroup)`
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
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<Pokemon[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [balance, setBalance] = useState(1000);
  const existingIds = useRef(new Set<number>());
  const [sortType, setSortType] = useState('id');
  const [filterType, setFilterType] = useState('');
  const [debouncedFilterType, setDebouncedFilterType] = useState(filterType);
  const [debouncedSortType, setDebouncedSortType] = useState(sortType);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterType(filterType);
      setDebouncedSortType(sortType);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [filterType, sortType]);

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
          newPokemon => !prevList.some(existingPokemon => existingPokemon.name === newPokemon.name)
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

  useEffect(() => {
    const uniquePokemonMap = new Map();
    pokemonList.forEach(pokemon => {
      const baseName = pokemon.name.replace('-mega', '');
      if (!uniquePokemonMap.has(baseName) || pokemon.name.endsWith('-mega')) {
        uniquePokemonMap.set(baseName, pokemon);
      }
    });

    let adjustedPokemonList = Array.from(uniquePokemonMap.values()).map(pokemon => ({
      ...pokemon,
      price: adjustPokemonPrice(pokemon, Array.from(uniquePokemonMap.values()))
    }));

    let sortedAndFilteredList = [...adjustedPokemonList];

    // Aplicar busca por nome
    if (searchTerm) {
      sortedAndFilteredList = sortedAndFilteredList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro por tipo
    if (debouncedFilterType) {
      sortedAndFilteredList = sortedAndFilteredList.filter(pokemon => 
        pokemon.type.toLowerCase().includes(debouncedFilterType.toLowerCase())
      );
    }

    // Aplicar ordenação
    switch (debouncedSortType) {
      case 'name':
        sortedAndFilteredList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        sortedAndFilteredList.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedAndFilteredList.sort((a, b) => b.price - a.price);
        break;
      default: // 'id'
        sortedAndFilteredList.sort((a, b) => {
          const aId = parseInt(a.id.toString().replace(/^0+/, ''));
          const bId = parseInt(b.id.toString().replace(/^0+/, ''));
          return aId - bId;
        });
    }

    setFilteredPokemonList(sortedAndFilteredList);
  }, [pokemonList, debouncedSortType, debouncedFilterType, searchTerm]);

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

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === 'sort') {
      setSortType(value);
    } else if (filterType === 'type') {
      setFilterType(value);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <MainContent>
      <UserWallet balance={balance} onAddFunds={handleAddFunds} />
      <SearchBar onSearch={handleSearch} />
      <FilterBar onFilterChange={handleFilterChange} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <PokemonList>
        {filteredPokemonList.map((pokemon: Pokemon) => (
          <CSSTransition
            key={pokemon.id}
            timeout={300}
            classNames="fade"
          >
            <PokemonCard 
              pokemon={pokemon} 
              onAddToCart={() => addToCart(pokemon)}
            />
          </CSSTransition>
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
    </MainContent>
  );
};

export default Home;