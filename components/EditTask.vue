<template>
  <div>
    <v-dialog
      :fullscreen="$vuetify.breakpoint.smAndDown"
      v-model="dialog"
      width="500"
    >
      <v-card v-if="task">
        <v-card-title class="el align-center pa-5">
          Edit Task <v-spacer />
          <v-btn @click="dialog = false" x-small icon>
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-container>
          <v-form class="mt-7" @submit.prevent="create" ref="form">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model.trim="task.name"
                  :rules="[rules.required]"
                  outlined
                  label="Task Name * "
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.trim="task.due_date"
                  :rules="[rules.required]"
                  type="date"
                  outlined
                  label="Due Date"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-combobox
                  v-model="task.tags"
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
                  Update
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
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "~/plugins/firebase";
import FormMix from "~/mixins/FormMixinx";
export default {
  mixins: [FormMix],
  props: {
    task: Object,
    show: Boolean,
  },
  computed: {
    dialog: {
      get() {
        return this.show;
      },
      set(v) {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        this.$emit("CloseEdit");
      },
    },
  },
  methods: {
    async create() {
      if (!this.$refs.form.validate()) return;
      try {
        this.$store.commit("utils/Set_Overlay", true);
        const taskRef = doc(firestore, "tasks", this.task.id);
        await updateDoc(taskRef, {
          ...this.task,
          updated_at: serverTimestamp(),
        });
        this.$store.commit("utils/Set_Overlay", false);
        this.$store.commit("utils/Feedback", {
          show: true,
          color: "green darken-2",
          text: "Task updated",
          icon: "mdi-check",
        });
        this.dialog = false;
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
