<template>
  <v-container class="fill-height">
    <v-row align="center">
      <v-col cols="12" md="4">
        <h1 class="text-h3 font-weight-bold primary--text mb-5">Ez ToDos</h1>
        <p class="text-body-2 mb-15">Get the damn thing done</p>
        <v-form ref="form" lazy-validation @submit.prevent="register">
          <v-row>
            <v-col cols="12">
              <v-text-field
                :rules="[rules.required]"
                outlined
                v-model="email"
                placeholder="Email"
                type="email"
                prepend-inner-icon="mdi-email-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                outlined
                :rules="[rules.required]"
                placeholder="Password"
                v-model="password"
                type="password"
                prepend-inner-icon="mdi-form-textbox-password"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn type="submit" block color="primary" min-height="50"
                >Register</v-btn
              >
              <p
                @click="$router.push('/')"
                class="primary--text mt-5 pointer text-body-2"
              >
                Have an account?
                <span class="text-decoration-underline">Login</span>
              </p>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-spacer />
      <v-col v-if="$vuetify.breakpoint.mdAndUp" md="7">
        <v-img src="/todo.svg"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormMix from "~/mixins/FormMixinx";
import { auth, firestore } from "~/plugins/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
export default {
  mixins: [FormMix],
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    async register() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        let { user } = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        let obj = {
          uid: user.uid,
          displayName: user.displayName,
          image: user.photoURL,
          email: user.email,
        };
        this.$store.commit("user/SetUser", JSON.parse(JSON.stringify(obj)));
        this.$cookies.set("ezUser", JSON.stringify(obj), {
          maxAge: 2592000,
        });
        this.$router.push("/d");
        this.$store.commit("utils/Set_Overlay", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Feedback", {
          show: true,
          color: "red darken-2",
          text: error.message,
          icon: "mdi-alert",
        });
        console.log(error.message);
      }
    },
  },
};
</script>

<style></style>
