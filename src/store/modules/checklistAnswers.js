import { HTTP } from '@/utils/http';
import {
    CHECKLISTANSWERS_DOWNLOAD_ALL_FROM_SERVER,
    CHECKLISTANSWERS_DOWNLOAD_BY_VISIT_UUID_FROM_SERVER,
    CHECKLISTANSWERS_GET_ALL,
    CHECKLISTANSWERS_GET_BY_VISIT_UUID,
    CHECKLISTANSWERS_WRITE_DATA_TO_VUEX
} from "@/store/actions/checklistAnswers";

const state = {
    checklistAnswers: [],
    checklistAnswersStatus: false,
};

const getters = {
  [CHECKLISTANSWERS_GET_ALL]: (state) => state.checklistAnswers,
  [CHECKLISTANSWERS_GET_BY_VISIT_UUID]:
    (state) => (visitUUID) => {
      return state.checklistAnswers.filter((a) => a.visitUUID === visitUUID);
    },
};

const actions = {
  [CHECKLISTANSWERS_DOWNLOAD_ALL_FROM_SERVER]: ({ commit }) => new Promise((resolve, reject) => {
    HTTP.get('checklistanswers')
      .then((resp) => {
        commit(CHECKLISTANSWERS_WRITE_DATA_TO_VUEX, resp);
        resolve(resp);
      })
      .catch((error) => {
        reject(error);
      });
  }),
    [CHECKLISTANSWERS_DOWNLOAD_BY_VISIT_UUID_FROM_SERVER]: ({ commit }, visitUUID) => new Promise((resolve, reject) => {
        HTTP.get(`checklistanswers?visitUUID=${visitUUID}`)
            .then((resp) => {
                commit(CHECKLISTANSWERS_WRITE_DATA_TO_VUEX, resp);
                resolve(resp);
            })
            .catch((error) => {
                reject(error);
            });
    }),
};

// TODO: дописать мутацию сохранения и дополнения
// const mutations = {
//   [CHECKLISTANSWERS_WRITE_DATA_TO_VUEX]: (state, resp) => {
//   },
// };

export default {
  state,
  getters,
  actions,
  // mutations,
};
