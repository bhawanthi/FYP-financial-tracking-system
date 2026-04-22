# Final Year Project Report

## Front Cover Page

Project Title: MONIVUE - Intelligent Personal Finance Tracking and Decision Support Platform  
Project Type: Undergraduate Final Year Computing Project  
Student Name: [Insert Student Name]  
Student ID: [Insert Student ID]  
Degree Program: [Insert Program Name]  
Department: [Insert Department]  
Institution: [Insert Institution]  
Supervisor: [Insert Supervisor Name]  
Submission Date: [Insert Date]  
Academic Year: 2025/2026

---

## Acknowledgements

I would like to express my sincere gratitude to everyone who contributed to the successful completion of this final year project. First, I thank my project supervisor for continuous guidance, technical direction, constructive feedback, and encouragement throughout the planning, implementation, and documentation stages. The supervisor's advice was especially valuable when shaping the project scope from a basic transaction logging tool into a broader intelligent finance platform with analytics and recommendation capabilities.

I am grateful to the academic staff of the department for teaching the theoretical and practical foundations that enabled this work. Modules in software engineering, database systems, web development, cloud-oriented thinking, and data analytics directly influenced the architectural and implementation decisions presented in this report.

I also appreciate my friends and peers for reviewing early prototypes and providing honest user experience feedback. Their observations on clarity of dashboards, usability of forms, and practical concerns about budgeting workflows helped improve the quality of the final system. I further acknowledge open-source communities and documentation maintainers whose libraries and technical guides supported this implementation, particularly in the Node.js, React, MongoDB, and testing ecosystems.

Finally, I thank my family for their patience, support, and motivation during the project period. Their encouragement helped me maintain consistency across development, testing, and report writing phases.

---

## Abstract

Personal financial management remains a persistent challenge for students and early-career professionals, especially when spending records are fragmented, budgets are unmanaged, and future planning decisions are made with limited data visibility. This project presents MONIVUE, a full-stack personal finance platform designed to centralize core financial operations and augment them with intelligent analytics. The system enables secure account management, transaction lifecycle operations, budget planning, savings goal tracking, report generation, and AI-assisted insights in a single integrated application.

The backend is implemented using Node.js, Express, and MongoDB with Mongoose data models. Security controls include JWT-based authentication, hashed credentials using bcrypt, and ownership checks across sensitive resources. The frontend is implemented in React with route-based navigation, protected pages, interactive forms, and data visualizations for user understanding. Reporting features provide analytics summaries and export outputs in PDF and Excel formats, supporting practical usage and evidence generation. A chatbot-style assistant and notification subsystem extend user engagement through contextual guidance and scheduled financial summaries.

To increase technical depth beyond CRUD functionality, the project includes analytical modules that apply statistical methods for spending prediction, budget risk interpretation, anomaly detection, and financial health scoring. Market-oriented components incorporate external data concepts through integrations documented as Finnhub API and Colombo Stock Exchange API (CSE API), with controlled fallback strategies where live keys are unavailable. This reflects realistic engineering patterns where external dependencies require resilient behavior.

Testing was conducted through backend unit and integration tests using Jest and Supertest, alongside frontend component tests for authentication workflows. The evaluation demonstrates that core finance management flows are functionally complete and robust for prototype-level deployment. Critical reflections identify remaining improvement opportunities, including data contract harmonization in selected advanced modules, greater AI module test depth, and production-grade hardening such as centralized validation and broader observability.

Overall, MONIVUE demonstrates a credible undergraduate capstone outcome by combining full-stack engineering, applied analytics, practical security controls, test-driven quality evidence, and realistic technical debt analysis. The project contributes a usable finance platform while also serving as a strong foundation for future research on explainable recommendations, behavioral finance nudges, and improved model validation in personal finance decision support systems.

Keywords: personal finance, MERN architecture, predictive analytics, budgeting system, goal tracking, anomaly detection, software engineering, undergraduate capstone.

---

## Table of Contents

1. Introduction  
2. Background, Objectives, and Deliverables  
3. Literature Review  
4. Method of Approach  
5. Requirements Specification  
6. End-Project Report (Design, Implementation, and Evaluation)  
7. Project Post-Mortem  
8. Conclusions  
9. Reference List  
10. Bibliography  
11. Appendices  
11.1 User Guide  
11.2 Project Source Code Link  
11.3 GitHub Commit History and Repository Link  
11.4 Project Initiation Document (PID)  
11.5 Interim Reports  
11.6 Records of Supervisory Meetings  
11.7 Additional Artifacts (Designs, Test Results, and Supporting Material)

---

## List of Figures and Tables

Figure 1: Three-Layer MONIVUE Architecture  
Figure 2: API Request-Response Flow  
Figure 3: Authenticated User Journey  
Figure 4: Data Model Relationship View  
Figure 5: Reports Pipeline  
Figure 6: AI Insight Generation Flow  
Figure 7: Testing Pyramid Used in the Project  
Figure 8: Risk Register Heatmap

Table 1: Core Technology Stack  
Table 2: Functional Requirements Matrix  
Table 3: Non-Functional Requirements and Metrics  
Table 4: Endpoint Matrix by Module  
Table 5: Data Entities and Constraints  
Table 6: Test Coverage Matrix  
Table 7: Project Risks and Mitigations  
Table 8: Post-Mortem Lessons Learned

---

## 1. Introduction

### 1.1 Problem Context
                                                                                                                  Financial decision-making at individual level is often characterized by inconsistency, poor visibility, and low confidence. Students and early-career professionals usually track expenses across many disconnected channels such as paper notes, mobile wallet logs, bank statements, and memory. This fragmented pattern leads to delayed awareness of overspending and weak capacity for disciplined savings. Although many commercial fintech tools exist, they may introduce barriers such as complexity, subscription cost, regional mismatch, or information overload for beginners.
                                                                                                                   The practical challenge is therefore not merely recording transactions. The deeper challenge is helping users interpret behavior, align spending with goals, and take informed future-oriented actions. A meaningful solution should combine secure data capture, clear analytics, and understandable recommendation logic rather than forcing users to navigate opaque outputs.

### 1.2 Motivation for MONIVUE

MONIVUE was motivated by four key realities observed in target users:

1. Tracking money manually is difficult to maintain over time.
2. Budget discipline declines without timely, understandable feedback.
3. Savings goals fail when progress indicators are absent.
4. Users are interested in AI help, but need transparent and beginner-friendly output.

The project was therefore designed to provide an integrated personal finance environment where users can manage day-to-day records and receive data-driven support through dashboards, exports, alerts, and explainable intelligence modules.

### 1.3 Project Aim

The aim of this project is to design, implement, and evaluate a full-stack finance management platform that supports secure personal finance workflows and extends them with analytics and AI-assisted decision support.

### 1.4 Project Scope

In-scope capabilities include:

- User registration, authentication, and profile updates.
- Transaction CRUD with filtering and statistics.
- Budget setup, tracking, and threshold-based status interpretation.
- Savings goal management with contribution tracking and progress analysis.
- Reporting and export pipeline (analytics, PDF, Excel).
- Notification settings and scheduled summary email flow.
- Rule-based assistant interactions and analytics-oriented AI routes.
- Testing at both backend and frontend layers.

Out-of-scope items for this phase include:

- Enterprise-scale deployment with full observability stack.
- Institutional-grade model governance and audit frameworks.
- Real-time brokerage execution and direct trading integrations.
- Full legal and compliance implementation for regulated financial operations.

### 1.5 Research and Engineering Value

The project demonstrates value in both academic and practical dimensions. Academically, it illustrates end-to-end software engineering with architecture design, data modeling, security practices, testing strategy, and reflective evaluation. Technically, it goes beyond a simple CRUD prototype by combining aggregation analytics, export generation, scheduling, and statistical intelligence features. Product-wise, it addresses an everyday problem with direct social utility by supporting financial literacy and behavioral change.

