
import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
  mutation ChangeNameMutation($input: ChangeNameInput!) {
    changeName(input: $input) {
      renamedUser {
        id
        name
      }
    }
  }
`;

let tempID = 1;

export default function commitChangeName(
  environment,
  userID,
  newName,
) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        id: userID,
        name: newName,
        clientMutationId: tempID++,
      },
    },
    updater: (store) => {
      const rootProxy = store.getRoot();
      rootProxy.setValue(null, 'user');
      console.log('rootProxy.getLinkedRecord(user): ', rootProxy.getLinkedRecord('user'));
      console.log('user is null?', rootProxy.getLinkedRecord('user') === null);
      console.log('after rootProxy.setValue(null, \'user\');', environment.getStore().getSource());
    },
  });
}