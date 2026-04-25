// Type definitions for GStime 2.0.0

export interface AjaxSettings {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | string;
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  referrer?: string;
  integrity?: string;
  beforeSend?: () => boolean | void;
  success?: (data: unknown) => void;
  error?: (error: Error) => void;
  complete?: () => void;
}

export interface Offset {
  top: number;
  left: number;
}

export type GStimeSelector =
  | string
  | Element
  | Document
  | Window
  | NodeList
  | HTMLCollection
  | Element[]
  | (() => void)
  | null
  | undefined;

export class GStime {
  constructor(selector?: GStimeSelector);
  elements: Element[];

  createHTML(html: string): Element[];
  each(callback: (this: Element, index: number, el: Element) => void): this;

  on(event: string, callback: (this: Element, e: Event) => void): this;
  on(event: string, selector: string, callback: (this: Element, e: Event) => void): this;
  off(event: string, callback?: (this: Element, e: Event) => void): this;

  val(): string | undefined;
  val(newVal: string): this;

  append(html: string): this;
  prepend(html: string): this;
  before(html: string): this;
  after(html: string): this;
  remove(): this;

  html(): string | undefined;
  html(html: string): this;

  css(prop: string): string | undefined;
  css(prop: string, value: string | number): this;
  css(properties: Record<string, string | number>): this;

  hide(): this;
  show(): this;
  toggle(): this;
  clone(): GStime;

  animate(properties: Record<string, number | string>, duration: number, callback?: () => void): this;
  fadeIn(duration: number, callback?: () => void): this;
  fadeOut(duration: number, callback?: () => void): this;
  slideUp(duration: number, callback?: (this: Element) => void): this;
  slideDown(duration: number, callback?: (this: Element) => void): this;
  slideToggle(duration: number, callback?: (this: Element) => void): this;
  colorAnimate(properties: Record<string, string>, duration: number, callback?: () => void): this;

  hasClass(className: string): boolean;
  addClass(className: string): this;
  removeClass(className: string): this;
  toggleClass(className: string): this;

  attr(name: string): string | null | undefined;
  attr(name: string, value: string): this;
  removeAttr(name: string): this;

  width(): number | undefined;
  width(value: number | string): this;
  height(): number | undefined;
  height(value: number | string): this;

  offset(): Offset | undefined;
  position(): Offset | undefined;

  parent(): GStime;
  children(): GStime;
  siblings(): GStime;
  find(selector: string): GStime;
  closest(selector: string): GStime;

  static ajax(settings: AjaxSettings): Promise<unknown>;
  static get(url: string, data?: unknown, options?: Partial<AjaxSettings>): Promise<unknown>;
  static post(url: string, data?: unknown, options?: Partial<AjaxSettings>): Promise<unknown>;
  static put(url: string, data?: unknown, options?: Partial<AjaxSettings>): Promise<unknown>;
  static delete(url: string, data?: unknown, options?: Partial<AjaxSettings>): Promise<unknown>;

  static each<T>(obj: T[] | Record<string, T>, callback: (this: T, key: string | number, value: T) => void): typeof obj;
  static map<T, U>(obj: T[], callback: (value: T, index: number) => U): U[];
  static map<T, U>(obj: Record<string, T>, callback: (this: T, key: string, value: T) => U): Record<string, U>;
  static ready(callback: () => void): void;
  static noConflict(): GStimeFactory;
}

export interface GStimeFactory {
  (selector?: GStimeSelector): GStime;
  fn: GStime;
  ajax: typeof GStime.ajax;
  get: typeof GStime.get;
  post: typeof GStime.post;
  put: typeof GStime.put;
  delete: typeof GStime.delete;
  each: typeof GStime.each;
  map: typeof GStime.map;
  ready: typeof GStime.ready;
  noConflict: typeof GStime.noConflict;
}

declare const _default: { GStime: typeof GStime; $: GStimeFactory };
export default _default;
export const $: GStimeFactory;

declare global {
  interface Window {
    GStime: typeof GStime;
    $: GStimeFactory;
  }
}
