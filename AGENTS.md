# Evalur Platform - AI Coding Agent Instructions

## Project Overview
Evalur is a B2B AI-driven workforce readiness and onboarding platform with secure exam environments, multi-layered assessments, and RAG AI capabilities. The codebase consists of a React/TypeScript frontend (client) and Spring Boot/Java backend (server) with PostgreSQL and AI integrations.

## Build & Test Commands
### Frontend (Client)
- **Dev Server**: `npm run dev` (Vite with HMR)
- **Build**: `npm run build` (TypeScript + Vite production build)
- **Lint**: `npm run lint` (ESLint)
- **Preview**: `npm run preview` (serve built app)
- **No tests configured** - add Vitest/Jest for unit/integration tests

### Backend (Server)
- **Compile**: `./mvnw clean compile`
- **Test**: `./mvnw test`
- **Run**: `./mvnw spring-boot:run`
- **Package**: `./mvnw clean package`
- **Full Build**: `./mvnw clean install`

## Architecture & Conventions
### Frontend
- **Framework**: React 19 with Vite 8, React Compiler enabled
- **Structure**: Feature-based organization (`src/feature/{feature}/`)
- **State**: TanStack Query for server state, Context API for client state
- **Routing**: React Router v7 with `ProtectedRoute`/`PublicRoute` guards
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Validation**: Zod schemas with React Hook Form
- **Imports**: Absolute paths with `@/` alias, barrel exports in feature indexes
- **Naming**: PascalCase for components/pages, camelCase for hooks/schemas

### Backend
- **Framework**: Spring Boot 4.0.3 with Java 21
- **Architecture**: Domain-Driven Design (Controller → Service → Repository → Entity)
- **Security**: JWT authentication with RBAC (ADMIN > MANAGER > STAFF > CANDIDATE)
- **Database**: PostgreSQL with PGVector for AI embeddings
- **AI**: LangChain4j with Google Gemini and LlamaParse
- **Config**: Environment variables via `.env` files
- **Entities**: Extend `BaseEntity` with JPA auditing
- **Naming**: Java camelCase, DB snake_case via Hibernate

## Common Pitfalls
- **Frontend**: No tests; localStorage-based auth (XSS risk); no global error boundaries; React 19 bleeding-edge
- **Backend**: Requires `.env` file; DDL auto-update in dev; lazy loading N+1 queries; hardcoded DB names
- **Cross-cutting**: No CI/CD visible; API quota limits unenforced; multi-tenant isolation incomplete

## Key Files
- [Root README](ReadMe.md) - Platform vision and tech stack
- [Client README](client/README.md) - Frontend setup
- `client/package.json` - Frontend dependencies and scripts
- `server/evalur/pom.xml` - Backend dependencies
- `server/evalur/src/main/resources/application.properties` - Backend config
- `client/src/app/router/AppRouter.tsx` - Frontend routing
- `server/evalur/src/main/java/com/evalur/` - Backend source root

## Development Workflow
1. **Setup**: Clone repo, install Node.js/Java, copy `.env.example` to `.env`
2. **Frontend**: `cd client && npm install && npm run dev`
3. **Backend**: `cd server/evalur && ./mvnw clean install && ./mvnw spring-boot:run`
4. **Database**: Ensure PostgreSQL with PGVector extension running
5. **Testing**: Add tests as you develop; run `./mvnw test` for backend

For detailed setup, see [Root README](ReadMe.md).</content>
<parameter name="filePath">d:\Team1\AGENTS.md