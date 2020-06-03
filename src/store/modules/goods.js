import {
  GOODS_DOWNLOAD_ALL_FROM_SERVER,
  GOODS_GET_ALL,
  GOODS_GET_BY_ITEM, GOODS_UPLOAD_ALL_TO_SERVER, GOODS_WRITE_ALL_TO_VUEX,
} from '@/store/actions/goods';
import { HTTP } from '@/utils/http';

const state = {
  goods: [],
  goodsStatus: false,
};

const getters = {
  [GOODS_GET_ALL]: (s) => s.goods,
  // eslint-disable-next-line no-shadow,arrow-body-style
  [GOODS_GET_BY_ITEM]: (s) => (item) => {
    const searchResult = s.goods.find((g) => g.item === item);
    if (typeof searchResult !== 'undefined') { return searchResult; }
    return {item, name: item, description: item}
  },
};

const actions = {
  [GOODS_DOWNLOAD_ALL_FROM_SERVER]: ({ commit }) => new Promise((resolve, reject) => {
    HTTP.get('/products')
      .then((resp) => {
        commit(GOODS_WRITE_ALL_TO_VUEX, resp.data);
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  }),
  [GOODS_UPLOAD_ALL_TO_SERVER]: (s) => new Promise((resolve, reject) => {
    HTTP.post(`products`, s.getters[GOODS_GET_ALL])
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
  [GOODS_WRITE_ALL_TO_VUEX]: (s, data) => {
    s.goods = data;
    s.goodsStatus = true;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
