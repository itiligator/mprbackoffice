import {CLIENTS_GET_BY_INN} from "@/store/actions/clients";
import {MANAGERS_GET_BY_ID} from "@/store/actions/managers";
import {GOODS_GET_BY_ITEM} from "@/store/actions/goods";
import {CHECKLISTQUESTIONS_GET_BY_UUID} from "@/store/actions/checklistQuestions";
import {VISITS_GET_BY_UUID} from "@/store/actions/visits";

export const CommonMethods = {
    methods: {
        clientByINN(inn) {
            return this.$store.getters[CLIENTS_GET_BY_INN](inn);
        },
        managerByID(ID) {
            return this.$store.getters[MANAGERS_GET_BY_ID](ID);
        },
        goodByItem(item) {
            return this.$store.getters[GOODS_GET_BY_ITEM](item);
        },
        checklistQuestionByUUID(UUID) {
            return this.$store.getters[CHECKLISTQUESTIONS_GET_BY_UUID](UUID);
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
        visitByUUID(UUID) {
            return this.$store.getters[VISITS_GET_BY_UUID](UUID);
        },
        managerRoleFromCode(role){
            switch (role) {
                case 'MPR': return 'МПР';
                case '1S': return '1С';
                case 'OFFICE': return 'Бэк-офис менеджер';
                default: return role;
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