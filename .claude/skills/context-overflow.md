# Context Overflow Skill

## Purpose
Monitor and manage Claude Code's context window to prevent degradation. The 200k token limit causes issues when exceeded - Claude becomes confused, forgets earlier work, and loops on problems.

## Critical Thresholds

| Usage | Status | Action |
|-------|--------|--------|
| 0-100k | GREEN | Continue normally |
| 100-150k | YELLOW | Plan wrap-up, avoid new complex tasks |
| 150-180k | ORANGE | Archive immediately after current task |
| 180k+ | RED | Stop. Archive now. Claude is degrading. |

## When to Check
- **Every time you open Claude Code** - Check first
- **Every 30 minutes** during active coding
- **When Claude seems confused** or repeats itself
- **Before starting complex tasks**
- **After long debugging sessions**

## How to Check Context

Ask Claude Code:
```
What's my current context usage? Show me [XXXk / 200k]
```

Or check the status line if configured.

## Warning Signs of Context Overflow

Watch for these behaviors:
- Claude repeating the same solution that already failed
- Forgetting files it just read
- Giving contradictory answers
- Losing track of the overall goal
- Taking longer to respond
- Making obvious mistakes

## Archive Protocol

When reaching ORANGE zone (150k+):

### Step 1: Summarize Current State
Ask Claude:
```
Summarize our current session:
1. What we accomplished
2. What's in progress
3. What's left to do
4. Any blockers or important context
```

### Step 2: Save the Summary
Copy the summary to:
- Obsidian note
- Project README
- GitHub issue
- Wherever you'll find it

### Step 3: Start Fresh Session
1. Close current Claude Code session
2. Open new session
3. Paste the summary as context
4. Continue work

## Prevention Strategies

### 1. Chunk Work Sessions
- Don't try to do everything in one session
- Natural break points: after each feature, after debugging, before major refactors

### 2. Be Concise
- Ask focused questions
- Don't paste entire files when snippets work
- Use specific file paths instead of "that file we were working on"

### 3. Regular Commits
- Commit frequently so work isn't lost
- Each commit is a natural checkpoint

### 4. Use Agents for Exploration
- Let Task agents do searches (they have separate context)
- Keep main context clean

## Emergency Recovery

If Claude is clearly in RED zone and confused:

1. **Stop immediately** - More prompts make it worse
2. **Save any uncommitted work** manually
3. **Close session**
4. **Start fresh** with minimal context:
   - Just the current error/task
   - Relevant file paths
   - Brief history if needed

## Session Template

Start each session with:
```
Current project: [name]
Working on: [specific task]
Files involved: [list key files]
Last session ended: [brief summary]
```

This gives Claude focused context without bloat.

## Integration

This skill works with:
- **code-audit**: Run audit when archiving to clean up
- **first-principles-debug**: Context overflow causes debugging loops
- **tj-working-style**: Check context before starting work

## Quick Reference Card

```
GREEN (0-100k)    = Full speed ahead
YELLOW (100-150k) = Wrap up current task
ORANGE (150-180k) = Archive after this
RED (180k+)       = STOP NOW, archive

Check: "Show context usage"
Archive: Summarize -> Save -> Fresh session
Signs: Repetition, confusion, slow, mistakes
```
