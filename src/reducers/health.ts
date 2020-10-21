import { addTempHP, increaseHealth, decreaseHealth } from '../core/health';
import { CharacterId, Health } from '../data';
import {
  DamageAction,
  HealAction,
  HealthActions,
  SaveAction,
  TempHPAction,
} from '../actions/health';

interface HealthState {
  health: Map<CharacterId, Health>;
}

const initialState: HealthState = {
  health: new Map(),
};

// looks up the character id and heals them
function healCharacter(prevState: HealthState, action: HealAction): HealthState {
  const { characterId, value } = action;
  const { health } = prevState;
  const prevHealth = health.get(characterId);
  if (prevHealth !== undefined) {
    console.log(`healing characterId: ${characterId} +${value}`);
    health.set(characterId, increaseHealth(prevHealth, value));
  }
  return {
    ...prevState,
    health,
  };
}

// looks up the character id and damages their health
function damageCharacter(prevState: HealthState, action: DamageAction): HealthState {
  const { characterId, actualDamage } = action;
  const { health } = prevState;
  const prevHealth = health.get(characterId);
  if (prevHealth !== undefined) {
    console.log(`damaging characterId: ${characterId} ==> ${actualDamage}`);
    health.set(characterId, decreaseHealth(prevHealth, -actualDamage));
  }
  return {
    ...prevState,
    health,
  };
}

// adds temporary hit points for a character id
function tempHitPoints(prevState: HealthState, action: TempHPAction): HealthState {
  const { characterId, temporaryHitPoints } = action;
  const { health } = prevState;
  const prevHealth = health.get(characterId);
  if (prevHealth !== undefined) {
    console.log(`adding temp HP for characterId: ${characterId} => ${temporaryHitPoints}`);
    health.set(characterId, addTempHP(prevHealth, temporaryHitPoints));
  }
  return {
    ...prevState,
    health,
  };
}

// saves the initial health values for a character id
function healthSave(prevState: HealthState, action: SaveAction) {
  console.log(`saving health for characterId: ${action.characterId}`);
  const { health } = prevState;
  health.set(action.characterId, action.health);
  return {
    ...prevState,
    health,
  };
}

export const reducer = (prevState = initialState, action: HealthActions): HealthState => {
  switch (action.type) {
    case 'HEALTH_SAVE':
      return healthSave(prevState, action);
    case 'HEALTH_HEAL':
      return healCharacter(prevState, action);
    case 'HEALTH_DAMAGE':
      return damageCharacter(prevState, action);
    case 'HEALTH_TEMP_HP':
      return tempHitPoints(prevState, action);
    default:
      return prevState;
  }
};
