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
                <v-icon v-if="item.status"
                        class="mr-2"
                        @click="deactivateClient(item)"
                >
                    mdi-account-remove
                </v-icon>
                <v-icon v-else
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
                    <v-dialog v-model="editDialog" max-width="600px" persistent>
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark v-on="on">Добавить магазин</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ editFormTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                            <!-- ввод наименования-->
                                            <v-text-field
                                                    label="Наименование"
                                                    :rules="[rules.required]"
                                                    v-model="editedClient.name"
                                            ></v-text-field>
                                            <v-autocomplete
                                                    :items="managers"
                                                    v-model="editedClient.manager"
                                                    item-text="fullName"
                                                    item-value="ID"
                                                    label="Менеджер"
                                                    no-data-text="Нет результатов"
                                            >
                                            </v-autocomplete>
<!--                                            ввод телефона-->
                                            <v-text-field
                                                    label="Телефон"
                                                    v-model="editedClient.phone"
                                            ></v-text-field>


                                            <!--                                            ввод адреса-->
                                            <v-text-field
                                                    label="Адрес"
                                                    v-model="editedClient.address"
                                            ></v-text-field>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field
                                                        label="Долгота"
                                                        v-model="editedClient.longitude"
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col>
                                                    <v-text-field
                                                        label="Широта"
                                                        v-model="editedClient.latitude"
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>

<!--                                    панелька допуска менеджеров-->
                                    <v-expansion-panels>
                                        <v-expansion-panel>
                                            <v-expansion-panel-header>Допуск менеджеров</v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <div v-for="manager in managers" :key="manager.ID">
                                                    <v-switch v-model="editedClient.authorizedManagersID" :label="manager.fullName" :value="manager.ID"></v-switch>
                                                </div>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
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
    import {CommonMethods} from "@/mixins/CommonMethods";
    import {CLIENTS_DOWNLOAD_ALL_FROM_SERVER, CLIENTS_GET_ALL, CLIENTS_UPLOAD_TO_SERVER} from "@/store/actions/clients";
    import {MANAGERS_GET_ALL} from "@/store/actions/managers";

    export default {
        name: "Clients",
        mixins: [CommonMethods],
        mounted() {
            this.downloadClients();
        },
        data() {
            return {
                dateMenu: false,
                editDialog: false,
                search: '',
                isNewClient: true,
                date: new Date().toISOString().substr(0, 10),
                rules: {
                    required: value => !!value || 'Обязательное поле',
                },
                headers: [
                    {text: 'Наименование', value: 'name', align: 'start', sortable: true, filterable: true,},
                    {text: 'Адрес', value: 'address', align: 'start', sortable: true, filterable: true,},
                    {text: 'Менеджер', value: 'manager', align: 'start', sortable: true, filterable: true,},
                    {text: 'Телефон', value: 'phone', align: 'start', sortable: true, filterable: true,},
                    {text: 'Статус', value: 'status', align: 'start', sortable: true, filterable: true,},
                    {text: '', value: 'actions', align: 'start', sortable: false, filterable: false,},
                ],
                defaultClient: {
                    inn: null,
                    name: null,
                    clientType: 'Магазин',
                    priceType: 'Магазин',
                    manager: null,
                    phone: '',
                    address: '',
                    email: '',
                    limit: 0,
                    delay: 0,
                    status: true,
                    dataBase: true,
                    authorizedManagersID: [],
                    longitude: '',
                    latitude: ''
                },
                editedClient: {
                    inn: null,
                    name: null,
                    clientType: 'Магазин',
                    priceType: 'Магазин',
                    manager: null,
                    phone: '',
                    address: '',
                    email: '',
                    limit: 0,
                    delay: 0,
                    status: true,
                    dataBase: true,
                    authorizedManagersID: [],
                    longitude: '',
                    latitude: ''
                },
            };
        },
        computed: {
            editFormTitle () {
                return this.isNewClient ? 'Новый магазин' : 'Редактировать данные магазина'
            },
            clients() {
              return this.$store.getters[CLIENTS_GET_ALL].filter((c) => c.clientType === 'Магазин');
            },
            managers() {
                return this.$store.getters[MANAGERS_GET_ALL].filter((m) => m.role === 'MPR')
            },
        },
        methods: {
            downloadClients() {
                this.$store.dispatch(CLIENTS_DOWNLOAD_ALL_FROM_SERVER);
            },
            editClient (client) {
                this.isNewClient = false;
                this.editedClient = Object.assign({}, this.clientByINN(client.inn));
                this.editDialog = true;
            },
            deactivateClient (client) {
                confirm('Сделать магазин неактивным?') && this.$store.dispatch(CLIENTS_UPLOAD_TO_SERVER, {inn: client.inn, status: false}).then(() =>  this.downloadClients());
            },
            activateClient (client) {
                confirm('Сделать магазин активным?') && this.$store.dispatch(CLIENTS_UPLOAD_TO_SERVER, {inn: client.inn, status: true}).then(() =>  this.downloadClients());
            },

            close () {
                this.editDialog = false;
                this.$nextTick(() => {
                    this.editedClient = Object.assign({}, this.defaultClient);
                    this.isNewClient = true;
                })
            },

            save () {
                if (this.editedClient.inn === null) {this.editedClient.inn = Math.round(1000 + Math.random() * 999000).toString()}
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