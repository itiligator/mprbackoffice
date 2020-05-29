// геттеры
export const VISITS_GET_ALL = 'VISITS_GET_ALL'; // отдает все визиты из хранилища
export const VISITS_GET_BY_UUID = 'VISITS_GET_BY_UUID'; // отдает все визиты из хранилища
export const VISITS_IS_LOADING = 'VISITS_IS_LOADING'; // отдает true если status===loading
export const VISITS_IS_ERROR = 'VISITS_IS_ERROR'; // отдает true если status===error
export const VISITS_IS_SUCCESS = 'VISITS_IS_SUCCESS'; // отдает true если status===error

// действия
export const VISITS_DOWNLOAD_FROM_SERVER_BY_DATE = 'VISITS_DOWNLOAD_FROM_SERVER_BY_DATE'; // загружает выборку для
// диапазона дат с сервера и полностью перезаписывает хранилище

export const VISITS_UPLOAD_TO_SERVER = 'VISITS_UPLOAD_TO_SERVER';// отправляет данные визита на сервер


// мутации
export const VISITS_ERROR = 'VISITS_ERROR'; // пишет ошибку в state.visitStatus
export const VISITS_LOADING = 'VISITS_LOADING'; // пишет 'loading' в state.visitStatus
export const VISITS_SUCCESS = 'VISITS_SUCCESS'; // пишет 'success' в state.visitStatus
export const VISITS_WRITE_TO_VUEX = 'VISITS_WRITE_TO_VUEX'; // записывает переданные визиты в хранилище


// статусы
export const VISITS_ERROR_STATUS = 'error';
export const VISITS_LOADING_STATUS = 'loading';
export const VISITS_SUCCESS_STATUS = 'success';