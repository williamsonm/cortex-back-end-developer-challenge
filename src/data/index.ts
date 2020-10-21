export type CharacterId = string; // uuid

type Name = string;
type Level = number;

type DiceType = 6 | 8 | 10 | 12;

export type HitPoints = number;

export interface CharacterClass {
  name: Name;
  hitDiceValue: DiceType;
  classLevel: Level;
}

export type AbilityScore = number;

export interface CharacterStats {
  strength: AbilityScore;
  dexterity: AbilityScore;
  constitution: AbilityScore;
  intelligence: AbilityScore;
  wisdom: AbilityScore;
  charisma: AbilityScore;
}

interface Modifier {
  affectedObject: string;
  affectedValue: string;
  value: number;
}

export interface Item {
  name: Name;
  modifier: Modifier;
}

export type DamageType = 'fire' | 'slashing' | string;

export type DefenseType = 'immunity' | 'resistance' | 'none';

export interface Defense {
  type: DamageType;
  defense: DefenseType;
}

export interface Character {
  name: Name;
  level: Level;
  classes: CharacterClass[];
  stats: CharacterStats;
  items: Item[];
  defenses: Defense[];
}

export interface Health {
  maximumHitPoints: HitPoints;
  currentHitPoints: HitPoints;
  temporaryHitPoints: HitPoints;
}
