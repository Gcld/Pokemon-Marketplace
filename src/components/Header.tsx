import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const HeaderContainer = styled.header`
  background-color: #ffffff;
  padding: 15px 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoText = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #3B4CCA;
  margin: 0;
`;

const PokeBall = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(to bottom, #FF0000 50%, #FFFFFF 50%);
  border: 2px solid #000000;
  margin-right: 10px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background-color: #FFFFFF;
    border-radius: 50%;
    border: 2px solid #000000;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: none;
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <LogoContainer>
        <StyledLink href="/">
          <PokeBall />
          <LogoText>Pokémon Marketplace</LogoText>
        </StyledLink>
      </LogoContainer>
    </HeaderContainer>
  );
};

export default Header;