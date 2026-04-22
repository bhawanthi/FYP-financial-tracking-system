# GitHub 5-Day Push Plan (60 Atomic Commits)

This plan is designed for your current project structure and gives you:
- GitFlow-style branching (`main`, `develop`, `feature/*`, `release/*`)
- 60 atomic commits across 5 days (12 commits/day)
- Ordered commands and commit messages
- Safe handling of dependency/build folders so they do not pollute history

## 0) One-Time Setup (Run Once Before Day 1)

```powershell
Set-Location "C:\Finance_Tracker (3)\Finance_Tracker"

# Confirm remote
git remote -v

# Ensure main exists locally
git checkout main

# Create integration branch
git checkout -b develop
git push -u origin develop
```

## Branching Rules

- `main`: production/stable only
- `develop`: integration branch for completed feature branches
- `feature/<scope>`: short-lived branches for grouped atomic commits
- `release/week-1`: release hardening branch before merge to `main`

## Daily Merge Pattern (Use After Each Feature Branch)

```powershell
# Push feature branch
git push -u origin <feature-branch>

# Merge into develop with explicit merge commit
git checkout develop
git merge --no-ff <feature-branch> -m "merge(feature): <feature-branch>"
git push origin develop
```

---

## Day 1 (12 commits)

### Branch A: `feature/backend-auth-core`

```powershell
git checkout develop
git checkout -b feature/backend-auth-core

# C01
git add .gitignore
git commit -m "chore(repo): add root gitignore for monorepo artifacts"

# C02
git add package.json package-lock.json
git commit -m "chore(repo): add root workspace package manifests"

# C03
git rm -r --cached --ignore-unmatch BACKEND/node_modules frontend/node_modules BACKEND/coverage frontend/build BACKEND/.env frontend/.env
git commit -m "chore(repo): untrack generated artifacts and local env files"

# C04
git add BACKEND/.gitignore BACKEND/package.json BACKEND/package-lock.json
git commit -m "chore(backend): add backend ignore and dependency manifests"

# C05
git add BACKEND/server.js
git commit -m "feat(server): initialize backend server and route mounting"

# C06
git add BACKEND/models/User.js
git commit -m "feat(auth): add user model schema"
```

```powershell
git push -u origin feature/backend-auth-core
git checkout develop
git merge --no-ff feature/backend-auth-core -m "merge(feature): backend auth core"
git push origin develop
```

### Branch B: `feature/backend-transactions-categories`

```powershell
git checkout develop
git checkout -b feature/backend-transactions-categories

# C07
git add BACKEND/controllers/authController.js
git commit -m "feat(auth): implement register and login controller logic"

# C08
git add BACKEND/routes/auth.js BACKEND/middleware/auth.js
git commit -m "feat(auth): add auth routes and jwt middleware protection"

# C09
git add BACKEND/models/Transaction.js
git commit -m "feat(transactions): add transaction model schema"

# C10
git add BACKEND/controllers/transactionController.js
git commit -m "feat(transactions): implement transaction controller operations"

# C11
git add BACKEND/routes/transactions.js
git commit -m "feat(transactions): expose transaction api routes"

# C12
git add BACKEND/models/Category.js
git commit -m "feat(categories): add category model schema"
```

```powershell
git push -u origin feature/backend-transactions-categories
git checkout develop
git merge --no-ff feature/backend-transactions-categories -m "merge(feature): backend transactions and categories"
git push origin develop
```

---

## Day 2 (12 commits)

### Branch C: `feature/backend-budget-goals`

```powershell
git checkout develop
git checkout -b feature/backend-budget-goals

# C13
git add BACKEND/controllers/categoryController.js
git commit -m "feat(categories): implement category controller logic"

# C14
git add BACKEND/routes/categories.js
git commit -m "feat(categories): expose category route handlers"

# C15
git add BACKEND/models/Budget.js
git commit -m "feat(budgets): add budget model schema"

# C16
git add BACKEND/controllers/budgetController.js
git commit -m "feat(budgets): implement budget controller logic"

# C17
git add BACKEND/routes/budgets.js
git commit -m "feat(budgets): expose budget api routes"

# C18
git add BACKEND/models/Goal.js
git commit -m "feat(goals): add goal model schema"
```

```powershell
git push -u origin feature/backend-budget-goals
git checkout develop
git merge --no-ff feature/backend-budget-goals -m "merge(feature): backend budget and goals models"
git push origin develop
```

### Branch D: `feature/backend-reports-notifications`

```powershell
git checkout develop
git checkout -b feature/backend-reports-notifications

# C19
git add BACKEND/controllers/goalController.js
git commit -m "feat(goals): implement goal controller logic"

# C20
git add BACKEND/routes/goals.js
git commit -m "feat(goals): expose goal api routes"

# C21
git add BACKEND/services/emailService.js
git commit -m "feat(notifications): add email delivery service"

# C22
git add BACKEND/services/schedulerService.js
git commit -m "feat(notifications): add scheduler service jobs"

# C23
git add BACKEND/routes/notifications.js
git commit -m "feat(notifications): expose notification route endpoints"

# C24
git add BACKEND/routes/reports.js
git commit -m "feat(reports): add base financial report routes"
```

