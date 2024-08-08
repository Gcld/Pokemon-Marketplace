import React from 'react';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>Pokémon Marketplace</title>
        <meta name="description" content="A marketplace for Pokémon" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;