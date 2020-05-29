/* eslint-disable no-param-reassign */
import { HTTP } from '@/utils/http';
import {
    MANAGERS_DOWNLOAD_ALL_FROM_SERVER, MANAGERS_ERROR,
    MANAGERS_GET_ALL, MANAGERS_GET_BY_ID,
    MANAGERS_WRITE_ALL_TO_VUEX
} from "@/store/actions/managers";

class Manager {
    constructor(firstName, lastName, ID, role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.ID = ID;
        this.role = role;
        this.fullName = firstName + ' ' + lastName;
    }
}

const state = {
    managers: [],
    managersStatus: '',
};

const getters = {
    [MANAGERS_GET_ALL]: (s) => s.managers,
    [MANAGERS_GET_BY_ID]: (s) => (ID) => {
        const searchResult = s.managers.find((m) => m.ID === ID);
        if (typeof searchResult !== 'undefined') { return searchResult; }
        return new Manager(ID, '', ID, '');
    },
};


const actions = {
    [MANAGERS_DOWNLOAD_ALL_FROM_SERVER]:
        ({ commit }) => new Promise((resolve, reject) => {
            HTTP.get(`users`)
                .then((response) => {
                    commit(MANAGERS_WRITE_ALL_TO_VUEX, response.data);
                    resolve(response);
                })
                .catch((err) => {
                    commit(MANAGERS_ERROR, err);
                    reject(err);
                });
        }),
};

// мутации

const mutations = {
    [MANAGERS_ERROR]: (s) => { s.managersStatus = 'error'; },
    [MANAGERS_WRITE_ALL_TO_VUEX]: (s, managersData) => { s.managers = managersData.map((m) =>{
    return new Manager(m.firstName, m.lastName, m.ID, m.role)}
    );},
};


export default {
    state,
    getters,
    actions,
    mutations,
};
