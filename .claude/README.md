# Claude Code Skills

This project has 3 development skills available in the `skills/` folder.

## Available Skills

### code-audit.md
Comprehensive codebase health check. Run before launches and after messy debugging.

**When to use:**
- After 2+ hours debugging
- Before production deploy
- Monthly maintenance
- Before hiring developers

### context-overflow.md
Monitor your context usage. Check every 30 minutes. Archive at 150k tokens.

**When to use:**
- Every time you open Claude Code
- Every 30 minutes during coding
- When Claude seems "confused"
- Before starting complex tasks

### first-principles-debug.md
Strategic problem solving. Use when stuck >30 minutes.

**When to use:**
- Stuck >30 minutes on same problem
- Same error appearing 3+ times
- Solutions getting more complex
- Feeling frustrated

---

## Protocol for Claude Code

**At start of EVERY session:**
1. Check context usage (show [XXXk / 200k])
2. If >150k, recommend archiving
3. Set 30-minute reminder to check again

**During work:**
- If user stuck >30 min, suggest first-principles-debug
- Before major commits, offer to run code-audit checklist

**Before shipping:**
- Run code-audit checklist
- Verify build passes
- Check for vulnerabilities

---

## Quick Workflow

1. **Start coding:** Check context-overflow
2. **If stuck:** Use first-principles-debug
3. **Before launch:** Run code-audit

---

**You have access to these files. Read and apply them.**
