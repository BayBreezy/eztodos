<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="5">
        <Nav />
        <h2 class="text-h6 font-weight-bold red--text mb-5 mt-10">Tasks</h2>

        <div v-for="task in tasks" :key="task.id">
          <Task @Refresh="GetTasks" :task="task" />
        </div>
      </v-col>
    </v-row>
    <AddTask @Refresh="GetTasks" />
  </v-container>
</template>

<script>
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { firestore } from "~/plugins/firebase";
import { getMessaging, getToken } from "firebase/messaging";
export default {
  async mounted() {
    if ("Notification" in window) {
      // if (window.location.protocol != "https") return;
      if (Notification.permission !== "granted") {
        try {
          let a = await Notification.requestPermission();
          if (a !== "granted") return;
          const messaging = getMessaging();
          let token = await getToken(messaging, {
            vapidKey:
              "BE6RJEBvWV_B9qg7hNvbl9j-CpYP0Sn6U3wecRq3rlFWY2ksLAlsNK99NPZ_Znqp6s5fFOlXQ93I5yXFDNMpDJA",
          });
          if (!token) return;
          //store token in db
          await setDoc(
            doc(firestore, "users", this.$store.state.user.user.uid),
            {
              token: token,
            }
          );
        } catch (error) {
          console.log(error.message);
        }
      }
    }
  },
  data() {
    return {
      tasks: [],
    };
  },
  created() {
    this.GetTasks();
  },
  methods: {
    async GetTasks() {
      try {
        const q = query(
          collection(firestore, "tasks"),
          where("user", "==", this.$store.state.user.user.uid)
        );
        const snap = await getDocs(q);
        let tasks = [];
        snap.forEach((s) => tasks.push(s.data()));
        this.tasks = tasks;
      } catch (error) {
        console.log(error.message);
      }
    },
  },
};
</script>

<style></style>
