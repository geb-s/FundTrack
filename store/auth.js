import { AuthService } from '@/services/AuthService';

export const state = () => ({
    isAuthenticated: false
});

export const mutations = {
    SET_AUTHENTICATED(state, value) {
        state.isAuthenticated = value;
    }
};

export const actions = {
    async validateToken({ commit }) {
        try {
            const apolloClient = this.app.apolloProvider.defaultClient
            // Make an API request to validate the token on the server
            const response = await AuthService.validateToken(apolloClient);


            // Assuming the response contains a "valid" property indicating token validity
            const isValidToken = response.validateToken === 'valid';

            if (isValidToken) {
                commit('SET_AUTHENTICATED', true);
            } else {
                commit('SET_AUTHENTICATED', false);
            }

            return isValidToken;
        } catch (error) {
            console.error('Token validation error:', error);
            throw error;
        }
    },

    removeToken({ commit }) {
        commit('SET_AUTHENTICATED', false);
        localStorage.removeItem('token');
    }
};
