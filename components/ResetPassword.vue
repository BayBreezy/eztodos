<template>
  <div>
    <v-dialog
      max-width="350"
      persistent
      v-model="dialog"
      transition="scroll-y-transition"
    >
      <v-card class="pa-5">
        <v-btn
          @click="dialog = false"
          fab
          depressed
          x-small
          absolute
          style="top: 10px; right: 10px;"
        >
          <v-icon color="red" x-small>mdi-close</v-icon>
        </v-btn>
        <v-card-title
          class="justify-center mb-2 font-weight-bold text-md-body-1"
          >Update Password</v-card-title
        >
        <v-card-text class="pa-0 text-caption mb-3">
          Enter the email address associated with your account. The password
          reset link will be sent there.
        </v-card-text>
        <v-form ref="resetForm" @submit.prevent="SendResetPasswordEmail">
          <v-row>
            <v-col cols="12">
              <label class="text-body-2">Email</label>
              <v-text-field
                color="grey"
                class="mt-2"
                type="email"
                solo
                v-model.trim="email"
                :rules="[rules.required, rules.email]"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn
                depressed
                block
                type="submit"
                min-height="44"
                color="primary"
                min-width="130"
                >Submit</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FormMix from "~/mixins/FormMixinx";
export default {
  mixins: [FormMix],
  props: ["show"],
  data() {
    return {
      email: null
    };
  },
  computed: {
    dialog: {
      get() {
        return this.show || false;
      },
      set(v) {
        this.$refs.resetForm.reset();
        this.$refs.resetForm.resetValidation();
        this.$emit("CloseReset", v);
      }
    }
  },
  methods: {
    async SendResetPasswordEmail() {
      if (!this.$refs.resetForm.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        await this.$strapi.forgotPassword({ email: this.email });
        this.$store.commit("utils/Feedback", {
          text: "Please check your email for the password reset link.",
          color: "success",
          icon: "mdi-check-all",
          show: true
        });
        this.$store.commit("utils/Set_Overlay", false);
        this.dialog = false;
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        this.$errorText(error);
        console.log(error.response);
      }
    }
  }
};
</script>

<style></style>
