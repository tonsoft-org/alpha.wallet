import {AUTH_LOGIN} from '../actions.type'

const state = () => ({
    data: {},
    status: '',
});

const getters = {
    getAuthUserId: (state) => { return state?.data?.id ?? null; },
    getAuthUser: (state) => { return state?.data ?? null; },
};

const actions = {};

const mutations = {
    [AUTH_LOGIN] : (state, data) => {
        state.data = data;
    },
};

export default {
    actions,
    mutations,
    getters,
    state
}
