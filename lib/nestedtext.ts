/**
 * NestedText parser for bumbleflies Astro content migration.
 *
 * Parses a lightweight indentation-based format used for .nt content files.
 * Frontmatter occupies the start of the file; a lone "---" line separates it
 * from the optional markdown body that follows.
 *
 * Supported frontmatter syntax:
 *   key: value          → inline string value
 *   key:                → parent key; children determined by indented lines below
 *     child: value
 *   list:
 *     - scalar item     → list of strings
 *     - key: value      → list of objects (first key inline on dash line)
 *       more: keys      → additional object properties (dash-indent + 2)
 *   # comment           → ignored
 *   (blank line)        → ignored inside frontmatter
 *   ---                 → first occurrence separates frontmatter from body
 */

// ── Public types ─────────────────────────────────────────────────────────────

/** A scalar string value in the NestedText tree. */
export type NestedString = string;

/** An ordered list of NestedValues. */
export type NestedList = NestedValue[];

/** A string-keyed dictionary of NestedValues. */
export type NestedDict = { [key: string]: NestedValue };

/** Any value that can appear in a parsed NestedText document. */
export type NestedValue = NestedString | NestedList | NestedDict;

/**
 * Result of parsing a NestedText document.
 *
 * @property data - The parsed frontmatter as a nested object.
 * @property body - The raw markdown body text after the "---" separator,
 *                  with leading/trailing whitespace trimmed. Empty string if
 *                  no separator was present.
 */
export interface ParseResult {
  data: NestedDict;
  body: string;
}

// ── Internal types ────────────────────────────────────────────────────────────

/** A key-value token: "key: value" where value is non-empty. */
interface KvToken {
  type: 'kv';
  indent: number;
  key: string;
  value: string;
  line: number;
}

/** A parent-key token: "key:" with no inline value (block follows). */
interface ParentToken {
  type: 'parent';
  indent: number;
  key: string;
  line: number;
}

/** A list-item token: "- ..." at the current indent level. */
interface ItemToken {
  type: 'item';
  indent: number;
  /** Everything after the "- " prefix, trimmed. */
  dashValue: string;
  line: number;
}

type Token = KvToken | ParentToken | ItemToken;

/** Mutable cursor shared across recursive calls. */
interface Cursor {
  idx: number;
}

// ── Input splitting ───────────────────────────────────────────────────────────

/**
 * Splits raw input into frontmatter lines and body text.
 *
 * The FIRST line that is exactly "---" (optionally surrounded by whitespace)
 * acts as the separator. Lines before it form the frontmatter; everything
 * after it (joined) becomes the body.
 *
 * @param input - Raw file contents.
 * @returns Frontmatter lines and trimmed body string.
 */
function splitInput(input: string): { frontMatterLines: string[]; body: string } {
  const lines = input.split('\n');
  const sepIdx = lines.findIndex((l) => l.trim() === '---');

  if (sepIdx === -1) {
    return { frontMatterLines: lines, body: '' };
  }

  const frontMatterLines = lines.slice(0, sepIdx);
  const bodyLines = lines.slice(sepIdx + 1);
  const body = bodyLines.join('\n').trim();

  return { frontMatterLines, body };
}

// ── Tokenizer ─────────────────────────────────────────────────────────────────

/**
 * Converts frontmatter lines into a flat list of meaningful tokens.
 *
 * Comments (lines beginning with "#") and blank lines are silently dropped.
 * Indentation is measured in spaces; tabs are treated as 2 spaces each.
 *
 * @param lines - Raw frontmatter lines (no "---" separator included).
 * @param lineOffset - Line number of the first entry, for error messages.
 * @returns Array of Token objects in document order.
 */
