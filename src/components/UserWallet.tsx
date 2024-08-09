import React, { useState } from 'react';
import styled from 'styled-components';

const WalletContainer = styled.div`
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const Balance = styled.p`
  font-size: 18px;
  font-weight: bold;
`;

const AddFundsButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 10px;
`;

interface UserWalletProps {
  balance: number;
  onAddFunds: (amount: number) => void;
}

const UserWallet: React.FC<UserWalletProps> = ({ balance, onAddFunds }) => {
  const [amount, setAmount] = useState(100);

  return (
    <WalletContainer>
      <Balance>Balance: P${balance}</Balance>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        min="1"
      />
      <AddFundsButton onClick={() => onAddFunds(amount)}>Add Funds</AddFundsButton>
    </WalletContainer>
  );
};

export default UserWallet;