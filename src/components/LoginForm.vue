<template>
  <div>
    <form class="login" @submit.prevent="login">
      <h1>Авторизация</h1>
      <br>
      <label>Имя пользователя</label>
      <input required v-model="username" type="text" placeholder="Snoopy" />
      <label>Пароль</label>
      <input
        required
        v-model="password"
        type="password"
        placeholder="Password"
      />
      <p></p>
      <br>
      <button type="submit">Войти</button>
    </form>
  </div>
</template>

<style>
  .login {
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 10px;
    margin-left: auto;
    margin-right: auto;
  }

  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>

<script>
import { AUTH_REQUEST } from '@/store/actions/auth';


export default {
  name: 'login',
  data() {
    return {
      username: 'office',
      password: 'rohozecoffice',
    };
  },
  methods: {
    login() {
      const { username, password } = this;
      this.$store.dispatch(AUTH_REQUEST, { username, password }).then(() => {
        window.location.replace('/');
      });
    },
  },
};
</script>
