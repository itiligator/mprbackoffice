import {
  CLIENTS_DOWNLOAD_ALL_FROM_SERVER,
  CLIENTS_WRITE_DATA_TO_VUEX,
  CLIENTS_GET_BY_INN,
  CLIENTS_GET_ALL, CLIENTS_IS_LOADED, CLIENTS_UPLOAD_TO_SERVER,
} from '@/store/actions/clients';
import { HTTP } from '@/utils/http';

const state = {
  clients: [],
  clientsDate: '',
  clientsLoaded: false,
};

const getters = {
  [CLIENTS_GET_ALL]: (state) => state.clients,
  [CLIENTS_GET_BY_INN]:
    (state) => (inn) => {
      const searchResult = state.clients.find((c) => c.inn === inn);
      if (typeof searchResult !== 'undefined') { return searchResult; }
      return { name: inn, inn };
    },
  [CLIENTS_IS_LOADED]: (state) => state.clientsLoaded,
};

const actions = {
  [CLIENTS_DOWNLOAD_ALL_FROM_SERVER]: ({ commit }) => new Promise((resolve, reject) => {
    HTTP.get('/clients')
      .then((resp) => {
        commit(CLIENTS_WRITE_DATA_TO_VUEX, resp);
        resolve(resp);
      })
      .catch((error) => {
        reject(error);
      });
  }),
  [CLIENTS_UPLOAD_TO_SERVER]: (s, clientData) => new Promise((resolve, reject) => {
    Object.keys(clientData).forEach((key) => (clientData[key] == null) && delete clientData[key]);
    HTTP.put(`clients`, [clientData])
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
  [CLIENTS_WRITE_DATA_TO_VUEX]: (state, resp) => {
    state.clients = resp.data;
    state.clientsLoaded = true;
    state.clientsDate = Date();
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
