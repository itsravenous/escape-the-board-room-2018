import React from 'react';
import Ticker from '../Ticker';
import './style.scss';

const Clue = ({clue}) => (
  <div className='clue'>
    <Ticker>{clue}</Ticker>
  </div>
);

export default Clue;
