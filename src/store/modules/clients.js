import {
  CLIENTS_REQUEST,
  CLIENTS_SUCCESS,
  GETCLIENTBYINN,
  GETALLCLIENTS,
} from '@/store/actions/clients';
import { HTTP } from '@/utils/http';

const state = {
  clientsstate: [],
  clientsdate: '',
  clientssloaded: false,
};

const getters = {
  // eslint-disable-next-line no-shadow,arrow-body-style
  [GETALLCLIENTS]: (state) => state.clientsstate,
  [GETCLIENTBYINN]:
  // eslint-disable-next-line no-shadow
    (state) => (inn) => {
      const searchResult = state.clientsstate.find((c) => c.inn === inn);
      if (typeof searchResult !== 'undefined') { return searchResult; }
      return { name: inn, inn };
    },
};

const actions = {
  [CLIENTS_REQUEST]: ({ commit }) => new Promise((resolve, reject) => {
    HTTP.get('/clients')
      .then((resp) => {
        commit(CLIENTS_SUCCESS, resp);
        resolve(resp);
      })
      .catch((error) => {
        // if (error.response) {
        //   // Request made and server responded
        //   console.log(error.response.data);
        //   console.log(error.response.status);
        //   console.log(error.response.headers);
        // } else if (error.request) {
        //   // The request was made but no response was received
        //   console.log(error.request);
        // } else {
        //   // Something happened in setting up the request that triggered an Error
        //   console.log('Error', error.message);
        // }
        reject(error);
      });
  }),
};

const mutations = {
  // eslint-disable-next-line no-shadow
  [CLIENTS_SUCCESS]: (state, resp) => {
    state.clientsstate = resp.data;
    state.clientssloaded = true;
    state.clientsdate = Date();
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
