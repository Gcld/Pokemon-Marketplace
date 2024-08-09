import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Pokemon } from '../models/Pokemon';

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
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  opacity: 1;
  transform: scale(1);
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &.fade-enter {
    opacity: 0;
    transform: scale(0.9);
  }

  &.fade-exit {
    opacity: 0;
    transform: scale(0.9);
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

const AddToCartButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 10px;
`;

interface PokemonCardProps {
  pokemon: Pokemon;
  onAddToCart: () => void;
}


const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onAddToCart }) => {
  return (
    <Card>
      <Link href={`/pokemon/${pokemon.name}`}>
        <PokemonImage src={pokemon.image} alt={pokemon.name} />
        <PokemonName>{pokemon.name}</PokemonName>
        <PokemonPrice>Price: ${pokemon.price}</PokemonPrice>
        <PokemonType>Type: {pokemon.type}</PokemonType>
      </Link>
      <AddToCartButton onClick={onAddToCart}>Adicionar ao Carrinho</AddToCartButton>
    </Card>
  );
};

export default PokemonCard;