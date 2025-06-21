import type { HuntingArea } from "../types/game";

export const HUNTING_AREAS: HuntingArea[] = [
  {
    id: "goblin-cave",
    name: "Goblin Cave",
    description: "A damp cave filled with weak goblins. Perfect for beginners.",
    level: 1,
    expReward: 10,
    unlockLevel: 1,
    huntDuration: 3000, // 3 seconds
    monsters: ["Goblin", "Goblin Warrior"],
    shadowDrops: [
      {
        shadowId: "goblin-shadow",
        name: "Goblin Shadow",
        rarity: "common",
        dropChance: 30,
        icon: "👹",
      },
      {
        shadowId: "goblin-warrior-shadow",
        name: "Goblin Warrior Shadow",
        rarity: "uncommon",
        dropChance: 15,
        icon: "⚔️",
      },
    ],
  },
  {
    id: "spider-den",
    name: "Spider Den",
    description: "Dark tunnels infested with poisonous spiders.",
    level: 5,
    expReward: 25,
    unlockLevel: 5,
    huntDuration: 4000, // 4 seconds
    monsters: ["Giant Spider", "Poison Spider", "Web Crawler"],
    shadowDrops: [
      {
        shadowId: "spider-shadow",
        name: "Spider Shadow",
        rarity: "common",
        dropChance: 25,
        icon: "🕷️",
      },
      {
        shadowId: "poison-spider-shadow",
        name: "Poison Spider Shadow",
        rarity: "rare",
        dropChance: 8,
        icon: "🟢",
      },
    ],
  },
  {
    id: "orc-stronghold",
    name: "Orc Stronghold",
    description: "A fortified camp of brutal orcs and their shamans.",
    level: 10,
    expReward: 50,
    unlockLevel: 10,
    huntDuration: 5000, // 5 seconds
    monsters: ["Orc Warrior", "Orc Shaman", "Orc Chieftain"],
    shadowDrops: [
      {
        shadowId: "orc-warrior-shadow",
        name: "Orc Warrior Shadow",
        rarity: "uncommon",
        dropChance: 20,
        icon: "🧌",
      },
      {
        shadowId: "orc-shaman-shadow",
        name: "Orc Shaman Shadow",
        rarity: "rare",
        dropChance: 10,
        icon: "🔮",
      },
      {
        shadowId: "orc-chieftain-shadow",
        name: "Orc Chieftain Shadow",
        rarity: "epic",
        dropChance: 3,
        icon: "👑",
      },
    ],
  },
  {
    id: "undead-crypt",
    name: "Undead Crypt",
    description: "Ancient burial grounds where the dead refuse to rest.",
    level: 15,
    expReward: 100,
    unlockLevel: 15,
    huntDuration: 6000, // 6 seconds
    monsters: ["Skeleton", "Zombie", "Wraith", "Lich"],
    shadowDrops: [
      {
        shadowId: "skeleton-shadow",
        name: "Skeleton Shadow",
        rarity: "common",
        dropChance: 20,
        icon: "💀",
      },
      {
        shadowId: "wraith-shadow",
        name: "Wraith Shadow",
        rarity: "rare",
        dropChance: 12,
        icon: "👻",
      },
      {
        shadowId: "lich-shadow",
        name: "Lich Shadow",
        rarity: "epic",
        dropChance: 5,
        icon: "🧙‍♂️",
      },
    ],
  },
  {
    id: "dragon-lair",
    name: "Dragon's Lair",
    description: "The dwelling of an ancient dragon and its treasure hoard.",
    level: 25,
    expReward: 250,
    unlockLevel: 25,
    huntDuration: 8000, // 8 seconds
    monsters: ["Dragon Whelp", "Drake", "Ancient Dragon"],
    shadowDrops: [
      {
        shadowId: "dragon-whelp-shadow",
        name: "Dragon Whelp Shadow",
        rarity: "rare",
        dropChance: 15,
        icon: "🐉",
      },
      {
        shadowId: "drake-shadow",
        name: "Drake Shadow",
        rarity: "epic",
        dropChance: 8,
        icon: "🔥",
      },
      {
        shadowId: "ancient-dragon-shadow",
        name: "Ancient Dragon Shadow",
        rarity: "legendary",
        dropChance: 2,
        icon: "🐲",
      },
    ],
  },
  {
    id: "shadow-realm",
    name: "Shadow Realm",
    description: "A dimension between worlds where shadows take physical form.",
    level: 35,
    expReward: 500,
    unlockLevel: 35,
    huntDuration: 10000, // 10 seconds
    monsters: ["Shadow Beast", "Void Walker", "Shadow Lord"],
    shadowDrops: [
      {
        shadowId: "shadow-beast-shadow",
        name: "Shadow Beast Shadow",
        rarity: "epic",
        dropChance: 12,
        icon: "🌑",
      },
      {
        shadowId: "void-walker-shadow",
        name: "Void Walker Shadow",
        rarity: "legendary",
        dropChance: 5,
        icon: "🌌",
      },
    ],
  },
  {
    id: "monarch-domain",
    name: "Monarch Domain",
    description: "The ultimate challenge - face the rulers of monsters.",
    level: 50,
    expReward: 1000,
    unlockLevel: 50,
    huntDuration: 15000, // 15 seconds
    monsters: ["Lesser Monarch", "Monarch", "Sovereign"],
    shadowDrops: [
      {
        shadowId: "lesser-monarch-shadow",
        name: "Lesser Monarch Shadow",
        rarity: "legendary",
        dropChance: 8,
        icon: "👹",
      },
      {
        shadowId: "monarch-shadow",
        name: "Monarch Shadow",
        rarity: "legendary",
        dropChance: 3,
        icon: "👑",
      },
    ],
  },
];

export const getHuntingAreaById = (id: string): HuntingArea | undefined => {
  return HUNTING_AREAS.find((area) => area.id === id);
};

export const getAvailableAreas = (playerLevel: number): HuntingArea[] => {
  return HUNTING_AREAS.filter((area) => area.unlockLevel <= playerLevel);
};

export const getNextAreaToUnlock = (
  playerLevel: number
): HuntingArea | undefined => {
  return HUNTING_AREAS.find((area) => area.unlockLevel > playerLevel);
};
