import React from 'react';
import styled from 'styled-components';
import { ExtendedPokemon } from '@/models/extendedPokemon';

const CartContainer = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  margin-top: 20px;
`;

const CartTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
`;

const CartItemInfo = styled.div`
  display: flex;
  align-items: center;
`;

const CartItemImage = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

const RemoveButton = styled.button`
  background-color: #ff4136;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
`;

const TotalPrice = styled.p`
  font-weight: bold;
  font-size: 18px;
  margin-top: 20px;
`;

interface CartProps {
  items: ExtendedPokemon[];
  onRemove: (id: number) => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemove }) => {
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContainer>
      <CartTitle>Carrinho de Compras</CartTitle>
      {items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          {items.map((item) => (
            <CartItem key={item.id}>
              <CartItemInfo>
                <CartItemImage src={item.image} alt={item.name} />
                <span>{item.name}</span>
              </CartItemInfo>
              <div>
                <span>${item.price}</span>
                <RemoveButton onClick={() => onRemove(item.id)}>Remover</RemoveButton>
              </div>
            </CartItem>
          ))}
          <TotalPrice>Total: ${totalPrice}</TotalPrice>
        </>
      )}
    </CartContainer>
  );
};

export default Cart;