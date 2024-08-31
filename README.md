# GStime JavaScript Library

## Description

GStime is a lightweight, feature-rich, and easy-to-use JavaScript library designed to simplify HTML document traversing, event handling, and manipulation of content. It's perfect for fast web development and ideal for those familiar with jQuery but looking for a smaller library with the most commonly used features.

## Features

- **DOM Manipulation**: Easily get, set, and manipulate the content of HTML elements.
- **Event Handling**: Attach event listeners to elements with ease using `.on()` and `.off()` methods.
- **Lightweight**: Very small in size, perfect for projects where you don't need the full power of larger libraries.
- **Easy to use**: Straightforward for those familiar with jQuery or vanilla JavaScript.
- **Chainable Methods**: Perform multiple methods on the same line of code with returned `this` for most methods.
- **Server-side compatibility**: Checks for the existence of `document` to support usage in server-side environments.
- **Multiple Element Support**: Most methods operate on and return collections of elements, not just single elements.

## Chainable Methods

Many methods in GStime return the GStime object, allowing for method chaining. This includes methods like `addClass()`, `removeClass()`, `append()`, `prepend()`, `hide()`, `show()`, and more. For example:

```javascript
$('.element')
  .addClass('new-class')
  .css('color', 'red')
  .show()
  .append('<p>New content</p>');
  ```

## Multiple Element Support
GStime supports operating on multiple elements at once. When you select elements using $(), it returns a GStime object containing all matched elements. Methods like each(), addClass(), removeClass(), etc., operate on all selected elements.

## How to Use

Include GStime in your project:

```html
<script src="path-to-GStime.js"></script>
<script>
  // DOM Ready
  GStime.ready(function () {
    // Click event
    $(".element").on("click", function () {
      console.log("Element clicked!");
    });

    // Changing value
    $(".input").val("New Value");

    // Adding HTML content
    $(".container").append("<p>New paragraph</p>");
  });

  GStime.ajax({
    url: "https://api.example.com/data",
    method: "GET",
    success: function (response) {
      console.log("Data received:", response);
    },
  });
</script>
```

## Methods Available

### Element Selection and Manipulation

- `$(selector)`: Select DOM elements.
- `val([newVal])`: Get/set the value of elements.
- `html([content])`: Get/set the HTML content of elements.
- `append(content)`: Append content to elements.
- `prepend(content)`: Prepend content to elements.
- `after(content)`: Insert content after each element.
- `before(content)`: Insert content before each element.
- `remove()`: Remove the set of matched elements from the DOM.

### DOM Traversing

- `parent()`: Gets the parent of each element.
- `children()`: Gets the children of each element.
- `siblings()`: Gets the siblings of each element.
- `find(selector)`: Finds descendants of each element.
- `closest(selector)`: Gets the first ancestor that matches the selector.

### CSS Properties

- `css(property, [value])`: Get/set CSS properties.

### Element Visibility

- `hide()`: Hide elements.
- `show()`: Show elements.
- `toggle()`: Toggle visibility of elements.

### Manipulating Classes

- `addClass(className)`: Add a class to elements.
- `removeClass(className)`: Remove a class from elements.
- `toggleClass(className)`: Toggle a class on elements.
- `hasClass(className)`: Check if the first element has a class.

### Event Handling

- `on(event, callback)`: Attach an event handler.
- `off(event, callback)`: Remove an event handler.

### Dimensions and Position

- `width([value])`: Get/set the width of elements.
- `height([value])`: Get/set the height of elements.
- `offset()`: Get the offset of the first element.
- `position()`: Get the position of the first element.

### Attributes

- `attr(name, [value])`: Get/set attributes.
- `removeAttr(name)`: Remove an attribute.

### Effects and Animation

- `animate(properties, duration, [callback])`: Animate CSS properties.
- `fadeIn(duration, [callback])`: Fade in elements.
- `fadeOut(duration, [callback])`: Fade out elements.

### Utility

- `clone()`: Create a shallow copy of elements.
- `each(callback)`: Iterate over elements.
- `each(obj, callback)`: Iterate over an array or object.
- `map(obj, callback)`: Translate all items in an array or object.

### Static Methods

- `GStime.ajax(settings)`: Perform an AJAX request.
- `GStime.ready(callback)`: Execute code when the DOM is ready.

### Contribution

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#) if you want to contribute.

### License

This project is MIT licensed.

## Browser and Environment Support
GStime is designed to work in modern browsers that support ES6 features. It should work in:

Chrome 51+
Firefox 54+
Safari 10+
Edge 15+
Opera 38+
For server-side environments, GStime is compatible with Node.js 6.4.0 and later versions.

Note: Some features may require additional polyfills for older browsers. For the best experience and widest compatibility, consider using GStime with a modern browser or environment.