function tokenize(lines: string[], lineOffset: number): Token[] {
  const tokens: Token[] = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const lineNum = lineOffset + i + 1;

    // Normalise tabs → 2 spaces for indent counting, keep original for value
    const normalised = raw.replace(/\t/g, '  ');
    const trimmed = normalised.trimStart();

    // Skip blank lines and comments
    if (trimmed === '' || trimmed.startsWith('#')) continue;

    const indent = normalised.length - trimmed.length;

    // List item: starts with "- "
    if (trimmed.startsWith('- ') || trimmed === '-') {
      const dashValue = trimmed.startsWith('- ') ? trimmed.slice(2).trim() : '';
      tokens.push({ type: 'item', indent, dashValue, line: lineNum });
      continue;
    }

    // Key-value or parent key: split on first colon
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) {
      // Bare value line — treated as continuation; skip (not used in this format)
      continue;
    }

    const key = trimmed.slice(0, colonIdx).trim();
    const afterColon = trimmed.slice(colonIdx + 1);
    const value = afterColon.trim();

    if (value === '') {
      tokens.push({ type: 'parent', indent, key, line: lineNum });
    } else {
      // Strip surrounding double-quotes for compatibility with YAML-quoted values
      const stripped = value.startsWith('"') && value.endsWith('"')
        ? value.slice(1, -1)
        : value;
      tokens.push({ type: 'kv', indent, key, value: stripped, line: lineNum });
    }
  }

  return tokens;
}

// ── Recursive descent parser ──────────────────────────────────────────────────

/**
 * Determines the indent of the next token without advancing the cursor.
 * Returns Infinity if no tokens remain.
 */
function peekIndent(tokens: Token[], cur: Cursor): number {
  return cur.idx < tokens.length ? tokens[cur.idx].indent : Infinity;
}

/**
 * Parses a block of tokens at a given base indentation level.
 *
 * Examines the first token to decide whether the block is a list (starts with
 * an item token) or a dict (starts with a kv/parent token).
 *
 * @param tokens - Full token array.
 * @param cur    - Shared mutable cursor.
 * @param baseIndent - Expected indentation of tokens in this block.
 * @returns Parsed NestedValue.
 */
function parseBlock(tokens: Token[], cur: Cursor, baseIndent: number): NestedValue {
  if (cur.idx >= tokens.length) return {};
  const first = tokens[cur.idx];
  if (first.indent < baseIndent) return {};

  if (first.type === 'item') {
    return parseList(tokens, cur, baseIndent);
  }
  return parseDict(tokens, cur, baseIndent);
}

/**
 * Parses a dictionary block: contiguous kv/parent tokens at baseIndent.
 *
 * @param tokens     - Full token array.
 * @param cur        - Shared mutable cursor.
 * @param baseIndent - Expected indentation for keys in this dict.
 * @returns Parsed NestedDict.
 */
function parseDict(tokens: Token[], cur: Cursor, baseIndent: number): NestedDict {
  const dict: NestedDict = {};

  while (cur.idx < tokens.length) {
    const tok = tokens[cur.idx];

    // Token belongs to a shallower block — stop
    if (tok.indent < baseIndent) break;

    // Token belongs to a deeper block — should not happen at this level; skip
    if (tok.indent > baseIndent) {
      cur.idx++;
      continue;
    }

    if (tok.type === 'kv') {
      dict[tok.key] = tok.value;
      cur.idx++;
    } else if (tok.type === 'parent') {
      cur.idx++;
      // Children are at whatever indent the next token has, as long as it's deeper
      const childIndent = peekIndent(tokens, cur);
      if (childIndent > baseIndent) {
        dict[tok.key] = parseBlock(tokens, cur, childIndent);
      } else {
        dict[tok.key] = {};
      }
    } else {
      // item token at this indent — means we're inside a parseList call that
      // somehow reached here; stop to avoid infinite loops
      break;
    }
  }

  return dict;
}

/**
 * Parses a list block: contiguous item tokens at baseIndent.
 *
 * Each item is either:
 *   - A scalar string (dashValue contains no colon, or colon is not key-like)
 *   - An object (dashValue is "key: value"; further properties collected at
 *     baseIndent + 2)
 *
 * @param tokens     - Full token array.
 * @param cur        - Shared mutable cursor.
 * @param baseIndent - Expected indentation for "- " markers.
 * @returns Parsed NestedList.
 */
