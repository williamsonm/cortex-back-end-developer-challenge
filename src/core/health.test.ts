import { Character, CharacterStats, CharacterClass, Health, Defense } from '../data';
import {
  calcModifiedStats,
  abilityModifier,
  hpForClasses,
  calcHP,
  calcDamage,
  addTempHP,
  increaseHealth,
  decreaseHealth,
} from './health';

const stoneOfFortitude = {
  name: 'Ioun Stone of Fortitude',
  modifier: {
    affectedObject: 'stats',
    affectedValue: 'constitution',
    value: 2,
  },
};

const fireImmunity: Defense = {
  type: 'fire',
  defense: 'immunity',
};
const slashingResistance: Defense = {
  type: 'slashing',
  defense: 'resistance',
};

const briv: Character = {
  name: 'Briv',
  level: 5,
  classes: [
    {
      name: 'fighter',
      hitDiceValue: 10,
      classLevel: 3,
    },
    {
      name: 'wizard',
      hitDiceValue: 6,
      classLevel: 2,
    },
  ],
  stats: {
    strength: 15,
    dexterity: 12,
    constitution: 14,
    intelligence: 13,
    wisdom: 10,
    charisma: 8,
  },
  items: [stoneOfFortitude],
  defenses: [fireImmunity, slashingResistance],
};

const defaultStats: CharacterStats = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
};

describe('items', () => {
  it('include stat modifiers from items when calculating stats', () => {
    const stats = calcModifiedStats(defaultStats, [stoneOfFortitude]);
    expect(stats.constitution).toBe(12);
  });
  it('stats are unaffected for characters with no items', () => {
    const result = calcModifiedStats(defaultStats, []);
    expect(result).toStrictEqual(defaultStats);
  });
});

describe('hit points', () => {
  it('characters at first level get the full hit die when calculating hit points', () => {
    const fighter: CharacterClass = {
      name: 'fighter',
      hitDiceValue: 10,
      classLevel: 1,
    };
    const expectedHP = fighter.hitDiceValue + abilityModifier(defaultStats.constitution);
    const result = hpForClasses(defaultStats, [fighter]);
    expect(result).toBe(expectedHP);
  });

  it('calculate maximum hit points for a multi-class character', () => {
    const expectedFighterHP = 31; // (10+3) + (6+3) + (6+3)
    const expectedWizardHP = 14; // (4+3) + (4+3)
    const expectedTotalHP = expectedFighterHP + expectedWizardHP;

    expect(calcHP(briv)).toBe(expectedTotalHP);
  });
});

describe('ability score modifiers', () => {
  it('calculated value should match expected', () => {
    expect(abilityModifier(6)).toBe(-2);
    expect(abilityModifier(7)).toBe(-2);
    expect(abilityModifier(8)).toBe(-1);
    expect(abilityModifier(9)).toBe(-1);
    expect(abilityModifier(10)).toBe(0);
    expect(abilityModifier(11)).toBe(0);
    expect(abilityModifier(12)).toBe(1);
    expect(abilityModifier(13)).toBe(1);
    expect(abilityModifier(14)).toBe(2);
    expect(abilityModifier(15)).toBe(2);
    expect(abilityModifier(16)).toBe(3);
    expect(abilityModifier(17)).toBe(3);
    expect(abilityModifier(18)).toBe(4);
  });
});

describe('damage types', () => {
  it('take full damage', () => {
    expect(calcDamage(briv, 'bludgening', 20)).toBe(20);
  });
  it('take half damage when resistant', () => {
    expect(calcDamage(briv, 'slashing', 20)).toBe(10);
  });
  it('take no damage when immune', () => {
    expect(calcDamage(briv, 'fire', 20)).toBe(0);
  });
  it('unknown damage types return full', () => {
    expect(calcDamage(briv, 'unknown', 20)).toBe(20)
  })
});

describe('healing', () => {
  it('healing past max should return max', () => {
    const health: Health = {
      maximumHitPoints: 50,
      currentHitPoints: 45,
      temporaryHitPoints: 0,
    };
    const result = increaseHealth(health, 30);
    expect(result.currentHitPoints).toBe(health.maximumHitPoints);
  });

  it('healing should not affect temporary hit points', () => {
    const health: Health = {
      maximumHitPoints: 50,
      currentHitPoints: 50,
      temporaryHitPoints: 10,
    };
    const result = increaseHealth(health, 30);
    expect(result.temporaryHitPoints).toBe(health.temporaryHitPoints);
  });
});

describe('damage', () => {
  it('damage past zero should return zero', () => {
    const health: Health = {
      maximumHitPoints: 50,
      currentHitPoints: 10,
      temporaryHitPoints: 0,
    };
    const result = decreaseHealth(health, -30);
    expect(result.currentHitPoints).toBe(0);
  });

  it('damage should reduce temporary hit points first', () => {
    const health: Health = {
      maximumHitPoints: 50,
      currentHitPoints: 10,
      temporaryHitPoints: 20,
    };
    const result = decreaseHealth(health, -health.temporaryHitPoints);
    expect(result.temporaryHitPoints).toBe(0);
    expect(result.currentHitPoints).toBe(health.currentHitPoints);
  });

  it('partially damaging temporary hit points should leave current hit points untouched', () => {
    const health: Health = {
      maximumHitPoints: 50,
      currentHitPoints: 50,
      temporaryHitPoints: 20
    }
    const result = decreaseHealth(health, -10);
    expect(result.temporaryHitPoints).toBe(10);
    expect(result.currentHitPoints).toBe(health.currentHitPoints);
  })

  it('damage exceeding temporary hit points should then reduce current max', () => {
    const health: Health = {
      maximumHitPoints: 50,
      currentHitPoints: 50,
      temporaryHitPoints: 20,
    };
    const damageValue = -40;
    const result = decreaseHealth(health, damageValue);
    const expected = health.currentHitPoints + health.temporaryHitPoints + damageValue;
    expect(result.temporaryHitPoints).toBe(0);
    expect(result.currentHitPoints).toBe(expected);
  });
});

describe('temporary hit points', () => {
  it('should use the max between existing temp HP and the new temp HP', () => {
    const health: Health = {
      maximumHitPoints: 50,
      currentHitPoints: 50,
      temporaryHitPoints: 20
    }
    const useExisting = addTempHP(health, 10);
    expect(useExisting.temporaryHitPoints).toBe(health.temporaryHitPoints);

    const updatedValue = 40
    const useUpdated = addTempHP(health, updatedValue);
    expect(useUpdated.temporaryHitPoints).toBe(updatedValue);
  })
})