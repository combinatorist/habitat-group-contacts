import React, { Component } from 'react';
import EventCard from '../containers/Event';
import { connect } from 'react-redux';
import { fetchEvents } from '../actions/fetchEvents';
import { fetchUserGroups } from '../actions/fetchUserGroups';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import LinearProgress from '@material-ui/core/LinearProgress';

class EventList extends Component {
  componentWillMount() {
    this.props.fetchEvents();
    this.props.fetchUserGroups();
  }

  render() {
    return (
      <React.Fragment>
        {this.props.events ? (
          _.map(this.props.events, event => (
            <EventCard
              key={event.EventUid}
              event={event}
              userGroups={this.props.userGroups}
            />
          ))
        ) : (
          <LinearProgress />
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    userGroups: state.userGroups
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEvents, fetchUserGroups }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventList);
