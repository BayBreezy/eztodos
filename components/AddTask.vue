<template>
  <div>
    <v-dialog
      :fullscreen="$vuetify.breakpoint.smAndDown"
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" fab fixed bottom right v-bind="attrs" v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="el align-center pa-5">
          New Task <v-spacer />
          <v-btn @click="dialog = false" x-small icon>
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-container>
          <v-form class="mt-7" @submit.prevent="create" ref="form">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model.trim="name"
                  :rules="[rules.required]"
                  outlined
                  label="Task Name * "
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.trim="due_date"
                  :rules="[rules.required]"
                  type="date"
                  outlined
                  label="Due Date"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-combobox
                  v-model="tags"
                  small-chips
                  deletable-chips
                  outlined
                  multiple
                  label="Tags"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          Press <kbd>enter</kbd> to create a tag
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-combobox>
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
                  Create
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "~/plugins/firebase";
import FormMix from "~/mixins/FormMixinx";
export default {
  mixins: [FormMix],
  data() {
    return {
      dialog: false,
      name: null,
      due_date: null,
      tags: [],
    };
  },
  methods: {
    async create() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        const taskRef = doc(collection(firestore, "tasks"));
        await setDoc(taskRef, {
          name: this.name,
          due_date: this.due_date,
          tags: this.tags,
          id: taskRef.id,
          created_at: serverTimestamp(),
          user: this.$store.state.user.user.uid,
        });
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Feedback", {
          show: true,
          color: "green darken-2",
          text: "Task added",
          icon: "mdi-check",
        });
        this.dialog = false;
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        this.$emit("Refresh");
      } catch (error) {
        this.$store.commit("utils/Set_Overlay", false);
        console.log(error);
      }
    },
  },
};
</script>

<style></style>
