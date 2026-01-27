# First Principles Debug Skill

## Purpose
Break out of debugging loops by questioning fundamental assumptions. Use when you've been stuck for 30+ minutes or tried the same approach 3+ times.

## When to Trigger
- Stuck on same problem for 30+ minutes
- Same error appearing 3+ times after "fixes"
- Feeling frustrated or going in circles
- Solution keeps getting more complex
- Claude keeps suggesting variations of failed approaches

## The Framework

### Step 1: STOP
Literally stop typing. Take a breath. The next attempt will probably also fail if you don't change approach.

### Step 2: State the ACTUAL Problem
Write it out:
```
What is ACTUALLY broken?
(Not what you think is broken, what IS broken)

Expected: [what should happen]
Actual: [what does happen]
Evidence: [the specific error/behavior]
```

### Step 3: Question Your Assumptions

Ask yourself:
1. **Am I solving the right problem?**
   - Is this error the cause or a symptom?
   - What ELSE could cause this behavior?

2. **What am I assuming?**
   - The file is being read correctly
   - The data exists
   - The function is being called
   - The import is correct
   - The environment is configured

3. **What have I NOT checked?**
   - List things you've assumed are fine
   - Check them anyway

### Step 4: The Debugging Questions

Answer honestly:
```
1. When did this LAST work?
   (What changed since then?)

2. What's the SIMPLEST possible cause?
   (Before complex explanations)

3. Can I reproduce this with minimal code?
   (Strip away everything else)

4. What does the ACTUAL error say?
   (Read it again, slowly)

5. Am I in the right file/branch/environment?
   (You'd be surprised)
```

### Step 5: Nuclear Options

If still stuck after Step 4, consider:

**Option A: Start Fresh**
- Delete the problematic code
- Rewrite from scratch with fresh approach
- Often faster than debugging

**Option B: Use a Template**
- Find working example code
- Copy and adapt instead of fixing

**Option C: Simplify Ruthlessly**
- Remove features until it works
- Add them back one by one

**Option D: Ask Different Question**
- Maybe the feature shouldn't exist
- Maybe there's a simpler way to achieve the goal
- Maybe a library handles this

**Option E: Walk Away**
- Fresh eyes in 15 minutes
- Sleep on it if possible
- Explain it to someone else (rubber duck)

## Debug Log Template

When stuck, fill this out:

```markdown
## Debug Session: [Date/Time]

### Problem Statement
**What's broken:**
**Expected:**
**Actual:**

### Attempts Made
1. Tried: [what] → Result: [what happened]
2. Tried: [what] → Result: [what happened]
3. Tried: [what] → Result: [what happened]

### Assumptions I'm Making
- [ ] [assumption 1]
- [ ] [assumption 2]
- [ ] [assumption 3]

### Things I Haven't Checked
- [ ] [thing 1]
- [ ] [thing 2]

### What Changed Recently
- [change 1]
- [change 2]

### Nuclear Option Considered
- [ ] Start fresh
- [ ] Use template
- [ ] Simplify
- [ ] Different approach
- [ ] Walk away

### Resolution
**What fixed it:**
**Root cause:**
**Lesson learned:**
```

## Common Root Causes

When stuck, check these first:

1. **Caching** - Old code running, not new
2. **Wrong file** - Editing file that isn't being used
3. **Typo** - Case sensitivity, spelling
4. **Import path** - Wrong module being imported
5. **Environment** - Different config in dev/prod
6. **Stale state** - Browser/server needs refresh
7. **Race condition** - Timing issue
8. **Null/undefined** - Data doesn't exist yet
9. **Type mismatch** - String vs number, etc.
10. **Wrong branch** - Not on the branch you think

## The 5-Minute Rule

If a solution doesn't work in 5 minutes, it's probably wrong.

Good fixes are usually:
- Simple (1-3 lines)
- Obvious in hindsight
- Target the root cause

Bad fixes are usually:
- Complex (multiple files)
- Workarounds
- "I don't know why this works"

## Integration

This skill works with:
- **context-overflow**: Debugging loops often caused by context overload
- **code-audit**: Audit can reveal underlying issues
- **tj-working-style**: Part of preventing burnout loops

## Quick Reference

```
STUCK > 30 MIN = TRIGGER THIS SKILL

1. STOP - Take a breath
2. STATE - What's actually broken?
3. QUESTION - What am I assuming?
4. CHECK - What haven't I verified?
5. NUCLEAR - Fresh start? Template? Simplify?

Root causes: Cache, wrong file, typo, import, env, state, timing, null, type, branch
```
