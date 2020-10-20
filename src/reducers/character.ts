import { Character, CharacterId } from '../data';
import { CharacterActions, SaveAction } from '../actions/character';

interface CharacterState {
  characters: Map<CharacterId, Character>;
}

const initialState: CharacterState = {
  characters: new Map(),
};

function saveCharacter(prevState: CharacterState, action: SaveAction): CharacterState {
  const { characterId, character } = action;
  const characters = prevState.characters;
  characters.set(characterId, character);
  return {
    ...prevState,
    characters,
  };
}
export const reducer = (prevState = initialState, action: CharacterActions): CharacterState => {
  switch (action.type) {
    case 'SAVE':
      return saveCharacter(prevState, action);
    default:
      return prevState;
  }
};
