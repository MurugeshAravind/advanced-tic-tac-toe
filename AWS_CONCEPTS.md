
# AWS Concepts Used in This App

A reference guide explaining every AWS service used in the Advanced Tic-Tac-Toe app — what it is, why we use it, and how it connects to the code.

---

## Table of Contents

1. [AWS Amplify (Hosting & CI/CD)](#1-aws-amplify-hosting--cicd)
2. [AWS Amplify JS Library](#2-aws-amplify-js-library)
3. [AWS Cognito (Authentication)](#3-aws-cognito-authentication)
4. [AWS API Gateway (REST API)](#4-aws-api-gateway-rest-api)
5. [AWS Lambda (Serverless Functions)](#5-aws-lambda-serverless-functions)
6. [AWS DynamoDB (Database)](#6-aws-dynamodb-database)
7. [How All Services Connect](#7-how-all-services-connect)
8. [Key Terms Quick Reference](#8-key-terms-quick-reference)

---

## 1. AWS Amplify (Hosting & CI/CD)

### What is it?

AWS Amplify Hosting is a fully managed service that hosts your frontend web app. It works like a simplified version of services like Netlify or Vercel — but built on AWS infrastructure.

It also provides **CI/CD (Continuous Integration / Continuous Deployment)**, meaning every time you push code to your Git branch, AWS automatically builds and deploys your app.

### Why do we use it?

- Automatic deploys on every `git push` to `main`
- Serves the built React app globally (via AWS CloudFront CDN under the hood)
- No need to manage servers — it just works

### How it works in this app

The file `amplify.yml` at the root of the project is the build configuration file that Amplify reads:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci          # Install exact dependencies from package-lock.json
    build:
      commands:
        - npm run build   # Run TypeScript compiler + Vite build
  artifacts:
    baseDirectory: dist   # The output folder Vite produces
    files:
      - '**/*'            # Serve everything inside dist/
  cache:
    paths:
      - node_modules/**/* # Cache node_modules to speed up future builds
```

### Key Concept: Build Phases

| Phase       | What happens                                |
|-------------|---------------------------------------------|
| `preBuild`  | Install dependencies (`npm ci`)             |
| `build`     | Compile TypeScript and bundle with Vite     |
| `artifacts` | Tell Amplify where the final output files are |
| `cache`     | Speed up builds by caching `node_modules`   |

---

## 2. AWS Amplify JS Library

### What is it?

`aws-amplify` is an **npm package** (not the hosting service — same name, different thing) that provides ready-made functions for connecting your frontend to AWS backend services.

In this app we use it for two things:
- Configuring the app to connect to Cognito
- Calling authentication functions (sign in, sign up, etc.)

### How it's used

In `src/main.tsx` (the app entry point):

```typescript
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";

Amplify.configure(awsExports); // Connect the app to your AWS services
```

`aws-exports.ts` holds the configuration (which Cognito user pool to use):

```typescript
const awsExports = {
    Auth: {
        Cognito: {
            userPoolId: 'us-east-1_0i1Eqq4hb',
            userPoolClientId: '1fic7mei574c91ttnrfj3dait7',
        },
    },
};
```

This is the "glue" that tells the Amplify library where your AWS services live.

---

## 3. AWS Cognito (Authentication)

### What is it?

AWS Cognito is a **managed authentication service**. It handles:
- User registration and login
- Password storage (securely hashed — you never store raw passwords)
- Email verification
- Token issuance (JWT tokens for secure API access)

Think of it as a ready-built login system you don't have to build yourself.

### Key Cognito Concepts

| Concept              | What it means                                                   |
|----------------------|-----------------------------------------------------------------|
| **User Pool**        | A directory of users — stores usernames, emails, passwords      |
| **User Pool Client** | An "app" that is allowed to talk to the User Pool               |
| **User Pool ID**     | Unique identifier for your user directory (`us-east-1_0i1Eqq4hb`) |
| **Client ID**        | Identifier for this specific app (`1fic7mei574c91ttnrfj3dait7`) |
| **JWT Token**        | A signed token Cognito gives after login — proves who you are   |
| **ID Token**         | Contains user identity info — used to call protected APIs       |

### How it's used in this app

All auth calls live in `src/services/auth.ts`:

```typescript
import { signIn, signUp, signOut, confirmSignUp, fetchUserAttributes, resendSignUpCode } from 'aws-amplify/auth';
```

| Function in code         | What it does                                         |
|--------------------------|------------------------------------------------------|
| `signUp()`               | Creates a new user in Cognito (sends verification email) |
| `confirmSignUp()`        | Confirms the user's email with the 6-digit code      |
| `signIn()`               | Authenticates the user, receives JWT tokens          |
| `signOut()`              | Clears the session tokens                            |
| `fetchUserAttributes()`  | Gets the logged-in user's profile (email, etc.)      |
| `resendSignUpCode()`     | Resends the verification email                       |

### The Authentication Flow (Step by Step)

```
User fills Sign Up form
        ↓
signUp() → Cognito creates user, sends email with 6-digit code
        ↓
User enters code
        ↓
confirmSignUp() → Cognito marks user as verified
        ↓
signIn() → Cognito returns ID Token + Access Token + Refresh Token
        ↓
App stores tokens in browser (handled automatically by Amplify)
        ↓
User is now authenticated
```

### Tokens Explained

After `signIn()`, Cognito issues three tokens:

| Token             | Purpose                                                    |
|-------------------|------------------------------------------------------------|
| **ID Token**      | Who you are — contains your email, user ID, etc.          |
| **Access Token**  | What you can do — used for authorizing API calls           |
| **Refresh Token** | Renews your ID/Access tokens when they expire (after 1hr) |

In this app, the **ID Token** is sent as an `Authorization` header to the API Gateway to prove the user is logged in.

---

## 4. AWS API Gateway (REST API)

### What is it?

AWS API Gateway is a managed service that creates **HTTP endpoints** (URLs) for your backend. It acts as the "front door" to your backend logic (Lambda functions).

Instead of running a Node/Express server yourself, API Gateway handles:
- Routing (which URL goes where)
- Authentication checks (validate Cognito tokens)
- Rate limiting
- HTTPS by default

### How it's used in this app

The API base URL is in `src/services/game-history.ts`:

```typescript
const API_URL = 'https://7qomogay07.execute-api.us-east-1.amazonaws.com/prod';
```

Breaking this URL down:

| Part                              | Meaning                                      |
|-----------------------------------|----------------------------------------------|
| `7qomogay07`                      | Unique API Gateway ID                        |
| `execute-api.us-east-1.amazonaws.com` | AWS API Gateway service in us-east-1 region |
| `/prod`                           | The deployment stage (could also be `/dev`, `/staging`) |

### API Endpoints

| Method | Path          | Auth Required | Description                    |
|--------|---------------|---------------|--------------------------------|
| `POST` | `/games`      | Yes           | Save a completed game          |
| `GET`  | `/games`      | Yes           | Fetch the logged-in user's games |
| `GET`  | `/leaderboard`| No            | Fetch the global leaderboard   |

### How Auth is passed to the API

When calling protected endpoints, the app sends the **Cognito ID Token** in the `Authorization` header:

```typescript
async function getToken(): Promise<string> {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    return token;
}

// Then used like this:
fetch(`${API_URL}/games`, {
    headers: { 'Authorization': token }
});
```

API Gateway is configured with a **Cognito Authorizer** — it automatically validates the token and rejects requests with invalid/missing tokens.

---

## 5. AWS Lambda (Serverless Functions)

### What is it?

AWS Lambda lets you run code **without managing servers**. You write a function, upload it, and AWS runs it on demand when the API Gateway receives a request.

**Serverless** means:
- No server to provision, patch, or maintain
- You only pay when the function actually runs
- AWS automatically scales it (handles 1 request or 10,000 with the same config)

### How it works in this app

When the frontend calls `POST /games`, the flow is:

```
React App
    ↓  (HTTP POST with JSON body + Authorization header)
API Gateway
    ↓  (validates Cognito token, extracts user ID)
Lambda Function
    ↓  (receives event with body + user context)
DynamoDB
    ↓  (stores the game record)
Lambda Function
    ↓  (returns 200 OK)
API Gateway
    ↓  (forwards response)
React App  ✓
```

A Lambda function typically looks like this (conceptual example):

```javascript
exports.handler = async (event) => {
    const userId = event.requestContext.authorizer.claims.sub; // from Cognito token
    const { winner, boardSize, username } = JSON.parse(event.body);
    
    // Save to DynamoDB...
    
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
```

### Key Lambda Concepts

| Concept         | What it means                                                     |
|-----------------|-------------------------------------------------------------------|
| **Handler**     | The entry function AWS calls when the Lambda is triggered         |
| **Event**       | The input data (HTTP request details, body, headers, etc.)        |
| **Cold Start**  | First invocation may be slower (AWS spins up a new container)     |
| **Timeout**     | Max execution time (default 3s, configurable up to 15 min)        |
| **Memory**      | Allocate RAM — more RAM = faster CPU too                          |

---

## 6. AWS DynamoDB (Database)

### What is it?

DynamoDB is AWS's fully managed **NoSQL database**. Unlike SQL databases (MySQL, PostgreSQL), it stores data as flexible key-value or document records.

It's designed for:
- High-speed reads and writes at any scale
- Schemaless data (each item can have different attributes)
- Zero server management

### Key DynamoDB Concepts

| Concept              | What it means                                                    |
|----------------------|------------------------------------------------------------------|
| **Table**            | A collection of items (like a SQL table, but schemaless)        |
| **Item**             | A single record (like a row in SQL)                             |
| **Partition Key**    | The primary key — determines which "partition" stores the item  |
| **Sort Key**         | Optional secondary key — allows range queries within a partition |
| **GSI (Global Secondary Index)** | An extra index for querying by non-primary-key attributes |

### How it's used in this app

The app likely uses two DynamoDB tables:

**Games Table** (for game history):

| Attribute    | Type   | Role                              |
|--------------|--------|-----------------------------------|
| `userId`     | String | Partition Key — which user        |
| `playedAt`   | String | Sort Key — timestamp (ISO format) |
| `gameId`     | String | Unique game identifier (UUID)     |
| `winner`     | String | "X", "O", or "Draw"               |
| `boardSize`  | Number | 3, 4, 5, or 6                    |
| `username`   | String | The user's email                  |

**Leaderboard Table** (or derived from Games table via a scan/aggregation):

| Attribute     | Type   | Description                |
|---------------|--------|----------------------------|
| `userId`      | String | Partition Key               |
| `username`    | String | Display name                |
| `wins`        | Number | Total wins                  |
| `draws`       | Number | Total draws                 |
| `totalGames`  | Number | All games played            |

### Why NoSQL over SQL here?

- Game records are simple, flat documents — no complex joins needed
- DynamoDB's key-based lookups (`userId` → all games for that user) are extremely fast
- Serverless — no database server to manage, scales automatically

---

## 7. How All Services Connect

Here is the complete data flow for each action in the app:

### Sign Up / Login

```
Browser  →  aws-amplify  →  AWS Cognito User Pool
                               ↓
                         Issues JWT Tokens
                               ↓
                         Stored in browser (localStorage/sessionStorage)
```

### Save a Game

```
TicTacToe component (game ends)
    ↓
saveGame(winner, boardSize, username)  [game-history.ts]
    ↓
fetchAuthSession() → gets ID Token from Cognito session
    ↓
POST https://...execute-api.../prod/games
    Headers: { Authorization: <ID Token> }
    Body: { winner, boardSize, username }
    ↓
API Gateway → validates token with Cognito Authorizer
    ↓
Lambda function → extracts userId from token claims
    ↓
DynamoDB PutItem → stores game record
    ↓
200 OK → back to the app
```

### View Game History

```
User clicks "My History"
    ↓
fetchGames()  [game-history.ts]
    ↓
GET https://...execute-api.../prod/games
    Headers: { Authorization: <ID Token> }
    ↓
API Gateway → validates token
    ↓
Lambda → queries DynamoDB for items where userId = <current user>
    ↓
Returns array of GameRecord objects
    ↓
App renders the history table
```

### View Leaderboard

```
User clicks "Leaderboard"
    ↓
fetchLeaderboard()  [game-history.ts]
    ↓
GET https://...execute-api.../prod/leaderboard
    (No Authorization header — public endpoint)
    ↓
Lambda → scans/queries DynamoDB for aggregated stats
    ↓
Returns array of LeaderboardEntry objects
    ↓
App renders the leaderboard table
```

---

## 8. Key Terms Quick Reference

| Term                    | Plain English                                                   |
|-------------------------|-----------------------------------------------------------------|
| **Region** (`us-east-1`)| Physical AWS data center location (Northern Virginia)           |
| **Serverless**          | Run code without managing servers — AWS handles infrastructure  |
| **JWT (JSON Web Token)**| A signed, compact token that proves who you are                 |
| **REST API**            | An API that uses standard HTTP methods (GET, POST, PUT, DELETE) |
| **CI/CD**               | Automatically build and deploy code on every git push           |
| **CDN**                 | Content Delivery Network — serves files from servers near users |
| **NoSQL**               | A database that doesn't use tables/rows/SQL — uses documents    |
| **Partition Key**       | The main key DynamoDB uses to locate and distribute data        |
| **Authorizer**          | A rule in API Gateway that validates tokens before passing through |
| **Stage** (`/prod`)     | A named deployment of your API (dev, staging, prod, etc.)       |
| **Cold Start**          | A Lambda's first execution after idle — slightly slower         |
| **Amplify Configure**   | One-time setup call that tells the Amplify library where your AWS services are |

---

## Summary: Why This Stack?

| Need                         | AWS Solution         | Why                                                    |
|------------------------------|----------------------|--------------------------------------------------------|
| Host the React app           | Amplify Hosting      | Zero-config CI/CD, scales automatically                |
| User login/signup            | Cognito              | Secure, managed — no rolling your own auth             |
| Protect API endpoints        | Cognito Authorizer   | Validate tokens without writing auth middleware        |
| HTTP API endpoints           | API Gateway          | Managed routing, HTTPS, rate limiting out of the box   |
| Business logic (backend)     | Lambda               | Serverless — pay per use, no servers to manage         |
| Store game data              | DynamoDB             | Fast key-based lookups, scales without config          |
