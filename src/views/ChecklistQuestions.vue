<template>
    <div>
        <v-divider></v-divider>
        <br>
        <v-data-table
                :headers="headers"
                :items="checklistQuestions"
                :single-select="true"
                :search="search"
                item-key="UUID"
                no-data-text="Список вопросов не загружен"
                sort-by="text"
                locale="ru-RU"
                >
            <template v-slot:item.active="{ item }">
                <v-icon> {{ okIcon(item.active) }} </v-icon>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon
                        class="mr-2"
                        @click="editChecklistQuestion(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon v-if="item.active"
                        class="mr-2"
                        @click="deactivateChecklistQuestion(item)"
                >
                    mdi-checkbox-marked-outline
                </v-icon>
                <v-icon v-else
                        class="mr-2"
                        @click="activateChecklistQuestion(item)"
                >
                    mdi-checkbox-blank-outline
                </v-icon>
            </template>
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Вопросы чек-листов</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
<!--                    кнопочка Новый визит-->
                    <v-dialog v-model="editDialog" max-width="600px" persistent>
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark v-on="on">Добавить вопрос</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ editFormTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                            <!-- ввод наименования-->
                                            <v-textarea
                                                    solo
                                                    label="Текст"
                                                    :rules="[rules.required]"
                                                    v-model="editedChecklistQuestion.text"
                                            ></v-textarea>
                                        <v-row>
                                            <v-col>
                                        <v-radio-group
                                          :disabled="editedChecklistQuestion.clientType === 'Магазин'"
                                          v-model="editedChecklistQuestion.section"
                                          label="Секция чеклиста"
                                        >
                                          <v-radio label="Кеги" value="Кеги"></v-radio>
                                          <v-radio label="Цены" value="Цены"></v-radio>
                                        </v-radio-group>
                                        </v-col>
                                        <v-col>
                                        <v-switch
                                        v-model="editedChecklistQuestion.clientType"
                                        false-value="Не магазин"
                                        true-value="Магазин"
                                        label='Вопрос для магазина'></v-switch>
                                        </v-col>
                                        </v-row>
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
                    <v-btn @click="downloadChecklistQuestion">
                        <v-icon>mdi-update</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import {CommonMethods} from "@/mixins/CommonMethods";
    import {CLIENTS_GET_ALL} from "@/store/actions/clients";
    import {
        CHECKLISTQUESTIONS_DOWNLOAD_ALL_FROM_SERVER, CHECKLISTQUESTIONS_GET_ALL,
        CHECKLISTQUESTIONS_UPLOAD_TO_SERVER
    } from "@/store/actions/checklistQuestions";

    export default {
        name: "ChecklistQuestion",
        mixins: [CommonMethods],
        mounted() {
            this.downloadChecklistQuestion();
        },
        data() {
            return {
                editDialog: false,
                search: '',
                isNewChecklistQuestion: true,
                rules: {
                    required: value => !!value || 'Обязательное поле',
                },
                headers: [
                    {text: 'Текст вопроса', value: 'text', align: 'start', sortable: true, filterable: true,},
                    {text: 'Секция чеклиста', value: 'section', align: 'start', sortable: true, filterable: true,},
                    {text: 'Тип клиента', value: 'clientType', align: 'start', sortable: true, filterable: true,},
                    // {text: 'Статус', value: 'active', align: 'start', sortable: true, filterable: true,},
                    {text: '', value: 'actions', align: 'start', sortable: false, filterable: false,},
                ],
                defaultChecklistQuestion: {
                    UUID: null,
                    text: '',
                    section: 'Кеги',
                    clientType: 'Не магазин',
                    active: true
                },
                editedChecklistQuestion: {
                    UUID: null,
                    text: '',
                    section: 'Кеги',
                    clientType: 'Не магазин',
                    active: true
                },
            };
        },
        computed: {
            editFormTitle () {
                return this.isNewChecklistQuestion ? 'Новый вопрос' : 'Редактировать вопрос'
            },
            clients() {
              return this.$store.getters[CLIENTS_GET_ALL];
            },
            checklistQuestions() {
                return this.$store.getters[CHECKLISTQUESTIONS_GET_ALL];
            },
            clientTypes () {
                return [... new Set(this.clients.map((c) => c.clientType))]
            },
            sections () {
                return [... new Set(this.checklistQuestions.map((c) => c.section))]
            },
        },
        methods: {
            downloadChecklistQuestion() {
                this.$store.dispatch(CHECKLISTQUESTIONS_DOWNLOAD_ALL_FROM_SERVER);
            },
            editChecklistQuestion (checklistQuestion) {
                this.isNewChecklistQuestion = false;
                this.editedChecklistQuestion = Object.assign({}, this.checklistQuestionByUUID(checklistQuestion.UUID));
                this.editDialog = true;
            },
            deactivateChecklistQuestion (checklistQuestion) {
                let nchl = JSON.parse(JSON.stringify(checklistQuestion));
                nchl.active = false;
                this.$store.dispatch(CHECKLISTQUESTIONS_UPLOAD_TO_SERVER, nchl).then(() =>  this.downloadChecklistQuestion());
            },
            activateChecklistQuestion (checklistQuestion) {
                let nchl = JSON.parse(JSON.stringify(checklistQuestion));
                nchl.active = true;
                this.$store.dispatch(CHECKLISTQUESTIONS_UPLOAD_TO_SERVER, nchl).then(() =>  this.downloadChecklistQuestion());
            },

            close () {
                this.editDialog = false;
                this.$nextTick(() => {
                    this.editedChecklistQuestion = Object.assign({}, this.defaultChecklistQuestion);
                    this.isNewChecklistQuestion = true;
                })
            },

            save () {
                if (this.editedChecklistQuestion.clientType === 'Магазин') {
                    this.editedChecklistQuestion.section = 'Общий'
                }
                this.$store.dispatch(CHECKLISTQUESTIONS_UPLOAD_TO_SERVER, this.editedChecklistQuestion).then(() =>  this.downloadChecklistQuestion());
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

<style>

</style>