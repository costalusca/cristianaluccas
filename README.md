# Cristiana & Luccas

Crie um site de casamento completo, moderno e elegante para a Família João. O site deve ser responsivo (funcionar perfeitamente em celular, tablet e computador) e ter aparência sofisticada, semelhante a sites profissionais de casamento.

Estilo visual

Paleta de cores principal:

Off-white (#F5F5F0) como cor de fundo

Azul marinho (#0A1F44) como cor principal

Visual minimalista, romântico e sofisticado

Tipografia elegante:

Títulos com fonte serifada sofisticada

Textos com fonte limpa e moderna

Animações suaves ao rolar a página

Layout com bastante espaço em branco

Elementos delicados e elegantes típicos de casamentos

Estrutura do site

1. Página inicial (Home)

A primeira seção deve conter:

Nome do casal

Texto de boas-vindas

Foto principal do casal

Pequena história do casal

Contador regressivo para o casamento

Botão principal: Confirmar Presença (RSVP)

Também incluir um menu de navegação com:

Início

Nossa História

RSVP

Lista de Presentes

Local

Galeria

2. Nossa História

Criar uma seção para contar a história do casal com:

Texto editável

Linha do tempo do relacionamento

Fotos do casal

Layout elegante estilo storytelling

3. RSVP – Confirmação de Presença

Criar um formulário completo para confirmação de presença.

Campos:

Nome completo

Telefone / WhatsApp

E-mail

Endereço

Quantidade de convidados

Seleção:

Vou ao casamento

Não poderei comparecer

Campo para mensagem aos noivos

As respostas devem ser armazenadas em banco de dados.

4. Lista de Presentes

Criar uma lista de presentes moderna e interativa.

Cada item deve ter:

Nome do presente

Descrição

Valor

Botão “Presentear”

Exemplos de presentes:

Ajuda para a lua de mel

Jantar romântico

Sofá da casa nova

Geladeira

Viagem especial

Ao clicar em Presentear, o convidado deve poder pagar usando:

Pix

Cartão de crédito

Cartão de débito

Após o pagamento:

O presente deve aparecer como “Presenteado”

Evitar compras duplicadas

5. Local da Cerimônia e Festa

Criar uma seção com:

Nome do local

Endereço completo

Horário da cerimônia

Horário da festa

Mapa integrado do Google Maps

Botão “Abrir rota no Google Maps”

6. Galeria de Fotos

Criar uma galeria elegante com:

Fotos do casal

Layout estilo álbum de casamento

Visual moderno tipo grid ou masonry

Animação ao abrir fotos

Painel Administrativo para os Noivos

Criar uma área de login exclusiva para os noivos.

Após login, deve existir um dashboard administrativo onde eles possam:

Gerenciar convidados

Ver lista de confirmações de presença

Ver quem confirmou ou recusou

Ver número total de convidados

Gerenciar lista de presentes

Adicionar presentes

Editar presentes

Remover presentes

Ver quais já foram comprados

Gerenciar conteúdo do site

Editar textos

Alterar fotos

Alterar data do casamento

Alterar horários

Alterar local do evento

Exportar dados

Permitir exportar lista de convidados em CSV ou Excel.

Integração de pagamentos

Implementar suporte para:

Pix (QR Code automático)

Cartão de crédito

Cartão de débito

Após o pagamento:

Registrar no banco de dados

Marcar presente como comprado

Tecnologias sugeridas

Frontend: React ou Next.js

Backend: Node.js

Banco de dados: PostgreSQL ou Supabase

Autenticação para área administrativa

Integração de pagamentos (Stripe ou Mercado Pago)

Objetivo do projeto

Criar um site de casamento premium, elegante e funcional, onde os convidados possam:

Confirmar presença

Ver detalhes do evento

Presentear os noivos

Navegar por fotos e história do casal

O sistema deve ser fácil de editar pelos noivos, sem necessidade de programação.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cristianaluccas.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b91d0a5d-8bd9-4086-b0dd-5a623a60d0bb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
