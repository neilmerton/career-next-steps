---
name: better-drafting
description: Produce clean, human-register prose free of AI writing patterns. Use when drafting, editing, or reviewing any long-form text — reports, essays, briefings, articles, exhibition copy, strategy documents, or any prose longer than a few sentences. Triggers on any writing task, content review, or request to improve draft quality. Combines positive voice-routing constraints (Phase 1) with a diagnostic editorial checklist (Phase 2).
metadata:
  trigger: Writing prose, editing drafts, reviewing content for AI patterns, long-form output, reports, briefings, essays, articles
  author: Merged from Stop Slop v2 (Wake & Claude / Axiom) and Stop Slop v1 (Hardik Pandya), combined by Claude for Matt
  architecture: Two-phase — retrieval-shaped positive routing (generative) + diagnostic checklist (editorial)
---

# Better Drafting

Two-phase skill for producing clean, human-register prose.

**Phase 1 (Generative):** Route prose into a specific voice basin using positive constraints. Do not load AI failure patterns into generation context.

**Phase 2 (Editorial):** After drafting, run a diagnostic checklist to catch residual tics. This phase operates on existing text, not on the generation process.

---

## Phase 1: Generative Routing

### Why positive routing

Listing phrases to avoid primes those phrases during generation. Cataloguing structures to reject makes them salient at inference time. The model spends energy resisting tokens that would not have been attractive if they had never been mentioned.

Phase 1 uses the opposite mechanism: positive constraints that make weak prose structurally impossible. The model sees where to go, not where to avoid.

### Step 0: Derive the voice basin

Before writing, silently complete these fields. Do not skip this. Do not output them unless asked. The derivation commits to a specific register before the first sentence is rendered. Without it, output defaults to the highest-probability prose register — which is the slop basin.

1. **Target register:** What does this sound like? (e.g. "working engineer's Slack message," "Economist briefing note," "literary essay for Granta," "exhibition wall text for a design-literate public")
2. **Reader:** One specific person or role. Not "general audience."
3. **Purpose:** What should the reader do, feel, or know after reading?
4. **Constraint anchor:** One concrete limitation — a word count, a format, a tone ceiling — that prevents drift.

### The six routing constraints

Every sentence of output must satisfy all six simultaneously.

#### 1. Human Subject Rule

Every sentence has a named or specific human subject performing a concrete action. "You" counts. A named role ("the engineer," "her landlord") counts. Inanimate objects, abstractions, and unnamed collectives do not act.

- ✓ "She cancelled the contract on Thursday."
- ✓ "You will lose three clients if the API goes down."

#### 2. Material Anchor Rule

Every claim contains at least one concrete noun: an object, a cost, a distance, a duration, a name, a sensory detail. Sentences composed only of abstract nouns evaluating other abstract nouns fail this rule.

- ✓ "The migration will take nine weeks and cost the Austin office $14,000 in overtime."

#### 3. Single-Pass Assertion Rule

State the point on arrival. No runway. No negation-then-assertion. The first sentence of a paragraph is the claim. Everything after it is evidence or consequence.

- ✓ "Retention dropped 12% after the rebrand."

#### 4. Rhythm Variation Rule

No three consecutive sentences may fall within five words of each other in length. Inline lists contain two items. Paragraphs do not end with their shortest sentence.

#### 5. Register Lock Rule

Every sentence must be plausible in the register specified by the derivation. If the derivation says "working engineer's Slack message," no sentence may read like a keynote speech. The register is a fence. Stay inside it.

#### 6. Earned Emphasis Rule

No sentence may announce its own importance. Importance is earned by the specificity and consequence of the content. The reader decides what matters based on what you showed them.

- ✓ "If the patch ships late, the 2.0 launch slips to Q3 and the Series B deck needs new numbers."

---

## Phase 2: Editorial Diagnostic

Run these checks **after** drafting is complete. This is a presence/absence sweep on finished text. Do not load these patterns into context before generation — they exist only as a post-draft filter.

### Sentence-level checks

- Does every sentence have a human subject? If not, find the actor and make them the subject.
- Any adverbs? Remove them.
- Any passive constructions? Restructure.
- Any inanimate thing performing a human verb ("the decision emerges")? Name the person who decided.
- Any sentence starting with a Wh- word? Restructure.

### Paragraph-level checks

- Any "here's what/this/that" throat-clearing? Cut to the point.
- Any "not X, it's Y" binary contrasts? State Y directly.
- Three consecutive sentences matching length? Break one.
- Paragraph ending with a punchy one-liner? Vary the close.
- Any em dashes? Remove them.
- Any vague declarative ("The implications are significant")? Name the specific implication.
- Any narrator-from-a-distance voice ("Nobody designed this")? Put the reader in the scene.
- Any meta-joiners ("The rest of this essay...")? Delete them. Let the prose move.

### Piece-level checks

- Does the prose stay inside the register specified in the derivation?
- Could a reader identify the target register without being told? If the prose is register-neutral, the derivation was too thin.
- If a sentence sounds like a pull-quote, rewrite it.

---

## Scoring

Rate 1–10 on each dimension after both phases are complete.

| Dimension | Measures |
|-----------|----------|
| Specificity | Concrete nouns per paragraph — objects, costs, names, textures, durations. |
| Agency | Percentage of sentences with a human subject performing a concrete verb. |
| Rhythm | Sentence-length variance across the piece. Standard deviation of word counts. |
| Register fidelity | Would this paragraph be publishable in the target outlet without editing for voice? |
| Density | Ratio of load-bearing sentences to total sentences. Every sentence advances the argument or provides evidence. |

**Below 35/50:** the derivation was too thin or the editorial pass was skipped. Re-derive and rewrite.

---

## Usage Notes

- For short conversational replies, apply the routing constraints lightly. The full two-phase process is for substantial prose — reports, briefings, essays, exhibition copy, strategy documents.
- The derivation step is the single highest-leverage intervention. A thin derivation produces generic prose regardless of how rigorous the editorial pass is.
- Phase 2 catches things Phase 1 misses: stray adverbs, residual passive voice, rhythm monotony. Neither phase alone is sufficient.

## License

MIT
