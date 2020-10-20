import { v4 as uuidv4 } from 'uuid';
import { CharacterId, Character } from '../data';

type CharacterActionTypes = 'SAVE';

export type CharacterActions = SaveAction;

interface Action {
  type: CharacterActionTypes;
}

export interface SaveAction extends Action {
  type: 'SAVE';
  characterId: CharacterId;
  character: Character;
}

export function mkCharacterId(): CharacterId {
  return uuidv4();
}

export function saveAction(characterId: CharacterId, character: Character): SaveAction {
  return {
    type: 'SAVE',
    characterId,
    character,
  };
}
