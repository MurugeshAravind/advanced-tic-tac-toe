
# Advanced Tic-Tac-Toe

A full-stack, multiplayer-ready Tic-Tac-Toe game built with **React 19**, **TypeScript**, **Vite**, and **AWS** cloud services. Features user authentication, persistent game history, a global leaderboard, and a dark neon gaming theme.

---

## Features

- **User Authentication** — Sign up, sign in, email verification, and sign out powered by AWS Cognito
- **Dynamic Grid Size** — Play on boards from 3×3 up to 6×6
- **Game History** — Every completed game is saved to the cloud and viewable per user
- **Global Leaderboard** — Tracks wins, draws, and total games across all players
- **Dark Neon Gaming Theme** — Fully responsive UI across mobile, tablet, and desktop
- **Keyboard-Friendly & Accessible** — Works with keyboard navigation
- **Fast Refresh & HMR** — Powered by Vite and React 19
- **Type-Safe** — Built with TypeScript throughout
- **Comprehensive Tests** — Unit/component tests (Vitest) and E2E tests (Playwright)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                  AWS Amplify Hosting                     │
│              (CI/CD + Static Site Delivery)              │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │           React + TypeScript (Vite)              │    │
│  │                                                  │    │
│  │  ┌──────────────┐   ┌──────────────────────┐    │    │
│  │  │  AWS Cognito │   │  AWS API Gateway      │    │    │
│  │  │  (Auth)      │   │  + Lambda + DynamoDB  │    │    │
│  │  │              │   │  (Game Data)          │    │    │
│  │  └──────────────┘   └──────────────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React 19, TypeScript, Vite          |
| Auth         | AWS Cognito (via aws-amplify v6)     |
| Backend API  | AWS API Gateway + AWS Lambda        |
| Database     | AWS DynamoDB                        |
| Hosting      | AWS Amplify                         |
| Unit Tests   | Vitest, Testing Library             |
| E2E Tests    | Playwright                          |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+

### Setup

```bash
git clone https://github.com/Murugesh161192/advanced-tic-tac-toe.git
cd advanced-tic-tac-toe
npm install
```

### Run the App

```bash
npm run dev
# Open http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

### Run Tests

```bash
# Unit & Component tests
npm run test

# With coverage report
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e
```

### Lint

```bash
npm run lint
```

---

## Folder Structure

```
advanced-tic-tac-toe/
├── amplify.yml                  # AWS Amplify CI/CD build config
├── src/
│   ├── main.tsx                 # App entry — configures AWS Amplify
│   ├── aws-exports.ts           # AWS Cognito configuration
│   ├── app.tsx                  # Root component (auth guard, views)
│   ├── app.css                  # Global styles (dark neon theme)
│   ├── features/
│   │   └── game/
│   │       ├── components/      # Board, Cell, GameStatus, GridSelector, TicTacToe
│   │       ├── hooks/           # use-game-logic (core game state & win detection)
│   │       └── utils/           # game-utils (win calculation helpers)
│   ├── pages/
│   │   ├── login-page.tsx       # Sign in / Sign up / Confirm flow
│   │   └── login-page.css
│   └── services/
│       ├── auth.ts              # Cognito auth helpers (login, register, etc.)
│       └── game-history.ts      # API calls: save game, fetch history, leaderboard
├── e2e/                         # Playwright E2E tests
└── src/test/                    # Vitest unit/component tests
```

---

## How to Play

1. **Sign up** with your email, verify your account with the code sent to your inbox
2. **Sign in** to access the game
3. **Select a grid size** (3×3 to 6×6) using the selector
4. **Take turns** as X and O — click any empty cell
5. **Win** by completing a row, column, or diagonal — the winning line is highlighted
6. After each game, the result is **automatically saved** to your history
7. View **My History** to see all your past games
8. View the **Leaderboard** to compare wins across all players

---

## AWS Services Used

See [AWS_CONCEPTS.md](AWS_CONCEPTS.md) for a detailed explanation of every AWS service used in this app.

---

## Deployment

The app is deployed automatically via **AWS Amplify** on every push to the `main` branch. The build config is defined in `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

Built with React 19, Vite, TypeScript, and AWS.
