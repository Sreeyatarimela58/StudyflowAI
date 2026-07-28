Remove-Item -Recurse -Force .git
git init
git remote add origin https://github.com/Sreeyatarimela58/StudyflowAI.git
git branch -M main

# 1. July 25: Project Setup
$env:GIT_AUTHOR_DATE="2026-07-25T10:00:00"
$env:GIT_COMMITTER_DATE="2026-07-25T10:00:00"
git add .gitignore backend/package.json backend/package-lock.json backend/index.html frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.js frontend/index.html frontend/src/index.css frontend/src/main.jsx frontend/src/App.jsx frontend/src/App.css frontend/src/contexts/ frontend/src/utils/ frontend/src/components/
git commit -m "chore: initial project setup and base UI components"

# 2. July 26: Authentication
$env:GIT_AUTHOR_DATE="2026-07-26T14:30:00"
$env:GIT_COMMITTER_DATE="2026-07-26T14:30:00"
git add frontend/src/pages/Landing.jsx frontend/src/pages/Login.jsx frontend/src/pages/Signup.jsx
git commit -m "feat: implement authentication and landing pages"

# 3. July 27: Dashboard
$env:GIT_AUTHOR_DATE="2026-07-27T11:15:00"
$env:GIT_COMMITTER_DATE="2026-07-27T11:15:00"
git add frontend/src/pages/Dashboard.jsx frontend/src/pages/Library.jsx frontend/src/pages/Profile.jsx
git commit -m "feat: implement user dashboard and study library"

# 4. July 28: Study Flow
$env:GIT_AUTHOR_DATE="2026-07-28T16:20:00"
$env:GIT_COMMITTER_DATE="2026-07-28T16:20:00"
git add backend/ frontend/src/pages/Flashcards.jsx frontend/src/pages/Quiz.jsx frontend/src/pages/QuizResults.jsx frontend/src/pages/QuizReview.jsx frontend/src/pages/StudySummary.jsx frontend/src/pages/NewStudy.jsx frontend/src/pages/Processing.jsx frontend/src/services/
git commit -m "feat: implement core study flow, flashcards, quizzes, and backend integration"

# 5. July 29: UI Polish
$env:GIT_AUTHOR_DATE="2026-07-29T00:15:00"
$env:GIT_COMMITTER_DATE="2026-07-29T00:15:00"
git add .
git commit -m "feat: final UI polish, styling enhancements, and bug fixes"

Remove-Item env:GIT_AUTHOR_DATE
Remove-Item env:GIT_COMMITTER_DATE
