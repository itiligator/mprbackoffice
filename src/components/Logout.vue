<template>
<h1>Выход из системы</h1>
</template>

<script>
import { AUTH_LOGOUT } from '@/store/actions/auth';

export default {
  name: 'Logout',
  created() {
    this.$store.dispatch(AUTH_LOGOUT);
    window.location.replace('/login');
  },
};

</script>

<style scoped>

</style>
