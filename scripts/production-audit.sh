#!/bin/bash

echo "--- Running Production Readiness Audit ---"
SCORE=0
TOTAL=12

# 1. Dockerfile exists
if [ -f "apps/api/Dockerfile" ]; then 
    echo "✅ PASS — Dockerfile exists"
    ((SCORE++))
else 
    echo "❌ FAIL — Dockerfile missing: Ensure apps/api/Dockerfile exists"
fi

# 2. Health route
if grep -q "/health" apps/api/src/app.js; then 
    echo "✅ PASS — /health route defined"
    ((SCORE++))
else 
    echo "❌ FAIL — /health route missing: Add to apps/api/src/app.js"
fi

# 3. Helmet
if grep -q "helmet" apps/api/src/app.js; then 
    echo "✅ PASS — helmet imported"
    ((SCORE++))
else 
    echo "❌ FAIL — helmet missing: Import and use helmet in apps/api/src/app.js"
fi

# 4. CORS
if grep -q "cors" apps/api/src/app.js; then 
    echo "✅ PASS — cors imported"
    ((SCORE++))
else 
    echo "❌ FAIL — cors missing: Import and configure cors in apps/api/src/app.js"
fi

# 5. Rate-limiting
if grep -q "express-rate-limit" apps/api/src/app.js; then 
    echo "✅ PASS — rate-limit imported"
    ((SCORE++))
else 
    echo "❌ FAIL — rate-limit missing: Add express-rate-limit to apps/api/src/app.js"
fi

# 6. JWT Refresh
if grep -q "refresh" apps/api/src/controllers/authController.js; then 
    echo "✅ PASS — JWT refresh implemented"
    ((SCORE++))
else 
    echo "❌ FAIL — JWT refresh missing: Implement refresh logic in authController"
fi

# 7. No Localhost in Frontend
if grep -q -E "http://localhost|http://127\.0\.0\.1" apps/mobile/src/api/client.ts; then 
    echo "❌ FAIL — hardcoded localhost found in frontend API client: Use dynamic Expo Constants"
else 
    echo "✅ PASS — no localhost hardcoded in frontend api client"
    ((SCORE++))
fi

# 8. eas.json exists
if [ -f "apps/mobile/eas.json" ]; then 
    echo "✅ PASS — eas.json exists"
    ((SCORE++))
else 
    echo "❌ FAIL — eas.json missing: Create apps/mobile/eas.json"
fi

# 9. app.config.js exists
if [ -f "apps/mobile/app.config.js" ]; then 
    echo "✅ PASS — app.config.js exists"
    ((SCORE++))
else 
    echo "❌ FAIL — app.config.js missing: Create apps/mobile/app.config.js"
fi

# 10. CI/CD Workflows
if [ -f ".github/workflows/backend-ci.yml" ] && [ -f ".github/workflows/mobile-build.yml" ]; then 
    echo "✅ PASS — CI/CD workflows exist"
    ((SCORE++))
else 
    echo "❌ FAIL — CI/CD workflows missing"
fi

# 11. Git Secrets Leak Check (.env)
if git ls-files | grep -E "\.env$|\.env\." | grep -qv "\.env\.example"; then 
    echo "❌ FAIL — .env file is tracked by git: Run 'git rm --cached' immediately"
else 
    echo "✅ PASS — .env not committed to git"
    ((SCORE++))
fi

# 12. Git Secrets Leak Check (.keystore)
if git ls-files | grep -q "\.keystore$"; then 
    echo "❌ FAIL — .keystore is tracked by git: Run 'git rm --cached' immediately"
else 
    echo "✅ PASS — .keystore not committed to git"
    ((SCORE++))
fi

echo "----------------------------------------"
echo "SCORE: $SCORE/$TOTAL checks passed"

if [ $SCORE -eq $TOTAL ]; then
    echo "🚀 AUDIT PASSED. Your monorepo is ready to be committed and pushed to GitHub!"
else
    echo "⚠️  WARN — Please fix the failing checks before pushing your code."
fi
