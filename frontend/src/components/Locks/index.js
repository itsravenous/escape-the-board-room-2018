import React, { Component } from 'react';
import './style.css';

class Locks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      complete: false,
      lockStates: {},
      completeLocks: [],
      lockValues: props.codes.map(code => ''),
    };

    this.handleCodeEntry = this.handleCodeEntry.bind(this);
  }

  handleCodeEntry(code, lockNumber) {
    this.setState((state) => {
      const codeNormalised = code.toLowerCase().trim() 
      const isValidCode = this.props.codes.find(code => code.toLowerCase() === codeNormalised); 
      const isCorrect = isValidCode && !state.lockStates[codeNormalised]; 
      state.lockValues[lockNumber] = code;
      if (isCorrect) {
        state.lockStates[codeNormalised] = true;
        state.completeLocks.push(lockNumber);
        this.props.onCodeComplete(lockNumber);
      }
      return state;
    }, () => {
      if(Object.keys(this.state.lockStates).length === this.props.codes.length) {
        this.setState({ complete: true });
        this.props.onComplete();
      }
    });
  }

  render() {
    const { codes } = this.props;

    return (
      <ul className='locks'>
        {codes.map((code, i) => {
          const isComplete = this.state.completeLocks.indexOf(i) > -1;
          return (
            <li
              className='locks__lock'
              key={i}
            >
              <input
                className={`locks__input locks__input--${isComplete}`}
                disabled={isComplete}
                onChange={(event) => this.handleCodeEntry(event.target.value, i)}
                type='text'
                value={this.state.lockValues[i]}
              />
            </li>
          )
        })}
      </ul>
    );
  }
}

export default Locks;
