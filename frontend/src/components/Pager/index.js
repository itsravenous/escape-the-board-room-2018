import React from 'react';
import './style.css';

export default class Pager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
    this.onClickNext = this.onClickNext.bind(this);
  }

  onClickNext() {
    const nextPage = this.state.page + 1;
    this.setState({
      page: nextPage,
    });
    this.props.onPage(nextPage);
  }

  render() {
    const {children, showNext} = this.props;

    const nextDisplay = showNext && this.state.page < children.length - 1 ? (
      <div className='pager__next'>
        <button onClick={this.onClickNext}>Next</button>
      </div>
    ) : null;

    return (
      <div className='pager'>
        {children[this.state.page]}

        {nextDisplay}
      </div>
    );
  }
}

