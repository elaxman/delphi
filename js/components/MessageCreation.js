import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class MessageCreation extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    initialValue: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  };

  state = {
    text: this.props.initialValue || '',
  };

  componentDidMount() {
    ReactDOM.findDOMNode(this).focus();
  }

  _handleChange = (e) => {
    this.setState({text: e.target.value});
  };

  _handleKeyDown = (e) => {
    if (e.keyCode === 27) {
      this.setState({message: ''});
    } else if (e.keyCode === 13) {
      this._commitChanges();
    }
  };

  _commitChanges = () => {
    let newMessage = this.state.text.trim();
    this.props.onSave(newMessage);
    this.setState({text: ''});
  };

  render() {
    return (
      <input
        className={this.props.className}
        onChange={this._handleChange}
        onKeyDown={this._handleKeyDown}
        placeholder={this.props.placeholder}
        value={this.state.text}
      />
    );
  }
}
