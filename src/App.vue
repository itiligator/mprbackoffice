<template>
    <div id="app">
        <v-app id="inspire">
            <v-app id="inspire">
                <v-navigation-drawer permanent app :expand-on-hover="true" v-if="isAuthenticated">
                    <v-list nav>
                            <v-list-item
                                    v-for="link of links"
                                    :key="link.title"
                                    :to="link.url"

                            >
                                <v-list-item-icon>
                                    <v-icon>{{ link.icon }}</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title v-text="link.title"></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                </v-navigation-drawer>

                <v-content>
                    <router-view></router-view>
                </v-content>
            </v-app>
        </v-app>
    </div>
</template>

<script>

import {CLIENTS_DOWNLOAD_ALL_FROM_SERVER} from "@/store/actions/clients";
import {MANAGERS_DOWNLOAD_ALL_FROM_SERVER} from "@/store/actions/managers";

export default {
  name: 'App',

  components: {
  },
    computed: {
      isAuthenticated() {
          return this.$store.getters['isAuthenticated'];
      },
    },

    props: {
        source: String,
    },

    data: () => ({
        links: [
            {title: 'Главная', icon: 'mdi-bookmark-outline', url: '/'},
            {title: 'Визиты', icon: 'mdi-bookmark-outline', url: '/visits'},
            {title: 'Клиенты', icon: 'mdi-face', url: '/clients'},
            {title: 'Выйти из системы', icon: 'mdi-lock', url: '/logout'},
        ]
    }),

    mounted() {
        this.$store.dispatch(CLIENTS_DOWNLOAD_ALL_FROM_SERVER);
        this.$store.dispatch(MANAGERS_DOWNLOAD_ALL_FROM_SERVER);
    },
};
</script>
