import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { getPokemonDetails } from '@/api/pokemonApi';
import { Pokemon } from '@/models/pokemon';

const Container = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const PokemonName = styled.h1`
  color: #333;
  font-size: 32px;
  margin-bottom: 20px;
`;

const PokemonImage = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
`;

const PokemonInfo = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InfoTitle = styled.h2`
  color: #333;
  font-size: 24px;
  margin-bottom: 10px;
`;

const InfoText = styled.p`
  color: #666;
  font-size: 18px;
  margin-bottom: 10px;
`;

const PriceTag = styled.div`
  background-color: #4caf50;
  color: white;
  font-size: 24px;
  padding: 10px 20px;
  border-radius: 5px;
  display: inline-block;
  margin-bottom: 20px;
`;

interface ExtendedPokemon extends Pokemon {
  weaknesses: string[];
  attacks: string[];
  evolutions: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
}

interface ExtendedPokemon {
  id: number;
  name: string;
  image: string;
  price: number;
  type: string;
  weaknesses: string[];
  attacks: string[];
  evolutions: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
}

const PokemonDetails: React.FC = () => {
  const router = useRouter();
  const { name } = router.query;
  const [pokemonDetails, setPokemonDetails] = useState<ExtendedPokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (typeof name === 'string') {
        try {
          setLoading(true);
          const data = await getPokemonDetails(name);
          setPokemonDetails(data);
        } catch (err) {
          setError('Failed to fetch Pokémon details. Please try again later.');
          console.error('Error fetching Pokémon details:', err);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchPokemonDetails();
  }, [name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!pokemonDetails) {
    return <div>No Pokémon found</div>;
  }

  return (
    <Container>
      <PokemonName>{pokemonDetails.name}</PokemonName>
      <PokemonImage src={pokemonDetails.image} alt={pokemonDetails.name} />
      <PriceTag>${pokemonDetails.price}</PriceTag>

      <PokemonInfo>
        <InfoTitle>Basic Info</InfoTitle>
        <InfoText>Type: {pokemonDetails.type}</InfoText>
      </PokemonInfo>

      <PokemonInfo>
        <InfoTitle>Weaknesses</InfoTitle>
        <InfoText>{pokemonDetails.weaknesses.join(', ')}</InfoText>
      </PokemonInfo>

      <PokemonInfo>
        <InfoTitle>Attacks</InfoTitle>
        <InfoText>{pokemonDetails.attacks.join(', ')}</InfoText>
      </PokemonInfo>

      <PokemonInfo>
        <InfoTitle>Evolutions</InfoTitle>
        <InfoText>{pokemonDetails.evolutions.join(' → ')}</InfoText>
      </PokemonInfo>

      <PokemonInfo>
        <InfoTitle>Initial Attributes</InfoTitle>
        <InfoText>HP: {pokemonDetails.stats.hp}</InfoText>
        <InfoText>Attack: {pokemonDetails.stats.attack}</InfoText>
        <InfoText>Defense: {pokemonDetails.stats.defense}</InfoText>
        <InfoText>Speed: {pokemonDetails.stats.speed}</InfoText>
      </PokemonInfo>
    </Container>
  );
};

export default PokemonDetails;