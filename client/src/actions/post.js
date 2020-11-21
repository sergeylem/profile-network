import axios from 'axios';
import {setAlert} from '../actions/alert';

import { GET_POST, POST_ERROR, UPDATE_LIKES } from './types';

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

//Add like
export const addLike = id => async dispatch => {
  try {
    const res = axios.put(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: {id, likes: res.data}
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });

  }
} 

//Remove like
export const removeLike = id => async dispatch => {
  try {
    const res = axios.put(`/api/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: {id, likes: res.data}
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });

  }
} 