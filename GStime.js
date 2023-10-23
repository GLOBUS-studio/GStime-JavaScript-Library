/**
 * GStime Class representing a lightweight library for DOM manipulation.
 * @constructor
 * @param {string} selector - The selector to be used for element selection.
 */
function GStime(selector) {
    this.selector = selector || null;
    this.element = null;
}

/**
 * Initializes the GStime object based on the provided selector.
 */
GStime.prototype.init = function() {
    if (this.selector.startsWith('<')) {
        const matches = this.selector.match(/<([\w-]*)>/);
        if (!matches) {
            throw new Error('Invalid Selector / Node');
            return false;
        }
        const nodeName = matches[0].replace('<', '').replace('>', '');
        this.element = document.createElement(nodeName);
    } else {
        this.element = document.querySelector(this.selector);
    }
};

/**
 * Attaches an event listener to the current GStime element.
 * @param {string} event - The event type to listen for.
 * @param {function} callback - The function to call when the event occurs.
 */
GStime.prototype.on = function(event, callback) {
    if(this.element) {
        this.element.addEventListener(event, callback, false);
    }
};

/**
 * Removes an event listener from the current GStime element.
 * @param {string} event - The event type to remove.
 * @param {function} callback - The function to remove from the event.
 */
GStime.prototype.off = function(event, callback) {
    if(this.element) {
        this.element.removeEventListener(event, callback, false);
    }
};

/**
 * Sets or gets the value of the current GStime element.
 * @param {string} [newVal] - The new value to set. If omitted, the current value is returned.
 * @returns {string|GStime} The current value or this GStime object for chaining if setting a value.
 */
GStime.prototype.val = function(newVal) {
    if (this.element) {
        if (typeof newVal !== 'undefined') {
            this.element.value = newVal;
            return this; // For chaining purposes
        } else {
            return this.element.value;
        }
    }
};

/**
 * Inserts HTML content at the end of the current GStime element.
 * @param {string} html - The HTML string to append.
 * @returns {GStime} The current GStime object for chaining.
 */
GStime.prototype.append = function(html) {
    if(this.element) {
        this.element.insertAdjacentHTML('beforeend', html);
    }
    return this; // For chaining purposes
};

/**
 * Inserts HTML content at the beginning of the current GStime element.
 * @param {string} html - The HTML string to prepend.
 * @returns {GStime} The current GStime object for chaining.
 */
GStime.prototype.prepend = function(html) {
    if(this.element) {
        this.element.insertAdjacentHTML('afterbegin', html);
    }
    return this; // For chaining purposes
};

/**
 * Sets or gets the HTML content of the current GStime element.
 * @param {string} [html] - The HTML content to set. If omitted, the current content is returned.
 * @returns {string|GStime} The current content or this GStime object for chaining if setting content.
 */
GStime.prototype.html = function(html) {
    if (this.element) {
        if (typeof html !== 'undefined') {
            this.element.innerHTML = html;
            return this; // For chaining purposes
        } else {
            return this.element.innerHTML;
        }
    }
};

/**
 * Gets the value of a computed style property for the first element in the set of matched elements 
 * or sets one or more CSS properties for every matched element.
 * @param {string|Object} propertyName - The name of the CSS property to get, or an object of property-value pairs to set.
 * @param {string} [value] - The value of the CSS property to set. Ignored if propertyName is an object.
 * @returns {string|GStime} The CSS property value when getting, or the GStime object for chaining when setting.
 */
GStime.prototype.css = function(propertyName, value) {
    if (!this.element) return;

    // If an object was passed, we assume it's {prop: value, prop: value}
    if (typeof propertyName === "object") {
        for (let key in propertyName) {
            if (propertyName.hasOwnProperty(key)) {
                this.element.style[key] = propertyName[key];
            }
        }
        return this; // for chaining
    } else {
        // Handle .css("propertyname") and .css("propertyname", "value")
        if (typeof value === "undefined") {
            return window.getComputedStyle(this.element)[propertyName];
        } else {
            this.element.style[propertyName] = value;
            return this; // for chaining
        }
    }
};

/**
 * Hides the matched elements by setting their display property to 'none'.
 * @returns {GStime} The GStime object for chaining.
 */
GStime.prototype.hide = function() {
    if (this.element) {
        this.element.style.display = 'none';
    }
    return this; // For chaining purposes
};

/**
 * Displays the matched elements by setting their display property to '' (empty string).
 * @returns {GStime} The GStime object for chaining.
 */
GStime.prototype.show = function() {
    if (this.element) {
        this.element.style.display = '';
    }
    return this; // For chaining purposes
};

/**
 * Toggles the visibility of the matched elements by altering their display property.
 * @returns {GStime} The GStime object for chaining.
 */
GStime.prototype.toggle = function() {
    if (this.element) {
        this.element.style.display = (this.element.style.display === 'none') ? '' : 'none';
    }
    return this; // For chaining purposes
};

/**
 * Creates a shallow copy of the set of matched elements.
 * @returns {GStime} A new GStime object for the cloned element.
 */
GStime.prototype.clone = function() {
    if (this.element) {
        const clonedElement = this.element.cloneNode(true);
        const clonedGStime = new GStime();
        clonedGStime.element = clonedElement;
        return clonedGStime; // Return the new GStime object
    }
    return null; // Return null if there's no element to clone
};

/**
 * Creates a deep copy of the set of matched elements, including all data and event handlers.
 * @returns {GStime} A new GStime object for the cloned element.
 */
