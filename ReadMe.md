# Evalur
## AI Workforce Readiness & Onboarding Platform
Evalur is a distributed full-stack B2B ecosystem designed to automate technical onboarding and validate engineering readiness. By bridging the gap between proprietary corporate documentation and active code execution, Evalur’s AI-driven RAG engine and secure sandbox simulate real-world developer environments, drastically reducing the time-to-first-commit for new hires.

---

## 1. Platform Vision & Core Architecture
Traditional technical assessments test generic syntax memory. Evalur addresses this inefficiency by evaluating how effectively an engineer can navigate, understand, and write code against a company's specific, proprietary internal architecture.

### I. Proprietary Knowledge Ingestion (RAG Pipeline)
Engineering managers can upload unstructured internal documentation (PDFs, Markdown) or connect read-only GitHub repositories. The LangChain4j-powered orchestrator parses and vectorizes this data to synthesize highly contextual, company-specific technical challenges, eliminating the need for manual test creation.

### II. Multi-Layered Assessment Engine
Evalur moves beyond standard testing by implementing a three-tier readiness evaluation:

- **Knowledge Layer:** Deterministic checks (MCQs) verifying comprehension of internal APIs, compliance rules, and architecture specifications. 
- **Judgment Layer:** Timed, scenario-based debugging questions testing how a developer responds to simulated production issues based on company policy. 
- **Execution Layer:** Real-world coding tasks requiring the developer to fix or build features using sanitized corporate boilerplate.
### III. Open-Book Secure Code Sandbox
To simulate realistic working conditions, Evalur utilizes a split-screen interface. Candidates have access to ingested internal documentation alongside an isolated, headless code execution environment. Submissions are validated in real-time against predefined internal test cases.

---

## 2. Technical Stack
### Frontend (Client)
- **Core:** React 19 (Concurrent Rendering) 
- **Build Tool:** Vite 8 
- **State Management:** TanStack Query v5 
- **Styling:** Tailwind CSS v4 (Lightning CSS Engine) 
- **Validation:** Zod (Runtime Schema Validation) 
- **API Client:** Axios
### Backend (Server & AI Pipeline)
- **Framework:** Java Spring Boot 3.x 
- **AI Orchestrator:** LangChain4j (Chunking, Embeddings, LLM Prompting) 
- **Data Parsing:** LlamaParse (for complex PDF/Table extraction) & Native Markdown Loaders 
- **Security:** Stateless JWT-based Authentication & RBAC 
- **Persistence:** PostgreSQL with Spring Data JPA / Hibernate (PinecodeDB for Vector storage integration) 
- **Environment:** `io.github.cdimascio.dotenv`  for secure secret management 
- **Build Tool:** Maven
---

## 3. Organizational Structure (RBAC)
The system utilizes a four-tier permission model tailored for B2B enterprise scalability:

| Role | Access Level | Primary Responsibility |
| ----- | ----- | ----- |
| **Platform Admin** | Global | Infrastructure health, analytics, and tenant onboarding |
| **Corporate Admin** | Organizational | Department management, billing, and global configurations |
| **Engineering Manager** | Department | Knowledge ingestion, assessment generation, and evaluation |
| **Candidate / Employee** | User | Participation in assessments and onboarding modules |
---

## 4. Local Setup & Installation
### Prerequisites
- Java JDK 17+ 
- Node.js v22+ (LTS) 
- PostgreSQL, PineconeDB (Online Instances)
- Maven 3.8+
### Execution Steps
#### 1. Clone the Repository
```bash
git clone https://github.com/DesignNCode-Tech/Evalur.git

cd Evalur
```
#### 2. Backend Initialization
```
cd server/evalur
# Configure local environment (Refer to .env.example for DB and AI API keys)
cp .env.example .env
mvn clean install
mvn spring-boot:run
```
#### 3. Frontend Initialization
```bash
cd client

npm install --legacy-peer-deps
npm run dev
```
## 👥 Contributors (Team-1)
- **@dev-shreyash** - Lead Architect & Full-Stack development
- **@pavankumar1908** - Team Lead & Full-Stack development
- **@Namiramulla22** - Full-Stack development

---

