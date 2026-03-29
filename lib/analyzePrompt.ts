interface PromptAnalysis {
  category: string;
  tags: string[];
}

const LIGHTING: Record<string, string[]> = {
  "golden-hour": ["golden hour", "golden light", "warm light", "sunset light"],
  "soft-light": ["soft light", "diffused", "octabox", "softbox", "butterfly lighting", "flat light"],
  "hard-light": ["harsh light", "hard light", "directional light", "single window", "dramatic shadow"],
  "neon": ["neon", "neon signs", "neon light", "colored light", "electric"],
  "studio": ["studio light", "studio setup", "strobe", "key light", "rim light", "fill light"],
  "natural": ["natural light", "ambient", "overcast", "daylight", "window light"],
  "backlit": ["backlit", "backlighting", "silhouette", "contre-jour"],
  "low-key": ["low key", "dark background", "chiaroscuro", "moody light"],
  "high-key": ["high key", "bright", "white background", "blown out"],
  "rembrandt": ["rembrandt", "rembrandt lighting"],
};

const ANGLES: Record<string, string[]> = {
  "close-up": ["close-up", "close up", "extreme close", "macro", "tight shot"],
  "wide-angle": ["wide angle", "wide shot", "establishing", "ultra-wide"],
  "eye-level": ["eye level", "straight on", "face to face"],
  "low-angle": ["low angle", "from below", "worm eye", "looking up"],
  "high-angle": ["high angle", "from above", "bird eye", "top down", "overhead"],
  "dutch-angle": ["dutch angle", "tilted", "canted"],
  "over-shoulder": ["over the shoulder", "over shoulder", "ots"],
  "aerial": ["aerial", "drone", "birds eye"],
};

const SHOT_TYPES: Record<string, string[]> = {
  "portrait": ["portrait", "headshot", "face", "beauty shot"],
  "editorial": ["editorial", "fashion editorial", "magazine"],
  "product": ["product photo", "product shot", "commercial", "packshot"],
  "landscape": ["landscape", "scenery", "vista", "panoramic"],
  "street": ["street photo", "street scene", "candid", "urban"],
  "cinematic": ["cinematic", "film still", "movie", "anamorphic"],
  "architectural": ["architecture", "architectural", "building", "interior"],
  "documentary": ["documentary", "reportage", "photojournalism"],
  "abstract": ["abstract", "conceptual", "surreal"],
  "lifestyle": ["lifestyle", "candid", "everyday"],
};

const LENS: Record<string, string[]> = {
  "35mm": ["35mm"],
  "50mm": ["50mm"],
  "85mm": ["85mm", "f/1.4", "f/1.8"],
  "telephoto": ["telephoto", "200mm", "135mm", "70-200"],
  "wide": ["wide lens", "24mm", "16mm", "14mm"],
  "medium-format": ["medium format", "hasselblad", "phase one"],
  "macro": ["macro lens", "macro"],
};

function matchKeywords(text: string, map: Record<string, string[]>): string[] {
  const lower = text.toLowerCase();
  const matches: string[] = [];
  for (const [label, keywords] of Object.entries(map)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      matches.push(label);
    }
  }
  return matches;
}

export function analyzePrompt(text: string): PromptAnalysis {
  const lighting = matchKeywords(text, LIGHTING);
  const angles = matchKeywords(text, ANGLES);
  const shotTypes = matchKeywords(text, SHOT_TYPES);
  const lens = matchKeywords(text, LENS);

  const tags: string[] = [];

  if (lighting.length) tags.push(...lighting.map((l) => `light:${l}`));
  if (angles.length) tags.push(...angles.map((a) => `angle:${a}`));
  if (shotTypes.length) tags.push(...shotTypes.map((s) => `shot:${s}`));
  if (lens.length) tags.push(...lens.map((l) => `lens:${l}`));

  // Pick primary category from shot type, fallback to lighting
  const category =
    shotTypes[0] ??
    (lighting[0] ? `${lighting[0]} lighting` : "general");

  // Capitalize first letter
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  return { category: categoryLabel, tags };
}
