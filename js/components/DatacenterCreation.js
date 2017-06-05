import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment';

export default class DatacenterCreation extends React.Component {

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
    this.setState({text: e.target.value, timestamp: moment().toISOString()});
  };

  _handleKeyDown = (e) => {
    if (e.keyCode === 27) {
      this.setState({datacenter: ''});
    } else if (e.keyCode === 13) {
      this._commitChanges();
    }
  };

  _commitChanges = () => {
    let newDatacenter = {
      text: this.state.text.trim(),
      timestamp: this.state.timestamp,
    };
    if (newDatacenter.text) {
      this.props.onSave(newDatacenter);
      this.setState({text: ''});
    }
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
