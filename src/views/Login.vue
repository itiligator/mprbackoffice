<template>
  <v-container
          class="fill-height"
          fluid
  >
    <v-row
            align="center"
            justify="center"
    >
      <v-col class="text-center">
  <LoginForm></LoginForm>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';

export default {
  name: 'Login',
  components: { LoginForm },
};
</script>

<style scoped>

</style>
