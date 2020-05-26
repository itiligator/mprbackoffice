import {
  GOODS_REQUEST,
  GOODS_SUCCESS,
  GOOD_BY_ITEM,
  ALL_GOODS,
} from '@/store/actions/goods';
import { HTTP } from '@/utils/http';

const state = {
  goodsstate: [],
  goodsdate: '',
  goodsloaded: false,
};

const getters = {
  // eslint-disable-next-line no-shadow,arrow-body-style
  [ALL_GOODS]: (state) => state.goodsstate,
  // eslint-disable-next-line no-shadow,arrow-body-style
  [GOOD_BY_ITEM]: (state) => (item) => state.goodsstate.find((good) => good.item === item),
};

const actions = {
  [GOODS_REQUEST]: ({ commit }) => new Promise((resolve, reject) => {
    HTTP.get('/products')
      .then((resp) => {
        commit(GOODS_SUCCESS, resp);
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  }),
};

const mutations = {
  // eslint-disable-next-line no-shadow
  [GOODS_SUCCESS]: (state, resp) => {
    state.goodsstate = resp.data;
    state.goodsloaded = true;
    state.goodsdate = Date();
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
