import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const FilterSelect = styled.select`
  padding: 8px;
  margin: 0 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

interface FilterBarProps {
  onFilterChange: (filterType: string, value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  return (
    <FilterContainer>
      <FilterSelect onChange={(e) => onFilterChange('sort', e.target.value)}>
        <option value="id">Número da Pokédex</option>
        <option value="name">Ordem Alfabética</option>
        <option value="price-asc">Preço (Mais Barato)</option>
        <option value="price-desc">Preço (Mais Caro)</option>
      </FilterSelect>
      <FilterSelect onChange={(e) => onFilterChange('type', e.target.value)}>
        <option value="">Todos os Tipos</option>
        <option value="normal">Normal</option>
        <option value="fire">Fogo</option>
        <option value="water">Água</option>
        <option value="electric">Elétrico</option>
        <option value="grass">Grama</option>
        <option value="ice">Gelo</option>
        <option value="fighting">Lutador</option>
        <option value="poison">Venenoso</option>
        <option value="ground">Terra</option>
        <option value="flying">Voador</option>
        <option value="psychic">Psíquico</option>
        <option value="bug">Inseto</option>
        <option value="rock">Pedra</option>
        <option value="ghost">Fantasma</option>
        <option value="dragon">Dragão</option>
        <option value="dark">Sombrio</option>
        <option value="steel">Aço</option>
        <option value="fairy">Fada</option>
      </FilterSelect>
    </FilterContainer>
  );
};

export default FilterBar;