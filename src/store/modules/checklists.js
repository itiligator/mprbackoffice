
import { HTTP } from '@/utils/http';
import {
  CHECKLIST_GET_CURRENT, CHECKLIST_SAVE_CURRENT,
  CHECKLISTS_GET_ALL,
  CHECKLISTS_REQUEST,
  CHECKLISTS_SUCCESS,
  CHECKLIST_RESET_CURRENT, CHECKLIST_UPLOAD_CURRENT_TO_SERVER,
} from '@/store/actions/checklists';
import { VISIT_ERROR, VISIT_GET_CURRENT } from '@/store/actions/visits';


const state = {
  checklists: [],
  checklistsState: '',
  currentChecklist: [],
};

const getters = {
  [CHECKLISTS_GET_ALL]: (s) => s.checklists,
  [CHECKLIST_GET_CURRENT]: (s) => s.currentChecklist,
};

const actions = {
  [CHECKLISTS_REQUEST]: ({ commit }) => new Promise((resolve, reject) => {
    HTTP.get('/checklistsquestions')
      .then((resp) => {
        commit(CHECKLISTS_SUCCESS, resp);
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  }),
  // eslint-disable-next-line no-shadow
  [CHECKLIST_UPLOAD_CURRENT_TO_SERVER]: (state) => new Promise((resolve, reject) => {
    const visitUUID = state.getters[VISIT_GET_CURRENT].UUID;
    // eslint-disable-next-line array-callback-return
    const answers = state.getters[CHECKLIST_GET_CURRENT].map(
      ({ UUID, answer1, answer2 }) => ({
        visitUUID, questionUUID: UUID, answer1, answer2,
      }),
    );
    HTTP.post('/checklistanswers', answers)
      .then((resp) => {
        resolve(resp);
      })
      .catch((err) => {
        console.log(err);
        state.commit(VISIT_ERROR);
        reject(err);
      });
  }),
  [CHECKLIST_SAVE_CURRENT]: ({ commit }, checklist) => {
    // console.log('i m here in CHECKLIST_SAVE_CURRENT action');
    commit(CHECKLIST_SAVE_CURRENT, checklist);
  },
  [CHECKLIST_RESET_CURRENT]: ({ commit }) => {
    // console.log('i m here in CHECKLIST_RESET_CURRENT action');
    commit(CHECKLIST_RESET_CURRENT);
  },

};

const mutations = {
  // eslint-disable-next-line no-shadow
  [CHECKLISTS_SUCCESS]: (state, resp) => {
    state.checklists = resp.data;
    state.checklistsState = true;
  },
  // eslint-disable-next-line no-shadow
  [CHECKLIST_SAVE_CURRENT]: (state, checklist) => {
    state.currentChecklist = checklist;
  },
  // eslint-disable-next-line no-shadow
  [CHECKLIST_RESET_CURRENT]: (state) => {
    state.currentChecklist = [];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
