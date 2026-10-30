# EcoUp — Home page demonstrativa

Landing page responsiva da EcoUp, uma proposta que combina software de incentivo à reciclagem com o conceito de uma lixeira inteligente.

## Como executar

1. Extraia a pasta do projeto, se necessário.
2. Abra `index.html` no navegador. Não é necessário servidor ou instalação de dependências.
3. Para desenvolvimento, você também pode abrir a pasta no VS Code e usar a extensão Live Server.

## O que está incluído

- Navegação responsiva com menu mobile.
- Seções de apresentação, etapas, materiais recicláveis, recompensas e produto conceitual.
- Simulador de descarte com pontuação variável por material.
- Resgate demonstrativo de recompensas e feedback visual.
- Persistência de pontos, itens e resgates em `localStorage`.
- Opção para reiniciar o estado da demonstração.
- Acessibilidade básica: landmarks semânticos, rótulos, status anunciado, opção de pular para o conteúdo e respeito a `prefers-reduced-motion`.

## Observações importantes

Esta é uma **demonstração de front-end**. Os pontos e resgates são ilustrativos e ficam salvos somente no navegador atual. Não há integração real com uma lixeira física, sensores, reconhecimento automático, conta de usuário, backend, parceiros ou recompensas reais. A pontuação exibida é uma proposta de UX e deve ser definida e validada no produto final.

## Arquivos

- `index.html` — estrutura semântica e conteúdo.
- `styles.css` — identidade visual, ilustrações em CSS e responsividade.
- `script.js` — simulação de descarte, pontos, resgates e persistência local.
