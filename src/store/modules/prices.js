import {
  PRICES_GET_ALL, PRICES_GET_BY_PRODUCTITEM, PRICES_DOWNLOAD_ALL_FROM_SERVER, PRICES_WRITE_ALL_TO_VUEX, PRICES_SUCCESS
} from '@/store/actions/prices';
import { HTTP } from '@/utils/http';

const state = {
  prices: {},
  pricesStatus: '',
};

const getters = {
  [PRICES_GET_ALL]: (s) => s.prices,
  // eslint-disable-next-line no-shadow,arrow-body-style
  [PRICES_GET_BY_PRODUCTITEM]: (s) => (item) => {
    const result = s.prices[item];
    if (typeof result !== 'undefined') { 
      return result;
    }
    return []
  },
};

const actions = {
  [PRICES_DOWNLOAD_ALL_FROM_SERVER]: ({ commit }) => new Promise((resolve, reject) => {
    HTTP.get('/prices')
      .then((resp) => {
        commit(PRICES_WRITE_ALL_TO_VUEX, resp.data);
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  }),
};

const mutations = {
  [PRICES_WRITE_ALL_TO_VUEX]: (s, data) => {
    s.prices = {};
    data.forEach((price) => {
      (s.prices[price['productItem']] = s.prices[price['productItem']] || []).push(price)
    });
    s.pricesStatus = PRICES_SUCCESS;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
