<template>
  <v-card class="el mb-7">
    <div v-if="task.complete" class="ribbon ribbon-top-right">
      <span class="el green lighten-2 white--text">Done</span>
    </div>
    <v-card-title class="font-weight-bold"> {{ task.name }} </v-card-title>
    <v-card-text>
      <p class="mb-0">
        Created:
        {{ $dayjs.unix(task.created_at.seconds).format("MMM D, YYYY") }}
      </p>
      <p class="mb-1">Due: {{ $dayjs(task.due_date).format("MMM D, YYYY") }}</p>
      <v-chip-group>
        <v-chip
          v-for="(tag, i) in task.tags"
          :key="`${task.name}-tag${i}`"
          small
          label
          class="red--text"
          color="primary lighten-5"
          >{{ tag }}</v-chip
        >
      </v-chip-group>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        @click="setEdit"
        small
        depressed
        class="text-capitalize"
        tile
        text
        color="primary"
        ><v-icon x-small left>mdi-pencil</v-icon> Edit</v-btn
      >
      <v-btn
        @click="markComplete"
        small
        depressed
        class="text-capitalize"
        tile
        v-if="!task.complete"
        text
        color="green"
        ><v-icon x-small left>mdi-check</v-icon>Done</v-btn
      >
      <v-btn
        @click="markComplete"
        small
        depressed
        class="text-capitalize"
        tile
        v-if="task.complete"
        text
        ><v-icon x-small left>mdi-close</v-icon>Not Done</v-btn
      >
      <v-btn
        @click="deleteTask"
        small
        depressed
        class="text-capitalize"
        tile
        text
        color="red"
        ><v-icon x-small left>mdi-delete</v-icon>Remove</v-btn
      >
    </v-card-actions>
    <EditTask
      @Refresh="$emit('Refresh')"
      :show="showEdit"
      :task="editItem"
      @CloseEdit="showEdit = false"
    />
  </v-card>
</template>

<script>
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "~/plugins/firebase";
export default {
  props: {
    task: Object,
  },
  data() {
    return {
      showEdit: false,
      editItem: null,
    };
  },
  methods: {
    setEdit() {
      this.editItem = JSON.parse(JSON.stringify(this.task));
      this.showEdit = true;
    },
    async markComplete() {
      this.task.complete
        ? (this.task.complete = false)
        : (this.task.complete = true);
      await this.saveTask();
    },
    async saveTask() {
      try {
        const taskRef = doc(firestore, "tasks", this.task.id);
        await updateDoc(taskRef, this.task);
        this.$store.commit("utils/Feedback", {
          show: true,
          color: "green darken-2",
          text: "Task updated",
          icon: "mdi-check",
        });
        this.$emit("Refresh");
      } catch (error) {
        console.log(error);
      }
    },
    async deleteTask() {
      try {
        const taskRef = doc(firestore, "tasks", this.task.id);
        await deleteDoc(taskRef);
        this.$store.commit("utils/Feedback", {
          show: true,
          color: "green darken-2",
          text: "Task removed",
          icon: "mdi-check",
        });
        this.$emit("Refresh");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style></style>
