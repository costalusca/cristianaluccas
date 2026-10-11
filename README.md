# 💍 Site de Casamento & Painel Administrativo

> Plataforma web desenvolvida para gerenciar os detalhes de um casamento, incluindo confirmação de presença (RSVP), lista de presentes e painel administrativo protegido.

[![Deploy na Vercel](https://img.shields.io/badge/status-online-success?style=for-the-badge&logo=vercel)](https://cristianaluccas.vercel.app)
[![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## 🔗 Acesse o Projeto
* **Aplicação ao vivo:** [cristianaluccas.vercel.app](https://cristianaluccas.vercel.app)

---

## 🚀 Sobre o Projeto
Este projeto foi desenvolvido como uma solução completa e interativa para celebração de casamento. A aplicação conta com uma interface responsiva focada na experiência do usuário (UX), rotas protegidas para administração de dados e integração completa com banco de dados em tempo real.

---

## 🛠️ Tecnologias Utilizadas
* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide React
* **Roteamento:** React Router DOM (com suporte a SPA na Vercel via `vercel.json`)
* **Banco de Dados & Auth:** Supabase (PostgreSQL, Row Level Security)
* **Hospedagem & CI/CD:** Vercel (com deploy contínuo via GitHub)

---

## 📋 Funcionalidades Principales
1. **Página Inicial Dinâmica:** Seções de história do casal, cronograma, galeria de fotos e local do evento.
2. **Sistema de RSVP (Confirmação de Presença):** Envio de formulário conectado diretamente ao banco de dados.
3. **Lista de Presentes:** Vitrine interativa de itens sugeridos.
4. **Painel Administrativo (`/admin`):** Área restrita para visualização de confirmações e gestão do conteúdo.
5. **Tratamento de Rotas 404:** Páginas de erro customizadas.

---

## ⚙️ Como Executar o Projeto Localmente

Se você deseja clonar e rodar o projeto na sua máquina:

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/costalusca/cristianaluccas.git](https://github.com/costalusca/cristianaluccas.git)
   cd cristianaluccas