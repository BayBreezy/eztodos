export const actions = {
  async nuxtServerInit({ commit }, { app }) {
    const user = app.$cookies.get("ezUser");
    if (user) {
      commit("user/SetUser", JSON.parse(JSON.stringify(user)));
    }
  },
};
