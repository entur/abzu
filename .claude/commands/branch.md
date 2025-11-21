---
description: Load context for a specific branch (does not switch git branches)
---

You are helping the user load branch-specific context for their work.

**Instructions:**

1. **Determine branch name**:
   - If a branch name is provided as the first argument (e.g., `/branch modes-and-submodes-changes`), use that
   - If no argument is provided, use the Bash tool to run `git branch --show-current` to get the current branch name

2. **Look for context file**: Check for `.claude/context/<branch-name>.md`
   - If it exists: Read it and present the context to understand what work is being done on this branch
   - If it doesn't exist: Ask the user "What is the purpose of the `<branch-name>` branch?" and offer to create a context file

3. **Present context**: If a context file exists, summarize:
   - Branch purpose
   - Key changes/features being worked on
   - Any important notes or next steps

4. **Offer to update**: If context exists, offer to help update it if anything has changed

**Never perform git operations** - this command is only for loading and managing context files.

**Format:**
- Branch: `<branch-name>`
- Context: <summary or prompt for purpose>
