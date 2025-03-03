# GStime JavaScript Library

## Library Philosophy

GStime.js is a lightweight JavaScript library for DOM manipulation, animation creation, and AJAX requests. It is designed as a modern lightweight alternative to jQuery, maintaining familiar syntax and popular functions, but optimized for modern browsers.

### Core Principles:

- **Minimal Size**: Only necessary functionality, without excessive features
- **Modern JavaScript**: Using modern syntax and browser APIs
- **API Compatibility**: Syntax similar to jQuery for easier migration
- **Method Chaining**: Support for method chaining for concise code

## Quick Start

```html
<!-- Include the library -->
<script src="GStime.js"></script>

<script>
  // DOM ready
  $(document).ready(function() {
    // Select elements and manipulate them
    $('button').on('click', function() {
      $('.box').fadeIn(500);
    });
  });
</script>
```

## Main Features

### Selectors

Select elements on the page using CSS selectors:

```javascript
// Select by ID
$("#myElement");

// Select by class
$(".myClass");

// Select by tag
$("div");

// Combined selectors
$("ul.menu li");
```

### DOM Manipulation

Manipulate DOM elements:

```javascript
// Change HTML content
$("#content").html("<h1>New heading</h1>");

// Add content
$(".container").append("<p>New paragraph</p>");

// Create elements
$("<div class='box'></div>").appendTo(".container");

// Work with classes
$(".item").addClass("active");
$(".item").removeClass("hidden");
$(".item").toggleClass("selected");

// Work with attributes
$("img").attr("src", "new-image.jpg");
$("input").val("New value");
```

### Events

Handle events:

```javascript
// Basic events
$("#button").on("click", function() {
  console.log("Button clicked");
});

// Event delegation
$(".container").on("click", ".button", function() {
  console.log("Button inside container clicked");
});

// Remove event handlers
$("#element").off("click");
```

### Animations

Create animations:

```javascript
// Simple animations
$(".box").fadeIn(500);
$(".box").fadeOut(500);

// Slide effects
$(".panel").slideDown(500);
$(".panel").slideUp(500);
$(".panel").slideToggle(500);

// Custom animations
$(".element").animate({ width: "200px", height: "300px" }, 500);

// Color animations
$(".button").colorAnimate({ backgroundColor: "#ff0000" }, 500);
```

### AJAX

Perform asynchronous requests:

```javascript
// GET request
GStime.get("api/users", { page: 1 })
  .then(data => console.log(data))
  .catch(error => console.error(error));

// POST request
GStime.post("api/users", { name: "John", age: 30 })
  .then(response => console.log(response))
  .catch(error => console.error(error));

// Advanced settings
GStime.ajax({
  url: "api/data",
  method: "POST",
  data: { id: 123 },
  headers: { "Authorization": "Bearer token" },
  timeout: 5000,
  beforeSend: function() {
    $(".loader").show();
  }
})
.then(data => console.log(data))
.catch(error => console.error(error))
.finally(() => $(".loader").hide());
```

## API Documentation

### Core Methods

#### Selector `$(selector)`

Creates a new GStime object with elements matching the selector.

**Parameters:**
- `selector` (String|Element|NodeList|Array): CSS selector, HTML string, or DOM element.

**Limitations:**
- When passing an HTML string, only one top-level element is created.

#### `.each(callback)`

Executes a function for each element in the set.

**Parameters:**
- `callback` (Function): Function to execute for each element.

#### `.on(event, [selector], callback)`

Attaches an event handler to elements.

**Parameters:**
- `event` (String): Name of the event (e.g., "click").
- `selector` (String, optional): Selector for event delegation.
- `callback` (Function): Event handler function.

**Limitations:**
- Delegation only works for elements that exist at the time the event is bound.

#### `.off(event, callback)`

Removes an event handler from elements.

**Parameters:**
- `event` (String): Name of the event.
- `callback` (Function): Function to remove.

**Limitations:**
- When using delegated events, you must pass exactly the same function that was assigned via `.on()`.

#### `.val([newVal])`

Gets or sets the value of form elements.

**Parameters:**
- `newVal` (String, optional): New value.

**Returns:**
- Without parameters: value of the first element.
- With parameter: GStime object for chaining.

#### `.html([content])`

Gets or sets the HTML content of elements.

**Parameters:**
- `content` (String, optional): HTML content.

**Returns:**
- Without parameters: content of the first element.
- With parameter: GStime object for chaining.

#### `.css(prop, [value])` or `.css(properties)`

Gets or sets CSS properties of elements.

**Parameters:**
- `prop` (String): Name of the CSS property.
- `value` (String|Number, optional): Value of the CSS property.
- `properties` (Object): Object with CSS properties.

**Returns:**
- When getting: property value.
- When setting: GStime object for chaining.

### Animations

#### `.animate(properties, duration, [callback])`

Animates CSS properties of elements.

**Parameters:**
- `properties` (Object): Object with CSS properties and their target values.
- `duration` (Number): Duration of the animation in milliseconds.
- `callback` (Function, optional): Function to call once the animation is complete.

**Limitations:**
- Only numeric CSS property values can be animated.

#### `.fadeIn(duration, [callback])` / `.fadeOut(duration, [callback])`

Shows or hides elements with a fading effect.

**Parameters:**
- `duration` (Number): Duration of the animation in milliseconds.
- `callback` (Function, optional): Function to call once the animation is complete.

#### `.slideUp(duration, [callback])` / `.slideDown(duration, [callback])` / `.slideToggle(duration, [callback])`

Hides, shows, or toggles the visibility of elements with a sliding effect.

**Parameters:**
- `duration` (Number): Duration of the animation in milliseconds.
- `callback` (Function, optional): Function to call once the animation is complete.

**Limitations:**
- May not work correctly for elements with padding/margin or complex internal structure.

#### `.colorAnimate(properties, duration, [callback])`

Animates color CSS properties of elements.

**Parameters:**
- `properties` (Object): Object with color CSS properties and their target values.
- `duration` (Number): Duration of the animation in milliseconds.
- `callback` (Function, optional): Function to call once the animation is complete.

**Limitations:**
- Supported color formats: hex (#RGB, #RRGGBB, #RRGGBBAA), rgb() and rgba().

### AJAX

#### `GStime.ajax(settings)`

Performs an AJAX request.

**Parameters:**
- `settings` (Object): Object with request settings:
  - `url` (String): URL for the request.
  - `method` (String): HTTP method (GET, POST, PUT, DELETE).
  - `data` (Object|String): Data to send.
  - `headers` (Object): HTTP headers.
  - `timeout` (Number): Request timeout in milliseconds.
  - `beforeSend` (Function): Function to call before sending the request.

**Returns:**
- Promise that resolves with the response data or rejects with an error.

**Limitations:**
- Does not support synchronous requests.
- Limited support for cross-domain requests (depends on the browser).

#### `GStime.get(url, [data], [options])`

Performs a GET request.

**Parameters:**
- `url` (String): URL for the request.
- `data` (Object, optional): Request parameters.
- `options` (Object, optional): Additional settings.

#### `GStime.post(url, data, [options])`

Performs a POST request.

**Parameters:**
- `url` (String): URL for the request.
- `data` (Object): Data to send.
- `options` (Object, optional): Additional settings.

#### `GStime.put(url, data, [options])` / `GStime.delete(url, [data], [options])`

Performs a PUT or DELETE request.

**Parameters:**
- `url` (String): URL for the request.
- `data` (Object): Data to send.
- `options` (Object, optional): Additional settings.

## Browser Compatibility

GStime.js supports the following browsers:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 15+
- Opera 47+

## License

GStime.js is distributed under the MIT license.