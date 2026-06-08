// Address normalization helpers. Onboarding must never fail because of these —
// they only improve the chance that geocoding succeeds.

const DIRECTIONALS: Record<string, string> = {
  n: "North", s: "South", e: "East", w: "West",
  ne: "Northeast", nw: "Northwest", se: "Southeast", sw: "Southwest",
};

const STREET_TYPES: Record<string, string> = {
  st: "Street", str: "Street", rd: "Road", ave: "Avenue", av: "Avenue",
  blvd: "Boulevard", hwy: "Highway", dr: "Drive", ln: "Lane", ct: "Court",
  pl: "Place", pkwy: "Parkway", ter: "Terrace", cir: "Circle", sq: "Square",
};

/** Collapse whitespace, expand common abbreviations like "N" / "Rd" / "US-441". */
export function normalizeAddress(input: string): string {
  if (!input) return "";
  let s = input.replace(/\s+/g, " ").trim();

  // Normalize US route style: "us441" / "us 441" / "US-441" → "US Route 441"
  s = s.replace(/\b(US|U\.S\.)[\s-]?(\d+)\b/gi, "US Route $2");
  s = s.replace(/\b(SR|State Road)[\s-]?(\d+)\b/gi, "State Road $2");

  s = s
    .split(" ")
    .map((tok, i, arr) => {
      const bare = tok.replace(/[.,]/g, "").toLowerCase();
      if (i === 0 || /^[NSEW]{1,2}$/i.test(tok.replace(/[.,]/g, ""))) {
        if (DIRECTIONALS[bare]) return DIRECTIONALS[bare];
      }
      if (i === arr.length - 1 || i === arr.length - 2) {
        if (STREET_TYPES[bare]) return STREET_TYPES[bare];
      }
      return tok;
    })
    .join(" ");

  return s;
}
