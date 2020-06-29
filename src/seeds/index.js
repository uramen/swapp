import {db} from "../providers/firebase";
import people from './people'
import films from './films'
import species from './species'

const peopleSeed = async () => {
  const batch = db.batch();

  people.forEach(person => {
    batch.set(db.collection("people").doc(), person);
  })

  await batch.commit();
}

const filmsSeed = async () => {
  const batch = db.batch();

  films.forEach(person => {
    batch.set(db.collection("films").doc(), person);
  })

  await batch.commit();
}

const speciesSeed = async () => {
  const batch = db.batch();

  species.forEach(person => {
    batch.set(db.collection("species").doc(), person);
  })

  await batch.commit();
}

export {peopleSeed, filmsSeed, speciesSeed}
