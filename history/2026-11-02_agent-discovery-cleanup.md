# Agent discovery cleanup (2026-11-02)

## Problem

Audit of https://bumbleflies.de agent files found:

- English Field Notes #4 (`/en/blog/skills-as-apps-plugin-marketplace/`) missing from `agents.txt`, `llms.txt`, `llms-full.txt`.
- The six Discover skills (`/skills/*/SKILL.md`) only listed in `llms.txt` and the agent card.
- `llms-full.txt` had no links for services, case studies, about, legal pages (18 DE pages unreachable from it).
- `/.well-known/agent-card.json` declared an A2A `HTTP+JSON` interface at `https://bumbleflies.de`, but the site is static: no endpoint answers.
- `.md` files served as `application/octet-stream`.
- Page links without trailing slash cost a 301 each.

## Solution

- Filled the gaps in `agents.txt`, `llms.txt`, `llms-full.txt`; trailing-slash URLs throughout.
- Removed the A2A agent card and its nginx location (option A of: remove / info-only card / build real endpoint).
- ARD manifest (`ard.json`, `ai-catalog.json`) now lists one `application/agent-skills+md` entry per Discover skill instead of pointing at the card.
- nginx: `location ~* \.md$` serves `text/markdown; charset=utf-8`, gzip, CORS.

## Files changed

`public/{agents.txt,llms.txt,llms-full.txt,agents.md,robots.txt}`, `public/.well-known/{ard.json,ai-catalog.json}` (agent-card.json deleted), `nginx.conf`, `AGENTS.md`, `.claude/skills/sync-agent-content/SKILL.md`.

## Verification

```bash
npx vitest run            # 92 passed
npm run build
# every sitemap URL appears in agents.txt, llms.txt, llms-full.txt
grep -oP '(?<=<loc>)[^<]+' dist/sitemap-0.xml | while read u; do for f in agents.txt llms.txt llms-full.txt; do grep -qF "$u" public/$f || echo "missing in $f: $u"; done; done
# after deploy
curl -sI https://bumbleflies.de/skills/ai-business-case/SKILL.md | grep -i content-type   # text/markdown; charset=utf-8
curl -s -o /dev/null -w '%{http_code}\n' https://bumbleflies.de/.well-known/agent-card.json  # 404
```

nginx config verified locally (`nginx -t` plus a local run against `dist/`): `.md` returns `text/markdown; charset=utf-8`, gzip, CORS.

## Future

- If a callable agent is ever wanted, build a real endpoint (MCP server likely a better fit than A2A) and add it as an ARD entry.
