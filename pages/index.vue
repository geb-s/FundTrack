<template>
  <div class="landing-page">
    <div class="hero-section">
      <h1>Welcome to FundTrack</h1>
      <p>Discover the power of managing your finances with ease.</p>
    </div>
    <div class="cta-buttons">
      <nuxt-link to="/login">
        <v-btn class="cta-button">
          Login
        </v-btn>
      </nuxt-link>
      <nuxt-link to="/register">
        <v-btn class="cta-button">
          Register
        </v-btn>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index'
};
</script>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.hero-section {
  text-align: center;
  margin-bottom: 2rem;
}

.hero-section h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.hero-section p {
  font-size: 1.2rem;
  color: #777;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.cta-button {
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  color: #fff;
  background-color: #007bff;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #0056b3;
}

</style>