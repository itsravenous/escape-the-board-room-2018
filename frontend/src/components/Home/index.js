import React, { Component } from 'react';
import Locks from '../Locks';
import Ticker from '../Ticker';
import './style.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNext: false,
    };

    this.handleCodeComplete = this.handleCodeComplete.bind(this);
    this.onPage = this.onPage.bind(this);
    this.onTickerFinish = this.onTickerFinish.bind(this);
    this.setPlayer = this.setPlayer.bind(this);
  }

  handleCodeComplete(codeNumber) {
    this.player.play();
  }

  onPage(pageNumber) {
    this.setState({
      showNext: false,
    });
  }

  onTickerFinish() {
    setTimeout(() => {
      this.setState({
        showNext: true,
      });
    }, 1000);
  }

  setPlayer(player) {
    this.player = player;
  }

  render() {
    const {
      codes,
      codeHints,
      onComplete,
      successSound,
    } = this.props;

    return (
      <section className='home'>
        <audio
          ref={this.setPlayer}
          src={this.props.successSound}
        />

          <Ticker
            key='f'
            onFinish={this.onTickerFinish}
          >
	    PLEASE ENTER ACCESS CODES
          </Ticker>

          <Locks
            codes={codes}
            codeHints={codeHints}
            onCodeComplete={this.handleCodeComplete}
            onComplete={onComplete}
          />
      </section>
    );
  }
}

export default Home;
