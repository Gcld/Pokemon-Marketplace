import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Pokemon } from '@/models/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const Header = styled.header`
  background-color: #f44336;
  padding: 20px;
  color: white;
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
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

const Card = styled.div`
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const PokemonImage = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 10px;
`;

const PokemonName = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const PokemonType = styled.p`
  font-size: 14px;
  color: #888;
  margin-bottom: 10px;
`;

const PokemonPrice = styled.p`
  font-size: 16px;
  font-weight: bold;
`;

const PokemonList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 20px;
  margin-bottom: 20px;
`;

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <Link href={`/pokemon/${pokemon.name}`}>
      <Card>
        <PokemonImage src={pokemon.image} alt={pokemon.name} />
        <PokemonName>{pokemon.name}</PokemonName>
        <PokemonPrice>Price: ${pokemon.price}</PokemonPrice>
        <PokemonType>Type: {pokemon.type}</PokemonType>
      </Card>
    </Link>
  );
};

export default PokemonCard;