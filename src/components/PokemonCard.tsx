import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Pokemon } from '../models/Pokemon';
import { getTypeColor, getLighterColor } from '@/utils/typeColors';

interface PokemonCardProps {
  pokemon: Pokemon;
  onAddToCart: () => void;
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

const Card = styled.div<{ backgroundColor: string, lighterColor: string }>`
  background: linear-gradient(135deg, ${props => props.backgroundColor} 0%, ${props => props.lighterColor} 100%);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PokemonImage = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 10px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

const PokemonName = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const PokemonType = styled.p`
  font-size: 14px;
  color: #f0f0f0;
  margin-bottom: 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const PokemonPrice = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const AddToCartButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onAddToCart }) => {
  const backgroundColor = getTypeColor(pokemon.type.split(',')[0].trim());
  const lighterColor = getLighterColor(backgroundColor);

  return (
    <Card backgroundColor={backgroundColor} lighterColor={lighterColor}>
      <Link href={`/pokemon/${pokemon.name}`}>
        <PokemonImage src={pokemon.image} alt={pokemon.name} />
        <PokemonName>{pokemon.name}</PokemonName>
        <PokemonType>{pokemon.type}</PokemonType>
        <PokemonPrice>Price: ${pokemon.price}</PokemonPrice>
      </Link>
      <AddToCartButton onClick={onAddToCart}>Add to Cart</AddToCartButton>
    </Card>
  );
};

export default PokemonCard;