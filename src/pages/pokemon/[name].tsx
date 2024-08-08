import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { getPokemonDetails } from '@/api/pokemonApi';
import { Pokemon } from '@/models/pokemon';

const Container = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  text-align: center;
`;

const PokemonName = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
`;

const PokemonImage = styled.img`
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
`;

const PokemonInfo = styled.p`
  color: #666;
  font-size: 18px;
  margin-bottom: 10px;
`;

const PokemonDetails: React.FC = () => {
  const router = useRouter();
  const { name } = router.query;
  const [pokemonDetails, setPokemonDetails] = useState<Pokemon | null>(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (typeof name === 'string') {
        const data = await getPokemonDetails(name);
        setPokemonDetails(data);
      }
    };

    fetchPokemonDetails();
  }, [name]);

  if (!pokemonDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h1>{pokemonDetails.name}</h1>
      <img src={pokemonDetails.image} alt={pokemonDetails.name} />
      <p>Type: {pokemonDetails.type}</p>
      {/* Adicionar mais detalhes do Pokémon conforme necessário */}
    </Container>
  );
};

export default PokemonDetails;