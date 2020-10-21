import { calcDamage, calcHP } from '../core/health';
import { Character, CharacterId, DamageType, Health, HitPoints } from '../data';

type HealthActionTypes = 'HEALTH_SAVE' | 'HEALTH_HEAL' | 'HEALTH_DAMAGE' | 'HEALTH_TEMP_HP';

export type HealthActions = SaveAction | HealAction | DamageAction | TempHPAction;

interface Action {
  type: HealthActionTypes;
}

export interface SaveAction extends Action {
  type: 'HEALTH_SAVE';
  characterId: CharacterId;
  health: Health;
}

export interface HealAction extends Action {
  type: 'HEALTH_HEAL';
  characterId: CharacterId;
  value: number;
}

export interface DamageAction extends Action {
  type: 'HEALTH_DAMAGE';
  characterId: CharacterId;
  actualDamage: number;
}

export interface TempHPAction extends Action {
  type: 'HEALTH_TEMP_HP';
  characterId: CharacterId;
  temporaryHitPoints: HitPoints;
}

export function healthSaveAction(characterId: CharacterId, character: Character): SaveAction {
  const maximumHitPoints = calcHP(character);
  const health: Health = {
    currentHitPoints: maximumHitPoints,
    maximumHitPoints,
    temporaryHitPoints: 0,
  };
  return {
    type: 'HEALTH_SAVE',
    characterId,
    health,
  };
}

export function healAction(characterId: CharacterId, value: number): HealAction {
  return {
    type: 'HEALTH_HEAL',
    characterId,
    value,
  };
}

export const damageAction = (
  characterId: CharacterId,
  character: Character,
  damageType: DamageType,
  damageValue: number
): DamageAction => {
  const actualDamage = calcDamage(character, damageType, damageValue);
  return {
    type: 'HEALTH_DAMAGE',
    characterId,
    actualDamage,
  };
};

export const temporaryHPAction = (
  characterId: CharacterId,
  temporaryHitPoints: HitPoints
): TempHPAction => ({
  type: 'HEALTH_TEMP_HP',
  characterId,
  temporaryHitPoints,
});
