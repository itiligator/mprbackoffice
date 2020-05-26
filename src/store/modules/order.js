import { HTTP } from '@/utils/http';
import {
  ORDERLIST_REQUEST,
  ORDERLIST_SUCCESS,
  ORDER_REQUEST,
  ORDER_SUCCESS,
} from '@/store/actions/order';

const state = {
  orderliststate: [],
  orderlistdate: '',
  orderlistloaded: false,
  ordersstate: {},
};

const getters = {
  // eslint-disable-next-line no-shadow
  ORDERS: (state) => state.orders,
  // eslint-disable-next-line no-shadow
  GETORDERBYPK: (state) => (pk) => state.ordersstate[pk],
  // eslint-disable-next-line no-shadow
  ORDERLIST: (state) => state.orderliststate,

};

const actions = {
  [ORDERLIST_REQUEST]: ({ commit }) => new Promise((resolve, reject) => {
    HTTP.get('/orderlist')
      .then((resp) => {
        commit(ORDERLIST_SUCCESS, resp);
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  }),
  [ORDER_REQUEST]: ({ commit }, orderpk) => new Promise((resolve, reject) => {
    HTTP.get(`/getorder/${orderpk}`)
      .then((resp) => {
        const payload = { };
        payload.resp = resp;
        payload.pk = orderpk;
        commit(ORDER_SUCCESS, payload);
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  }),
};

const mutations = {
  // eslint-disable-next-line no-shadow
  [ORDERLIST_SUCCESS]: (state, resp) => {
    state.orderliststate = resp.data;
    state.orderlistloaded = true;
    state.orderlistdate = Date();
  },
  // eslint-disable-next-line no-shadow
  [ORDER_SUCCESS]: (state, payload) => {
    state.ordersstate[payload.pk] = payload.resp.data;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
