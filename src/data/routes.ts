import { CharacterId, DamageType, HitPoints } from '.';

// request body for /v1/heal
export interface HealRequest {
  characterId: CharacterId;
  healValue: number;
}

// request body for /v1/damage
export interface DamageRequest {
  characterId: CharacterId;
  damageValue: number;
  damageType: DamageType;
  damageModifier: number;
}

// request body for /v1/tempHP
export interface TempHPRequest {
  characterId: CharacterId;
  temporaryHitPoints: HitPoints;
}
