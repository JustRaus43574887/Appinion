import {gql} from '@apollo/client';

export interface Live {
  live?: {
    _id: string;
    name: string;
    position: string;
    host: string;
    online: boolean;
    avatar?: {
      id: string;
      filename: string;
      mimetype: string;
      path: string;
    };
  };
}

const LIVE_QUERY = gql`
  query live {
    live {
      _id
      name
      position
      host
      online
      avatar {
        id
        filename
        mimetype
        path
      }
    }
  }
`;

export default LIVE_QUERY;