### 1.6 Report Structure Overview

This report is organized to reflect both product outcomes and development processes. After introduction and background, it presents relevant literature and technologies, explains methodology, details requirements, and then provides an end-project implementation and evaluation narrative. The final chapters include post-mortem learning, conclusions, references, and appendices containing practical deployment and project management artifacts.

---

## 2. Background, Objectives, and Deliverables

### 2.1 Domain Background: Personal Finance Platforms

Personal finance systems traditionally focus on bookkeeping functions such as account tracking, transaction categorization, and periodic summaries. While such features are necessary, they are insufficient for long-term financial behavior change unless they are paired with insight mechanisms and actionable feedback. Research and industry trends show that users improve financial outcomes when systems provide contextual nudges, trend visibility, and realistic recommendations.

In the context of students and early-career workers, constraints such as variable income, limited investment literacy, and high impulse spending risk create a need for adaptive but simple tools. A project designed for this segment must prioritize clarity, accessibility, and practical automation.

### 2.2 Technical Background and Stack Rationale

MONIVUE uses a JavaScript full-stack approach to reduce integration overhead and accelerate development velocity.

- Node.js and Express were selected for backend API development due to ecosystem maturity, strong middleware patterns, and easy JSON-centric service design.
- MongoDB with Mongoose was selected for flexible document models suitable for evolving financial entities.
- React was selected for frontend interactivity and modular component composition.
- JWT and bcrypt were used for authentication and credential security.
- PDFKit and ExcelJS support report export use cases.
- node-cron and email service modules support asynchronous scheduled workflows.
- Jest and Supertest provide testing foundations for controller and route validation.

This stack supports rapid prototyping while retaining sufficient architecture discipline for a serious capstone implementation.

### 2.3 External Data and API Context

The project documentation and AI-market modules reference external market data integrations using:

- Finnhub API for live global market quotes and stock-related feeds.
- Colombo Stock Exchange API, abbreviated as CSE API, for Sri Lankan market context.

For this phase, integration behavior includes fallback strategies when credentials or remote responses are unavailable, preserving user-facing continuity while acknowledging prototype constraints.

### 2.4 Project Objectives

Primary objectives established at planning stage:

1. Build a secure and modular personal finance web platform.
2. Implement complete lifecycle management for key entities: transactions, budgets, and goals.
3. Provide analytics and reporting outputs consumable by non-expert users.
4. Add AI-assisted modules that produce understandable predictive and advisory insights.
5. Demonstrate software quality practices through meaningful testing and structured error handling.
6. Produce documentation suitable for both demonstration and academic reporting.

### 2.5 Deliverables

The project deliverables include software, documentation, and evaluation artifacts.

Software deliverables:

- Backend services implementing RESTful finance APIs.
- Frontend SPA implementing authenticated user journeys and analytics views.
- Data models and indexing patterns for transaction-heavy operations.
- Reporting and export modules for PDF and Excel outputs.
- AI and enhanced reporting modules including forecast and anomaly features.

Documentation deliverables:

- Technical architecture and reports documentation.
- Setup and API testing guides.
- Source-of-truth project summary for report generation.

Evaluation deliverables:

- Unit and integration test files for core backend modules.
- Frontend test coverage for critical authentication components.
- Risk and limitation analysis informing future hardening roadmap.

### 2.6 Success Criteria

Success was defined across functional and quality dimensions:

- Core user workflows operate end-to-end under authenticated access.
- Financial summaries are coherent and exportable.
- AI outputs are stable, plausible, and interpretable.
- Tests execute with meaningful pass coverage for core modules.
- System documentation enables reproducible demonstration.

These criteria were substantially met, with identified enhancement opportunities discussed in later chapters.

---

## 3. Literature Review

### 3.1 Personal Finance Management Systems

Digital personal finance systems have evolved from static accounting ledgers to adaptive decision-support interfaces. Early personal finance software emphasized record keeping and periodic balance calculation. More recent platforms integrate budgeting psychology, spending alerts, and predictive insights. Literature in human-computer interaction and financial behavior suggests that users need both descriptive analytics and prescriptive cues to sustain discipline.

Descriptive tools answer what happened, but prescriptive tools answer what should happen next. MONIVUE positions itself at this intersection by coupling transaction records and budget tracking with AI-assisted recommendations and anomaly interpretation.

### 3.2 Budgeting Theory and Behavioral Insights

Behavioral finance emphasizes that users do not always make decisions via purely rational optimization. Cognitive biases such as present bias, mental accounting, and loss aversion influence spending behavior. Budgeting systems therefore benefit from short feedback loops and milestone framing. A threshold model, such as alerting at 80 percent budget utilization, can trigger corrective action earlier than end-of-period summaries.

Goal-based savings modules similarly leverage commitment and progress salience. Visible progress percentages and milestone checkpoints make long-term objectives psychologically manageable. The MONIVUE goal subsystem reflects these ideas through contribution tracking, milestone generation, and progress visualization.

### 3.3 Full-Stack Architectural Practices for Data-Driven Apps

Three-tier architecture remains a practical standard for maintainable web systems: presentation layer, application/API layer, and data layer. This separation improves modularity, supports independent testing, and simplifies scaling decisions. In MERN-style systems, React provides composable interfaces, Express encapsulates service logic, and MongoDB manages document persistence.

Current software engineering literature highlights additional concerns for such systems:

- Security by design through token-based access control.
- Consistency through centralized middleware and validation.
- Observability through structured logs and metric collection.
- Reliability through fallback behavior and robust exception handling.

MONIVUE adopts most of these patterns in prototype form and identifies remaining improvements in the post-mortem.

### 3.4 Authentication and Authorization in Single-Page Applications

JWT-based authentication is widely used for stateless API systems due to simplicity and portability. Secure implementation requires short token lifetimes, protected storage handling, and strict ownership checks. Password hashing using bcrypt mitigates credential theft impact by preventing plaintext disclosure.

In personal finance applications, authorization boundaries are especially important since endpoints expose sensitive spending and income data. MONIVUE enforces route-level protection for finance-sensitive modules and applies resource ownership checks in controllers to reduce cross-user access risk.

### 3.5 Analytics and Explainable AI in Fintech Prototypes

AI in fintech spans complex institutional risk engines to lightweight user-facing predictors. For undergraduate systems, explainability and plausibility are often more important than model sophistication. Linear regression and statistical threshold methods remain suitable when datasets are small and explainability is required.

MONIVUE uses practical statistical models for spending prediction and anomaly detection with confidence-like indicators. This matches literature recommending transparent models during early-stage product development where user trust and interpretability are critical.

### 3.6 Forecasting in Expense Analytics

Expense forecasting can be performed using moving averages, seasonal decomposition, regression, or advanced neural methods. In constrained data settings, simple linear models provide stable baselines and low computational overhead. Confidence interpretation can be approximated using volatility measures such as coefficient of variation. MONIVUE applies this pattern by combining regression-like trend extrapolation with variance-informed confidence adjustment.

### 3.7 Anomaly Detection for Personal Spending

Anomaly detection in personal finance frequently relies on deviation-based methods where outliers are measured relative to category or period baselines. Z-score style thresholding is a common, interpretable method. The downside is potential sensitivity to sparse data and non-stationary behavior. Hence outputs should be interpreted as guidance signals rather than deterministic fraud flags.

MONIVUE aligns with this principle by framing anomalies as risk cues for user review.

### 3.8 Reporting and Export Functionality in Decision Support Systems

A significant usability factor in analytics systems is not only visual dashboards but also transferable outputs such as PDF and spreadsheet exports. These outputs support offline review, external discussion, and recordkeeping. Report generation pipelines therefore represent meaningful engineering complexity because they combine data aggregation, formatting, stream generation, and response delivery.

MONIVUE includes both PDF and Excel exports, which strengthens practical value and evaluation depth.