GStime.prototype.cloneFull = function() {
    if (this.element) {
        const clonedElement = this.element.cloneNode(true);
        const events = this._events; 

        const clonedGStime = new GStime();
        clonedGStime.element = clonedElement;

        if (events) {
            for (const event of events) {
                clonedGStime.on(event.type, event.listener);
            }
        }

        return clonedGStime;
    }
    return null; 
};

/**
 * Animates an element's specified CSS property over a duration.
 * 
 * @param {Object} properties - An object of CSS properties and their target values.
 * @param {number} duration - The duration over which to animate the properties, in milliseconds.
 * @param {function} [callback] - An optional callback to be executed after the animation completes.
 */
GStime.prototype.animate = function(properties, duration, callback) {
    if (this.element && properties) {
        const start = performance.now();
        const initialStyles = {};

        for (const property in properties) {
            initialStyles[property] = this.element.style[property] || getComputedStyle(this.element)[property];
        }

        const animateFrame = (timestamp) => {
            const progress = timestamp - start;
            const remaining = Math.max(0, duration - progress);

            for (const property in properties) {
                const initialValue = parseFloat(initialStyles[property]);
                const targetValue = parseFloat(properties[property]);
                const valueChange = targetValue - initialValue;

                // Simple linear tweening formula: newValue = initialValue + progress/duration * valueChange
                this.element.style[property] = initialValue + Math.min(progress/duration, 1) * valueChange + (Number.isNaN(targetValue) ? '' : 'px');
            }

            if (remaining) {
                requestAnimationFrame(animateFrame);
            } else {
                if (typeof callback === 'function') {
                    callback();
                }
            }
        };

        requestAnimationFrame(animateFrame);
    }
};

/**
 * Gradually changes the opacity of the selected element to 0, giving a "fade out" effect.
 *
 * @param {number} duration - The duration over which to fade out, in milliseconds.
 * @param {function} [callback] - An optional callback to execute once the animation is complete.
 */
GStime.prototype.fadeOut = function(duration, callback) {
    if (this.element) {
        const fadeEffect = (timestamp) => {
            if (!this.element.style.opacity) {
                this.element.style.opacity = 1;
            }
            if (this.element.style.opacity > 0) {
                this.element.style.opacity -= (timestamp - start) / duration;
                requestAnimationFrame(fadeEffect);
            } else {
                this.element.style.display = 'none';
                if (typeof callback === 'function') {
                    callback();
                }
            }
        };
        const start = performance.now();
        requestAnimationFrame(fadeEffect);
    }
};

/**
 * Gradually changes the opacity of the selected element from 0 to 1, giving a "fade in" effect.
 *
 * @param {number} duration - The duration over which to fade in, in milliseconds.
 * @param {function} [callback] - An optional callback to execute once the animation is complete.
 */
GStime.prototype.fadeIn = function(duration, callback) {
    if (this.element) {
        this.element.style.display = ''; // Reset the display property
        this.element.style.opacity = 0;

        const fadeEffect = (timestamp) => {
            if (this.element.style.opacity < 1) {
                this.element.style.opacity = Math.min((timestamp - start) / duration, 1);
                requestAnimationFrame(fadeEffect);
            } else {
                if (typeof callback === 'function') {
                    callback();
                }
            }
        };
        const start = performance.now();
        requestAnimationFrame(fadeEffect);
    }
};

/**
 * Checks if the selected element has the specified class.
 *
 * @param {string} className - The class name to check.
 * @returns {boolean} Returns true if the element has the class, else false.
 */
GStime.prototype.hasClass = function(className) {
    if (this.element) {
        return this.element.classList.contains(className);
    }
    return false;
};

/**
 * Adds the specified class to the selected element.
 *
 * @param {string} className - The class name to add.
 * @returns {GStime} The current GStime object for chaining.
 */
GStime.prototype.addClass = function(className) {
    if (this.element) {
        this.element.classList.add(className);
    }
    return this; // For chaining purposes
};

/**
 * Removes the specified class from the selected element.
 *
 * @param {string} className - The class name to remove.
 * @returns {GStime} The current GStime object for chaining.
 */
GStime.prototype.removeClass = function(className) {
    if (this.element) {
        this.element.classList.remove(className);
    }
    return this; // For chaining purposes
};

/**
 * Toggles the specified class on the selected element.
 *
 * @param {string} className - The class name to toggle.
 * @returns {GStime} The current GStime object for chaining.
 */
GStime.prototype.toggleClass = function(className) {
    if (this.element) {
        this.element.classList.toggle(className);
    }
    return this; // For chaining purposes
};

/**
 * Performs an AJAX request.
 * @param {string} url - The URL to send the request to.
 * @param {object} [options] - Optional configurations for the request (method, headers, body, etc.).
 * @returns {Promise<any>} A promise with the result of the AJAX request.
 */
GStime.prototype.ajax = function(url, options = {}) {
    // Setting default method to GET if not provided
    options.method = options.method || 'GET';

    // Setting headers to application/json if not provided
    options.headers = options.headers || { 'Content-Type': 'application/json' };

    // If a body is provided and the Content-Type is JSON, stringify the body
    if (options.body && options.headers['Content-Type'] === 'application/json') {
        options.body = JSON.stringify(options.body);
    }

    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json(); // we're assuming server always returns JSON
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        });
};

/**
 * Factory function for the GStime library. It creates a new GStime instance and calls its init method.
 * @param {string} selector - The selector to use in the GStime instance.
 * @returns {GStime} A new GStime instance.
 */
function $(selector) {
    const el = new GStime(selector);
    el.init();
    return el;
}
