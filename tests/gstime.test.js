import { describe, it, expect, beforeEach, vi } from "vitest";
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
});

describe("ajax", () => {
  it("rejects when url is missing", async () => {
    await expect(GStime.ajax({})).rejects.toThrow(/URL is required/);
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
});

describe("noConflict", () => {
  it("restores previous window.$", () => {
    const prev = window.$;
    const restored = GStime.noConflict();
    expect(window.$).toBe(prev);
    // restore for subsequent tests
    window.$ = restored;
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
});
