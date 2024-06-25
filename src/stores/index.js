import { createStore } from 'vuex';

export default createStore({
  state: {
    isAuthenticated: false,
  },
  mutations: {
    setAuthentication(state, status) {
      state.isAuthenticated = status;
    },
  },
  actions: {
    onlogin({ commit }) {
      // 這裡可以放登入邏輯，成功後設定 isAuthenticated 為 true
      commit('setAuthentication', true);
    },
    offlogout({ commit }) {
      // 這裡可以放登出邏輯，成功後設定 isAuthenticated 為 false
      commit('setAuthentication', false);
    },
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
  },
});
