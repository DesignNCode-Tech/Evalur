# Evalur
### Unified Generative Assessment & High-Integrity Proctoring Platform

Evalur is a distributed full-stack ecosystem designed to automate academic content creation and secure the integrity of digital assessments. The platform bridges the gap between raw study materials and actionable pedagogical insights through an AI-driven generative engine and a hardened proctored testing environment.

---

## 1. Project Vision & Core Concepts

Traditional assessment workflows are often fragmented and manual. Evalur addresses these inefficiencies by providing an end-to-end pipeline from content ingestion to automated grading.

### I. AI-Powered Content Creation
The **Generative Assessment Engine** allows teaching staff to upload unstructured study materials (PDFs, lecture notes, or Markdown files). The engine automatically parses the text to synthesize context-aware multiple-choice questions and technical challenges, significantly reducing administrative overhead.

### II. Secure Testing Environment
To maintain academic integrity in remote environments, Evalur implements a dual-layered security protocol:

* **Browser Proctoring**: Enforces a secure perimeter via mandatory fullscreen mode, tab-switch detection (triggering automated warnings or session termination), and clipboard inhibition to prevent plagiarism.
* **Integrated Code Sandbox**: A built-in execution environment for technical evaluations. Submissions are validated in real-time against predefined test cases within an isolated headless environment.

### III. Automated Results & Staff Analytics

* **Instant Evaluation**: Deterministic (MCQ) and programmatic (Code) submissions are graded immediately upon completion.
* **Pedagogical Insights**: Aggregated data visualizations highlight class-wide knowledge gaps, allowing educators to identify specific topics requiring additional instructional support.

---

## 2. Technical Stack

### Frontend (Client)

* **Core**: React 19 (Concurrent Rendering)
* **Build Tool**: Vite 8
* **State Management**: TanStack Query v5
* **Styling**: Tailwind CSS v4 (Lightning CSS engine)
* **Validation**: Zod (Runtime Schema Validation)
* **API Client**: Axios

### Backend (Server)

* **Framework**: Java Spring Boot 3.x
* **Security**: Stateless JWT-based Authentication & RBAC
* **Persistence**: MySQL 8.x with Spring Data JPA / Hibernate
* **Environment**: `io.github.cdimascio.dotenv` for secure secret management
* **Build Tool**: Maven

---

## 3. Organizational Structure (RBAC)

The system utilizes a four-tier permission model to ensure institutional scalability:

| Role | Access Level | Primary Responsibility |
| :--- | :--- | :--- |
| **Website Admin** | Global | Infrastructure health, analytics, and institutional onboarding. |
| **Institution Admin** | Organizational | Management of staff rosters and student cohorts. |
| **Teaching Staff** | Curriculum | Content ingestion, assessment logic, and grading audits. |
| **User** | Candidate | Secure participation in assessments and performance tracking. |

---

## 4. Engineering & Development Strategy

To maintain high code quality within the **DesignNCode-Tech** organization, the project follows these professional engineering protocols:

### I. Git Workflow & Branching

We utilize a feature-branching strategy to ensure the `main` branch remains deployable at all times:

* **Feature Isolation**: All new logic is developed in dedicated `feature/` branches.
* **Peer Review**: No code is merged into the `develop` or `main` branches without a formal Pull Request (PR) and approval from at least one other team member.
* **Commit Standards**: We follow conventional commit messages to maintain a readable project history.

### II. Environment & Configuration Parity

* **Secret Management**: All sensitive data (DB credentials, JWT keys, AI API tokens) are strictly externalized via `.env` files.
* **Schema Consistency**: We enforce end-to-end type safety. API response structures are mirrored between the Spring Boot service and the React client using TypeScript interfaces and Zod schemas.
* **Cross-Platform Compatibility**: The project is configured to run consistently across Windows, macOS, and Linux environments.

### III. CI/CD & Static Analysis

* **Frontend**: ESLint and Prettier are enforced to maintain a unified coding style and prevent syntax regressions.
* **Backend**: Strict Java 17 typing and Maven-based build verification are used to ensure service-layer stability during the integration phase.

---

## 5. Local Setup & Installation

### Prerequisites

* Java JDK 17+
* Node.js v22+ (LTS)
* MySQL Server 8.x
* Maven 3.8+

### Execution Steps

**1. Clone the Repository**

```bash
git clone https://github.com/DesignNCode-Tech/Evalur.git
cd Evalur
```

**2. Backend Initialization**

```bash
cd server/evalur
# Configure local environment (Refer to .env.example)
cp .env.example .env
mvn clean install
mvn spring-boot:run
```

**3. Frontend Initialization**

```bash
cd client
npm install --legacy-peer-deps
npm run dev
```

---

## 👥 Contributors (Team-1)

* **[@dev-shreyash](https://github.com/dev-shreyash)** — Lead Architect & Full-Stack development 
* **[@pavankumar1908](https://github.com/pavankumar1908)** — Team Lead & Full-Stack development 
* **[@Namiramulla22](https://github.com/Namiramulla22)** — Full-Stack development 

*Maintained within the DesignNCode-Tech Organization.*

---
