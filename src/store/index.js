import Vue from 'vue';
import Vuex from 'vuex';
// import order from '@/store/modules/order';
import clients from '@/store/modules/clients';
// import goods from '@/store/modules/goods';
// import checklists from '@/store/modules/checklists';
import visits from './modules/visits';
import managers from './modules/managers';
import user from './modules/user';
import auth from './modules/auth';
import goods from "@/store/modules/goods";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    user,
    auth,
    visits,
    goods,
    clients,
    managers,
    // checklists,
    // order,
  },
  strict: debug,
});