### 3.9 Testing Strategies for JavaScript Full-Stack Projects

Testing research recommends layered strategies:

- Unit tests for isolated logic.
- Integration tests for route behavior and contract validation.
- Component tests for UI flows.

Given capstone constraints, a focused strategy that ensures core-flow reliability is often preferable to broad but shallow test coverage. MONIVUE follows this pragmatic approach by testing auth and critical financial modules first while documenting advanced module coverage gaps for future work.

### 3.10 Synthesis and Gap Statement

The reviewed literature supports a system design that combines:

- Secure full-stack architecture.
- Budget and goal behavior mechanisms.
- Explainable analytics over opaque black-box predictions.
- Test-backed core functionality with transparent limitations.

MONIVUE addresses these themes and contributes a practical implementation tailored to student and early-career finance management while identifying realistic hardening steps for production readiness.

---

## 4. Method of Approach

### 4.1 Development Methodology

The project used an iterative and incremental approach influenced by agile principles. Work progressed through short implementation cycles focused on feature slices rather than isolated technical layers. Each cycle generally included requirement interpretation, schema and API design, frontend integration, manual verification, and then test additions for critical paths.

This methodology was selected because project requirements evolved as domain understanding improved. For example, initial budgeting features focused on static limits, but iteration introduced analytics and threshold logic after early dashboard experiments.

### 4.2 Work Breakdown and Phasing

The work was divided into the following practical phases:

1. Foundation setup: project structure, base routing, database connection, and auth scaffolding.
2. Core finance modules: transactions, budgets, goals, and categories.
3. Dashboard and reporting: analytics endpoints and export capabilities.
4. Intelligence features: predictive, anomaly, and recommendation modules.
5. User support services: notifications, scheduling, and chatbot assistance.
6. Quality pass: tests, bug fixes, documentation consolidation.

This sequencing reduced integration risk by establishing a stable core before adding advanced subsystems.

### 4.3 System Design Process

Design decisions followed a contract-first style at the API boundary. For each feature, expected request/response shapes were defined before UI binding. Mongoose models captured domain entities and constraints. Controller logic then implemented business rules and ownership checks. Frontend components consumed these APIs with token-based authentication and rendered stateful dashboards.

Where uncertainty existed, mock and fallback behavior was intentionally introduced. This was particularly relevant in external market data components to ensure demonstrable functionality without hard dependency on live APIs during development.

### 4.4 Data Modeling Method

Data modeling prioritized clarity and practical query performance. Core entities included user profiles, transactions, budgets, goals, categories, and investment constructs. Transaction-heavy operations were supported by indexing patterns for user, date, type, and category filters. Flexible document structures in MongoDB allowed incremental enhancement, including nested arrays for budget categories and goal contribution histories.

Trade-offs were recognized: flexible schemas accelerate iteration but can increase consistency risk if naming conventions are not strictly harmonized. This risk is discussed in post-mortem sections.

### 4.5 Security and Access Strategy

Security implementation focused on baseline production-aware controls suitable for capstone scope:

- Credential hashing with bcrypt.
- JWT generation and verification.
- Route protection via auth middleware.
- Ownership checks before resource modifications.
- Controlled exposure of sensitive operations.

This strategy does not claim enterprise completeness but provides a credible secure-by-default baseline for an educational platform.

### 4.6 Testing Strategy and Validation Method

Testing followed a risk-driven prioritization approach. Highest priority was assigned to authentication and critical data mutation workflows where failures could compromise correctness or security. Backend tests used Jest and Supertest with mocked models. Frontend tests used React Testing Library with API mocking for auth components.

Validation combined automated tests and scenario-based manual walkthroughs across major user journeys:

- Register and login.
- Create income and expense transactions.
- Set budget and monitor utilization.
- Create goal and contribute progress.
- Generate reports and exports.
- Update profile and notification preferences.

### 4.7 Evaluation Framework

The project was evaluated through four lenses:

1. Functional correctness: endpoint and workflow behavior.
2. Quality attributes: security, reliability, usability, and maintainability.
3. Analytical plausibility: reasonableness of forecast and anomaly outputs.
4. Engineering maturity: modular design, testing discipline, and debt transparency.

This framework aligns with academic expectations for balanced technical and reflective assessment.

### 4.8 Risk Management Approach

A practical risk register was maintained conceptually during development with emphasis on:

- Integration mismatch risk between frontend and backend routes.
- Data contract inconsistency across advanced modules.
- External API dependency failures.
- Time constraints affecting test depth.

Mitigation involved fallback logic, incremental integration checks, and clear documentation of unresolved items to avoid overclaiming.

### 4.9 Documentation Method

Documentation was developed in parallel with implementation rather than deferred to project end. This improved traceability and simplified final report preparation. Technical summaries, setup guides, and API references were maintained to support reproducibility and assessment readiness.

### 4.10 Methodological Reflection

The iterative method proved effective for balancing breadth and depth. The main limitation was that fast feature expansion in advanced analytics introduced occasional consistency debt that would benefit from earlier centralized schema contracts. This insight informs future process improvements presented in the post-mortem chapter.

---

## 5. Requirements Specification

### 5.1 Functional Requirements

FR1: User Registration and Login  
The system shall allow users to register with required credentials and authenticate using username or email.

FR2: Profile Management  
The system shall allow authenticated users to update profile details and optionally change password with verification.

FR3: Transaction Management  
The system shall support create, read, update, and delete operations for income and expense transactions.

FR4: Transaction Analytics  
The system shall provide transaction summaries and period-based statistics.

FR5: Budget Management  
The system shall allow users to create, update, delete, and analyze period-based budgets.

FR6: Goal Management  
The system shall support savings goals, contributions, progress tracking, and feasibility analysis.

FR7: Category Management  
The system shall provide category retrieval and default category seeding behavior.

FR8: Reports and Exports  
The system shall generate analytics outputs and allow PDF and Excel exports.

FR9: Notification Preferences  
The system shall allow users to configure frequency and content preferences for summary notifications.

FR10: Scheduled Notifications  
The system shall support scheduler-driven summary processing based on configured frequencies.

FR11: AI-Assisted Insights  
The system shall provide predictive, recommendation, and anomaly-oriented analytics endpoints.

FR12: Chatbot Assistance  
The system shall provide guidance responses for user support and financial feature orientation.

### 5.2 Non-Functional Requirements

NFR1: Security  
Credentials must be hashed. Protected endpoints require valid tokens. Resource ownership must be enforced.

NFR2: Performance  
Common dashboard and analytics operations should respond within acceptable user-facing latency for prototype workloads.

NFR3: Reliability  
Controllers should handle failures gracefully and return structured errors without crashing the service.

NFR4: Usability  
Core workflows should be completable by target users without extensive onboarding.

NFR5: Maintainability  
System should preserve modular separation across routes, controllers, models, and services.

NFR6: Reproducibility  
Project setup should be executable with documented dependency and environment steps.

### 5.3 Constraints and Assumptions

- Development timeline constrained by academic semester deadlines.
- System assumed to run in local development environment for demonstration.
- External market API credentials may not always be available; fallback behavior required.
- Dataset size for testing may not represent enterprise-scale transaction volume.

### 5.4 Acceptance Criteria Summary

A requirement is accepted when:

- API contract behavior is verified through manual test and/or automated tests.
- Frontend workflow is functional with authenticated flow where required.
- Outputs are coherent and traceable to underlying data.
- Error paths return understandable responses.

### 5.5 Traceability Overview

The implemented system provides direct traceability from requirements to modules:

- FR1, FR2 -> auth APIs and profile flows.
- FR3, FR4 -> transaction module and stats endpoints.
- FR5 -> budget module and analytics endpoint.
- FR6 -> goals module with contributions and analysis.
- FR8 -> reports routes and frontend reports interface.
- FR9, FR10 -> notifications APIs and scheduler service.
- FR11 -> AI routes and ML service routines.
- FR12 -> chatbot route and frontend assistant integration.

