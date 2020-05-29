import {CLIENTS_GET_BY_INN} from "@/store/actions/clients";
import {MANAGERS_GET_BY_ID} from "@/store/actions/managers";

export const CommonMethods = {
    methods: {
        clientByINN(inn) {
            return this.$store.getters[CLIENTS_GET_BY_INN](inn);
        },
        managerByID(ID) {
            return this.$store.getters[MANAGERS_GET_BY_ID](ID);
        },
        visitStatusFromCode(status){
            switch (status) {
                case 0: return 'Запланирован';
                case 2: return 'Окончен';
                case 1: return 'В процессе';
                case -1: return 'Аннулирован';
                case -2: return 'Отменен';
                default: return status;
            }
        },
        okIcon(bool) {
            return bool ? 'mdi-checkbox-marked-circle' : '';
        },
        delay(ms) {
            return  new Promise(res => setTimeout(res, ms));
        },
    },
}