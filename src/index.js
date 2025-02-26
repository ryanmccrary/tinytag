import { EventQueue } from './queue.js';
import { setCookie, getCookie, getAnalyticsCookie, generateId } from './cookie.js';
import { sendEvent } from './http.js';
import { version } from '../package.json';

// Define TinyTag class
function TinyTag() {
  this.queue = new EventQueue();
  this.writeKey = null;
  this.dataPlaneUrl = null;
  this.initialized = false;

  // Explicitly set window.tt with methods and preserve pre-init queue
  window.tt = {
    _q: window.tt && window.tt._q ? window.tt._q : [],
    page: this.page.bind(this),
    track: this.track.bind(this),
    identify: this.identify.bind(this),
    group: this.group.bind(this),
    init: this.init.bind(this)
  };

  // Process pre-init queue
  const preQueue = window.tt._q || [];
  preQueue.forEach(([method, ...args]) => this[method](...args));
  window.tt._q = [];
}

TinyTag.prototype.init = async function ({ writeKey, dataPlaneUrl }) {
  this.writeKey = writeKey;
  this.dataPlaneUrl = dataPlaneUrl;
  this.initialized = true;
  await this.flush();
};

TinyTag.prototype.parseQueryParams = function () {
  const params = new URLSearchParams(window.location.search);
  const campaign = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
    if (params.has(key)) campaign[key.replace('utm_', '')] = params.get(key);
  });
  return Object.keys(campaign).length ? campaign : undefined;
};

TinyTag.prototype.getDefaultContext = function () {
  const initialReferrer = document.referrer || null; // Initial referrer from page load
  const referrer = document.referrer || null; // Current referrer (same as initial for single-page)
  const hostname = window.location.hostname;

  return {
    library: {
      name: 'TinyTag',
      version: version
    },
    locale: navigator.language || navigator.userLanguage || '',
    page: {
      initial_referrer: initialReferrer,
      initial_referring_domain: initialReferrer ? new URL(initialReferrer).hostname : null,
      path: window.location.pathname,
      referrer: referrer,
      referring_domain: referrer ? new URL(referrer).hostname : null,
      search: window.location.search,
      tab_url: window.location.href,
      title: document.title,
      url: window.location.href
    },
    userAgent: navigator.userAgent,
    screen: {
      density: window.devicePixelRatio || 1,
      height: window.screen.height,
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      width: window.screen.width
    },
    timestamp: new Date().toISOString(),
    page: {
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer
    }
  };
};

TinyTag.prototype.page = function (name, properties = {}) {
  const event = {
    type: 'page',
    name,
    anonymousId: this.getAnonymousId(),
    userId: this.getUserId(),
    properties,
    context: this.getDefaultContext()
  };
  this.queue.push(event);
  this.flush();
};

TinyTag.prototype.track = function (eventName, properties = {}) {
  const event = {
    type: 'track',
    event: eventName,
    anonymousId: this.getAnonymousId(),
    userId: this.getUserId(),
    properties,
    context: this.getDefaultContext()
  };
  this.queue.push(event);
  this.flush();
};

TinyTag.prototype.identify = function (userId, traits = {}) {
  setCookie('userId', userId);
  setCookie('traits', JSON.stringify(traits));
  const event = {
    type: 'identify',
    userId,
    anonymousId: this.getAnonymousId(),
    traits: { ...this.getTraits(), ...traits },
    context: this.getDefaultContext()
  };
  this.queue.push(event);
  this.flush();
};

TinyTag.prototype.group = function (groupId, traits = {}) {
  const event = {
    type: 'group',
    groupId,
    anonymousId: this.getAnonymousId(),
    userId: this.getUserId(),
    traits,
    context: this.getDefaultContext()
  };
  this.queue.push(event);
  this.flush();
};

TinyTag.prototype.getAnonymousId = function () {
  let anonId = getAnalyticsCookie('anonymous_id', 'anonymousId');
  if (!anonId) {
    anonId = generateId();
    setCookie('anonymousId', anonId);
  }
  return anonId;
};

TinyTag.prototype.getUserId = function () {
  return getAnalyticsCookie('user_id', 'userId');
};

TinyTag.prototype.getTraits = function () {
  const traitsCookie = getAnalyticsCookie('trait', 'traits');
  return traitsCookie ? JSON.parse(traitsCookie) : {};
};

TinyTag.prototype.flush = async function () {
  if (!this.initialized || this.queue.isEmpty()) return;

  const event = this.queue.shift();
  const success = await sendEvent(this.dataPlaneUrl, this.writeKey, event);
  if (!success) {
    this.queue.retry(event);
  }
  if (!this.queue.isEmpty()) {
    setTimeout(() => this.flush(), 100);
  }
};

// Initialize TinyTag
new TinyTag();

// Export for tests
export default TinyTag;