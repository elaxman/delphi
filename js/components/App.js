import React from 'react';
import Relay from 'react-relay';

import AddDatacenterMutation from '../mutations/AddDatacenterMutation';

import DatacenterCreation from './DatacenterCreation';
import DatacentersList from './DatacentersList';

class App extends React.Component {

  _handleDatacenterCreationSave = ({text, timestamp}) => {
    console.log(text);
    Relay.Store.commitUpdate(
      new AddDatacenterMutation({text, timestamp, cloud: this.props.cloud})
    );
  };

  render() {
    return (
      <div>
        <div className="title"> ReactJS Demo </div>
         <div className="dc">
	   <DatacentersList cloud={this.props.cloud} />
          <DatacenterCreation
            className="input"
            onSave={this._handleDatacenterCreationSave}
            placeholder='Enter your datacenter/TODO and press "Enter"'
          />
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    cloud: () => Relay.QL`
      fragment on Cloud {
        ${DatacentersList.getFragment('cloud')},
        ${AddDatacenterMutation.getFragment('cloud')},
      }
    `,
  },
});
