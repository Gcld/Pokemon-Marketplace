import axios from 'axios';

export const getTypeWeaknesses = async (typeUrl: string): Promise<string[]> => {
  if (!typeUrl) return [];
  try {
    const response = await axios.get(typeUrl);
    return response.data.damage_relations.double_damage_from.map((type: any) => type.name);
  } catch (error) {
    console.error('Error fetching type weaknesses:', error);
    return [];
  }
};

export const getEvolutionChain = (chain: any): string[] => {
  const evolutions: string[] = [chain.species.name];
  let currentChain = chain.evolves_to[0];

  while (currentChain) {
    evolutions.push(currentChain.species.name);
    currentChain = currentChain.evolves_to[0];
  }

  return evolutions;
};