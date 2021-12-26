<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="5">
        <Nav :showBack="true" />
        <v-avatar color="primary" size="200" class="d-block mx-auto my-10">
          <v-img
            v-if="$store.state.user.user.image"
            :src="$store.state.user.user.image"
          ></v-img>
          <v-icon size="40" dark v-else> mdi-account </v-icon>
        </v-avatar>
        <div class="text-center">
          <v-btn @click="$refs.hiddenInput.click()" small depressed
            >Change Image</v-btn
          >
        </div>
        <v-form
          ref="form"
          lazy-validation
          @submit.prevent="updateUser"
          class="mt-7"
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                :rules="[rules.required, rules.email]"
                outlined
                label="Email"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <p>Change Password</p>
              <v-text-field
                v-model="newPassword"
                outlined
                label="New Password"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn
                type="submit"
                block
                min-height="45"
                color="primary"
                class="text-capitalize"
                depressed
              >
                Update
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <!-- Hidden input -->
    <input
      type="file"
      hidden
      accept=".jpeg, .png, .jpg"
      @change="coverChange"
      @click="(e) => (e.target.value = '')"
      ref="hiddenInput"
    />
  </v-container>
</template>

<script>
import { storage, auth } from "~/plugins/firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import FormMix from "~/mixins/FormMixinx";
export default {
  mixins: [FormMix],
  mounted() {
    this.email = this.$store.state.user.user.email;
  },
  data() {
    return {
      email: null,
      newPassword: null,
    };
  },
  methods: {
    async updateUser() {
      if (!this.$refs.form.validate()) return;
      try {
        if (this.email && this.email != this.$store.state.user.user.email) {
          await updateEmail(auth.currentUser, this.email);
          this.UpdateUserAccount(auth.currentUser);
          this.$store.commit("utils/Feedback", {
            text: "Email updated",
            show: true,
            icon: "mdi-check",
            color: "green darken-1",
          });
        }
        if (this.newPassword && this.newPassword.length > 6) {
          await updatePassword(auth.currentUser, this.newPassword);

          this.$store.commit("utils/Feedback", {
            text: "Password updated",
            show: true,
            icon: "mdi-check",
            color: "green darken-1",
          });
          this.newPassword = null;
        }
      } catch (error) {
        console.log(error.message);
        if (error.message == "Firebase: Error (auth/requires-recent-login).") {
          this.$store.commit("utils/Feedback", {
            text: "Please log in to update email/password",
            show: true,
            icon: "mdi-alert",
            color: "blue darken-3",
            time: -1,
          });
          this.$cookies.remove("ezUser");
          this.$store.commit("user/SetUser", null);
          this.$router.push("/");
          return;
        }
        this.$store.commit("utils/Feedback", {
          text: error.message,
          show: true,
          icon: "mdi-alert",
          color: "red darken-3",
        });
      }
    },
    /**
     * Method used to display image and update store
     */
    async coverChange(e) {
      const image = e.target.files[0];
      if (!image) return;
      if (!this.validateImage(image)) return;
      //Create image ref
      const imageref = ref(
        storage,
        `users/${this.$store.state.user.user.uid}.jpg`
      );
      try {
        this.$store.commit("utils/Set_Overlay", true);
        //Delete old image if one is there
        if (this.$store.state.user.user.image) {
          await deleteObject(imageref);
        }
        //Upload to FB
        const snap = await uploadBytes(imageref, image);
        const imageUrl = await getDownloadURL(snap.ref);

        //Store image on user
        await updateProfile(auth.currentUser, {
          photoURL: imageUrl,
        });

        this.UpdateUserAccount(auth.currentUser);
        this.$store.commit("utils/Set_Overlay", false);
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        console.log(error);
      }
    },
    async UpdateUserAccount(user) {
      //set the cookie again
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
    },
    /**
     * Method used to check if image is valid
     */
    validateImage(image) {
      if (!image.type.match("image")) {
        this.$store.commit("utils/Feedback", {
          text: "Only images accepted.",
          show: true,
          icon: "mdi-alert",
          color: "blue darken-3",
        });
        return false;
      }
      //check image size
      if (image.size > 10000000) {
        this.$store.commit("utils/Feedback", {
          text: "Image too large",
          show: true,
          icon: "mdi-alert",
          color: "red",
        });
        return false;
      }
      return true;
    },
  },
};
</script>

<style></style>
