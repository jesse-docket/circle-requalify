# Clara - Re-Qualification — Dynamic Context Ingestion

Agent: **Clara - Re-Qualification**, `711a4f88-d33d-4930-98c3-e50f1dc367f7` (Circle tenant).
All 13 variables live on this agent only. Production `Clara - Website Agent` was read, never edited.

The first nine are Circle's own HubSpot property names, carried over exactly. **The page sends
these same keys** — including the trailing underscore on `what_do_you_want_to_achieve_with_circle_`,
which is the real HubSpot property name and what circle.so/connect-with-sales already passes.
No name mismatch between page and agent.

Every "Context for Agent" description is ≤200 characters; the dashboard silently truncates past 200.

## From the form

| Variable | Context for Agent |
|---|---|
| `firstname` | Visitor's first name from the Connect with Sales form. Use it naturally in your first message. Never ask for it again. |
| `lastname` | Visitor's last name from the form. For records only; do not use it in conversation and never ask for it. |
| `email` | Work email from the form. Never re-ask it. A free-email domain is a soft signal they may be solo or early stage. |
| `what_do_you_want_to_achieve_with_circle_` | Form goal: I want to start building / I want to move from another platform / Just exploring. Shapes what you say; it does not change which route they are on. |
| `current_community_or_membership_size` | Form-stated community size. Reference it once to show you read it. Probe where their audience lives today only if it is small or zero. |
| `annual_revenue__range_` | Form-stated revenue band. 100K and above routes to sales; 50K-100K and under 50K route to a trial. Never read the band back to them as a number. |
| `part_of_a_team` | Form-stated team status. If they are solo, find the hidden decision-makers (co-founder, board, agency) before pushing for a meeting. |
| `desired_time_to_implement_community_product` | Form-stated timeline. Confirm it in passing. If it is vague, ask what would have to be true in 60 days. Never re-ask the question itself. |
| `plan_interest_survey_response` | Plan the visitor leaned toward: Pro, Business, Plus or Not sure. Use it as your default recommendation unless the conversation contradicts it. |

## Computed by the page

| Variable | Context for Agent |
|---|---|
| `route` | Either sales or trial. sales means pitch and book a meeting. trial means give the personalized trial link and walk them into checkout. Never say the word route aloud. |
| `opening_line` | The exact sentence to say immediately after your greeting, word for word, before anything else. Never paraphrase it and never skip it. |
| `trial_link` | The personalized start-trial URL for this visitor. On the trial route offer this exact link. Never substitute a generic Circle signup link. |
| `demo_mode` | When true this is an internal demo session. Behave exactly as normal; you may acknowledge it is a demo only if asked directly. |

## How a value reaches the agent

The form page writes every answer into the query string. `/connect-with-sales/` reads them,
computes `route`, `opening_line` and `trial_link`, and calls `AISeller.setContext()` once the
widget loader is ready — then `showAndConnect()` to open the panel and start talking.
With no parameters it calls `resetContext()` and Clara runs open discovery instead.

## The routing rule

| `annual_revenue__range_` | `route` |
|---|---|
| Over $10M/year · $1M - $10M/year · $250K - $1M/year · $100K - $250K/year | **sales** |
| $50K - $100K/year · Under $50K/year or no revenue | **trial** |

Intent shapes the wording, not the branch. A $100K+ visitor who said "Just exploring" still
goes to sales — Clara makes the intent concrete first, then asks for the meeting.
