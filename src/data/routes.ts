import { CharacterId, DamageType, HitPoints } from ".";

export interface HealRequest {
  characterId: CharacterId;
  healValue: number;
}

export interface DamageRequest {
  characterId: CharacterId;
  damageValue: number;
  damageType: DamageType;
  damageModifier: number;
}

export interface TempHPRequest {
  characterId: CharacterId;
  temporaryHitPoints: HitPoints;
}