// import apiCall from '@/utils/api';
import { HTTP } from '@/utils/http';
import Vue from 'vue';
import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user';
import { AUTH_LOGOUT } from '../actions/auth';

const state = { status: '', profile: { firstName: '', lastName: '', ID: '' } };

const getters = {
  // eslint-disable-next-line no-shadow
  getProfile: (state) => state.profile,
  // eslint-disable-next-line no-shadow
  isProfileLoaded: (state) => !!state.profile.id,
  // eslint-disable-next-line no-shadow
  userFirstName: (state) => state.profile.firstName,
  // eslint-disable-next-line no-shadow
  userLastName: (state) => state.profile.lastName,
  // eslint-disable-next-line no-shadow
  userFullName: (state) => `${state.profile.firstName} ${state.profile.lastName}`,
  userID: (s) => s.profile.ID,
};

const actions = {
  [USER_REQUEST]: ({ commit }) => new Promise((resolve, reject) => {
    HTTP.get('users/me')
      .then((resp) => {
        commit(USER_SUCCESS, resp.data);
        resolve(resp);
      })
      .catch((err) => {
        commit(USER_ERROR);
        // хуй знает почему, но получение профилья пользователя сначала скатывается в ошибку
        // а потом завершается успешно
        // dispatch(AUTH_LOGOUT);
        reject(err);
      });
  }),
};

const mutations = {
  // // eslint-disable-next-line no-shadow
  // [USER_REQUEST]: (state) => {
  //   state.status = 'loading';
  // },
  // eslint-disable-next-line no-shadow
  [USER_SUCCESS]: (state, resp) => {
    state.status = 'success';
    Vue.set(state, 'profile', resp);
  },
  // eslint-disable-next-line no-shadow
  [USER_ERROR]: (state) => {
    state.status = 'error';
  },
  // eslint-disable-next-line no-shadow
  [AUTH_LOGOUT]: (state) => {
    state.profile = {};
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
