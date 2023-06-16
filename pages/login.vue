<template>
    <div class="login-page">
        <div class="login-container">
            <h1>Login</h1>
            <form @submit.prevent="login" class="login-form">
                <v-text-field v-model="email" label="Email" required></v-text-field>
                <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                <v-alert v-if="error" type="error">{{ error }}</v-alert>
                <v-btn type="submit" class="login-button" :disabled="loading">
                    <template v-if="loading">
                        <v-progress-circular indeterminate color="white"></v-progress-circular>
                    </template>
                    <template v-else>
                        Login
                    </template>
                </v-btn>
            </form>
        </div>
    </div>
</template>
  
<script>
import { AuthService } from '@/services/AuthService';

export default {
    data() {
        return {
            email: '',
            password: '',
            loading: false,
            error: ''
        };
    },
    methods: {
        async login() {
            this.loading = true;
            this.error = '';

            try {
                await AuthService.login(this.email, this.password, this.$apollo, this.$router);
            } catch (error) {
                this.error = 'Login failed. Please check your credentials and try again.';
                console.error('Login failed:', error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>
  
<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}

.login-container {
    width: 30rem;
    padding: 2rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-container h1 {
    text-align: center;
    margin-bottom: 1.5rem;
}

.login-form .form-group {
    margin-bottom: 1.5rem;
}

.login-button {
    display: block;
    width: 100%;
    padding: 0.8rem;
    font-weight: bold;
    text-align: center;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.login-button:hover {
    background-color: #0056b3;
}
</style>
