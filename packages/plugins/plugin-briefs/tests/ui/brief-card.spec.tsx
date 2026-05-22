import { describe, expect, it, vi } from "vitest";

vi.mock("@paperclipai/plugin-sdk/ui", () => {
  return {
    useHostNavigation: () => ({
      resolveHref: (to: string) => to,
      navigate: () => {},
      linkProps: (to: string) => ({ href: to, onClick: () => {} }),
    }),
    usePluginAction: () => vi.fn(async () => ({ ok: true })),
    usePluginData: () => ({ data: null, loading: false, error: null, refresh: () => {} }),
    usePluginToast: () => vi.fn(),
    useHostLocation: () => ({ pathname: "/PAP/briefs", search: "", hash: "" }),
    usePluginStream: () => ({ events: [], lastEvent: null, connecting: false, connected: false, error: null, close: () => {} }),
  };
});

import { renderToStaticMarkup } from "react-dom/server";
import { BriefCardView } from "../../src/ui/app.js";
import { makeCard, makeSnapshot, makeTaskRow } from "./fixtures.js";

function renderCard(card: ReturnType<typeof makeCard>): string {
  return renderToStaticMarkup(<BriefCardView card={card} onChanged={() => {}} />);
}

describe("BriefCardView", () => {
  it("renders title, single state badge, and primary source rows", () => {
    const card = makeCard({
      title: "Briefs plugin planning",
      state: "live",
      snapshot: makeSnapshot({
        summaryParagraph: "Phase 5 page UI in flight; deterministic data is done.",
        taskRows: [
          makeTaskRow({ identifier: "PAP-9963", titleLine: "Wire briefing page UI", rightTag: "in_progress" }),
          makeTaskRow({ identifier: "PAP-9961", titleLine: "Deterministic card service", rightTag: "done" }),
        ],
      }),
    });
    const html = renderCard(card);

    expect(html).toContain("Briefs plugin planning");
    expect(html).toMatch(/data-briefs-state-badge="live"[^>]*>Live</);
    expect(html).toContain("Wire briefing page UI");
    expect(html).toContain("Deterministic card service");
    expect(html).toContain("PAP-9963");
    expect(html).toContain("PAP-9961");

    // exactly one state badge per card
    expect(html.match(/data-briefs-state-badge=/g)?.length).toBe(1);

    // summary slot rendered, no fallback panel
    expect(html).toContain("data-briefs-summary");
    expect(html).not.toContain("data-briefs-summary-fallback");
  });

  it("renders the fallback panel without disturbing the state badge", () => {
    const card = makeCard({
      title: "Cost dashboard improvements",
      state: "live",
      summaryStatus: "fallback",
      snapshot: makeSnapshot({
        summaryParagraph: null,
        summaryStatus: "fallback",
        summaryFailureReason: "budget_capped",
        taskRows: [makeTaskRow({ identifier: "PAP-8500", titleLine: "Wire cost chart filters", rightTag: "in_progress" })],
      }),
    });
    const html = renderCard(card);

    expect(html).toMatch(/data-briefs-state-badge="live"[^>]*>Live</);
    expect(html).toContain("data-briefs-summary-fallback");
    expect(html).toContain("Summary unavailable");
    expect(html).toContain("Summary skipped to stay under budget");
    expect(html.match(/data-briefs-state-badge=/g)?.length).toBe(1);
  });

  it("annotates intra-tree blocked source rows distinctly from out-of-tree blockers", () => {
    const card = makeCard({
      title: "Sandbox runner",
      state: "blocked",
      snapshot: makeSnapshot({
        summaryParagraph: "External blocker present.",
        taskRows: [
          makeTaskRow({ identifier: "PAP-1", titleLine: "Out-of-tree blocker", rightTag: "blocked", isIntraTreeBlocked: false }),
          makeTaskRow({ identifier: "PAP-2", titleLine: "Intra-tree blocker", rightTag: "blocked", isIntraTreeBlocked: true }),
        ],
      }),
    });
    const html = renderCard(card);
    const matches = html.match(/aria-label="intra-tree blocker"/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("renders pin button reflecting card pinned state", () => {
    const pinned = makeCard({ pinned: true });
    expect(renderCard(pinned)).toMatch(/aria-label="Unpin card"/);
    const unpinned = makeCard({ pinned: false });
    expect(renderCard(unpinned)).toMatch(/aria-label="Pin card"/);
  });
});
