'use strict';

// получаем элементы формы
let form = document.querySelector('.login-form');
let inpEmail = form.querySelector('.login-form__email');
let inpPassword = form.querySelector('.login-form__password');
let inpMemory = form.querySelector('.login-form__memory');
let error = form.querySelector('.login-form__error');
let btn = form.querySelector('.login-form__btn');

// привязываем к кнопке обработчик клика
btn.addEventListener('click', async () => {  
    let email = inpEmail.value; // введённый email

    // если введённый email не валидный, выводим сообщение об этом
    if ( isValidEmail(email) === false ) {
        error.textContent = 'Вы некорректно ввели email';
        return;
    }

    // имитация fetch-запроса на сервер
    // в ответе сервера объект с лог-значениями введенных данных в формате json
    // {email: false, password: false}
    let response = await isValidData(new FormData(form));

    let res = JSON.parse(response);

    // обрабатываем полученные данные
    if ( !(res.email) ) {
        error.textContent = 'Пользователь с таким email не найден';
    } else if ( !(res.password) ) {
        error.textContent = 'Пароль неверный';
    } else {
        // при верных данных что-то делаем
        // пока просто сообщим об успешной авторизации
        alert('Успешная авторизация');

        // если при этом было нажато "запомнить меня на 24 часа" ...
        if (inpMemory.checked) {
            // ... занесём email юзера и текущеее время в локальное хранилище
            // не знаю где мы авторизуемся (тодолист или крипто-биржа), может это не безопасно )
            rememberUser(email);
        }
    }
});

// проверка корректности введённого email
function isValidEmail(email) {
    // регулярка с авторитетного MDN (странная какая-то, нужно переделать)
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
}

// запрос на сервер
function isValidData(form) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let email = form.get('email');
            let password = form.get('password');

            // допустим в ответе сервера такой объект с лог-значениями введенных данных
            let responce = {
                email: false,
                password: false,
            };

            // проверяем введённые данные в БД, корректируем лог-значения объекта responce
            if (email in users) {
                responce.email = true;

                if (password === users[email]) {
                    responce.password = true;
                }
            }

            // сервер возвращает данные в json
            resolve(JSON.stringify(responce));
        }, 100)
    });
}

// таблица пользователей в БД ('email': 'password')
const users = {
    'user-1@mail.ru': '12345',
    'user-2@mail.ru': '',
    'user-3@mail.ru': 'abcde',
};

// записываем пользователя в хранилище
function rememberUser(email) {
    let currentTime = Date.now(); // текуща отметка времени

    // записываем в хранилище время авторизации и emal пользователя
	localStorage.setItem('time', currentTime);
    localStorage.setItem('email', email);

    // при следующей загрузке страницы проверим пройденное время от момента авторизации юзером,
    // и, или сразу его авторизуем и загрузим необходимые данные, или попросим авторизоваться заново
    // но так как у нас форма авторизации на странице, будем считать, что время вышло
}

// функции по умолчанию
// убираем текст ошибки при фокусе на поля ввода
;(function removeError() {
    inpEmail.addEventListener('focus', () => error.textContent = '');
    inpPassword.addEventListener('focus', () => error.textContent = '');
})();

// перемещаем фокус по инпутам по нажатии enter и стрелок
;(function addEventKey() {
    inpEmail.addEventListener('keydown', (event) => {
        if (event.code === 'Enter' || event.code === 'ArrowDown') {
            inpPassword.focus();
        }
    });

    inpPassword.addEventListener('keydown', (event) => {
        if (event.code === 'Enter' || event.code === 'ArrowDown') {
            inpMemory.focus();
        } else if (event.code === 'ArrowUp') {
            event.preventDefault(); // без него фокус ставится в начало инпута, а не в конец текста (не разобрался)
            inpEmail.focus();
        }
    });

    inpMemory.addEventListener('keydown', (event) => {
        if (event.code === 'Enter') {
            inpMemory.click();
        } else if (event.code === 'ArrowUp') {
            event.preventDefault();
            inpPassword.focus();
        } else if (event.code === 'ArrowDown') {
            btn.focus();
        }
    });

    btn.addEventListener('keydown', (event) => {
        if (event.code === 'Enter') {
            btn.click();
        } else if (event.code === 'ArrowUp') {
            inpMemory.focus();
        }
    });
})();


// tasks:
// добавить кнопку "востановить пароль"