### 5.6 Prioritization

Must-have requirements were authentication, transactions, budgets, goals, reports, and secure access boundaries. Should-have requirements included notifications and advanced analytics. Could-have items for future phases include expanded model rigor, observability dashboards, and broader integration test automation.

---

## 6. End-Project Report (Design, Implementation, and Evaluation)

### 6.1 High-Level Architecture

MONIVUE follows a three-layer architecture:

- Presentation Layer: React single-page application.
- Application Layer: Express routes, controllers, and services.
- Data Layer: MongoDB collections modeled by Mongoose schemas.

A typical request flow is:

1. User action triggers frontend API call.
2. Request includes bearer token where required.
3. Route and middleware validate access.
4. Controller executes business logic.
5. Mongoose performs persistence or aggregation.
6. JSON response drives UI updates and visualization.

This architecture supports modularity and clear responsibility boundaries.

### 6.2 Backend Implementation Summary

The backend initializes environment configuration, middleware, MongoDB connection retry handling, scheduler initialization after successful DB connection, and route mounting for all major modules. Current mounted routes include authentication, transactions, budgets, goals, categories, reports, enhanced reports, bank ratings, investments, notifications, chatbot, and AI modules.

This route mounting status is important academically because it shows broader runtime activation than earlier drafts that treated some advanced modules as unmounted.

#### 6.2.1 Authentication Module

Implemented capabilities include registration, login, and profile updates. Login supports username or email workflows, password verification uses bcrypt hashes, and JWT tokens are issued with expiry constraints. Profile update flow includes optional password change requiring current password validation.

Security strengths:

- No plain password storage.
- Token-protected profile operations.
- Invalid token rejection behavior.

#### 6.2.2 Transactions Module

Transaction APIs implement CRUD operations, filtering by type/category/date, pagination, and statistics endpoints. Business logic supports spending summaries across monthly or selected periods. The module is central to all downstream analytics because budget status, goals progress, and reporting all consume transaction signals.

Performance considerations include index usage and aggregation pipelines for summary calculations.

#### 6.2.3 Budget Module

Budgets are period-based and support category-level limits and spent tracking fields. Analytics logic calculates utilization and can support threshold alerts. This module translates raw expense data into behavioral controls, making it a core value component for target users.

#### 6.2.4 Goals Module

Goals support target amount, date, category, priority, contributions, and progress evaluation. Milestone design (25, 50, 75, 100 percent style progression) improves user motivation and interpretability. Contribution history improves transparency and enables richer analysis.

#### 6.2.5 Category Module

Category APIs provide data retrieval and seed behavior for default categories. The seed endpoint supports initialization needs and accelerates first-run usability.

#### 6.2.6 Reports and Export Module

The reports subsystem generates analytics summaries and downloadable outputs. Exports are produced in PDF and Excel formats through dedicated libraries. This pipeline combines aggregation, formatting, and stream handling and therefore demonstrates engineering depth beyond simple JSON APIs.

#### 6.2.7 Notifications and Scheduler

Users can configure notification settings through API endpoints and trigger test messages. Scheduler jobs are initialized after database connection and run by configured frequencies (daily, weekly, monthly). Notification content can include multiple financial summary dimensions.

A known improvement area is timezone flexibility, as scheduler timezone defaults are currently fixed and should be user-configurable for global usage.

#### 6.2.8 Chatbot and AI Modules

The chatbot endpoint provides rule-based support responses and helps users navigate key features. AI routes include spending prediction and personalized recommendation patterns built from historical behavior. Enhanced reporting modules combine analytics, health scoring, anomaly detection, and recommendation composition.

### 6.3 Frontend Implementation Summary

The frontend is structured as a React application with protected routes and module-focused components. Primary pages include registration, login, home dashboard, transactions, budgets, goals, and reports. Auth state and token utility functions are centralized for reusable access control logic.

User experience design includes:

- Guided route transitions.
- Key metric cards and charts.
- Modal-driven data entry for transactions.
- Profile and notification settings flows.
- Export controls in reporting views.

The frontend balances feature richness with approachable interactions for non-expert users.

### 6.4 Data Model and Integrity

#### 6.4.1 User Entity

Stores identity, profile attributes, authentication hash, and notification settings object. This model anchors ownership checks and personalization.

#### 6.4.2 Transaction Entity

Captures income/expense amounts, category metadata, descriptions, dates, payment context, and recurrence-related fields. Indexed access supports common dashboard queries.

#### 6.4.3 Budget Entity

Stores period boundaries, category allocations, spent values, thresholds, and status-oriented metadata.

#### 6.4.4 Goal Entity

Stores target configurations, current progress, contribution history, and virtual progress percentage behavior.

#### 6.4.5 Category and Investment Entities

Category model captures taxonomy data and defaults. Investment-oriented models and routes support capital planning and recommendation context for advanced workflow extensions.

### 6.5 Algorithmic and Analytical Details

MONIVUE applies practical statistical methods suited to explainable user-facing outputs.

Core formulas:

- Net Savings = Total Income - Total Expenses
- Savings Rate = (Net Savings / Total Income) x 100
- Budget Utilization = (Spent / Budgeted) x 100
- Goal Progress = (Current / Target) x 100

Spending forecast approach:

- Monthly expense series by category is constructed.
- Regression-like trend extrapolation predicts next period spending.
- Confidence-like scoring adjusts based on series variability.

Anomaly approach:

- Category or period baselines are computed.
- Outlier signals are generated using deviation thresholds similar to z-score interpretation.

Health scoring approach:

- Weighted factors combine budget adherence, savings behavior, expense stability, and activity consistency.

These methods intentionally trade maximum complexity for transparency and educational relevance.

### 6.6 API Endpoint Matrix (Condensed)

Auth:

- POST /api/auth/register
- POST /api/auth/login
- PUT /api/auth/profile

Transactions:

- GET /api/transactions
- POST /api/transactions
- PUT /api/transactions/:id
- DELETE /api/transactions/:id
- GET /api/transactions/stats

Budgets:

- GET /api/budgets
- POST /api/budgets
- PUT /api/budgets/:id
- DELETE /api/budgets/:id
- GET /api/budgets/:budgetId/analytics
- POST /api/budgets/:budgetId/alerts/read

Goals:

- GET /api/goals
- POST /api/goals
- PUT /api/goals/:id
- POST /api/goals/:id/contribute
- GET /api/goals/:id/analysis
- DELETE /api/goals/:id

Categories:

- GET /api/categories
- POST /api/categories/seed

Reports:

- GET /api/reports/analytics
- GET /api/reports/pdf
- GET /api/reports/excel
- GET /api/reports/comprehensive
- GET /api/reports/spending-forecast
- GET /api/reports/health-score
- GET /api/reports/budget-optimization
- GET /api/reports/investment-recommendations
- GET /api/reports/anomalies
- GET /api/reports/export/pdf
- GET /api/reports/export/excel

Bank ratings:

- GET /api/bank-ratings/search
- GET /api/bank-ratings/list
- GET /api/bank-ratings/compare

Investments:

- GET /api/investments/companies
- GET /api/investments/companies/:id
- POST /api/investments/calculate
- POST /api/investments/compare
- POST /api/investments/assessment
- POST /api/investments/recommendations
- POST /api/investments/convert

Notifications:

- GET /api/notifications/settings
- PUT /api/notifications/settings
- POST /api/notifications/test

Chatbot:

- POST /api/chatbot

AI:

- GET /api/ai/predictions/spending
- GET /api/ai/recommendations/personalized
- GET /api/ai/market/watchlist

### 6.7 Testing and Validation Results

#### 6.7.1 Backend Testing

Backend testing uses Jest with coverage-enabled scripts and includes separate unit and integration style execution commands. Test suites validate auth, transactions, budgets, and goals workflows with positive and negative path checks.

