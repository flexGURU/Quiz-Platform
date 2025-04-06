# CSC3094 Dissertation: Gamified Quiz Application with Role-Based Access Control

## 1. Introduction

### Motivation
- Growing demand for interactive e-learning tools in post-pandemic education
- Need for adaptive assessment systems that reward progressive learning
- Gap in existing solutions: lack of integrated point-based motivation systems with granular RBAC

### Aims & Objectives (SMART Framework)
1. **Specific**: Develop an Angular/Supabase quiz app with 3-tier role management (admin/teacher/student)
2. **Measurable**: Implement 5 core features (bulk quiz import, timed tests, scoring, leaderboard, RBAC)
3. **Achievable**: Leverage Supabase BaaS for 90% backend functionality
4. **Relevant**: Aligns with digital education trends (QAA Digital Literacy Framework)
5. **Time-bound**: 12-week development cycle

### Dissertation Structure
1. Background review of EdTech systems
2. System architecture decisions
3. Implementation challenges
4. Evaluation against learning outcomes
5. Future enhancements

## 2. Background Review

### Key Literature
- **Pedagogical Foundations**:
  - Bloom's Taxonomy for question difficulty levels (Anderson & Krathwohl, 2001)
  - Gamification in education (Deterding et al., 2011)

### Technical Landscape
- **Supabase Advantages**:
  - PostgreSQL triggers for point calculation
  - Row-Level Security for RBAC implementation
- **Angular Architecture**:
  - Observable pattern for state management
  - PrimeNG vs Tailwind design tradeoffs

### Commercial Solutions
- Comparison with Kahoot!, Quizlet (feature matrix included in Appendix A)

## 3. System Design & Implementation

### Architectural Overview
```mermaid
graph TD
    A[Angular Frontend] -->|HTTP| B[Supabase API]
    B --> C[(PostgreSQL DB)]
    C --> D[Triggers]
    D --> E[Points Calculation]