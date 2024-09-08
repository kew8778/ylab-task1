'use strict';

// получаем элементы формы
const form = document.querySelector('.login-form');
const inpEmail = form.querySelector('.login-form__email');
const inpPassword = form.querySelector('.login-form__password');
const error = form.querySelector('.login-form__error');
const btn = form.querySelector('.login-form__btn');

// привязываем к кнопке обработчик клика
btn.addEventListener('click', async () => {
  // вывод ошибок при некоректно-заполненных полях
  showError(inpEmail.value, inpPassword.value);
  if (error.textContent) {
    return;
  }

  // имитация запроса на сервер
  // в ответе сервера объект с лог-значениями введенных данных в формате json
  // {email: false, password: false}
  const response = await checkData(new FormData(form));
  const res = await JSON.parse(response);

  // обрабатываем полученные данные
  if ( !(res.email) ) {
    error.textContent = 'Пользователь с таким email не найден';
  } else if ( !(res.password) ) {
    error.textContent = 'Пароль неверный';
  } else {
    // при верных данных что-то делаем
    // пока просто сообщим об успешной авторизации
    alert('Успешная авторизация');
  }
});

// вывод ошибок при некоретно-заполненных полях
function showError(email, password) {
  if ( !(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) ) {
    error.textContent = 'Вы некорректно ввели email';
    return;
  } else if (email.length >= 256 || email.length <= 6) {
    error.textContent = 'Неверная длина email';
    return;
  } else if ( (/\s/.test(password)) ) {
    error.textContent = 'Некоректный пароль';
    return;
  } else if (password.length >= 20 || password.length <= 4) {
    error.textContent = 'Неверная длина пароля';
    return;
  } else {
    return;
  }
}

// проверка введённых данных в БД
async function checkData(form) {
  const email = form.get('email');
  const password = form.get('password');

  const responce = await fetch('./user.json');
  const users = await responce.json();

  return JSON.stringify({email: email in users, password: password === users[email]});
}

// скрытие текста ошибки при фокусе на поля ввода
;(function removeError() {
  inpEmail.addEventListener('focus', () => error.textContent = '');
  inpPassword.addEventListener('focus', () => error.textContent = '');
})();
