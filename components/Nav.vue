<template>
  <v-app-bar flat color="white" class="py-2">
    <v-btn @click="$router.push('/d')" icon v-if="showBack">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-btn
      nuxt
      to="/p"
      width="47"
      height="47"
      depressed
      fab
      color="primary"
      :class="showBack ? '' : 'ml-n3'"
    >
      <v-avatar size="45">
        <v-img
          v-if="$store.state.user.user.image"
          :src="$store.state.user.user.image"
        ></v-img>
        <v-icon v-else> mdi-account </v-icon>
      </v-avatar>
    </v-btn>
    <v-spacer />
    <v-btn @click="logout" depressed icon>
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { auth } from "~/plugins/firebase";
import { signOut } from "firebase/auth";
export default {
  props: {
    showBack: Boolean,
  },
  methods: {
    async logout() {
      await signOut(auth);
      this.$cookies.remove("ezUser");
      this.$router.go(0);
    },
  },
};
</script>

<style></style>
