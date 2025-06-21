import type { HuntingArea } from '../types/game';

export const HUNTING_AREAS: HuntingArea[] = [
  {
    id: 'goblin-cave',
    name: 'Goblin Cave',
    description: 'A damp cave filled with weak goblins. Perfect for beginners.',
    level: 1,
    expReward: 10,
    goldReward: 5,
    unlockLevel: 1,
    huntDuration: 3000, // 3 seconds
    monsters: ['Goblin', 'Goblin Warrior'],
  },
  {
    id: 'spider-den',
    name: 'Spider Den',
    description: 'Dark tunnels infested with poisonous spiders.',
    level: 5,
    expReward: 25,
    goldReward: 12,
    unlockLevel: 5,
    huntDuration: 4000, // 4 seconds
    monsters: ['Giant Spider', 'Poison Spider', 'Web Crawler'],
  },
  {
    id: 'orc-stronghold',
    name: 'Orc Stronghold',
    description: 'A fortified camp of brutal orcs and their shamans.',
    level: 10,
    expReward: 50,
    goldReward: 25,
    unlockLevel: 10,
    huntDuration: 5000, // 5 seconds
    monsters: ['Orc Warrior', 'Orc Shaman', 'Orc Chieftain'],
  },
  {
    id: 'undead-crypt',
    name: 'Undead Crypt',
    description: 'Ancient burial grounds where the dead refuse to rest.',
    level: 15,
    expReward: 100,
    goldReward: 50,
    unlockLevel: 15,
    huntDuration: 6000, // 6 seconds
    monsters: ['Skeleton', 'Zombie', 'Wraith', 'Lich'],
  },
  {
    id: 'dragon-lair',
    name: "Dragon's Lair",
    description: 'The dwelling of an ancient dragon and its treasure hoard.',
    level: 25,
    expReward: 250,
    goldReward: 125,
    unlockLevel: 25,
    huntDuration: 8000, // 8 seconds
    monsters: ['Dragon Whelp', 'Drake', 'Ancient Dragon'],
  },
  {
    id: 'shadow-realm',
    name: 'Shadow Realm',
    description: 'A dimension between worlds where shadows take physical form.',
    level: 35,
    expReward: 500,
    goldReward: 250,
    unlockLevel: 35,
    huntDuration: 10000, // 10 seconds
    monsters: ['Shadow Beast', 'Void Walker', 'Shadow Lord'],
  },
  {
    id: 'monarch-domain',
    name: 'Monarch Domain',
    description: 'The ultimate challenge - face the rulers of monsters.',
    level: 50,
    expReward: 1000,
    goldReward: 500,
    unlockLevel: 50,
    huntDuration: 15000, // 15 seconds
    monsters: ['Lesser Monarch', 'Monarch', 'Sovereign'],
  },
];

export const getHuntingAreaById = (id: string): HuntingArea | undefined => {
  return HUNTING_AREAS.find(area => area.id === id);
};

export const getAvailableAreas = (playerLevel: number): HuntingArea[] => {
  return HUNTING_AREAS.filter(area => area.unlockLevel <= playerLevel);
};

export const getNextAreaToUnlock = (playerLevel: number): HuntingArea | undefined => {
  return HUNTING_AREAS.find(area => area.unlockLevel > playerLevel);
};