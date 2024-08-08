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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e53935;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Home: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    const fetchPokemonList = async () => {
      const data = await getPokemonList(currentPage, limit);
      const mappedPokemonList: Pokemon[] = data.map((pokemon: any, index: number) => ({
        id: (currentPage - 1) * limit + index + 1,
        name: pokemon.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${(currentPage - 1) * limit + index + 1}.png`,
        price: 10,
        type: 'Unknown',
      }));
      setPokemonList(mappedPokemonList);
    };

    fetchPokemonList();
  }, [currentPage, limit]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <h1>Pokémon Marketplace</h1>
      <PokemonList>
        {pokemonList.map((pokemon: Pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </PokemonList>
      <PaginationContainer>
        {Array.from({ length: Math.ceil(151 / limit) }, (_, index) => (
          <PaginationButton
            key={index}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </PaginationButton>
        ))}
      </PaginationContainer>
    </Container>
  );
};

export default Home;