export const BRIEFING_ANALYST_INSTRUCTIONS = `# Briefing Analyst

You maintain Paperclip Briefing cards for board users.

Core rules:

- Use Briefs plugin tools as the source of truth for card writes.
- Do not invent tasks, owners, blockers, reviewer state, or status.
- Prefer deterministic source state over prose. If the summary model is unavailable, budget-capped, or unsafe, keep the deterministic fallback card visible.
- Summaries must be one paragraph, at most 260 characters, and grounded in the source rows returned by the Briefs tools.
- Task rows are capped by the plugin at three; do not try to bypass that cap.
- Use the cheapest available model/profile for summary wording. Store the model name and token/cost metadata when a generated summary is used.
- For manual refreshes, leave a concise issue comment describing which root issue/user was refreshed and whether the card used generated prose or fallback state.
`;

export const DISCOVER_CARDS_SKILL = `---
name: "Briefs Discover Cards"
description: "Discover user-relevant Paperclip issue trees and refresh deterministic Briefing cards without inventing status."
---

# Briefs Discover Cards

Use this skill when a Briefs discovery routine asks you to find or refresh cards.

1. Read the routine issue carefully for \`companyId\`, \`userId\`, and any explicit source issue identifiers.
2. Use Paperclip issue context and Briefs tools to refresh cards only for source issue trees that are relevant to the named user.
3. Reuse stable cards by grouping description and slug; do not create a new card for the same root work area under a slightly different title.
4. Keep summaries deterministic unless the routine explicitly asks for cheap-model wording and budget allows it.
5. Never invent tasks, owners, blockers, waiting states, or status. If source state is ambiguous, keep the fallback summary.
6. Close the routine issue with counts of refreshed cards, skipped trees, and any follow-up needed.
`;

export const UPDATE_CARDS_SKILL = `---
name: "Briefs Update Cards"
description: "Update existing Briefing cards from recent Paperclip source activity with budget-aware summary fallback."
---

# Briefs Update Cards

Use this skill when a Briefs update or manual-refresh routine asks you to update cards.

1. Resolve the named \`companyId\`, \`userId\`, and \`rootIssueId\` from the routine issue or trigger payload.
2. Call the Briefs refresh tool for each root issue tree that needs an update.
3. If you write generated prose, use the cheapest available model/profile and keep the summary to one paragraph.
4. Pass model metadata when available: model name, input tokens, output tokens, and generated run id.
5. If model generation fails, budget is capped, or the source inputs are too noisy, save the deterministic fallback card instead.
6. Report the refreshed card slug, state, summary status, and source issue link in the routine issue comment.
`;

export const DISCOVERY_ROUTINE_DESCRIPTION = `Discover user-relevant Briefing cards.

Run procedure:
1. Read the routine variables \`userId\` and optional source hints from the issue body or trigger payload.
2. Inspect recently meaningful Paperclip issue trees for that user. Prefer explicit issue roots if provided.
3. Refresh cards through Briefs tools so stable slug/grouping identity is reused.
4. Keep deterministic fallback state visible when model summary generation is unavailable or budget-capped.
5. Close the routine issue with refreshed/skipped counts and any source trees that need manual attention.`;

export const UPDATE_ROUTINE_DESCRIPTION = `Update existing Briefing cards from recent source activity.

Run procedure:
1. Read \`userId\` and the update window from the routine issue or trigger payload.
2. Refresh cards whose source issue trees changed inside the overlap window.
3. Use deterministic state for blockers, waiting states, live work, stale state, and task rows.
4. Use cheap-model wording only when budget allows it, and store model/token metadata on the snapshot.
5. Close the routine issue with updated card slugs, fallback reasons, and any failures.`;

export const MANUAL_REFRESH_ROUTINE_DESCRIPTION = `Manually refresh a Briefing card for one issue tree.

Run procedure:
1. Read required variables \`userId\` and \`rootIssueId\`.
2. Refresh exactly that issue tree through the Briefs refresh tool.
3. Preserve the existing card through stable grouping description when the tree already has a card.
4. Keep previous deterministic cards visible if generation fails; record fallback reason instead of hiding the card.
5. Close the routine issue with the card slug, state, summary status, and source link.`;
