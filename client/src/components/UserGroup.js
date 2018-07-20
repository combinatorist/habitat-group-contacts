import React, { Component } from 'react';
import _ from 'lodash';
import User from './User';
import { connect } from 'react-redux';
import { fetchEvents } from '../actions/fetchEvents';
import { fetchUserGroups } from '../actions/fetchUserGroups';
import { clearUsers } from '../actions/clearUsers';
import { bindActionCreators } from 'redux';
import UserDetailHeader from '../containers/UserDetailHeader';
import UserGroupDetails from '../containers/UserGroupDetails';
import DownloadExcel from './DownloadExcel';

class UserGroup extends Component {
  componentWillMount() {
    this.props.fetchEvents();

    // Clear the user list when changing user groups as the download excel is pulling from the Redux Store
    this.props.clearUsers();
    var i = 0;
    for (i = 0; i < 30; i++) {
      this.props.fetchUserGroups(i);
    }
  }

  render() {
    const { event } = this.props;
    const { userGroups } = this.props;
    const { usergroupid } = this.props.match.params;

    const paddingStyle = {
      padding: '0 24px 0 24px',
    };

    const eventName = event ? event.Name : null;
    const eventStart = event ? event.StartTime : null;
    const eventEnd = event ? event.EndTime : null;

    const userGroup = event
      ? _.mapKeys(event.UserGroupRegistrations, 'UserGroupUid')[usergroupid]
      : null;

    const userGroupName = userGroups ? userGroups.Name : null;

    const loadUsers = group => {
      return (
        <div>
          {group
            ? _.map(
                group.UserRegistrations,
                registeredUser =>
                  !registeredUser.Deleted ? (
                    <div key={registeredUser.UserUid}>
                      <User lookupUser={registeredUser} />
                    </div>
                  ) : null,
              )
            : null}
        </div>
      );
    };

    return (
      <div>
        <UserGroupDetails
          eventName={eventName}
          userGroupName={userGroupName}
          startTime={eventStart}
          endTime={eventEnd}
        />
        <div style={paddingStyle}>
          <DownloadExcel userGroupName={userGroupName} startTime={eventStart} />
          <UserDetailHeader />
          {loadUsers(userGroup)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    event: state.events[ownProps.match.params.event],
    userGroups: state.userGroups[ownProps.match.params.usergroupid],
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { fetchEvents, fetchUserGroups, clearUsers },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserGroup);
