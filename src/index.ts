import express from 'express';
import { mkCharacterId, saveAction } from './actions/character';
import { healAction, damageAction, temporaryHPAction, healthSaveAction } from './actions/health';
import { Character } from './data';
import { HealRequest, DamageRequest, TempHPRequest } from './data/routes';
import { appStore, store } from './reducers';

const app = express();
const port = 8080;

app.use(express.json());

app.post('/v1/heal', (req, res) => {
  const healRequest: HealRequest = req.body;
  const { characterId, healValue } = healRequest;
  store.dispatch(healAction(characterId, healValue));
  const health = appStore.getHealth(characterId);
  if (health === undefined) {
    res.sendStatus(404);
  }
  res.send(health);
});

app.post('/v1/damage', (req, res) => {
  const damageRequest: DamageRequest = req.body;
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
});

app.post('/v1/tempHP', (req, res) => {
  const tempHPRequest: TempHPRequest = req.body;
  const { characterId, temporaryHitPoints } = tempHPRequest;
  store.dispatch(temporaryHPAction(characterId, temporaryHitPoints));
  const health = appStore.getHealth(characterId);
  if (health === undefined) {
    res.sendStatus(404);
  }
  res.send(health);
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
