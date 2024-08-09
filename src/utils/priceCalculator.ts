import { legendaryPokemon, semiLegendaryPokemon, specialEvolutions } from '@/data/pokemonData';

export const calculatePokemonPrice = (
  pokemonData: any,
  speciesData: any,
  evolutionChain: string[]
): number => {
  let basePrice = 100;

  if (legendaryPokemon.includes(pokemonData.name.toLowerCase())) {
    basePrice *= 10;
  } else if (semiLegendaryPokemon.includes(pokemonData.name.toLowerCase())) {
    basePrice *= 5;
  }

  for (const [basePokemon, evolutions] of Object.entries(specialEvolutions)) {
    if (evolutions.includes(pokemonData.name.toLowerCase())) {
      const evolutionIndex = evolutions.indexOf(pokemonData.name.toLowerCase());
      basePrice *= (1 + evolutionIndex * 0.2);
      break;
    } else if (pokemonData.name.toLowerCase() === basePokemon) {
      basePrice *= 1.2;
      break;
    }
  }

  if (!Object.values(specialEvolutions).flat().includes(pokemonData.name.toLowerCase())) {
    if (evolutionChain.length === 3) {
      const evolutionIndex = evolutionChain.indexOf(pokemonData.name);
      basePrice *= (1 + evolutionIndex * 0.3);
    } else {
      const evolutionIndex = evolutionChain.indexOf(pokemonData.name);
      basePrice *= (1 + evolutionIndex * 0.2);
    }
  }

  const totalStats = pokemonData.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0);
  basePrice *= (1 + totalStats / 1000);

  if (pokemonData.name.toLowerCase() === 'magikarp') {
    return 1;
  }

  return Math.round(basePrice);
};