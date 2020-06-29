import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {filmsSeed, peopleSeed, speciesSeed} from './seeds'
import {db} from './providers/firebase'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

db.collection('people').onSnapshot(async snapshots => {
  if(snapshots.size === 0) {
    await peopleSeed()
  }
})

db.collection('films').onSnapshot(async snapshots => {
  if(snapshots.size === 0) {
    await filmsSeed()
  }
})

db.collection('species').onSnapshot(async snapshots => {
  if(snapshots.size === 0) {
    await speciesSeed()
  }
})
