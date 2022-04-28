import {gql} from '@apollo/client';

export interface Logout {
  loginLive: boolean;
}

export interface LogoutVars {
  fcmToken: string;
}

const LOGOUT_MUTATION = gql`
  mutation logoutLive($fcmToken: String!) {
    logoutLive(fcmToken: $fcmToken)
  }
`;

export default LOGOUT_MUTATION;
