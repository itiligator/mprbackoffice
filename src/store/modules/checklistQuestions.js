import { HTTP } from '@/utils/http';
import {
    CHECKLISTQUESTIONS_DOWNLOAD_ALL_FROM_SERVER,
    CHECKLISTQUESTIONS_GET_ALL,
    CHECKLISTQUESTIONS_GET_BY_UUID, CHECKLISTQUESTIONS_UPLOAD_TO_SERVER, CHECKLISTQUESTIONS_WRITE_DATA_TO_VUEX
} from "@/store/actions/checklistQuestions";

const state = {
    checklistQuestion: [],
    checklistQuestionStatus: false,
};

const getters = {
  [CHECKLISTQUESTIONS_GET_ALL]: (state) => state.checklistQuestion,
  [CHECKLISTQUESTIONS_GET_BY_UUID]:
    (state) => (UUID) => {
      const searchResult = state.checklistQuestion.find((c) => c.UUID === UUID);
      if (typeof searchResult !== 'undefined') { return searchResult; }
      return { text: UUID, UUID };
    },
};

const actions = {
  [CHECKLISTQUESTIONS_DOWNLOAD_ALL_FROM_SERVER]: ({ commit }) => new Promise((resolve, reject) => {
    HTTP.get('checklistsquestions')
      .then((resp) => {
        commit(CHECKLISTQUESTIONS_WRITE_DATA_TO_VUEX, resp);
        resolve(resp);
      })
      .catch((error) => {
        reject(error);
      });
  }),
  [CHECKLISTQUESTIONS_UPLOAD_TO_SERVER]: (s, checklistQuestionData) => new Promise((resolve, reject) => {
      Object.keys(checklistQuestionData).forEach((key) => (checklistQuestionData[key] == null) && delete checklistQuestionData[key]);
      HTTP.put(`checklistsquestions`, checklistQuestionData)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
  }),
};

const mutations = {
  [CHECKLISTQUESTIONS_WRITE_DATA_TO_VUEX]: (state, resp) => {
    state.checklistQuestion = resp.data;
    state.checklistQuestionStatus = true;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
