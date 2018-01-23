import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import QRCode from 'qrcode.react';

import Clue from './components/Clue';
import Home from './components/Home';
import Launcher from './components/Launcher';
import NoteDetection from './components/NoteDetection';
import './index.css';

const config = process.env;
const gotoClue = (history, clue) => history.push(`/clue/${clue}`);
const attemptIgnition = () => {
  console.log('attempt')
  const request = new XMLHttpRequest();
  request.open('POST', `/launch`, true);
  request.setRequestHeader('Accept', 'text/plain');
  request.onload = Function.prototype;
  request.send();
};

ReactDOM.render(
  (
    <BrowserRouter>
      <div>
        <Route exact path='/' component={({history}) => (
          <Home
            codes={config.REACT_APP_CODES.split(',')}
            successSound={config.REACT_APP_SUCCESS_SOUND}
            onComplete={() => setTimeout(() => history.push('/launcher-code'), 1000)}
          />
        )}/>
    
        <Route exact path='/notes' component={({history}) => (
          <NoteDetection
            song={config.REACT_APP_NOTES__SONG}
            onSongComplete={() => gotoClue(history, 'NOTES')}
          />
        )}/>

        <Route exact path='/launcher-code' component={({history}) => (
          <div className='qr-code'>
            <QRCode value={config.REACT_APP_LAUNCHER_QR_CODE_URL}/>
          </div>
        )}/>

        <Route exact path='/launcher' component={({history}) => (
          <Launcher
            boosterCount={config.REACT_APP_LAUNCHER_REQUIRED_IGNITIONS}
            untilPhrase={config.REACT_APP_LAUNCHER_UNTIL_PHRASE}
            onButtonPress={attemptIgnition}
          />
        )}/>

        <Route exact path='/clue/:id' component={(props) => (
          <Clue clue={config[`REACT_APP_CLUE_${props.match.params.id}`]}/>
        )}/>
      </div>
    </BrowserRouter>
  )
, document.getElementById('root'));
