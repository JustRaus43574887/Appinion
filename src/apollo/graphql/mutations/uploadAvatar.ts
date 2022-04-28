import {gql} from '@apollo/client';

export interface UploadAvatar {
  uploadAvatar: boolean;
}

const UPLOAD_MUTATION = gql`
  mutation uploadAvatar($avatar: Upload!) {
    uploadAvatar(avatar: $avatar)
  }
`;

export default UPLOAD_MUTATION;
