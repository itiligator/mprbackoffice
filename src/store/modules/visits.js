/* eslint-disable no-param-reassign */
import { HTTP } from '@/utils/http';
import {
  VISITS_GET_ALL,
  VISITS_ERROR, VISITS_WRITE_TO_VUEX, VISITS_DOWNLOAD_FROM_SERVER_BY_DATE,

} from '../actions/visits';


const state = {
  visits: [],
};

const getters = {
  [VISITS_GET_ALL]: (s) => s.visits,
};


const actions = {
  [VISITS_DOWNLOAD_FROM_SERVER_BY_DATE]:
    ({ commit }, date) => new Promise((resolve, reject) => {
      HTTP.get(`visits?date=${date}`)
        .then((response) => {
          commit(VISITS_WRITE_TO_VUEX, response.data);
          resolve(response);
        })
        .catch((err) => {
          commit(VISITS_ERROR, err);
          reject(err);
        });
    }),
};

// мутации

const mutations = {
  [VISITS_ERROR]: (s) => { s.visitStatus = 'error'; },
  [VISITS_WRITE_TO_VUEX]: (s, visitsData) => { s.visits = visitsData; },
};


export default {
  state,
  getters,
  actions,
  mutations,
};
