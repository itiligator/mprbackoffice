<template>
    <div>
        <v-divider></v-divider>
        <br>
        <v-data-table
                :headers="headers"
                :items="clients"
                :single-select="true"
                :search="search"
                item-key="inn"
                no-data-text="Данные клиентов не загружены"
                sort-by="name"
                locale="ru-RU"
                >
            <template v-slot:item.manager="{ item }">
                {{ managerByID(item.manager).fullName }}
            </template>
            <template v-slot:item.status="{ item }">
                <v-icon> {{ okIcon(item.status) }} </v-icon>
            </template>
            <template v-slot:item.dataBase="{ item }">
                {{ item.dataBase ? 'ПБК' : 'Тест' }}
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon
                        class="mr-2"
                        @click="editClient(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                        class="mr-2"
                        @click="deactivateClient(item)"
                >
                    mdi-account-remove
                </v-icon>
                <v-icon
                        class="mr-2"
                        @click="activateClient(item)"
                >
                    mdi-account-check
                </v-icon>
            </template>
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Клиенты</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
<!--                    кнопочка Новый визит-->
                    <v-dialog v-model="editDialog" max-width="840px" persistent>
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark v-on="on">Добавить клиента</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ editFormTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col lg="12">
                                            <!-- ввод наименования-->
                                            <v-text-field
                                                    label="Наименование"
                                                    :rules="[rules.required]"
                                                    v-model="editedClient.name"
                                            ></v-text-field>
<!--                                            ввод инн/кода-->
                                            <v-text-field
                                                    label="ИНН/Код"
                                                    :rules="[rules.required]"
                                                    v-model="editedClient.inn"
                                            ></v-text-field>
<!--                                            ввод типа клиента-->
                                            <v-combobox
                                                    :items="clientTypes"
                                                    v-model="editedClient.clientType"
                                                    label="Тип клиента"
                                            >
                                            </v-combobox>
                                            <!--ввод типа цены-->
                                            <v-combobox
                                                    :items="priceTypes"
                                                    v-model="editedClient.priceType"
                                                    label="Тип цены"
                                            >
                                            </v-combobox>

                                        </v-col>
                                    </v-row>
                                    {{ editedClient }}
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
                    <v-btn @click="downloadClients">
                        <v-icon>mdi-update</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import {
        VISITS_GET_ALL,
    } from "@/store/actions/visits";
    import {CommonMethods} from "@/mixins/CommonMethods";
    import {CLIENTS_DOWNLOAD_ALL_FROM_SERVER, CLIENTS_GET_ALL, CLIENTS_UPLOAD_TO_SERVER} from "@/store/actions/clients";
    import {MANAGERS_GET_ALL} from "@/store/actions/managers";

    export default {
        name: "Visits",
        mixins: [CommonMethods],
        mounted() {
            this.downloadClients();
        },
        data() {
            return {
                dateMenu: false,
                editDialog: false,
                search: '',
                editedINN: -1,
                date: new Date().toISOString().substr(0, 10),
                rules: {
                    required: value => !!value || 'Обязательное поле',
                    isPositiveInteger: value => value.isInteger() || 'Только целые положиьельные числа'
                },
                headers: [
                    {text: 'ИНН/Код', value: 'inn', align: 'start', sortable: true, filterable: true,},
                    {text: 'Наименование', value: 'name', align: 'start', sortable: true, filterable: true,},
                    {text: 'Тип клиента', value: 'clientType', align: 'start', sortable: true, filterable: true,},
                    {text: 'Тип цены', value: 'priceType', align: 'start', sortable: true, filterable: true,},
                    {text: 'Менеджер', value: 'manager', align: 'start', sortable: true, filterable: true,},
                    {text: 'Телефон', value: 'phone', align: 'start', sortable: true, filterable: true,},
                    {text: 'E-mail', value: 'email', align: 'start', sortable: true, filterable: true,},
                    {text: 'Лимит', value: 'limit', align: 'start', sortable: true, filterable: true,},
                    {text: 'Отсрочка', value: 'delay', align: 'start', sortable: true, filterable: true,},
                    {text: 'Статус', value: 'status', align: 'start', sortable: true, filterable: true,},
                    {text: 'БД', value: 'dataBase', align: 'start', sortable: true, filterable: true,},
                    {text: '', value: 'actions', align: 'start', sortable: true, filterable: true,},
                ],
                defaultClient: {
                    inn: '',
                    name: '',
                    clientType: '',
                    priceType: '',
                    manager: null,
                    phone: '',
                    email: '',
                    limit: 0,
                    delay: 0,
                    status: true,
                    dataBase: true,
                    authorizedManagersID: []
                },
                editedClient: {
                    inn: '',
                    name: '',
                    clientType: '',
                    priceType: '',
                    manager: null,
                    phone: '',
                    email: '',
                    limit: 0,
                    delay: 0,
                    status: true,
                    dataBase: true,
                    authorizedManagersID: []
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
                        manager: this.managerByID(visit.managerID).fullName,
                        author: this.managerByID(visit.author).fullName,
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
                return this.editedINN === -1 ? 'Новый клиент' : 'Редактировать клиента'
            },
            clients() {
              return this.$store.getters[CLIENTS_GET_ALL];
            },
            managers() {
                return this.$store.getters[MANAGERS_GET_ALL].filter((m) => m.role === 'MPR')
            },

            clientTypes () {
                return [... new Set(this.clients.map( (c) => c.clientType))]
            },

            priceTypes () {
                return [... new Set(this.clients.map( (c) => c.priceType))]
            },
        },
        methods: {
            downloadClients() {
                this.$store.dispatch(CLIENTS_DOWNLOAD_ALL_FROM_SERVER);
            },
            editClient (client) {
                this.editedINN = client.inn;
                this.editedClient = Object.assign({}, this.clientByINN(client.inn));
                this.editDialog = true;
            },
            deactivateClient (client) {
                confirm('Сделать клиента неактивным?') && this.$store.dispatch(CLIENTS_UPLOAD_TO_SERVER, {inn: client.inn, status: false}).then(() =>  this.downloadClients());
            },
            activateClient (client) {
                confirm('Сделать клиента активным?') && this.$store.dispatch(CLIENTS_UPLOAD_TO_SERVER, {inn: client.inn, status: true}).then(() =>  this.downloadClients());
            },

            close () {
                this.editDialog = false;
                this.$nextTick(() => {
                    this.editedClient = Object.assign({}, this.defaultClient);
                    this.editedINN = '';
                })
            },

            save () {
                if (this.editedClient.inn === '') {this.editedClient.inn = Math.round(1000 + Math.random() * 99000).toString()}
                this.$store.dispatch(CLIENTS_UPLOAD_TO_SERVER, this.editedClient).then(() =>  this.downloadClients());
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