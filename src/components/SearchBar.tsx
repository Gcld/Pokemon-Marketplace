import React from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;

  &:focus {
    border-color: #3498db;
  }
`;

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Search Pokémon by name..."
        onChange={handleChange}
      />
    </SearchContainer>
  );
};

export default SearchBar;