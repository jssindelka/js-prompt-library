const TYPES: [string, string[]][] = [
  ["Editorial", ["editorial", "fashion editorial", "campaign", "magazine", "high-fashion"]],
  ["Lifestyle", ["lifestyle", "candid", "everyday", "natural moment", "street style", "casual"]],
  ["Commercial", ["commercial", "product", "advertising", "brand", "packshot", "studio shoot"]],
  ["Portrait", ["portrait", "headshot", "beauty", "close-up"]],
  ["Street", ["street photo", "street scene", "urban photography", "documentary"]],
  ["Cinematic", ["cinematic", "film still", "movie", "anamorphic"]],
  ["Landscape", ["landscape", "scenery", "vista", "panoramic"]],
];

const LIGHTING: [string, string[]][] = [
  ["Harsh", ["harsh", "hard light", "hard directional", "direct sunlight", "strong sun", "high contrast"]],
  ["Soft", ["soft light", "diffused", "softbox", "octabox", "butterfly lighting", "gentle", "delicate shadow"]],
  ["Studio", ["studio light", "strobe", "key light", "rim light", "fill light", "controlled lighting"]],
  ["Natural", ["natural light", "ambient", "daylight", "window light", "overcast"]],
  ["Golden Hour", ["golden hour", "golden light", "sunset", "warm light"]],
  ["Neon", ["neon", "neon signs", "electric", "colored light"]],
  ["Low Key", ["low key", "chiaroscuro", "moody light", "dark"]],
  ["Backlit", ["backlit", "backlighting", "silhouette", "contre-jour"]],
];

const ENVIRONMENTS: [string, string[]][] = [
  ["Urban", ["urban", "city", "street", "downtown", "new york", "tokyo", "high-rise", "architecture", "building"]],
  ["Studio", ["studio", "backdrop", "seamless", "white background", "black background"]],
  ["Cafe", ["cafe", "coffee", "restaurant", "table setting", "bistro"]],
  ["Mediterranean", ["mediterranean", "limestone", "terracotta", "shutter", "european"]],
  ["Nature", ["nature", "forest", "mountain", "ocean", "field", "foliage", "garden", "outdoor natural", "green-gold"]],
  ["Industrial", ["industrial", "warehouse", "factory", "concrete", "abandoned"]],
  ["Beach", ["beach", "sand", "coast", "seaside", "shore"]],
  ["Desert", ["desert", "dunes", "arid"]],
  ["Interior", ["interior", "indoor", "room", "living room", "bedroom", "hallway"]],
  ["Rooftop", ["rooftop", "terrace", "balcony"]],
];

function matchFirst(text: string, map: [string, string[]][]): string | null {
  const lower = text.toLowerCase();
  for (const [label, keywords] of map) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return label;
    }
  }
  return null;
}

export function generateTitle(text: string): string {
  if (!text.trim()) return "";

  const type = matchFirst(text, TYPES);
  const lighting = matchFirst(text, LIGHTING);
  const environment = matchFirst(text, ENVIRONMENTS);

  const parts: string[] = [];
  if (type) parts.push(type);
  if (lighting) parts.push(lighting);
  if (environment) parts.push(environment);

  if (parts.length === 0) {
    return text.replace(/[\[\]:]/g, " ").split(/\s+/).filter((w) => w.length > 3).slice(0, 3).join(" ");
  }

  return parts.join(" + ");
}