Strengths:

- Core module tests are present and actionable.
- Route-level behavior validated using Supertest.
- Mock-driven testing avoids dependency on external DB in routine runs.

Limitations:

- Advanced analytics and integration-heavy modules need deeper automated coverage.
- Cross-module contract tests can be expanded.

#### 6.7.2 Frontend Testing

Frontend includes baseline test setup and component tests for login and registration flows. These tests validate rendering, input behavior, and mocked API interactions.

Limitations include limited depth in dashboard, reports, and advanced analytics components, which should be addressed in future iterations.

### 6.8 Security Evaluation

Implemented controls provide a solid prototype baseline:

- bcrypt for password hashing.
- JWT for route-level protection.
- Ownership checks in finance-sensitive operations.

Improvement opportunities:

- More centralized auth middleware usage across all routes.
- Standardized request validation middleware.
- Rate limiting and stricter input sanitization layers.
- Production secret management and rotation policy.

### 6.9 Performance and Reliability Evaluation

Performance positives:

- Indexed transaction queries reduce common lookup latency.
- Aggregation pipelines support summary endpoints efficiently for prototype scale.

Reliability positives:

- Robust try/catch patterns in controllers.
- DB connection retry logic.
- Scheduler starts after successful DB connection.

Performance opportunities:

- Cache intensive report responses.
- Expand pagination defaults in data-heavy views.
- Improve export throughput for large historical datasets.

Reliability opportunities:

- Harmonize schema key naming conventions in all advanced modules.
- Expand structured error contract consistency.

### 6.10 Usability Evaluation

Observed usability strengths:

- Clear route protection and guided auth flow.
- Dashboard centralizes key metrics.
- Forms support practical CRUD interactions.
- Reports and exports improve actionable use.

Potential usability refinements:

- Onboarding walkthrough for first-time users.
- Better empty-state guidance in advanced report tabs.
- More explicit confidence messaging in AI predictions.

### 6.11 Critical Analysis

From an academic perspective, MONIVUE demonstrates strong breadth and reasonable depth. The system is notably stronger than basic class projects due to integration of security, analytics, exports, scheduling, and testing. The most important constraint is uneven maturity across modules: core finance flow is comparatively robust, while advanced analytics features still need expanded test rigor and stricter data contract unification.

This pattern is realistic in software projects and should be presented as managed technical debt rather than failure.

### 6.12 End-Project Outcome Summary

The project successfully delivers:

- A functioning full-stack finance platform.
- End-to-end authenticated workflows for primary user tasks.
- Multi-format analytics and export capabilities.
- AI-assisted logic integrated into backend and report subsystems.
- Foundational test coverage and technical documentation.

Therefore, end-project objectives were met at prototype-plus quality level, with a clear path to production hardening.

---

## 7. Project Post-Mortem

### 7.1 Purpose of Post-Mortem

The post-mortem analyzes what worked, what did not, why decisions were made, and how future versions should improve. This reflective practice is critical in software engineering maturity and demonstrates ownership beyond implementation output.

### 7.2 What Went Well

1. Modular architecture supported parallel feature development and easier debugging.
2. Core finance modules reached stable functionality with coherent user journeys.
3. Reporting and export pipelines added significant product and academic value.
4. AI and enhanced report features increased innovation depth.
5. Documentation quality enabled reproducibility and report traceability.
6. Testing baseline was established rather than deferred entirely.

### 7.3 What Did Not Go Well

1. Consistency debt emerged in selected advanced modules where key naming assumptions differ.
2. Test depth expansion lagged behind feature expansion.
3. Some modules used inline auth patterns instead of complete middleware consolidation.
4. Scheduler timezone flexibility remained static instead of user-driven.
5. Dependency on external data services required fallback behavior that reduced live-data realism.

### 7.4 Root Cause Analysis

Key root causes include:

- Scope growth outpaced quality hardening budget late in the cycle.
- Advanced module integration occurred in concentrated bursts, reducing time for contract normalization.
- Priority was intentionally placed on demonstrating complete feature verticals for capstone value, with deferred optimization pass.

### 7.5 Risk Register Reflection

Major risks and outcomes:

- Integration mismatch risk: mitigated by final route activation and backend wiring checks.
- Data consistency risk: partially mitigated; still requires harmonization in advanced analytics paths.
- Testing risk: partially mitigated through core suites; advanced endpoints remain under-tested.
- External API risk: mitigated with fallback behavior and clear documentation.

### 7.6 Lessons Learned

1. Contract-first schema conventions should be enforced from early iterations.
2. Every major feature merge should include minimum test cases and integration checks.
3. Shared middleware and validators should be established before module count expands.
4. Documentation updates should be coupled with code changes to prevent stale status claims.
5. Explainable, simpler models are often preferable to opaque complexity in user-facing finance prototypes.

### 7.7 Recommendations for Phase 2

Technical recommendations:

- Introduce centralized validation middleware using a consistent schema layer.
- Normalize canonical keys across all modules (for example userId and category fields).
- Add comprehensive tests for enhanced reports, bank ratings, and AI endpoints.
- Introduce response contract standardization for errors and metadata.
- Add caching for high-cost report aggregations.
- Add timezone preference support in scheduler configuration.
- Add structured logs and metrics for runtime observability.

Product recommendations:

- Add onboarding flow and guided interpretation for AI outputs.
- Add user-facing confidence explanations and recommendation rationale cards.
- Expand localization and currency support consistency.

Research recommendations:

- Benchmark alternate forecasting models against current regression baseline.
- Measure anomaly precision and false positive rates on curated datasets.
- Evaluate behavioral intervention strategies such as nudges and streak mechanisms.

### 7.8 Professional Reflection

This project reinforced that credible engineering is not about claiming perfection. It is about delivering useful functionality, implementing sound architecture, evaluating quality with evidence, and presenting limitations honestly with an actionable roadmap. The post-mortem process transformed unresolved issues into structured next steps, which is itself a core software engineering competency.

---

## 8. Conclusions

MONIVUE delivers a full-stack personal finance platform that combines practical financial workflows with meaningful analytics and AI-assisted support. The project addresses a real user need: helping individuals move from fragmented tracking to informed decision-making. Through secure authentication, transaction and budget management, goal tracking, reporting exports, notifications, and intelligent analytics, the system demonstrates substantial engineering scope for an undergraduate capstone.

From a technical perspective, the project validates the suitability of a React, Express, and MongoDB architecture for modular fintech-like applications. The backend structure supports clear separation of concerns; the frontend provides accessible user journeys; and the data model supports both operational and analytical use cases. Inclusion of forecast and anomaly modules adds academic depth by demonstrating applied data analytics rather than purely transactional CRUD.

Evaluation findings show strong progress in core reliability and functionality, supported by test suites for key backend modules and frontend authentication components. At the same time, honest limitations remain: selected advanced modules require deeper automated testing, data contract harmonization, and further production-hardening measures such as standardized validators and observability tooling.

These limitations do not weaken the project narrative. Instead, they strengthen credibility by showing realistic engineering trade-offs and a mature understanding of software lifecycle progression from functional prototype to hardened deployment candidate.

In conclusion, MONIVUE meets the principal goals of a serious final-year computer science project by integrating domain relevance, technical complexity, implementation evidence, quality validation, and critical reflection. The platform has clear practical value for students and early-career users and provides a strong foundation for future research and development in explainable financial decision support.

---

## 9. Reference List

