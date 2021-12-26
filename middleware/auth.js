export default function ({ store, redirect, route }) {
  const user = store.state.user.user;
  if (!user && !(route.path == "/" || route.path === "/register")) {
    redirect("/");
  }
  if (user && (route.path == "/" || route.path === "/register")) {
    redirect("/d");
    store.commit("utils/Feedback", {
      show: true,
      color: "green",
      text: "Welcome back",
      icon: "mdi-check",
    });
  }
}
