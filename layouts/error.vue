<template>
  <v-app dark>
    <v-container fluid class="error-container">
      <h1 v-if="error.statusCode === 404" class="error-title">
        {{ pageNotFound }}
      </h1>
      <h1 v-else class="error-title">
        {{ otherError }}
      </h1>
      <v-btn to="/" color="primary" class="home-button">Home page</v-btn>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.error-title {
  font-size: 32px;
  margin-bottom: 24px;
  text-align: center;
}

.home-button {
  text-decoration: none;
}
</style>
