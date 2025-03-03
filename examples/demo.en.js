// Wait for DOM to load
GStime.ready(function() {
    // Function to display result
    function showResult(selector, content) {
        $(selector).html(content);
    }

    // Section navigation demonstration
    $('.menu li').on('click', function() {
        const section = $(this).attr('data-section');
        $('section').hide();
        $(`#${section}`).show();
    });

    // Show first section by default
    $('section').hide();
    $('#selectors').show();

    // =============================================
    // Selectors demonstration
    // =============================================
    
    // Select by ID
    $('#select-by-id').on('click', function() {
        const el = $('#box1');
        showResult('#selector-result', 'Selected element by ID: ' + el.html());
    });
    
    // Select by class
    $('#select-by-class').on('click', function() {
        const el = $('.blue');
        showResult('#selector-result', 'Elements selected by class: ' + el.elements.length);
    });
    
    // Select by tag
    $('#select-by-tag').on('click', function() {
        const el = $('div');
        showResult('#selector-result', 'Selected div elements: ' + el.elements.length);
    });
    
    // Combined selector
    $('#select-combined').on('click', function() {
        const el = $('.box.yellow');
        showResult('#selector-result', 'Elements selected with box and yellow classes: ' + el.elements.length);
    });

    // =============================================
    // DOM manipulation demonstration
    // =============================================
    
    // Change HTML
    $('#change-html').on('click', function() {
        $('#content-block').html('<strong>Changed content</strong> using .html()');
        showResult('#dom-result', 'HTML changed');
    });
    
    // Append content
    $('#append-content').on('click', function() {
        $('#content-block').append('<div>Content appended using .append()</div>');
        showResult('#dom-result', 'Content appended to the end');
    });
    
    // Prepend content
    $('#prepend-content').on('click', function() {
        $('#content-block').prepend('<div>Content prepended using .prepend()</div>');
        showResult('#dom-result', 'Content added to the beginning');
    });
    
    // Create element
    $('#create-element').on('click', function() {
        const newElement = $('<div class="box green">New</div>');
        $('#dom-container').append(newElement.elements[0].outerHTML);
        showResult('#dom-result', 'Element created and added');
    });
    
    // Clone element
    $('#clone-element').on('click', function() {
        const original = $('#attr-box');
        const clone = original.clone();
        clone.html('Clone');
        $('#dom-container').append(clone.elements[0].outerHTML);
        showResult('#dom-result', 'Element cloned');
    });
    
    // Remove element
    $('#remove-element').on('click', function() {
        const elementsCount = $('#dom-container .box').elements.length;
        if (elementsCount > 0) {
            $('#dom-container .box').remove();
            showResult('#dom-result', 'Elements removed: ' + elementsCount);
        } else {
            showResult('#dom-result', 'No elements to remove');
        }
    });
    
    // Working with classes and attributes
    $('#add-class').on('click', function() {
        $('#attr-box').addClass('blue');
        showResult('#dom-result', 'Class "blue" added');
    });
    
    $('#remove-class').on('click', function() {
        $('#attr-box').removeClass('blue');
        showResult('#dom-result', 'Class "blue" removed');
    });
    
    $('#toggle-class').on('click', function() {
        $('#attr-box').toggleClass('yellow');
        showResult('#dom-result', 'Class "yellow" toggled');
    });
    
    $('#check-class').on('click', function() {
        const hasClass = $('#attr-box').hasClass('yellow');
        showResult('#dom-result', 'Class "yellow" presence: ' + hasClass);
    });
    
    $('#set-attr').on('click', function() {
        $('#attr-box').attr('data-test', 'example-value');
        showResult('#dom-result', 'Attribute data-test set');
    });
    
    $('#get-attr').on('click', function() {
        const attr = $('#attr-box').attr('data-test');
        showResult('#dom-result', 'Attribute data-test value: ' + attr);
    });
    
    $('#remove-attr').on('click', function() {
        $('#attr-box').removeAttr('data-test');
        showResult('#dom-result', 'Attribute data-test removed');
    });

    // =============================================
    // Events demonstration
    // =============================================
    
    // Simple event handler
    $('#click-btn').on('click', function() {
        showResult('#event-result', 'Button clicked! ' + new Date().toLocaleTimeString());
    });
    
    // Hover events
    $('#hover-area').on('mouseenter', function() {
        $(this).css('background-color', '#3498db');
        $(this).css('color', 'white');
    });
    
    $('#hover-area').on('mouseleave', function() {
        $(this).css('background-color', '#ecf0f1');
        $(this).css('color', 'inherit');
    });
    
    // Event delegation
    $('#delegation-container').on('click', '.delegated-button', function() {
        showResult('#event-result', 'Delegated button clicked: ' + $(this).html());
    });
    
    // Adding dynamic button
    $('#add-button').on('click', function() {
        const buttonsCount = $('#delegation-container .delegated-button').elements.length;
        $('#delegation-container').append(`<button class="delegated-button">New Button ${buttonsCount + 1}</button>`);
        showResult('#event-result', 'New button added');
    });

    // =============================================
    // Animations demonstration
    // =============================================
    
    // Fade effects
    $('#fade-in').on('click', function() {
        $('#fade-box').fadeIn(500);
    });
    
    $('#fade-out').on('click', function() {
        $('#fade-box').fadeOut(500);
    });
    
    // Slide effects
    $('#slide-down').on('click', function() {
        $('#slide-box').slideDown(500);
    });
    
    $('#slide-up').on('click', function() {
        $('#slide-box').slideUp(500);
    });
    
    $('#slide-toggle').on('click', function() {
        $('#slide-box').slideToggle(500);
    });
    
    // Property animations
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
    
    // Color animations
    $('#animate-color').on('click', function() {
        const colors = [
            '#3498db', // blue
            '#e74c3c', // red
            '#2ecc71', // green
            '#f39c12', // orange
            '#9b59b6'  // purple
        ];
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        $('#color-box').colorAnimate({
            backgroundColor: randomColor
        }, 1000);
    });

    // =============================================
    // AJAX demonstration
    // =============================================
    
    // GET request
    $('#ajax-get').on('click', function() {
        $('#ajax-loader').show();
        $('#ajax-message').removeClass('success error').addClass('hidden').html('');
        
        GStime.get('https://jsonplaceholder.typicode.com/posts/1')
            .then(function(data) {
                $('#ajax-message')
                    .removeClass('hidden')
                    .addClass('success')
                    .html('Request completed successfully');
                    
                $('#ajax-result').html(JSON.stringify(data, null, 2));
            })
            .catch(function(error) {
                $('#ajax-message')
                    .removeClass('hidden')
                    .addClass('error')
                    .html('Error: ' + error.message);
                    
                $('#ajax-result').html('');
            })
            .finally(function() {
                $('#ajax-loader').hide();
            });
    });
    
    // POST request
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
                    .html('Request completed successfully');
                    
                $('#ajax-result').html(JSON.stringify(data, null, 2));
            })
            .catch(function(error) {
                $('#ajax-message')
                    .removeClass('hidden')
                    .addClass('error')
                    .html('Error: ' + error.message);
                    
                $('#ajax-result').html('');
            })
            .finally(function() {
                $('#ajax-loader').hide();
            });
    });
    
    // Advanced AJAX settings
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
                    .html('Request sending...');
                return true; // continue with the request
            }
        })
        .then(function(data) {
            $('#ajax-message')
                .removeClass('hidden')
                .addClass('success')
                .html('Request completed successfully, records received: ' + data.length);
                
            $('#ajax-result').html(JSON.stringify(data.slice(0, 5), null, 2));
        })
        .catch(function(error) {
            $('#ajax-message')
                .removeClass('hidden')
                .addClass('error')
                .html('Error: ' + error.message);
                
            $('#ajax-result').html('');
        })
        .finally(function() {
            $('#ajax-loader').hide();
        });
    });

    // =============================================
    // Utilities demonstration
    // =============================================
    
    // GStime.each - Collection traversal
    $('#each-demo').on('click', function() {
        const arr = [1, 2, 3, 4, 5];
        let result = 'GStime.each demonstration:\n';
        
        GStime.each(arr, function(index, value) {
            result += `Element #${index}: ${value}\n`;
        });
        
        const obj = {name: 'John', age: 30, city: 'New York'};
        result += '\nObject traversal:\n';
        
        GStime.each(obj, function(key, value) {
            result += `${key}: ${value}\n`;
        });
        
        showResult('#utils-result', result);
    });
    
    // GStime.map - Collection transformation
    $('#map-demo').on('click', function() {
        const arr = [1, 2, 3, 4, 5];
        
        const doubled = GStime.map(arr, function(index, value) {
            return value * 2;
        });
        
        let result = 'GStime.map demonstration:\n';
        result += `Original array: ${arr.join(', ')}\n`;
        result += `Doubled array: ${doubled.join(', ')}\n`;
        
        const obj = {a: 1, b: 2, c: 3};
        const squaredObj = GStime.map(obj, function(key, value) {
            return value * value;
        });
        
        result += '\nObject transformation:\n';
        result += 'Original object: ' + JSON.stringify(obj) + '\n';
        result += 'Squared values: ' + JSON.stringify(squaredObj);
        
        showResult('#utils-result', result);
    });
    
    // DOM Navigation
    $('#parent-demo').on('click', function() {
        const parent = $('.child-div.first').parent();
        showResult('#utils-result', 'Parent element: ' + parent.elements[0].className);
    });
    
    $('#children-demo').on('click', function() {
        const children = $('.parent-div').children();
        let result = 'Child elements:\n';
        
        children.each(function(index) {
            result += `${index + 1}. ${this.className}\n`;
        });
        
        showResult('#utils-result', result);
    });
    
    $('#siblings-demo').on('click', function() {
        const siblings = $('.child-div.first').siblings();
        let result = 'Sibling elements:\n';
        
        siblings.each(function(index) {
            result += `${index + 1}. ${this.className}\n`;
        });
        
        showResult('#utils-result', result);
    });
    
    $('#find-demo').on('click', function() {
        const found = $('.parent-div').find('.last');
        showResult('#utils-result', 'Element found: ' + found.elements[0].innerText);
    });
    
    $('#closest-demo').on('click', function() {
        const closest = $('.child-div.last').closest('.parent-div');
        showResult('#utils-result', 'Closest parent with class .parent-div found: ' + (closest.elements.length > 0));
    });
});
