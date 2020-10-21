import {
  Character,
  CharacterStats,
  CharacterClass,
  HitPoints,
  DamageType,
  Health,
  AbilityScore,
  Item,
  Defense,
} from '../data';

// adds any stat modifiers from items
export function calcModifiedStats(inputStats: CharacterStats, items: Item[]): CharacterStats {
  const initialStats = { ...inputStats };
  return items
    .filter((i) => i.modifier.affectedObject === 'stats' && i.modifier.affectedValue !== undefined)
    .reduce((stats, item) => {
      stats[item.modifier.affectedValue] += item.modifier.value;
      return stats;
    }, initialStats);
}

// returns the modifier for the given ability score
export function abilityModifier(score: AbilityScore): number {
  return Math.floor((score - 10) / 2);
}

// average value to use for hit dice on level advancement
// e.g. d6 = 4, d10 = 6
const hitDieAdvancement = {
  6: 4,
  8: 5,
  10: 6,
  12: 7,
};

// calculates the total hit points for all the classes provided,
// using the average value for each dice roll, taking into account
// first level advancement gets the full hit die value.
export function hpForClasses(stats: CharacterStats, classes: CharacterClass[]): HitPoints {
  const conMod = abilityModifier(stats.constitution);
  return classes.reduce((total, cl) => {
    let classTotal = 0;
    let classLevel = cl.classLevel;
    if (total === 0 && classLevel > 0) {
      // first level uses the full hit die
      classTotal += cl.hitDiceValue + conMod;
      classLevel -= 1;
    }
    // remaining levels use the average roll value
    const hitDie = hitDieAdvancement[cl.hitDiceValue];
    classTotal += classLevel * (hitDie + conMod);

    return total + classTotal;
  }, 0);
}

// uses the modified stat values from items to calculate the hit point total for a character
export function calcHP(character: Character): HitPoints {
  const modifiedStats = calcModifiedStats(character.stats, character.items);
  const hitPoints = hpForClasses(modifiedStats, character.classes);
  return hitPoints;
}

// calculates the defense modifier for the specified damage type
// e.g. 1.0 takes full damage, 0.5 takes half-damage, 0 is immune
function calcDefenseModifier(defenses: Defense[], damageType: DamageType): number {
  const appliedDefense = defenses.find((d) => d.type === damageType);
  switch (appliedDefense?.defense) {
    case 'immunity':
      return 0;
    case 'resistance':
      return 0.5;
    default:
      return 1;
  }
}

export function calcDamage(
  character: Character,
  damageType: DamageType,
  damageValue: number
): number {
  return damageValue * calcDefenseModifier(character.defenses, damageType);
}

// damage affects temporary hit points first, then reduces current hit points.
// damaging past zero will just return zero
export function decreaseHealth(health: Health, inputValue: number): Health {
  const damageValue = Math.abs(inputValue);
  let { currentHitPoints, temporaryHitPoints } = health;
  if (temporaryHitPoints >= damageValue) {
    temporaryHitPoints -= damageValue;
  } else {
    currentHitPoints -= damageValue - temporaryHitPoints;
    temporaryHitPoints = 0;
  }
  return {
    ...health,
    currentHitPoints: Math.max(currentHitPoints, 0),
    temporaryHitPoints: Math.max(temporaryHitPoints, 0),
  };
}

// healing ignores temporary hit points, healing past max just returns max
export function increaseHealth(health: Health, value: number): Health {
  const currentHitPoints = Math.min(health.currentHitPoints + value, health.maximumHitPoints);
  return {
    ...health,
    currentHitPoints,
  };
}

// adds temporary hit points to a character's health, using the largest
// value from the existing temp HP and the given value
export function addTempHP(health: Health, value: number): Health {
  return {
    ...health,
    temporaryHitPoints: Math.max(health.temporaryHitPoints, value),
  };
}
