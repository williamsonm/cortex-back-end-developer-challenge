import { createStore, applyMiddleware, combineReducers, Dispatch } from 'redux';
import { Character, CharacterId, Health } from '../data';
import { reducer as healthReducer } from './health';
import { reducer as characterReducer } from './character';
import { CharacterActions } from '../actions/character';
import { HealthActions } from '../actions/health';

export interface AppState {
  health: Map<CharacterId, Health>;
  characters: Map<CharacterId, Character>;
}

type AllActions = CharacterActions | HealthActions;

interface AppStore {
  getCharacter: (CharacterId) => Character | undefined;
  getHealth: (CharacterId) => Health | undefined;
  dispatch: Dispatch<AllActions>;
}

// logs state changes for debugging purposes
const logger = (store) => (next) => (action) => {
  const result = next(action);
  console.log('next state: ', store.getState());
  return result;
};

// redux store for character and health information
const store = createStore(
  combineReducers({
    characters: characterReducer,
    health: healthReducer,
  }),
  applyMiddleware(logger)
);

// returns the character sheet for the specified id, if it exists.
const getCharacter = (characterId: CharacterId): Character | undefined => {
  const { characters } = store.getState().characters;
  return characters.get(characterId);
};

// returns the current health information for the specified id, if it exists.
const getHealth = (characterId: CharacterId): Health | undefined => {
  const { health } = store.getState().health;
  return health.get(characterId);
};

export const appStore: AppStore = {
  getCharacter,
  getHealth,
  dispatch: store.dispatch,
};
