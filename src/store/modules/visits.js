/* eslint-disable no-param-reassign */
import { HTTP } from '@/utils/http';
import {
    VISITS_GET_ALL,
    VISITS_ERROR,
    VISITS_WRITE_TO_VUEX,
    VISITS_DOWNLOAD_FROM_SERVER_BY_DATE,
    VISITS_LOADING,
    VISITS_SUCCESS,
    VISITS_IS_LOADING,
    VISITS_ERROR_STATUS,
    VISITS_LOADING_STATUS,
    VISITS_SUCCESS_STATUS,
    VISITS_IS_ERROR,
    VISITS_IS_SUCCESS, VISITS_GET_BY_UUID, VISITS_UPLOAD_TO_SERVER,

} from '../actions/visits';


const state = {
  visits: [],
};

const getters = {
    [VISITS_GET_ALL]: (s) => s.visits,
    [VISITS_GET_BY_UUID]: (s) => (UUID) => {
    const searchResult = s.visits.find((v) => v.UUID === UUID);
    if (typeof searchResult !== 'undefined') { return searchResult; }
    return { UUID: '-1' };
},
    [VISITS_IS_LOADING]: (s) => (s.visitStatus === VISITS_LOADING_STATUS),
    [VISITS_IS_ERROR]: (s) => (s.visitStatus === VISITS_ERROR_STATUS),
    [VISITS_IS_SUCCESS]: (s) => (s.visitStatus === VISITS_SUCCESS_STATUS),
};


const actions = {
  [VISITS_DOWNLOAD_FROM_SERVER_BY_DATE]:
    ({ commit }, date) => new Promise((resolve, reject) => {
      commit(VISITS_LOADING);
      HTTP.get(`visits?date=${date}`)
        .then((response) => {
          commit(VISITS_WRITE_TO_VUEX, response.data);
          commit(VISITS_SUCCESS);
          resolve(response);
        })
        .catch((err) => {
          commit(VISITS_ERROR, err);
          reject(err);
        });
    }),
    [VISITS_UPLOAD_TO_SERVER]: (s, visitData) => new Promise((resolve, reject) => {
        Object.keys(visitData).forEach((key) => (visitData[key] == null) && delete visitData[key]);
        HTTP.put(`visits/${visitData.UUID}`, visitData)
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    }),
};

// мутации

const mutations = {
  [VISITS_ERROR]: (s) => { s.visitStatus = VISITS_ERROR_STATUS; },
  [VISITS_LOADING]: (s) => { s.visitStatus = VISITS_LOADING_STATUS; },
  [VISITS_SUCCESS]: (s) => { s.visitStatus = VISITS_SUCCESS_STATUS; },
  [VISITS_WRITE_TO_VUEX]: (s, visitsData) => { s.visits = visitsData; },
};


export default {
  state,
  getters,
  actions,
  mutations,
};
