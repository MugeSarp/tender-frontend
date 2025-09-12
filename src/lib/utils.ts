export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
// ==== Tender classifier (append) ====
export type Unit =
  | "IoT"
  | "Experience"
  | "Marine"
  | "Target"
  | "Bisan_Emira"
  | "Other";

export const DEFAULT_KEYWORDS: Record<Exclude<Unit, "Other">, string[]> = {
  IoT: [
    "Connectivity",
    "Monitoring",
    "remote Monitoring",
    "Sensor",
    "Management",
    "Controlling",
    "IoT",
    "Smart City",
    "Integration",
    "Predictive Maintenance",
    "Telemetry",
    "Network",
    "Asset Tracking",
    "Building Automation",
    "Fleet Management",
    "Tracking",
    "Smart Infrastructure",
    "Energy management systems",
    "Larda resource management",
  ],
  Experience: [
    "Experience",
    "Immersive",
    "Interactive",
    "Exhibition",
    "Digital Content",
    "Technology",
    "AV Systems",
    "Digital",
    "Thematic",
    "Design",
    "Projection Mapping",
    "Smart Display",
    "Visitor Journey",
    "Cultural Innovation",
  ],
  Marine: [
    "Antifouling",
    "Marine Technology",
    "Marine Systems",
    "Vessel Operations",
    "Vessel Maintenance",
  ],
  Target: [
    "Target systems",
    "Simulator",
    "Aerial target",
    "Sea target",
    "Naval target",
    "ground target",
    "Unmanned surface vessels",
    "Drone",
    "Asia",
    "Europe",
    "Southeast Asia",
    "Africa",
    "Middle east",
  ],
  Bisan_Emira: [
    "museum fit-out",
    "immersive experience",
    "immersive installation",
    "experience design",
    "digital experience",
    "interactive exhibition",
    "projection mapping",
    "360° projection",
    "interactive wall",
    "interactive floor",
    "interactive sphere",
    "interactive room system",
    "flexible LED",
    "LED wall",
    "LED screen",
    "curved LED",
    "transparent LED",
    "digital signage",
    "video wall",
    "ScrollUp display",
    "smart sensors",
    "smart infrastructure",
    "connected devices",
    "interactive IoT",
    "augmented reality",
    "virtual reality",
    "extended reality",
    "AR/VR solutions",
    "AR/VR application",
    "XR system",
    "simulation system",
    "interactive simulation",
    "interactive museum",
    "science museum",
    "technology",
    "experience center",
    "theme park technology",
    "digital planetarium",
  ],
};

function splitKeywords(input?: string | string[]): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((s) => s.trim()).filter(Boolean);
  return input
    .split(/[,|\n]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}
function countOcc(hay: string, needle: string): number {
  const h = hay.toLowerCase(),
    n = needle.toLowerCase();
  if (!n) return 0;
  let i = 0,
    c = 0;
  while ((i = h.indexOf(n, i)) !== -1) {
    c++;
    i++;
  }
  return c;
}
function scoreUnit(text: string, kws: string[]) {
  let score = 0;
  const matched: string[] = [];
  for (const kw of kws) {
    const c = countOcc(text, kw);
    if (c) {
      score += c * (kw.includes(" ") || kw.length >= 10 ? 2 : 1);
      matched.push(kw);
    }
  }
  return { score, matched };
}

export function classifyTender({
  title = "",
  summary = "",
  keywords = {},
}: {
  title?: string;
  summary?: string;
  keywords?: Partial<Record<Exclude<Unit, "Other">, string | string[]>>;
}) {
  const text = `${title}\n${summary}`.trim();

  const unitKeywords = {
    IoT: splitKeywords(keywords?.IoT).concat(DEFAULT_KEYWORDS.IoT),
    Experience: splitKeywords(keywords?.Experience).concat(
      DEFAULT_KEYWORDS.Experience
    ),
    Marine: splitKeywords(keywords?.Marine).concat(DEFAULT_KEYWORDS.Marine),
    Target: splitKeywords(keywords?.Target).concat(DEFAULT_KEYWORDS.Target),
    Bisan_Emira: splitKeywords(keywords?.Bisan_Emira).concat(
      DEFAULT_KEYWORDS.Bisan_Emira
    ),
  } as const;

  const result = Object.entries(unitKeywords).map(([unit, list]) => {
    const { score, matched } = scoreUnit(text, list);
    return { unit: unit as Exclude<Unit, "Other">, score, matched };
  });

  const max = Math.max(...result.map((r) => r.score));
  let best: Unit = "Other";
  if (max > 0) {
    const tied = result.filter((r) => r.score === max);
    if (tied.length === 1) best = tied[0].unit;
    else {
      tied.sort((a, b) => {
        const al = a.matched.reduce((s, kw) => s + kw.length, 0);
        const bl = b.matched.reduce((s, kw) => s + kw.length, 0);
        if (bl !== al) return bl - al;
        const order: Unit[] = [
          "Target",
          "Marine",
          "IoT",
          "Bisan_Emira",
          "Experience",
          "Other",
        ];
        return order.indexOf(a.unit) - order.indexOf(b.unit);
      });
      best = tied[0].unit;
    }
  }

  return {
    unit: best,
    scores: Object.fromEntries(result.map((r) => [r.unit, r.score])),
    matched: Object.fromEntries(result.map((r) => [r.unit, r.matched])),
  };
}
// ==== /Tender classifier ====
