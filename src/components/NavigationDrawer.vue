<template>
    <v-navigation-drawer permanent>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="title">
                    Application
                </v-list-item-title>
                <v-list-item-subtitle>
                    subtext
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list
                dense
                nav
        >
            <v-list-item>
                <v-list-item-icon>
                    <v-icon></v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>Item title</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    export default {
        name: "NavigationDrawer"
    }
</script>

<style scoped>

</style>