import { v4 as uuidv4 } from 'uuid';
import { CharacterId, Character } from '../data';

type CharacterActionTypes = 'CHARACTER_SAVE';

export type CharacterActions = SaveAction;

interface Action {
  type: CharacterActionTypes;
}

export interface SaveAction extends Action {
  type: 'CHARACTER_SAVE';
  characterId: CharacterId;
  character: Character;
}

// generates a unique character id
export function mkCharacterId(): CharacterId {
  return uuidv4();
}

export function saveAction(characterId: CharacterId, character: Character): SaveAction {
  return {
    type: 'CHARACTER_SAVE',
    characterId,
    character,
  };
}
