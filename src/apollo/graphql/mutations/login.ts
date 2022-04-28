import {gql} from '@apollo/client';

export interface Login {
  loginLive: string;
}

export interface LoginVars {
  form: {
    login: string;
    password: string;
    fcmToken: string;
  };
}

const LOGIN_MUTATION = gql`
  mutation loginLive($form: ILive!) {
    loginLive(form: $form)
  }
`;

export default LOGIN_MUTATION;
