# Code Audit Skill

## Purpose
Comprehensive codebase health check to catch issues before they become problems. Run this after debugging sessions, before launches, and for monthly maintenance.

## When to Trigger
- After 2+ hours of debugging
- Before production deployment
- Monthly maintenance check
- Before hiring new developers
- After major refactoring

## The Audit Checklist

### Phase 1: Dead Code Removal
```bash
# Find unused exports
grep -r "export" --include="*.tsx" --include="*.ts" | head -50

# Check each component is imported somewhere
# Delete files with 0 imports outside themselves
```

**Check for:**
- [ ] Unused components (only self-reference in file)
- [ ] Commented-out code blocks
- [ ] Console.log statements
- [ ] Unused imports
- [ ] Dead functions

### Phase 2: Dependency Audit
```bash
# List all dependencies
npm list --depth=0

# Check for unused packages
npx depcheck

# Security vulnerabilities
npm audit
```

**Check for:**
- [ ] Unused npm packages
- [ ] Outdated dependencies with vulnerabilities
- [ ] Duplicate functionality (multiple packages doing same thing)
- [ ] Dev dependencies in production

### Phase 3: File Structure Review
```bash
# Count components
find components -name "*.tsx" | wc -l

# Look for duplicates
# Check naming conventions
```

**Check for:**
- [ ] Duplicate components doing the same thing
- [ ] Files in wrong locations
- [ ] Inconsistent naming conventions
- [ ] Orphaned files

### Phase 4: Environment Variables
**Check for:**
- [ ] All env vars documented
- [ ] No secrets in code
- [ ] .env files in .gitignore
- [ ] Sample .env.example exists

### Phase 5: Build Verification
```bash
npm run build
npm run lint
npm audit
```

**Check for:**
- [ ] Build completes without errors
- [ ] No TypeScript errors (or documented exceptions)
- [ ] No security vulnerabilities
- [ ] Lint passes (or documented exceptions)

### Phase 6: Security Quick Check
**Check for:**
- [ ] No dangerouslySetInnerHTML with user input
- [ ] No eval() usage
- [ ] API keys not exposed in client code
- [ ] Auth properly implemented

## Output Format

After running audit, generate report:

```markdown
# Code Audit Report - [Date]

## Summary
- Files deleted: X
- Packages removed: X
- Lines removed: X
- Build status: Pass/Fail
- Vulnerabilities: X

## Critical Issues
1. [Issue description + file location]

## Warnings
1. [Warning + recommendation]

## Completed Cleanup
- [List of changes made]

## Remaining Tech Debt
- [Known issues to address later]
```

## Quick Audit (15 min version)

If short on time, minimum checks:
1. `npm run build` - must pass
2. `npm audit` - no critical vulnerabilities
3. Quick grep for console.log in components
4. Check for obvious dead code

## Integration

This skill works with:
- **context-overflow**: Run audit when archiving to clean session
- **first-principles-debug**: Audit can reveal root causes
- **tj-working-style**: Part of quality gates before shipping
