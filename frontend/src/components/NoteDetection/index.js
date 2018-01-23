import React from 'react';
import {CSSTransitionGroup} from 'react-transition-group';
import Ticker from '../Ticker';
import './style.css';
import notes from './notes';

class NoteDetection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      complete: false,
    }
  }

  componentWillMount() {
    this.notes = notes({
      onMicError: (error) => console.error('mic error', error),
      onMicSuccess: (msg) => console.log('mic success', msg),
      onDetectNote: (note) => this.onDetectNote(note),
    });
  }

  onDetectNote(note) {
    const isCorrect = this.props.song[this.state.notes.length] && this.props.song[this.state.notes.length].toLowerCase() === note.toLowerCase();
    if(isCorrect && this.state.notes.length < this.props.song.length) {
      this.setState(state => (
        {
          ...state,
          notes: state.notes.concat([note])
        }
      ), () => {
        if(this.state.notes.length === this.props.song.length) {
          this.props.onSongComplete();
          this.setState({
            complete: true,
          });
        }
      });
    }
  }

  render() {
    return (
      <section className='note-detection'>
        <Ticker>
          I am listening - play me a pretty song...
        </Ticker>
        <CSSTransitionGroup
          className='note-detection__notes'
          transitionName='note-detection__note'
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
        >
          {this.state.notes.map((note, i) => (
            <span className='note-detection__note' key={i}>{note}</span>
          ))}
        </CSSTransitionGroup>
      </section>
    );
  }
}

NoteDetection.defaultProps = {
  song: 'ABCDEF',
  onSongComplete: Function.prototype,
};

export default NoteDetection;
