// Ждем загрузки DOM
GStime.ready(function() {
    // Функция для отображения результата
    function showResult(selector, content) {
        $(selector).html(content);
    }

    // Демонстрация навигации по секциям
    $('.menu li').on('click', function() {
        const section = $(this).attr('data-section');
        $('section').hide();
        $(`#${section}`).show();
    });

    // Показываем первую секцию по умолчанию
    $('section').hide();
    $('#selectors').show();

    // =============================================
    // Демонстрация селекторов
    // =============================================
    
    // Выбор по ID
    $('#select-by-id').on('click', function() {
        const el = $('#box1');
        showResult('#selector-result', 'Выбран элемент по ID: ' + el.html());
    });
    
    // Выбор по классу
    $('#select-by-class').on('click', function() {
        const el = $('.blue');
        showResult('#selector-result', 'Выбрано элементов по классу: ' + el.elements.length);
    });
    
    // Выбор по тегу
    $('#select-by-tag').on('click', function() {
        const el = $('div');
        showResult('#selector-result', 'Выбрано div элементов: ' + el.elements.length);
    });
    
    // Комбинированный селектор
    $('#select-combined').on('click', function() {
        const el = $('.box.yellow');
        showResult('#selector-result', 'Выбрано элементов с классами box и yellow: ' + el.elements.length);
    });

    // =============================================
    // Демонстрация манипуляции DOM
    // =============================================
    
    // Изменить HTML
    $('#change-html').on('click', function() {
        $('#content-block').html('<strong>Измененное содержимое</strong> через .html()');
        showResult('#dom-result', 'HTML изменен');
    });
    
    // Добавить содержимое
    $('#append-content').on('click', function() {
        $('#content-block').append('<div>Добавленный контент через .append()</div>');
        showResult('#dom-result', 'Контент добавлен в конец');
    });
    
    // Вставить в начало
    $('#prepend-content').on('click', function() {
        $('#content-block').prepend('<div>Вставленный контент через .prepend()</div>');
        showResult('#dom-result', 'Контент добавлен в начало');
    });
    
    // Создать элемент
    $('#create-element').on('click', function() {
        const newElement = $('<div class="box green">Новый</div>');
        $('#dom-container').append(newElement.elements[0].outerHTML);
        showResult('#dom-result', 'Элемент создан и добавлен');
    });
    
    // Клонировать элемент
    $('#clone-element').on('click', function() {
        const original = $('#attr-box');
        const clone = original.clone();
        clone.html('Клон');
        $('#dom-container').append(clone.elements[0].outerHTML);
        showResult('#dom-result', 'Элемент клонирован');
    });
    
    // Удалить элемент
    $('#remove-element').on('click', function() {
        const elementsCount = $('#dom-container .box').elements.length;
        if (elementsCount > 0) {
            $('#dom-container .box').remove();
            showResult('#dom-result', 'Элементы удалены: ' + elementsCount);
        } else {
            showResult('#dom-result', 'Нет элементов для удаления');
        }
    });
    
    // Работа с классами и атрибутами
    $('#add-class').on('click', function() {
        $('#attr-box').addClass('blue');
        showResult('#dom-result', 'Класс "blue" добавлен');
    });
    
    $('#remove-class').on('click', function() {
        $('#attr-box').removeClass('blue');
        showResult('#dom-result', 'Класс "blue" удален');
    });
    
    $('#toggle-class').on('click', function() {
        $('#attr-box').toggleClass('yellow');
        showResult('#dom-result', 'Класс "yellow" переключен');
    });
    
    $('#check-class').on('click', function() {
        const hasClass = $('#attr-box').hasClass('yellow');
        showResult('#dom-result', 'Наличие класса "yellow": ' + hasClass);
    });
    
    $('#set-attr').on('click', function() {
        $('#attr-box').attr('data-test', 'example-value');
        showResult('#dom-result', 'Атрибут data-test установлен');
    });
    
    $('#get-attr').on('click', function() {
        const attr = $('#attr-box').attr('data-test');
        showResult('#dom-result', 'Значение атрибута data-test: ' + attr);
    });
    
    $('#remove-attr').on('click', function() {
        $('#attr-box').removeAttr('data-test');
        showResult('#dom-result', 'Атрибут data-test удален');
    });

    // =============================================
    // Демонстрация событий
    // =============================================
    
    // Простой обработчик события
    $('#click-btn').on('click', function() {
        showResult('#event-result', 'Кнопка нажата! ' + new Date().toLocaleTimeString());
    });
    
    // Событие наведения
    $('#hover-area').on('mouseenter', function() {
        $(this).css('background-color', '#3498db');
        $(this).css('color', 'white');
    });
    
    $('#hover-area').on('mouseleave', function() {
        $(this).css('background-color', '#ecf0f1');
        $(this).css('color', 'inherit');
    });
    
    // Делегирование событий
    $('#delegation-container').on('click', '.delegated-button', function() {
        showResult('#event-result', 'Нажата делегированная кнопка: ' + $(this).html());
    });
    
    // Добавление динамической кнопки
    $('#add-button').on('click', function() {
        const buttonsCount = $('#delegation-container .delegated-button').elements.length;
        $('#delegation-container').append(`<button class="delegated-button">Новая кнопка ${buttonsCount + 1}</button>`);
        showResult('#event-result', 'Добавлена новая кнопка');
    });

    // =============================================
    // Демонстрация анимаций
    // =============================================
    
    // Fade эффекты
    $('#fade-in').on('click', function() {
        $('#fade-box').fadeIn(500);
    });
    
    $('#fade-out').on('click', function() {
        $('#fade-box').fadeOut(500);
    });
    
    // Slide эффекты
    $('#slide-down').on('click', function() {
        $('#slide-box').slideDown(500);
    });
    
    $('#slide-up').on('click', function() {
        $('#slide-box').slideUp(500);
    });
    
    $('#slide-toggle').on('click', function() {
        $('#slide-box').slideToggle(500);
    });
    
    // Анимация свойств
    $('#animate-size').on('click', function() {
        $('#animate-box').css({
            width: '100px',
            height: '100px',
            left: '0px',
            top: '0px'
        });
        
        $('#animate-box').animate({
            width: '200px',
            height: '150px'
        }, 1000);
    });
    
    $('#animate-position').on('click', function() {
        $('#animate-box').css({
            width: '100px',
            height: '100px',
            left: '0px',
            top: '0px'
        });
        
        $('#animate-box').animate({
            left: '200px',
            top: '50px'
        }, 1000);
    });
    
    // Анимация цветов
    $('#animate-color').on('click', function() {
        const colors = [
            '#3498db', // синий
            '#e74c3c', // красный
            '#2ecc71', // зеленый
            '#f39c12', // оранжевый
            '#9b59b6'  // фиолетовый
        ];
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        $('#color-box').colorAnimate({
            backgroundColor: randomColor
        }, 1000);
    });

    // =============================================
    // Демонстрация AJAX
    // =============================================
    
    // GET запрос
    $('#ajax-get').on('click', function() {
        $('#ajax-loader').show();
        $('#ajax-message').removeClass('success error').addClass('hidden').html('');
        
        GStime.get('https://jsonplaceholder.typicode.com/posts/1')
            .then(function(data) {
                $('#ajax-message')
                    .removeClass('hidden')
                    .addClass('success')
                    .html('Запрос выполнен успешно');
                    
                $('#ajax-result').html(JSON.stringify(data, null, 2));
            })
            .catch(function(error) {
                $('#ajax-message')
                    .removeClass('hidden')
                    .addClass('error')
                    .html('Ошибка: ' + error.message);
                    
                $('#ajax-result').html('');
            })
            .finally(function() {
                $('#ajax-loader').hide();
            });
    });
    
    // POST запрос
    $('#post-form').on('submit', function(e) {
        e.preventDefault();
        
        $('#ajax-loader').show();
        $('#ajax-message').removeClass('success error').addClass('hidden').html('');
        
        const postData = {
            title: $('#title').val(),
            body: $('#body').val(),
            userId: parseInt($('#userId').val())
        };
        
        GStime.post('https://jsonplaceholder.typicode.com/posts', postData)
            .then(function(data) {
                $('#ajax-message')
                    .removeClass('hidden')
                    .addClass('success')
                    .html('Запрос выполнен успешно');
                    
                $('#ajax-result').html(JSON.stringify(data, null, 2));
            })
            .catch(function(error) {
                $('#ajax-message')
                    .removeClass('hidden')
                    .addClass('error')
                    .html('Ошибка: ' + error.message);
                    
                $('#ajax-result').html('');
            })
            .finally(function() {
                $('#ajax-loader').hide();
            });
    });
    
    // Расширенные настройки AJAX
    $('#ajax-advanced').on('click', function() {
        $('#ajax-loader').show();
        $('#ajax-message').removeClass('success error').addClass('hidden').html('');
        
        GStime.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'GET',
            timeout: 2000,
            beforeSend: function() {
                $('#ajax-message')
                    .removeClass('hidden')
                    .addClass('success')
                    .html('Запрос отправляется...');
                return true; // продолжить выполнение запроса
            }
        })
        .then(function(data) {
            $('#ajax-message')
                .removeClass('hidden')
                .addClass('success')
                .html('Запрос выполнен успешно, получено записей: ' + data.length);
                
            $('#ajax-result').html(JSON.stringify(data.slice(0, 5), null, 2));
        })
        .catch(function(error) {
            $('#ajax-message')
                .removeClass('hidden')
                .addClass('error')
                .html('Ошибка: ' + error.message);
                
            $('#ajax-result').html('');
        })
        .finally(function() {
            $('#ajax-loader').hide();
        });
    });

    // =============================================
    // Демонстрация утилит
    // =============================================
    
    // GStime.each - Обход коллекции
    $('#each-demo').on('click', function() {
        const arr = [1, 2, 3, 4, 5];
        let result = 'GStime.each демонстрация:\n';
        
        GStime.each(arr, function(index, value) {
            result += `Элемент #${index}: ${value}\n`;
        });
        
        const obj = {name: 'John', age: 30, city: 'New York'};
        result += '\nОбход объекта:\n';
        
        GStime.each(obj, function(key, value) {
            result += `${key}: ${value}\n`;
        });
        
        showResult('#utils-result', result);
    });
    
    // GStime.map - Преобразование коллекции
    $('#map-demo').on('click', function() {
        const arr = [1, 2, 3, 4, 5];
        
        const doubled = GStime.map(arr, function(index, value) {
            return value * 2;
        });
        
        let result = 'GStime.map демонстрация:\n';
        result += `Исходный массив: ${arr.join(', ')}\n`;
        result += `Удвоенный массив: ${doubled.join(', ')}\n`;
        
        const obj = {a: 1, b: 2, c: 3};
        const squaredObj = GStime.map(obj, function(key, value) {
            return value * value;
        });
        
        result += '\nПреобразование объекта:\n';
        result += 'Исходный объект: ' + JSON.stringify(obj) + '\n';
        result += 'Квадраты значений: ' + JSON.stringify(squaredObj);
        
        showResult('#utils-result', result);
    });
    
    // Навигация по DOM
    $('#parent-demo').on('click', function() {
        const parent = $('.child-div.first').parent();
        showResult('#utils-result', 'Родительский элемент: ' + parent.elements[0].className);
    });
    
    $('#children-demo').on('click', function() {
        const children = $('.parent-div').children();
        let result = 'Дочерние элементы:\n';
        
        children.each(function(index) {
            result += `${index + 1}. ${this.className}\n`;
        });
        
        showResult('#utils-result', result);
    });
    
    $('#siblings-demo').on('click', function() {
        const siblings = $('.child-div.first').siblings();
        let result = 'Соседние элементы:\n';
        
        siblings.each(function(index) {
            result += `${index + 1}. ${this.className}\n`;
        });
        
        showResult('#utils-result', result);
    });
    
    $('#find-demo').on('click', function() {
        const found = $('.parent-div').find('.last');
        showResult('#utils-result', 'Найден элемент: ' + found.elements[0].innerText);
    });
    
    $('#closest-demo').on('click', function() {
        const closest = $('.child-div.last').closest('.parent-div');
        showResult('#utils-result', 'Ближайший родитель с классом .parent-div найден: ' + (closest.elements.length > 0));
    });
});