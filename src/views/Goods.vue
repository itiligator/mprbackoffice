<template>
    <div>
        <v-divider></v-divider>
        <br>
        <v-data-table
                :headers="headers"
                :items="goods"
                :single-select="true"
                :search="search"
                item-key="item"
                no-data-text="Данные товаров не загружены"
                sort-by="name"
                locale="ru-RU"
                >
            <template v-slot:item.actions="{ item }">
                <v-icon
                        class="mr-2"
                        @click="editGood(goods.indexOf(item))"
                >
                    mdi-pencil
                </v-icon>
            </template>
            <template v-slot:item.active="{ item }">
                <v-icon> {{ okIcon(item.active) }} </v-icon>
            </template>
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Товары</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
<!--                    кнопочка Новый визит-->
                    <v-dialog v-model="editDialog" max-width="600px" persistent>
                        <v-card>
                            <v-card-title>
                                <span class="headline"> {{ editedGood.name }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <!-- ввод описания-->
                                    <v-textarea
                                            label="Описание товара"
                                            v-model="editedGood.description"
                                    ></v-textarea>
                                    <v-checkbox
                                    v-model='editedGood.active'
                                    label='Активен'
                                    ></v-checkbox>
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
                    <v-btn @click="downloadGoods">
                        <v-icon>mdi-update</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import {CommonMethods} from "@/mixins/CommonMethods";
    import {
        GOODS_DOWNLOAD_ALL_FROM_SERVER,
        GOODS_GET_ALL,
        GOODS_UPLOAD_ALL_TO_SERVER,
        GOODS_WRITE_ALL_TO_VUEX
    } from "@/store/actions/goods";

    export default {
        name: "Goods",
        mixins: [CommonMethods],
        mounted() {
            this.downloadGoods();
        },
        data() {
            return {
                editDialog: false,
                search: '',
                editedGoodIndex: -1,
                rules: {
                    required: value => !!value || 'Обязательное поле',
                },
                headers: [
                    {text: 'Артикул', value: 'item', align: 'start', sortable: true, filterable: true,},
                    {text: 'Наименование', value: 'name', align: 'start', sortable: true, filterable: true,},
                    {text: 'Описание', value: 'description', align: 'start', sortable: true, filterable: true,},
                    {text: 'Активность', value: 'active', align: 'start', sortable: true, filterable: true,},
                    {text: '', value: 'actions', align: 'start', sortable: false, filterable: false,},
                ],
                editedGood: {
                    item: null,
                    name: '',
                    description: '',
                    active: null,
                },
            };
        },
        computed: {
            goods() {
                return JSON.parse(JSON.stringify(this.$store.getters[GOODS_GET_ALL]));
            },
        },
        methods: {
            downloadGoods() {
                this.$store.dispatch(GOODS_DOWNLOAD_ALL_FROM_SERVER);
            },
            editGood (index) {
                this.editedGoodIndex = index;
                this.editedGood = Object.assign({}, this.goods[index]);
                this.editDialog = true;
            },

            close () {
                this.editDialog = false;
                this.editedGoodIndex = -1;
            },

            save () {
                this.goods[this.editedGoodIndex] = this.editedGood;
                this.$store.commit(GOODS_WRITE_ALL_TO_VUEX, this.goods);
                this.$store.dispatch(GOODS_UPLOAD_ALL_TO_SERVER).then(() =>  this.downloadGoods());
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