import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {db} from '../../../providers/firebase'
import styles from './component.module.css'
import Loader from "../../../common/Loader";

const PeopleList = () => {
  const [people, setPeople] = useState([])

  const [filter, setFilter] = useState(JSON.parse(localStorage.getItem('filters')) || {
    filterFilms: 'none',
    filterSpecies: 'none',
    birthdayRangeTo: '',
    birthdayRangeFrom: ''
  })

  const [films, setFilms] = useState([])
  const [species, setSpecies] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || [])
  const [draggedItemId, setDraggedItemId] = useState('')

  const fetchPeople = async () => {
    const peopleRef = await db.collection('people').get()
    let people = []
    peopleRef.forEach(person => people.push({id: person.id, ...person.data()}))
    setPeople(people)
    setIsLoaded(true)
  }

  const fetchFilms = async () => {
    const filmsRef = await db.collection('films').get()
    let films = []
    filmsRef.forEach(film => films.push({id: film.id, ...film.data()}))
    setFilms(films)
  }

  const fetchSpecies = async () => {
    const speciesRef = await db.collection('species').get()
    let species = []
    speciesRef.forEach(S => species.push({id: S.id, ...S.data()}))
    setSpecies(species)
  }

  useEffect(() => {
    fetchPeople()
    fetchFilms()
    fetchSpecies()
  }, [])

  const handleFilter = ({target: {name, value}}) => {
    const freshFilter = {...filter, [name]: value}
    setFilter(freshFilter)
    localStorage.setItem('filters', JSON.stringify(freshFilter));
  }

  const dragStart = event => {
    setDraggedItemId(event.currentTarget.dataset.id)
  }

  const addFavorites = () => {
    const freshFavorites = [...favorites.filter(P => P.id !== draggedItemId), ...people.filter(P => P.id === draggedItemId)]
    setFavorites(freshFavorites);
    localStorage.setItem('favorites', JSON.stringify(freshFavorites));
  }

  const receiveFavorites = event => {
    event.preventDefault();
  }

  const removeFavorite = id => {
    const freshFavorites = favorites.filter(P => P.id !== id)
    setFavorites(freshFavorites)
    localStorage.setItem('favorites', JSON.stringify(freshFavorites));
  }

  if (!isLoaded) {
    return <Loader/>
  }

  const filteredPeople = people
    .filter(P => filter.filterFilms !== 'none' ? P.films.some(F => F.title === filter.filterFilms) : true)
    .filter(P => filter.filterSpecies !== 'none' ? P.species.some(S => S.name === filter.filterSpecies) : true)
    .filter(P => {
        const birthYear = Number.parseFloat(P.birth_year)
        const birthFrom = Number.parseFloat(filter.birthdayRangeFrom)
        const birthTo = Number.parseFloat(filter.birthdayRangeTo)

        const birthFromBBY = filter.birthdayRangeFrom.toLowerCase().includes('bby')
        const birthToBBY = filter.birthdayRangeTo.toLowerCase().includes('bby')
        const isBBY = P.birth_year.toLowerCase().includes('bby')

        if (isBBY && birthFromBBY && birthToBBY) {
          return birthYear < birthFrom && birthYear > birthTo
        }

        if (!isBBY && !birthFromBBY && !birthToBBY) {
          return birthYear > birthFrom && birthYear < birthTo
        }

        if (isBBY && birthFromBBY && !birthToBBY) {
          return true
        }

        return filter.birthdayRangeFrom === '' && filter.birthdayRangeTo === ''
      }
    )

  return (
    <div className={styles.people}>
      <div className={styles.filters}>
        <div className={styles.item}>
          <span className={styles.filterTitle}>Films:</span>
          <select name="filterFilms" onChange={handleFilter} value={filter.filterFilms}>
            <option value='none'>None</option>
            {films.map(film => <option value={film.title} key={`films_${film.id}`}>{film.title}</option>)}
          </select>
        </div>
        <div className={styles.item}>
          <span className={styles.filterTitle}>Species:</span>
          <select name="filterSpecies" onChange={handleFilter} value={filter.filterSpecies}>
            <option value='none'>None</option>
            {species.map(S => <option value={S.name} key={`films_${S.id}`}>{S.name}</option>)}
          </select>
        </div>
        <div className={styles.item}>
          <span className={styles.filterTitle}>Character's birthday:</span>
          <div className={styles.birthdayRange}>
            from: <input type="text" name="birthdayRangeFrom" onChange={handleFilter}/>
            to: <input type="text" name="birthdayRangeTo" onChange={handleFilter}/>
          </div>
        </div>
      </div>
      <div className={styles.list}>
        {filteredPeople.length === 0
          ? <span>No data</span>
          : filteredPeople.map((person, idx) => <Link
            className={styles.peopleItem}
            data-id={person.id}
            draggable
            onDragStart={dragStart}
            to={`/people/${person.id}`}
            key={`people_${person.id}`}
          >
            {person.name}
          </Link>)}
      </div>

      <div className={`${styles.list} ${styles.favorites}`} onDrop={addFavorites} onDragOver={receiveFavorites}>
        {favorites.length === 0
          ? <span>No favorites</span>
          : favorites.map(favorite => <Link
            className={styles.favoriteItem}
            to={`/people/${favorite.id}`}
            key={`people_${favorite.id}`}
          >
            {favorite.name}
            <span className={styles.removeFavorite} onClick={e => {
              e.preventDefault();
              removeFavorite(favorite.id)
            }}>x</span>
          </Link>)}
      </div>
    </div>
  )
}


export default PeopleList
