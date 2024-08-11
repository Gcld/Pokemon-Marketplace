import React from 'react';
import type { AppProps } from 'next/app';
import Header from '../components/Header';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <Component {...pageProps} />
      </MainContent>
    </PageContainer>
  );
}

export default MyApp;