# Pokémon Marketplace

Este projeto é um marketplace de Pokémon, desenvolvido como parte de um desafio técnico. Ele permite aos usuários visualizar, filtrar e "comprar" Pokémons.

## Tecnologias Utilizadas

- React
- Next.js
- TypeScript
- JavaScript
- CSS (via Styled Components)
- HTML

## Funcionalidades

1. Listagem de Pokémon com foto, nome, tipo e preço
2. Visualização detalhada de cada Pokémon
3. Paginação na listagem dos Pokémon
4. Informações adicionais como fraquezas, ataques, evoluções e atributos iniciais
5. Carrinho de compras com adição, visualização e exclusão de itens

## Funcionalidades Extras

Além das funcionalidades solicitadas no desafio, este projeto também inclui:

1. Sistema de precificação dinâmica dos Pokémon
2. Filtro de Pokémon por tipo
3. Ordenação de Pokémon por número da Pokédex, ordem alfabética e preço
4. Barra de pesquisa para encontrar Pokémon específicos
5. Sistema de carteira do usuário para "comprar" Pokémon
6. Design responsivo para diferentes tamanhos de tela
7. Efeitos visuais nos cards dos Pokémon para melhorar a experiência do usuário

## Sistema de Precificação

O preço de cada Pokémon é calculado dinamicamente com base em vários fatores:

- Pokémon lendários têm um preço base 10 vezes maior
- Pokémon semi-lendários têm um preço base 5 vezes maior
- O estágio de evolução afeta o preço (formas evoluídas são mais caras)
- Pokémon com evoluções especiais (como Eevee) têm preços ajustados
- As estatísticas base do Pokémon influenciam o preço final
- Mega evoluções têm um preço mínimo de 1,5 vezes o preço da forma base

O cálculo exato pode ser encontrado no arquivo `src/utils/priceCalculator.ts`.

## Instruções para Instalação e Execução do Sistema

### Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- Node.js (versão 14.0.0 ou superior)
- npm (geralmente vem com o Node.js)
- Git

### Passos para Instalação

1. Clone o repositório: git clone https://github.com/seu-usuario/pokemon-marketplace.git

2. Navegue até o diretório do projeto:

cd pokemon-marketplace

3. Instale as dependências do projeto:

npm install

### Execução do Sistema

1. Para executar o projeto em modo de desenvolvimento:

npm run dev

Isso iniciará o servidor de desenvolvimento. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o aplicativo.

2. Para criar uma versão de produção:

npm run build

3. Para iniciar a versão de produção:

npm start

### Comandos Adicionais

- Para executar os testes (se implementados):

npm test

- Para verificar e corrigir problemas de linting:

npm run lint

### Solução de Problemas

Se encontrar problemas durante a instalação ou execução, tente os seguintes passos:

1. Certifique-se de que está usando a versão correta do Node.js
2. Limpe o cache do npm: `npm cache clean --force`
3. Exclua a pasta `node_modules` e o arquivo `package-lock.json`, então execute `npm install` novamente

Se os problemas persistirem, por favor, abra uma issue no repositório do GitHub.

## Estrutura do Projeto

- `src/api/`: Contém funções para fazer chamadas à API
- `src/components/`: Contém todos os componentes React reutilizáveis
- `src/data/`: Contém dados estáticos usados no projeto
- `src/models/`: Contém definições de tipos TypeScript
- `src/pages/`: Contém as páginas do Next.js
- `src/utils/`: Contém funções utilitárias


