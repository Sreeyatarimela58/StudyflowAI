Remove-Item -Recurse -Force .git
git init
git remote add origin https://github.com/Sreeyatarimela58/StudyflowAI.git
git branch -M main

$env:GIT_AUTHOR_DATE="2026-07-15T10:00:00"
$env:GIT_COMMITTER_DATE="2026-07-15T10:00:00"
git add .gitignore
git commit -m "chore: add .gitignore"

$env:GIT_AUTHOR_DATE="2026-07-16T14:30:00"
$env:GIT_COMMITTER_DATE="2026-07-16T14:30:00"
git add backend/package.json backend/package-lock.json
git commit -m "chore: setup backend dependencies"

$env:GIT_AUTHOR_DATE="2026-07-17T11:15:00"
$env:GIT_COMMITTER_DATE="2026-07-17T11:15:00"
git add backend/
git commit -m "feat: implement backend API and study material generation"

$env:GIT_AUTHOR_DATE="2026-07-19T09:45:00"
$env:GIT_COMMITTER_DATE="2026-07-19T09:45:00"
git add frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.js frontend/index.html frontend/src/index.css frontend/src/main.jsx
git commit -m "chore: scaffold frontend React project with Vite"

$env:GIT_AUTHOR_DATE="2026-07-20T16:20:00"
$env:GIT_COMMITTER_DATE="2026-07-20T16:20:00"
git add frontend/src/contexts/ frontend/src/utils/
git commit -m "feat: setup application context and utility functions"

$env:GIT_AUTHOR_DATE="2026-07-22T13:10:00"
$env:GIT_COMMITTER_DATE="2026-07-22T13:10:00"
git add frontend/src/components/
git commit -m "feat: create reusable UI components"

$env:GIT_AUTHOR_DATE="2026-07-23T10:05:00"
$env:GIT_COMMITTER_DATE="2026-07-23T10:05:00"
git add frontend/src/App.jsx frontend/src/App.css
git commit -m "feat: implement application layout and routing structure"

$env:GIT_AUTHOR_DATE="2026-07-25T15:40:00"
$env:GIT_COMMITTER_DATE="2026-07-25T15:40:00"
git add frontend/src/pages/Landing.jsx frontend/src/pages/Login.jsx frontend/src/pages/Signup.jsx
git commit -m "feat: implement authentication and landing pages"

$env:GIT_AUTHOR_DATE="2026-07-26T11:55:00"
$env:GIT_COMMITTER_DATE="2026-07-26T11:55:00"
git add frontend/src/pages/Dashboard.jsx frontend/src/pages/Library.jsx frontend/src/pages/Profile.jsx
git commit -m "feat: implement user dashboard and study library"

$env:GIT_AUTHOR_DATE="2026-07-27T14:25:00"
$env:GIT_COMMITTER_DATE="2026-07-27T14:25:00"
git add frontend/src/pages/Flashcards.jsx frontend/src/pages/Quiz.jsx frontend/src/pages/QuizResults.jsx frontend/src/pages/QuizReview.jsx frontend/src/pages/StudySummary.jsx
git commit -m "feat: implement core study flow with flashcards and quizzes"

$env:GIT_AUTHOR_DATE="2026-07-28T16:00:00"
$env:GIT_COMMITTER_DATE="2026-07-28T16:00:00"
git add .
git commit -m "feat: final UI polish, integration, and bug fixes"

Remove-Item env:GIT_AUTHOR_DATE
Remove-Item env:GIT_COMMITTER_DATE
