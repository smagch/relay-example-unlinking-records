import React from "react";
import ReactDOM from "react-dom";
import { graphql as ql } from 'graphql';
import { QueryRenderer, graphql } from 'react-relay';
import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';

import { schema } from './schema';
import App from './components/App';

const fetchQuery = (operation, variables) => {
  console.log('operation: ', operation, variables);
  return ql(
    schema,
    operation.text,
    null,
    {},
    variables,
    operation.name,
  ).then(res => {
    console.log('got response: ', res);
    return res;
  }).catch(err => {
    console.error(err);
  }); 
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

// for debugging
window.environment = environment;

ReactDOM.render(
  <QueryRenderer
    environment={environment}
    query={graphql`
      query appQuery {
        users {
          ...App_users
        }
        user {
          ...App_user
        }
      }
    `}
    render={({error, props}) => {
      console.log('render: ', error, props);
      if (error) {
        return <div>{error.message}</div>;
      } else if (props) {
        return <App users={props.users} user={props.user} />;
      }
      return <div>Loading</div>;
    }}
  />,
  document.getElementById("app"),
);