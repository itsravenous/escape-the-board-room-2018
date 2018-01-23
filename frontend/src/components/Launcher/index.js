import React from 'react';
import Button from '../Button';
import Pager from '../Pager';
import Ticker from '../Ticker';
import './style.css';

export default class Launcher extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNext: false,
    }

    this.onPage = this.onPage.bind(this);
    this.onTickerFinish = this.onTickerFinish.bind(this);
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

  render() {
    const {
      boosterCount,
      onButtonPress,
      untilPhrase
    } = this.props;
console.log(onButtonPress)
    return (
      <div className='launcher'>
        <Pager
          onPage={this.onPage}
          showNext={this.state.showNext}
        >
          <Ticker
            key='a'
            onFinish={this.onTickerFinish}
          >
            This is it. The rocket engines beneath the floor have lain dormant for years but are still ready to be activated, still awaiting the day when they can launch the board room into the sky and to freedom.
          </Ticker>
          <Ticker
            key='b'
            onFinish={this.onTickerFinish}
          >
            The launch sequence requires simultaneous ignition on all {boosterCount} of its boosters. Unless they are activated at precisely the same time, the injection coils will refuse to align and you will moulder here until {untilPhrase}
          </Ticker>
          <div key='c'>
            <Ticker onFinish={this.onTickerFinish}>
              Close your eyes, join minds, and ignite.
            </Ticker>
            <Button onClick={onButtonPress}>Launch</Button>
          </div>
        </Pager>
      </div>
    );
  }
};

