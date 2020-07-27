<template>
  <div>
    <h1>Сброс данных на сервере</h1>
  </div>
</template>

<script>
import { HTTP } from '@/utils/http';

export default {
  name: 'Reset',
  components: {
  },
  data: function() {
return {
      message: '',
      isError: false,
      points: {
          visits: {point: 'resetvisits', successMessage: 'Визиты, чеклисты, заказы и фото успешно удалены с сервера'},
      },
  };
},
  methods: {
      resetVisits({point, successMessage}) {
          this.message = '';
          this.isError = false;
          HTTP.get(point)
          .then(() => {
              this.message = successMessage;
         })
          .catch(function (error) {
              this.isError = true;
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              this.message = error.response.data;
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              this.message = 'Нет ответа от сервера';
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              this.message = 'Ошибка запроса';
              console.log('Error', error.message);
            }
            console.log(error.config);
          });
      },
  },
}
</script>
