# GStime JavaScript Library

## Description

GStime is a lightweight, feature-rich, and easy-to-use JavaScript library designed to simplify HTML document traversing, event handling, and manipulation of content, making it perfect for fast web development. It's a great choice if you're familiar with jQuery but are looking for a smaller library that offers the most commonly used features.

## Features

- **DOM Manipulation**: Easily get, set, and manipulate the content of HTML elements.
- **Event Handling**: Attach event listeners to elements with ease, using `.on()` and `.off()` methods.
- **Lightweight**: It's very small in size, perfect for projects where you don't need the full power of larger libraries.
- **Easy to use**: If you're familiar with jQuery or vanilla JavaScript, you'll find GStime very straightforward.
- **Chainable Methods**: Perform multiple methods on the same line of code with returned `this` for most methods.

## How to Use

Here's how you can include GStime in your project:

```html
<script src="path-to-GStime.js"></script>
// DOM Ready
$(document).ready(function() {
    // Click event
    $('.element').on('click', function() {
        console.log('Element clicked!');
    });

    // Changing value
    $('.input').val('New Value');
    
    // Adding HTML content
    $('.container').append('<p>New paragraph</p>');
});
```
## Methods Available

- `init()`: Initializes the library; called internally.
- `on(event, callback)`: Attach an event handler function for one or more events to the selected elements.
- `off(event, callback)`: Remove an event handler.
- `val([newVal])`: Get the current value of the first element in the set of matched elements or set the value of every matched element.
- `append(html)`: Insert content to the end of each element in the set of matched elements.
- `prepend(html)`: Insert content to the beginning of each element in the set of matched elements.
- `html([html])`: Get the HTML contents of the first element in the set of matched elements or set the HTML contents of every matched element.

## Contribution

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](#) if you want to contribute.

## License

This project is [MIT](#) licensed.