```powershell
git push -u origin feature/backend-reports-notifications
git checkout develop
git merge --no-ff feature/backend-reports-notifications -m "merge(feature): backend reports and notifications"
git push origin develop
```

---

## Day 3 (12 commits)

### Branch E: `feature/backend-ai-investments`

```powershell
git checkout develop
git checkout -b feature/backend-ai-investments

# C25
git add BACKEND/controllers/chatbotController.js
git commit -m "feat(chatbot): implement chatbot controller responses"

# C26
git add BACKEND/routes/chatbot.js
git commit -m "feat(chatbot): add chatbot route definitions"

# C27
git add BACKEND/routes/ai.js
git commit -m "feat(ai): add ai endpoint routing scaffold"

# C28
git add BACKEND/models/Investment.js
git commit -m "feat(investments): add investment model schema"

# C29
git add BACKEND/routes/investments.js
git commit -m "feat(investments): expose investment route handlers"

# C30
git add BACKEND/services/investmentPlannerService.js
git commit -m "feat(investments): add investment planner service"
```

```powershell
git push -u origin feature/backend-ai-investments
git checkout develop
git merge --no-ff feature/backend-ai-investments -m "merge(feature): backend ai and investments"
git push origin develop
```

### Branch F: `feature/backend-quality-testing`

```powershell
git checkout develop
git checkout -b feature/backend-quality-testing

# C31
git add BACKEND/services/mlPredictionService.js
git commit -m "feat(ai): add ml prediction service"

# C32
git add BACKEND/routes/reportsEnhanced.js
git commit -m "feat(reports): add enhanced report route set"

# C33
git add BACKEND/routes/bankRatings.js
git commit -m "feat(ratings): add bank ratings api route"

# C34
git add BACKEND/jest.config.js BACKEND/tests/setup.js BACKEND/tests/testApp.js
git commit -m "test(backend): add jest config and test harness setup"

# C35
git add BACKEND/tests/integration/auth.test.js BACKEND/tests/integration/budget.test.js BACKEND/tests/integration/goal.test.js BACKEND/tests/integration/transaction.test.js
git commit -m "test(backend): add integration tests for core finance flows"

# C36
git add BACKEND/tests/unit/authController.test.js BACKEND/tests/unit/budgetController.test.js BACKEND/tests/unit/goalController.test.js BACKEND/tests/unit/transactionController.test.js
git commit -m "test(backend): add controller unit test coverage"
```

```powershell
git push -u origin feature/backend-quality-testing
git checkout develop
git merge --no-ff feature/backend-quality-testing -m "merge(feature): backend quality and tests"
git push origin develop
```

---

## Day 4 (12 commits)

### Branch G: `feature/frontend-auth-shell`

```powershell
git checkout develop
git checkout -b feature/frontend-auth-shell

# C37
git add frontend/package.json frontend/package-lock.json
git commit -m "chore(frontend): add frontend dependency manifests"

# C38
git add frontend/.gitignore
git commit -m "chore(frontend): add frontend ignore configuration"

# C39
git add frontend/src/index.js frontend/src/App.js
git commit -m "feat(frontend): initialize app bootstrap and shell"

# C40
git add frontend/src/utils/auth.js
git commit -m "feat(frontend-auth): add client auth utility helpers"

# C41
git add frontend/src/utils/api.js frontend/src/utils/sendEmail.js
git commit -m "feat(frontend): add api and email utility adapters"

# C42
git add frontend/src/components/Login.js frontend/src/components/Register.js
git commit -m "feat(frontend-auth): add login and register components"
```

```powershell
git push -u origin feature/frontend-auth-shell
git checkout develop
git merge --no-ff feature/frontend-auth-shell -m "merge(feature): frontend auth and shell"
git push origin develop
```

### Branch H: `feature/frontend-transactions-budget-goals`

```powershell
git checkout develop
git checkout -b feature/frontend-transactions-budget-goals

# C43
git add frontend/src/components/styles/Auth.css
git commit -m "style(frontend-auth): add authentication screen styling"

# C44
git add frontend/src/components/LaunchingPage.js frontend/src/components/Home.js
git commit -m "feat(frontend-home): add launching and dashboard home views"

# C45
git add frontend/src/components/styles/LaunchingPage.css frontend/src/components/styles/Home.css
git commit -m "style(frontend-home): add launching and home page styles"

# C46
git add frontend/src/components/Transactions.js frontend/src/components/TransactionModal.js
git commit -m "feat(frontend-transactions): add transactions list and modal"

# C47
git add frontend/src/components/styles/Transactions.css frontend/src/components/styles/TransactionModal.css
git commit -m "style(frontend-transactions): add transactions and modal styles"

# C48
git add frontend/src/components/Budget.js frontend/src/components/Goals.js frontend/src/components/styles/Budget.css frontend/src/components/styles/Goals.css
git commit -m "feat(frontend-budget-goals): add budget and goals modules with styles"
```