function parseList(tokens: Token[], cur: Cursor, baseIndent: number): NestedList {
  const list: NestedList = [];

  while (cur.idx < tokens.length) {
    const tok = tokens[cur.idx];

    if (tok.indent < baseIndent) break;
    if (tok.indent > baseIndent) break;
    if (tok.type !== 'item') break;

    cur.idx++;

    const dashValue = tok.dashValue;

    // Try to split dashValue as "key: value"
    const colonIdx = dashValue.indexOf(':');

    if (colonIdx === -1 || colonIdx === 0) {
      // Scalar list item
      list.push(dashValue);
      continue;
    }

    const itemKey = dashValue.slice(0, colonIdx).trim();
    const afterColon = dashValue.slice(colonIdx + 1);
    const itemVal = afterColon.trim();

    // Build an object for this list item
    const obj: NestedDict = {};

    if (itemVal !== '') {
      // Strip surrounding quotes for YAML-quoted compatibility
      const stripped = itemVal.startsWith('"') && itemVal.endsWith('"')
        ? itemVal.slice(1, -1)
        : itemVal;
      obj[itemKey] = stripped;
    }
    // else: itemKey maps to a nested block, handled below in continuation loop

    // Collect continuation properties at baseIndent + 2
    const itemBodyIndent = baseIndent + 2;

    while (cur.idx < tokens.length) {
      const child = tokens[cur.idx];

      // Stop if we've left this item's property block
      if (child.indent < itemBodyIndent) break;

      // Tokens deeper than itemBodyIndent belong to a nested block —
      // they'll be consumed by recursive calls below
      if (child.indent > itemBodyIndent) break;

      if (child.type === 'kv') {
        obj[child.key] = child.value;
        cur.idx++;
      } else if (child.type === 'parent') {
        cur.idx++;
        const childIndent = peekIndent(tokens, cur);
        if (childIndent > itemBodyIndent) {
          obj[child.key] = parseBlock(tokens, cur, childIndent);
        } else {
          obj[child.key] = {};
        }
      } else {
        // Another item token at itemBodyIndent — unusual sub-list; stop
        break;
      }
    }

    // If obj has no key from dashValue (itemVal was empty), set it to the nested block
    if (itemVal === '' && !(itemKey in obj)) {
      const childIndent = peekIndent(tokens, cur);
      if (childIndent > baseIndent) {
        obj[itemKey] = parseBlock(tokens, cur, childIndent);
      } else {
        obj[itemKey] = {};
      }
    }

    list.push(obj);
  }

  return list;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Parses a NestedText document and returns structured data plus the body.
 *
 * The format is a lightweight, human-friendly alternative to YAML:
 * - `key: value` — inline string assignment
 * - `key:` — parent key; indented block below defines the value
 * - `  - item` — list item (scalar or object)
 * - `# comment` — ignored line
 * - `---` — separates frontmatter from the markdown body
 *
 * All values are strings; callers (e.g., Astro Zod schemas) handle type
 * coercion (e.g., `published: true` → boolean via `z.boolean()`).
 *
 * @param input - Raw file contents of a .nt file.
 * @returns ParseResult with `data` dict and `body` string.
 *
 * @example
 * ```typescript
 * const { data, body } = parseNestedText(`
 * title: Hello World
 * published: true
 * tags:
 *   - astro
 *   - typescript
 * ---
 * ## Markdown body here
 * `);
 * // data.title === "Hello World"
 * // data.tags  === ["astro", "typescript"]
 * // body       === "## Markdown body here"
 * ```
 */
export function parseNestedText(input: string): ParseResult {
  const { frontMatterLines, body } = splitInput(input);
  const tokens = tokenize(frontMatterLines, 0);

  if (tokens.length === 0) {
    return { data: {}, body };
  }

  const cur: Cursor = { idx: 0 };
  const rootIndent = tokens[0].indent;
  const data = parseDict(tokens, cur, rootIndent);

  return { data, body };
}