[1] Pressman, R. and Maxim, B., Software Engineering: A Practitioner's Approach, McGraw-Hill.  
[2] Sommerville, I., Software Engineering, Pearson.  
[3] Fielding, R., Architectural Styles and the Design of Network-based Software Architectures.  
[4] Newman, S., Building Microservices, O'Reilly.  
[5] MongoDB Documentation, Data Modeling and Indexing Guides.  
[6] Express.js Official Documentation.  
[7] Node.js Official Documentation.  
[8] React Official Documentation.  
[9] JWT Introduction and Best Practices (IETF RFC 7519).  
[10] Provos, N. and Mazieres, D., A Future-Adaptable Password Scheme (bcrypt).  
[11] OWASP Top 10 Web Application Security Risks.  
[12] NIST Digital Identity Guidelines.  
[13] Hyndman, R. and Athanasopoulos, G., Forecasting: Principles and Practice.  
[14] Aggarwal, C., Outlier Analysis, Springer.  
[15] Han, J., Kamber, M., and Pei, J., Data Mining Concepts and Techniques.  
[16] Chart.js Documentation for Data Visualization.  
[17] Jest Testing Framework Documentation.  
[18] Supertest API Testing Documentation.  
[19] React Testing Library Documentation.  
[20] ExcelJS Documentation.  
[21] PDFKit Documentation.  
[22] node-cron Documentation.  
[23] Finnhub API Documentation.  
[24] Colombo Stock Exchange Public Data References (CSE API context).  
[25] Mongoose ODM Documentation.

---

## 10. Bibliography

- Martin, R., Clean Architecture.  
- Martin, R., Clean Code.  
- Fowler, M., Patterns of Enterprise Application Architecture.  
- Evans, E., Domain-Driven Design.  
- Norman, D., The Design of Everyday Things.  
- Kahneman, D., Thinking, Fast and Slow.  
- Thaler, R. and Sunstein, C., Nudge.  
- Cormen, T. et al., Introduction to Algorithms.  
- ISO/IEC 25010 Software Quality Model documentation.  
- Cloud and DevOps technical blogs related to Node and Mongo deployment patterns.

---

## 11. Appendices

### Appendix A: User Guide

#### A.1 Minimum Platform Specification

Backend environment:

- OS: Windows, Linux, or macOS
- Runtime: Node.js 18 or later
- Package manager: npm 8 or later
- Database: MongoDB instance (local or Atlas)
- Memory: 4 GB minimum

Frontend environment:

- Node.js 18 or later
- Modern browser (Chrome, Edge, Firefox)
- 4 GB RAM recommended

#### A.2 Installation Steps

1. Clone the repository from the provided source code link.
2. Install backend dependencies.
3. Install frontend dependencies.
4. Configure environment variables for backend.
5. Start backend server.
6. Start frontend development server.
7. Open browser and access the frontend URL.

#### A.3 Required Environment Variables

Set the following in backend environment configuration:

- MONGO_URI or DB_URI
- JWT_SECRET
- Optional email service credentials for notification testing
- Optional external market API keys for enhanced live data features

#### A.4 Demonstration User Journey

1. Register a new user.
2. Login to receive authenticated session.
3. Add income and expense transactions.
4. Create at least one budget and one goal.
5. Navigate to reports and review analytics.
6. Export PDF and Excel reports.
7. Configure notification settings and send test notification.
8. Access AI/reporting features and inspect predictions.

#### A.5 Operational Notes

- Ensure backend runs before frontend API calls.
- If market APIs are unavailable, fallback behavior should still return controlled outputs.
- Use realistic sample data for meaningful analytics visualization.

### Appendix B: Project Source Code Link

Repository URL: [Insert GitHub Repository URL]

Example format:

https://github.com/<username>/<repository-name>

### Appendix C: GitHub Commit History and Repository Link

Repository link: [Insert repository URL]  
Commit history evidence to include:

- Screenshot or export of commit timeline.
- Key milestone commits such as auth module, transactions module, reports module, AI module, and testing setup.
- Branch strategy summary if applicable.

Suggested submission artifact:

- PDF containing commit graph screenshots with short milestone descriptions.

### Appendix D: PID (Project Initiation Document)

Include your approved PID with:

- Problem statement
- Objectives and scope
- Initial requirements
- Planned deliverables
- Timeline and milestones
- Risk register and mitigation plan
- Resource assumptions

### Appendix E: Interim Reports

Attach all interim reports submitted during project lifecycle in chronological order.

Suggested structure per interim report:

- Progress completed
- Planned next tasks
- Risks encountered
- Mitigations applied
- Supervisor feedback summary

### Appendix F: Records of Supervisory Meetings

Include meeting log table:

- Date
- Agenda
- Decisions
- Action items
- Target completion date
- Follow-up status

### Appendix G: Additional Material

Include supplementary technical evidence:

- Architecture diagrams
- API request/response samples
- Database schema snapshots
- Test execution outputs
- Coverage screenshots
- UI screenshots of major pages
- Export output samples (PDF and Excel)
- Any prototype evaluation questionnaire results

---

## Extended Chapter Material to Reach 10,000-Word Submission Target

The following extended material can be used directly inside the main chapters above or as structured subsections to ensure the full report reaches approximately 10,000 words while staying academically coherent and evidence-driven.

### E1. Extended Technical Discussion: Why This Project Is More Than CRUD

Many student projects are evaluated as basic CRUD systems because they demonstrate only simple create-read-update-delete operations without deeper analytical or systems complexity. MONIVUE moves beyond this baseline in several significant ways.

First, the system includes computational analytics over historical transactions. Instead of only storing records, it derives higher-level indicators such as net savings trends, budget utilization behavior, goal achievement velocity, and category-level expense concentration. These aggregates require both careful data processing and meaningful interpretation for users.

Second, the platform introduces a report generation pipeline that transforms database outputs into downloadable documents. Producing PDF and Excel output is not trivial because it introduces formatting concerns, stream handling, and performance implications. In practical software systems, this kind of feature is often used in audit, compliance, and managerial review contexts.

Third, MONIVUE includes asynchronous processes through scheduler-driven notifications. This introduces event timing and background workflow behavior, distinguishing the system from purely request-response designs.

Fourth, intelligent assistance features demonstrate applied AI thinking. The system does not claim institutional-grade machine learning, but it implements statistically informed prediction, anomaly detection cues, and recommendation logic that reflect real analytical reasoning and user-centered explainability.

Fifth, the project addresses engineering realism by documenting known limitations and debt. This is an important quality marker because mature software engineering includes managing incompleteness responsibly rather than overclaiming completion.

Therefore, MONIVUE should be framed as an integrated decision-support platform with operational, analytical, and reflective dimensions.

### E2. Extended Evaluation Narrative: Functional Validation by Scenario

To evaluate practical usefulness, scenario-based validation can be described in detail.

Scenario A: New user onboarding.

- User registers successfully with required fields.
- User logs in and receives tokenized session.
- User can access protected pages only after authentication.
- Invalid login attempts return controlled errors.

Scenario B: Monthly financial management.

- User records salary as income and multiple expenses.
- Dashboard updates reflect net balance and trends.
- Transaction filters by date and category operate correctly.

Scenario C: Budget discipline.

- User creates category-specific budget for monthly period.
- System computes spent values as expenses are added.
- Utilization signals indicate nearing threshold and overspend risk.

Scenario D: Goal progression.

- User creates savings goal with target date.
- User contributes periodically.
- Progress percentage and milestone interpretation update over time.

Scenario E: Reporting and export.

- User opens report module and fetches analytics.
- User exports PDF and Excel reports.
- Downloaded artifacts reflect summarized data.

Scenario F: Notification workflow.

- User configures notification settings.
- User triggers test notification.
- Summary content generation process executes with configured options.

Scenario G: AI and enhanced insights.

- User requests forecast and recommendation outputs.
- System returns interpreted metrics with confidence/risk context.
- User can compare outputs against observed behavior.

This scenario-based perspective helps examiners understand not only endpoint correctness but practical product behavior.

### E3. Extended Security Discussion

Security in personal finance software must protect confidentiality, integrity, and authorized access. MONIVUE adopts core patterns appropriate for educational deployment while identifying future controls.

