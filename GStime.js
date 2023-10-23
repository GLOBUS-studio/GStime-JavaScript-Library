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
 * Factory function for the GStime library. It creates a new GStime instance and calls its init method.
 * @param {string} selector - The selector to use in the GStime instance.
 * @returns {GStime} A new GStime instance.
 */
function $(selector) {
    const el = new GStime(selector);
    el.init();
    return el;
}
