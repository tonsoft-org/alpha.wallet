import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import Account from "@/models/account";
import User from "@/models/user";
import Transaction from "@/models/transaction";
import VuexPersistence from 'vuex-persist'
import auth from './modules/auth'
import Message from "@/models/message";

Vue.use(Vuex)

const database = new VuexORM.Database();
database.register(Account);
database.register(User);
database.register(Transaction);
database.register(Message);
VuexORM.use(VuexORM, {
  database
});

const vuexLocal = new VuexPersistence({
  storage: localStorage,
  key: 'vuex',
})

export default new Vuex.Store({
  plugins: [VuexORM.install(database), vuexLocal.plugin],
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
  }
})
