<template>
    <div>
        <v-divider></v-divider>
        <br>
        <v-data-table
                :headers="headers"
                :items="allVisits"
                :single-select="true"
                :search="search"
                item-key="UUID"
                >
            <template v-slot:item.invoice="{ item }">
                <v-icon> {{ okIcon(item.invoice) }} </v-icon>
            </template>
            <template v-slot:item.processed="{ item }">
                <v-icon> {{ okIcon(item.processed) }} </v-icon>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon
                        small
                        class="mr-2"
                        @click="editVisit(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                        small
                        @click="cancelVisit(item)"
                >
                    mdi-delete
                </v-icon>
            </template>
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Визиты</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
<!--                    кнопочка Новый визит-->
                    <v-dialog v-model="editDialog" max-width="500px" persistent>
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark v-on="on">Добавить визит</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ editFormTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
<!--                                ввод клиента-->
                                    <v-autocomplete
                                    :items="clients"
                                    v-model="editedVisit.clientINN"
                                    item-text="name"
                                    item-value="inn"
                                    label="Клиент"
                                    clearable
                                    no-data-text="Нет результатов"
                                    >
                                    </v-autocomplete>
                                    <v-autocomplete
                                            :items="clients"
                                            v-model="editedVisit.clientINN"
                                            item-text="name"
                                            item-value="inn"
                                            label="Клиент"
                                            clearable
                                            no-data-text="Нет результатов"
                                    >
                                    </v-autocomplete>
                                    {{ editedVisit }}
                                    <!--                                    <v-row>-->
                                    <!--                                        <v-col cols="12" sm="6" md="4">-->
                                    <!--                                            <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>-->
                                    <!--                                        </v-col>-->
                                    <!--                                        <v-col cols="12" sm="6" md="4">-->
                                    <!--                                            <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>-->
                                    <!--                                        </v-col>-->
                                    <!--                                        <v-col cols="12" sm="6" md="4">-->
                                    <!--                                            <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>-->
                                    <!--                                        </v-col>-->
                                    <!--                                        <v-col cols="12" sm="6" md="4">-->
                                    <!--                                            <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>-->
                                    <!--                                        </v-col>-->
                                    <!--                                        <v-col cols="12" sm="6" md="4">-->
                                    <!--                                            <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>-->
                                    <!--                                        </v-col>-->
                                    <!--                                    </v-row>-->
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Отменить</v-btn>
                                <v-btn color="blue darken-1" text @click="save">Сохранить</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-spacer></v-spacer>
<!--                    менюшка выбора крайней даты-->
                    <v-menu
                        v-model="dateMenu"
                        :close-on-content-click="true"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                                v-model="date"
                                label="Крайняя дата"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-on="on"
                                class="shrink"
                                offset-y
                                :nudge-right="40"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                            v-model="date"
                            @input="downloadVisits"
                            first-day-of-week="1"
                            no-title
                            scrollable
                            locale="ru"
                    ></v-date-picker>
                </v-menu>
<!--                    <v-spacer></v-spacer>-->
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
<!--                    стока поиска-->
                    <v-text-field
                        v-model="search"
                        label="Поиск"
                ></v-text-field>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
