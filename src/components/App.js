import React from 'react';
import {
  graphql,
  createFragmentContainer,
} from 'react-relay';
import commitChangeName from '../mutations/ChangeName';

class App extends React.Component {
  handleClick = (e) => {
    if (!this.props.user) {
      return;
    }
    commitChangeName(
      this.props.relay.environment,
      this.props.user.id,
      'Samuel Langhorne Clemens', // The real name of Mark Twain
    );
  }
  render() {
    const { user, users } = this.props;
    return (
      <div>
        {user ? (
          <div>current user is {user.name}.</div>
        ) : (
          <div>current user is null.</div>
        )}
        <h2>list of users:</h2>
        <ul>
          {users.map(user => {
            return <li key={user.id}>{user.name}</li>;
          })}
        </ul>
        <p>After renaming, user will become null.</p>
        <button onClick={this.handleClick}>
          Rename Mark Twain to his real name
        </button>
      </div>
    );
  }
}

export default createFragmentContainer(App, {
  user: graphql`
    fragment App_user on User {
      id
      name
    }
  `,
  users: graphql`
    fragment App_users on User @relay(plural: true) {
      id
      name
    }
  `,
});