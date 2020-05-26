/* eslint-disable no-param-reassign */
import { HTTP } from '@/utils/http';
import Vue from 'vue';
import {
  VISIT_CLOSE_AND_REPLACE_CURRENT,
  VISIT_CLOSE_CURRENT,
  VISIT_DOWNLOAD_ALL_FROM_SERVER,
  VISIT_DOWNLOAD_FINISHED_FROM_SERVER,
  VISIT_DOWNLOAD_HISTORY_BY_INN_FROM_SERVER,
  VISIT_DOWNLOAD_PLANNED_FROM_SERVER,
  VISIT_ERROR, VISIT_FLASH_ALL,
  VISIT_GET_CURRENT,
  VISIT_GET_FINISHED,
  VISIT_GET_HISTORY_BY_INN,
  VISIT_GET_PLANNED,
  VISIT_IS_CURRENT,
  VISIT_SAVE_CURRENT_TO_VUEX,
  VISIT_UPLOAD_CURRENT_TO_SERVER,
  VISIT_WRITE_CURRENT_TO_VUEX,
  VISIT_WRITE_FINISHED_TO_VUEX,
  VISIT_WRITE_HISTORY_TO_VUEX_BY_INN,
  VISIT_WRITE_PLANNED_TO_VUEX,

} from '../actions/visits';


const initialCurrentVisit = {
  UUID: null,
  id: null,
  orders: null,
  payment: null,
  date: null,
  dataBase: true,
  clientINN: null,
  processed: false,
  invoice: false,
  status: 0,
  managerID: null,
  author: null,
};

const state = {
  plannedVisits: [],
  finishedVisits: [],
  historicalVisits: {},
  currentVisit: initialCurrentVisit,
  visitStatus: '',
};

const getters = {
  [VISIT_GET_CURRENT]: (s) => s.currentVisit,
  [VISIT_IS_CURRENT]: (s) => !!s.currentVisit.UUID,
  [VISIT_GET_PLANNED]: (s) => s.plannedVisits,
  [VISIT_GET_FINISHED]: (s) => s.finishedVisits,
  [VISIT_GET_HISTORY_BY_INN]: (s) => (inn) => s.historicalVisits[inn],
};


const actions = {
  [VISIT_DOWNLOAD_FINISHED_FROM_SERVER]:
    ({ commit }) => new Promise((resolve, reject) => {
      const today = new Date().toISOString().slice(0, 10);
      HTTP.get(`visits?status=2&date=${today}`)
        .then((response) => {
          commit(VISIT_WRITE_FINISHED_TO_VUEX, response.data);
          resolve(response);
        })
        .catch((err) => {
          commit(VISIT_ERROR, err);
          reject(err);
        });
    }),
  [VISIT_DOWNLOAD_PLANNED_FROM_SERVER]:
    ({ commit }) => new Promise((resolve, reject) => {
      HTTP.get('visits?status=0')
        .then((response) => {
          commit(VISIT_WRITE_PLANNED_TO_VUEX, response.data);
          resolve(response);
        })
        .catch((err) => {
          commit(VISIT_ERROR, err);
          reject(err);
        });
    }),
  [VISIT_DOWNLOAD_ALL_FROM_SERVER]:
    ({ dispatch }) => {
      dispatch(VISIT_DOWNLOAD_PLANNED_FROM_SERVER);
      dispatch(VISIT_DOWNLOAD_FINISHED_FROM_SERVER);
    },
  [VISIT_DOWNLOAD_HISTORY_BY_INN_FROM_SERVER]:
    ({ commit }, clientINN) => new Promise((resolve, reject) => {
      HTTP.get(`visits??processed=true&status=2&limit=3&clientINN=${clientINN}`)
        .then((response) => {
          commit(VISIT_WRITE_HISTORY_TO_VUEX_BY_INN, { clientINN, data: response.data });
          resolve(response);
        })
        .catch((err) => {
          commit(VISIT_ERROR, err);
          reject(err);
        });
    }),
  [VISIT_SAVE_CURRENT_TO_VUEX]:
    ({ commit }, visitData) => {
      commit(VISIT_WRITE_CURRENT_TO_VUEX, visitData);
    },
  [VISIT_UPLOAD_CURRENT_TO_SERVER]:
    (s) => new Promise((resolve, reject) => {
      const currentVisit = s.getters[VISIT_GET_CURRENT];
      HTTP.put(`visits/${currentVisit.UUID}`, currentVisit)
        .then((resp) => {
          resolve(resp);
        })
        .catch((err) => {
          s.commit(VISIT_ERROR, err);
          reject(err);
        });
    }),
  [VISIT_CLOSE_CURRENT]: (s) => new Promise((resolve, reject) => {
    const currentVisit = JSON.parse(JSON.stringify(s.getters[VISIT_GET_CURRENT]));
    currentVisit.status = 2;
    HTTP.put(`visits/${currentVisit.UUID}`, currentVisit)
      .then((resp) => {
        s.commit(VISIT_CLOSE_AND_REPLACE_CURRENT);
        resolve(resp);
      })
      .catch((err) => {
        s.commit(VISIT_ERROR, err);
        reject(err);
      });
  }),
};

// мутации

const mutations = {
  [VISIT_ERROR]: (s) => { s.visitStatus = 'error'; },
  [VISIT_WRITE_CURRENT_TO_VUEX]: (s, visitData) => { s.currentVisit = visitData; },
  [VISIT_WRITE_PLANNED_TO_VUEX]: (s, visitsData) => { s.plannedVisits = visitsData; },
  [VISIT_WRITE_FINISHED_TO_VUEX]: (s, visitsData) => { s.finishedVisits = visitsData; },
  [VISIT_WRITE_HISTORY_TO_VUEX_BY_INN]: (s, { clientINN, data }) => {
    Vue.set(s.historicalVisits, clientINN, data);
  },
  [VISIT_FLASH_ALL]: (s) => {
    s.currentVisit = initialCurrentVisit;
    s.plannedVisits = [];
    s.finishedVisits = [];
    s.historicalVisits = {};
    s.visitStatus = 'flashed';
  },
  [VISIT_CLOSE_AND_REPLACE_CURRENT]: (s) => {
    const index = s.plannedVisits.findIndex((x) => x.UUID === s.currentVisit.UUID);
    if (index > -1) {
      s.plannedVisits.splice(index, 1);
    }
    s.currentVisit.status = 2;
    s.finishedVisits.push(s.currentVisit);
    s.currentVisit = initialCurrentVisit;
  },

};


export default {
  state,
  getters,
  actions,
  mutations,
};