<!--                    кнопочка обновить-->
                    <v-btn @click="downloadVisits">
                        <v-icon>mdi-update</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import {
        VISITS_DOWNLOAD_FROM_SERVER_BY_DATE,
        VISITS_GET_ALL,
        VISITS_GET_BY_UUID,
        VISITS_UPLOAD_TO_SERVER
    } from "@/store/actions/visits";
    import {CommonMethods} from "@/mixins/CommonMethods";
    import { uuid } from 'vue-uuid';
    import {CLIENTS_GET_ALL} from "@/store/actions/clients";

    export default {
        name: "Visits",
        mixins: [CommonMethods],
        mounted() {
            this.downloadVisits();
        },
        data() {
            return {
                dateMenu: false,
                editDialog: false,
                search: '',
                editedUUID: -1,
                date: new Date().toISOString().substr(0, 10),
                headers: [
                    // {text: 'UUID', value: 'UUID', align: 'start', sortable: false, filterable: false,},
                    {text: '№', value: 'id', align: 'start', sortable: true, filterable: true,},
                    {text: 'Дата', value: 'date', align: 'start', sortable: true, filterable: true,},
                    {text: 'Клиент', value: 'client', align: 'start', sortable: true, filterable: true,},
                    {text: 'Менеджер', value: 'manager', align: 'start', sortable: true, filterable: true,},
                    {text: 'Статус', value: 'status', align: 'start', sortable: true, filterable: true,},
                    {text: 'Оплата', value: 'payment', align: 'start', sortable: true, filterable: true,},
                    {text: 'Оплата план.', value: 'paymentPlan', align: 'start', sortable: true, filterable: true,},
                    {text: 'ПКО', value: 'invoice', align: 'start', sortable: true, filterable: true,},
                    {text: 'Доставка', value: 'processed', align: 'start', sortable: true, filterable: true,},
                    {text: 'Автор', value: 'author', align: 'start', sortable: true, filterable: true,},
                    {text: 'БД', value: 'dataBase', align: 'start', sortable: true, filterable: true,},
                    {text: 'Actions', value: 'actions', sortable: false},
                ],
                defaultVisit: {
                    UUID: -1,
                    id: null,
                    orders: null,
                    payment: null,
                    date: null,
                    dataBase: true,
                    clientINN: "",
                    processed: false,
                    invoice: false,
                    status: 0,
                    managerID: '700',
                    author: null,
                },
                editedVisit: {
                    UUID: -1,
                    id: null,
                    orders: null,
                    payment: null,
                    date: null,
                    dataBase: true,
                    clientINN: "",
                    processed: false,
                    invoice: false,
                    status: 0,
                    managerID: '700',
                    author: null,
                },
            };
        },
        computed: {
            allVisits() {
                return this.$store.getters[VISITS_GET_ALL].map((visit) => {
                    return {
                        UUID: visit.UUID,
                        id: visit.id,
                        client: this.clientByINN(visit.clientINN).name,
                        manager: this.managerByID(visit.managerID).fullName(),
                        author: this.managerByID(visit.author).fullName(),
                        status: this.visitStatusFromCode(visit.status),
                        processed: visit.processed,
                        invoice: visit.invoice,
                        date: visit.date,
                        payment: visit.payment,
                        paymentPlan: visit.paymentPlan,
                        dataBase: visit.dataBase ? 'ПБК' : 'ТЕСТ',
                    }
                });
            },
            editFormTitle () {
                return this.editedUUID === -1 ? 'Новый визит' : 'Редактировать визит'
            },
            clients() {
              return this.$store.getters[CLIENTS_GET_ALL];
            },
        },
        methods: {
            downloadVisits() {
                this.dateMenu = false;
                this.$store.dispatch(VISITS_DOWNLOAD_FROM_SERVER_BY_DATE, this.date);
            },
            editVisit (visit) {
                this.editedUUID = visit.UUID;
                this.editedVisit = Object.assign({}, this.$store.getters[VISITS_GET_BY_UUID](visit.UUID));
                this.editDialog = true;
            },

            cancelVisit (visit) {
                const cvisit = this.$store.getters[VISITS_GET_BY_UUID](visit.UUID);
                let nstatus = -1;
                switch (cvisit.status) {
                    case 0:
                        nstatus = -2;
                        break;
                    case 2:
                        nstatus = -1;
                        break;
                    default: return;
                }
                confirm('Отменить визит?') && this.$store.dispatch(VISITS_UPLOAD_TO_SERVER, {UUID: visit.UUID, status: nstatus});
                this.delay(1500);
                this.downloadVisits();
            },

            close () {
                this.editDialog = false;
                this.$nextTick(() => {
                    this.editedVisit = Object.assign({}, this.defaultVisit)
                    this.editedUUID = -1
                })
            },

            save () {
                if (this.editedVisit.UUID === -1) {this.editedVisit.UUID = uuid.v4()}
                this.$store.dispatch(VISITS_UPLOAD_TO_SERVER, this.editedVisit);
                this.delay(500);
                this.downloadVisits();
                this.close()
            },
        },
        watch: {
            editDialog (val) {
                val || this.close();
            },
        },
    }
</script>

<style scoped>

</style>