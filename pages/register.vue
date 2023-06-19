<template>
    <div class="register-page">
        <div class="register-container">
            <h1>Register</h1>
            <form @submit.prevent="register" class="register-form">
                <v-text-field v-model="name" label="Name" required></v-text-field>
                <v-text-field v-model="email" label="Email" required></v-text-field>
                <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                <v-text-field v-model="confirmPassword" label="Confirm Password" type="password" required></v-text-field>
                <v-alert v-if="error" type="error">{{ error }}</v-alert>
                <v-btn type="submit" class="register-button" :disabled="loading">
                    <template v-if="loading">
                        <v-progress-circular indeterminate color="white"></v-progress-circular>
                    </template>
                    <template v-else>
                        Register
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
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            error: '',
            loading: false
        };
    },
    methods: {
        async register() {

            if (!this.name) {
                this.error = "Please enter a name."
                return false;
            }

            if (!this.email) {
                this.error = "Please enter an email.";
                return false;
            }

            if (!this.password) {
                this.error = 'Missing Password'
            }

            if (this.password && this.password.length < 6) {
                this.error = "Password should be at least 6 characters long.";
                return false;
            }

            if (this.password !== this.confirmPassword) {
                this.error = 'Password and confirm password do not match';
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) {
                this.error = "Please enter a valid email.";
                return false;
            }

            this.loading = true;

            try {
                await AuthService.register(this.name, this.email, this.password, this.$apollo, this.$router);
            } catch (error) {
                this.error = 'Registration failed. Please try again.';
                console.error('Registration failed:', error);
            }

            this.loading = false;
        }
    }
};
</script>

<style scoped>
.register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}

.register-container {
    width: 30rem;
    padding: 2rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.register-button {
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

.register-button:hover {
    background-color: #0056b3;
}

.register-container h1 {
    text-align: center;
    margin-bottom: 1.5rem;
}

.register-form .form-group {
    margin-bottom: 1.5rem;
}
</style>
