requirejs.config({
  baseUrl: '.',
  paths: {
    'yasmf': '../lib/yasmf',
    'vendor': '../vendor',
    'globalize': '../vendor/globalize',
    'cultures': '../vendor/cultures'
  },
  urlArgs: "bust=" + (new Date()).getTime(),
  shim: {
    "cultures/globalize.culture.en-US": ["globalize"],
    "cultures/globalize.culture.es-US": ["globalize"]
  }
});

require(['yasmf', 'cultures/globalize.culture.es-US'], function ( _y, cES) {
  window._y = _y;
});
