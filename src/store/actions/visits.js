export const VISIT_DOWNLOAD_ALL_FROM_SERVER = 'VISIT_DOWNLOAD_ALL_FROM_SERVER'; // загружает


// /* eslint-disable */
// // /* eslint-disable max-len */
// // геттеры
// export const VISIT_GET_PLANNED = 'VISIT_GET_PLANNED'; // геттер массива всех запланированных визитов
// export const VISIT_GET_FINISHED = 'VISIT_GET_FINISHED'; // геттер массива всех заверешнных визитов
// export const VISIT_GET_CURRENT = 'VISIT_GET_CURRENT'; // геттер текущего визита
// export const VISIT_IS_CURRENT = 'VISIT_IS_CURRENT'; // состояние текущего визита
// export const VISIT_GET_HISTORY_BY_INN = 'VISIT_GET_HISTORY_BY_INN'; // геттер объекта исторических визитов (ключи - UUID)
//
//
// // действия
// export const VISIT_DOWNLOAD_ALL_FROM_SERVER = 'VISIT_DOWNLOAD_ALL_FROM_SERVER'; // перезаписывает
// // массивы завершенных и запланированных визитов путем вызова VISIT_DOWNLOAD_PLANNED_FROM_SERVER
// // и VISIT_DOWNLOAD_FINISHED_FROM_SERVER
//
// export const VISIT_DOWNLOAD_PLANNED_FROM_SERVER = 'VISIT_DOWNLOAD_PLANNED_FROM_SERVER'; // получает
// // и перезаписывает в хранилище данные запланированных визитов
//
// export const VISIT_DOWNLOAD_FINISHED_FROM_SERVER = 'VISIT_DOWNLOAD_FINISHED_FROM_SERVER';
// // получает и перезаписывает в хранилище данные завершенных визитов
//
// export const VISIT_DOWNLOAD_HISTORY_BY_INN_FROM_SERVER = 'VISIT_DOWNLOAD_HISTORY_BY_INN_FROM_SERVER';
// // получает и перезаписывает в хранилище данные исторических визитов по ИНН клиента
//
// export const VISIT_UPLOAD_CURRENT_TO_SERVER = 'VISIT_UPLOAD_CURRENT_TO_SERVER';// отправляет данные
// // текущего визита на сервер и обновляет завершенные визиты данными текущего визита
//
// export const VISIT_SAVE_CURRENT_TO_VUEX = 'VISIT_SAVE_CURRENT_TO_VUEX'; // сохранение данных текущего
// // визита в хранилище
//
// export const VISIT_CLOSE_CURRENT = 'VISIT_CLOSE_CURRENT'; // завершает текущий визит,
// // отправляет данные на сервер, переносит данные в завершенные визиты и обнуляет текущий визит
//
//
// // мутации
// export const VISIT_ERROR = 'VISIT_ERROR'; // пишет ошибку в state.visitStatus
//
// export const VISIT_WRITE_CURRENT_TO_VUEX = 'VISIT_WRITE_CURRENT_TO_VUEX'; // сохранение данных текущего
// // визита в хранилище
//
// export const VISIT_WRITE_PLANNED_TO_VUEX = 'VISIT_WRITE_PLANNED_TO_VUEX'; // перезаписывает массив
// // запланированных визитов в хранилище переданными данными
//
// export const VISIT_WRITE_FINISHED_TO_VUEX = 'VISIT_WRITE_FINISHED_TO_VUEX'; // перезаписывает массив
// // завершенных визитов в хранилище переданными данными
//
// export const VISIT_CLOSE_AND_REPLACE_CURRENT = 'VISIT_CLOSE_AND_REPLACE_CURRENT'; // переносит
// // данные текущего визита в завершенные и обнуляет данные текущего визита
//
// export const VISIT_WRITE_HISTORY_TO_VUEX_BY_INN = 'VISIT_WRITE_HISTORY_TO_VUEX_BY_INN';
// // добавляет по ключу-ИНН в объект исторических массивов переданный массив
//
// export const VISIT_FLASH_ALL = 'VISIT_FLASH_ALL'; // обнуляет все данные всех визитов
