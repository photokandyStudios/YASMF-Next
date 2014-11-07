requirejs.config( {
  baseUrl: ".",
  paths: {
    "yasmf": "../lib/yasmf",
    "vendor": "../vendor",
    "globalize": "../vendor/globalize",
    "cultures": "../vendor/cultures",
    "text": "../vendor/text",
    "Q": "../vendor/q",
    "hammer": "../vendor/hammer",
    "app": "./js/app",
    "html": "./html"
  },
  urlArgs: "bust=" + ( new Date() ).getTime(),
  shim: {
    "cultures/globalize.culture.en-US": [ "globalize" ],
    "cultures/globalize.culture.es-US": [ "globalize" ],
    "Q": {
      exports: "Q"
    },
    "yasmf": [ "Q" ]
  }
} );
require( [ "yasmf", "app/main", "cultures/globalize.culture.es-US" ], function ( _y, APP ) {
  window._y = _y;
  window.APP = APP;
  APP.start();
} );