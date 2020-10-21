import { Character, CharacterId } from '../data';
import { CharacterActions, SaveAction } from '../actions/character';

interface CharacterState {
  characters: Map<CharacterId, Character>;
}

const initialState: CharacterState = {
  characters: new Map(),
};

// adds a new character to the store, using the provided characterId
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
    case 'CHARACTER_SAVE':
      return saveCharacter(prevState, action);
    default:
      return prevState;
  }
};