Confidentiality considerations:

- Passwords are hashed with bcrypt to avoid plaintext storage.
- Authenticated routes require bearer tokens.
- Data access is scoped by user identity in query logic.

Integrity considerations:

- Schema validation and controller checks enforce expected data forms.
- Ownership checks prevent unauthorized modifications.
- Error handling avoids exposing internals while preserving debuggability.

Availability considerations:

- Database connection retry logic improves startup resilience.
- Scheduler starts after successful DB connectivity.

Recommended enhancements for production:

- Introduce centralized validation middleware with strict schemas.
- Add per-route rate limiting for brute force resistance.
- Add refresh token strategy and revocation support.
- Add role-based access abstractions if admin panels are introduced.
- Use secret vault or managed key service for credentials.

Security should be presented as a layered continuum, and this project establishes a credible baseline with clear phase-2 controls.

### E4. Extended Reliability and Maintainability Discussion

Reliability reflects the system's ability to deliver correct behavior over time under varied conditions. Maintainability reflects how easily developers can modify and extend features.

Reliability positives in MONIVUE include guarded asynchronous operations, defensive error handling, and practical fallback patterns in external-integration contexts. However, reliability can be further improved by unified response contracts and integration tests across module boundaries.

Maintainability positives include separation of concerns through route/controller/service/model organization and componentized frontend architecture. This modularity supports selective evolution of features.

Maintainability debt includes occasional naming inconsistencies in advanced paths and localized auth logic patterns that should be consolidated. Addressing these issues improves long-term velocity and reduces regression risk.

A useful maintainability metric for future work is change amplification: how many files are touched for a single behavior update. The project should aim to reduce this by centralizing shared concerns.

### E5. Extended Performance Discussion

Performance evaluation in prototype systems should focus on user-perceived responsiveness and operational bottlenecks rather than synthetic benchmarks alone.

Potential bottlenecks include:

- High-volume aggregation in report endpoints.
- Export generation for long transaction histories.
- External API latency and retries in market-related modules.

Mitigation strategies:

- Add result caching with expiry for expensive report queries.
- Add queue-based export generation for very large datasets.
- Introduce pagination and data window controls in list endpoints.
- Optimize query projections and index usage as data grows.

A practical evaluation plan can include median and p95 response times for key endpoints under controlled dataset sizes. This provides objective evidence in the final report.

### E6. Extended AI Ethics and Responsible Use Discussion

Even simple predictive systems can influence financial decisions. Therefore, responsible use principles should be acknowledged.

Key points:

- AI outputs are advisory, not deterministic financial instructions.
- Confidence and uncertainty should be communicated clearly.
- Users should understand that predictions depend on historical behavior and may not account for unexpected life events.
- Recommendation modules should avoid framing that implies guaranteed returns.
- The system should avoid collecting unnecessary sensitive personal information.

This ethical framing improves academic quality and shows awareness of responsible AI design.

### E7. Extended Future Work Plan

A prioritized future roadmap can be proposed in three horizons.

Horizon 1: Stabilization and hardening.

- Full data contract normalization.
- Expanded integration and regression test suites.
- Unified validation and error contract middleware.
- Timezone personalization for scheduler.

Horizon 2: Product refinement.

- Enhanced onboarding and contextual tips.
- User-segmented dashboards.
- Goal recommendation assistant.
- Better explainability widgets for forecast outputs.

Horizon 3: Advanced intelligence and scale.

- Comparative model evaluation (ARIMA, Prophet, gradient methods).
- Drift monitoring for prediction reliability.
- Cloud-native deployment with metrics and alerting.
- Multitenant and enterprise integration variants.

This roadmap demonstrates continuity from capstone prototype to production candidate and research platform.

### E8. Extended Viva Preparation Material

Possible examiner question: How do you justify AI claims?

Suggested answer: The project uses practical statistical modeling and explainable analytics suitable for applied undergraduate scope. It does not claim institutional-grade ML, and this scope boundary is explicitly documented.

Possible examiner question: What is the strongest engineering evidence?

Suggested answer: End-to-end authenticated modules, layered architecture, export pipelines, scheduler behavior, and test suites for core finance workflows together provide robust engineering evidence.

Possible examiner question: What would you improve first if given one month?

Suggested answer: I would prioritize data contract normalization and expanded automated tests for advanced modules because these improvements maximize reliability and maintainability.

Possible examiner question: Why include market APIs such as CSE API?

Suggested answer: Market context extends user decision support and demonstrates realistic external integration patterns. In this project, Colombo Stock Exchange API and Finnhub references are integrated with fallback behavior to preserve resilience.

### E9. Suggested Quantitative Metrics Table (Template)

Use this table in the final submission after entering measured values:

- API success rate (%): ______
- Median response time for analytics endpoint (ms): ______
- p95 response time for analytics endpoint (ms): ______
- PDF export generation time (s): ______
- Excel export generation time (s): ______
- Unauthorized request rejection accuracy (%): ______
- Backend unit test pass rate (%): ______
- Backend integration test pass rate (%): ______
- Frontend critical component test pass rate (%): ______
- User walkthrough completion rate (%): ______

### E10. Final One-Paragraph Report Summary for Abstract/Conclusion Reuse

MONIVUE is a full-stack personal finance platform that unifies secure transaction management, budgeting, goal tracking, reporting exports, scheduled notifications, and AI-assisted analytics into a single user-oriented system. Built with React, Express, and MongoDB, the platform demonstrates practical software engineering depth through modular architecture, route-level security, data-driven insights, and test-backed core workflows. While advanced modules still require expanded test coverage and consistency hardening for production-grade maturity, the implemented system delivers a credible and impactful undergraduate capstone outcome with clear pathways for research and real-world extension.

### E11. Expanded Chapter Draft: Introduction (Long Form)

Financial literacy and money management behavior increasingly determine long-term quality of life for students and young professionals. Yet, in practice, personal finance management often remains reactive rather than intentional. Income is tracked loosely, expenses are remembered imperfectly, and planning occurs only when financial pressure becomes urgent. This pattern produces avoidable inefficiencies such as unplanned overspending, poor savings continuity, and delayed progress toward personal goals. The problem is not a lack of motivation alone; it is also a systems problem. Users need a coherent environment that captures data, structures it, and converts it into understandable decisions.

MONIVUE was conceived as a response to this practical gap. Instead of acting only as a digital ledger, the platform combines operational finance management with analytical interpretation. Users can record transactions, configure budgets, define goals, and view summary insights from a single interface. More importantly, the system attempts to answer both descriptive and prescriptive questions. Descriptive functions explain what happened in a given period. Prescriptive functions provide forecast-oriented and recommendation-oriented cues to guide what users can do next.

The project is aligned with a common challenge in computing education: how to build a final-year system that is technically non-trivial while also socially meaningful. A personal finance platform provides this balance. It requires secure authentication, reliable data operations, thoughtful interfaces, and sound analytics. It also offers direct user value and measurable evaluation outcomes, such as task completion success, API reliability, and report generation quality.

From a software engineering perspective, MONIVUE is designed around modularity and traceability. Backend modules separate routing, control logic, service computations, and model definitions. Frontend modules separate pages, reusable components, and utility functions. This structure supports maintainability and transparent mapping between requirements and implementation artifacts.

From an academic perspective, the project deliberately includes both strengths and limitations in its narrative. It demonstrates robust core functionality while acknowledging areas where hardening is still needed. This honest framing is a central principle in this report: technical credibility is stronger when supported by evidence and balanced reflection.

In summary, MONIVUE addresses a real-world user need through a full-stack engineering solution with analytics depth. The introduction chapter should therefore establish three messages clearly: the problem is genuine, the implementation is substantial, and the evaluation is transparent.

### E12. Expanded Chapter Draft: Background, Objectives, and Deliverables (Long Form)

