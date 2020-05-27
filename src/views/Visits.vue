<template>
    <div>
        <v-data-table
                :headers="headers"
                :items="allVisits"
                :single-select="true"
                item-key="UUID"
                >
        </v-data-table>
    {{ allVisits }}
    </div>
</template>

<script>
    import {VISITS_DOWNLOAD_FROM_SERVER_BY_DATE, VISITS_GET_ALL} from "@/store/actions/visits";
    import {CLIENTS_GET_BY_INN} from "@/store/actions/clients";

    export default {
        name: "Visits",
        mounted() {
            this.$store.dispatch(VISITS_DOWNLOAD_FROM_SERVER_BY_DATE, this.date);
        },
        data() {
            return {
                date: new Date().toISOString().slice(0, 10),
                headers: [
                    // {text: 'UUID', value: 'UUID', align: 'start', sortable: false, filterable: false,},
                    {text: '№', value: 'id', align: 'start', sortable: true, filterable: true,},
                    {text: 'Клиент', value: 'client', align: 'start', sortable: true, filterable: true,},
                    {text: 'Менеджер', value: 'manager', align: 'start', sortable: true, filterable: true,},
                    {text: 'Статус', value: 'status', align: 'start', sortable: true, filterable: true,},
                    {text: 'Оплата', value: 'payment', align: 'start', sortable: true, filterable: true,},
                    {text: 'Оплата план.', value: 'paymentPlan', align: 'start', sortable: true, filterable: true,},
                ],
            };
        },
        computed: {
            allVisits() {
                return this.$store.getters[VISITS_GET_ALL].map((visit) => {
                    return {
                        UUID: visit.UUID,
                        id: visit.id,
                        client: this.clientByINN(visit.clientINN).name,
                        manager: visit.managerID,
                        author: visit.author,
                        status: visit.status,
                        processed: visit.processed,
                        invoice: visit.invoice,
                        date: visit.date,
                        payment: visit.payment,
                        paymentPlan: visit.paymentPlan,
                        dataBase: visit.dataBase
                    }
                });
            },
        },
        methods: {
            clientByINN(inn) {
                return this.$store.getters[CLIENTS_GET_BY_INN](inn);
            },
        },
    }
</script>

<style scoped>

</style>