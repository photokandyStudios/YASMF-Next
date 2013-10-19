requirejs.config({
  baseUrl: '.',
  paths: {
    'yasmf': '../lib/yasmf',
    'vendor': '../vendor',
    'globalize': '../vendor/globalize',
    'cultures': '../vendor/cultures',
    'Q': '../vendor/q'
  },
  urlArgs: "bust=" + (new Date()).getTime(),
  shim: {
    "cultures/globalize.culture.en-US": ["globalize"],
    "cultures/globalize.culture.es-US": ["globalize"],
    "Q": { exports: "Q" }
  }
});

require(['yasmf', 'cultures/globalize.culture.es-US'], function ( _y, cES) {
  window._y = _y;
});
