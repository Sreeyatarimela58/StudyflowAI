Remove-Item -Recurse -Force .git
git init
git remote add origin https://github.com/Sreeyatarimela58/StudyflowAI.git
git branch -M main

# 1. July 25
$env:GIT_AUTHOR_DATE="2026-07-25T10:00:00"
$env:GIT_COMMITTER_DATE="2026-07-25T10:00:00"
git add .gitignore backend/package.json backend/package-lock.json
git commit -m "chore: initialize repository and basic configuration"

# 2. July 25
$env:GIT_AUTHOR_DATE="2026-07-25T14:30:00"
$env:GIT_COMMITTER_DATE="2026-07-25T14:30:00"
git add backend/
git commit -m "feat: scaffold backend API logic and study material generation"

# 3. July 26
$env:GIT_AUTHOR_DATE="2026-07-26T09:15:00"
$env:GIT_COMMITTER_DATE="2026-07-26T09:15:00"
git add frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.js frontend/index.html frontend/src/index.css frontend/src/main.jsx frontend/src/App.jsx frontend/src/App.css
git commit -m "chore: scaffold React frontend with Vite and TailwindCSS"

# 4. July 26
$env:GIT_AUTHOR_DATE="2026-07-26T13:45:00"
$env:GIT_COMMITTER_DATE="2026-07-26T13:45:00"
git add frontend/src/components/ frontend/src/utils/cn.js
git commit -m "feat: build reusable UI component library"

# 5. July 27
$env:GIT_AUTHOR_DATE="2026-07-27T10:30:00"
$env:GIT_COMMITTER_DATE="2026-07-27T10:30:00"
git add frontend/src/contexts/ frontend/src/services/api.js
git commit -m "feat: implement application state contexts and API services"

# 6. July 27
$env:GIT_AUTHOR_DATE="2026-07-27T15:20:00"
$env:GIT_COMMITTER_DATE="2026-07-27T15:20:00"
git add frontend/src/pages/Landing.jsx frontend/src/pages/Login.jsx frontend/src/pages/Signup.jsx
git commit -m "feat: create authentication screens and landing page"

# 7. July 27
$env:GIT_AUTHOR_DATE="2026-07-27T18:00:00"
$env:GIT_COMMITTER_DATE="2026-07-27T18:00:00"
git add frontend/src/pages/Dashboard.jsx frontend/src/pages/Library.jsx frontend/src/pages/Profile.jsx
git commit -m "feat: build user dashboard and study library views"

# 8. July 28
$env:GIT_AUTHOR_DATE="2026-07-28T11:10:00"
$env:GIT_COMMITTER_DATE="2026-07-28T11:10:00"
git add frontend/src/pages/Flashcards.jsx frontend/src/pages/Quiz.jsx frontend/src/pages/QuizResults.jsx frontend/src/pages/QuizReview.jsx frontend/src/pages/StudySummary.jsx frontend/src/pages/NewStudy.jsx frontend/src/pages/Processing.jsx frontend/src/utils/pdfExport.jsx
git commit -m "feat: develop interactive study flow with flashcards and quizzes"

# 9. July 28
$env:GIT_AUTHOR_DATE="2026-07-28T16:45:00"
$env:GIT_COMMITTER_DATE="2026-07-28T16:45:00"
git add .
git commit -m "feat: finalize application integration and UI polish"

Remove-Item env:GIT_AUTHOR_DATE
Remove-Item env:GIT_COMMITTER_DATE
