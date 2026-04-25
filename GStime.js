/*
* GStime.js
* A lightweight library for DOM manipulation.
* GLOBUS.studio
* Version: 2.0.0
*/

(function (root, factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
      define([], factory);
    } else if (typeof module === "object" && module.exports) {
      module.exports = factory();
    } else {
      const api = factory();
      root.GStime = api.GStime;
      root.$ = api.$;
    }
  })(typeof self !== "undefined" ? self : (typeof globalThis !== "undefined" ? globalThis : this), function () {
    "use strict";

    const isClient = typeof document !== "undefined";
    const HTML_RE = /^\s*<([a-z][\w-]*)[\s\S]*>/i;
    // WeakMap<Element, Map<event, Array<{ user, listener, selector }>>>
    const listenerStore = isClient ? new WeakMap() : null;

    function getListenerMap(el, event) {
      let map = listenerStore.get(el);
      if (!map) {
        map = new Map();
        listenerStore.set(el, map);
      }
      let arr = map.get(event);
      if (!arr) {
        arr = [];
        map.set(event, arr);
      }
      return arr;
    }

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
      if (!isClient || selector == null) return;
      if (typeof selector === "string") {
        if (HTML_RE.test(selector)) {
          this.elements = this.createHTML(selector);
        } else {
          try {
            this.elements = Array.from(document.querySelectorAll(selector));
          } catch (_e) {
            this.elements = [];
          }
        }
      } else if (selector instanceof Element) {
        this.elements = [selector];
      } else if (typeof Document !== "undefined" && selector instanceof Document) {
        this.elements = [selector];
      } else if (typeof Window !== "undefined" && selector instanceof Window) {
        this.elements = [selector];
      } else if (selector instanceof NodeList || Array.isArray(selector) || selector instanceof HTMLCollection) {
        this.elements = Array.from(selector).filter(Boolean);
      } else if (typeof selector === "function") {
        // $(fn) -> ready shorthand
        GStime.ready(selector);
      }
    }
  
    /**
     * Creates HTML element(s) from a string. Supports multiple top-level nodes.
     * @param {string} html - The HTML string.
     * @returns {Element[]} The created elements.
     */
    GStime.prototype.createHTML = function (html) {
      const tpl = document.createElement("template");
      tpl.innerHTML = String(html).trim();
      return Array.from(tpl.content.children);
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
     * Attaches an event listener with optional event delegation.
     * @param {string} event - The event type.
     * @param {string} [selector] - Optional selector for delegation.
     * @param {function} callback - The handler.
     * @returns {GStime} For chaining.
     */
    GStime.prototype.on = function (event, selector, callback) {
      if (typeof selector === "function") {
        callback = selector;
        selector = null;
      }
      if (typeof callback !== "function") return this;

      return this.each(function () {
        const el = this;
        let listener;
        if (selector) {
          listener = function (e) {
            let target = e.target;
            while (target && target !== el) {
              if (target.nodeType === 1 && target.matches(selector)) {
                const proxy = new Proxy(e, {
                  get(obj, prop) {
                    if (prop === "currentTarget") return target;
                    if (prop === "delegateTarget") return el;
                    const v = obj[prop];
                    return typeof v === "function" ? v.bind(obj) : v;
                  }
                });
                callback.call(target, proxy);
                return;
              }
              target = target.parentNode;
            }
          };
        } else {
          listener = function (e) { callback.call(el, e); };
        }
        el.addEventListener(event, listener, false);
        getListenerMap(el, event).push({ user: callback, listener: listener, selector: selector || null });
      });
    };

    /**
     * Removes an event listener previously attached with .on().
     * @param {string} event - The event type.
     * @param {function} [callback] - The original handler. If omitted, removes all handlers for the event.
     * @returns {GStime} For chaining.
     */
    GStime.prototype.off = function (event, callback) {
      return this.each(function () {
        const el = this;
        const map = listenerStore.get(el);
        if (!map) return;
        const arr = map.get(event);
        if (!arr) return;
        for (let i = arr.length - 1; i >= 0; i--) {
          if (!callback || arr[i].user === callback) {
            el.removeEventListener(event, arr[i].listener, false);
            arr.splice(i, 1);
          }
        }
        if (arr.length === 0) map.delete(event);
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
  
    // Properties that are unitless
    const UNITLESS_PROPS = new Set([
      "opacity", "zIndex", "fontWeight", "lineHeight", "order",
      "flexGrow", "flexShrink", "zoom"
    ]);

    function unitFor(prop, value) {
      if (UNITLESS_PROPS.has(prop)) return "";
      if (typeof value === "string") {
        const m = value.match(/[a-z%]+$/i);
        if (m) return m[0];
      }
      return "px";
    }

    /**
     * Animates CSS properties of the elements.
     * @param {Object} properties - CSS properties and target values.
     * @param {number} duration - Duration in milliseconds.
     * @param {function} [callback] - Called when animation completes.
     * @returns {GStime} For chaining.
     */
    GStime.prototype.animate = function (properties, duration, callback) {
      duration = Math.max(0, Number(duration) || 0);
      const start = performance.now();
      const units = {};
      for (const prop in properties) {
        units[prop] = unitFor(prop, properties[prop]);
      }
      const initialStyles = this.elements.map((el) =>
        Object.fromEntries(
          Object.keys(properties).map((prop) => [
            prop,
            parseFloat(getComputedStyle(el)[prop]) || 0,
          ])
        )
      );

      if (duration === 0) {
        this.elements.forEach((el) => {
          for (const prop in properties) {
            el.style[prop] = parseFloat(properties[prop]) + units[prop];
          }
        });
        if (typeof callback === "function") callback();
        return this;
      }

      const step = (timestamp) => {
        const progress = timestamp - start;
        const percent = Math.min(progress / duration, 1);

        this.elements.forEach((el, index) => {
          for (const prop in properties) {
            const initial = initialStyles[index][prop];
            const target = parseFloat(properties[prop]);
            const value = initial + (target - initial) * percent;
            el.style[prop] = value + units[prop];
          }
        });

        if (percent < 1) {
          requestAnimationFrame(step);
        } else if (typeof callback === "function") {
          callback();
        }
      };

      requestAnimationFrame(step);
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
     * @param {number} duration - Duration in milliseconds.
     * @param {function} [callback] - Callback on complete.
     * @returns {GStime} For chaining.
     */
    GStime.prototype.fadeIn = function (duration, callback) {
      this.each(function () {
        if (getComputedStyle(this).display === "none") this.style.display = "";
        this.style.opacity = "0";
      });
      return this.animate({ opacity: 1 }, duration, callback);
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
     * Performs a GET AJAX request.
     * @param {string} url - The URL for the request.
     * @param {Object} [data] - The data to send with the request.
     * @param {Object} [options] - Additional options for the request.
     * @returns {Promise} A promise that resolves with the response data.
     */
    GStime.get = function (url, data, options) {
      return GStime.ajax({
        url,
        method: "GET",
        data,
        ...options
      });
    };

    /**
     * Performs a POST AJAX request.
     * @param {string} url - The URL for the request.
     * @param {Object} data - The data to send with the request.
     * @param {Object} [options] - Additional options for the request.
     * @returns {Promise} A promise that resolves with the response data.
     */
    GStime.post = function (url, data, options) {
      return GStime.ajax({
        url,
        method: "POST",
        data,
        ...options
      });
    };

    /**
     * Performs a PUT AJAX request.
     * @param {string} url - The URL for the request.
     * @param {Object} data - The data to send with the request.
     * @param {Object} [options] - Additional options for the request.
     * @returns {Promise} A promise that resolves with the response data.
     */
    GStime.put = function (url, data, options) {
      return GStime.ajax({
        url,
        method: "PUT",
        data,
        ...options
      });
    };

    /**
     * Performs a DELETE AJAX request.
     * @param {string} url - The URL for the request.
     * @param {Object} [data] - The data to send with the request.
     * @param {Object} [options] - Additional options for the request.
     * @returns {Promise} A promise that resolves with the response data.
     */
    GStime.delete = function (url, data, options) {
      return GStime.ajax({
        url,
        method: "DELETE",
        data,
        ...options
      });
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

        const opts = Object.assign({
          method: "GET",
          headers: {},
          timeout: 0,
          credentials: "same-origin",
          mode: "cors",
        }, settings);

        if (opts.beforeSend && opts.beforeSend() === false) {
          reject(new Error("Request aborted by beforeSend callback"));
          return;
        }

        let url = opts.url;
        const fetchInit = {
          method: String(opts.method).toUpperCase(),
          headers: Object.assign({}, opts.headers),
          credentials: opts.credentials,
          mode: opts.mode,
        };
        if (opts.cache) fetchInit.cache = opts.cache;
        if (opts.redirect) fetchInit.redirect = opts.redirect;
        if (opts.referrer) fetchInit.referrer = opts.referrer;
        if (opts.integrity) fetchInit.integrity = opts.integrity;

        if (opts.data != null) {
          if (fetchInit.method === "GET" || fetchInit.method === "HEAD") {
            const qs = new URLSearchParams(opts.data).toString();
            url += (url.indexOf("?") >= 0 ? "&" : "?") + qs;
          } else if (opts.data instanceof FormData || opts.data instanceof Blob || opts.data instanceof ArrayBuffer || typeof opts.data === "string") {
            fetchInit.body = opts.data;
          } else if (typeof opts.data === "object") {
            const ct = fetchInit.headers["Content-Type"] || fetchInit.headers["content-type"];
            if (ct && /application\/x-www-form-urlencoded/i.test(ct)) {
              fetchInit.body = new URLSearchParams(opts.data).toString();
            } else if (ct && /multipart\/form-data/i.test(ct)) {
              const fd = new FormData();
              for (const k in opts.data) fd.append(k, opts.data[k]);
              fetchInit.body = fd;
              delete fetchInit.headers["Content-Type"];
              delete fetchInit.headers["content-type"];
            } else {
              if (!ct) fetchInit.headers["Content-Type"] = "application/json";
              fetchInit.body = JSON.stringify(opts.data);
            }
          } else {
            fetchInit.body = String(opts.data);
          }
        }

        let timeoutId;
        const controller = (typeof AbortController !== "undefined") ? new AbortController() : null;
        if (controller) fetchInit.signal = controller.signal;
        if (opts.timeout > 0 && controller) {
          timeoutId = setTimeout(() => controller.abort(), opts.timeout);
        }

        fetch(url, fetchInit)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("application/json")) return response.json();
            if (contentType.includes("xml")) {
              return response.text().then((str) => new DOMParser().parseFromString(str, "text/xml"));
            }
            if (contentType.startsWith("text/") || contentType.includes("javascript")) return response.text();
            return response.blob();
          })
          .then((data) => {
            if (typeof opts.success === "function") opts.success(data);
            resolve(data);
          })
          .catch((error) => {
            const err = (error && error.name === "AbortError")
              ? new Error(`Request timeout after ${opts.timeout}ms`)
              : error;
            if (typeof opts.error === "function") opts.error(err);
            reject(err);
          })
          .finally(() => {
            if (timeoutId) clearTimeout(timeoutId);
            if (typeof opts.complete === "function") opts.complete();
          });
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
      if (this.parentNode) this.parentNode.removeChild(this);
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

  /**
   * Slides up (hides) the matched elements.
   * @param {number} duration - The duration of the animation in milliseconds.
   * @param {function} [callback] - A function to call once the animation is complete.
   * @returns {GStime} The GStime object for chaining.
   */
  GStime.prototype.slideUp = function (duration, callback) {
    return this.each(function () {
      const el = this;
      const currentHeight = el.offsetHeight;
      
      // Store the original styles to restore later
      const originalStyles = {
        overflow: el.style.overflow,
        height: el.style.height,
        paddingTop: el.style.paddingTop,
        paddingBottom: el.style.paddingBottom,
        marginTop: el.style.marginTop,
        marginBottom: el.style.marginBottom
      };

      // Set initial state
      el.style.overflow = 'hidden';
      el.style.height = `${currentHeight}px`;
      
      // Start animation in next frame to ensure initial height is applied
      requestAnimationFrame(() => {
        el.style.height = '0px';
        el.style.paddingTop = '0px';
        el.style.paddingBottom = '0px';
        el.style.marginTop = '0px';
        el.style.marginBottom = '0px';
        el.style.transition = `height ${duration}ms, padding ${duration}ms, margin ${duration}ms`;
        
        let done = false;
        const finish = function () {
          if (done) return;
          done = true;
          el.style.display = 'none';
          for (const prop in originalStyles) el.style[prop] = originalStyles[prop];
          el.style.transition = '';
          el.removeEventListener('transitionend', onTransitionEnd);
          if (typeof callback === 'function') callback.call(el);
        };
        const onTransitionEnd = function (e) {
          if (e.target !== el || e.propertyName !== 'height') return;
          finish();
        };
        el.addEventListener('transitionend', onTransitionEnd);
        // Fallback if transitionend never fires (reduced motion, hidden tab, etc.)
        setTimeout(finish, duration + 50);
      });
    });
  };

  /**
   * Slides down (shows) the matched elements.
   * @param {number} duration - The duration of the animation in milliseconds.
   * @param {function} [callback] - A function to call once the animation is complete.
   * @returns {GStime} The GStime object for chaining.
   */
  GStime.prototype.slideDown = function (duration, callback) {
    return this.each(function () {
      const el = this;
      const prevDisplay = el.style.display;
      
      // Make sure the element is visible but with zero height
      el.style.overflow = 'hidden';
      if (getComputedStyle(el).display === 'none') el.style.display = 'block';
      el.style.height = '0px';
      el.style.paddingTop = '0px';
      el.style.paddingBottom = '0px';
      el.style.marginTop = '0px';
      el.style.marginBottom = '0px';
      
      // Get natural height
      const targetHeight = el.scrollHeight;
      
      // Start animation
      requestAnimationFrame(() => {
        el.style.transition = `height ${duration}ms, padding ${duration}ms, margin ${duration}ms`;
        el.style.height = `${targetHeight}px`;
        el.style.paddingTop = '';
        el.style.paddingBottom = '';
        el.style.marginTop = '';
        el.style.marginBottom = '';
        
        let done = false;
        const finish = function () {
          if (done) return;
          done = true;
          el.style.height = '';
          el.style.overflow = '';
          el.style.transition = '';
          if (prevDisplay) el.style.display = prevDisplay;
          el.removeEventListener('transitionend', onTransitionEnd);
          if (typeof callback === 'function') callback.call(el);
        };
        const onTransitionEnd = function (e) {
          if (e.target !== el || e.propertyName !== 'height') return;
          finish();
        };
        el.addEventListener('transitionend', onTransitionEnd);
        setTimeout(finish, duration + 50);
      });
    });
  };

  /**
   * Toggles between slideUp and slideDown for the matched elements.
   * @param {number} duration - The duration of the animation in milliseconds.
   * @param {function} [callback] - A function to call once the animation is complete.
   * @returns {GStime} The GStime object for chaining.
   */
  GStime.prototype.slideToggle = function (duration, callback) {
    return this.each(function () {
      const el = this;
      const isHidden = window.getComputedStyle(el).display === 'none';
      
      if (isHidden) {
        new GStime(el).slideDown(duration, callback);
      } else {
        new GStime(el).slideUp(duration, callback);
      }
    });
  };

  /**
   * Animates an element's color properties.
   * @param {Object} properties - An object of CSS color properties and their target values.
   * @param {number} duration - The duration of the animation in milliseconds.
   * @param {function} [callback] - A function to call once the animation is complete.
   * @returns {GStime} The GStime object for chaining.
   */
  GStime.prototype.colorAnimate = function (properties, duration, callback) {
    duration = Math.max(0, Number(duration) || 0);
    // Helper function to parse color values
    function parseColor(color) {
      if (!color || color === "transparent") return [0, 0, 0, 0];

      if (typeof color === "string" && color.startsWith('rgb')) {
        const nums = color.match(/[\d.]+/g);
        if (!nums) return [0, 0, 0, 1];
        const out = nums.map(Number);
        if (out.length === 3) out.push(1);
        return out;
      }

      if (typeof color === "string" && color.startsWith('#')) {
        if (color.length === 4) { // #RGB
          return [
            parseInt(color[1] + color[1], 16),
            parseInt(color[2] + color[2], 16),
            parseInt(color[3] + color[3], 16),
            1
          ];
        }
        if (color.length === 5) { // #RGBA
          return [
            parseInt(color[1] + color[1], 16),
            parseInt(color[2] + color[2], 16),
            parseInt(color[3] + color[3], 16),
            parseInt(color[4] + color[4], 16) / 255
          ];
        }
        if (color.length === 7) { // #RRGGBB
          return [
            parseInt(color.substring(1, 3), 16),
            parseInt(color.substring(3, 5), 16),
            parseInt(color.substring(5, 7), 16),
            1
          ];
        }
        if (color.length === 9) { // #RRGGBBAA
          return [
            parseInt(color.substring(1, 3), 16),
            parseInt(color.substring(3, 5), 16),
            parseInt(color.substring(5, 7), 16),
            parseInt(color.substring(7, 9), 16) / 255
          ];
        }
      }

      // Resolve named colors via the browser by painting into a temp element
      if (typeof document !== "undefined" && typeof color === "string") {
        const probe = document.createElement("div");
        probe.style.color = color;
        probe.style.display = "none";
        document.body.appendChild(probe);
        const computed = getComputedStyle(probe).color;
        document.body.removeChild(probe);
        if (computed && computed.startsWith("rgb")) {
          const nums = computed.match(/[\d.]+/g);
          if (nums) {
            const out = nums.map(Number);
            if (out.length === 3) out.push(1);
            return out;
          }
        }
      }
      return [0, 0, 0, 1];
    }

    function interpolateColor(start, end, percent) {
      return start.map((startValue, i) => {
        const endValue = end[i] != null ? end[i] : startValue;
        const v = startValue + (endValue - startValue) * percent;
        return i === 3 ? v : Math.round(v);
      });
    }

    const start = performance.now();
    // Map<prop, WeakMap<Element, [r,g,b,a]>>
    const initialStyles = {};

    this.elements.forEach((el) => {
      const elStyle = getComputedStyle(el);
      for (const prop in properties) {
        if (!initialStyles[prop]) initialStyles[prop] = new WeakMap();
        initialStyles[prop].set(el, parseColor(elStyle[prop]));
      }
    });

    const targets = {};
    for (const prop in properties) targets[prop] = parseColor(properties[prop]);

    const step = (timestamp) => {
      const progress = timestamp - start;
      const percent = duration === 0 ? 1 : Math.min(progress / duration, 1);

      this.elements.forEach((el) => {
        for (const prop in properties) {
          const initial = initialStyles[prop].get(el);
          const current = interpolateColor(initial, targets[prop], percent);
          el.style[prop] = `rgba(${current[0]}, ${current[1]}, ${current[2]}, ${current[3]})`;
        }
      });

      if (percent < 1) {
        requestAnimationFrame(step);
      } else if (typeof callback === "function") {
        callback();
      }
    };

    requestAnimationFrame(step);
    return this;
  };

  // noConflict shim: restore previous $ if any
  let _previous$;
  GStime.noConflict = function () {
    if (typeof window !== "undefined" && window.$ === apiWrapper) {
      window.$ = _previous$;
    }
    return apiWrapper;
  };

  function apiWrapper(selector) {
    return new GStime(selector);
  }
  // Allow `$.fn` like jQuery for plugin extension
  apiWrapper.fn = GStime.prototype;
  // Expose statics on the wrapper
  Object.keys(GStime).forEach((k) => { apiWrapper[k] = GStime[k]; });

  if (typeof window !== "undefined") {
    _previous$ = window.$;
  }

  return { GStime: GStime, $: apiWrapper };
});