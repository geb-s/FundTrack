import { AuthService } from '@/services/AuthService';

export const state = () => ({
    message: '',
    color: 'error',
    show: false,
});

export const mutations = {
    SET_SNACKBAR(state, payload) {
        state.message = payload.message;
        state.color = payload.color;
        state.show = true;
    },
    HIDE_SNACKBAR(state) {
        state.show = false;
    },
};

export const actions = {
    showSnackbarError({ commit }, message) {
        commit('SET_SNACKBAR', { message, color: 'error' });
    },
    hideSnackbar({ commit }) {
        commit('HIDE_SNACKBAR');
    },
};
