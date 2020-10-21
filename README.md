## Getting Started

Build the project with `npm`:

```bash
npm i
npm run build
```

## Executing Tests

Tests are executed using `jest`:

```bash
npm test
```

## Integration Tests with Postman

A test suite has been created using [Postman](https://www.postman.com/) and can be imported from the `Cortex.postman_collection.json` file in located in the repo.

First, start the application with `npm`:

```bash
npm start
```

Second, load a character into the app using the `save` endpoint.  This will assign a `characterId` and save it as a variable in Postman for the other requests.

Next, test the other endpoints however you see fit.  Several requests have been added to show off character resistances and immunity.

Alternatively, you can just run the entire collection at once using Postman, and the requests will execute in the correct order.

## API Endpoints

Each endpoint expects the request body to be JSON containing any required fields.

### PUT to `/v1/save`

Loads character data and assigns a `characterId`, which will be required for the other API requests.

Note: the Postman request automatically saves the `characterId` as a global variable to be used in the other requests.

Sample request:
  - Request body JSON similar to the provided `briv.json` in the repo.

Sample response:
```json
{
    "characterId": "07a60548-e16c-4321-a796-e82512f52d6f"
}
```

### POST to `/v1/heal`

Heals the character for the specified value.

Sample request body:

```json
{
  "characterId": "{{characterId}}",
  "healValue": 5
}
```

Sample response:

```json
{
  "currentHitPoints": 45,
  "maximumHitPoints": 45,
  "temporaryHitPoints": 0
}
```

### POST to `/v1/damage`
 
Damages the character, taking into account the damage type and any character resistances.

Sample request body:

```json
{
  "characterId": "{{characterId}}",
  "damageValue": 20,
  "damageType": "slashing"
}
```

Sample response:

```json
{
  "currentHitPoints": 35,
  "maximumHitPoints": 45,
  "temporaryHitPoints": 0
}
```

### POST to `/v1/tempHP`

Adds temporary hit points to the specified character.  The value in the request will replace the existing value only if it is larger than what the character already has for temporary hit points.

Sample request:
```json
{
  "characterId": "{{characterId}}",
  "temporaryHitPoints": 15
}
```

Sample response:
```json
{
  "currentHitPoints": 35,
  "maximumHitPoints": 45,
  "temporaryHitPoints": 15
}
```

## Docker Build

Two shell scripts have been added to assist in building the image and starting the container.

```bash
# build the docker image
./build.sh
# - or -
docker build . -t cortex

# start the container
./start.sh
# - or -
docker run -d --name cortex -p 8080:8080 cortex
```

## Character JSON
  - hitdicevalue renamed to hitDiceValue in `briv.json` for consistency
  - unique `characterId` assigned on save, not required in the character sheet JSON
  - store allows multiple characters to be saved

## Character Hit Points Calculation

In D&D, the first level always takes the max value for the hit dice, and subsequent levels will use the average dice roll for the class.

  Assumptions:
  - the first class listed in a multi-class build will be the class the character took at level 1  
  - relying on the order inside the array is less than ideal, but for the purposes
    of this demo it should be fine.

  e.g. with the below json, we assume the character took Fighter for level 1, 
  so they get 10+con modifier for first level, and then use the dice average for remaining levels.

  ```json
  [
    {
      "name":"fighter",
      "hitDiceValue":10,
      "classLevel":3
    },
    {
      "name":"wizard",
      "hitDiceValue":6,
      "classLevel":2
    }
  ],
  ```
  So, if the constitution modifier was +3, the calculated hit points are:
  ```js
  fighter = (10 + 3) + (6 + 3) + (6 + 3) 
  wizard = (4 + 3) + (4 + 3)
  total = 45
  ```