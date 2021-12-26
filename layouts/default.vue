<template>
  <v-app>
    <v-main>
      <Nuxt />
    </v-main>
    <Loader />
    <Feedback />
  </v-app>
</template>
<script>
export default {
  middleware: "auth",
};
</script>
