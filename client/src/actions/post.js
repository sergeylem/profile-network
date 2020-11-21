import axios from 'axios';
import {setAlert} from '../actions/alert';

import { GET_POST, POST_ERROR } from './types';

export const getPosts = () => async dispatch => {
  try {
    const res = axios.get('/api/posts');

    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });

  }
} 