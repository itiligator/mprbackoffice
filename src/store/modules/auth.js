/* eslint-disable dot-notation */
// /* eslint-disable promise/param-names */

import { HTTP } from '@/utils/http';

import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
} from '../actions/auth';

const state = {
  token: window.localStorage.getItem('user-token') || '',
  status: '',
  hasLoadedOnce: false,
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  authStatus: (state) => state.status,
};

const actions = {
  [AUTH_REQUEST]: ({ commit }, user) => new Promise((resolve, reject) => {
    commit(AUTH_REQUEST);
    HTTP.post('api-token-auth/', user)
      .then((resp) => {
        window.localStorage.setItem('user-token', resp.data.token);
        commit(AUTH_SUCCESS, resp);
        resolve(resp);
      })
      .catch((err) => {
        commit(AUTH_ERROR, err);
        window.localStorage.removeItem('user-token');
        reject(err);
      });
  }),
  [AUTH_LOGOUT]: ({ commit }) => new Promise((resolve) => {
    commit(AUTH_LOGOUT);
    window.localStorage.removeItem('user-token');
    resolve();
  }),
};

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading';
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success';
    state.token = resp.data.token;
    state.hasLoadedOnce = true;
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error';
    state.hasLoadedOnce = true;
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = '';
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
