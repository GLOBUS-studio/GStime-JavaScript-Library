(function (global) {
    "use strict";
  
    // Проверка на существование document
    const isClient = typeof document !== "undefined";
  
    /**
     * GStime Class representing a lightweight library for DOM manipulation.
     * @constructor
     * @param {string|Element|NodeList|Array} selector - The selector, element, or collection of elements.
     */
    function GStime(selector) {
      if (!(this instanceof GStime)) {
        return new GStime(selector);
      }
      this.elements = [];
      if (isClient) {
        if (typeof selector === "string") {
          if (selector.startsWith("<") && selector.endsWith(">")) {
            this.elements = [this.createHTML(selector)];
          } else {
            this.elements = Array.from(document.querySelectorAll(selector));
          }
        } else if (selector instanceof Element) {
          this.elements = [selector];
        } else if (selector instanceof NodeList || Array.isArray(selector)) {
          this.elements = Array.from(selector);
        }
      }
    }
  
    /**
     * Creates an HTML element from a string.
     * @param {string} html - The HTML string.
     * @returns {Element} The created element.
     */
    GStime.prototype.createHTML = function (html) {
      const div = document.createElement("div");
      div.innerHTML = html.trim();
      return div.firstChild;
    };
  
    /**
     * Executes a callback for each element.
     * @param {function} callback - The function to execute.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.each = function (callback) {
      this.elements.forEach((el, i) => callback.call(el, i, el));
      return this;
    };
  
    /**
     * Attaches an event listener to the elements.
     * @param {string} event - The event type to listen for.
     * @param {function} callback - The function to call when the event occurs.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.on = function (event, callback) {
      return this.each(function () {
        this.addEventListener(event, callback, false);
      });
    };
  
    /**
     * Removes an event listener from the elements.
     * @param {string} event - The event type to remove.
     * @param {function} callback - The function to remove from the event.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.off = function (event, callback) {
      return this.each(function () {
        this.removeEventListener(event, callback, false);
      });
    };
  
    /**
     * Sets or gets the value of the elements.
     * @param {string} [newVal] - The new value to set. If omitted, the current value is returned.
     * @returns {string|GStime} The current value or this GStime object for chaining if setting a value.
     */
    GStime.prototype.val = function (newVal) {
      if (typeof newVal === "undefined") {
        return this.elements[0] ? this.elements[0].value : undefined;
      }
      return this.each(function () {
        this.value = newVal;
      });
    };
  
    /**
     * Inserts HTML content at the end of the elements.
     * @param {string} html - The HTML string to append.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.append = function (html) {
      return this.each(function () {
        this.insertAdjacentHTML("beforeend", html);
      });
    };
  
    /**
     * Inserts HTML content at the beginning of the elements.
     * @param {string} html - The HTML string to prepend.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.prepend = function (html) {
      return this.each(function () {
        this.insertAdjacentHTML("afterbegin", html);
      });
    };
  
    /**
     * Sets or gets the HTML content of the elements.
     * @param {string} [html] - The HTML content to set. If omitted, the current content is returned.
     * @returns {string|GStime} The current content or this GStime object for chaining if setting content.
     */
    GStime.prototype.html = function (html) {
      if (typeof html === "undefined") {
        return this.elements[0] ? this.elements[0].innerHTML : undefined;
      }
      return this.each(function () {
        this.innerHTML = html;
      });
    };
  
    /**
     * Gets the value of a computed style property for the first element or sets CSS properties for all elements.
     * @param {string|Object} prop - The name of the CSS property to get, or an object of property-value pairs to set.
     * @param {string} [value] - The value of the CSS property to set. Ignored if prop is an object.
     * @returns {string|GStime} The CSS property value when getting, or the GStime object for chaining when setting.
     */
    GStime.prototype.css = function (prop, value) {
      if (typeof prop === "string" && typeof value === "undefined") {
        return this.elements[0]
          ? getComputedStyle(this.elements[0])[prop]
          : undefined;
      }
      return this.each(function () {
        if (typeof prop === "object") {
          Object.assign(this.style, prop);
        } else {
          this.style[prop] = value;
        }
      });
    };
  
    /**
     * Hides the matched elements.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.hide = function () {
      return this.css("display", "none");
    };
  
    /**
     * Displays the matched elements.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.show = function () {
      return this.css("display", "");
    };
  
    /**
     * Toggles the visibility of the matched elements.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.toggle = function () {
      return this.each(function () {
        this.style.display = this.style.display === "none" ? "" : "none";
      });
    };
  
    /**
     * Creates a shallow copy of the set of matched elements.
     * @returns {GStime} A new GStime object for the cloned elements.
     */
    GStime.prototype.clone = function () {
      return new GStime(this.elements.map((el) => el.cloneNode(true)));
    };
  
    /**
     * Animates CSS properties of the elements.
     * @param {Object} properties - An object of CSS properties and their target values.
     * @param {number} duration - The duration of the animation in milliseconds.
     * @param {function} [callback] - A function to call once the animation is complete.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.animate = function (properties, duration, callback) {
      const start = performance.now();
      const initialStyles = this.elements.map((el) =>
        Object.fromEntries(
          Object.keys(properties).map((prop) => [
            prop,
            parseFloat(getComputedStyle(el)[prop]) || 0,
          ])
        )
      );
  
      const animate = (timestamp) => {
        const progress = timestamp - start;
        const percent = Math.min(progress / duration, 1);
  
        this.elements.forEach((el, index) => {
          for (let prop in properties) {
            const initial = initialStyles[index][prop];
            const target = parseFloat(properties[prop]);
            const value = initial + (target - initial) * percent;
            el.style[prop] = `${value}px`;
          }
        });
  
        if (percent < 1) {
          requestAnimationFrame(animate);
        } else if (typeof callback === "function") {
          callback();
        }
      };
  
      requestAnimationFrame(animate);
      return this;
    };
  
    /**
     * Fades out the matched elements.
     * @param {number} duration - The duration of the animation in milliseconds.
     * @param {function} [callback] - A function to call once the animation is complete.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.fadeOut = function (duration, callback) {
      return this.animate({ opacity: 0 }, duration, () => {
        this.hide();
        if (typeof callback === "function") callback();
      });
    };
  
    /**
     * Fades in the matched elements.
     * @param {number} duration - The duration of the animation in milliseconds.
     * @param {function} [callback] - A function to call once the animation is complete.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.fadeIn = function (duration, callback) {
      return this.show()
        .css("opacity", 0)
        .animate({ opacity: 1 }, duration, callback);
    };
  
    /**
     * Checks if the first element has the specified class.
     * @param {string} className - The class name to check.
     * @returns {boolean} True if the element has the class, false otherwise.
     */
    GStime.prototype.hasClass = function (className) {
      return this.elements[0]
        ? this.elements[0].classList.contains(className)
        : false;
    };
  
    /**
     * Adds the specified class to the elements.
     * @param {string} className - The class name to add.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.addClass = function (className) {
      return this.each(function () {
        this.classList.add(className);
      });
    };
  
    /**
     * Removes the specified class from the elements.
     * @param {string} className - The class name to remove.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.removeClass = function (className) {
      return this.each(function () {
        this.classList.remove(className);
      });
    };
  
    /**
     * Toggles the specified class on the elements.
     * @param {string} className - The class name to toggle.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.toggleClass = function (className) {
      return this.each(function () {
        this.classList.toggle(className);
      });
    };
  
    /**
     * Gets or sets attributes on the elements.
     * @param {string} name - The name of the attribute.
     * @param {string} [value] - The value to set. If omitted, gets the attribute value.
     * @returns {string|GStime} The attribute value when getting, or the GStime object for chaining when setting.
     */
    GStime.prototype.attr = function (name, value) {
      if (typeof value === "undefined") {
        return this.elements[0] ? this.elements[0].getAttribute(name) : undefined;
      }
      return this.each(function () {
        this.setAttribute(name, value);
      });
    };
  
    /**
     * Removes an attribute from the elements.
     * @param {string} name - The name of the attribute to remove.
     * @returns {GStime} The GStime object for chaining.
     */
    GStime.prototype.removeAttr = function (name) {
      return this.each(function () {
        this.removeAttribute(name);
      });
    };
  
    /**
     * Gets or sets the width of the elements.
     * @param {number|string} [value] - The width to set. If omitted, gets the width.
     * @returns {number|GStime} The width when getting, or the GStime object for chaining when setting.
     */
    GStime.prototype.width = function (value) {
      if (typeof value === "undefined") {
        return this.elements[0] ? this.elements[0].offsetWidth : undefined;
      }
      return this.css("width", typeof value === "number" ? `${value}px` : value);
    };
  
    /**
     * Gets or sets the height of the elements.
     * @param {number|string} [value] - The height to set. If omitted, gets the height.
     * @returns {number|GStime} The height when getting, or the GStime object for chaining when setting.
     */
    GStime.prototype.height = function (value) {
      if (typeof value === "undefined") {
        return this.elements[0] ? this.elements[0].offsetHeight : undefined;
      }
      return this.css("height", typeof value === "number" ? `${value}px` : value);
    };
  
    /**
     * Gets the current coordinates of the first element relative to the document.
     * @returns {Object|undefined} An object with top and left properties, or undefined if no element.
     */
    GStime.prototype.offset = function () {
      if (!this.elements[0]) return undefined;
      const rect = this.elements[0].getBoundingClientRect();
      return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
      };
    };
  
    /**
     * Gets the current coordinates of the first element relative to the offset parent.
     * @returns {Object|undefined} An object with top and left properties, or undefined if no element.
     */
    GStime.prototype.position = function () {
      return this.elements[0]
        ? {
            top: this.elements[0].offsetTop,
            left: this.elements[0].offsetLeft,
          }
        : undefined;
    };
  
    /**
     * Performs an AJAX request.
     * @param {Object} settings - The settings for the AJAX request.
     * @returns {Promise} A promise that resolves with the response data.
     */
    GStime.ajax = function (settings) {
      return new Promise((resolve, reject) => {
        if (!settings || typeof settings.url === "undefined") {
          reject(new Error("A URL is required for the ajax request"));
          return;
        }
  
        const options = {
          method: "GET",
          headers: {},
          ...settings,
        };
  
        if (options.data) {
          if (options.method.toUpperCase() === "GET") {
            options.url += `?${new URLSearchParams(options.data)}`;
          } else if (typeof options.data === "object") {
            if (!options.headers["Content-Type"]) {
              options.headers["Content-Type"] = "application/json";
              options.body = JSON.stringify(options.data);
            } else if (
              options.headers["Content-Type"].includes(
                "application/x-www-form-urlencoded"
              )
            ) {
              options.body = new URLSearchParams(options.data).toString();
            }
          } else {
            options.body = options.data;
          }
          delete options.data;
        }
  
        fetch(options.url, options)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              return response.json();
            } else if (contentType && contentType.includes("text")) {
              return response.text();
            } else {
              return response.blob();
            }
          })
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      });
    };
  
  /**
   * Inserts content after each element in the set of matched elements.
   * @param {string} content - The content to insert.
   * @returns {GStime} The GStime object for chaining.
   */
  GStime.prototype.after = function (content) {
    return this.each(function () {
      this.insertAdjacentHTML("afterend", content);
    });
  };

  /**
   * Inserts content before each element in the set of matched elements.
   * @param {string} content - The content to insert.
   * @returns {GStime} The GStime object for chaining.
   */
  GStime.prototype.before = function (content) {
    return this.each(function () {
      this.insertAdjacentHTML("beforebegin", content);
    });
  };

  /**
   * Removes the set of matched elements from the DOM.
   * @returns {GStime} The GStime object for chaining.
   */
  GStime.prototype.remove = function () {
    return this.each(function () {
      this.parentNode.removeChild(this);
    });
  };

  /**
   * Gets the parent of each element in the current set of matched elements.
   * @returns {GStime} A new GStime object containing the parent elements.
   */
  GStime.prototype.parent = function () {
    const parents = this.elements.map((el) => el.parentNode).filter(Boolean);
    return new GStime(parents);
  };

  /**
   * Gets the children of each element in the set of matched elements.
   * @returns {GStime} A new GStime object containing the child elements.
   */
  GStime.prototype.children = function () {
    const children = this.elements.flatMap((el) => Array.from(el.children));
    return new GStime(children);
  };

  /**
   * Gets the siblings of each element in the set of matched elements.
   * @returns {GStime} A new GStime object containing the sibling elements.
   */
  GStime.prototype.siblings = function () {
    const siblings = this.elements.flatMap((el) =>
      Array.from(el.parentNode.children).filter((child) => child !== el)
    );
    return new GStime(siblings);
  };

  /**
   * Finds descendants of each element in the current set of matched elements.
   * @param {string} selector - A string containing a selector expression to match elements against.
   * @returns {GStime} A new GStime object containing the matched elements.
   */
  GStime.prototype.find = function (selector) {
    const found = this.elements.flatMap((el) =>
      Array.from(el.querySelectorAll(selector))
    );
    return new GStime(found);
  };

  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param {string} selector - A string containing a selector expression to match elements against.
   * @returns {GStime} A new GStime object containing the matched elements.
   */
  GStime.prototype.closest = function (selector) {
    const closest = this.elements
      .map((el) => el.closest(selector))
      .filter(Boolean);
    return new GStime(closest);
  };

  /**
   * Iterate over an array or an object.
   * @param {Array|Object} obj - The object to iterate over.
   * @param {Function} callback - The function to execute for each element.
   * @returns {Array|Object} The original array or object.
   */
  GStime.each = function (obj, callback) {
    if (Array.isArray(obj)) {
      obj.forEach((value, index) => callback.call(value, index, value));
    } else {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          callback.call(obj[key], key, obj[key]);
        }
      }
    }
    return obj;
  };

  /**
   * Translate all items in an array or all properties in an object to a new array or object.
   * @param {Array|Object} obj - The array or object to map.
   * @param {Function} callback - The function to execute for each element.
   * @returns {Array|Object} A new array or object with the results.
   */
  GStime.map = function (obj, callback) {
    if (Array.isArray(obj)) {
      return obj.map(callback);
    } else {
      const result = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          result[key] = callback.call(obj[key], key, obj[key]);
        }
      }
      return result;
    }
  };

  /**
   * Executes a callback function when the DOM is fully loaded.
   * @param {function} callback - The function to execute.
   */
  GStime.ready = function (callback) {
    if (!isClient) {
      return;
    }
    if (document.readyState !== "loading") {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  };

  // Expose GStime to the global object
  global.GStime = GStime;
  global.$ = function (selector) {
    return new GStime(selector);
  };
})(typeof window !== "undefined" ? window : this);