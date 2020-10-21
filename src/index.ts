import express from 'express';
import { mkCharacterId, saveAction } from './actions/character';
import { healAction, damageAction, temporaryHPAction, healthSaveAction } from './actions/health';
import { Character } from './data';
import { HealRequest, DamageRequest, TempHPRequest } from './data/routes';
import { appStore, store } from './reducers';

const app = express();
const port = 8080;

app.use(express.json());

function checkBody<T>(body: T, keys: string[]): string | undefined {
  let errorMessage: string | undefined
  keys.forEach(key => {
    if (body[key] === undefined) {
      errorMessage = `${key} is missing`
    }
  })
  return errorMessage
}

app.post('/v1/heal', (req, res) => {
  const healRequest: HealRequest = req.body;
  const errorMessage = checkBody(healRequest, ['characterId', 'healValue']);
  if (errorMessage !== undefined) {
    res.status(400).send({error: errorMessage})
  } else {
    const { characterId, healValue } = healRequest;
    store.dispatch(healAction(characterId, healValue));
    const health = appStore.getHealth(characterId);
    if (health === undefined) {
      res.status(404).send({error: 'characterId not found'});
    } else {
      res.send(health)
    }
  }
});

app.post('/v1/damage', (req, res) => {
  const damageRequest: DamageRequest = req.body;
  const errorMessage = checkBody(damageRequest, ['characterId', 'damageType', 'damageValue'])
  if (errorMessage !== undefined) {
    res.status(400).send({error: errorMessage})
  } else {
    const { characterId, damageType, damageValue } = damageRequest;
    const character = appStore.getCharacter(characterId);
    if (character === undefined) {
      return res.sendStatus(404);
    }
    store.dispatch(damageAction(characterId, character, damageType, damageValue));
    const health = appStore.getHealth(characterId);
    if (health === undefined) {
      res.sendStatus(404);
    }
    res.send(health);
  }
});

app.post('/v1/tempHP', (req, res) => {
  const tempHPRequest: TempHPRequest = req.body;
  const errorMessage = checkBody(tempHPRequest, ['characterId', 'temporaryHitPoints'])
  if (errorMessage !== undefined) {
    res.status(400).send({error: errorMessage})
  } else {
    const { characterId, temporaryHitPoints } = tempHPRequest;
    store.dispatch(temporaryHPAction(characterId, temporaryHitPoints));
    const health = appStore.getHealth(characterId);
    if (health === undefined) {
      res.sendStatus(404);
    }
    res.send(health);
  }
});

app.put('/v1/save', (req, res) => {
  const character: Character = req.body;
  const characterId = mkCharacterId();
  store.dispatch(saveAction(characterId, character));
  store.dispatch(healthSaveAction(characterId, character))
  res.send({ characterId });
});

app.listen(port, () => {
  console.log(`server started on port: ${port}`);
});
