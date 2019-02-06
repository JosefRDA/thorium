import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import SubscriptionHelper from "helpers/subscriptionHelper";
import SpecializedDocking from "./specializedDocking";
import "./style.scss";

const queryData = `
id
name
clamps
compress
doors
image
docked
damage {
  damaged
}
direction
deck {
  id
  number
}
inventory {
  id
  name
  count
}
`;

const QUERY = gql`
  query Docking($simulatorId: ID!) {
    docking(simulatorId: $simulatorId, type: specialized) {
${queryData}
    }
  }
`;
const SUBSCRIPTION = gql`
  subscription DockingUpdate($simulatorId: ID!) {
    dockingUpdate(simulatorId: $simulatorId, type: specialized) {
${queryData}
    }
  }
`;

class SpecializedDockingData extends Component {
  state = {};
  render() {
    return (
      <Query query={QUERY} variables={{ simulatorId: this.props.simulator.id }}>
        {({ loading, data, subscribeToMore }) => {
          const { docking } = data;
          if (loading || !docking) return null;
          if (!docking[0]) return <div>No Specialized Docking Ports</div>;
          return (
            <SubscriptionHelper
              subscribe={() =>
                subscribeToMore({
                  document: SUBSCRIPTION,
                  variables: { simulatorId: this.props.simulator.id },
                  updateQuery: (previousResult, { subscriptionData }) => {
                    console.log(subscriptionData);
                    return Object.assign({}, previousResult, {
                      docking: subscriptionData.data.dockingUpdate
                    });
                  }
                })
              }
            >
              <SpecializedDocking {...this.props} docking={docking} />
            </SubscriptionHelper>
          );
        }}
      </Query>
    );
  }
}
export default SpecializedDockingData;
