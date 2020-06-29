import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {db} from "../../../providers/firebase";
import styles from './component.module.css'
import Loader from "../../../common/Loader";

const PeopleDetails = () => {
  const {id} = useParams()
  const [person, setPerson] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)

  const fetchPerson = async () => {
    const personRef = await db.collection('people').doc(id).get()
    setPerson(personRef.data())
    setIsLoaded(true)
  }

  useEffect(() => {
    fetchPerson()
  }, [])

  if(!isLoaded) {
    return <Loader />
  }

  return (
    <div className={styles.person}>
      <div className={styles.avatar}>
        <img className={styles.picture} src={person.picture} alt="person picture" />
        <h4>{person.name}</h4>
      </div>
      <div className={styles.summery}>
        <div className={styles.line}>
          <div className={styles.title}>
            Species:
          </div>
          <div className={styles.value}>
            {person.species.map(S => S.name).join(', ')}
          </div>
        </div>
        <div className={styles.line}>
          <div className={styles.title}>
            Movies:
          </div>
          <div className={styles.value}>
            {person.films.map(S => S.title).join(', ')}
          </div>
        </div>
        <div className={styles.line}>
          <div className={styles.title}>
            Spaceships:
          </div>
          <div className={styles.value}>
            {person.starships.map(S => S.name).join(', ')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PeopleDetails
