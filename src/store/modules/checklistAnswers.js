import Vue from 'vue';
import { HTTP } from '@/utils/http';
import {
    CHECKLISTANSWERS_DOWNLOAD_BY_VISIT_UUID_FROM_SERVER,
    CHECKLISTANSWERS_GET_ALL,
    CHECKLISTANSWERS_GET_BY_VISIT_UUID,
    CHECKLISTANSWERS_WRITE_DATA_TO_VUEX,
    CHECKLISTANSWERS_IS_LOADING,
    CHECKLISTANSWERS_LOADING,
    CHECKLISTANSWERS_IS_ERROR,
    CHECKLISTANSWERS_ERROR,
    CHECKLISTANSWERS_IS_SUCCESS,
    CHECKLISTANSWERS_SUCCESS
} from "@/store/actions/checklistAnswers";

const state = {
    checklistAnswers: {},
    checklistAnswersStatus: 'initial',
};

const getters = {
  [CHECKLISTANSWERS_GET_ALL]: (state) => state.checklistAnswers,
  [CHECKLISTANSWERS_GET_BY_VISIT_UUID]:
    (state) => (visitUUID) => {
      return state.checklistAnswers[visitUUID];
    },
  [CHECKLISTANSWERS_IS_SUCCESS]: (state) => {return state.checklistAnswersStatus === CHECKLISTANSWERS_SUCCESS},
  [CHECKLISTANSWERS_IS_ERROR]: (state) => {return state.checklistAnswersStatus === CHECKLISTANSWERS_ERROR},
  [CHECKLISTANSWERS_IS_LOADING]: (state) => {return state.checklistAnswersStatus === CHECKLISTANSWERS_LOADING},
};

const actions = {
  // [CHECKLISTANSWERS_DOWNLOAD_ALL_FROM_SERVER]: ({ commit }) => new Promise((resolve, reject) => {
  //   HTTP.get('checklistanswers')
  //     .then((resp) => {
  //       commit(CHECKLISTANSWERS_WRITE_DATA_TO_VUEX, resp);
  //       resolve(resp);
  //     })
  //     .catch((error) => {
  //       reject(error);
  //     });
  // }),
    [CHECKLISTANSWERS_DOWNLOAD_BY_VISIT_UUID_FROM_SERVER]: ({ commit }, visitUUID) => new Promise((resolve, reject) => {
        commit(CHECKLISTANSWERS_LOADING);
        HTTP.get(`checklistanswers?visit=${visitUUID}`)
            .then((resp) => {
                commit(CHECKLISTANSWERS_WRITE_DATA_TO_VUEX, resp);
                commit(CHECKLISTANSWERS_SUCCESS);
                resolve(resp);
            })
            .catch((error) => {
                commit(CHECKLISTANSWERS_ERROR);
                reject(error);
            });
    }),
};

const mutations = {
  [CHECKLISTANSWERS_WRITE_DATA_TO_VUEX]: (state, resp) => {
    if (resp.data !== undefined && resp.data[0] !== undefined) {
      Vue.set(state.checklistAnswers, resp.data[0].visitUUID, resp.data);
    }
  },
  [CHECKLISTANSWERS_LOADING]: (state) => {
    state.checklistAnswersStatus = CHECKLISTANSWERS_LOADING;
  },
  [CHECKLISTANSWERS_SUCCESS]: (state) => {
    state.checklistAnswersStatus = CHECKLISTANSWERS_SUCCESS;
  },
  [CHECKLISTANSWERS_ERROR]: (state) => {
    state.checklistAnswersStatus = CHECKLISTANSWERS_ERROR;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
