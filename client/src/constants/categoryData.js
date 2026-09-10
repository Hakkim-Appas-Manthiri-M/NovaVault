import {
  Compass,
  Gauge,
  Ghost,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  Users,
} from "lucide-react";

const gameCategories = [
  {
    name: "Action",
    icon: Swords,
    description: "Combat · Shooter · Open World",
    keywords: [
      "action",
      "shooter",
      "combat",
      "hack",
      "slash",
    ],
  },
  {
    name: "Adventure",
    icon: Compass,
    description: "Narrative · Detective · Exploration",
    keywords: [
      "adventure",
      "detective",
      "narrative",
      "exploration",
    ],
  },
  {
    name: "RPG",
    icon: Sparkles,
    description: "Fantasy · Action RPG · Dark Fantasy",
    keywords: [
      "rpg",
    ],
  },
  {
    name: "Horror",
    icon: Ghost,
    description: "Survival · Detective · Psychological",
    keywords: [
      "horror",
      "psychological",
    ],
  },
  {
    name: "Racing",
    icon: Gauge,
    description: "Racing · Open World · Sim Racing",
    keywords: [
      "racing",
      "racer",
    ],
  },
  {
    name: "Survival",
    icon: Shield,
    description: "Ocean · Space · Winter · Horror",
    keywords: [
      "survival",
    ],
  },
  {
    name: "Strategy",
    icon: Trophy,
    description: "Tactical · Strategy · Simulation",
    keywords: [
      "strategy",
      "tactical",
      "simulation",
    ],
  },
  {
    name: "Multiplayer",
    icon: Users,
    description: "Co-op · Online · Competitive",
    keywords: [
      "multiplayer",
      "co-op",
      "cooperative",
      "competitive",
      "online",
    ],
  },
];

export default gameCategories;