```powershell
git push -u origin feature/frontend-transactions-budget-goals
git checkout develop
git merge --no-ff feature/frontend-transactions-budget-goals -m "merge(feature): frontend transactions budget goals"
git push origin develop
```

---

## Day 5 (12 commits)

### Branch I: `feature/frontend-reports-ai-investments`

```powershell
git checkout develop
git checkout -b feature/frontend-reports-ai-investments

# C49
git add frontend/src/components/Reports.js frontend/src/components/EnhancedReports.js
git commit -m "feat(frontend-reports): add standard and enhanced report views"

# C50
git add frontend/src/components/styles/Reports.css frontend/src/components/styles/EnhancedReports.css
git commit -m "style(frontend-reports): add reports and enhanced reports styles"

# C51
git add frontend/src/components/Chatbot.js
git commit -m "feat(frontend-chatbot): add chatbot interface component"

# C52
git add frontend/src/components/styles/Chatbot.css
git commit -m "style(frontend-chatbot): add chatbot component styling"

# C53
git add frontend/src/components/InvestmentCapitalPlanner.js
git commit -m "feat(frontend-investments): add investment capital planner view"

# C54
git add frontend/src/components/styles/InvestmentCapitalPlanner.css
git commit -m "style(frontend-investments): add investment planner styling"
```

```powershell
git push -u origin feature/frontend-reports-ai-investments
git checkout develop
git merge --no-ff feature/frontend-reports-ai-investments -m "merge(feature): frontend reports ai investments"
git push origin develop
```

### Branch J: `feature/docs-release-readiness`

```powershell
git checkout develop
git checkout -b feature/docs-release-readiness

# C55
git add frontend/src/components/__tests__/Login.test.js frontend/src/components/__tests__/Register.test.js
git commit -m "test(frontend): add login and register component tests"

# C56
git add frontend/src/App.test.js frontend/src/setupTests.js frontend/src/reportWebVitals.js
git commit -m "test(frontend): add app baseline test and test setup support"

# C57
git add REPORTS_OVERVIEW.md REPORTS_README.md REPORTS_SUMMARY.md REPORTS_TECHNICAL_DOCUMENTATION.md
git commit -m "docs(reports): add reports documentation suite"

# C58
git add INVESTMENT_README.md INVESTMENT_CAPITAL_PLANNER_GUIDE.md INVESTMENT_DEVELOPER_GUIDE.md INVESTMENT_IMPLEMENTATION_SUMMARY.md INVESTMENT_QUICK_REFERENCE.md INVESTMENT_DELIVERY_SUMMARY.md
git commit -m "docs(investments): add investment module documentation"

# C59
git add AI_ML_DEVELOPER_GUIDE.md AI_ML_TECHNICAL_ARCHITECTURE.md API_TESTING_GUIDE.md
git commit -m "docs(ai-ml): add ai/ml and api testing documentation"

# C60
git add DOCUMENTATION_INDEX.md QUICK_SETUP_GUIDE.md QUICK_REFERENCE.md DELIVERY_SUMMARY.md
git commit -m "docs(project): add documentation index quick guides and delivery summary"
```

```powershell
git push -u origin feature/docs-release-readiness
git checkout develop
git merge --no-ff feature/docs-release-readiness -m "merge(feature): docs and release readiness"
git push origin develop
```

---

## Final Release and Main Push

```powershell
git checkout develop
git checkout -b release/week-1

# Optional sanity check before release commit
npm --prefix BACKEND test
npm --prefix frontend test -- --watchAll=false

git push -u origin release/week-1

# Merge release into main
git checkout main
git merge --no-ff release/week-1 -m "release: week 1 delivery with 60 atomic commits"
git push -u origin main

# Back-merge main to develop
git checkout develop
git merge --no-ff main -m "chore(release): back-merge main into develop"
git push origin develop
```

## Optional: Day Tags

```powershell
git tag -a day1-complete -m "Completed day 1 commits"
git tag -a day2-complete -m "Completed day 2 commits"
git tag -a day3-complete -m "Completed day 3 commits"
git tag -a day4-complete -m "Completed day 4 commits"
git tag -a day5-complete -m "Completed day 5 commits"
git push origin --tags
```

## Notes for Atomic Commit Quality

- Run `git status` before every commit.
- Use `git diff --staged` to ensure only one concern per commit.
- If commit scope gets too large, split it before committing.
- Keep commit messages in conventional format: `type(scope): message`.
- Keep merge commits explicit with `--no-ff` for traceability.
- Never commit `.env` files; commit only `.env.example` files when needed.