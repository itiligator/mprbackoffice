<template>
    <div id="app">
        <v-app id="inspire">
            <v-app id="inspire">
                <v-navigation-drawer v-model="drawer" app :expand-on-hover="true" v-if="isAuthenticated">
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
};
</script>
