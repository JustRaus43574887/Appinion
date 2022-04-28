import {gql} from '@apollo/client';

interface VarsData {
  name: string;
  position: string;
  online: boolean;
  host: string;
}

interface Data extends VarsData {
  _id: string;
}

export interface Update {
  updateVideoWidget: Data;
}

export interface UpdateVars {
  id?: string;
  form?: VarsData;
}

const UPDATE_VIDEO_MUTATION = gql`
  mutation updateVideoWidget($id: String!, $form: IVideoWidget!) {
    updateVideoWidget(id: $id, form: $form) {
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

export default UPDATE_VIDEO_MUTATION;
