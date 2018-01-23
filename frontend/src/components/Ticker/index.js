import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import './style.css';

export default class Ticker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
    };
  }

  componentDidMount() {
    setTimeout(this.startTicker.bind(this), this.props.initialDelay);
  }

  componentWillUnmount() {
    if(this.timer) clearInterval(this.timer);
  }

  /**
   * Coerces children prop to an array of strings
   *
   * @static
   * @memberof Ticker
   * @param {array|string} words
   * @return {array<string>}
   */
  static childrenToWords(children) {
    return (typeof children === 'string' && children.split(' ')) || children.join('').split(' ');
  }

  startTicker(interval) {
    const words = Ticker.childrenToWords(this.props.children);
    if(this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      const {counter} = this.state;
      if(counter === words.length - 1) {
        clearInterval(this.timer);
        this.props.onFinish && this.props.onFinish();
      }
      this.setState({
        counter: counter + 1,
      });
    }, interval || this.props.interval);
  }

  render() {
    const words = Ticker.childrenToWords(this.props.children);
    return (
      <CSSTransitionGroup
        component='p'
        className='ticker'
        transitionName='ticker__word'
        transitionEnterTimeout={750}
        transitionLeaveTimeout={750}
      >
        {words.slice(0, this.state.counter).map((word, i) => (
          <span className='ticker__word' key={i}>{word}</span>
        ))}
      </CSSTransitionGroup>
    )
  }
}

Ticker.defaultProps = {
  initialDelay: 0,
  interval: 100,
};
