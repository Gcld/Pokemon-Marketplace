import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Pokemon } from '../models/pokemon';
import { getTypeColor, getLighterColor, getContrastColor } from '@/utils/typeColors';

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

const PokemonName = styled.h3<{ textColor: string }>`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: ${props => props.textColor};
  text-shadow: ${props => props.textColor === '#ffffff' ? '1px 1px 2px rgba(0, 0, 0, 0.5)' : 'none'};
`;

const PokemonType = styled.p<{ textColor: string }>`
  font-size: 14px;
  color: ${props => props.textColor};
  margin-bottom: 10px;
  opacity: 0.8;
`;

const PokemonPrice = styled.p<{ textColor: string }>`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.textColor};
`;

const AddToCartButton = styled.button<{ textColor: string, backgroundColor: string }>`
  background-color: ${props => props.backgroundColor};
  color: ${props => props.textColor};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  transition: opacity 0.2s, transform 0.1s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onAddToCart }) => {
  const backgroundColor = getTypeColor(pokemon.type.split(',')[0].trim());
  const lighterColor = getLighterColor(backgroundColor);
  const textColor = getContrastColor(backgroundColor);
  const buttonBackgroundColor = textColor === '#ffffff' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)';
  const buttonTextColor = textColor === '#ffffff' ? '#ffffff' : '#000000';

  return (
    <Card backgroundColor={backgroundColor} lighterColor={lighterColor}>
      <Link href={`/pokemon/${pokemon.name}`}>
        <PokemonImage src={pokemon.image} alt={pokemon.name} />
        <PokemonName textColor={textColor}>{pokemon.name}</PokemonName>
        <PokemonType textColor={textColor}>{pokemon.type}</PokemonType>
        <PokemonPrice textColor={textColor}>Price: ${pokemon.price}</PokemonPrice>
      </Link>
      <AddToCartButton onClick={onAddToCart} textColor={buttonTextColor} backgroundColor={buttonBackgroundColor}>
        Add to Cart
      </AddToCartButton>
    </Card>
  );
};

export default PokemonCard;