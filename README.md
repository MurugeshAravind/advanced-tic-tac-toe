
# Advanced Tic-Tac-Toe (React + TypeScript + Vite)

An advanced, customizable Tic-Tac-Toe game built with React, TypeScript, and Vite.

## 🕹️ Features

- **Dynamic grid size:** Play on boards from 3x3 up to 6x6
- **Modern UI:** Responsive, accessible, and keyboard-friendly
- **Instant feedback:** Highlights winning lines and shows game status
- **Fast Refresh & HMR:** Powered by Vite and React 19
- **Type-safe:** Built with TypeScript throughout
- **Comprehensive tests:** Unit and E2E tests with Vitest and Playwright

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)

### Setup
```bash
git clone https://github.com/your-username/advanced-tic-tac-toe.git
cd advanced-tic-tac-toe
npm install
```

### Run the App
```bash
npm run dev
# Open http://localhost:5173 in your browser
```

### Build for Production
```bash
npm run build
npm run preview
```

### Run Tests
- **Unit & Component tests:**
  ```bash
  npm run test
  ```
- **E2E tests (Playwright):**
  ```bash
  npm run test:e2e
  ```

## 🗂️ Folder Structure

```
src/
  app.tsx            # Main app entry
  features/
    game/            # Core game logic & components
      components/    # Board, Cell, Status, etc.
      hooks/         # use-game-logic (main game hook)
      utils/         # Game utilities (win logic, etc.)
    tic-tac-toe/     # (Legacy/alt) tic-tac-toe implementation
  public/            # Static assets
e2e/                 # Playwright E2E tests
```

## 📝 How to Play

1. Select your desired grid size (3x3 to 6x6)
2. Take turns as X and O
3. Win by completing a row, column, or diagonal
4. Reset anytime with the reset button

## 🧪 Linting & Code Quality

- Run `npm run lint` to check code style and quality
- ESLint is preconfigured for React, TypeScript, and best practices

## 🤝 Contributing

Pull requests and issues are welcome! Please open an issue to discuss major changes.

---

Built with ❤️ using React 19, Vite, and TypeScript.
