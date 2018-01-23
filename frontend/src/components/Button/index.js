import React from 'react';
import './style.scss';

const Button = (props) => (
  <button
    {...props}
    className={props.className ? `button ${props.className}` : `button`}
  >
    {props.children}
  </button>
);

export default Button;
