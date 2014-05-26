#App Directory and File Structure

Although not required by any means, the following is suggested as a good start for your application's project directory. 

    www-root/
      index.html
      css/
        style.css             # your app's styles
      html/                   # your app's view templates
      img/                    # your app's images
      js/
        app.js                # Bootstrap
        app/
          main.js             # APP object (APP.start)
          factories/          # Object Factories
          models/             # Data models
          views/              # Views
          etc/
        lib/
          cultures/           # the cultures specific to jQuery/Globalize
          globalize.js        # if using localization
          q.js                # if using Q; I suggest the q.min.js, but renamed
          require.js
          text.js
          yasmf.css           # copy from YASMF's /dist
          yasmf.js            # non-minified version (useful for debugging and tracing); copy from YASMF's /dist
          yasmf.min.js        # minified version (smaller); copy from YASMF's /dist
          yasmf-assets/       # the images YASMF uses, copy from YASMF's /dist

## `index.html`

Loads `RequireJS` and any necessary CSS (including YASMF's CSS). Should essentially be devoid of content -- you will load this in via RequireJS and the view controllers provided by YASMF.

This is what a typical `index.html` file looks like:

	<!DOCTYPE html>
	<html>
	  <head>
	    <meta charset="utf-8" />
	    <meta name="apple-mobile-web-app-capable" content="yes" />
	    <meta name="viewport" content="width=device-width, maximum-scale=1.0" />
	    <meta name="format-detection" content="telephone=no" />
	    <link rel="stylesheet" type="text/css" href="js/lib/yasmf.css" />
	    <link rel="stylesheet" type="text/css" href="css/style.css" />
	    <title>Your app's title</title>
	  </head>
	  <body>
	    <!-- if using Cordova: -->
	    <script type="text/javascript" src="cordova.js"></script>
	    <!-- load app.js via require js -->
	    <script type="text/javascript" src="js/lib/require.js" data-main="js/app.js"></script>
	  </body>
	</html>

## `css` 

A `style.css` file can support most of the styles needed by the app. If you want to have styling specific to each view, you can have separate `.css` files, or you can have all the styles in the `style.css` file. 

## `html`

Any HTML for the app; typically these are templates used in creating views.

When using the `text` plugin provided by RequireJS be sure to include the `html` and `body` tags. The following is a good example of a view:

	<html>
	  <body>
	    <div class="ui-navigation-bar">
	      <div class="ui-title">%VIEW_TITLE%</div>
	      <div class="ui-bar-button-group ui-align-left">
	        <div class="ui-bar-button ui-tint-color ui-back-button">%BACK%</div>
	      </div>
	      <div class="ui-bar-button-group ui-align-right">
	        <div class="ui-bar-button ui-destructive-color">%DELETE%</div>
	      </div>
	    </div>
	    <div class="ui-scroll-container ui-avoid-navigation-bar ui-avoid-tool-bar">
	      %VIEW_CONTENTS%
	    </div>
	    <div class="ui-tool-bar">
	      <div class="ui-bar-button-group ui-align-left"></div>
	      <div class="ui-bar-button-group ui-align-center"></div>
	      <div class="ui-bar-button-group ui-align-right">
	        <div class="ui-bar-button ui-background-tint-color ui-glyph ui-glyph-share share-button"></div>
	      </div>
	    </div>
	  </body>
	</html>

The `%...%` represent substitution variables -- when using with `_y.template()` the desired values are substitued in to the template. 

## `img`

Your app's images.

## `js`

All the JavaScript code for your app (and supporting libraries) goes in here.


## `js/app.js` 

Consists of the necessary code to "bootstrap" the application. Configures RequireJS and then starts the app.

Typically looks like this:

	requirejs.config( {
	  // base is lib -- refer to your code using app, html, etc.
	  baseUrl: './js/lib',
	  // define app and html paths, and remap Q to q.
	  paths: {
	    'app': '../app',
	    'html': '../../html',
	    'Q': 'q'
	  },
	  // for cache-busting during development:
	  urlArgs: "bust=" + ( new Date() ).getTime(),  
	  shim: {
	    // need the cultures to load before globalize:
	    "cultures/globalize.culture.en-US": [ "globalize" ],
	    "cultures/globalize.culture.es-US": [ "globalize" ],
	    // Q exports... Q!
	    "Q": {
	      exports: "Q"
	    },
	    // YASMF depends on Q
	    "yasmf": [ "Q" ]
	  }
	} );
	
	// require YASMF, your application's start code, Q, and any
	// cultures your app needs.
	require( [ 'yasmf', 'app/main', 'Q', 
	  'cultures/globalize.culture.en-US',
	  'cultures/globalize.culture.es-US'
	], function( _y, APP, Q ) {
	  // start the app when the device/browser is ready:
	  _y.executeWhenReady( function() {
	    _y.getDeviceLocale( APP.start ) // set device locale, if available
	  } );
	} );

## `js/app` 

Your app goes here. The `app.js` file that resides here configures RequireJS and then calls `APP.start()` (or whatever you need to kick off the app).

## `js/app/main.js` 

Consists of the APP object, and at least the `start()` method. Usually `app.js` calls `APP.start()`.

A generic example is provided below:

	define( [ "yasmf", <your views> ], function( _y, <your views> ) {
	  var APP = {};
	  // APP.start is called when the app is ready to launch
	  APP.start = function() {
	    // find the rootContainer DOM element
	    //  - this is created automatically by YASMF for you
	    var rootContainer = _y.ge( "rootContainer" );
	    // create your first view
	    var aView = (new _y.UI.ViewContainer()).init();
	    // create a navigation controller and add the view
	    // and attach to the root container
	    var navigationController = new _y.UI.NavigationController({
	      rootView: aView,
	      parent: rootContainer
		    });
		  };
	    return APP;
	  });


## `js/app/factories` 

Object factories go here.

## `js/app/models` 

Your models go here.

## `js/app/views` 

Your view code goes here (the templates should be out in the `/www-root/html/` directory).

A typical view looks something like this:

	define( [ "yasmf",
	  "text!html/viewTemplate.html!strip", "hammer"
	], function( _y, viewHTML, Hammer ) {
	  var _className = "AView";
	  var AView = function() {
	    var self = new _y.UI.ViewContainer();
	    self.subclass( _className );
	
	    // our internal pointers to specific elements
	    self._backButton = null;
	    self._deleteButton = null;
	    self._shareButton = null;
	    
	    self.goBack = function() {
	      self.navigationController.popView()
	    };

	    self.overrideSuper( function render() {
	      return _y.template( viewHTML, {
	        "VIEW_TITLE": "The view title",
	        "VIEW_CONTENTS": "Hello!",
	        "BACK": "Back",
	        "DELETE": "Delete"
	      });
	    });
	    
	    self.override( function renderToElement() {
	      self.super( _className, "renderToElement" );
	      self._backButton = self.element.querySelector(
	        ".ui-navigation-bar .ui-bar-button-group.ui-align-left .ui-back-button" );
	      self._deleteButton = self.element.querySelector(
	        ".ui-navigation-bar .ui-bar-button-group.ui-align-right .ui-bar-button" );
	      Hammer( self._backButton ).on( "tap", self.goBack );
	      Hammer( self._deleteButton ).on( "tap", self.delete );
	      self._shareButton = self.element.querySelector( ".share-button" );
	      Hammer( self._shareButton ).on( "tap", self.share );
	    });

	    self.override( function init( theParentElement ) {
	      // call super
	      self.super( _className, "init", [ undefined, "div", 
	        self.class + " ui-container", theParentElement
	      ] );
	      // do other initialization
	      self.addListenerForNotification( "viewWasPushed", self.captureBackButton );
	      self.addListenerForNotification( "viewWasPopped", self.releaseBackButton );
	      self.addListenerForNotification( "viewWasPopped", self.destroy );
	      return self;
	    });
	    
	    self.override( function initWithOptions ( options ) {
	      var theParentElement;
	      if ( typeof options !== "undefined" ) {
	        if ( typeof options.parent !== "undefined" ) {
	          theParentElement = options.parent;
	        }
	      }
	      return self.init( theParentElement );
	    });
	    
	    self.captureBackButton = function() {
	    	_y.UI.backButton.addListenerForNotification( "backButtonPressed"), self.goBack );	    };
	    
	    self.releaseBackButton = function() {
	      _y.UI.backButton.removeListenerForNotification( "backButtonPressed", self.goBack );
	    };

	    self.override( function destroy() {
	      self.releaseBackButton();
	      
	      self.removeListenerForNotification ( "viewWasPushed", self.captureBackButton );
	      
	      // Stop listening for our disappearance
	      self.removeListenerForNotification( "viewWasPopped", self.releaseBackButton );
	      self.removeListenerForNotification( "viewWasPopped", self.destroy );
	      // release our objects
	      self._backButton = null;
	      self._deleteButton = null;
	      self._shareButton = null;
	      self.super( _className, "destroy" );
	    };
	    self._autoInit.apply( self, arguments );
	    return self;
	  });
	  return AView;
	} );

## `js/app/etc` 

Whatever folders you need to best categorize your app. 

## `js/lib` 

The libraries needed to support the application go here. This includes YASMF. Copy the files from the `/dist` folder to this folder -- you should end up with `yasmf.js`, `yasmf.min.js`, `yasmf.css`, and a `yasmf-assets` folder full of images. 

You don't need both versions of the YASMF script -- but it is useful during develoment should you need to trace through YASMF's code. 

Third party libraries also go here: `q.js`, `require.js`, `text.js`, `globalize.js`, etc.

If you use the globalization features of YASMF, the `cultures` directory from jQuery/Globalize also goes here.