The background of this project emerges from the convergence of fintech usability trends and software engineering capabilities available to student developers. On one side, users increasingly expect consumer applications to provide immediate insight rather than raw data. On the other side, modern web stacks allow relatively small teams to build integrated systems quickly. The challenge is to combine these possibilities without compromising reliability and maintainability.

Personal finance products in the market often target one of two extremes. Some apps provide minimal transaction logs with weak analytical depth. Others offer highly sophisticated dashboards that can overwhelm beginner users. MONIVUE adopts a middle strategy. It aims to deliver clear baseline capabilities first, then layer intelligence features in an understandable way.

Project objectives were intentionally structured in progressive layers.

Layer 1 objectives focused on secure identity and data capture:

- Ensure users can register, authenticate, and maintain profile data safely.
- Ensure core financial records can be created, viewed, edited, and deleted.

Layer 2 objectives focused on behavior support:

- Enable budget creation and utilization tracking.
- Enable savings goal creation, contribution updates, and progress interpretation.

Layer 3 objectives focused on intelligence and communication:

- Generate reports and exportable outputs.
- Provide prediction-oriented and recommendation-oriented endpoints.
- Support notifications and assistant-style interactions.

Deliverables were mapped accordingly. Technical deliverables include backend APIs, frontend workflows, database schemas, scheduler and email integration, and analytical modules. Quality deliverables include test suites, setup guides, and architecture documentation. Academic deliverables include this structured report and appendices with reproducible evidence.

A key design objective was to maintain explainability. In many user-facing finance tools, recommendation output appears as a black box. MONIVUE instead favors interpretable indicators and formula-aware summaries. This choice is appropriate for undergraduate scope and aligns with the educational aim of helping users understand, not just consume, outputs.

Another objective was regional relevance. While global data services can provide broad context, users in Sri Lanka also benefit from local market awareness. For this reason, documentation and integration contexts reference the Colombo Stock Exchange API (CSE API) alongside broader market sources such as Finnhub.

Success criteria were established in functional and quality terms. Functionally, the platform should support end-to-end user journeys from login to analytics export. Qualitatively, it should demonstrate secure access control, stable response behavior, and a maintainable code structure. The report should show where criteria were fully met and where further hardening remains.

### E13. Expanded Chapter Draft: Method of Approach (Long Form)

The development process followed an iterative method that blends agile thinking with milestone accountability. Instead of attempting complete upfront specification for all modules, the project advanced through incremental vertical slices. Each slice combined backend route implementation, frontend integration, and quick validation before moving to the next feature. This approach reduced risk of isolated module completion without system-level usability.

A representative iteration pattern was:

1. Define user story and expected API contract.
2. Update or create relevant schema/model attributes.
3. Implement route and controller behavior.
4. Integrate frontend component interactions.
5. Validate success and failure paths manually.
6. Add or refine automated tests for critical behavior.
7. Document assumptions, caveats, and next-step improvements.

This pattern was repeated across auth, transactions, budgets, goals, and reporting modules. Advanced analytics and enhanced reports were added later once core data flows became stable.

A practical decision in the method was to use fallback-first behavior for selected external API integrations. For student projects, external credential issues and network variability can block demonstrations. By implementing fallback paths, the system remained functional for core workflows even when live external data could not be reliably fetched.

Risk management was embedded in iteration reviews. Major risks included data contract drift, delayed test expansion, and documentation staleness. When risks materialized, mitigation involved explicit roadmap notes rather than silent omission. This decision supports report integrity and mirrors industry post-release practices.

Testing strategy was risk-prioritized rather than blanket. Core finance operations and authentication were treated as high-criticality and received earlier test focus. Advanced intelligence features received partial validation and are documented as extension priorities. This is a realistic trade-off under academic timelines and should be justified explicitly in the final report.

The method also included continuous documentation updates. Maintaining architecture summaries, testing guides, and setup notes during implementation reduced final report assembly overhead and improved consistency between code and narrative.

Overall, the adopted approach demonstrates an important engineering principle: effective project execution balances delivery speed, correctness, and transparent reflection. Even where complete optimization was not achieved, decision rationale and mitigation planning were preserved.

### E14. Expanded Chapter Draft: Requirements and Design Justification (Long Form)

Requirements engineering for MONIVUE was guided by two dimensions: user value and system feasibility. User value asks whether a feature solves a meaningful problem for the target segment. System feasibility asks whether the feature can be implemented and validated within capstone constraints.

For example, transaction CRUD was both high user value and high feasibility, so it was prioritized early. Budget analytics was high user value and moderate feasibility, and therefore implemented after core transaction stability. AI forecast modules were high potential value but higher uncertainty, so they were introduced in a controlled, explainable manner.

The design architecture reflects this prioritization logic. The backend organizes route contracts, controller logic, and service computation so that each concern can evolve independently. The frontend structures pages around user tasks rather than technical modules, improving usability coherence.

Data model choices were similarly driven by requirement fit. MongoDB document flexibility allowed rapid adaptation when fields evolved, such as adding profile attributes, nested budget category arrays, or goal contribution histories. However, this flexibility introduces consistency risk when conventions are not tightly enforced. The report should acknowledge this and present normalization plans.

Security requirements were considered mandatory baseline requirements, not optional enhancements. As a result, authentication and ownership controls were integrated from early iterations. This sequencing prevented later costly refactoring and ensured sensitive modules inherited secure defaults.

Non-functional requirements were treated as measurable, even if at prototype scale. Reliability was assessed through error handling consistency and successful recovery behavior. Performance was observed through perceived responsiveness in key endpoints. Maintainability was inferred from modular separation and change localization.

The design also considered explainability as a requirement for AI-related outputs. Users should understand why a recommendation appears, at least at a conceptual level. Thus, simple interpretable statistical models were preferred over opaque complexity in this project phase.

In report writing, this chapter should emphasize that design is not only about technical elegance. It is about making justified trade-offs among user needs, engineering constraints, and evidence quality. MONIVUE's requirements and design decisions reflect this practical balance.

### E15. Expanded Chapter Draft: End-Project Evaluation and Reflection (Long Form)

An effective end-project evaluation must answer three questions. Did the system work as intended? Did it provide meaningful value? Is the evidence credible? MONIVUE can be assessed positively on all three, while still presenting clear next steps.

Functional evidence shows that users can perform end-to-end core tasks: authenticate, manage transactions, configure budgets, track goals, view analytics, and export reports. This confirms that the system is operationally complete for primary finance management use cases.

Value evidence is visible in the way features connect. Transactions feed budget utilization, goals align with savings behavior, reports summarize outcomes, and AI modules add forward-looking interpretation. This interconnected design is more useful than isolated feature fragments and supports behavior-oriented decision making.

Credibility evidence comes from balanced reporting. The project does not claim enterprise-grade maturity where it is not yet achieved. Instead, it distinguishes validated core modules from advanced modules requiring broader automated coverage and consistency hardening. This distinction improves trust in the report and aligns with professional engineering communication.

A useful reflection is that system maturity is multidimensional. Feature breadth alone does not imply quality. Similarly, strict quality controls without usable features provide limited practical value. MONIVUE's strongest achievement is reaching a meaningful middle point: substantial feature scope with explicit quality foundations and transparent debt mapping.

For academic examiners, this project demonstrates several competencies: architecture planning, API engineering, database modeling, frontend integration, analytics implementation, testing discipline, and reflective evaluation. For users, it offers practical utility in daily money management and medium-term planning.

Future development can therefore proceed with confidence. The platform already has a stable structural base. By prioritizing contract unification, deeper automated testing, observability, and UX refinement, MONIVUE can evolve from prototype-plus into a production-ready decision support platform.

Final reflection statement:

This project confirms that impactful computing solutions are built by combining technical implementation with honest evaluation. MONIVUE delivers a credible, useful, and extensible foundation, and its documented roadmap demonstrates readiness for continued engineering and research progression.
