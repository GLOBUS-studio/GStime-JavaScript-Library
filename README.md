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
- `css(propertyName, [value])`: Get the value of a computed style property for the first element in the set of matched elements or set one or more CSS properties for every matched element.
- `hide()`: Hides the matched elements by setting their display property to 'none'.
- `show()`: Displays the matched elements by setting their display property to '' (empty string).
- `toggle()`: Toggles the visibility of the matched elements by altering their display property.
- `clone()`: Creates a shallow copy of the set of matched elements.
- `cloneFull()`: Creates a deep copy of the set of matched elements, including all data and event handlers.
- `animate(properties, duration, [callback])`: Animates an element's specified CSS property over a given duration.
- `fadeOut(duration, [callback])`: Gradually decreases the opacity of the element, giving a "fade out" effect.
- `fadeIn(duration, [callback])`: Gradually increases the opacity of the element, giving a "fade in" effect.
- `hasClass(className)`: Checks if the selected element has the specified class.
- `addClass(className)`: Adds the specified class to the selected element.
- `removeClass(className)`: Removes the specified class from the selected element.
- `toggleClass(className)`: Toggles the specified class on the selected element.
- `attr(attr, value)`: Get the value of an attribute for the first element or set one or more attributes for every matched element.
- `removeAttr(attr)`: Remove an attribute from each element in the set of matched elements.
- `width(value)`: Get the current computed width of the first element or set the width of every matched element.
- `height(value)`: Get the current computed height of the first element or set the height of every matched element.
- `offset()`: Get the current coordinates of the first element in the set of matched elements, relative to the document.
- `position()`: Get the current coordinates of the first element in the set of matched elements, relative to the offset parent.
- `ajax(url, [options])`: Performs an AJAX request to the provided URL with optional configurations for the request.

## Contribution

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](#) if you want to contribute.

## License

This project is [MIT](#) licensed.
