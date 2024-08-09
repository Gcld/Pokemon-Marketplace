export const typeColors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  
  export const getTypeColor = (type: string): string => {
    return typeColors[type.toLowerCase()] || '#A8A8A8'; // Cor padrão caso o tipo não seja encontrado
  };
  
  export const getLighterColor = (color: string): string => {
    // Converte a cor para RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
  
    // Aumenta cada componente em 20%
    const newR = Math.min(255, r + 51);
    const newG = Math.min(255, g + 51);
    const newB = Math.min(255, b + 51);
  
    // Converte de volta para hexadecimal
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };