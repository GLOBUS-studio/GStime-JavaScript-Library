import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GStime, $ } from "../GStime.js";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("constructor / selectors", () => {
  it("selects by tag", () => {
    document.body.innerHTML = "<div></div><div></div>";
    expect($("div").elements.length).toBe(2);
  });

  it("creates a single element from HTML", () => {
    const g = $("<p class='x'>hi</p>");
    expect(g.elements.length).toBe(1);
    expect(g.elements[0].className).toBe("x");
  });

  it("creates multiple top-level elements from HTML", () => {
    const g = $("<li>a</li><li>b</li>");
    expect(g.elements.length).toBe(2);
  });

  it("wraps an Element", () => {
    const el = document.createElement("span");
    expect($(el).elements[0]).toBe(el);
  });

  it("returns empty for invalid selector without throwing", () => {
    expect($("###bad###").elements).toEqual([]);
  });

  it("wraps Document", () => {
    expect($(document).elements[0]).toBe(document);
  });

  it("constructor returns GStime instance for Window-like objects", () => {
    // Window wrapping depends on environment support
    expect($(window)).toBeInstanceOf(GStime);
  });

  it("wraps NodeList", () => {
    document.body.innerHTML = "<span></span><span></span>";
    const list = document.querySelectorAll("span");
    expect($(list).elements.length).toBe(2);
  });

  it("wraps HTMLCollection", () => {
    document.body.innerHTML = "<div></div><div></div>";
    const coll = document.getElementsByTagName("div");
    expect($(coll).elements.length).toBe(2);
  });

  it("wraps a plain Array of elements", () => {
    const a = document.createElement("i");
    const b = document.createElement("i");
    expect($([a, b]).elements).toEqual([a, b]);
  });

  it("$(function) calls ready shorthand", () => {
    const cb = vi.fn();
    $(cb);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("returns empty for null/undefined", () => {
    expect($(null).elements).toEqual([]);
    expect($(undefined).elements).toEqual([]);
  });

  it("createHTML handles whitespace", () => {
    const els = $("  <span></span>  ").elements;
    expect(els.length).toBe(1);
  });
});

describe("instance methods", () => {
  it("val() get/set", () => {
    document.body.innerHTML = "<input id='x' value='hello' />";
    expect($("#x").val()).toBe("hello");
    $("#x").val("world");
    expect($("#x").val()).toBe("world");
  });

  it("val() returns undefined for empty set", () => {
    expect($("#nonexistent").val()).toBeUndefined();
  });

  it("css() get computed style", () => {
    document.body.innerHTML = "<div id='x' style='color:red'></div>";
    const c = $("#x").css("color");
    expect(c).toBeTruthy();
  });

  it("css() set single property", () => {
    document.body.innerHTML = "<div id='x'></div>";
    $("#x").css("width", "100px");
    expect(document.getElementById("x").style.width).toBe("100px");
  });

  it("css() set object of properties", () => {
    document.body.innerHTML = "<div id='x'></div>";
    $("#x").css({ width: "50px", height: "30px" });
    const el = document.getElementById("x");
    expect(el.style.width).toBe("50px");
    expect(el.style.height).toBe("30px");
  });

  it("css() get returns undefined for empty set", () => {
    expect($("#none").css("color")).toBeUndefined();
  });

  it("hide/show via new implementation", () => {
    document.body.innerHTML = "<div id='x'></div>";
    $("#x").hide();
    expect(document.getElementById("x").style.display).toBe("none");
    $("#x").show();
    expect(document.getElementById("x").style.display).toBe("");
  });

  it("hide stores and show restores original display", () => {
    const el = document.createElement("div");
    el.style.display = "inline-flex";
    document.body.appendChild(el);
    $(el).hide();
    expect(el.style.display).toBe("none");
    $(el).show();
    expect(el.style.display).toBe("inline-flex");
    document.body.removeChild(el);
  });

  it("hide() no-ops on non-element nodes", () => {
    document.body.innerHTML = "<div id='x'></div>";
    // Construct a GStime containing a text node
    const txt = document.createTextNode("hello");
    document.getElementById("x").appendChild(txt);
    const g = $(txt);
    expect(() => g.hide()).not.toThrow();
  });

  it("toggle() with CSS-hidden element", () => {
    const el = document.createElement("div");
    el.style.display = "none";
    document.body.appendChild(el);
    $(el).toggle();
    expect(el.style.display).toBe("");
    $(el).toggle();
    expect(el.style.display).toBe("none");
    document.body.removeChild(el);
  });

  it("clone() with no elements returns empty GStime", () => {
    const g = $("#none");
    const c = g.clone();
    expect(c.elements).toEqual([]);
  });

  it("width() get/set", () => {
    document.body.innerHTML = "<div id='x'></div>";
    const w = $("#x").width();
    expect(typeof w).toBe("number");
    $("#x").width(300);
    expect(document.getElementById("x").style.width).toBe("300px");
  });

  it("width() set with string value", () => {
    document.body.innerHTML = "<div id='x'></div>";
    $("#x").width("50%");
    expect(document.getElementById("x").style.width).toBe("50%");
  });

  it("width() get returns undefined for empty set", () => {
    expect($("#none").width()).toBeUndefined();
  });

  it("height() get/set", () => {
    document.body.innerHTML = "<div id='x'></div>";
    expect(typeof $("#x").height()).toBe("number");
    $("#x").height(150);
    expect(document.getElementById("x").style.height).toBe("150px");
  });

  it("height() set with string value", () => {
    document.body.innerHTML = "<div id='x'></div>";
    $("#x").height("50vh");
    expect(document.getElementById("x").style.height).toBe("50vh");
  });

  it("height() get returns undefined for empty set", () => {
    expect($("#none").height()).toBeUndefined();
  });

  it("offset() returns coordinates", () => {
    document.body.innerHTML = "<div id='x' style='position:absolute;top:50px;left:100px'>x</div>";
    const off = $("#x").offset();
    expect(off).toBeDefined();
    expect(typeof off.top).toBe("number");
    expect(typeof off.left).toBe("number");
  });

  it("offset() returns undefined for empty set", () => {
    expect($("#none").offset()).toBeUndefined();
  });

  it("position() returns coordinates", () => {
    document.body.innerHTML = "<div id='x' style='position:relative;top:10px;left:20px'>x</div>";
    const pos = $("#x").position();
    expect(pos).toBeDefined();
    expect(typeof pos.top).toBe("number");
    expect(typeof pos.left).toBe("number");
  });

  it("position() returns undefined for empty set", () => {
    expect($("#none").position()).toBeUndefined();
  });

  it("each() iterates with correct context", () => {
    document.body.innerHTML = "<div class='x'>a</div><div class='x'>b</div>";
    const results = [];
    $(".x").each(function (i, el) {
      results.push({ i, tag: el.tagName, self: this === el });
    });
    expect(results.length).toBe(2);
    expect(results[0].self).toBe(true);
    expect(results[1].self).toBe(true);
  });

  it("on() with non-function callback is noop", () => {
    document.body.innerHTML = "<div id='x'></div>";
    const g = $("#x").on("click", "notafunction");
    expect(g.elements).toEqual($("#x").elements);
  });

  it("off() removes only matching callback", () => {
    document.body.innerHTML = "<button id='b'>x</button>";
    const a = vi.fn();
    const b = vi.fn();
    $("#b").on("click", a).on("click", b);
    $("#b").off("click", a);
    document.getElementById("b").click();
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("attr get returns null for missing attribute", () => {
    document.body.innerHTML = "<div id='x'></div>";
    expect($("#x").attr("data-missing")).toBeNull();
  });

  it("attr get returns undefined for empty set", () => {
    expect($("#none").attr("test")).toBeUndefined();
  });
});

describe("DOM methods", () => {
  it("html() get/set", () => {
    document.body.innerHTML = "<div id='x'>old</div>";
    expect($("#x").html()).toBe("old");
    $("#x").html("<b>new</b>");
    expect($("#x").html()).toBe("<b>new</b>");
  });

  it("append, prepend, before, after", () => {
    document.body.innerHTML = "<div id='c'><span>m</span></div>";
    $("#c").append("<i>e</i>").prepend("<i>s</i>");
    $("#c span").before("<b>b</b>").after("<b>a</b>");
    expect(document.getElementById("c").innerHTML).toBe(
      "<i>s</i><b>b</b><span>m</span><b>a</b><i>e</i>"
    );
  });

  it("addClass / removeClass / toggleClass / hasClass", () => {
    document.body.innerHTML = "<div id='x'></div>";
    $("#x").addClass("a").addClass("b");
    expect($("#x").hasClass("a")).toBe(true);
    $("#x").removeClass("a");
    expect($("#x").hasClass("a")).toBe(false);
    $("#x").toggleClass("c");
    expect($("#x").hasClass("c")).toBe(true);
  });

  it("attr get/set/remove", () => {
    document.body.innerHTML = "<a id='x'></a>";
    $("#x").attr("href", "/foo");
    expect($("#x").attr("href")).toBe("/foo");
    $("#x").removeAttr("href");
    expect($("#x").attr("href")).toBeNull();
  });

  it("remove() does not throw on detached elements", () => {
    const el = document.createElement("div");
    expect(() => $(el).remove()).not.toThrow();
  });

  it("clone() deep-clones", () => {
    document.body.innerHTML = "<div id='x'><span>a</span></div>";
    const c = $("#x").clone();
    expect(c.elements[0].outerHTML).toBe("<div id=\"x\"><span>a</span></div>");
    expect(c.elements[0]).not.toBe(document.getElementById("x"));
  });
});

describe("events", () => {
  it("on/off direct binding", () => {
    document.body.innerHTML = "<button id='b'>x</button>";
    const cb = vi.fn();
    $("#b").on("click", cb);
    document.getElementById("b").click();
    document.getElementById("b").click();
    expect(cb).toHaveBeenCalledTimes(2);
    $("#b").off("click", cb);
    document.getElementById("b").click();
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("delegated events fire for matching descendants only", () => {
    document.body.innerHTML =
      "<div id='c'><button class='ok'>1</button><span class='no'>x</span></div>";
    const cb = vi.fn();
    $("#c").on("click", ".ok", cb);
    document.querySelector(".ok").click();
    document.querySelector(".no").click();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("delegated events catch dynamically-added elements", () => {
    document.body.innerHTML = "<div id='c'></div>";
    const cb = vi.fn();
    $("#c").on("click", ".dyn", cb);
    document.getElementById("c").innerHTML = "<button class='dyn'>x</button>";
    document.querySelector(".dyn").click();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("delegated event proxy exposes currentTarget and delegateTarget", () => {
    document.body.innerHTML = "<div id='c'><button class='ok'>btn</button></div>";
    const cb = vi.fn(function (e) {
      expect(e.currentTarget.tagName).toBe("BUTTON");
      expect(e.delegateTarget).toBe(document.getElementById("c"));
      expect(typeof e.preventDefault).toBe("function");
    });
    $("#c").on("click", ".ok", cb);
    document.querySelector(".ok").click();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("off without callback removes all handlers for the event", () => {
    document.body.innerHTML = "<button id='b'>x</button>";
    const a = vi.fn();
    const b = vi.fn();
    $("#b").on("click", a);
    $("#b").on("click", b);
    $("#b").off("click");
    document.getElementById("b").click();
    expect(a).not.toHaveBeenCalled();
    expect(b).not.toHaveBeenCalled();
  });
});

describe("animations", () => {
  it("animate(opacity) emits unitless opacity values", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x' style='opacity:0'></div>";
      $("#x").animate({ opacity: 1 }, 30, () => {
        const op = document.getElementById("x").style.opacity;
        expect(op).toBe("1");
        resolve();
      });
    }));

  it("animate(width) emits px values", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x' style='width:0px'></div>";
      $("#x").animate({ width: 50 }, 30, () => {
        expect(document.getElementById("x").style.width).toBe("50px");
        resolve();
      });
    }));

  it("animate() with 0 duration sets final values immediately", () => {
    document.body.innerHTML = "<div id='x' style='width:10px'></div>";
    const cb = vi.fn();
    $("#x").animate({ width: 200 }, 0, cb);
    expect(document.getElementById("x").style.width).toBe("200px");
    expect(cb).toHaveBeenCalled();
  });

  it("animate() preserves existing unit in string values", () => {
    document.body.innerHTML = "<div id='x' style='width:0%'></div>";
    $("#x").animate({ width: "50%" }, 0);
    expect(document.getElementById("x").style.width).toBe("50%");
  });

  it("animate() no callback does not throw", () => {
    document.body.innerHTML = "<div id='x'></div>";
    expect(() => $("#x").animate({ opacity: 0.5 }, 10)).not.toThrow();
  });

  it("fadeOut() hides element after animation", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x'></div>";
      $("#x").fadeOut(10, () => {
        expect(document.getElementById("x").style.display).toBe("none");
        resolve();
      });
    }));

  it("fadeOut() without callback does not throw", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x'></div>";
      $("#x").fadeOut(10);
      setTimeout(resolve, 80);
    }));

  it("fadeIn() shows element", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x' style='display:none'></div>";
      $("#x").fadeIn(10, () => {
        const el = document.getElementById("x");
        expect(el.style.display).toBe("");
        resolve();
      });
    }));

  it("fadeIn() without callback does not throw", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x'></div>";
      $("#x").fadeIn(10);
      setTimeout(resolve, 80);
    }));

  it("slideUp() hides element", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x' style='height:50px'>test</div>";
      $("#x").slideUp(10, () => {
        expect(document.getElementById("x").style.display).toBe("none");
        resolve();
      });
    }));

  it("slideToggle() handles hidden element", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x' style='display:none;height:50px'>test</div>";
      $("#x").slideToggle(10, () => {
        const display = getComputedStyle(document.getElementById("x")).display;
        expect(display).not.toBe("none");
        resolve();
      });
    }));

  it("slideToggle() handles visible element via slideUp path", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x' style='height:50px'>test</div>";
      $("#x").slideToggle(10, () => {
        expect(document.getElementById("x").style.display).toBe("none");
        resolve();
      });
    }));

  it("colorAnimate handles multiple elements independently", () =>
    new Promise((resolve) => {
      document.body.innerHTML =
        "<div class='c' style='background-color: rgb(0,0,0)'></div>" +
        "<div class='c' style='background-color: rgb(255,255,255)'></div>";
      $(".c").colorAnimate({ backgroundColor: "rgb(128,128,128)" }, 30, () => {
        const els = document.querySelectorAll(".c");
        expect(els[0].style.backgroundColor).toMatch(/128/);
        expect(els[1].style.backgroundColor).toMatch(/128/);
        resolve();
      });
    }));

  it("colorAnimate with hex color", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x' style='background-color:#000000'></div>";
      $("#x").colorAnimate({ backgroundColor: "#ffffff" }, 20, () => {
        const val = document.getElementById("x").style.backgroundColor;
        expect(val).toMatch(/255/);
        resolve();
      });
    }));

  it("colorAnimate with named color", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x' style='background-color:red'></div>";
      $("#x").colorAnimate({ backgroundColor: "blue" }, 20, () => {
        const val = document.getElementById("x").style.backgroundColor;
        expect(val).toMatch(/0,\s*0,\s*255/);
        resolve();
      });
    }));

  it("colorAnimate with #RRGGBBAA format", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x' style='background-color:#ff0000ff'></div>";
      $("#x").colorAnimate({ backgroundColor: "#00000000" }, 20, () => {
        const val = document.getElementById("x").style.backgroundColor;
        expect(val).toMatch(/rgba\(0,\s*0,\s*0,\s*0\)/);
        resolve();
      });
    }));

  it("colorAnimate with #RGB shorthand", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x' style='background-color:#000'></div>";
      $("#x").colorAnimate({ backgroundColor: "#fff" }, 20, () => {
        const val = document.getElementById("x").style.backgroundColor;
        expect(val).toMatch(/255/);
        resolve();
      });
    }));

  it("colorAnimate with #RGBA shorthand", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x' style='background-color:#f00f'></div>";
      $("#x").colorAnimate({ backgroundColor: "#0f0f" }, 20, () => {
        const val = document.getElementById("x").style.backgroundColor;
        expect(val).toMatch(/0,\s*255,\s*0/);
        resolve();
      });
    }));

  it("colorAnimate with transparent color", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x' style='background-color:transparent'></div>";
      $("#x").colorAnimate({ backgroundColor: "rgb(255,0,0)" }, 20, () => {
        const val = document.getElementById("x").style.backgroundColor;
        expect(val).toMatch(/255,\s*0,\s*0/);
        resolve();
      });
    }));

  it("colorAnimate with 0 duration fires callback with final color", () =>
    new Promise((resolve) => {
      document.body.innerHTML = "<div id='x' style='background-color:#000'></div>";
      $("#x").colorAnimate({ backgroundColor: "#fff" }, 0, () => {
        const val = document.getElementById("x").style.backgroundColor;
        expect(val).toMatch(/255/);
        resolve();
      });
    }));

  it("colorAnimate without callback does not throw", () => {
    document.body.innerHTML = "<div id='x' style='background-color:#000'></div>";
    expect(() =>
      $("#x").colorAnimate({ backgroundColor: "#fff" }, 10)
    ).not.toThrow();
  });

  it("colorAnimate handles invalid color gracefully", () => {
    document.body.innerHTML = "<div id='x' style='background-color:notacolor'></div>";
    expect(() =>
      $("#x").colorAnimate({ backgroundColor: "alsonot" }, 10)
    ).not.toThrow();
  });
});

describe("ajax", () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("rejects when url is missing", async () => {
    await expect(GStime.ajax({})).rejects.toThrow(/URL is required/);
  });

  it("rejects when beforeSend returns false", async () => {
    await expect(
      GStime.ajax({
        url: "/x",
        beforeSend: () => false,
      })
    ).rejects.toThrow(/aborted by beforeSend/);
  });

  it("performs a JSON GET request", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({ ok: 1 }),
      })
    );
    const data = await GStime.get("/api", { a: 1 });
    expect(data).toEqual({ ok: 1 });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api?a=1",
      expect.objectContaining({ method: "GET" })
    );
  });

  it("GET appends to existing query string", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, headers: { get: () => "text/plain" }, text: () => Promise.resolve("") })
    );
    await GStime.get("/api?x=1", { a: 2 });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api?x=1&a=2"),
      expect.anything()
    );
  });

  it("aborts on timeout", async () => {
    globalThis.fetch = vi.fn(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener("abort", () => {
            const err = new Error("aborted");
            err.name = "AbortError";
            reject(err);
          });
        })
    );
    await expect(GStime.ajax({ url: "/x", timeout: 10 })).rejects.toThrow(
      /timeout/
    );
  });

  it("sends JSON body for POST objects", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({}),
      })
    );
    await GStime.post("/x", { a: 1 });
    const init = globalThis.fetch.mock.calls[0][1];
    expect(init.body).toBe('{"a":1}');
    expect(init.headers["Content-Type"]).toBe("application/json");
  });

  it("sends FormData body when content-type is multipart", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, headers: { get: () => "application/json" }, json: () => Promise.resolve({}) })
    );
    await GStime.ajax({
      url: "/x",
      method: "POST",
      data: { a: 1 },
      headers: { "Content-Type": "multipart/form-data" },
    });
    const init = globalThis.fetch.mock.calls[0][1];
    expect(init.body).toBeInstanceOf(FormData);
  });

  it("sends URL-encoded body for x-www-form-urlencoded", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, headers: { get: () => "application/json" }, json: () => Promise.resolve({}) })
    );
    await GStime.ajax({
      url: "/x",
      method: "POST",
      data: { a: 1, b: 2 },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const init = globalThis.fetch.mock.calls[0][1];
    expect(init.body).toBe("a=1&b=2");
  });

  it("sends Blob body as-is", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, headers: { get: () => "application/json" }, json: () => Promise.resolve({}) })
    );
    const blob = new Blob(["test"]);
    await GStime.ajax({ url: "/x", method: "POST", data: blob });
    const init = globalThis.fetch.mock.calls[0][1];
    expect(init.body).toBe(blob);
  });

  it("sends string body as-is", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, headers: { get: () => "text/plain" }, text: () => Promise.resolve("ok") })
    );
    await GStime.ajax({ url: "/x", method: "POST", data: "raw data" });
    const init = globalThis.fetch.mock.calls[0][1];
    expect(init.body).toBe("raw data");
  });

  it("converts non-object data to string for POST", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, headers: { get: () => "text/plain" }, text: () => Promise.resolve("ok") })
    );
    await GStime.ajax({ url: "/x", method: "POST", data: 12345 });
    const init = globalThis.fetch.mock.calls[0][1];
    expect(init.body).toBe("12345");
  });

  it("calls success and complete callbacks", async () => {
    const success = vi.fn();
    const complete = vi.fn();
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({ ok: 1 }),
      })
    );
    const result = await GStime.ajax({ url: "/x", success, complete });
    expect(result).toEqual({ ok: 1 });
    // Wait for microtask to flush complete callback
    await new Promise((r) => setTimeout(r, 0));
    expect(success).toHaveBeenCalledWith({ ok: 1 });
    expect(complete).toHaveBeenCalled();
  });

  it("calls error callback on failure", async () => {
    const errorCb = vi.fn();
    globalThis.fetch = vi.fn(() =>
      Promise.reject(new Error("network failure"))
    );
    await expect(
      GStime.ajax({ url: "/x", error: errorCb })
    ).rejects.toThrow("network failure");
    expect(errorCb).toHaveBeenCalled();
  });

  it("handles HTTP error status", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        headers: { get: () => "" },
      })
    );
    await expect(GStime.ajax({ url: "/x" })).rejects.toThrow(/404/);
  });

  it("returns XML as parsed document", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: { get: () => "application/xml" },
        text: () => Promise.resolve("<root><a>1</a></root>"),
      })
    );
    const data = await GStime.ajax({ url: "/x" });
    expect(data).toBeInstanceOf(Document);
  });

  it("returns text for text/plain content-type", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: { get: () => "text/plain" },
        text: () => Promise.resolve("hello"),
      })
    );
    const data = await GStime.ajax({ url: "/x" });
    expect(data).toBe("hello");
  });

  it("returns blob for unknown content-type", async () => {
    const blob = new Blob(["data"]);
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: { get: () => "application/octet-stream" },
        blob: () => Promise.resolve(blob),
      })
    );
    const data = await GStime.ajax({ url: "/x" });
    expect(data).toBe(blob);
  });

  it("shortcut methods put/delete", async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({}),
      })
    );
    await GStime.put("/x", { a: 1 });
    expect(globalThis.fetch.mock.calls[0][1].method).toBe("PUT");
    await GStime.delete("/x");
    expect(globalThis.fetch.mock.calls[1][1].method).toBe("DELETE");
  });
});

describe("noConflict", () => {
  it("restores previous window.$", () => {
    const prev = window.$;
    const restored = GStime.noConflict();
    expect(window.$).toBe(prev);
    // restore for subsequent tests
    window.$ = restored;
  });

  it("returns the $ wrapper", () => {
    const result = GStime.noConflict();
    expect(typeof result).toBe("function");
    window.$ = result;
  });
});

describe("static utilities", () => {
  it("GStime.each for arrays", () => {
    const cb = vi.fn();
    const arr = [10, 20];
    const result = GStime.each(arr, cb);
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb.mock.calls[0][0]).toBe(0);
    expect(cb.mock.calls[0][1]).toBe(10);
    expect(result).toBe(arr);
  });

  it("GStime.each for objects", () => {
    const cb = vi.fn();
    const obj = { a: 1, b: 2 };
    GStime.each(obj, cb);
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb.mock.calls[0][0]).toBe("a");
    expect(cb.mock.calls[0][1]).toBe(1);
  });

  it("GStime.map for arrays", () => {
    const result = GStime.map([1, 2, 3], (v) => v * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  it("GStime.map for objects", () => {
    const result = GStime.map({ a: 1, b: 2 }, (k, v) => v * 10);
    expect(result).toEqual({ a: 10, b: 20 });
  });

  it("GStime.ready calls callback immediately if DOM already loaded", () => {
    const cb = vi.fn();
    GStime.ready(cb);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("GStime.ready waits for DOMContentLoaded if page is still loading", () => {
    const originalReadyState = document.readyState;
    Object.defineProperty(document, "readyState", {
      value: "loading",
      configurable: true,
    });
    const cb = vi.fn();
    GStime.ready(cb);
    expect(cb).not.toHaveBeenCalled();
    // Fire the event
    document.dispatchEvent(new Event("DOMContentLoaded"));
    expect(cb).toHaveBeenCalledTimes(1);
    // Restore
    Object.defineProperty(document, "readyState", {
      value: originalReadyState,
      configurable: true,
    });
  });

  it("GStime.each for objects skips inherited properties", () => {
    const parent = { inherited: true };
    const child = Object.create(parent);
    child.own = "value";
    const cb = vi.fn();
    GStime.each(child, cb);
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe("traversal", () => {
  it("parent / children / siblings / find / closest", () => {
    document.body.innerHTML =
      "<ul id='u'><li class='a'>1</li><li class='b'>2</li><li>3</li></ul>";
    expect($(".a").parent().elements[0].id).toBe("u");
    expect($("#u").children().elements.length).toBe(3);
    expect($(".a").siblings().elements.length).toBe(2);
    expect($("#u").find("li.b").elements.length).toBe(1);
    expect($(".a").closest("ul").elements[0].id).toBe("u");
  });

  it("siblings() should not throw on detached elements", () => {
    const el = document.createElement("div");
    const detached = $(el);
    expect(() => detached.siblings()).not.toThrow();
    expect(detached.siblings().elements).toEqual([]);
  });
});

describe("bugfix: show/hide and toggle", () => {
  it("show() restores original inline display after hide()", () => {
    const el = document.createElement("div");
    el.style.display = "inline-flex";
    document.body.appendChild(el);
    expect(el.style.display).toBe("inline-flex");
    $(el).hide();
    expect(el.style.display).toBe("none");
    $(el).show();
    expect(el.style.display).toBe("inline-flex");
    document.body.removeChild(el);
  });

  it("toggle() checks computed style, not just inline", () => {
    const el = document.createElement("div");
    el.style.display = "none";
    document.body.appendChild(el);
    // Toggle should show it (computed is none)
    $(el).toggle();
    expect(el.style.display).not.toBe("none");
    // Toggle again should hide it
    $(el).toggle();
    expect(el.style.display).toBe("none");
    document.body.removeChild(el);
  });
});

describe("bugfix: slideDown display", () => {
  it("slideDown should not force display:block on inline elements", (done) => {
    const span = document.createElement("span");
    span.textContent = "test";
    span.style.display = "none";
    document.body.appendChild(span);
    $(span).slideDown(10, function () {
      const display = getComputedStyle(span).display;
      expect(display).not.toBe("none");
      expect(display).not.toBe("block");
      document.body.removeChild(span);
      done();
    });
  });

  it("slideDown forces block when hidden via CSS stylesheet", (done) => {
    const style = document.createElement("style");
    style.textContent = ".hidden-by-css { display: none }";
    document.head.appendChild(style);
    const div = document.createElement("div");
    div.className = "hidden-by-css";
    div.textContent = "test";
    document.body.appendChild(div);
    $(div).slideDown(10, function () {
      expect(getComputedStyle(div).display).toBe("block");
      document.body.removeChild(div);
      document.head.removeChild(style);
      done();
    });
  });

  it("slideDown restores non-none inline display after animation", (done) => {
    const div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.display = "none"; // was inline-block before hide
    document.body.appendChild(div);
    // Simulate: element had display:inline-block before being hidden via inline style
    // We set display to none, then slideDown should not restore none
    $(div).slideDown(10, function () {
      // After animation, display should not be restored to "none"
      expect(div.style.display).not.toBe("none");
      document.body.removeChild(div);
      done();
    });
  });

  it("slideDown fires callback via fallback timeout when transitionend does not fire", (done) => {
    const div = document.createElement("div");
    div.style.display = "none";
    div.textContent = "test";
    document.body.appendChild(div);
    // transitionend won't fire in jsdom, but setTimeout fallback will
    $(div).slideDown(5, function () {
      expect(div.style.display).not.toBe("none");
      document.body.removeChild(div);
      done();
    });
  });

});

describe("bugfix: slide transitionend handlers", () => {
  it("slideUp transitionend with propertyName height fires callback", () =>
    new Promise((resolve) => {
      const div = document.createElement("div");
      div.style.height = "50px";
      div.textContent = "test";
      document.body.appendChild(div);
      $(div).slideUp(100, function () {
        document.body.removeChild(div);
        resolve();
      });
      // Dispatch transitionend to trigger the handler path
      setTimeout(() => {
        const evt = new Event("transitionend");
        Object.defineProperty(evt, "propertyName", { value: "height", configurable: true });
        Object.defineProperty(evt, "target", { value: div, configurable: true });
        div.dispatchEvent(evt);
      }, 20);
    }));

  it("slideDown transitionend with propertyName height fires callback", () =>
    new Promise((resolve) => {
      const div = document.createElement("div");
      div.style.display = "none";
      div.textContent = "test";
      document.body.appendChild(div);
      $(div).slideDown(100, function () {
        document.body.removeChild(div);
        resolve();
      });
      setTimeout(() => {
        const evt = new Event("transitionend");
        Object.defineProperty(evt, "propertyName", { value: "height", configurable: true });
        Object.defineProperty(evt, "target", { value: div, configurable: true });
        div.dispatchEvent(evt);
      }, 20);
    }));
});
