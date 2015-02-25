(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g._y = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = window.Q;

},{}],2:[function(require,module,exports){
/**
 *
 * # YASMF-Next (Yet Another Simple Mobile Framework Next Gen)
 *
 * YASMF-Next is the successor to the YASMF framework. While that framework was useful
 * and usable even in a production environment, as my experience has grown, it became
 * necessary to re-architect the entire framework in order to provide a modern
 * mobile framework.
 *
 * YASMF-Next is the result. It's young, under active development, and not at all
 * compatible with YASMF v0.2. It uses all sorts of more modern technologies such as
 * SASS for CSS styling, AMD, etc.
 *
 * YASMF-Next is intended to be a simple and fast framework for mobile and desktop
 * devices. It provides several utility functions and also provides a UI framework.
 *
 * @module _y
 * @author Kerri Shotts
 * @version 0.4
 *
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*global module, require*/
"use strict";

/* UTIL */
var _y = require( "./yasmf/util/core" );
_y.datetime = require( "./yasmf/util/datetime" );
_y.filename = require( "./yasmf/util/filename" );
_y.misc = require( "./yasmf/util/misc" );
_y.device = require( "./yasmf/util/device" );
_y.BaseObject = require( "./yasmf/util/object" );
_y.FileManager = require( "./yasmf/util/fileManager" );
_y.h = require( "yasmf-h" );
_y.h.BaseObject = _y.BaseObject;
_y.Router = require( "./yasmf/util/router" );

/* UI */
_y.UI = require( "./yasmf/ui/core" );
_y.UI.event = require( "./yasmf/ui/event" );
_y.UI.ViewContainer = require( "./yasmf/ui/viewContainer" );
_y.UI.NavigationController = require( "./yasmf/ui/navigationController" );
_y.UI.SplitViewController = require( "./yasmf/ui/splitViewController" );
_y.UI.TabViewController = require( "./yasmf/ui/tabViewController" );
_y.UI.Alert = require( "./yasmf/ui/alert" );
_y.UI.Spinner = require( "./yasmf/ui/spinner" );

/* TEMPLATES */
_y.UI.templates = {};
_y.UI.templates.uiBarButton = require( "./yasmf/ui/templates/uiBarButton" );
_y.UI.templates.uiNavigationBar = require( "./yasmf/ui/templates/uiNavigationBar" );

module.exports = _y;

},{"./yasmf/ui/alert":3,"./yasmf/ui/core":4,"./yasmf/ui/event":5,"./yasmf/ui/navigationController":6,"./yasmf/ui/spinner":7,"./yasmf/ui/splitViewController":8,"./yasmf/ui/tabViewController":9,"./yasmf/ui/templates/uiBarButton":10,"./yasmf/ui/templates/uiNavigationBar":11,"./yasmf/ui/viewContainer":12,"./yasmf/util/core":13,"./yasmf/util/datetime":14,"./yasmf/util/device":15,"./yasmf/util/fileManager":16,"./yasmf/util/filename":17,"./yasmf/util/misc":18,"./yasmf/util/object":19,"./yasmf/util/router":20,"yasmf-h":21}],3:[function(require,module,exports){
/**
 *
 * Provides native-like alert methods, including prompts and messages.
 *
 * @module alert.js
 * @author Kerri Shotts
 * @version 0.4
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module*/
var _y = require( "../util/core" ),
  theDevice = require( "../util/device" ),
  BaseObject = require( "../util/object" ),
  UI = require( "./core" ),
  Q = require( "../../q" ),
  event = require( "./event" ),
  h = require( "yasmf-h" );
"use strict";
var _className = "Alert";
var Alert = function () {
  var self = new BaseObject();
  self.subclass( _className );
  /*
   * # Notifications
   *
   * * `buttonTapped` indicates which button was tapped when the view is dismissing
   * * `dismissed` indicates that the alert was dismissed (by user or code)
   */
  self.registerNotification( "buttonTapped" );
  self.registerNotification( "dismissed" );
  /**
   * The title to show in the alert.
   * @property title
   * @type {String}
   */
  self._titleElement = null; // the corresponding DOM element
  self.setTitle = function ( theTitle ) {
    self._title = theTitle;
    if ( self._titleElement !== null ) {
      if ( typeof self._titleElement.textContent !== "undefined" ) {
        self._titleElement.textContent = theTitle;
      } else {
        self._titleElement.innerHTML = theTitle;
      }
    }
  };
  self.defineProperty( "title", {
    read:    true,
    write:   true,
    default: _y.T( "ALERT" )
  } );
  /**
   * The body of the alert. Leave blank if you don't need to show
   * anything more than the title.
   * @property text
   * @type {String}
   */
  self._textElement = null;
  self.setText = function ( theText ) {
    self._text = theText;
    if ( self._textElement !== null ) {
      if ( typeof theText !== "object" ) {
        if ( typeof self._textElement.textContent !== "undefined" ) {
          self._textElement.textContent = ( "" + theText ).replace( /\<br\w*\/\>/g, "\r\n" );
        } else {
          self._textElement.innerHTML = theText;
        }
      } else {
        h.renderTo( theText, self._textElement, 0 );
      }
    }
  };
  self.defineProperty( "text", {
    read:  true,
    write: true
  } );
  /**
   * The alert's buttons are specified in this property. The layout
   * is expected to be: `[ { title: title [, type: type] [, tag: tag] } [, {} ...] ]`
   *
   * Each button's type can be "normal", "bold", "destructive". The tag may be
   * null; if it is, it is assigned the button index. If a tag is specifed (common
   * for cancel buttons), that is the return value.
   * @property buttons
   * @type {Array}
   */
  self._buttons = [];
  self._buttonContainer = null;
  self.defineProperty( "wideButtons", {
    default: "auto"
  } );
  self.setButtons = function ( theButtons ) {
    function touchStart( e ) {
      if ( e.touches !== undefined ) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
      } else {
        this.startX = e.clientX;
        this.startY = e.clientY;
      }
      this.moved = false;
    }

    function handleScrolling( e ) {
      var newX = ( e.touches !== undefined ) ? e.touches[0].clientX : e.clientX,
        newY = ( e.touches !== undefined ) ? e.touches[0].clientY : e.clientY,
        dX = Math.abs( this.startX - newX ),
        dY = Math.abs( this.startY - newY );
      console.log( dX, dY );
      if ( dX > 20 || dY > 20 ) {
        this.moved = true;
      }
    }

    function dismissWithIndex( idx ) {
      return function ( e ) {
        e.preventDefault();
        if ( this.moved ) {
          return;
        }
        self.dismiss( idx );
      };
    }

    var i;
    // clear out any previous buttons in the DOM
    if ( self._buttonContainer !== null ) {
      for ( i = 0; i < self._buttons.length; i++ ) {
        self._buttonContainer.removeChild( self._buttons[i].element );
      }
    }
    self._buttons = theButtons;
    // determine if we need wide buttons or not
    var wideButtons = false;
    if ( self.wideButtons === "auto" ) {
      wideButtons = !( ( self._buttons.length >= 2 ) && ( self._buttons.length <= 3 ) );
    } else {
      wideButtons = self.wideButtons;
    }
    if ( wideButtons ) {
      self._buttonContainer.classList.add( "wide" );
    }
    // add the buttons back to the DOM if we can
    if ( self._buttonContainer !== null ) {
      for ( i = 0; i < self._buttons.length; i++ ) {
        var e = document.createElement( "div" );
        var b = self._buttons[i];
        // if the tag is null, give it (i)
        if ( b.tag === null ) {
          b.tag = i;
        }
        // class is ui-alert-button normal|bold|destructive [wide]
        // wide buttons are for 1 button or 4+ buttons.
        e.className = "ui-alert-button " + b.type + " " + ( wideButtons ? "wide" : "" );
        // title
        e.innerHTML = b.title;
        if ( !wideButtons ) {
          // set the width of each button to fill out the alert equally
          // 3 buttons gets 33.333%; 2 gets 50%.
          e.style.width = "" + ( 100 / self._buttons.length ) + "%";
        }
        // listen for a touch
        if ( Hammer ) {
          Hammer( e ).on( "tap", dismissWithIndex( i ) );
        } else {
          event.addListener( e, "touchstart", touchStart );
          event.addListener( e, "touchmove", handleScrolling );
          event.addListener( e, "touchend", dismissWithIndex( i ) );
        }
        b.element = e;
        // add the button to the DOM
        self._buttonContainer.appendChild( b.element );
      }
    }
  };
  self.defineProperty( "buttons", {
    read:    true,
    write:   true,
    default: []
  } );
  // other DOM elements we need to construct the alert
  self._rootElement = null; // root element contains the container
  self._alertElement = null; // points to the alert itself
  self._vaElement = null; // points to the DIV used to vertically align us
  self._deferred = null; // stores a promise
  /**
   * If true, show() returns a promise.
   * @property usePromise
   * @type {boolean}
   */
  self.defineProperty( "usePromise", {
    read:    true,
    write:   false,
    default: false
  } );
  /**
   * Indicates if the alert is veisible.
   * @property visible
   * @type {Boolean}
   */
  self.defineProperty( "visible", {
    read:    true,
    write:   false,
    default: false
  } );
  /**
   * Creates the DOM elements for an Alert. Assumes the styles are
   * already in the style sheet.
   * @method _createElements
   * @private
   */
  self._createElements = function () {
    self._rootElement = document.createElement( "div" );
    self._rootElement.className = "ui-alert-container";
    self._vaElement = document.createElement( "div" );
    self._vaElement.className = "ui-alert-vertical-align";
    self._alertElement = document.createElement( "div" );
    self._alertElement.className = "ui-alert";
    self._titleElement = document.createElement( "div" );
    self._titleElement.className = "ui-alert-title";
    self._textElement = document.createElement( "div" );
    self._textElement.className = "ui-alert-text";
    self._buttonContainer = document.createElement( "div" );
    self._buttonContainer.className = "ui-alert-button-container";
    self._alertElement.appendChild( self._titleElement );
    self._alertElement.appendChild( self._textElement );
    self._alertElement.appendChild( self._buttonContainer );
    self._vaElement.appendChild( self._alertElement );
    self._rootElement.appendChild( self._vaElement );
  };
  /**
   * Called when the back button is pressed. Dismisses with a -1 index. Effectively a Cancel.
   * @method backButtonPressed
   */
  self.backButtonPressed = function () {
    self.dismiss( -1 );
  };
  /**
   * Hide dismisses the alert and dismisses it with -1. Effectively a Cancel.
   * @method hide
   * @return {[type]} [description]
   */
  self.hide = function () {
    self.dismiss( -1 );
  };
  /**
   * Shows an alert.
   * @method show
   * @return {Promise} a promise if usePromise = true
   */
  self.show = function () {
    if ( self.visible ) {
      if ( self.usePromise && self._deferred !== null ) {
        return self._deferred;
      }
      return void 0; // can't do anything more.
    }
    // listen for the back button
    UI.backButton.addListenerForNotification( "backButtonPressed", self.backButtonPressed );
    // add to the body
    document.body.appendChild( self._rootElement );
    // animate in
    UI.styleElement( self._alertElement, "transform", "scale3d(2.00, 2.00,1)" );
    setTimeout( function () {
      self._rootElement.style.opacity = "1";
      self._alertElement.style.opacity = "1";
      UI.styleElement( self._alertElement, "transform", "scale3d(1.00, 1.00,1)" )
    }, 10 );
    self._visible = true;
    if ( self.usePromise ) {
      self._deferred = Q.defer();
      return self._deferred.promise;
    }
  };
  /**
   * Dismisses the alert with the sepcified button index
   *
   * @method dismiss
   * @param {Number} idx
   */
  self.dismiss = function ( idx ) {
    if ( !self.visible ) {
      return;
    }
    // drop the listener for the back button
    UI.backButton.removeListenerForNotification( "backButtonPressed", self.backButtonPressed );
    // remove from the body
    setTimeout( function () {
      self._rootElement.style.opacity = "0";
      UI.styleElement( self._alertElement, "transform", "scale3d(0.75, 0.75,1)" )
    }, 10 );
    setTimeout( function () {
      document.body.removeChild( self._rootElement );
    }, 610 );
    // get notification tag
    var tag = -1;
    if ( ( idx > -1 ) && ( idx < self._buttons.length ) ) {
      tag = self._buttons[idx].tag;
    }
    // send our notifications as appropriate
    self.notify( "dismissed" );
    self.notify( "buttonTapped", [tag] );
    self._visible = false;
    // and resolve/reject the promise
    if ( self.usePromise ) {
      if ( tag > -1 ) {
        self._deferred.resolve( tag );
      } else {
        self._deferred.reject( new Error( tag ) );
      }
    }
  };
  /**
   * Initializes the Alert and calls _createElements.
   * @method init
   * @return {Object}
   */
  self.override( function init() {
    self.super( _className, "init" );
    self._createElements();
    return self;
  } );
  /**
   * Initializes the Alert. Options includes title, text, buttons, and promise.
   * @method overrideSuper
   * @return {Object}
   */
  self.override( function initWithOptions( options ) {
    self.init();
    if ( typeof options !== "undefined" ) {
      if ( typeof options.title !== "undefined" ) {
        self.title = options.title;
      }
      if ( typeof options.text !== "undefined" ) {
        self.text = options.text;
      }
      if ( typeof options.wideButtons !== "undefined" ) {
        self.wideButtons = options.wideButtons
      }
      if ( typeof options.buttons !== "undefined" ) {
        self.buttons = options.buttons;
      }
      if ( typeof options.promise !== "undefined" ) {
        self._usePromise = options.promise;
      }
    }
    return self;
  } );
  /**
   * Clean up after ourselves.
   * @method destroy
   */
  self.overrideSuper( self.class, "destroy", self.destroy );
  self.destroy = function destroy() {
    if ( self.visible ) {
      self.hide();
      setTimeout( destroy, 600 ); // we won't destroy immediately.
      return;
    }
    self._rootElement = null;
    self._vaElement = null;
    self._alertElement = null;
    self._titleElement = null;
    self._textElement = null;
    self._buttonContainer = null;
    self.super( _className, "destroy" );
  };
  // handle auto-init
  self._autoInit.apply( self, arguments );
  return self;
};
/**
 * Creates a button suitable for an Alert
 * @method button
 * @param  {String} title   The title of the button
 * @param  {Object} options The additional options: type and tag
 * @return {Object}         A button
 */
Alert.button = function ( title, options ) {
  var button = {};
  button.title = title;
  button.type = "normal"; // normal, bold, destructive
  button.tag = null; // assign for a specific tag
  button.enabled = true; // false = disabled.
  button.element = null; // attached DOM element
  if ( typeof options !== "undefined" ) {
    if ( typeof options.type !== "undefined" ) {
      button.type = options.type;
    }
    if ( typeof options.tag !== "undefined" ) {
      button.tag = options.tag;
    }
    if ( typeof options.enabled !== "undefined" ) {
      button.enabled = options.enabled;
    }
  }
  return button;
};
/**
 * Creates an OK-style Alert. It only has an OK button.
 * @method OK
 * @param {Object} options Specify the title, text, and promise options if desired.
 */
Alert.OK = function ( options ) {
  var anOK = new Alert();
  var anOKOptions = {
    title:   _y.T( "OK" ),
    text:    "",
    buttons: [Alert.button( _y.T( "OK" ), {
      type: "bold"
    } )]
  };
  if ( typeof options !== "undefined" ) {
    if ( typeof options.title !== "undefined" ) {
      anOKOptions.title = options.title;
    }
    if ( typeof options.text !== "undefined" ) {
      anOKOptions.text = options.text;
    }
    if ( typeof options.promise !== "undefined" ) {
      anOKOptions.promise = options.promise;
    }
  }
  anOK.initWithOptions( anOKOptions );
  return anOK;
};
/**
 * Creates an OK/Cancel-style Alert. It only has an OK and CANCEL button.
 * @method Confirm
 * @param {Object} options Specify the title, text, and promise options if desired.
 */
Alert.Confirm = function ( options ) {
  var aConfirmation = new Alert();
  var confirmationOptions = {
    title:   _y.T( "Confirm" ),
    text:    "",
    buttons: [Alert.button( _y.T( "OK" ) ),
              Alert.button( _y.T( "Cancel" ), {
                type: "bold",
                tag:  -1
              } )
    ]
  };
  if ( typeof options !== "undefined" ) {
    if ( typeof options.title !== "undefined" ) {
      confirmationOptions.title = options.title;
    }
    if ( typeof options.text !== "undefined" ) {
      confirmationOptions.text = options.text;
    }
    if ( typeof options.promise !== "undefined" ) {
      confirmationOptions.promise = options.promise;
    }
  }
  aConfirmation.initWithOptions( confirmationOptions );
  return aConfirmation;
};
module.exports = Alert;

},{"../../q":1,"../util/core":13,"../util/device":15,"../util/object":19,"./core":4,"./event":5,"yasmf-h":21}],4:[function(require,module,exports){
/**
 *
 * Core of YASMF-UI; defines the version and basic UI  convenience methods.
 *
 * @module core.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module*/
"use strict";
var theDevice = require( "../util/device" );
var BaseObject = require( "../util/object" );
var prefixes = ["-webkit-", "-moz-", "-ms-", "-o-", ""],
  jsPrefixes = ["webkit", "moz", "ms", "o", ""],
  /**
   * @method Animation
   * @constructor
   * @param {Array} els             elements to animate
   * @param {number} timing         seconds to animate over (0.3 default)
   * @param {string} timingFunction timing function (ease-in-out default)
   * @return {Animation}
   */
  Animation = function ( els, timing, timingFunction ) {
    this._el = document.createElement( "div" );
    this._els = els;
    this._animations = [];
    this._transitions = [];
    this.timingFunction = "ease-in-out";
    this.timing = 0.3;
    this._maxTiming = 0;
    if ( typeof timing !== "undefined" ) {
      this.timing = timing;
    }
    if ( typeof timingFunction !== "undefined" ) {
      this.timingFunction = timingFunction;
    }
  };
/**
 * @method _pushAnimation
 * @private
 * @param {string} property         style property
 * @param {string} value            value to assign to property
 * @param {number} timing           seconds for animation (optional)
 * @param {string} timingFunction   timing function (optional)
 * @return {Animation}              self, for chaining
 */
function _pushAnimation( property, value, timing, timingFunction ) {
  var newProp, newValue, prefix, jsPrefix, newJsProp;
  for ( var i = 0, l = prefixes.length; i < l; i++ ) {
    prefix = prefixes[i];
    jsPrefix = jsPrefixes[i];
    newProp = prefix + property;
    if ( jsPrefix !== "" ) {
      newJsProp = jsPrefix + property.substr( 0, 1 ).toUpperCase() + property.substr( 1 );
    } else {
      newJsProp = property;
    }
    newValue = value.replace( "{-}", prefix );
    if ( typeof this._el.style[newJsProp] !== "undefined" ) {
      this._animations.push( [newProp, newValue] );
      this._transitions.push( [newProp, ( typeof timing !== "undefined" ? timing : this.timing ) + "s", ( typeof timingFunction !==
                                                                                                          "undefined" ? timingFunction : this.timingFunction )] );
    }
    this._maxTiming = Math.max( this._maxTiming, ( typeof timing !== "undefined" ? timing : this.timing ) );
  }
  return this;
}
/**
 * Set the default timing function for following animations
 * @method setTimingFunction
 * @param {string} timingFunction      the timing function to assign, like "ease-in-out"
 * @return {Animation}                 self
 */
Animation.prototype.setTimingFunction = function setTimingFunction( timingFunction ) {
  this.timingFunction = timingFunction;
  return this;
};
/**
 * Set the timing for the following animations, in seconds
 * @method setTiming
 * @param {number} timing              the length of the animation, in seconds
 * @return {Animation}                 self
 */
Animation.prototype.setTiming = function setTiming( timing ) {
  this.timing = timing;
  return this;
};
/**
 * Move the element to the specific position (using left, top)
 *
 * @method move
 * @param {string} x           the x position (px or %)
 * @param {string} y           the y position (px or %)
 * @return {Animation} self
 */
Animation.prototype.move = function ( x, y ) {
  _pushAnimation.call( this, "left", x );
  return _pushAnimation.call( this, "top", y );
};
/**
 * Resize the element (using width, height)
 *
 * @method resize
 * @param {string} w           the width (px or %)
 * @param {string} h           the height (px or %)
 * @return {Animation} self
 */
Animation.prototype.resize = function ( w, h ) {
  _pushAnimation.call( this, "width", w );
  return _pushAnimation.call( this, "height", h );
};
/**
 * Change opacity
 * @method opacity
 * @param {string} o           opacity
 * @return {Animation} self
 */
Animation.prototype.opacity = function ( o ) {
  return _pushAnimation.call( this, "opacity", o );
};
/**
 * Transform the element using translate x, y
 * @method translate
 * @param {string} x       x position (px or %)
 * @param {string} y       y position (px or %)
 * @return {Animation} self
 */
Animation.prototype.translate = function ( x, y ) {
  return _pushAnimation.call( this, "transform", ["translate(", [x, y].join( ", " ), ")"].join( "" ) );
};
/**
 * Transform the element using translate3d x, y, z
 * @method translate3d
 * @param {string} x       x position (px or %)
 * @param {string} y       y position (px or %)
 * @param {string} z       z position (px or %)
 * @return {Animation} self
 */
Animation.prototype.translate3d = function ( x, y, z ) {
  return _pushAnimation.call( this, "transform", ["translate3d(", [x, y, z].join( ", " ), ")"].join( "" ) );
};
/**
 * Transform the element using scale
 * @method scale
 * @param {string} p       percent (0.00-1.00)
 * @return {Animation} self
 */
Animation.prototype.scale = function ( p ) {
  return _pushAnimation.call( this, "transform", ["scale(", p, ")"].join( "" ) );
};
/**
 * Transform the element using scale
 * @method rotate
 * @param {string} d       degrees
 * @return {Animation} self
 */
Animation.prototype.rotate = function ( d ) {
  return _pushAnimation.call( this, "transform", ["rotate(", d, "deg)"].join( "" ) );
};
/**
 * end the animation definition and trigger the sequence. If a callback method
 * is supplied, it is called when the animation is over
 * @method endAnimation
 * @alias then
 * @param {function} fn       function to call when animation is completed;
 *                            it is bound to the Animation method so that
 *                            further animations can be triggered.
 * @return {Animation} self
 */
Animation.prototype.endAnimation = function endAnimation( fn ) {
  // create the list of transitions we need to put on the elements
  var transition = this._transitions.map( function ( t ) {
      return t.join( " " );
    } ).join( ", " ),
    that = this;
  // for each element, assign this list of transitions
  that._els.forEach( function initializeEl( el ) {
    var i, l, prefixedTransition;
    for ( i = 0, l = prefixes.length; i < l; i++ ) {
      prefixedTransition = prefixes[i] + "transition";
      el.style.setProperty( prefixedTransition, transition );
    }
  } );
  // wait a few ms to let the DOM settle, and then start the animations
  setTimeout( function startAnimations() {
    var i, l, prop, value;
    // for each element, assign the desired property and value to the element
    that._els.forEach( function animateEl( el ) {
      for ( i = 0, l = that._animations.length; i < l; i++ ) {
        prop = that._animations[i][0];
        value = that._animations[i][1];
        el.style.setProperty( prop, value );
      }
    } );
    // when the animation is complete, remove the transition property from
    // the elements and call the callback function (if specified)
    setTimeout( function afterAnimationCallback() {
      var prefixedTransition;
      that._animations = [];
      that._transitions = [];
      that._els.forEach( function animateEl( el ) {
        for ( var i = 0, l = prefixes.length; i < l; i++ ) {
          prefixedTransition = prefixes[i] + "transition";
          el.style.setProperty( prefixedTransition, "" );
        }
      } );
      if ( typeof fn === "function" ) {
        fn.call( that );
      }
    }, that._maxTiming * 1000 );
  }, 50 );
  return this;
};
Animation.prototype.then = Animation.prototype.endAnimation;
var UI = {};
/**
 * Version of the UI Namespace
 * @property version
 * @type Object
 **/
UI.version = "0.5.100";
/**
 * Styles the element with the given style and value. Adds in the browser
 * prefixes to make it easier. Also available as `$s` on nodes.
 *
 * @method styleElement
 * @alias $s
 * @param  {Node} theElement
 * @param  {CssStyle} theStyle   Don't camelCase these, use dashes as in regular styles
 * @param  {value} theValue
 * @returns {void}
 */
UI.styleElement = function ( theElement, theStyle, theValue ) {
  if ( typeof theElement !== "object" ) {
    if ( !( theElement instanceof Node ) ) {
      theValue = theStyle;
      theStyle = theElement;
      theElement = this;
    }
  }
  for ( var i = 0; i < prefixes.length; i++ ) {
    var thePrefix = prefixes[i],
      theNewStyle = thePrefix + theStyle,
      theNewValue = theValue.replace( "%PREFIX%", thePrefix ).replace( "{-}", thePrefix );
    theElement.style.setProperty( theNewStyle, theNewValue );
  }
};
/**
 * Style the list of elements with the style and value using `styleElement`
 * @method styleElements
 * @param  {Array}  theElements
 * @param  {CssStyle} theStyle
 * @param {value} theValue
 * @returns {void}
 */
UI.styleElements = function ( theElements, theStyle, theValue ) {
  var i;
  for ( i = 0; i < theElements.length; i++ ) {
    UI.styleElement( theElements[i], theStyle, theValue );
  }
};
/**
 * Begin an animation definition and apply it to the specific
 * elements defined by selector. If parent is supplied, the selector
 * is relative to the parent, otherwise it is relative to document
 * @method beginAnimation
 * @param {string|Array|Node} selector      If a string, animation applies to all
 *                                          items that match the selector. If an
 *                                          Array, animation applies to all nodes
 *                                          in the array. If a node, the animation
 *                                          applies only to the node.
 * @param {Node} parent                     Optional; if provided, selector is
 *                                          relative to this node
 * @return {Animation}                      Animation object
 */
UI.beginAnimation = function ( selector, parent ) {
  var els = [];
  if ( typeof selector === "string" ) {
    if ( typeof parent === "undefined" ) {
      parent = document;
    }
    els = els.concat( Array.prototype.splice.call( parent.querySelectorAll( selector ), 0 ) );
  }
  if ( typeof selector === "object" && selector instanceof Array ) {
    els = els.concat( selector );
  }
  if ( typeof selector === "object" && selector instanceof Node ) {
    els = els.concat( [selector] );
  }
  return new Animation( els );
};
/**
 *
 * Converts a color object to an rgba(r,g,b,a) string, suitable for applying to
 * any number of CSS styles. If the color's alpha is zero, the return value is
 * "transparent". If the color is null, the return value is "inherit".
 *
 * @method colorToRGBA
 * @static
 * @param {color} theColor - theColor to convert.
 * @returns {string} a CSS value suitable for color properties
 */
UI.colorToRGBA = function ( theColor ) {
  if ( !theColor ) {
    return "inherit";
  }
  //noinspection JSUnresolvedVariable
  if ( theColor.alpha !== 0 ) {
    //noinspection JSUnresolvedVariable
    return "rgba(" + theColor.red + "," + theColor.green + "," + theColor.blue + "," + theColor.alpha + ")";
  } else {
    return "transparent";
  }
};
/**
 * @typedef {{red: Number, green: Number, blue: Number, alpha: Number}} color
 */
/**
 *
 * Creates a color object of the form `{red:r, green:g, blue:b, alpha:a}`.
 *
 * @method makeColor
 * @static
 * @param {Number} r - red component (0-255)
 * @param {Number} g - green component (0-255)
 * @param {Number} b - blue component (0-255)
 * @param {Number} a - alpha component (0.0-1.0)
 * @returns {color}
 *
 */
UI.makeColor = function ( r, g, b, a ) {
  return {
    red:   r,
    green: g,
    blue:  b,
    alpha: a
  };
};
/**
 *
 * Copies a color and returns it suitable for modification. You should copy
 * colors prior to modification, otherwise you risk modifying the original.
 *
 * @method copyColor
 * @static
 * @param {color} theColor - the color to be duplicated
 * @returns {color} a color ready for changes
 *
 */
UI.copyColor = function ( theColor ) {
  //noinspection JSUnresolvedVariable
  return UI.makeColor( theColor.red, theColor.green, theColor.blue, theColor.alpha );
};
/**
 * UI.COLOR
 * @namespace UI
 * @class COLOR
 */
UI.COLOR = UI.COLOR || {};
/** @static
 * @method blackColor
 * @returns {color} a black color.
 */
UI.COLOR.blackColor = function () {
  return UI.makeColor( 0, 0, 0, 1.0 );
};
/** @static
 * @method darkGrayColor
 * @returns {color} a dark gray color.
 */
UI.COLOR.darkGrayColor = function () {
  return UI.makeColor( 85, 85, 85, 1.0 );
};
/** @static
 * @method GrayColor
 * @returns {color} a gray color.
 */
UI.COLOR.GrayColor = function () {
  return UI.makeColor( 127, 127, 127, 1.0 );
};
/** @static
 * @method lightGrayColor
 * @returns {color} a light gray color.
 */
UI.COLOR.lightGrayColor = function () {
  return UI.makeColor( 170, 170, 170, 1.0 );
};
/** @static
 * @method whiteColor
 * @returns {color} a white color.
 */
UI.COLOR.whiteColor = function () {
  return UI.makeColor( 255, 255, 255, 1.0 );
};
/** @static
 * @method blueColor
 * @returns {color} a blue color.
 */
UI.COLOR.blueColor = function () {
  return UI.makeColor( 0, 0, 255, 1.0 );
};
/** @static
 * @method greenColor
 * @returns {color} a green color.
 */
UI.COLOR.greenColor = function () {
  return UI.makeColor( 0, 255, 0, 1.0 );
};
/** @static
 * @method redColor
 * @returns {color} a red color.
 */
UI.COLOR.redColor = function () {
  return UI.makeColor( 255, 0, 0, 1.0 );
};
/** @static
 * @method cyanColor
 * @returns {color} a cyan color.
 */
UI.COLOR.cyanColor = function () {
  return UI.makeColor( 0, 255, 255, 1.0 );
};
/** @static
 * @method yellowColor
 * @returns {color} a yellow color.
 */
UI.COLOR.yellowColor = function () {
  return UI.makeColor( 255, 255, 0, 1.0 );
};
/** @static
 * @method magentaColor
 * @returns {color} a magenta color.
 */
UI.COLOR.magentaColor = function () {
  return UI.makeColor( 255, 0, 255, 1.0 );
};
/** @static
 * @method orangeColor
 * @returns {color} a orange color.
 */
UI.COLOR.orangeColor = function () {
  return UI.makeColor( 255, 127, 0, 1.0 );
};
/** @static
 * @method purpleColor
 * @returns {color} a purple color.
 */
UI.COLOR.purpleColor = function () {
  return UI.makeColor( 127, 0, 127, 1.0 );
};
/** @static
 * @method brownColor
 * @returns {color} a brown color.
 */
UI.COLOR.brownColor = function () {
  return UI.makeColor( 153, 102, 51, 1.0 );
};
/** @static
 * @method lightTextColor
 * @returns {color} a light text color suitable for display on dark backgrounds.
 */
UI.COLOR.lightTextColor = function () {
  return UI.makeColor( 240, 240, 240, 1.0 );
};
/** @static
 * @method darkTextColor
 * @returns {color} a dark text color suitable for display on light backgrounds.
 */
UI.COLOR.darkTextColor = function () {
  return UI.makeColor( 15, 15, 15, 1.0 );
};
/** @static
 * @method clearColor
 * @returns {color} a transparent color.
 */
UI.COLOR.clearColor = function () {
  return UI.makeColor( 0, 0, 0, 0.0 );
};
/**
 * Manages the root element
 *
 * @property _rootContainer
 * @private
 * @static
 * @type Node
 */
UI._rootContainer = null;
/**
 * Creates the root element that contains the view hierarchy
 *
 * @method _createRootContainer
 * @static
 * @protected
 */
UI._createRootContainer = function () {
  UI._rootContainer = document.createElement( "div" );
  UI._rootContainer.className = "ui-container";
  UI._rootContainer.id = "rootContainer";
  document.body.appendChild( UI._rootContainer );
};
/**
 * Manages the root view (topmost)
 *
 * @property _rootView
 * @private
 * @static
 * @type ViewContainer
 * @default null
 */
UI._rootView = null;
/**
 * Assigns a view to be the top view in the hierarchy
 *
 * @method setRootView
 * @static
 * @param {ViewContainer} theView
 */
UI.setRootView = function ( theView ) {
  if ( UI._rootContainer === null ) {
    UI._createRootContainer();
  }
  if ( UI._rootView !== null ) {
    UI.removeRootView();
  }
  UI._rootView = theView;
  UI._rootView.parentElement = UI._rootContainer;
};
/**
 * Removes a view from the root view
 *
 * @method removeRootView
 * @static
 */
UI.removeRootView = function () {
  if ( UI._rootView !== null ) {
    UI._rootView.parentElement = null;
  }
  UI._rootView = null;
};
/**
 *
 * Returns the root view
 *
 * @method getRootView
 * @static
 * @returns {ViewContainer}
 */
UI.getRootView = function () {
  return UI._rootView;
};
/**
 * The root view
 * @property rootView
 * @static
 * @type Node
 */
Object.defineProperty( UI, "rootView", {
  get: UI.getRootView,
  set: UI.setRootView
} );
/**
 * Private back button handler class
 * @private
 * @class _BackButtonHandler
 * @returns {BaseObject}
 * @private
 */
UI._BackButtonHandler = function () {
  var self = new BaseObject();
  self.subclass( "BackButtonHandler" );
  self.registerNotification( "backButtonPressed" );
  self._lastBackButtonTime = -1;
  self.handleBackButton = function () {
    var currentTime = ( new Date() ).getTime();
    if ( self._lastBackButtonTime < currentTime - 1000 ) {
      self._lastBackButtonTime = ( new Date() ).getTime();
      self.notifyMostRecent( "backButtonPressed" );
    }
  };
  document.addEventListener( "backbutton", self.handleBackButton, false );
  return self;
};
/**
 *
 * Global Back Button Handler Object
 *
 * Register a listener for the backButtonPressed notification in order
 * to be notified when the back button is pressed.
 *
 * Applies only to a physical back button, not one on the screen.
 *
 * @property backButton
 * @static
 * @final
 * @type _BackButtonHandler
 */
UI.backButton = new UI._BackButtonHandler();
/**
 * Private orientation handler class
 * @class _OrientationHandler
 * @returns {BaseObject}
 * @private
 */
UI._OrientationHandler = function () {
  var self = new BaseObject();
  self.subclass( "OrientationHandler" );
  self.registerNotification( "orientationChanged" );
  self.handleOrientationChange = function () {
    var curOrientation,
      curFormFactor,
      curScale,
      curConvenience,
      curDevice = theDevice.platform(),
      OSLevel;
    switch ( curDevice ) {
      case "mac":
        try {
          OSLevel = "" + parseFloat( ( navigator.userAgent.match( /OS X ([0-9_]+)/ )[1] ).replace( /_/g, "." ) );
        }
        catch ( e ) {}
        if ( OSLevel !== undefined ) {
          curDevice += " mac" + ( OSLevel.length < 5 ? "C" : "M" );
        }
        break;
      case "ios":
        try {
          OSLevel = navigator.userAgent.match( /OS ([0-9]+)/ )[1];
        }
        catch ( e ) {}
        if ( OSLevel !== undefined ) {
          curDevice += " ios" + OSLevel + " ios" + ( OSLevel < 7 ? "C" : "M" );
        }
        break;
      case "android":
        try {
          OSLevel = parseFloat( navigator.userAgent.match( /Android ([0-9.]+)/ )[1] );
        }
        catch ( e ) {}
        if ( OSLevel !== undefined ) {
          curDevice += " android" + ( "" + OSLevel ).replace( /\./g, "-" ) + " android" + ( ( OSLevel < 4.4 ) ? "C" : ( (
                                                                                                                        OSLevel >= 5 ) ? "M" : "K" ) )
        }
        break;
      default:
    }
    /*
     if ( curDevice === "ios" ) {
     if ( navigator.userAgent.indexOf( "OS 9" ) > -1 ) {
     curDevice += " ios9 iosM";
     }
     if ( navigator.userAgent.indexOf( "OS 8" ) > -1 ) {
     curDevice += " ios8 iosM";
     }
     if ( navigator.userAgent.indexOf( "OS 7" ) > -1 ) {
     curDevice += " ios7 iosM";
     }
     if ( navigator.userAgent.indexOf( "OS 6" ) > -1 ) {
     curDevice += " ios6 iosC";
     }
     if ( navigator.userAgent.indexOf( "OS 5" ) > -1 ) {
     curDevice += " ios5 iosC";
     }
     } */
    curFormFactor = theDevice.formFactor();
    curOrientation = theDevice.isPortrait() ? "portrait" : "landscape";
    curScale = theDevice.isRetina() ? "hiDPI" : "loDPI";
    curScale += " scale" + window.devicePixelRatio + "x";
    curConvenience = "";
    if ( theDevice.iPad() ) {
      curConvenience = "ipad";
    }
    if ( theDevice.iPhone() ) {
      curConvenience = "iphone";
    }
    if ( theDevice.droidTablet() ) {
      curConvenience = "droid-tablet";
    }
    if ( theDevice.droidPhone() ) {
      curConvenience = "droid-phone";
    }
    if ( typeof document.body !== "undefined" && document.body !== null ) {
      document.body.setAttribute( "class", [curDevice, curFormFactor, curOrientation, curScale, curConvenience].join(
        " " ) );
    }
    self.notify( "orientationChanged" );
  };
  window.addEventListener( "orientationchange", self.handleOrientationChange, false );
  if ( typeof document.body !== "undefined" && document.body !== null ) {
    self.handleOrientationChange();
  } else {
    setTimeout( self.handleOrientationChange, 0 );
  }
  return self;
};
/**
 *
 * Global Orientation Handler Object
 *
 * Register a listener for the orientationChanged notification in order
 * to be notified when the orientation changes.
 *
 * @property orientationHandler
 * @static
 * @final
 * @type _OrientationHandler
 */
UI.orientationHandler = new UI._OrientationHandler();
/**
 *
 * Global Notification Object -- used for sending and receiving global notifications
 *
 * @property globalNotifications
 * @static
 * @final
 * @type BaseObject
 */
UI.globalNotifications = new BaseObject();
/**
 * Create the root container
 */
if ( typeof document.body !== "undefined" && document.body !== null ) {
  UI._createRootContainer();
} else {
  setTimeout( UI._createRootContainer, 0 );
}
// helper methods on Nodes
Node.prototype.$s = UI.styleElement;
module.exports = UI;

},{"../util/device":15,"../util/object":19}],5:[function(require,module,exports){
/**
 *
 * Basic cross-platform mobile Event Handling for YASMF
 *
 * @module events.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global define*/
"use strict";
var theDevice = require( "../util/device" );
/**
 * Translates touch events to mouse events if the platform doesn't support
 * touch events. Leaves other events unaffected.
 *
 * @method _translateEvent
 * @static
 * @private
 * @param {String} theEvent - the event name to translate
 */
var _translateEvent = function ( theEvent ) {
  var theTranslatedEvent = theEvent;
  if ( !theTranslatedEvent ) {
    return theTranslatedEvent;
  }
  var platform = theDevice.platform();
  var nonTouchPlatform = ( platform === "wince" || platform === "unknown" || platform === "mac" || platform === "windows" ||
                           platform === "linux" );
  if ( nonTouchPlatform && theTranslatedEvent.toLowerCase().indexOf( "touch" ) > -1 ) {
    theTranslatedEvent = theTranslatedEvent.replace( "touch", "mouse" );
    theTranslatedEvent = theTranslatedEvent.replace( "start", "down" );
    theTranslatedEvent = theTranslatedEvent.replace( "end", "up" );
  }
  return theTranslatedEvent;
};
var event = {};
/**
 * @typedef {{_originalEvent: Event, touches: Array, x: number, y: number, avgX: number, avgY: number, element: (EventTarget|Object), target: Node}} NormalizedEvent
 */
/**
 *
 * Creates an event object from a DOM event.
 *
 * The event returned contains all the touches from the DOM event in an array of {x,y} objects.
 * The event also contains the first touch as x,y properties and the average of all touches
 * as avgX,avgY. If no touches are in the event, these values will be -1.
 *
 * @method makeEvent
 * @static
 * @param {Node} that - `this`; what fires the event
 * @param {Event} e - the DOM event
 * @returns {NormalizedEvent}
 *
 */
event.convert = function ( that, e ) {
  if ( typeof e === "undefined" ) {
    e = window.event;
  }
  var newEvent = {
    _originalEvent: e,
    touches:        [],
    x:              -1,
    y:              -1,
    avgX:           -1,
    avgY:           -1,
    element:        e.target || e.srcElement,
    target:         that
  };
  if ( e.touches ) {
    var avgXTotal = 0;
    var avgYTotal = 0;
    for ( var i = 0; i < e.touches.length; i++ ) {
      newEvent.touches.push( {
                               x: e.touches[i].clientX,
                               y: e.touches[i].clientY
                             } );
      avgXTotal += e.touches[i].clientX;
      avgYTotal += e.touches[i].clientY;
      if ( i === 0 ) {
        newEvent.x = e.touches[i].clientX;
        newEvent.y = e.touches[i].clientY;
      }
    }
    if ( e.touches.length > 0 ) {
      newEvent.avgX = avgXTotal / e.touches.length;
      newEvent.avgY = avgYTotal / e.touches.length;
    }
  } else {
    if ( event.pageX ) {
      newEvent.touches.push( {
                               x: e.pageX,
                               y: e.pageY
                             } );
      newEvent.x = e.pageX;
      newEvent.y = e.pageY;
      newEvent.avgX = e.pageX;
      newEvent.avgY = e.pageY;
    }
  }
  return newEvent;
};
/**
 *
 * Cancels an event that's been created using {@link event.convert}.
 *
 * @method cancelEvent
 * @static
 * @param {NormalizedEvent} e - the event to cancel
 *
 */
event.cancel = function ( e ) {
  if ( e._originalEvent.cancelBubble ) {
    e._originalEvent.cancelBubble();
  }
  if ( e._originalEvent.stopPropagation ) {
    e._originalEvent.stopPropagation();
  }
  if ( e._originalEvent.preventDefault ) {
    e._originalEvent.preventDefault();
  } else {
    e._originalEvent.returnValue = false;
  }
};
/**
 * Adds a touch listener to theElement, converting touch events for WP7.
 *
 * @method addEventListener
 * @param {Node} theElement  the element to attach the event to
 * @param {String} theEvent  the event to handle
 * @param {Function} theFunction  the function to call when the event is fired
 *
 */
event.addListener = function ( theElement, theEvent, theFunction ) {
  var theTranslatedEvent = _translateEvent( theEvent.toLowerCase() );
  theElement.addEventListener( theTranslatedEvent, theFunction, false );
};
/**
 * Removes a touch listener added by addTouchListener
 *
 * @method removeEventListener
 * @param {Node} theElement  the element to remove an event from
 * @param {String} theEvent  the event to remove
 * @param {Function} theFunction  the function to remove
 *
 */
event.removeListener = function ( theElement, theEvent, theFunction ) {
  var theTranslatedEvent = _translateEvent( theEvent.toLowerCase() );
  theElement.removeEventListener( theTranslatedEvent, theFunction );
};
module.exports = event;

},{"../util/device":15}],6:[function(require,module,exports){
/**
 *
 * Navigation Controllers provide basic support for view stack management (as in push, pop)
 *
 * @module navigationController.js
 * @author Kerri Shotts
 * @version 0.5
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module*/
"use strict";
var UI = require( "./core" ),
  ViewContainer = require( "./viewContainer" ),
  UTIL = require( "../util/core" );
var _className = "NavigationController",
  NavigationController = function () {
    var self = new ViewContainer();
    self.subclass( _className );
    // # Notifications
    //
    // * `viewPushed` is fired when a view is pushed onto the view stack. The view pushed is passed as a parameter.
    // * `viewPopped` is fired when a view is popped off the view stack. The view popped is passed as a parameter.
    //
    self.registerNotification( "viewPushed" );
    self.registerNotification( "viewPopped" );
    /**
     * The array of views that this navigation controller manages.
     * @property subviews
     * @type {Array}
     */
    self.defineProperty( "subviews", {
      read:    true,
      write:   false,
      default: []
    } );
    /**
     * Indicates the current top view
     * @property topView
     * @type {Object}
     */
    self.getTopView = function () {
      if ( self._subviews.length > 0 ) {
        return self._subviews[self._subviews.length - 1];
      } else {
        return null;
      }
    };
    self.defineProperty( "topView", {
      read:            true,
      write:           false,
      backingVariable: false
    } );
    /**
     * Returns the initial view in the view stack
     * @property rootView
     * @type {Object}
     */
    self.getRootView = function () {
      if ( self._subviews.length > 0 ) {
        return self._subviews[0];
      } else {
        return null;
      }
    };
    self.setRootView = function ( theNewRoot ) {
      if ( self._subviews.length > 0 ) {
        // must remove all the subviews from the DOM
        for ( var i = 0; i < self._subviews.length; i++ ) {
          var thePoppingView = self._subviews[i];
          thePoppingView.notify( "viewWillDisappear" );
          if ( i === 0 ) {
            thePoppingView.element.classList.remove( "ui-root-view" );
          }
          thePoppingView.parentElement = null;
          thePoppingView.notify( "viewDidDisappear" );
          thePoppingView.notify( "viewWasPopped" );
          delete thePoppingView.navigationController;
        }
        self._subviews = [];
      }
      self._subviews.push( theNewRoot ); // add it to our views
      theNewRoot.navigationController = self;
      theNewRoot.notify( "viewWasPushed" );
      theNewRoot.notify( "viewWillAppear" ); // notify the view
      theNewRoot.parentElement = self.element; // and make us the parent
      theNewRoot.element.classList.add( "ui-root-view" );
      theNewRoot.notify( "viewDidAppear" ); // and notify it that it's actually there.
    };
    self.defineProperty( "rootView", {
      read:            true,
      write:           true,
      backingVariable: false
    } );
    self.defineProperty( "modal", {
      read:    true,
      write:   false,
      default: false
    } );
    self.defineProperty( "modalView", {
      read:    true,
      write:   false,
      default: null
    } );
    self.defineProperty( "modalViewType", {
      read:    true,
      write:   false,
      default: ""
    } );
    self._modalClickPreventer = null;
    self._preventClicks = null;
    /**
     * Creates a click-prevention element -- essentially a transparent DIV that
     * fills the screen.
     * @method _createClickPreventionElement
     * @private
     */
    self._createClickPreventionElement = function () {
      self.createElementIfNotCreated();
      self._preventClicks = document.createElement( "div" );
      self._preventClicks.className = "ui-prevent-clicks";
      self.element.appendChild( self._preventClicks );
    };
    /**
     * Create a click-prevention element if necessary
     * @method _createClickPreventionElementIfNotCreated
     * @private
     */
    self._createClickPreventionElementIfNotCreated = function () {
      if ( self._preventClicks === null ) {
        self._createClickPreventionElement();
      }
    };
    /**
     * push a view onto the view stack.
     *
     * @method pushView
     * @param {ViewContainer} aView
     * @param {Boolean} [withAnimation] Determine if the view should be pushed with an animation, default is `true`
     * @param {Number} [withDelay] Number of seconds for the animation, default is `0.3`
     * @param {String} [withType] CSS Animation, default is `ease-in-out`
     */
    self.pushView = function ( aView, withAnimation, withDelay, withType ) {
      var theHidingView = self.topView,
        theShowingView = aView,
        usingAnimation = true,
        animationDelay = 0.3,
        animationType = "ease-in-out";
      if ( typeof withAnimation !== "undefined" ) {
        usingAnimation = withAnimation;
      }
      if ( typeof withDelay !== "undefined" ) {
        animationDelay = withDelay;
      }
      if ( typeof withType !== "undefined" ) {
        animationType = withType;
      }
      if ( !usingAnimation ) {
        animationDelay = 0;
      }
      // add the view to our array, at the end
      self._subviews.push( theShowingView );
      theShowingView.navigationController = self;
      theShowingView.notify( "viewWasPushed" );
      // get each element's z-index, if specified
      var theHidingViewZ = parseInt( getComputedStyle( theHidingView.element ).getPropertyValue( "z-index" ) || "0", 10 ),
        theShowingViewZ = parseInt( getComputedStyle( theShowingView.element ).getPropertyValue( "z-index" ) || "0", 10 );
      if ( theHidingViewZ >= theShowingViewZ ) {
        theShowingViewZ = theHidingViewZ + 10;
      }
      // then position the view so as to be off-screen, with the current view on screen
      UI.styleElement( theHidingView.element, "transform", "translate3d(0,0," + theHidingViewZ + "px)" );
      UI.styleElement( theShowingView.element, "transform", "translate3d(100%,0," + theShowingViewZ + "px)" );
      // set up an animation
      if ( usingAnimation ) {
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "-webkit-transform " +
                                                                                         animationDelay + "s " + animationType );
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "-moz-transform " +
                                                                                         animationDelay + "s " + animationType );
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "-ms-transform " +
                                                                                         animationDelay + "s " + animationType );
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "transform " + animationDelay +
                                                                                         "s " + animationType );
        UI.styleElements( theHidingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "opacity " +
                                                                                                          animationDelay + "s " + animationType );
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "opacity " +
                                                                                                           animationDelay + "s " + animationType );
        UI.styleElements( theHidingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "0" );
      } else {
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "inherit" );
        UI.styleElements( theHidingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "inherit" );
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "inherit" );
      }
      // and add the element with us as the parent
      theShowingView.parentElement = self.element;
      // display the click prevention element
      self._preventClicks.style.display = "block";
      setTimeout( function () {
        // tell the topView to move over to the left
        UI.styleElement( theHidingView.element, "transform", "translate3d(-50%,0," + theHidingViewZ + "px)" );
        // and tell our new view to move as well
        UI.styleElement( theShowingView.element, "transform", "translate3d(0,0," + theShowingViewZ + "px)" );
        if ( usingAnimation ) {
          UI.styleElements( theHidingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "0" );
          UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
        }
        // the the view it's about to show...
        theHidingView.notify( "viewWillDisappear" );
        theShowingView.notify( "viewWillAppear" );
        // tell anyone who is listening who got pushed
        self.notify( "viewPushed", [theShowingView] );
        // tell the view it's visible after the delay has passed
        setTimeout( function () {
          theHidingView.element.style.display = "none";
          theHidingView.notify( "viewDidDisappear" );
          theShowingView.notify( "viewDidAppear" );
          // hide click preventer
          self._preventClicks.style.display = "none";
        }, animationDelay * 1000 );
      }, 50 );
    };
    /**
     * pops the top view from the view stack
     *
     * @method popView
     * @param {Boolean} withAnimation Use animation when popping, default `true`
     * @param {String} withDelay Duration of animation in seconds, Default `0.3`
     * @param {String} withType CSS Animation, default is `ease-in-out`
     */
    self.popView = function ( withAnimation, withDelay, withType ) {
      var usingAnimation = true,
        animationDelay = 0.3,
        animationType = "ease-in-out";
      if ( typeof withAnimation !== "undefined" ) {
        usingAnimation = withAnimation;
      }
      if ( typeof withDelay !== "undefined" ) {
        animationDelay = withDelay;
      }
      if ( typeof withType !== "undefined" ) {
        animationType = withType;
      }
      if ( !usingAnimation ) {
        animationDelay = 0;
      }
      // only pop if we have views to pop (Can't pop the first!)
      if ( self._subviews.length <= 1 ) {
        return;
      }
      // pop the top view off the stack
      var thePoppingView = self._subviews.pop(),
        theShowingView = self.topView,
        thePoppingViewZ = parseInt( getComputedStyle( thePoppingView.element ).getPropertyValue( "z-index" ) || "0", 10 ),
        theShowingViewZ = parseInt( getComputedStyle( theShowingView.element ).getPropertyValue( "z-index" ) || "0", 10 );
      if ( theShowingViewZ >= thePoppingViewZ ) {
        thePoppingViewZ = theShowingViewZ + 10;
      }
      theShowingView.element.style.display = "inherit";
      // make sure that theShowingView is off screen to the left, and the popping
      // view is at 0
      UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "inherit" );
      UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "inherit" );
      UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "inherit" );
      UI.styleElement( theShowingView.element, "transform", "translate3d(-50%,0," + theShowingViewZ + "px)" );
      UI.styleElement( thePoppingView.element, "transform", "translate3d(0,0," + thePoppingViewZ + "px" );
      if ( usingAnimation ) {
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "0" );
        UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
      } else {
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
        UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
      }
      // set up an animation
      if ( usingAnimation ) {
        UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "-webkit-transform " +
                                                                                          animationDelay + "s " + animationType );
        UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "-moz-transform " +
                                                                                          animationDelay + "s " + animationType );
        UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "-ms-transform " +
                                                                                          animationDelay + "s " + animationType );
        UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "transform " + animationDelay +
                                                                                          "s " + animationType );
        UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "opacity " +
                                                                                                           animationDelay + "s " + animationType );
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "opacity " +
                                                                                                           animationDelay + "s " + animationType );
      }
      // display the click prevention element
      self._preventClicks.style.display = "block";
      setTimeout( function () {
        // and move everyone
        UI.styleElement( theShowingView.element, "transform", "translate3d(0,0," + theShowingViewZ + "px)" );
        UI.styleElement( thePoppingView.element, "transform", "translate3d(100%,0," + thePoppingViewZ + "px)" );
        if ( usingAnimation ) {
          UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "0" );
          UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
        }
        // the the view it's about to show...
        thePoppingView.notify( "viewWillDisappear" );
        theShowingView.notify( "viewWillAppear" );
        // tell the view it's visible after the delay has passed
        setTimeout( function () {
          thePoppingView.notify( "viewDidDisappear" );
          thePoppingView.notify( "viewWasPopped" );
          theShowingView.notify( "viewDidAppear" );
          // tell anyone who is listening who got popped
          self.notify( "viewPopped", [thePoppingView] );
          // hide click preventer
          self._preventClicks.style.display = "none";
          // and remove the popping view from the hierarchy
          thePoppingView.parentElement = null;
          delete thePoppingView.navigationController;
        }, ( animationDelay * 1000 ) );
      }, 50 );
    };
    /**
     * Presents the navigation controller as a modal navigation controller. It sits
     * adjacent to `fromView` in the DOM, not within, and as such can prevent it
     * from receiving any events. The rendering is rougly the same as any other
     * navigation controller, save that an extra class added to the element's
     * `ui-container` that ensures that on larger displays the modal doesn't
     * fill the entire screen. If desired, this class can be controlled by the second
     * parameter (`options`).
     *
     * if `options` are specified, it must be of the form:
     * ```
     * { displayType: "modalWindow|modalPage|modalFill",   // modal display type
       *   withAnimation: true|false,                        // should animation be used?
       *   withDelay: 0.3,                                   // if animation is used, time in seconds
       *   withTimingFunction: "ease-in-out|..."             // timing function to use for animation
       * }
     * ```
     *
     * @method presentModalController
     * @param {Node} fromView                      the top-level view to cover (typically rootContainer)
     * @param {*} options                          options to apply
     */
    self.presentModalController = function presentModelController( fromView, options ) {
      var defaultOpts = {
        displayType:        "modalWindow",
        withAnimation:      true,
        withDelay:          0.3,
        withTimingFunction: "ease-in-out"
      };
      if ( typeof options !== "undefined" ) {
        if ( typeof options.displayType !== "undefined" ) {
          defaultOpts.displayType = options.displayType;
        }
        if ( typeof options.withAnimation !== "undefined" ) {
          defaultOpts.withAnimation = options.withAnimation;
        }
        if ( typeof options.withDelay !== "undefined" ) {
          defaultOpts.withDelay = options.withDelay;
        }
        if ( typeof options.withTimingFunction !== "undefined" ) {
          defaultOpts.withTimingFunction = options.withTimingFunction;
        }
      }
      if ( !defaultOpts.withAnimation ) {
        defaultOpts.withDelay = 0;
      }
      // check our form factor class; if we're a phone, only permit modalFill
      if ( document.body.classList.contains( "phone" ) ) {
        defaultOpts.displayType = "modalFill";
      }
      self._modalView = fromView;
      self._modal = true;
      self._modalViewType = defaultOpts.displayType;
      self._modalClickPreventer = document.createElement( "div" );
      self._modalClickPreventer.className = "ui-container ui-transparent";
      // we need to calculate the z indices of the adjacent view and us
      var theAdjacentViewZ = parseInt( getComputedStyle( fromView ).getPropertyValue( "z-index" ) || "0", 10 ),
        theModalViewZ = parseInt( getComputedStyle( self.element ).getPropertyValue( "z-index" ) || "0", 10 );
      if ( theModalViewZ <= theAdjacentViewZ ) {
        theModalViewZ = theAdjacentViewZ + 10; // the modal should always be above the adjacent view
      }
      // make sure our current view is off-screen so that when it is added, it won't flicker
      self.element.$s( "transform", UTIL.template( "translate3d(%X%,%Y%,%Z%)", {
        x: "0",
        y: "150%",
        z: "" + theModalViewZ + "px"
      } ) );
      self.element.classList.add( defaultOpts.displayType );
      // and attach the element
      self._modalClickPreventer.appendChild( self.element );
      fromView.parentNode.appendChild( self._modalClickPreventer );
      // send any notifications we need
      self.emit( "viewWasPushed" );
      self.emit( "viewWillAppear" );
      setTimeout( function () {
        fromView.classList.add( "ui-disabled" );
        UI.beginAnimation( fromView ).setTiming( defaultOpts.withDelay ).setTimingFunction( defaultOpts.withTimingFunction )
          .scale( "0.9" ).opacity( "0.9" ).endAnimation();
        UI.beginAnimation( self.element ).setTiming( defaultOpts.withDelay ).setTimingFunction( defaultOpts.withTimingFunction )
          .translate3d( "0", "0", "" + theModalViewZ + "px" ).endAnimation( function sendNotifications() {
                                                                              self.emit( "viewDidAppear" );
                                                                            } );
      }, 50 );
    };
    /**
     * Dismiss a controller presented with `presentModelController`. Options can be
     *
     * ```
     * { withAnimation: true|false,         // if false, no animation occurs
       *   withDelay: 0.3,                    // time in seconds
       *   withTimingFunction: "ease-in-out"  // easing function to use
       * }
     * ```
     *
     * @method dismissModalController
     * @param {*} options
     */
    self.dismissModalController = function dismissModelController( options ) {
      var defaultOpts = {
        withAnimation:      true,
        withDelay:          0.3,
        withTimingFunction: "ease-in-out"
      };
      if ( typeof options !== "undefined" ) {
        if ( typeof options.withAnimation !== "undefined" ) {
          defaultOpts.withAnimation = options.withAnimation;
        }
        if ( typeof options.withDelay !== "undefined" ) {
          defaultOpts.withDelay = options.withDelay;
        }
        if ( typeof options.withTimingFunction !== "undefined" ) {
          defaultOpts.withTimingFunction = options.withTimingFunction;
        }
      }
      if ( !defaultOpts.withAnimation ) {
        defaultOpts.withDelay = 0;
      }
      // we need to calculate the z indices of the adjacent view and us
      var theAdjacentViewZ = parseInt( getComputedStyle( self.modalView ).getPropertyValue( "z-index" ) || "0", 10 ),
        theModalViewZ = parseInt( getComputedStyle( self.element ).getPropertyValue( "z-index" ) || "0", 10 );
      if ( theModalViewZ <= theAdjacentViewZ ) {
        theModalViewZ = theAdjacentViewZ + 10; // the modal should always be above the adjacent view
      }
      // send any notifications we need
      self.emit( "viewWillDisappear" );
      setTimeout( function () {
        self.modalView.classList.remove( "ui-disabled" );
        UI.beginAnimation( self.modalView ).setTiming( defaultOpts.withDelay ).setTimingFunction( defaultOpts.withTimingFunction )
          .scale( "1" ).opacity( "1" ).endAnimation();
        UI.beginAnimation( self.element ).setTiming( defaultOpts.withDelay ).setTimingFunction( defaultOpts.withTimingFunction )
          .translate3d( "0", "150%", "" + theModalViewZ + "px" ).endAnimation(
          function sendNotifications() {
            self.emit( "viewDidDisappear" );
            self.emit( "viewWasPopped" );
            self.element.classList.remove( self.modalViewType );
            self._modalClickPreventer.parentNode.removeChild( self._modalClickPreventer );
            self._modalClickPreventer.removeChild( self.element );
            self._modal = false;
            self._modalView = null;
            self._modalViewType = "";
            self._modalClickPreventer = null;
          } );
      }, 50 );
    };
    /**
     * @method render
     * @abstract
     */
    self.override( function render() {
      return ""; // nothing to render!
    } );
    /**
     * Create elements and click prevention elements if necessary; otherwise there's nothing to do
     * @method renderToElement
     */
    self.override( function renderToElement() {
      self.createElementIfNotCreated();
      self._createClickPreventionElementIfNotCreated();
      return; // nothing to do.
    } );
    /**
     * Initialize the navigation controller
     * @method init
     * @return {Object}
     */
    self.override( function init( theRootView, theElementId, theElementTag, theElementClass, theParentElement ) {
      if ( typeof theRootView === "undefined" ) {
        throw new Error( "Can't initialize a navigation controller without a root view." );
      }
      // do what a normal view container does
      self.$super( theElementId, theElementTag, theElementClass, theParentElement );
      //self.super( _className, "init", [theElementId, theElementTag, theElementClass, theParentElement ] );
      // now add the root view
      self.rootView = theRootView;
      return self;
    } );
    /**
     * Initialize the navigation controller
     * @method initWithOptions
     * @return {Object}
     */
    self.override( function initWithOptions( options ) {
      var theRootView, theElementId, theElementTag, theElementClass,
        theParentElement;
      if ( typeof options !== "undefined" ) {
        if ( typeof options.id !== "undefined" ) {
          theElementId = options.id;
        }
        if ( typeof options.tag !== "undefined" ) {
          theElementTag = options.tag;
        }
        if ( typeof options.class !== "undefined" ) {
          theElementClass = options.class;
        }
        if ( typeof options.parent !== "undefined" ) {
          theParentElement = options.parent;
        }
        if ( typeof options.rootView !== "undefined" ) {
          theRootView = options.rootView;
        }
      }
      return self.init( theRootView, theElementId, theElementTag, theElementClass, theParentElement );
    } );
    // handle auto initialization
    self._autoInit.apply( self, arguments );
    return self;
  };
module.exports = NavigationController;

},{"../util/core":13,"./core":4,"./viewContainer":12}],7:[function(require,module,exports){
/**
 *
 * Provides native-like alert methods, including prompts and messages.
 *
 * @module alert.js
 * @author Kerri Shotts
 * @version 0.4
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module*/
"use strict";
var _y = require( "../util/core" ),
  BaseObject = require( "../util/object" ),
  UI = require( "./core" ),
  h = require( "yasmf-h" );
var _className = "Spinner";

function Spinner() {
  var self = new BaseObject();
  self.subclass( _className );
  self._element = null;
  self.defineObservableProperty( "text" );
  self.defineProperty( "visible", {
    default: false
  } );
  self.setObservableTintedBackground = function setObservableTintedBackground( v ) {
    if ( v ) {
      self._element.classList.add( "obscure-background" );
    } else {
      self._element.classList.remove( "obscure-background" );
    }
    return v;
  }
  self.defineObservableProperty( "tintedBackground", {
    default: false
  } );
  self.show = function show() {
    if ( !self.visible ) {
      UI._rootContainer.parentNode.appendChild( self._element );
      self.visible = true;
      setTimeout( function () {
        self._element.style.opacity = "1";
      }, 0 );
    }
  };
  self.hide = function hide( cb ) {
    if ( self.visible ) {
      self._element.style.opacity = "0";
      self.visible = false;
      setTimeout( function () {
        UI._rootContainer.parentNode.removeChild( self._element );
        if ( typeof cb === "function" ) {
          setTimeout( cb, 0 );
        }
      }, 250 );
    }
  };
  self.override( function init() {
    self.super( _className, "init" );
    self._element = h.el( "div.ui-spinner-outer-container",
                          h.el( "div.ui-spinner-inner-container",
                                [h.el( "div.ui-spinner-inner-spinner" ),
                                 h.el( "div.ui-spinner-inner-text", {
                                   bind: {
                                     object:  self,
                                     keyPath: "text"
                                   }
                                 } )
                                ] ) );
    return self;
  } );
  self.initWithOptions = function initWithOptions( options ) {
    self.init();
    self.text = options.text;
    self.tintedBackground = ( options.tintedBackground !== undefined ) ? options.tintedBackground : false;
    return self;
  };
  self.override( function destroy() {
    if ( self.visible ) {
      UI._rootContainer.parentNode.removeChild( self._element );
      self.visible = false;
    }
    self._element = null;
    self.super( _className, "destroy" );
  } )
  self._autoInit.apply( self, arguments );
  return self;
}
module.exports = Spinner;

},{"../util/core":13,"../util/object":19,"./core":4,"yasmf-h":21}],8:[function(require,module,exports){
/**
 *
 * Split View Controllers provide basic support for side-by-side views
 *
 * @module splitViewController.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module*/
"use strict";
var UI = require( "./core" ),
  ViewContainer = require( "./viewContainer" );
var _className = "SplitViewController";
var SplitViewController = function () {
  var self = new ViewContainer();
  self.subclass( _className );
  // # Notifications
  //
  // * `viewsChanged` - fired when the left or right side view changes
  //
  self.registerNotification( "viewsChanged" );
  self._preventClicks = null;
  /**
   * Creates a click-prevention element -- essentially a transparent DIV that
   * fills the screen.
   * @method _createClickPreventionElement
   * @private
   */
  self._createClickPreventionElement = function () {
    self.createElementIfNotCreated();
    self._preventClicks = document.createElement( "div" );
    self._preventClicks.className = "ui-prevent-clicks";
    self.element.appendChild( self._preventClicks );
  };
  /**
   * Create a click-prevention element if necessary
   * @method _createClickPreventionElementIfNotCreated
   * @private
   */
  self._createClickPreventionElementIfNotCreated = function () {
    if ( self._preventClicks === null ) {
      self._createClickPreventionElement();
    }
  };
  /**
   * Indicates the type of split canvas:
   *
   * * `split`: typical split-view - left and right side shares space on screen
   * * `off-canvas`: off-canvas view AKA Facebook split view. Left side is off screen and can slide in
   * * `split-overlay`: left side slides over the right side when visible
   *
   * @property viewType
   * @type {String}
   */
  self.setViewType = function ( theViewType ) {
    self.element.classList.remove( "ui-" + self._viewType + "-view" );
    self._viewType = theViewType;
    self.element.classList.add( "ui-" + theViewType + "-view" );
    self.leftViewStatus = "invisible";
  };
  self.defineProperty( "viewType", {
    read:    true,
    write:   true,
    default: "split"
  } );
  /**
   * Indicates whether or not the left view is `visible` or `invisible`.
   *
   * @property leftViewStatus
   * @type {String}
   */
  self.setLeftViewStatus = function ( viewStatus ) {
    self._preventClicks.style.display = "block";
    self.element.classList.remove( "ui-left-side-" + self._leftViewStatus );
    self._leftViewStatus = viewStatus;
    self.element.classList.add( "ui-left-side-" + viewStatus );
    setTimeout( function () {
      self._preventClicks.style.display = "none";
    }, 600 );
  };
  self.defineProperty( "leftViewStatus", {
    read:    true,
    write:   true,
    default: "invisible"
  } );
  /**
   * Toggle the visibility of the left side view
   * @method toggleLeftView
   */
  self.toggleLeftView = function () {
    if ( self.leftViewStatus === "visible" ) {
      self.leftViewStatus = "invisible";
    } else {
      self.leftViewStatus = "visible";
    }
  };
  /**
   * The array of views that this split view controller manages.
   * @property subviews
   * @type {Array}
   */
  self.defineProperty( "subviews", {
    read:    true,
    write:   false,
    default: [null, null]
  } );
  // internal elements
  self._leftElement = null;
  self._rightElement = null;
  /**
   * Create the left and right elements
   * @method _createElements
   * @private
   */
  self._createElements = function () {
    if ( self._leftElement !== null ) {
      self.element.removeChild( self._leftElement );
    }
    if ( self._rightElement !== null ) {
      self.element.removeChild( self._rightElement );
    }
    self._leftElement = document.createElement( "div" );
    self._rightElement = document.createElement( "div" );
    self._leftElement.className = "ui-container left-side";
    self._rightElement.className = "ui-container right-side";
    self.element.appendChild( self._leftElement );
    self.element.appendChild( self._rightElement );
  };
  /**
   * Create the left and right elements if necessary
   * @method _createElementsIfNecessary
   * @private
   */
  self._createElementsIfNecessary = function () {
    if ( self._leftElement !== null && self._rightElement !== null ) {
      return;
    }
    self._createElements();
  };
  /**
   * Assigns a view to a given side
   * @method _assignViewToSide
   * @param {DOMElement} whichElement
   * @param {ViewContainer} aView
   * @private
   */
  self._assignViewToSide = function ( whichElement, aView ) {
    self._createElementsIfNecessary();
    aView.splitViewController = self;
    aView.notify( "viewWasPushed" ); // notify the view it was "pushed"
    aView.notify( "viewWillAppear" ); // notify the view it will appear
    aView.parentElement = whichElement; // and make us the parent
    aView.notify( "viewDidAppear" ); // and notify it that it's actually there.
  };
  /**
   * Unparents a view on a given side, sending all the requisite notifications
   *
   * @method _unparentSide
   * @param {Number} sideIndex
   * @private
   */
  self._unparentSide = function ( sideIndex ) {
    if ( self._subviews.length >= sideIndex ) {
      var aView = self._subviews[sideIndex];
      if ( aView !== null ) {
        aView.notify( "viewWillDisappear" ); // notify the view that it is going to disappear
        aView.parentElement = null; // remove the view
        aView.notify( "viewDidDisappear" ); // notify the view that it did disappear
        aView.notify( "viewWasPopped" ); // notify the view that it was "popped"
        delete aView.splitViewController;
      }
    }
  };
  /**
   * Allows access to the left view
   * @property leftView
   * @type {ViewContainer}
   */
  self.getLeftView = function () {
    if ( self._subviews.length > 0 ) {
      return self._subviews[0];
    } else {
      return null;
    }
  };
  self.setLeftView = function ( aView ) {
    self._unparentSide( 0 ); // send disappear notices
    if ( self._subviews.length > 0 ) {
      self._subviews[0] = aView;
    } else {
      self._subviews.push( aView );
    }
    self._assignViewToSide( self._leftElement, aView );
    self.notify( "viewsChanged" );
  };
  self.defineProperty( "leftView", {
    read:            true,
    write:           true,
    backingVariable: false
  } );
  /**
   * Allows access to the right view
   * @property rightView
   * @type {ViewContainer}
   */
  self.getRightView = function () {
    if ( self._subviews.length > 1 ) {
      return self._subviews[1];
    } else {
      return null;
    }
  };
  self.setRightView = function ( aView ) {
    self._unparentSide( 1 ); // send disappear notices for right side
    if ( self._subviews.length > 1 ) {
      self._subviews[1] = aView;
    } else {
      self._subviews.push( aView );
    }
    self._assignViewToSide( self._rightElement, aView );
    self.notify( "viewsChanged" );
  };
  self.defineProperty( "rightView", {
    read:            true,
    write:           true,
    backingVariable: false
  } );
  /**
   * @method render
   * @abstract
   */
  self.override( function render() {
    return ""; // nothing to render!
  } );
  /**
   * Creates the left and right elements if necessary
   * @method renderToElement
   */
  self.override( function renderToElement() {
    self._createElementsIfNecessary();
    self._createClickPreventionElementIfNotCreated();
    return; // nothing to do.
  } );
  /**
   * Initialize the split view controller
   * @method init
   * @param {ViewContainer} theLeftView
   * @param {ViewContainer} theRightView
   * @param {String} [theElementId]
   * @param {String} [theElementClass]
   * @param {String} [theElementTag]
   * @param {DOMElement} [theParentElement]
   */
  self.override( function init( theLeftView, theRightView, theElementId, theElementTag, theElementClass, theParentElement ) {
    if ( typeof theLeftView === "undefined" ) {
      throw new Error( "Can't initialize a navigation controller without a left view." );
    }
    if ( typeof theRightView === "undefined" ) {
      throw new Error( "Can't initialize a navigation controller without a right view." );
    }
    // do what a normal view container does
    self.$super( theElementId, theElementTag, theElementClass, theParentElement );
//    self.super( _className, "init", [theElementId, theElementTag, theElementClass, theParentElement ] );
    // now add the left and right views
    self.leftView = theLeftView;
    self.rightView = theRightView;
    return self;
  } );
  /**
   * Initialize the split view controller
   * @method initWithOptions
   */
  self.override( function initWithOptions( options ) {
    var theLeftView, theRightView, theElementId, theElementTag, theElementClass,
      theParentElement;
    if ( typeof options !== "undefined" ) {
      if ( typeof options.id !== "undefined" ) {
        theElementId = options.id;
      }
      if ( typeof options.tag !== "undefined" ) {
        theElementTag = options.tag;
      }
      if ( typeof options.class !== "undefined" ) {
        theElementClass = options.class;
      }
      if ( typeof options.parent !== "undefined" ) {
        theParentElement = options.parent;
      }
      if ( typeof options.leftView !== "undefined" ) {
        theLeftView = options.leftView;
      }
      if ( typeof options.rightView !== "undefined" ) {
        theRightView = options.rightView;
      }
    }
    self.init( theLeftView, theRightView, theElementId, theElementTag, theElementClass, theParentElement );
    if ( typeof options !== "undefined" ) {
      if ( typeof options.viewType !== "undefined" ) {
        self.viewType = options.viewType;
      }
      if ( typeof options.leftViewStatus !== "undefined" ) {
        self.leftViewStatus = options.leftViewStatus;
      }
    }
    return self;
  } );
  /**
   * Destroy our elements and clean up
   *
   * @method destroy
   */
  self.override( function destroy() {
    self._unparentSide( 0 );
    self._unparentSide( 1 );
    if ( self._leftElement !== null ) {
      self.element.removeChild( self._leftElement );
    }
    if ( self._rightElement !== null ) {
      self.element.removeChild( self._rightElement );
    }
    self._leftElement = null;
    self._rightElement = null;
    self.$super();
    //self.super( _className, "destroy" );
  } );
  // auto initialize
  self._autoInit.apply( self, arguments );
  return self;
};
module.exports = SplitViewController;

},{"./core":4,"./viewContainer":12}],9:[function(require,module,exports){
/**
 *
 * Tab View Controllers provide basic support for tabbed views
 *
 * @module tabViewController.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module*/
"use strict";
var UI = require( "./core" ),
  ViewContainer = require( "./viewContainer" ),
  event = require( "./event" );
var _className = "TabViewController";
var TabViewController = function () {
  var self = new ViewContainer();
  self.subclass( _className );
  // # Notifications
  //
  // * `viewsChanged` - Fired when the views change
  self.registerNotification( "viewsChanged" );
  // internal elements
  self._tabElements = []; // each tab on the tab bar
  self._tabBarElement = null; // contains our bar button group
  self._barButtonGroup = null; // contains all our tabs
  self._viewContainer = null; // contains all our subviews
  /**
   * Create the tab bar element
   * @method _createTabBarElement
   * @private
   */
  self._createTabBarElement = function () {
    self._tabBarElement = document.createElement( "div" );
    self._tabBarElement.className = "ui-tab-bar ui-tab-default-position";
    self._barButtonGroup = document.createElement( "div" );
    self._barButtonGroup.className = "ui-bar-button-group ui-align-center";
    self._tabBarElement.appendChild( self._barButtonGroup );
  };
  /**
   * Create the tab bar element if necessary
   * @method _createTabBarElementIfNecessary
   * @private
   */
  self._createTabBarElementIfNecessary = function () {
    if ( self._tabBarElement === null ) {
      self._createTabBarElement();
    }
  };
  /**
   * create the view container that will hold all the views this tab bar owns
   * @method _createViewContainer
   * @private
   */
  self._createViewContainer = function () {
    self._viewContainer = document.createElement( "div" );
    self._viewContainer.className = "ui-container ui-avoid-tab-bar ui-tab-default-position";
  };
  /**
   * @method _createViewContainerIfNecessary
   * @private
   */
  self._createViewContainerIfNecessary = function () {
    if ( self._viewContainer === null ) {
      self._createViewContainer();
    }
  };
  /**
   * Create all the elements and the DOM structure
   * @method _createElements
   * @private
   */
  self._createElements = function () {
    self._createTabBarElementIfNecessary();
    self._createViewContainerIfNecessary();
    self.element.appendChild( self._tabBarElement );
    self.element.appendChild( self._viewContainer );
  };
  /**
   * @method _createElementsIfNecessary
   * @private
   */
  self._createElementsIfNecessary = function () {
    if ( self._tabBarElement !== null || self._viewContainer !== null ) {
      return;
    }
    self._createElements();
  };
  /**
   * Create a tab element and attach the appropriate event listener
   * @method _createTabElement
   * @private
   */
  self._createTabElement = function ( aView, idx ) {
    var e = document.createElement( "div" );
    e.className = "ui-bar-button ui-tint-color";
    e.innerHTML = aView.title;
    e.setAttribute( "data-tag", idx )
    event.addListener( e, "touchstart", function () {
      self.selectedTab = parseInt( this.getAttribute( "data-tag" ), 10 );
    } );
    return e;
  };
  /**
   * The position of the the tab bar
   * Valid options include: `default`, `top`, and `bottom`
   * @property barPosition
   * @type {TabViewController.BAR\_POSITION}
   */
  self.setObservableBarPosition = function ( newPosition, oldPosition ) {
    self._createElementsIfNecessary();
    self._tabBarElement.classList.remove( "ui-tab-" + oldPosition + "-position" );
    self._tabBarElement.classList.add( "ui-tab-" + newPosition + "-position" );
    self._viewContainer.classList.remove( "ui-tab-" + oldPosition + "-position" );
    self._viewContainer.classList.add( "ui-tab-" + newPosition + "-position" );
    return newPosition;
  };
  self.defineObservableProperty( "barPosition", {
    default: "default"
  } );
  /**
   * The alignment of the bar items
   * Valid options are: `left`, `center`, `right`
   * @property barAlignment
   * @type {TabViewController.BAR\_ALIGNMENT}
   */
  self.setObservableBarAlignment = function ( newAlignment, oldAlignment ) {
    self._createElementsIfNecessary();
    self._barButtonGroup.classList.remove( "ui-align-" + oldAlignment );
    self._barButtonGroup.classList.add( "ui-align-" + newAlignment );
    return newAlignment;
  };
  self.defineObservableProperty( "barAlignment", {
    default: "center"
  } );
  /**
   * The array of views that this tab view controller manages.
   * @property subviews
   * @type {Array}
   */
  self.defineProperty( "subviews", {
    read:    true,
    write:   false,
    default: []
  } );
  /**
   * Add a subview to the tab bar.
   * @method addSubview
   * @property {ViewContainer} view
   */
  self.addSubview = function ( view ) {
    self._createElementsIfNecessary();
    var e = self._createTabElement( view, self._tabElements.length );
    self._barButtonGroup.appendChild( e );
    self._tabElements.push( e );
    self._subviews.push( view );
    view.tabViewController = self;
    view.notify( "viewWasPushed" );
  };
  /**
   * Remove a specific view from the tab bar.
   * @method removeSubview
   * @property {ViewContainer} view
   */
  self.removeSubview = function ( view ) {
    self._createElementsIfNecessary();
    var i = self._subviews.indexOf( view );
    if ( i > -1 ) {
      var hidingView = self._subviews[i];
      var hidingViewParent = hidingView.parentElement;
      if ( hidingViewParent !== null ) {
        hidingView.notify( "viewWillDisappear" );
      }
      hidingView.parentElement = null;
      if ( hidingViewParent !== null ) {
        hidingView.notify( "viewDidDisappear" );
      }
      self._subviews.splice( i, 1 );
      self._barButtonGroup.removeChild( self._tabElements[i] );
      self._tabElements.splice( i, 1 );
      var curSelectedTab = self.selectedTab;
      if ( curSelectedTab > i ) {
        curSelectedTab--;
      }
      if ( curSelectedTab > self._tabElements.length ) {
        curSelectedTab = self._tabElements.length;
      }
      self.selectedTab = curSelectedTab;
    }
    view.notify( "viewWasPopped" );
    delete view.tabViewController;
  };
  /**
   * Determines which tab is selected; changing will display the appropriate
   * tab.
   *
   * @property selectedTab
   * @type {Number}
   */
  self.setObservableSelectedTab = function ( newIndex, oldIndex ) {
    var oldView, newView;
    self._createElementsIfNecessary();
    if ( oldIndex > -1 ) {
      oldView = self._subviews[oldIndex];
      if ( newIndex > -1 ) {
        newView = self._subviews[newIndex];
      }
      oldView.notify( "viewWillDisappear" );
      if ( newIndex > -1 ) {
        newView.notify( "viewWillAppear" );
      }
      oldView.parentElement = null;
      if ( newIndex > -1 ) {
        self._subviews[newIndex].parentElement = self._viewContainer;
      }
      oldView.notify( "viewDidDisappear" );
      if ( newIndex > -1 ) {
        newView.notify( "viewDidAppear" );
      }
    } else {
      newView = self._subviews[newIndex];
      newView.notify( "viewWillAppear" );
      self._subviews[newIndex].parentElement = self._viewContainer;
      newView.notify( "viewDidAppear" );
    }
    return newIndex;
  };
  self.defineObservableProperty( "selectedTab", {
    default:      -1,
    notifyAlways: true
  } );
  /**
   * @method render
   */
  self.override( function render() {
    return ""; // nothing to render!
  } );
  /**
   * @method renderToElement
   */
  self.override( function renderToElement() {
    self._createElementsIfNecessary();
    return; // nothing to do.
  } );
  /**
   * Initialize the tab controller
   * @method init
   * @param {String} [theElementId]
   * @param {String} [theElementTag]
   * @param {String} [theElementClass]
   * @param {DOMElement} [theParentElement]
   * @return {Object}
   */
  self.override( function init( theElementId, theElementTag, theElementClass, theParentElement ) {
    // do what a normal view container does
    self.$super( theElementId, theElementTag, theElementClass, theParentElement );
    //self.super( _className, "init", [theElementId, theElementTag, theElementClass, theParentElement ] );
    return self;
  } );
  /**
   * Initialize the tab controller
   * @method initWithOptions
   * @param {Object} options
   * @return {Object}
   */
  self.override( function initWithOptions( options ) {
    var theElementId, theElementTag, theElementClass, theParentElement;
    if ( typeof options !== "undefined" ) {
      if ( typeof options.id !== "undefined" ) {
        theElementId = options.id;
      }
      if ( typeof options.tag !== "undefined" ) {
        theElementTag = options.tag;
      }
      if ( typeof options.class !== "undefined" ) {
        theElementClass = options.class;
      }
      if ( typeof options.parent !== "undefined" ) {
        theParentElement = options.parent;
      }
    }
    self.init( theElementId, theElementTag, theElementClass, theParentElement );
    if ( typeof options !== "undefined" ) {
      if ( typeof options.barPosition !== "undefined" ) {
        self.barPosition = options.barPosition;
      }
      if ( typeof options.barAlignment !== "undefined" ) {
        self.barAlignment = options.barAlignment;
      }
    }
    return self;
  } );
  // auto init
  self._autoInit.apply( self, arguments );
  return self;
};
TabViewController.BAR_POSITION = {
  default: "default",
  top:     "top",
  bottom:  "bottom"
};
TabViewController.BAR_ALIGNMENT = {
  center: "center",
  left:   "left",
  right:  "right"
};
module.exports = TabViewController;

},{"./core":4,"./event":5,"./viewContainer":12}],10:[function(require,module,exports){
/**
 *
 * ui Bar Button Template
 *
 * @module uiBarButton.js
 * @author Kerri Shotts
 * @version 0.4
 *
 * ```
 * Copyright (c) 2015 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module*/
"use strict";

var
  h = require( "yasmf-h" );

/**
 * Return a UI Bar Button node
 *
 * Options should look like this:
 *
 * {
 *   [regular h options],
 *   glyph: "clock", // mutually exclusive with text
 *   text: "tap me!", // mutually exclusive with glyph
 *   backButton: false, // or true; if true, requires text
 * }
 *
 * @method uiBarButton
 * @param {{[glyph]: string, [text]: string, [backButton]: boolean}} options
 * @returns {Node}
 */
module.exports = function uiBarButton( options ) {
  var buttonClass = "ui-bar-button",
    isButtonGlyph = false;
  if ( options ) {
    if ( options.glyph ) {
      buttonClass += ["", "ui-glyph", "ui-glyph-" + options.glyph, "ui-background-tint-color"].join( " " );
      isButtonGlyph = true;
    }
    if (options.backButton) {
      buttonClass += " ui-back-button";
    }
  }

  if ( !isButtonGlyph ) {
    buttonClass += " ui-tint-color";
  }

  return h.el( "div." + buttonClass, options, options && options.text );
};

},{"yasmf-h":21}],11:[function(require,module,exports){
/**
 *
 * ui Navigation Bar Template
 *
 * @module uiNavigationBar.js
 * @author Kerri Shotts
 * @version 0.4
 *
 * ```
 * Copyright (c) 2015 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module*/
"use strict";
var
  h = require( "yasmf-h" );

function scrollToTop() {
  var scroller = this.parentNode.parentNode.$( ".ui-scroll-container" );
  if ( scroller ) {
    scroller.scrollTop = 0; // scroll to top, please!
  }
}

module.exports = function uiNavigationBar( options ) {
  return h.el( "div.ui-navigation-bar",
               [
                 options && options.leftGroup ? h.el( "div.ui-bar-button-group ui-align-left", options.leftGroup ) : undefined,
                 options && options.title ? h.el( "div.ui-title", options.title, options.titleOptions ) : undefined,
                 options && options.centerGroup ? h.el( "div.ui-bar-button-group ui-align-center", options.centerGroup ) : undefined,
                 options && options.rightGroup ? h.el( "div.ui-bar-button-group ui-align-right", options.rightGroup ) : undefined
               ]
  );
};

},{"yasmf-h":21}],12:[function(require,module,exports){
/**
 *
 * View Containers are simple objects that provide very basic view management with
 * a thin layer over the corresponding DOM element.
 *
 * @module viewContainer.js
 * @author Kerri Shotts
 * @version 0.5
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module*/
"use strict";
var BaseObject = require( "../util/object" ),
  h = require( "yasmf-h" );
var _className = "ViewContainer";
var ViewContainer = function () {
  var self = new BaseObject();
  self.subclass( _className );
  // # Notifications
  // * `viewWasPushed` is fired by a containing `ViewController` when the view is added
  //   to the view stack
  // * `viewWasPopped` is fired by a container when the view is removed from the view stack
  // * `viewWillAppear` is fired by a container when the view is about to appear (one should avoid
  //   any significant DOM changes or calculations during this time, or animations may stutter)
  // * `viewWillDisappear` is fired by a container when the view is about to disappear
  // * `viewDidAppear` is fired by a container when the view is on screen.
  // * `viewDidDisappear` is fired by a container when the view is off screen.
  self.registerNotification( "viewWasPushed" );
  self.registerNotification( "viewWasPopped" );
  self.registerNotification( "viewWillAppear" );
  self.registerNotification( "viewWillDisappear" );
  self.registerNotification( "viewDidAppear" );
  self.registerNotification( "viewDidDisappear" );
  self.registerNotification( "willRender", false );
  self.registerNotification( "didRender", false );
  // private properties used to manage the corresponding DOM element
  self._element = null;
  self._elementClass = "ui-container"; // default; can be changed to any class for styling purposes
  self._elementId = null; // bad design decision -- probably going to mark this as deprecated soon
  self._elementTag = "div"; // some elements might need to be something other than a DIV
  self._parentElement = null; // owning element
  /**
   * The title isn't displayed anywhere (unless you use it yourself in `renderToElement`, but
   * is useful for containers that want to know the title of their views.
   * @property title
   * @type {String}
   * @observable
   */
  self.defineObservableProperty( "title" );
  /**
   * Creates the internal elements.
   * @method createElement
   */
  self.createElement = function () {
    self._element = document.createElement( self._elementTag );
    if ( self.elementClass !== null ) {
      self._element.className = self.elementClass;
    }
    if ( self.elementId !== null ) {
      self._element.id = self.elementId;
    }
  };
  /**
   * Creates the internal elements if necessary (that is, if they aren't already in existence)
   * @method createElementIfNotCreated
   */
  self.createElementIfNotCreated = function () {
    if ( self._element === null ) {
      self.createElement();
    }
  };
  /**
   * The `element` property allow direct access to the DOM element backing the view
   * @property element
   * @type {DOMElement}
   */
  self.getElement = function () {
    self.createElementIfNotCreated();
    return self._element;
  };
  self.defineProperty( "element", {
    read:    true,
    write:   true,
    default: null
  } );
  /**
   * The `elementClass` property indicates the class of the DOM element. Changing
   * the class will alter the backing DOM element if created.
   * @property elementClass
   * @type {String}
   * @default "ui-container"
   */
  self.setElementClass = function ( theClassName ) {
    self._elementClass = theClassName;
    if ( self._element !== null ) {
      self._element.className = theClassName;
    }
  };
  self.defineProperty( "elementClass", {
    read:    true,
    write:   true,
    default: "ui-container"
  } );
  /**
   * Determines the `id` for the backing DOM element. Not the best choice to
   * use, since this must be unique within the DOM. Probably going to become
   * deprecated eventually
   */
  self.setElementId = function ( theElementId ) {
    self._elementId = theElementId;
    if ( self._element !== null ) {
      self._element.id = theElementId;
    }
  };
  self.defineProperty( "elementId", {
    read:    true,
    write:   true,
    default: null
  } );
  /**
   * Determines the type of DOM Element; by default this is a DIV.
   * @property elementTag
   * @type {String}
   * @default "div"
   */
  self.defineProperty( "elementTag", {
    read:    true,
    write:   true,
    default: "div"
  } );
  /**
   * Indicates the parent element, if it exists. This is a DOM element
   * that owns this view (parent -> child). Changing the parent removes
   * this element from the parent and reparents to another element.
   * @property parentElement
   * @type {DOMElement}
   */
  self.setParentElement = function ( theParentElement ) {
    if ( self._parentElement !== null && self._element !== null ) {
      // remove ourselves from the existing parent element first
      self._parentElement.removeChild( self._element );
      self._parentElement = null;
    }
    self._parentElement = theParentElement;
    if ( self._parentElement !== null && self._element !== null ) {
      self._parentElement.appendChild( self._element );
    }
  };
  self.defineProperty( "parentElement", {
    read:    true,
    write:   true,
    default: null
  } );
  /**
   * @method render
   * @return {String|DOMElement|DocumentFragment}
   * `render` is called by `renderToElement`. The idea behind this is to generate
   * a return value consisting of the DOM tree necessary to create the view's
   * contents.
   **/
  self.render = function () {
    // right now, this doesn't do anything, but it's here for inheritance purposes
    return "Error: Abstract Method";
  };
  /**
   * Renders the content of the view. Can be called more than once, but more
   * often is called once during `init`. Calls `render` immediately and
   * assigns it to `element`'s `innerHTML` -- this implicitly creates the
   * DOM elements backing the view if they weren't already created.
   * @method renderToElement
   */
  self.renderToElement = function () {
    self.emit( "willRender" );
    var renderOutput = self.render();
    if ( typeof renderOutput === "string" ) {
      self.element.innerHTML = self.render();
    } else if ( typeof renderOutput === "object" ) {
      h.renderTo( renderOutput, self.element );
    }
    self.emit( "didRender" );
  };
  /**
   * Initializes the view container; returns `self`
   * @method init
   * @param {String} [theElementId]
   * @param {String} [theElementTag]
   * @param {String} [theElementClass]
   * @param {DOMElement} [theParentElement]
   * @returns {Object}
   */
  self.override( function init( theElementId, theElementTag, theElementClass, theParentElement ) {
    self.$super();
    //self.super( _className, "init" ); // super has no parameters
    // set our Id, Tag, and Class
    if ( typeof theElementId !== "undefined" ) {
      self.elementId = theElementId;
    }
    if ( typeof theElementTag !== "undefined" ) {
      self.elementTag = theElementTag;
    }
    if ( typeof theElementClass !== "undefined" ) {
      self.elementClass = theElementClass;
    }
    // render ourselves to the element (via render); this implicitly creates the element
    // with the above properties.
    self.renderToElement();
    // add ourselves to our parent.
    if ( typeof theParentElement !== "undefined" ) {
      self.parentElement = theParentElement;
    }
    return self;
  } );
  /**
   * Initializes the view container. `options` can specify any of the following properties:
   *
   *  * `id` - the `id` of the element
   *  * `tag` - the element tag to use (`div` is the default)
   *  * `class` - the class name to use (`ui-container` is the default)
   *  * `parent` - the parent DOMElement
   *
   * @method initWithOptions
   * @param {Object} options
   * @return {Object}
   */
  self.initWithOptions = function ( options ) {
    var theElementId, theElementTag, theElementClass, theParentElement;
    if ( typeof options !== "undefined" ) {
      if ( typeof options.id !== "undefined" ) {
        theElementId = options.id;
      }
      if ( typeof options.tag !== "undefined" ) {
        theElementTag = options.tag;
      }
      if ( typeof options.class !== "undefined" ) {
        theElementClass = options.class;
      }
      if ( typeof options.parent !== "undefined" ) {
        theParentElement = options.parent;
      }
    }
    self.init( theElementId, theElementTag, theElementClass, theParentElement );
    if ( typeof options !== "undefined" ) {
      if ( typeof options.title !== "undefined" ) {
        self.title = options.title;
      }
    }
    return self;
  };
  /**
   * Clean up
   * @method destroy
   */
  self.override( function destroy() {
    // remove ourselves from the parent view, if attached
    if ( self._parentElement !== null && self._element !== null ) {
      // remove ourselves from the existing parent element first
      self._parentElement.removeChild( self._element );
      self._parentElement = null;
    }
    // and let our super know that it can clean up
    self.$super();
    //self.super( _className, "destroy" );
  } );
  // handle auto-initialization
  self._autoInit.apply( self, arguments );
  // return the new object
  return self;
};
// return the new factory
module.exports = ViewContainer;

},{"../util/object":19,"yasmf-h":21}],13:[function(require,module,exports){
/**
 *
 * Core of YASMF-UTIL; defines the version, DOM, and localization convenience methods.
 *
 * @module core.js
 * @author Kerri Shotts
 * @version 0.5
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global define, Globalize, device, document, window, setTimeout, navigator, console, Node*/
"use strict";
/**
 * @method getComputedStyle
 * @private
 * @param {Node} element      the element to request the computed style from
 * @param {string} property   the property to request (like `width`); optional
 * @returns {*}               Either the property requested or the entire CSS style declaration
 */
function getComputedStyle( element, property ) {
  if ( !( element instanceof Node ) && typeof element === "string" ) {
    property = element;
    element = this;
  }
  var computedStyle = window.getComputedStyle( element );
  if ( typeof property !== "undefined" ) {
    return computedStyle.getPropertyValue( property );
  }
  return computedStyle;
}
/**
 * @method _arrayize
 * @private
 * @param {NodeList} list     the list to convert
 * @returns {Array}           the converted array
 */
function _arrayize( list ) {
  return Array.prototype.splice.call( list, 0 );
}
/**
 * @method getElementById
 * @private
 * @param {Node} parent      the parent to execute getElementById on
 * @param {string} elementId the element ID to search for
 * @returns {Node}           the element or null if not found
 */
function getElementById( parent, elementId ) {
  if ( typeof parent === "string" ) {
    elementId = parent;
    parent = document;
  }
  return ( parent.getElementById( elementId ) );
}
/**
 * @method querySelector
 * @private
 * @param {Node} parent       the parent to execute querySelector on
 * @param {string} selector   the CSS selector to use
 * @returns {Node}            the located element or null if not found
 */
function querySelector( parent, selector ) {
  if ( typeof parent === "string" ) {
    selector = parent;
    parent = document;
  }
  return ( parent.querySelector( selector ) );
}
/**
 * @method querySelectorAll
 * @private
 * @param {Node} parent     the parent to execute querySelectorAll on
 * @param {string} selector the selector to use
 * @returns {Array}         the found elements; if none: []
 */
function querySelectorAll( parent, selector ) {
  if ( typeof parent === "string" ) {
    selector = parent;
    parent = document;
  }
  return _arrayize( parent.querySelectorAll( selector ) );
}
/**
 * @method $
 * @private
 * @param {string} selector   the CSS selector to use
 * @returns {Node}            The located element, relative to `this`
 */
function $( selector ) {
  return querySelector( this, selector );
}
/**
 * @method $$
 * @private
 * @param {string} selector   the CSS selector to use
 * @returns {Array}           the located elements, relative to `this`
 */
function $$( selector ) {
  return querySelectorAll( this, selector );
}
/**
 * @method $id
 * @private
 * @param {string} id         the id of the element
 * @returns {Node}            the located element or null if not found
 */
function $id( id ) {
  return getElementById( this, id );
}
// modify Node's prototype to provide useful additional shortcuts
var proto = Node.prototype;
[
  ["$", $],
  ["$$", $$],
  ["$1", $],
  ["$id", $id],
  ["gsc", getComputedStyle],
  ["gcs", getComputedStyle],
  ["getComputedStyle", getComputedStyle]
].forEach( function ( i ) {
             if ( typeof proto[i[0]] === "undefined" ) {
               proto[i[0]] = i[1];
             }
           } );
/**
 * Returns a value for the specified keypath. If any intervening
 * values evaluate to undefined or null, the entire result is
 * undefined or null, respectively.
 *
 * If you need a default value to be returned in such an instance,
 * specify it after the keypath.
 *
 * Note: if `o` is not an object, it is assumed that the function
 * has been bound to `this`. As such, all arguments are shifted by
 * one position to the right.
 *
 * Key paths are of the form:
 *
 *    object.field.field.field[index]
 *
 * @param {object} o        the object to search
 * @param {string} k        the keypath
 * @param {*} d             (optional) the default value to return
 *                          should the keypath evaluate to null or
 *                          undefined.
 * @return {*}              the value at the keypath
 *
 * License MIT: Copyright 2014 Kerri Shotts
 */
function valueForKeyPath( o, k, d ) {
  if ( o === undefined || o === null ) {
    return ( d !== undefined ) ? d : o;
  }
  if ( !( o instanceof Object ) ) {
    d = k;
    k = o;
    o = this;
  }
  var v = o;
  // There's a million ways that this regex can go wrong
  // with respect to JavaScript identifiers. Splits will
  // technically work with just about every non-A-Za-z\$-
  // value, so your keypath could be "field/field/field"
  // and it would work like "field.field.field".
  v = k.match( /([\w\$\\\-]+)/g ).reduce( function ( v, keyPart ) {
    if ( v === undefined || v === null ) {
      return v;
    }
    try {
      return v[keyPart];
    }
    catch ( err ) {
      return undefined;
    }
  }, v );
  return ( ( v === undefined || v === null ) && ( d !== undefined ) ) ? d : v;
}
/**
 * Interpolates values from the context into the string. Placeholders are of the
 * form {...}. If values within {...} do not exist within context, they are
 * replaced with undefined.
 * @param  {string} str     string to interpolate
 * @param  {*} context      context to use for interpolation
 * @return {string}}        interpolated string
 */
function interpolate( str, context ) {
  var newStr = str;
  if ( typeof context === "undefined" ) {
    return newStr;
  }
  str.match( /\{([^\}]+)\}/g ).forEach( function ( match ) {
    var prop = match.substr( 1, match.length - 2 ).trim();
    newStr = newStr.replace( match, valueForKeyPath( context, prop ) );
  } );
  return newStr;
}
/**
 * Merges the supplied objects together and returns a copy containin the merged objects. The original
 * objects are untouched, and a new object is returned containing a relatively deep copy of each object.
 *
 * Important Notes:
 *   - Items that exist in any object but not in any other will be added to the target
 *   - Should more than one item exist in the set of objects with the same key, the following rules occur:
 *     - If both types are arrays, the result is a.concat(b)
 *     - If both types are objects, the result is merge(a,b)
 *     - Otherwise the result is b (b overwrites a)
 *   - Should more than one item exist in the set of objects with the same key, but differ in type, the
 *     second value overwrites the first.
 *   - This is not a true deep copy! Should any property be a reference to another object or array, the
 *     copied result may also be a reference (unless both the target and the source share the same item
 *     with the same type). In other words: DON'T USE THIS AS A DEEP COPY METHOD
 *
 * It's really meant to make this kind of work easy:
 *
 * var x = { a: 1, b: "hi", c: [1,2] },
 *     y = { a: 3, c: [3, 4], d: 0 },
 *     z = merge (x,y);
 *
 * z is now { a: 3, b: "hi", c: [1,2,3,4], d:0 }.
 *
 * License MIT. Copyright Kerri Shotts 2014
 */
function merge() {
  var t = {},
    args = Array.prototype.slice.call( arguments, 0 );
  args.forEach( function ( s ) {
    if (s === undefined || s === null) {
      return; // no keys, why bother!
    }
    Object.keys( s ).forEach( function ( prop ) {
      var e = s[prop];
      if ( e instanceof Array ) {
        if ( t[prop] instanceof Array ) {
          t[prop] = t[prop].concat( e );
        } else if ( !( t[prop] instanceof Object ) || !( t[prop] instanceof Array ) ) {
          t[prop] = e;
        }
      } else if ( e instanceof Object && t[prop] instanceof Object ) {
        t[prop] = merge( t[prop], e );
      } else {
        t[prop] = e;
      }
    } );
  } );
  return t;
}
/**
 * Validates a source against the specified rules. `source` can look like this:
 *
 *     { aString: "hi", aNumber: { hi: 294.12 }, anInteger: 1944.32 }
 *
 * `rules` can look like this:
 *
 *     {
     *       "a-string": {
     *         title: "A String",     -- optional; if not supplied, key is used
     *         key: "aString",        -- optional: if not supplied the name of this rule is used as the key
     *         required: true,        -- optional: if not supplied, value is not required
     *         type: "string",        -- string, number, integer, array, date, boolean, object, *(any)
     *         minLength: 1,          -- optional: minimum length (string, array)
     *         maxLength: 255         -- optional: maximum length (string, array)
     *       },
     *       "a-number": {
     *         title: "A Number",
     *         key: "aNumber.hi",     -- keys can have . and [] to reference properties within objects
     *         required: false,
     *         type: "number",
     *         min: 0,                -- if specified, number/integer can't be smaller than this number
     *         max: 100               -- if specified, number/integer can't be larger than this number
     *       },
     *       "an-integer": {
     *         title: "An Integer",
     *         key: "anInteger",
     *         required: true,
     *         type: "integer",
     *         enum: [1, 2, 4, 8]     -- if specified, the value must be a part of the array
     *                                -- may also be specified as an array of objects with title/value properties
     *       }
     *     }
 *
 * @param {*} source       source to validate
 * @param {*} rules        validation rules
 * @returns {*}            an object with two fields: `validates: true|false` and `message: validation message`
 *
 * LICENSE: MIT
 * Copyright Kerri Shotts, 2014
 */
function validate( source, rules ) {
  var r = {
    validates: true,
    message:   ""
  };
  if ( !( rules instanceof Object ) ) {
    return r;
  }
  // go over each rule in `rules`
  Object.keys( rules ).forEach( function ( prop ) {
    if ( r.validates ) {
      // get the rule
      var rule = rules[prop],
        v = source,
      // and get the value in source
        k = ( rule.key !== undefined ) ? rule.key : prop,
        title = ( rule.title !== undefined ) ? rule.title : prop;
      k = k.replace( "[", "." ).replace( "]", "" ).replace( "\"", "" );
      k.split( "." ).forEach( function ( keyPart ) {
        try {
          v = v[keyPart];
        }
        catch ( err ) {
          v = undefined;
        }
      } );
      // is it required?
      if ( ( ( rule.required !== undefined ) ? rule.required : false ) && v === undefined ) {
        r.validates = false;
        r.message = "Missing required value " + title;
        return;
      }
      // can it be null?
      if ( !( ( rule.nullable !== undefined ) ? rule.nullable : false ) && v === null ) {
        r.validates = false;
        r.message = "Unexpected null in " + title;
        return;
      }
      // is it of the right type?
      if ( v !== null && v !== undefined && v != "" ) {
        r.message = "Type Mismatch; expected " + rule.type + " not " + ( typeof v ) + " in " + title;
        switch ( rule.type ) {
          case "float":
          case "number":
            if ( v !== undefined ) {
              if ( isNaN( parseFloat( v ) ) ) {
                r.validates = false;
                return;
              }
              if ( v != parseFloat( v ) ) {
                r.validates = false;
                return;
              }
            }
            break;
          case "integer":
            if ( v !== undefined ) {
              if ( isNaN( parseInt( v, 10 ) ) ) {
                r.validates = false;
                return;
              }
              if ( v != parseInt( v, 10 ) ) {
                r.validates = false;
                return;
              }
            }
            break;
          case "array":
            if ( v !== undefined && !( v instanceof Array ) ) {
              r.validates = false;
              return;
            }
            break;
          case "date":
            if ( v instanceof Object ) {
              if ( !( v instanceof Date ) ) {
                r.validates = false;
                return;
              } else if ( v instanceof Date && isNaN( v.getTime() ) ) {
                r.validates = false;
                r.message = "Invalid date in " + title;
                return;
              }
            } else if ( typeof v === "string" ) {
              if ( isNaN( ( new Date( v ) ).getTime() ) ) {
                r.validates = false;
                r.message = "Invalid date in " + title;
                return;
              }
            } else if ( !( v instanceof "object" ) && v !== undefined ) {
              r.validates = false;
              return;
            }
            break;
          case "object":
            if ( !( v instanceof Object ) && v !== undefined ) {
              r.validates = false;
              return;
            }
            break;
          case "*":
            break;
          default:
            if ( !( typeof v === rule.type || v === undefined || v === null ) ) {
              r.validates = false;
              return;
            }
        }
        r.message = "";
        // if we're still here, types are good. Now check length, range, and enum
        // check range
        r.message = "Value out of range " + v + " in " + title;
        if ( typeof rule.min === "number" && v < rule.min ) {
          r.validates = false;
          return;
        }
        if ( typeof rule.max === "number" && v > rule.max ) {
          r.validates = false;
          return;
        }
        r.message = "";
        // check length
        if ( ( typeof rule.minLength === "number" && v !== undefined && v.length !== undefined && v.length < rule.minLength ) ||
             ( typeof rule.maxLength === "number" && v !== undefined && v.length !== undefined && v.length > rule.maxLength )
        ) {
          r.message = "" + title + " out of length range";
          r.validates = false;
          return;
        }
        // check enum
        if ( rule.enum instanceof Object && v !== undefined ) {
          if ( rule.enum.filter( function ( e ) {
              if ( e.value !== undefined ) {
                return e.value == v;
              } else {
                return e == v;
              }
            } ).length === 0 ) {
            r.message = "" + title + " contains unexpected value " + v + " in " + title;
            r.validates = false;
            return;
          }
        }
        // check pattern
        if ( rule.pattern instanceof Object && v !== undefined ) {
          if ( v.match( rule.pattern ) === null ) {
            r.message = "" + title + " doesn't match pattern in " + title;
            r.validates = false;
            return;
          }
        }
      }
    }
  } );
  return r;
}
var _y = {
  VERSION:                "0.5.142",
  valueForKeyPath:        valueForKeyPath,
  interpolate:            interpolate,
  merge:                  merge,
  validate:               validate,
  /**
   * Returns an element from the DOM with the specified
   * ID. Similar to (but not like) jQuery's $(), except
   * that this is a pure DOM element.
   * @method ge
   * @alias $id
   * @param  {String} elementId     id to search for, relative to document
   * @return {Node}                 null if no node found
   */
  ge:                     $id.bind( document ),
  $id:                    $id.bind( document ),
  /**
   * Returns an element from the DOM using `querySelector`.
   * @method qs
   * @alias $
   * @alias $1
   * @param {String} selector       CSS selector to search, relative to document
   * @returns {Node}                null if no node found that matches search
   */
  $:                      $.bind( document ),
  $1:                     $.bind( document ),
  qs:                     $.bind( document ),
  /**
   * Returns an array of all elements matching a given
   * selector. The array is processed to be a real array,
   * not a nodeList.
   * @method gac
   * @alias $$
   * @alias qsa
   * @param  {String} selector      CSS selector to search, relative to document
   * @return {Array} of Nodes       Array of nodes; [] if none found
   */
  $$:                     $$.bind( document ),
  gac:                    $$.bind( document ),
  qsa:                    $$.bind( document ),
  /**
   * Returns a Computed CSS Style ready for interrogation if
   * `property` is not defined, or the actual property value
   * if `property` is defined.
   * @method gcs
   * @alias gsc
   * @alias getComputedStyle
   * @param {Node} element  A specific DOM element
   * @param {String} [property]  A CSS property to query
   * @returns {*}
   */
  getComputedStyle:       getComputedStyle,
  gcs:                    getComputedStyle,
  gsc:                    getComputedStyle,
  /**
   * Returns a parsed template. The template can be a simple
   * string, in which case the replacement variable are replaced
   * and returned simply, or the template can be a DOM element,
   * in which case the template is assumed to be the DOM Element's
   * `innerHTML`, and then the replacement variables are parsed.
   *
   * Replacement variables are of the form `%VARIABLE%`, and
   * can occur anywhere, not just within strings in HTML.
   *
   * The replacements array is of the form
   * ```
   *     { "VARIABLE": replacement, "VARIABLE2": replacement, ... }
   * ```
   *
   * If `addtlOptions` is specified, it may override the default
   * options where `%` is used as a substitution marker and `toUpperCase`
   * is used as a transform. For example:
   *
   * ```
   * template ( "Hello, {{name}}", {"name": "Mary"},
   *            { brackets: [ "{{", "}}" ],
     *              transform: "toLowerCase" } );
   * ```
   *
   * @method template
   * @param  {Node|String} templateElement
   * @param  {Object} replacements
   * @return {String}
   */
  template:               function ( templateElement, replacements, addtlOptions ) {
    var brackets = ["%", "%"],
      transform = "toUpperCase",
      templateHTML, theVar, thisVar;
    if ( typeof addtlOptions !== "undefined" ) {
      if ( typeof addtlOptions.brackets !== "undefined" ) {
        brackets = addtlOptions.brackets;
      }
      if ( typeof addtlOptions.transform === "string" ) {
        transform = addtlOptions.transform;
      }
    }
    if ( templateElement instanceof Node ) {
      templateHTML = templateElement.innerHTML;
    } else {
      templateHTML = templateElement;
    }
    for ( theVar in replacements ) {
      if ( replacements.hasOwnProperty( theVar ) ) {
        thisVar = brackets[0];
        if ( transform !== "" ) {
          thisVar += theVar[transform]();
        } else {
          thisVar += theVar;
        }
        thisVar += brackets[1];
        while ( templateHTML.indexOf( thisVar ) > -1 ) {
          templateHTML = templateHTML.replace( thisVar, replacements[theVar] );
        }
      }
    }
    return templateHTML;
  },
  /**
   * Indicates if the app is running in a Cordova container.
   * Only valid if `executeWhenReady` is used to start an app.
   * @property underCordova
   * @default false
   */
  underCordova:           false,
  /**
   * Handles the conundrum of executing a block of code when
   * the mobile device or desktop browser is ready. If running
   * under Cordova, the `deviceready` event will fire, and
   * the `callback` will execute. Otherwise, after 1s, the
   * `callback` will execute *if it hasn't already*.
   *
   * @method executeWhenReady
   * @param {Function} callback
   */
  executeWhenReady:       function ( callback ) {
    var executed = false;
    document.addEventListener( "deviceready", function () {
      if ( !executed ) {
        executed = true;
        _y.underCordova = true;
        if ( typeof callback === "function" ) {
          callback();
        }
      }
    }, false );
    setTimeout( function () {
      if ( !executed ) {
        executed = true;
        _y.underCordova = false;
        if ( typeof callback === "function" ) {
          callback();
        }
      }
    }, 1000 );
  },
  /**
   * > The following functions are related to globalization and localization, which
   * > are now considered to be core functions (previously it was broken out in
   * > PKLOC)
   */
  /**
   * @typedef {String} Locale
   */
  /**
   * Indicates the user's locale. It's only valid after
   * a call to `getUserLocale`, but it can be written to
   * at any time in order to override `getUserLocale`'s
   * calculation of the user's locale.
   *
   * @property currentUserLocale
   * @default (empty string)
   * @type {Locale}
   */
  currentUserLocale:      "",
  /**
   * A translation matrix. Used by `addTranslation(s)` and `T`.
   *
   * @property localizedText
   * @type {Object}
   */
  localizedText:          {},
  /**
   * Given a locale string, normalize it to the form of `la-RE` or `la`, depending on the length.
   * ```
   *     "enus", "en_us", "en_---__--US", "EN-US" --> "en-US"
   *     "en", "en-", "EN!" --> "en"
   * ```
   * @method normalizeLocale
   * @param {Locale} theLocale
   */
  normalizeLocale:        function ( theLocale ) {
    var theNewLocale = theLocale;
    if ( theNewLocale.length < 2 ) {
      throw new Error( "Fatal: invalid locale; not of the format la-RE." );
    }
    var theLanguage = theNewLocale.substr( 0, 2 ).toLowerCase(),
      theRegion = theNewLocale.substr( -2 ).toUpperCase();
    if ( theNewLocale.length < 4 ) {
      theRegion = ""; // there can't possibly be a valid region on a 3-char string
    }
    if ( theRegion !== "" ) {
      theNewLocale = theLanguage + "-" + theRegion;
    } else {
      theNewLocale = theLanguage;
    }
    return theNewLocale;
  },
  /**
   * Sets the current locale for jQuery/Globalize
   * @method setGlobalizationLocale
   * @param {Locale} theLocale
   */
  setGlobalizationLocale: function ( theLocale ) {
    var theNewLocale = _y.normalizeLocale( theLocale );
    Globalize.culture( theNewLocale );
  },
  /**
   * Add a translation to the existing translation matrix
   * @method addTranslation
   * @param {Locale} locale
   * @param {String} key
   * @param {String} value
   */
  addTranslation:         function ( locale, key, value ) {
    var self = _y,
    // we'll store translations with upper-case locales, so case never matters
      theNewLocale = self.normalizeLocale( locale ).toUpperCase();
    // store the value
    if ( typeof self.localizedText[theNewLocale] === "undefined" ) {
      self.localizedText[theNewLocale] = {};
    }
    self.localizedText[theNewLocale][key.toUpperCase()] = value;
  },
  /**
   * Add translations in batch, as follows:
   * ```
   *   {
     *     "HELLO":
     *     {
     *       "en-US": "Hello",
     *       "es-US": "Hola"
     *     },
     *     "GOODBYE":
     *     {
     *       "en-US": "Bye",
     *       "es-US": "Adios"
     *     }
     *   }
   * ```
   * @method addTranslations
   * @param {Object} o
   */
  addTranslations:        function ( o ) {
    var self = _y;
    for ( var key in o ) {
      if ( o.hasOwnProperty( key ) ) {
        for ( var locale in o[key] ) {
          if ( o[key].hasOwnProperty( locale ) ) {
            self.addTranslation( locale, key, o[key][locale] );
          }
        }
      }
    }
  },
  /**
   * Returns the user's locale (e.g., `en-US` or `fr-FR`). If one
   * can't be found, `en-US` is returned. If `currentUserLocale`
   * is already defined, it won't attempt to recalculate it.
   * @method getUserLocale
   * @return {Locale}
   */
  getUserLocale:          function () {
    var self = _y;
    if ( self.currentUserLocale ) {
      return self.currentUserLocale;
    }
    var currentPlatform = "unknown";
    if ( typeof device !== "undefined" ) {
      currentPlatform = device.platform;
    }
    var userLocale = "en-US";
    // a suitable default
    if ( currentPlatform === "Android" ) {
      // parse the navigator.userAgent
      var userAgent = navigator.userAgent,
      // inspired by http://stackoverflow.com/a/7728507/741043
        tempLocale = userAgent.match( /Android.*([a-zA-Z]{2}-[a-zA-Z]{2})/ );
      if ( tempLocale ) {
        userLocale = tempLocale[1];
      }
    } else {
      userLocale = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage;
    }
    self.currentUserLocale = self.normalizeLocale( userLocale );
    return self.currentUserLocale;
  },
  /**
   * Gets the device locale, if available. It depends on the
   * Globalization plugin provided by Cordova, but if the
   * plugin is not available, it assumes the device locale
   * can't be determined rather than throw an error.
   *
   * Once the locale is determined one way or the other, `callback`
   * is called.
   *
   * @method getDeviceLocale
   * @param {Function} callback
   */
  getDeviceLocale:        function ( callback ) {
    var self = _y;
    if ( typeof navigator.globalization !== "undefined" ) {
      if ( typeof navigator.globalization.getLocaleName !== "undefined" ) {
        navigator.globalization.getLocaleName( function ( locale ) {
          self.currentUserLocale = self.normalizeLocale( locale.value );
          if ( typeof callback === "function" ) {
            callback();
          }
        }, function () {
          // error; go ahead and call the callback, but don't set the locale
          console.log( "WARN: Couldn't get user locale from device." );
          if ( typeof callback === "function" ) {
            callback();
          }
        } );
        return;
      }
    }
    if ( typeof callback === "function" ) {
      callback();
    }
  },
  /**
   * Looks up a translation for a given `key` and locale. If
   * the translation does not exist, `undefined` is returned.
   *
   * The `key` is converted to uppercase, and the locale is
   * properly normalized and then converted to uppercase before
   * any lookup is attempted.
   *
   * @method lookupTranslation
   * @param {String} key
   * @param {Locale} [theLocale]
   * @returns {*}
   */
  lookupTranslation:      function ( key, theLocale ) {
    var self = _y,
      upperKey = key.toUpperCase(),
      userLocale = theLocale || self.getUserLocale();
    userLocale = self.normalizeLocale( userLocale ).toUpperCase();
    // look it up by checking if userLocale exists, and then if the key (uppercased) exists
    if ( typeof self.localizedText[userLocale] !== "undefined" ) {
      if ( typeof self.localizedText[userLocale][upperKey] !== "undefined" ) {
        return self.localizedText[userLocale][upperKey];
      }
    }
    // if not found, we don't return anything
    return void( 0 );
  },
  /**
   * @property localeOfLastResort
   * @default "en-US"
   * @type {Locale}
   */
  localeOfLastResort:     "en-US",
  /**
   * @property languageOfLastResort
   * @default "en"
   * @type {Locale}
   */
  languageOfLastResort:   "en",
  /**
   * Convenience function for translating text. Key is the only
   * required value and case doesn't matter (it's uppercased). Replacement
   * variables can be specified using replacement variables of the form `{ "VAR":"VALUE" }`,
   * using `%VAR%` in the key/value returned. If `locale` is specified, it
   * takes precedence over the user's current locale.
   *
   * @method T
   * @param {String} key
   * @param {Object} [parms] replacement variables
   * @param {Locale} [locale]
   */
  T:                      function ( key, parms, locale ) {
    var self = _y,
      userLocale = locale || self.getUserLocale(),
      currentValue;
    if ( typeof ( currentValue = self.lookupTranslation( key, userLocale ) ) === "undefined" ) {
      // we haven't found it under the given locale (of form: xx-XX), try the fallback locale (xx)
      userLocale = userLocale.substr( 0, 2 );
      if ( typeof ( currentValue = self.lookupTranslation( key, userLocale ) ) === "undefined" ) {
        // we haven't found it under any of the given locales; try the language of last resort
        if ( typeof ( currentValue = self.lookupTranslation( key, self.languageOfLastResort ) ) === "undefined" ) {
          // we haven't found it under any of the given locales; try locale of last resort
          if ( typeof ( currentValue = self.lookupTranslation( key, self.localeOfLastResort ) ) === "undefined" ) {
            // we didn't find it at all... we'll use the key
            currentValue = key;
          }
        }
      }
    }
    return self.template( currentValue, parms );
  },
  /**
   * Convenience function for localizing numbers according the format (optional) and
   * the locale (optional). theFormat is typically the number of places to use; "n" if
   * not specified.
   *
   * @method N
   * @param {Number} theNumber
   * @param {Number|String} theFormat
   * @param {Locale} [theLocale]
   */
  N:                      function ( theNumber, theFormat, theLocale ) {
    var self = _y,
      iFormat = "n" + ( ( typeof theFormat === "undefined" ) ? "0" : theFormat ),
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theNumber, iFormat );
  },
  /**
   * Convenience function for localizing currency. theFormat is the number of decimal places
   * or "2" if not specified. If there are more places than digits, padding is added; if there
   * are fewer places, rounding is performed.
   *
   * @method C
   * @param {Number} theNumber
   * @param {String} theFormat
   * @param {Locale} [theLocale]
   */
  C:                      function ( theNumber, theFormat, theLocale ) {
    var self = _y,
      iFormat = "c" + ( ( typeof theFormat === "undefined" ) ? "2" : theFormat ),
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theNumber, iFormat );
  },
  /**
   * Convenience function for localizing percentages. theFormat specifies the number of
   * decimal places; two if not specified.
   * @method PCT
   * @param {Number} theNumber
   * @param {Number} theFormat
   * @param {Locale} [theLocale]
   */
  PCT:                    function ( theNumber, theFormat, theLocale ) {
    var self = _y,
      iFormat = "p" + ( ( typeof theFormat === "undefined" ) ? "2" : theFormat ),
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theNumber, iFormat );
  },
  /**
   * Convenience function for localizing dates.
   *
   * theFormat specifies the format; "d" is assumed if not provided.
   *
   * @method D
   * @param {Date} theDate
   * @param {String} theFormat
   * @param {Locale} [theLocale]
   */
  D:                      function ( theDate, theFormat, theLocale ) {
    var self = _y,
      iFormat = theFormat || "d",
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theDate, iFormat );
  },
  /**
   * Convenience function for jQuery/Globalize's `format` method
   * @method format
   * @param {*} theValue
   * @param {String} theFormat
   * @param {Locale} [theLocale]
   * @returns {*}
   */
  format:                 function ( theValue, theFormat, theLocale ) {
    var self = _y,
      iFormat = theFormat,
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theValue, iFormat );
  }
};
module.exports = _y;

},{}],14:[function(require,module,exports){
/**
 *
 * Provides date/time convenience methods
 *
 * @module datetime.js
 * @author Kerri Shotts
 * @version 0.4
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module*/
"use strict";
module.exports = {
  /**
   * Returns the current time in the Unix time format
   * @method getUnixTime
   * @return {UnixTime}
   */
  getUnixTime:         function () {
    return ( new Date() ).getTime();
  },
  /**
   * # PRECISION_x Constants
   * These specify the amount of precision required for `getPartsFromSeconds`.
   * For example, if `PRECISION_DAYS` is specified, the number of parts obtained
   * consist of days, hours, minutes, and seconds.
   */
  PRECISION_SECONDS:   1,
  PRECISION_MINUTES:   2,
  PRECISION_HOURS:     3,
  PRECISION_DAYS:      4,
  PRECISION_WEEKS:     5,
  PRECISION_YEARS:     6,
  /**
   * @typedef {{fractions: number, seconds: number, minutes: number, hours: number, days: number, weeks: number, years: number}} TimeParts
   */
  /**
   * Takes a given number of seconds and returns an object consisting of the number of seconds, minutes, hours, etc.
   * The value is limited by the precision parameter -- which must be specified. Which ever value is specified will
   * be the maximum limit for the routine; that is `PRECISION_DAYS` will never return a result for weeks or years.
   * @method getPartsFromSeconds
   * @param {number} seconds
   * @param {number} precision
   * @returns {TimeParts}
   */
  getPartsFromSeconds: function ( seconds, precision ) {
    var partValues = [0, 0, 0, 0, 0, 0, 0],
      modValues = [1, 60, 3600, 86400, 604800, 31557600];
    for ( var i = precision; i > 0; i-- ) {
      if ( i === 1 ) {
        partValues[i - 1] = seconds % modValues[i - 1];
      } else {
        partValues[i - 1] = Math.floor( seconds % modValues[i - 1] );
      }
      partValues[i] = Math.floor( seconds / modValues[i - 1] );
      seconds = seconds - partValues[i] * modValues[i - 1];
    }
    return {
      fractions: partValues[0],
      seconds:   partValues[1],
      minutes:   partValues[2],
      hours:     partValues[3],
      days:      partValues[4],
      weeks:     partValues[5],
      years:     partValues[6]
    };
  }
};

},{}],15:[function(require,module,exports){
/**
 *
 * Provides basic device-handling convenience functions for determining if the device
 * is an iDevice or a Droid Device, and what the orientation is.
 *
 * @module device.js
 * @author Kerri Shotts
 * @version 0.5
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module, define, device, navigator, window */
"use strict";
/**
 *
 * PKDEVICE provides simple methods for getting device information, such as platform,
 * form factor, and orientation.
 *
 * @class PKDEVICE
 */
var PKDEVICE = {
  /**
   * The version of the class with major, minor, and rev properties.
   *
   * @property version
   * @type Object
   *
   */
  version:            "0.5.100",
  /**
   * Permits overriding the platform for testing. Leave set to `false` for
   * production applications.
   *
   * @property platformOverride
   * @type boolean
   * @default false
   */
  platformOverride:   false,
  /**
   * Permits overriding the form factor. Usually used for testing.
   *
   * @property formFactorOverride
   * @type boolean
   * @default false
   */
  formFactorOverride: false,
  /**
   *
   * Returns the device platform, lowercased. If PKDEVICE.platformOverride is
   * other than "false", it is returned instead.
   *
   * See PhoneGap's documentation on the full range of platforms that can be
   * returned; without PG available, the method will attemt to determine the
   * platform from `navigator.platform` and the `userAgent`, but only supports
   * iOS and Android in that capacity.
   *
   * @method platform
   * @static
   * @returns {String} the device platform, lowercase.
   */
  platform:           function () {
    if ( PKDEVICE.platformOverride ) {
      return PKDEVICE.platformOverride.toLowerCase();
    }
    if ( typeof device === "undefined" || !device.platform ) {
      // detect mobile devices first
      if ( navigator.platform === "iPad" || navigator.platform === "iPad Simulator" || navigator.platform === "iPhone" ||
           navigator.platform === "iPhone Simulator" || navigator.platform === "iPod" ) {
        return "ios";
      }
      if ( navigator.userAgent.toLowerCase().indexOf( "android" ) > -1 ) {
        return "android";
      }
      // no reason why we can't return other information
      if ( navigator.platform.indexOf( "Mac" ) > -1 ) {
        return "mac";
      }
      if ( navigator.platform.indexOf( "Win" ) > -1 ) {
        return "windows";
      }
      if ( navigator.platform.indexOf( "Linux" ) > -1 ) {
        return "linux";
      }
      return "unknown";
    }
    var thePlatform = device.platform.toLowerCase();
    //
    // turns out that for Cordova > 2.3, deivceplatform now returns iOS, so the
    // following is really not necessary on those versions. We leave it here
    // for those using Cordova <= 2.2.
    if ( thePlatform.indexOf( "ipad" ) > -1 || thePlatform.indexOf( "iphone" ) > -1 ) {
      thePlatform = "ios";
    }
    return thePlatform;
  },
  /**
   *
   * Returns the device's form factor. Possible values are "tablet" and
   * "phone". If PKDEVICE.formFactorOverride is not false, it is returned
   * instead.
   *
   * @method formFactor
   * @static
   * @returns {String} `tablet` or `phone`, as appropriate
   */
  formFactor:         function () {
    if ( PKDEVICE.formFactorOverride ) {
      return PKDEVICE.formFactorOverride.toLowerCase();
    }
    if ( navigator.platform === "iPad" ) {
      return "tablet";
    }
    if ( ( navigator.platform === "iPhone" ) || ( navigator.platform === "iPhone Simulator" ) ) {
      return "phone";
    }
    var ua = navigator.userAgent.toLowerCase();
    if ( ua.indexOf( "android" ) > -1 ) {
      // android reports if it is a phone or tablet based on user agent
      if ( ua.indexOf( "mobile safari" ) > -1 ) {
        return "phone";
      }
      if ( ua.indexOf( "mobile safari" ) < 0 && ua.indexOf( "safari" ) > -1 ) {
        return "tablet";
      }
      if ( ( Math.max( window.screen.width, window.screen.height ) / window.devicePixelRatio ) >= 900 ) {
        return "tablet";
      } else {
        return "phone";
      }
    }
    // the following is hacky, and not guaranteed to work all the time,
    // especially as phones get bigger screens with higher DPI.
    if ( ( Math.max( window.screen.width, window.screen.height ) ) >= 900 ) {
      return "tablet";
    }
    return "phone";
  },
  /**
   * Determines if the device is a tablet (or tablet-sized, more accurately)
   * @return {Boolean}
   */
  isTablet:           function () {
    return PKDEVICE.formFactor() === "tablet";
  },
  /**
   * Determines if the device is a tablet (or tablet-sized, more accurately)
   * @return {Boolean}
   */
  isPhone:            function () {
    return PKDEVICE.formFactor() === "phone";
  },
  /**
   *
   * Determines if the device is in Portrait orientation.
   *
   * @method isPortrait
   * @static
   * @returns {boolean} `true` if the device is in a Portrait orientation; `false` otherwise
   */
  isPortrait:         function () {
    return window.orientation === 0 || window.orientation === 180 || window.location.href.indexOf( "?portrait" ) > -1;
  },
  /**
   *
   * Determines if the device is in Landscape orientation.
   *
   * @method isLandscape
   * @static
   * @returns {boolean} `true` if the device is in a landscape orientation; `false` otherwise
   */
  isLandscape:        function () {
    if ( window.location.href.indexOf( "?landscape" ) > -1 ) {
      return true;
    }
    return !PKDEVICE.isPortrait();
  },
  /**
   *
   * Determines if the device is a hiDPI device (aka retina)
   *
   * @method isRetina
   * @static
   * @returns {boolean} `true` if the device has a `window.devicePixelRatio` greater than `1.0`; `false` otherwise
   */
  isRetina:           function () {
    return window.devicePixelRatio > 1;
  },
  /**
   * Returns `true` if the device is an iPad.
   *
   * @method iPad
   * @static
   * @returns {boolean}
   */
  iPad:               function () {
    return PKDEVICE.platform() === "ios" && PKDEVICE.formFactor() === "tablet";
  },
  /**
   * Returns `true` if the device is an iPhone (or iPod).
   *
   * @method iPhone
   * @static
   * @returns {boolean}
   */
  iPhone:             function () {
    return PKDEVICE.platform() === "ios" && PKDEVICE.formFactor() === "phone";
  },
  /**
   * Returns `true` if the device is an Android Phone.
   *
   * @method droidPhone
   * @static
   * @returns {boolean}
   */
  droidPhone:         function () {
    return PKDEVICE.platform() === "android" && PKDEVICE.formFactor() === "phone";
  },
  /**
   * Returns `true` if the device is an Android Tablet.
   *
   * @method droidTablet
   * @static
   * @returns {boolean}
   */
  droidTablet:        function () {
    return PKDEVICE.platform() === "android" && PKDEVICE.formFactor() === "tablet";
  }
};
module.exports = PKDEVICE;

},{}],16:[function(require,module,exports){
/**
 *
 * FileManager implements methods that interact with the HTML5 API
 *
 * @module fileManager.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*globals module, define, Q, LocalFileSystem, console, window, navigator, FileReader*/
var Q = require( "../../q" );
var BaseObject = require( "./object.js" );
"use strict";
var IN_YASMF = true;
return (function ( Q, BaseObject, globalContext, module ) {
  /**
   * Defined by Q, actually, but defined here to make type handling nicer
   * @typedef {{}} Promise
   */
  var DEBUG = false;

  /**
   * Requests a quota from the file system
   * @method _requestQuota
   * @private
   * @param  {*} fileSystemType    PERSISTENT or TEMPORARY
   * @param  {Number} requestedDataSize The quota we're asking for
   * @return {Promise}                   The promise
   */
  function _requestQuota( fileSystemType, requestedDataSize ) {
    var deferred = Q.defer();
    if ( DEBUG ) {
      console.log( ["_requestQuota: ", fileSystemType, requestedDataSize].join( " " ) );
    }
    try {
      // attempt to ask for a quota
      var PERSISTENT = ( typeof LocalFileSystem !== "undefined" ) ? LocalFileSystem.PERSISTENT : window.PERSISTENT,
      // Chrome has `webkitPersistentStorage` and `navigator.webkitTemporaryStorage`
        storageInfo = fileSystemType === PERSISTENT ? navigator.webkitPersistentStorage : navigator.webkitTemporaryStorage;
      if ( storageInfo ) {
        // now make sure we can request a quota
        if ( storageInfo.requestQuota ) {
          // request the quota
          storageInfo.requestQuota( requestedDataSize, function success( grantedBytes ) {
            if ( DEBUG ) {
              console.log( ["_requestQuota: quota granted: ", fileSystemType,
                            grantedBytes
                           ].join( " " ) );
            }
            deferred.resolve( grantedBytes );
          }, function failure( anError ) {
            if ( DEBUG ) {
              console.log( ["_requestQuota: quota rejected: ", fileSystemType,
                            requestedDataSize, anError
                           ].join( " " ) );
            }
            deferred.reject( anError );
          } );
        } else {
          // not everything supports asking for a quota -- like Cordova.
          // Instead, let's assume we get permission
          if ( DEBUG ) {
            console.log( ["_requestQuota: couldn't request quota -- no requestQuota: ",
                          fileSystemType, requestedDataSize
                         ].join( " " ) );
          }
          deferred.resolve( requestedDataSize );
        }
      } else {
        if ( DEBUG ) {
          console.log( ["_requestQuota: couldn't request quota -- no storageInfo: ",
                        fileSystemType, requestedDataSize
                       ].join( " " ) );
        }
        deferred.resolve( requestedDataSize );
      }
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Request a file system with the requested size (obtained first by getting a quota)
   * @method _requestFileSystem
   * @private
   * @param  {*} fileSystemType    TEMPORARY or PERSISTENT
   * @param  {Number} requestedDataSize The quota
   * @return {Promise}                   The promise
   */
  function _requestFileSystem( fileSystemType, requestedDataSize ) {
    var deferred = Q.defer();
    if ( DEBUG ) {
      console.log( ["_requestFileSystem: ", fileSystemType, requestedDataSize].join( " " ) );
    }
    try {
      // fix issue #2 by chasen where using `webkitRequestFileSystem` was having problems
      // on Android 4.2.2
      var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
      requestFileSystem( fileSystemType, requestedDataSize, function success( theFileSystem ) {
        if ( DEBUG ) {
          console.log( ["_requestFileSystem: got a file system", theFileSystem].join( " " ) );
        }
        deferred.resolve( theFileSystem );
      }, function failure( anError ) {
        if ( DEBUG ) {
          console.log( ["_requestFileSystem: couldn't get a file system",
                        fileSystemType
                       ].join( " " ) );
        }
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Resolves theURI to a fileEntry or directoryEntry, if possible.
   * If `theURL` contains `private` or `localhost` as its first element, it will be removed. If
   * `theURL` does not have a URL scheme, `file://` will be assumed.
   * @method _resolveLocalFileSystemURL
   * @private
   * @param  {String} theURL the path, should start with file://, but if it doesn't we'll add it.
   */
  function _resolveLocalFileSystemURL( theURL ) {
    var deferred = Q.defer();
    if ( DEBUG ) {
      console.log( ["_resolveLocalFileSystemURL: ", theURL].join( " " ) );
    }
    try {
      // split the parts of the URL
      var parts = theURL.split( ":" ),
        protocol, path;
      // can only have two parts
      if ( parts.length > 2 ) {
        throw new Error( "The URI is not well-formed; missing protocol: " + theURL );
      }
      // if only one part, we assume `file` as the protocol
      if ( parts.length < 2 ) {
        protocol = "file";
        path = parts[0];
      } else {
        protocol = parts[0];
        path = parts[1];
      }
      // split the path components
      var pathComponents = path.split( "/" ),
        newPathComponents = [];
      // iterate over each component and trim as we go
      pathComponents.forEach( function ( part ) {
        part = part.trim();
        if ( part !== "" ) { // remove /private if it is the first item in the new array, for iOS sake
          if ( !( ( part === "private" || part === "localhost" ) && newPathComponents.length === 0 ) ) {
            newPathComponents.push( part );
          }
        }
      } );
      // rejoin the path components
      var theNewURI = newPathComponents.join( "/" );
      // add the protocol
      theNewURI = protocol + ":///" + theNewURI;
      // and resolve the URL.
      window.resolveLocalFileSystemURL( theNewURI, function ( theEntry ) {
        deferred.resolve( theEntry );
      }, function ( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * @typedef {{}} DirectoryEntry
   * HTML5 File API Directory Type
   */
  /**
   * Returns a directory entry based on the path from the parent using
   * the specified options, if specified. `options` takes the form:
   * ` {create: true/false, exclusive true/false }`
   * @method _getDirectoryEntry
   * @private
   * @param  {DirectoryEntry} parent  The parent that path is relative from (or absolute)
   * @param  {String} path    The relative or absolute path or a {DirectoryEntry}
   * @param  {Object} options The options (that is, create the directory if it doesn't exist, etc.)
   * @return {Promise}         The promise
   */
  function _getDirectoryEntry( parent, path, options ) {
    if ( DEBUG ) {
      console.log( ["_getDirectoryEntry:", parent, path, options].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      if ( typeof path === "object" ) {
        deferred.resolve( path );
      } else {
        parent.getDirectory( path, options || {}, function success( theDirectoryEntry ) {
          deferred.resolve( theDirectoryEntry );
        }, function failure( anError ) {
          deferred.reject( anError );
        } );
      }
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Returns a file entry based on the path from the parent using
   * the specified options. `options` takes the form of `{ create: true/false, exclusive: true/false}`
   * @method getFileEntry
   * @private
   * @param  {DirectoryEntry} parent  The parent that path is relative from (or absolute)
   * @param  {String} path    The relative or absolute path
   * @param  {Object} options The options (that is, create the file if it doesn't exist, etc.)
   * @return {Promise}         The promise
   */
  function _getFileEntry( parent, path, options ) {
    if ( DEBUG ) {
      console.log( ["_getFileEntry:", parent, path, options].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      if ( typeof path === "object" ) {
        deferred.resolve( path );
      } else {
        parent.getFile( path, options || {}, function success( theFileEntry ) {
          deferred.resolve( theFileEntry );
        }, function failure( anError ) {
          deferred.reject( anError );
        } );
      }
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * @typedef {{}} FileEntry
   * HTML5 File API File Entry
   */
  /**
   * Returns a file object based on the file entry.
   * @method _getFileObject
   * @private
   * @param  {FileEntry} fileEntry The file Entry
   * @return {Promise}           The Promise
   */
  function _getFileObject( fileEntry ) {
    if ( DEBUG ) {
      console.log( ["_getFileObject:", fileEntry].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      fileEntry.file( function success( theFile ) {
        deferred.resolve( theFile );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Reads the file contents from a file object. readAsKind indicates how
   * to read the file ("Text", "DataURL", "BinaryString", "ArrayBuffer").
   * @method _readFileContents
   * @private
   * @param  {File} fileObject File to read
   * @param  {String} readAsKind "Text", "DataURL", "BinaryString", "ArrayBuffer"
   * @return {Promise}            The Promise
   */
  function _readFileContents( fileObject, readAsKind ) {
    if ( DEBUG ) {
      console.log( ["_readFileContents:", fileObject, readAsKind].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      var fileReader = new FileReader();
      fileReader.onloadend = function ( e ) {
        deferred.resolve( e.target.result );
      };
      fileReader.onerror = function ( anError ) {
        deferred.reject( anError );
      };
      fileReader["readAs" + readAsKind]( fileObject );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Creates a file writer for the file entry; `fileEntry` must exist
   * @method _createFileWriter
   * @private
   * @param  {FileEntry} fileEntry The file entry to write to
   * @return {Promise}           the Promise
   */
  function _createFileWriter( fileEntry ) {
    if ( DEBUG ) {
      console.log( ["_createFileWriter:", fileEntry].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      var fileWriter = fileEntry.createWriter( function success( theFileWriter ) {
        deferred.resolve( theFileWriter );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * @typedef {{}} FileWriter
   * HTML5 File API File Writer Type
   */
  /**
   * Write the contents to the fileWriter; `contents` should be a Blob.
   * @method _writeFileContents
   * @private
   * @param  {FileWriter} fileWriter Obtained from _createFileWriter
   * @param  {*} contents   The contents to write
   * @return {Promise}            the Promise
   */
  function _writeFileContents( fileWriter, contents ) {
    if ( DEBUG ) {
      console.log( ["_writeFileContents:", fileWriter, contents].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      fileWriter.onwrite = function ( e ) {
        fileWriter.onwrite = function ( e ) {
          deferred.resolve( e );
        };
        fileWriter.write( contents );
      };
      fileWriter.onError = function ( anError ) {
        deferred.reject( anError );
      };
      fileWriter.truncate( 0 ); // clear out the contents, first
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Copy the file to the specified parent directory, with an optional new name
   * @method _copyFile
   * @private
   * @param  {FileEntry} theFileEntry            The file to copy
   * @param  {DirectoryEntry} theParentDirectoryEntry The parent directory to copy the file to
   * @param  {String} theNewName              The new name of the file ( or undefined simply to copy )
   * @return {Promise}                         The Promise
   */
  function _copyFile( theFileEntry, theParentDirectoryEntry, theNewName ) {
    if ( DEBUG ) {
      console.log( ["_copyFile:", theFileEntry, theParentDirectoryEntry,
                    theNewName
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theFileEntry.copyTo( theParentDirectoryEntry, theNewName, function success( theNewFileEntry ) {
        deferred.resolve( theNewFileEntry );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Move the file to the specified parent directory, with an optional new name
   * @method _moveFile
   * @private
   * @param  {FileEntry} theFileEntry            The file to move or rename
   * @param  {DirectoryEntry} theParentDirectoryEntry The parent directory to move the file to (or the same as the file in order to rename)
   * @param  {String} theNewName              The new name of the file ( or undefined simply to move )
   * @return {Promise}                         The Promise
   */
  function _moveFile( theFileEntry, theParentDirectoryEntry, theNewName ) {
    if ( DEBUG ) {
      console.log( ["_moveFile:", theFileEntry, theParentDirectoryEntry,
                    theNewName
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theFileEntry.moveTo( theParentDirectoryEntry, theNewName, function success( theNewFileEntry ) {
        deferred.resolve( theNewFileEntry );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Remove the file from the file system
   * @method _removeFile
   * @private
   * @param  {FileEntry} theFileEntry The file to remove
   * @return {Promise}              The Promise
   */
  function _removeFile( theFileEntry ) {
    if ( DEBUG ) {
      console.log( ["_removeFile:", theFileEntry].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theFileEntry.remove( function success() {
        deferred.resolve();
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Copies a directory to the specified directory, with an optional new name. The directory
   * is copied recursively.
   * @method _copyDirectory
   * @private
   * @param  {DirectoryEntry} theDirectoryEntry       The directory to copy
   * @param  {DirectoryEntry} theParentDirectoryEntry The parent directory to copy the first directory to
   * @param  {String} theNewName              The optional new name for the directory
   * @return {Promise}                         A promise
   */
  function _copyDirectory( theDirectoryEntry, theParentDirectoryEntry, theNewName ) {
    if ( DEBUG ) {
      console.log( ["_copyDirectory:", theDirectoryEntry,
                    theParentDirectoryEntry,
                    theNewName
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theDirectoryEntry.copyTo( theParentDirectoryEntry, theNewName, function success( theNewDirectoryEntry ) {
        deferred.resolve( theNewDirectoryEntry );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Moves a directory to the specified directory, with an optional new name. The directory
   * is moved recursively.
   * @method _moveDirectory
   * @private
   * @param  {DirectoryEntry} theDirectoryEntry       The directory to move
   * @param  {DirectoryEntry} theParentDirectoryEntry The parent directory to move the first directory to
   * @param  {String} theNewName              The optional new name for the directory
   * @return {Promise}                         A promise
   */
  function _moveDirectory( theDirectoryEntry, theParentDirectoryEntry, theNewName ) {
    if ( DEBUG ) {
      console.log( ["_moveDirectory:", theDirectoryEntry,
                    theParentDirectoryEntry,
                    theNewName
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theDirectoryEntry.moveTo( theParentDirectoryEntry, theNewName, function success( theNewDirectoryEntry ) {
        deferred.resolve( theNewDirectoryEntry );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Removes a directory from the file system. If recursively is true, the directory is removed
   * recursively.
   * @method _removeDirectory
   * @private
   * @param  {DirectoryEntry} theDirectoryEntry The directory to remove
   * @param  {Boolean} recursively       If true, remove recursively
   * @return {Promise}                   The Promise
   */
  function _removeDirectory( theDirectoryEntry, recursively ) {
    if ( DEBUG ) {
      console.log( ["_removeDirectory:", theDirectoryEntry, "recursively",
                    recursively
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      if ( !recursively ) {
        theDirectoryEntry.remove( function success() {
          deferred.resolve();
        }, function failure( anError ) {
          deferred.reject( anError );
        } );
      } else {
        theDirectoryEntry.removeRecursively( function success() {
          deferred.resolve();
        }, function failure( anError ) {
          deferred.reject( anError );
        } );
      }
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Reads the contents of a directory
   * @method _readDirectoryContents
   * @private
   * @param  {DirectoryEntry} theDirectoryEntry The directory to list
   * @return {Promise}                   The promise
   */
  function _readDirectoryContents( theDirectoryEntry ) {
    if ( DEBUG ) {
      console.log( ["_readDirectoryContents:", theDirectoryEntry].join( " " ) );
    }
    var directoryReader = theDirectoryEntry.createReader(),
      entries = [],
      deferred = Q.defer();

    function readEntries() {
      directoryReader.readEntries( function success( theEntries ) {
        if ( !theEntries.length ) {
          deferred.resolve( entries );
        } else {
          entries = entries.concat( Array.prototype.slice.call( theEntries || [], 0 ) );
          readEntries();
        }
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }

    try {
      readEntries();
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * @class FileManager
   */
  var _className = "UTIL.FileManager",
    FileManager = function () {
      var self,
      // determine if we have a `BaseObject` available or not
        hasBaseObject = ( typeof BaseObject !== "undefined" );
      if ( hasBaseObject ) {
        // if we do, subclass it
        self = new BaseObject();
        self.subclass( _className );
        self.registerNotification( "changedCurrentWorkingDirectory" );
      } else {
        // otherwise, base off {}
        self = {};
      }
      // get the persistent and temporary filesystem constants
      self.PERSISTENT = ( typeof LocalFileSystem !== "undefined" ) ? LocalFileSystem.PERSISTENT : window.PERSISTENT;
      self.TEMPORARY = ( typeof LocalFileSystem !== "undefined" ) ? LocalFileSystem.TEMPORARY : window.TEMPORARY;
      // determine the various file types we support
      self.FILETYPE = {
        TEXT:         "Text",
        DATA_URL:     "DataURL",
        BINARY:       "BinaryString",
        ARRAY_BUFFER: "ArrayBuffer"
      };
      /**
       * Returns the value of the global `DEBUG` variable.
       * @method getGlobalDebug
       * @returns {Boolean}
       */
      self.getGlobalDebug = function () {
        return DEBUG;
      };
      /**
       * Sets the global DEBUG variable. If `true`, debug messages are logged to the console.
       * @method setGlobalDebug
       * @param {Boolean} debug
       */
      self.setGlobalDebug = function ( debug ) {
        DEBUG = debug;
      };
      /**
       * @property globalDebug
       * @type {Boolean} If `true`, logs messages to console as operations occur.
       */
      Object.defineProperty( self, "globalDebug", {
        get:          self.getGlobalDebug,
        set:          self.setGlobalDebug,
        configurable: true
      } );
      /**
       * the fileSystemType can either be `self.PERSISTENT` or `self.TEMPORARY`, and is only
       * set during an `init` operation. It cannot be set at any other time.
       * @property fileSystemType
       * @type {FileSystem}
       */
      self._fileSystemType = null; // can only be changed during INIT
      self.getFileSystemType = function () {
        return self._fileSystemType;
      };
      Object.defineProperty( self, "fileSystemType", {
        get:          self.getFileSystemType,
        configurable: true
      } );
      /**
       * The requested quota -- stored for future reference, since we ask for it
       * specifically during an `init` operation. It cannot be changed.
       * @property requestedQuota
       * @type {Number}
       */
      self._requestedQuota = 0; // can only be changed during INIT
      self.getRequestedQuota = function () {
        return self._requestedQuota;
      };
      Object.defineProperty( self, "requestedQuota", {
        get:          self.getRequestedQuota,
        configurable: true
      } );
      /**
       * The actual quota obtained from the system. It cannot be changed, and is
       * only obtained during `init`. The result does not have to match the
       * `requestedQuota`. If it doesn't match, it may be representative of the
       * actual space available, depending on the platform
       * @property actualQuota
       * @type {Number}
       */
      self._actualQuota = 0;
      self.getActualQuota = function () {
        return self._actualQuota;
      };
      Object.defineProperty( self, "actualQuota", {
        get:          self.getActualQuota,
        configurable: true
      } );
      /**
       * @typedef {{}} FileSystem
       * HTML5 File API File System
       */
      /**
       * The current filesystem -- either the temporary or persistent one; it can't be changed
       * @property fileSystem
       * @type {FileSystem}
       */
      self._fileSystem = null;
      self.getFileSystem = function () {
        return self._fileSystem;
      };
      Object.defineProperty( self, "fileSystem", {
        get:          self.getFileSystem,
        configurable: true
      } );
      /**
       * Current Working Directory Entry
       * @property cwd
       * @type {DirectoryEntry}
       */
      self._root = null;
      self._cwd = null;
      self.getCurrentWorkingDirectory = function () {
        return self._cwd;
      };
      self.setCurrentWorkingDirectory = function ( theCWD ) {
        self._cwd = theCWD;
        if ( hasBaseObject ) {
          self.notify( "changedCurrentWorkingDirectory" );
        }
      };
      Object.defineProperty( self, "cwd", {
        get:          self.getCurrentWorkingDirectory,
        set:          self.setCurrentWorkingDirectory,
        configurable: true
      } );
      Object.defineProperty( self, "currentWorkingDirectory", {
        get:          self.getCurrentWorkingDirectory,
        set:          self.setCurrentWorkingDirectory,
        configurable: true
      } );
      /**
       * Current Working Directory stack
       * @property _cwds
       * @private
       * @type {Array}
       */
      self._cwds = [];
      /**
       * Push the current working directory on to the stack
       * @method pushCurrentWorkingDirectory
       */
      self.pushCurrentWorkingDirectory = function () {
        self._cwds.push( self._cwd );
      };
      /**
       * Pop the topmost directory on the stack and change to it
       * @method popCurrentWorkingDirectory
       */
      self.popCurrentWorkingDirectory = function () {
        self.setCurrentWorkingDirectory( self._cwds.pop() );
      };
      /**
       * Resolves a URL to a local file system. If the URL scheme is not present, `file`
       * is assumed.
       * @param {String} theURI The URI to resolve
       */
      self.resolveLocalFileSystemURL = function ( theURI ) {
        var deferred = Q.defer();
        _resolveLocalFileSystemURL( theURI ).then( function gotEntry( theEntry ) {
          deferred.resolve( theEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns the file entry for the given path (useful for
       * getting the full path of a file). `options` is of the
       * form `{create: true/false, exclusive: true/false}`
       * @method getFileEntry
       * @param {String} theFilePath The file path or FileEntry object
       * @param {*} options creation options
       */
      self.getFileEntry = function ( theFilePath, options ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options ).then( function gotFileEntry( theFileEntry ) {
          deferred.resolve( theFileEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns the file object for a given file (useful for getting
       * the size of a file); `option` is of the form `{create: true/false, exclusive: true/false}`
       * @method getFile
       * @param {String} theFilePath
       * @param {*} option
       */
      self.getFile = function ( theFilePath, options ) {
        return self.getFileEntry( theFilePath, options ).then( _getFileObject );
      };
      /**
       * Returns the directory entry for a given path
       * @method getDirectoryEntry
       * @param {String} theDirectoryPath
       * @param {*} options
       */
      self.getDirectoryEntry = function ( theDirectoryPath, options ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theDirectoryPath, options ).then( function gotDirectoryEntry( theDirectoryEntry ) {
          deferred.resolve( theDirectoryEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * returns the URL for a given file
       * @method getFileURL
       * @param {String} theFilePath
       * @param {*} options
       */
      self.getFileURL = function ( theFilePath, options ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options ).then( function gotFileEntry( theFileEntry ) {
          deferred.resolve( theFileEntry.toURL() );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns a URL for the given directory
       * @method getDirectoryURL
       * @param {String} thePath
       * @param {*} options
       */
      self.getDirectoryURL = function ( thePath, options ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, thePath || ".", options ).then( function gotDirectoryEntry( theDirectoryEntry ) {
          deferred.resolve( theDirectoryEntry.toURL() );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns the native URL for an entry by combining the `fullPath` of the entry
       * with the `nativeURL` of the `root` directory if absolute or of the `current`
       * directory if not absolute.
       * @method getNativeURL
       * @param {String} theEntry Path of the file or directory; can also be a File/DirectoryEntry
       */
      self.getNativeURL = function ( theEntry ) {
        var thePath = theEntry;
        if ( typeof theEntry !== "string" ) {
          thePath = theEntry.fullPath();
        }
        var isAbsolute = ( thePath.substr( 0, 1 ) === "/" ),
          theRootPath = isAbsolute ? self._root.nativeURL : self.cwd.nativeURL;
        return theRootPath + ( isAbsolute ? "" : "/" ) + thePath;
      };
      /**
       * returns the native file path for a given file
       * @method getNativeFileURL
       * @param {String} theFilePath
       * @param {*} options
       */
      self.getNativeFileURL = function ( theFilePath, options ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options ).then( function gotFileEntry( theFileEntry ) {
          deferred.resolve( theFileEntry.nativeURL );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns a URL for the given directory
       * @method getNativeDirectoryURL
       * @param {String} thePath
       * @param {*} options
       */
      self.getNativeDirectoryURL = function ( thePath, options ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, thePath || ".", options ).then( function gotDirectoryEntry( theDirectoryEntry ) {
          deferred.resolve( theDirectoryEntry.nativeURL );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Change to an arbitrary directory
       * @method changeDirectory
       * @param  {String} theNewPath The path to the directory, relative to cwd
       * @return {Promise}            The Promise
       */
      self.changeDirectory = function ( theNewPath ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theNewPath, {} ).then( function gotDirectory( theNewDirectory ) {
          self.cwd = theNewDirectory;
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Read an arbitrary file's contents.
       * @method readFileContents
       * @param  {String} theFilePath The path to the file, relative to cwd
       * @param  {Object} options     The options to use when opening the file (such as creating it)
       * @param  {String} readAsKind  How to read the file -- best to use self.FILETYPE.TEXT, etc.
       * @return {Promise}             The Promise
       */
      self.readFileContents = function ( theFilePath, options, readAsKind ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options || {} ).then( function gotTheFileEntry( theFileEntry ) {
          return _getFileObject( theFileEntry );
        } ).then( function gotTheFileObject( theFileObject ) {
          return _readFileContents( theFileObject, readAsKind || "Text" );
        } ).then( function getTheFileContents( theFileContents ) {
          deferred.resolve( theFileContents );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Read an arbitrary directory's entries.
       * @method readDirectoryContents
       * @param  {String} theDirectoryPath The path to the directory, relative to cwd; "." if not specified
       * @param  {Object} options          The options to use when opening the directory (such as creating it)
       * @return {Promise}             The Promise
       */
      self.readDirectoryContents = function ( theDirectoryPath, options ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theDirectoryPath || ".", options || {} ).then( function gotTheDirectoryEntry( theDirectoryEntry ) {
          return _readDirectoryContents( theDirectoryEntry );
        } ).then( function gotTheDirectoryEntries( theEntries ) {
          deferred.resolve( theEntries );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Write data to an arbitrary file
       * @method writeFileContents
       * @param  {String} theFilePath The file name to write to, relative to cwd
       * @param  {Object} options     The options to use when opening the file
       * @param  {*} theData     The data to write
       * @return {Promise}             The Promise
       */
      self.writeFileContents = function ( theFilePath, options, theData ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options || {
          create:    true,
          exclusive: false
        } ).then( function gotTheFileEntry( theFileEntry ) {
          return _createFileWriter( theFileEntry );
        } ).then( function gotTheFileWriter( theFileWriter ) {
          return _writeFileContents( theFileWriter, theData );
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Creates an arbitrary directory
       * @method createDirectory
       * @param  {String} theDirectoryPath The path, relative to cwd
       * @return {Promise}                  The Promise
       */
      self.createDirectory = function ( theDirectoryPath ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theDirectoryPath, {
          create:    true,
          exclusive: false
        } ).then( function gotDirectory( theNewDirectory ) {
          deferred.resolve( theNewDirectory );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Copies a file to a new directory, with an optional new name
       * @method copyFile
       * @param  {String} sourceFilePath      Path to file, relative to cwd
       * @param  {String} targetDirectoryPath Path to new directory, relative to cwd
       * @param  {String} withNewName         New name, if desired
       * @return {Promise}                     The Promise
       */
      self.copyFile = function ( sourceFilePath, targetDirectoryPath, withNewName ) {
        var deferred = Q.defer(),
          theFileToCopy;
        _getFileEntry( self._cwd, sourceFilePath, {} ).then( function gotFileEntry( aFileToCopy ) {
          theFileToCopy = aFileToCopy;
          return _getDirectoryEntry( self._cwd, targetDirectoryPath, {} );
        } ).then( function gotDirectoryEntry( theTargetDirectory ) {
          return _copyFile( theFileToCopy, theTargetDirectory, withNewName );
        } ).then( function allDone( theNewFileEntry ) {
          deferred.resolve( theNewFileEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Copies a directory to a new directory, with an optional new name
       * @method copyDirectory
       * @param  {String} sourceDirectoryPath Path to directory, relative to cwd
       * @param  {String} targetDirectoryPath Path to new directory, relative to cwd
       * @param  {String} withNewName         New name, if desired
       * @return {Promise}                     The Promise
       */
      self.copyDirectory = function ( sourceDirectoryPath, targetDirectoryPath, withNewName ) {
        var deferred = Q.defer(),
          theDirectoryToCopy;
        _getDirectoryEntry( self._cwd, sourceDirectoryPath, {} ).then( function gotSourceDirectoryEntry( sourceDirectoryEntry ) {
          theDirectoryToCopy = sourceDirectoryEntry;
          return _getDirectoryEntry( self._cwd, targetDirectoryPath, {} );
        } ).then( function gotTargetDirectoryEntry( theTargetDirectory ) {
          return _copyDirectory( theDirectoryToCopy, theTargetDirectory, withNewName );
        } ).then( function allDone( theNewDirectoryEntry ) {
          deferred.resolve( theNewDirectoryEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * @method moveFile
       * Moves a file to a new directory, with an optional new name
       * @param  {String} sourceFilePath      Path to file, relative to cwd
       * @param  {String} targetDirectoryPath Path to new directory, relative to cwd
       * @param  {String} withNewName         New name, if desired
       * @return {Promise}                     The Promise
       */
      self.moveFile = function ( sourceFilePath, targetDirectoryPath, withNewName ) {
        var deferred = Q.defer(),
          theFileToMove;
        _getFileEntry( self._cwd, sourceFilePath, {} ).then( function gotFileEntry( aFileToMove ) {
          theFileToMove = aFileToMove;
          return _getDirectoryEntry( self._cwd, targetDirectoryPath, {} );
        } ).then( function gotDirectoryEntry( theTargetDirectory ) {
          return _moveFile( theFileToMove, theTargetDirectory, withNewName );
        } ).then( function allDone( theNewFileEntry ) {
          deferred.resolve( theNewFileEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Moves a directory to a new directory, with an optional new name
       * @method moveDirectory
       * @param  {String} sourceDirectoryPath Path to directory, relative to cwd
       * @param  {String} targetDirectoryPath Path to new directory, relative to cwd
       * @param  {String} withNewName         New name, if desired
       * @return {Promise}                     The Promise
       */
      self.moveDirectory = function ( sourceDirectoryPath, targetDirectoryPath, withNewName ) {
        var deferred = Q.defer(),
          theDirectoryToMove;
        _getDirectoryEntry( self._cwd, sourceDirectoryPath, {} ).then( function gotSourceDirectoryEntry( sourceDirectoryEntry ) {
          theDirectoryToMove = sourceDirectoryEntry;
          return _getDirectoryEntry( self._cwd, targetDirectoryPath, {} );
        } ).then( function gotTargetDirectoryEntry( theTargetDirectory ) {
          return _moveDirectory( theDirectoryToMove, theTargetDirectory, withNewName );
        } ).then( function allDone( theNewDirectoryEntry ) {
          deferred.resolve( theNewDirectoryEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Renames a file to a new name, in the cwd
       * @method renameFile
       * @param  {String} sourceFilePath      Path to file, relative to cwd
       * @param  {String} withNewName         New name
       * @return {Promise}                     The Promise
       */
      self.renameFile = function ( sourceFilePath, withNewName ) {
        return self.moveFile( sourceFilePath, ".", withNewName );
      };
      /**
       * Renames a directory to a new name, in the cwd
       * @method renameDirectory
       * @param  {String} sourceDirectoryPath Path to directory, relative to cwd
       * @param  {String} withNewName         New name
       * @return {Promise}                     The Promise
       */
      self.renameDirectory = function ( sourceDirectoryPath, withNewName ) {
        return self.moveDirectory( sourceDirectoryPath, ".", withNewName );
      };
      /**
       * Deletes a file
       * @method deleteFile
       * @param  {String} theFilePath Path to file, relative to cwd
       * @return {Promise}             The Promise
       */
      self.deleteFile = function ( theFilePath ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, {} ).then( function gotTheFileToDelete( theFileEntry ) {
          return _removeFile( theFileEntry );
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Removes a directory, possibly recursively
       * @method removeDirectory
       * @param  {String} theDirectoryPath path to directory, relative to cwd
       * @param  {Boolean} recursively      If true, recursive remove
       * @return {Promise}                  The promise
       */
      self.removeDirectory = function ( theDirectoryPath, recursively ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theDirectoryPath, {} ).then( function gotTheDirectoryToDelete( theDirectoryEntry ) {
          return _removeDirectory( theDirectoryEntry, recursively );
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Asks the browser for the requested quota, and then requests the file system
       * and sets the cwd to the root directory.
       * @method _initializeFileSystem
       * @private
       * @return {Promise} The promise
       */
      self._initializeFileSystem = function () {
        var deferred = Q.defer();
        _requestQuota( self.fileSystemType, self.requestedQuota ).then( function gotQuota( theQuota ) {
          self._actualQuota = theQuota;
          return _requestFileSystem( self.fileSystemType, self.actualQuota );
        } ).then( function gotFS( theFS ) {
          self._fileSystem = theFS;
          //self._cwd = theFS.root;
          return _getDirectoryEntry( theFS.root, "", {} );
        } ).then( function gotRootDirectory( theRootDirectory ) {
          self._root = theRootDirectory;
          self._cwd = theRootDirectory;
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      if ( self.overrideSuper ) {
        self.overrideSuper( self.class, "init", self.init );
      }
      /**
       * Initializes the file manager with the requested file system type (self.PERSISTENT or self.TEMPORARY)
       * and requested quota size. Both must be specified.
       * @method init
       * @param {FileSystem} fileSystemType
       * @param {Number} requestedQuota
       */
      self.init = function ( fileSystemType, requestedQuota ) {
        if ( self.super ) {
          self.super( _className, "init" );
        }
        if ( typeof fileSystemType === "undefined" ) {
          throw new Error( "No file system type specified; specify PERSISTENT or TEMPORARY." );
        }
        if ( typeof requestedQuota === "undefined" ) {
          throw new Error( "No quota requested. If you don't know, specify ZERO." );
        }
        self._requestedQuota = requestedQuota;
        self._fileSystemType = fileSystemType;
        return self._initializeFileSystem(); // this returns a promise, so we can .then after.
      };
      /**
       * Initializes the file manager with the requested file system type (self.PERSISTENT or self.TEMPORARY)
       * and requested quota size. Both must be specified.
       * @method initWithOptions
       * @param {*} options
       */
      self.initWithOptions = function ( options ) {
        if ( typeof options === "undefined" ) {
          throw new Error( "No options specified. Need type and quota." );
        }
        if ( typeof options.fileSystemType === "undefined" ) {
          throw new Error( "No file system type specified; specify PERSISTENT or TEMPORARY." );
        }
        if ( typeof options.requestedQuota === "undefined" ) {
          throw new Error( "No quota requested. If you don't know, specify ZERO." );
        }
        return self.init( options.fileSystemType, options.requestedQuota );
      };
      return self;
    };
  // meta information
  FileManager.meta = {
    version:           "00.04.450",
    class:             _className,
    autoInitializable: false,
    categorizable:     false
  };
  // assign to `window` if stand-alone
  if ( globalContext ) {
    globalContext.FileManager = FileManager;
  }
  if ( module ) {
    module.exports = FileManager;
  }
})( Q, BaseObject, ( typeof IN_YASMF !== "undefined" ) ? undefined : window, module );

},{"../../q":1,"./object.js":19}],17:[function(require,module,exports){
/**
 *
 * Provides convenience methods for parsing unix-style path names. If the
 * path separator is changed from "/" to "\", it should parse Windows paths as well.
 *
 * @module filename.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module*/
"use strict";
var PKFILE = {
  /**
   * @property Version
   * @type {String}
   */
  version:              "00.04.100",
  /**
   * Specifies the characters that are not allowed in file names.
   * @property invalidCharacters
   * @default ["/","\",":","|","<",">","*","?",";","%"]
   * @type {Array}
   */
  invalidCharacters:    "/,\\,:,|,<,>,*,?,;,%".split( "," ),
  /**
   * Indicates the character that separates a name from its extension,
   * as in "filename.ext".
   * @property extensionSeparator
   * @default "."
   * @type {String}
   */
  extensionSeparator:   ".",
  /**
   * Indicates the character that separates path components.
   * @property pathSeparator
   * @default "/"
   * @type {String}
   */
  pathSeparator:        "/",
  /**
   * Indicates the character used when replacing invalid characters
   * @property replacementCharacter
   * @default "-"
   * @type {String}
   */
  replacementCharacter: "-",
  /**
   * Converts a potential invalid filename to a valid filename by replacing
   * invalid characters (as specified in "invalidCharacters") with "replacementCharacter".
   *
   * @method makeValid
   * @param  {String} theFileName
   * @return {String}
   */
  makeValid:            function ( theFileName ) {
    var self = PKFILE;
    var theNewFileName = theFileName;
    for ( var i = 0; i < self.invalidCharacters.length; i++ ) {
      var d = 0;
      while ( theNewFileName.indexOf( self.invalidCharacters[i] ) > -1 && ( d++ ) < 50 ) {
        theNewFileName = theNewFileName.replace( self.invalidCharacters[i], self.replacementCharacter );
      }
    }
    return theNewFileName;
  },
  /**
   * Returns the name+extension portion of a full path.
   *
   * @method getFilePart
   * @param  {String} theFileName
   * @return {String}
   */
  getFilePart:          function ( theFileName ) {
    var self = PKFILE;
    var theSlashPosition = theFileName.lastIndexOf( self.pathSeparator );
    if ( theSlashPosition < 0 ) {
      return theFileName;
    }
    return theFileName.substr( theSlashPosition + 1, theFileName.length - theSlashPosition );
  },
  /**
   * Returns the path portion of a full path.
   * @method getPathPart
   * @param  {String} theFileName
   * @return {String}
   */
  getPathPart:          function ( theFileName ) {
    var self = PKFILE;
    var theSlashPosition = theFileName.lastIndexOf( self.pathSeparator );
    if ( theSlashPosition < 0 ) {
      return "";
    }
    return theFileName.substr( 0, theSlashPosition + 1 );
  },
  /**
   * Returns the filename, minus the extension.
   * @method getFileNamePart
   * @param  {String} theFileName
   * @return {String}
   */
  getFileNamePart:      function ( theFileName ) {
    var self = PKFILE;
    var theFileNameNoPath = self.getFilePart( theFileName );
    var theDotPosition = theFileNameNoPath.lastIndexOf( self.extensionSeparator );
    if ( theDotPosition < 0 ) {
      return theFileNameNoPath;
    }
    return theFileNameNoPath.substr( 0, theDotPosition );
  },
  /**
   * Returns the extension of a filename
   * @method getFileExtensionPart
   * @param  {String} theFileName
   * @return {String}
   */
  getFileExtensionPart: function ( theFileName ) {
    var self = PKFILE;
    var theFileNameNoPath = self.getFilePart( theFileName );
    var theDotPosition = theFileNameNoPath.lastIndexOf( self.extensionSeparator );
    if ( theDotPosition < 0 ) {
      return "";
    }
    return theFileNameNoPath.substr( theDotPosition + 1, theFileNameNoPath.length - theDotPosition - 1 );
  }
};
module.exports = PKFILE;

},{}],18:[function(require,module,exports){
/**
 *
 * Provides miscellaneous functions that had no other category.
 *
 * @module misc.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module*/
"use strict";
module.exports = {
  /**
   * Returns a pseudo-UUID. Not guaranteed to be unique (far from it, probably), but
   * close enough for most purposes. You should handle collisions gracefully on your
   * own, of course. see http://stackoverflow.com/a/8809472
   * @method makeFauxUUID
   * @return {String}
   */
  makeFauxUUID: function () {
    var d = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace( /[xy]/g, function ( c ) {
      var r = ( d + Math.random() * 16 ) % 16 | 0;
      d = Math.floor( d / 16 );
      return ( c === "x" ? r : ( r & 0x7 | 0x8 ) ).toString( 16 );
    } );
    return uuid;
  }
};

},{}],19:[function(require,module,exports){
/**
 *
 * # Base Object
 *
 * @module object.js
 * @author Kerri Shotts
 * @version 0.5
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module, console, setTimeout*/
"use strict";
var _className = "BaseObject",
  /**
   * BaseObject is the base object for all complex objects used by YASMF;
   * simpler objects that are properties-only do not inherit from this
   * class.
   *
   * BaseObject provides simple inheritance, but not by using the typical
   * prototypal method. Rather inheritance is formed by object composition
   * where all objects are instances of BaseObject with methods overridden
   * instead. As such, you can *not* use any Javascript type checking to
   * differentiate PKObjects; you should instead use the `class`
   * property.
   *
   * BaseObject provides inheritance to more than just a constructor: any
   * method can be overridden, but it is critical that the super-chain
   * be properly initialized. See the `super` and `overrideSuper`
   * methods for more information.
   *
   * @class BaseObject
   */
  BaseObject = function () {
    var self = this;
    /**
     *
     * We need a way to provide inheritance. Most methods only provide
     * inheritance across the constructor chain, not across any possible
     * method. But for our purposes, we need to be able to provide for
     * overriding any method (such as drawing, touch responses, etc.),
     * and so we implement inheritance in a different way.
     *
     * First, the _classHierarchy, a private property, provides the
     * inheritance tree. All objects inherit from "BaseObject".
     *
     * @private
     * @property _classHierarchy
     * @type Array
     * @default ["BaseObject"]
     */
    self._classHierarchy = [_className];
    /**
     *
     * Objects are subclassed using this method. The newClass is the
     * unique class name of the object (and should match the class'
     * actual name.
     *
     * @method subclass
     * @param {String} newClass - the new unique class of the object
     */
    self.subclass = function ( newClass ) {
      self._classHierarchy.push( newClass );
    };
    /**
     *
     * getClass returns the current class of the object. The
     * `class` property can be used as well. Note that there
     * is no `setter` for this property; an object's class
     * can *not* be changed.
     *
     * @method getClass
     * @returns {String} the class of the instance
     *
     */
    self.getClass = function () {
      return self._classHierarchy[self._classHierarchy.length - 1];
    };
    /**
     *
     * The class of the instance. **Read-only**
     * @property class
     * @type String
     * @readOnly
     */
    Object.defineProperty( self, "class", {
      get:          self.getClass,
      configurable: false
    } );
    /**
     *
     * Returns the super class for the given class. If the
     * class is not supplied, the class is assumed to be the
     * object's own class.
     *
     * The property "superClass" uses this to return the
     * object's direct superclass, but getSuperClassOfClass
     * can be used to determine superclasses higher up
     * the hierarchy.
     *
     * @method getSuperClassOfClass
     * @param {String} [aClass=currentClass] the class for which you want the super class. If not specified,
     *                                        the instance's class is used.
     * @returns {String} the super-class of the specified class.
     */
    self.getSuperClassOfClass = function ( aClass ) {
      var theClass = aClass || self.class;
      var i = self._classHierarchy.indexOf( theClass );
      if ( i > -1 ) {
        return self._classHierarchy[i - 1];
      } else {
        return null;
      }
    };
    /**
     *
     * The superclass of the instance.
     * @property superClass
     * @type String
     */
    Object.defineProperty( self, "superClass", {
      get:          self.getSuperClassOfClass,
      configurable: false
    } );
    /**
     *
     * _super is an object that stores overridden functions by class and method
     * name. This is how we get the ability to arbitrarily override any method
     * already present in the superclass.
     *
     * @private
     * @property _super
     * @type Object
     */
    self._super = {};
    /**
     *
     * Must be called prior to defining the overridden function as this moves
     * the original function into the _super object. The functionName must
     * match the name of the method exactly, since there may be a long tree
     * of code that depends on it.
     *
     * @method overrideSuper
     * @param {String} theClass  the class for which the function override is desired
     * @param {String} theFunctionName  the name of the function to override
     * @param {Function} theActualFunction  the actual function (or pointer to function)
     *
     */
    self.overrideSuper = function ( theClass, theFunctionName, theActualFunction ) {
      var superClass = self.getSuperClassOfClass( theClass );
      if ( !self._super[superClass] ) {
        self._super[superClass] = {};
      }
      self._super[superClass][theFunctionName] = theActualFunction;
    };
    /**
     * @method override
     *
     * Overrides an existing function with the same name as `theNewFunction`. Essentially
     * a call to `overrideSuper (self.class, theNewFunction.name, self[theNewFunction.name])`
     * followed by the redefinition of the function.
     *
     * @example
     * ```
     * obj.override ( function initWithOptions ( options )
     *                { ... } );
     * ```
     *
     * @param {Function} theNewFunction - The function to override. Must have the name of the overriding function.
     */
    self.override = function ( theNewFunction ) {
      var theFunctionName = theNewFunction.name,
        theOldFunction = self[theFunctionName];
      if ( theFunctionName !== "" ) {
        self.overrideSuper( self.class, theFunctionName, theOldFunction );
        self[theFunctionName] = function __super__() {
          var ret,
            old$class = self.$class,
            old$superclass = self.$superclass,
            old$super = self.$super;
          self.$class = self.class;
          self.$superclass = self.superClass;
          self.$super = function $super() {
            return theOldFunction.apply( this, arguments );
          };
          try {
            ret = theNewFunction.apply( this, arguments );
          }
          catch ( err ) {
            throw err;
          }
          finally {
            self.$class = old$class;
            self.$superclass = old$superclass;
            self.$super = old$super;
          }
          return ret;
        };
      }
    };
    /**
     *
     * Calls a super function with any number of arguments.
     *
     * @method super
     * @param {String} theClass  the current class instance
     * @param {String} theFunctionName the name of the function to execute
     * @param {Array} [args]  Any number of parameters to pass to the super method
     *
     */
    self.super = function ( theClass, theFunctionName, args ) {
      var superClass = self.getSuperClassOfClass( theClass );
      if ( self._super[superClass] ) {
        if ( self._super[superClass][theFunctionName] ) {
          return self._super[superClass][theFunctionName].apply( self, args );
        }
        return null;
      }
      return null;
    };
    /**
     * Category support; for an object to get category support for their class,
     * they must call this method prior to any auto initialization
     *
     * @method _constructObjectCategories
     *
     */
    self._constructObjectCategories = function _constructObjectCategories( pri ) {
      var priority = BaseObject.ON_CREATE_CATEGORY;
      if ( typeof pri !== "undefined" ) {
        priority = pri;
      }
      if ( typeof BaseObject._objectCategories[priority][self.class] !== "undefined" ) {
        BaseObject._objectCategories[priority][self.class].forEach( function ( categoryConstructor ) {
          try {
            categoryConstructor( self );
          }
          catch ( e ) {
            console.log( "Error during category construction: " + e.message );
          }
        } );
      }
    };
    /**
     *
     * initializes the object
     *
     * @method init
     *
     */
    self.init = function () {
      self._constructObjectCategories( BaseObject.ON_INIT_CATEGORY );
      return self;
    };
    /*
     *
     * Objects have some properties that we want all objects to have...
     *
     */
    /**
     * Stores the values of all the tags associated with the instance.
     *
     * @private
     * @property _tag
     * @type Object
     */
    self._tags = {};
    /**
     *
     * Stores the *listeners* for all the tags associated with the instance.
     *
     * @private
     * @property _tagListeners
     * @type Object
     */
    self._tagListeners = {};
    /**
     *
     * Sets the value for a specific tag associated with the instance. If the
     * tag does not exist, it is created.
     *
     * Any listeners attached to the tag via `addTagListenerForKey` will be
     * notified of the change. Listeners are passed three parameters:
     * `self` (the originating instance),
     * `theKey` (the tag being changed),
     * and `theValue` (the value of the tag); the tag is *already* changed
     *
     * @method setTagForKey
     * @param {*} theKey  the name of the tag; "__default" is special and
     *                     refers to the default tag visible via the `tag`
     *                     property.
     * @param {*} theValue  the value to assign to the tag.
     *
     */
    self.setTagForKey = function ( theKey, theValue ) {
      self._tags[theKey] = theValue;
      var notifyListener = function ( theListener, theKey, theValue ) {
        return function () {
          theListener( self, theKey, theValue );
        };
      };
      if ( self._tagListeners[theKey] ) {
        for ( var i = 0; i < self._tagListeners[theKey].length; i++ ) {
          setTimeout( notifyListener( self._tagListeners[theKey][i], theKey, theValue ), 0 );
        }
      }
    };
    /**
     *
     * Returns the value for a given key. If the key does not exist, the
     * result is undefined.
     *
     * @method getTagForKey
     * @param {*} theKey  the tag; "__default" is special and refers to
     *                     the default tag visible via the `tag` property.
     * @returns {*} the value of the key
     *
     */
    self.getTagForKey = function ( theKey ) {
      return self._tags[theKey];
    };
    /**
     *
     * Add a listener to a specific tag. The listener will receive three
     * parameters whenever the tag changes (though they are optional). The tag
     * itself doesn't need to exist in order to assign a listener to it.
     *
     * The first parameter is the object for which the tag has been changed.
     * The second parameter is the tag being changed, and the third parameter
     * is the value of the tag. **Note:** the value has already changed by
     * the time the listener is called.
     *
     * @method addListenerForKey
     * @param {*} theKey The tag for which to add a listener; `__default`
     *                     is special and refers the default tag visible via
     *                     the `tag` property.
     * @param {Function} theListener  the function (or reference) to call
     *                    when the value changes.
     */
    self.addTagListenerForKey = function ( theKey, theListener ) {
      if ( !self._tagListeners[theKey] ) {
        self._tagListeners[theKey] = [];
      }
      self._tagListeners[theKey].push( theListener );
    };
    /**
     *
     * Removes a listener from being notified when a tag changes.
     *
     * @method removeTagListenerForKey
     * @param {*} theKey  the tag from which to remove the listener; `__default`
     *                     is special and refers to the default tag visible via
     *                     the `tag` property.
     * @param {Function} theListener  the function (or reference) to remove.
     *
     */
    self.removeTagListenerForKey = function ( theKey, theListener ) {
      if ( !self._tagListeners[theKey] ) {
        self._tagListeners[theKey] = [];
      }
      var i = self._tagListeners[theKey].indexOf( theListener );
      if ( i > -1 ) {
        self._tagListeners[theKey].splice( i, 1 );
      }
    };
    /**
     *
     * Sets the value for the simple tag (`__default`). Any listeners attached
     * to `__default` will be notified.
     *
     * @method setTag
     * @param {*} theValue  the value for the tag
     *
     */
    self.setTag = function ( theValue ) {
      self.setTagForKey( "__default", theValue );
    };
    /**
     *
     * Returns the value for the given tag (`__default`). If the tag has never been
     * set, the result is undefined.
     *
     * @method getTag
     * @returns {*} the value of the tag.
     */
    self.getTag = function () {
      return self.getTagForKey( "__default" );
    };
    /**
     *
     * The default tag for the instance. Changing the tag itself (not any sub-properties of an object)
     * will notify any listeners attached to `__default`.
     *
     * @property tag
     * @type *
     *
     */
    Object.defineProperty( self, "tag", {
      get:          self.getTag,
      set:          self.setTag,
      configurable: true
    } );
    /**
     *
     * All objects subject notifications for events
     *
     */
    /**
     * Supports notification listeners.
     * @private
     * @property _notificationListeners
     * @type Object
     */
    self._notificationListeners = {};
    /**
     * Adds a listener for a notification. If a notification has not been
     * registered (via `registerNotification`), an error is logged on the console
     * and the function returns without attaching the listener. This means if
     * you aren't watching the console, the function fails nearly silently.
     *
     * > By default, no notifications are registered.
     *
     * If the first parameter is an object, multiple listeners can be registered:
     * { "viewWillAppear": handler, "viewDidAppear": handler2}.
     *
     * @method addListenerForNotification
     * @alias on
     * @param {String|*} theNotification  the name of the notification
     * @param {Function} theListener  the function (or reference) to be called when the
     *                                notification is triggered.
     * @returns {*} returns self for chaining
     */
    self.addListenerForNotification = function addListenerForNotification( theNotification, theListener, async ) {
      if ( theNotification instanceof Array ) {
        theNotification.forEach( function ( n ) {
          addListenerForNotification( n, theListener, async );
        } );
        return self;
      }
      if ( typeof theNotification === "object" ) {
        for ( var n in theNotification ) {
          if ( theNotification.hasOwnProperty( n ) ) {
            addListenerForNotification( n, theNotification[n], theListener ); // async would shift up
          }
        }
        return self;
      }
      if ( !self._notificationListeners[theNotification] ) {
        self.registerNotification( theNotification, ( typeof async !== "undefined" ) ? async : false );
      }
      self._notificationListeners[theNotification].push( theListener );
      if ( self._traceNotifications ) {
        console.log( "Adding listener " + theListener + " for notification " + theNotification );
      }
      return self;
    };
    self.on = self.addListenerForNotification;
    /**
     * Registers a listener valid for one notification only. Immediately after
     * @method once
     * @param  {[type]} theNotification [description]
     * @param  {[type]} theListener     [description]
     * @param  {[type]} async           [description]
     * @return {[type]}                 [description]
     */
    self.once = function once( theNotification, theListener, async ) {
      self.addListenerForNotification( theNotification, function onceHandler( sender, notice, args ) {
        try {
          theListener.apply( self, [self, theNotification, args].concat( arguments ) );
        }
        catch ( err ) {
          console.log( "ONCE Handler had an error", err );
        }
        self.removeListenerForNotification( theNotification, onceHandler );
      }, async );
    };
    /**
     * Removes a listener from a notification. If a notification has not been
     * registered (via `registerNotification`), an error is logged on the console
     * and the function returns without attaching the listener. This means if
     * you aren't watching the console, the function fails nearly silently.
     *
     * > By default, no notifications are registered.
     *
     * @method removeListenerForNotification
     * @alias off
     * @param {String} theNotification  the notification
     * @param {Function} theListener  The function or reference to remove
     */
    self.removeListenerForNotification = function removeListenerForNotification( theNotification, theListener ) {
      if ( theNotification instanceof Array ) {
        theNotification.forEach( function ( n ) {
          removeListenerForNotification( n, theListener );
        } );
        return self;
      }
      if ( typeof theNotification === "object" ) {
        for ( var n in theNotification ) {
          if ( theNotification.hasOwnProperty( n ) ) {
            self.removeListenerForNotification( n, theNotification[n] );
          }
        }
        return self;
      }
      if ( !self._notificationListeners[theNotification] ) {
        console.log( theNotification + " has not been registered." );
        return self;
      }
      var i = self._notificationListeners[theNotification].indexOf( theListener );
      if ( self._traceNotifications ) {
        console.log( "Removing listener " + theListener + " (index: " + i + ") from  notification " + theNotification );
      }
      if ( i > -1 ) {
        self._notificationListeners[theNotification].splice( i, 1 );
      }
      return self;
    };
    self.off = self.removeListenerForNotification;
    /**
     * Registers a notification so that listeners can then be attached. Notifications
     * should be registered as soon as possible, otherwise listeners may attempt to
     * attach to a notification that isn't registered.
     *
     * @method registerNotification
     * @param {String} theNotification  the name of the notification.
     * @param {Boolean} async  if true, notifications are sent wrapped in setTimeout
     */
    self.registerNotification = function ( theNotification, async ) {
      if ( typeof self._notificationListeners[theNotification] === "undefined" ) {
        self._notificationListeners[theNotification] = [];
        self._notificationListeners[theNotification]._useAsyncNotifications = ( typeof async !== "undefined" ? async :
                                                                                true );
      }
      if ( self._traceNotifications ) {
        console.log( "Registering notification " + theNotification );
      }
    };
    self._traceNotifications = false;

    function _doNotification( theNotification, options ) {
      var args,
        lastOnly = false;
      if ( typeof options !== "undefined" ) {
        args = ( typeof options.args !== "undefined" ) ? options.args : undefined;
        lastOnly = ( typeof options.lastOnly !== "undefined" ) ? options.lastOnly : false;
      }
      if ( !self._notificationListeners[theNotification] ) {
        console.log( theNotification + " has not been registered." );
        //return;
      }
      if ( self._traceNotifications ) {
        if ( self._notificationListeners[theNotification] ) {
          console.log( "Notifying " + self._notificationListeners[theNotification].length + " listeners for " +
                       theNotification + " ( " + args + " ) " );
        } else {
          console.log( "Can't notify any explicit listeners for ", theNotification, "but wildcards will fire." );
        }
      }
      var async = self._notificationListeners[theNotification] !== undefined ? self._notificationListeners[
          theNotification]._useAsyncNotifications : true,
        notifyListener = function ( theListener, theNotification, args ) {
          return function () {
            try {
              theListener.apply( self, [self, theNotification, args].concat( arguments ) );
            }
            catch ( err ) {
              console.log( "WARNING", theNotification, "experienced an uncaught error:", err );
            }
          };
        },
        handlers = self._notificationListeners[theNotification] !== undefined ? self._notificationListeners[
          theNotification].slice() : []; // copy!
      if ( lastOnly && handlers.length > 1 ) {
        handlers = [handlers.pop()];
      }
      // attach * handlers
      var handler, push = false;
      for ( var listener in self._notificationListeners ) {
        if ( self._notificationListeners.hasOwnProperty( listener ) ) {
          handler = self._notificationListeners[listener];
          push = false;
          if ( listener.indexOf( "*" ) > -1 ) {
            // candidate listener; see if it matches
            if ( listener === "*" ) {
              push = true;
            } else if ( listener.substr( 0, 1 ) === "*" && listener.substr( 1 ) === theNotification.substr( -1 * ( listener
                                                                                                                     .length - 1 ) ) ) {
              push = true;
            } else if ( listener.substr( -1, 1 ) === "*" && listener.substr( 0, listener.length - 1 ) === theNotification.substr(
                0, listener.length - 1 ) ) {
              push = true;
            } else {
              var starPos = listener.indexOf( "*" );
              if ( listener.substr( 0, starPos ) === theNotification.substr( 0, starPos ) && listener.substr( starPos + 1 ) ===
                                                                                             theNotification.substr( -1 * ( listener.length - starPos - 1 ) ) ) {
                push = true;
              }
            }
            if ( push ) {
              handler.forEach( function ( handler ) {
                handlers.push( handler );
              } );
            }
          }
        }
      }
      for ( var i = 0, l = handlers.length; i < l; i++ ) {
        if ( async ) {
          setTimeout( notifyListener( handlers[i], theNotification, args ), 0 );
        } else {
          ( notifyListener( handlers[i], theNotification, args ) )();
        }
      }
    }

    /**
     * Notifies all listeners of a particular notification that the notification
     * has been triggered. If the notification hasn't been registered via
     * `registerNotification`, an error is logged to the console, but the function
     * itself returns silently, so be sure to watch the console for errors.
     *
     * @method notify
     * @alias emit
     * @param {String} theNotification  the notification to trigger
     * @param {*} [args]  Arguments to pass to the listener; usually an array
     */
    self.notify = function ( theNotification, args ) {
      _doNotification( theNotification, {
        args:     args,
        lastOnly: false
      } );
    };
    self.emit = self.notify;
    /**
     *
     * Notifies only the most recent listener of a particular notification that
     * the notification has been triggered. If the notification hasn't been registered
     * via `registerNotification`, an error is logged to the console, but the function
     * itself returns silently.
     *
     * @method notifyMostRecent
     * @alias emitToLast
     * @param {String} theNotification  the specific notification to trigger
     * @param {*} [args]  Arguments to pass to the listener; usually an array
     */
    self.notifyMostRecent = function ( theNotification, args ) {
      _doNotification( theNotification, {
        args:     args,
        lastOnly: true
      } );
    };
    self.emitToLast = self.notifyMostRecent;
    /**
     *
     * Defines a property on the object. Essentially shorthand for `Object.defineProperty`. An
     * internal `_propertyName` variable is declared which getters and setters can access.
     *
     * The property can be read-write, read-only, or write-only depending on the values in
     * `propertyOptions.read` and `propertyOptions.write`. The default is read-write.
     *
     * Getters and setters can be provided in one of two ways: they can be automatically
     * discovered by following a specific naming pattern (`getPropertyName`) if
     * `propertyOptions.selfDiscover` is `true` (the default). They can also be explicitly
     * defined by setting `propertyOptions.get` and `propertyOptions.set`.
     *
     * A property does not necessarily need a getter or setter in order to be readable or
     * writable. A basic pattern of setting or returning the private variable is implemented
     * for any property without specific getters and setters but who have indicate that the
     * property is readable or writable.
     *
     * @example
     * ```
     * self.defineProperty ( "someProperty" );        // someProperty, read-write
     * self.defineProperty ( "anotherProperty", { default: 2 } );
     * self.setWidth = function ( newWidth, oldWidth )
     * {
       *    self._width = newWidth;
       *    self.element.style.width = newWidth + "px";
       * }
     * self.defineProperty ( "width" );   // automatically discovers setWidth as the setter.
     * ```
     *
     * @method defineProperty
     * @param {String} propertyName  the name of the property; use camelCase
     * @param {Object} propertyOptions  the various options as described above.
     */
    self.defineProperty = function ( propertyName, propertyOptions ) {
      var options = {
        default:         undefined,
        read:            true,
        write:           true,
        get:             null,
        set:             null,
        selfDiscover:    true,
        prefix:          "",
        configurable:    true,
        backingVariable: true
      };
      // private properties are handled differently -- we want to be able to search for
      // _getPrivateProperty, not get_privateProperty
      if ( propertyName.substr( 0, 1 ) === "_" ) {
        options.prefix = "_";
      }
      // allow other potential prefixes
      if ( options.prefix !== "" ) {
        if ( propertyName.substr( 0, 1 ) === options.prefix ) {
          propertyName = propertyName.substr( 1 );
        }
      }
      // merge our default options with the user options
      for ( var property in propertyOptions ) {
        if ( propertyOptions.hasOwnProperty( property ) ) {
          options[property] = propertyOptions[property];
        }
      }
      // Capital Camel Case our function names
      var fnName = propertyName.substr( 0, 1 ).toUpperCase() + propertyName.substr( 1 );
      var getFnName = options.prefix + "get" + fnName,
        setFnName = options.prefix + "set" + fnName,
        _propertyName = options.prefix + "_" + propertyName,
        _y_getFnName = options.prefix + "_y_get" + fnName,
        _y_setFnName = options.prefix + "_y_set" + fnName,
        _y__getFnName = options.prefix + "_y__get" + fnName,
        _y__setFnName = options.prefix + "_y__set" + fnName;
      // if get/set are not specified, we'll attempt to self-discover them
      if ( options.get === null && options.selfDiscover ) {
        if ( typeof self[getFnName] === "function" ) {
          options.get = self[getFnName];
        }
      }
      if ( options.set === null && options.selfDiscover ) {
        if ( typeof self[setFnName] === "function" ) {
          options.set = self[setFnName];
        }
      }
      // create the private variable
      if ( options.backingVariable ) {
        self[_propertyName] = options.default;
      }
      if ( !options.read && !options.write ) {
        return; // not read/write, so nothing more.
      }
      var defPropOptions = {
        configurable: options.configurable
      };
      if ( options.read ) {
        self[_y__getFnName] = options.get;
        self[_y_getFnName] = function () {
          // if there is a getter, use it
          if ( typeof self[_y__getFnName] === "function" ) {
            return self[_y__getFnName]( self[_propertyName] );
          }
          // otherwise return the private variable
          else {
            return self[_propertyName];
          }
        };
        if ( typeof self[getFnName] === "undefined" ) {
          self[getFnName] = self[_y_getFnName];
        }
        defPropOptions.get = self[_y_getFnName];
      }
      if ( options.write ) {
        self[_y__setFnName] = options.set;
        self[_y_setFnName] = function ( v ) {
          var oldV = self[_propertyName];
          if ( typeof self[_y__setFnName] === "function" ) {
            self[_y__setFnName]( v, oldV );
          } else {
            self[_propertyName] = v;
          }
          if ( oldV !== v ) {
            self.notifyDataBindingElementsForKeyPath( propertyName );
          }
        };
        if ( typeof self[setFnName] === "undefined" ) {
          self[setFnName] = self[_y_setFnName];
        }
        defPropOptions.set = self[_y_setFnName];
      }
      Object.defineProperty( self, propertyName, defPropOptions );
    };
    /**
     * Defines a custom property, which also implements a form of KVO.
     *
     * Any options not specified are defaulted in. The default is for a property
     * to be observable (which fires the default propertyNameChanged notice),
     * read/write with no custom get/set/validate routines, and no default.
     *
     * Observable Properties can have getters, setters, and validators. They can be
     * automatically discovered, assuming they follow the pattern `getObservablePropertyName`,
     * `setObservablePropertyName`, and `validateObservablePropertyName`. They can also be
     * specified explicitly by setting `propertyOptions.get`, `set`, and `validate`.
     *
     * Properties can be read-write, read-only, or write-only. This is controlled by
     * `propertyOptions.read` and `write`. The default is read-write.
     *
     * Properties can have a default value provided as well, specified by setting
     * `propertyOptions.default`.
     *
     * Finally, a notification of the form `propertyNameChanged` is fired if
     * the value changes. If the value does *not* change, the notification is not fired.
     * The name of the notification is controlled by setting `propertyOptions.notification`.
     * If you need a notification to fire when a property is simply set (regardless of the
     * change in value), set `propertyOptions.notifyAlways` to `true`.
     *
     * KVO getters, setters, and validators follow very different patterns than normal
     * property getters and setters.
     *
     * ```
     * self.getObservableWidth = function ( returnValue ) { return returnValue; };
     * self.setObservableWidth = function ( newValue, oldValue ) { return newValue; };
     * self.validateObservableWidth = function ( testValue ) { return testValue!==10; };
     * self.defineObservableProperty ( "width" );
     * ```
     *
     * @method defineObservableProperty
     * @param {String} propertyName The specific property to define
     * @param {Object} propertyOptions the options for this property.
     *
     */
    self.defineObservableProperty = function ( propertyName, propertyOptions ) {
      // set the default options and copy the specified options
      var origPropertyName = propertyName,
        options = {
          observable:   true,
          notification: propertyName + "Changed",
          default:      undefined,
          read:         true,
          write:        true,
          get:          null,
          validate:     null,
          set:          null,
          selfDiscover: true,
          notifyAlways: false,
          prefix:       "",
          configurable: true
        };
      // private properties are handled differently -- we want to be able to search for
      // _getPrivateProperty, not get_privateProperty
      if ( propertyName.substr( 0, 1 ) === "_" ) {
        options.prefix = "_";
      }
      // allow other potential prefixes
      if ( options.prefix !== "" ) {
        if ( propertyName.substr( 0, 1 ) === options.prefix ) {
          propertyName = propertyName.substr( 1 );
        }
      }
      var fnName = propertyName.substr( 0, 1 ).toUpperCase() + propertyName.substr( 1 );
      var getObservableFnName = options.prefix + "getObservable" + fnName,
        setObservableFnName = options.prefix + "setObservable" + fnName,
        validateObservableFnName = options.prefix + "validateObservable" + fnName,
        _y_propertyName = options.prefix + "_y_" + propertyName,
        _y_getFnName = options.prefix + "_y_get" + fnName,
        _y_setFnName = options.prefix + "_y_set" + fnName,
        _y_validateFnName = options.prefix + "_y_validate" + fnName,
        _y__getFnName = options.prefix + "_y__get" + fnName,
        _y__setFnName = options.prefix + "_y__set" + fnName,
        _y__validateFnName = options.prefix + "_y__validate" + fnName;
      for ( var property in propertyOptions ) {
        if ( propertyOptions.hasOwnProperty( property ) ) {
          options[property] = propertyOptions[property];
        }
      }
      // if get/set are not specified, we'll attempt to self-discover them
      if ( options.get === null && options.selfDiscover ) {
        if ( typeof self[getObservableFnName] === "function" ) {
          options.get = self[getObservableFnName];
        }
      }
      if ( options.set === null && options.selfDiscover ) {
        if ( typeof self[setObservableFnName] === "function" ) {
          options.set = self[setObservableFnName];
        }
      }
      if ( options.validate === null && options.selfDiscover ) {
        if ( typeof self[validateObservableFnName] === "function" ) {
          options.validate = self[validateObservableFnName];
        }
      }
      // if the property is observable, register its notification
      if ( options.observable ) {
        self.registerNotification( options.notification );
      }
      // create the private variable; __ here to avoid self-defined _
      self[_y_propertyName] = options.default;
      if ( !options.read && !options.write ) {
        return; // not read/write, so nothing more.
      }
      var defPropOptions = {
        configurable: true
      };
      if ( options.read ) {
        self[_y__getFnName] = options.get;
        self[_y_getFnName] = function () {
          // if there is a getter, use it
          if ( typeof self[_y__getFnName] === "function" ) {
            return self[_y__getFnName]( self[_y_propertyName] );
          }
          // otherwise return the private variable
          else {
            return self[_y_propertyName];
          }
        };
        defPropOptions.get = self[_y_getFnName];
      }
      if ( options.write ) {
        self[_y__validateFnName] = options.validate;
        self[_y__setFnName] = options.set;
        self[_y_setFnName] = function ( v ) {
          var oldV = self[_y_propertyName],
            valid = true;
          if ( typeof self[_y__validateFnName] === "function" ) {
            valid = self[_y__validateFnName]( v );
          }
          if ( valid ) {
            if ( typeof self[_y__setFnName] === "function" ) {
              self[_y_propertyName] = self[_y__setFnName]( v, oldV );
            } else {
              self[_y_propertyName] = v;
            }
            if ( oldV !== v ) {
              self.notifyDataBindingElementsForKeyPath( propertyName );
            }
            if ( v !== oldV || options.notifyAlways ) {
              if ( options.observable ) {
                self.notify( options.notification, {
                  "new": v,
                  "old": oldV
                } );
              }
            }
          }
        };
        defPropOptions.set = self[_y_setFnName];
      }
      Object.defineProperty( self, origPropertyName, defPropOptions );
    };
    /*
     * data binding support
     */
    self._dataBindings = {};
    self._dataBindingTypes = {};
    //self._dataBindingEvents = [ "input", "change", "keyup", "blur" ];
    self._dataBindingEvents = ["input", "change", "blur"];
    /**
     * Configure a data binding to an HTML element (el) for
     * a particular property (keyPath). Returns self for chaining.
     *
     * @method dataBindOn
     * @param  {Node}   el      the DOM element to bind to; must support the change event, and must have an ID
     * @param  {string} keyPath the property to observe (shallow only; doesn't follow dots.)
     * @return {*}              self; chain away!
     */
    self.dataBindOn = function dataBindOn( el, keyPath, keyType ) {
      if ( self._dataBindings[keyPath] === undefined ) {
        self._dataBindings[keyPath] = [];
      }
      self._dataBindings[keyPath].push( el );
      self._dataBindingTypes[keyPath] = keyType;
      el.setAttribute( "data-y-keyPath", keyPath );
      el.setAttribute( "data-y-keyType", ( keyType !== undefined ? keyType : "string" ) );
      self._dataBindingEvents.forEach( function ( evt ) {
        el.addEventListener( evt, self.updatePropertyForKeyPath, false );
      } );
      return self;
    };
    /**
     * Turn off data binding for a particular element and
     * keypath.
     *
     * @method dataBindOff
     * @param  {Node}   el      element to remove data binding from
     * @param  {string} keyPath keypath to stop observing
     * @return {*}              self; chain away!
     */
    self.dataBindOff = function dataBindOff( el, keyPath ) {
      var keyPathEls = self._dataBindings[keyPath],
        elPos;
      if ( keyPathEls !== undefined ) {
        elPos = keyPathEls.indexOf( el );
        if ( elPos > -1 ) {
          keyPathEls.splice( elPos, 1 );
          el.removeAttribute( "data-y-keyPath" );
          el.removeAttribute( "data-y-keyType" );
          self._dataBindingEvents.forEach( function ( evt ) {
            el.removeEventListener( evt, self.updatePropertyForKeyPath );
          } );
        }
      }
      return self;
    };
    /**
     * Remove all data bindings for a given property
     *
     * @method dataBindAllOffForKeyPath
     * @param  {String} keyPath keypath to stop observing
     * @return {*}              self; chain away
     */
    self.dataBindAllOffForKeyPath = function dataBindAllOffForKeyPath( keyPath ) {
      var keyPathEls = self._dataBindings[keyPath];
      if ( keyPathEls !== undefined ) {
        keyPathEls.forEach( function ( el ) {
          el.removeAttribute( "data-y-keyPath" );
          el.removeAttribute( "data-y-keyType" );
          self._dataBindingEvents.forEach( function ( evt ) {
            el.removeEventListener( evt, self.updatePropertyForKeyPath );
          } );
        } );
        keyPathEls = [];
      }
      return self;
    };
    /**
     * Remove all data bindings for this object
     *
     * @method dataBindAllOff
     * @return {*}  self
     */
    self.dataBindAllOff = function dataBindAllOff() {
      for ( var keyPath in self._dataBindings ) {
        if ( self._dataBindings.hasOwnProperty( keyPath ) ) {
          self.dataBindAllOffForKeyPath( keyPath );
        }
      }
    };
    /**
     * Update a property on this object based on the
     * keyPath and value. If called as an event handler, `this` refers to the
     * triggering element, and keyPath is on `data-y-keyPath` attribute.
     *
     * @method updatePropertyForKeyPath
     * @param  {String} keyPath property to set
     * @param  {*} value        value to set
     */
    self.updatePropertyForKeyPath = function updatePropertyForKeyPath( inKeyPath, inValue, inKeyType ) {
      var keyType = inKeyType,
        keyPath = inKeyPath,
        dataValue = inValue,
        elType;
      try {
        if ( this !== self && this instanceof Node ) {
          // we've been called from an event handler
          if ( this.getAttribute( "data-y-keyType" ) !== undefined ) {
            keyType = this.getAttribute( "data-y-keyType" );
          }
          keyPath = this.getAttribute( "data-y-keyPath" );
          elType = this.getAttribute( "type" );
          dataValue = this.value;
          switch ( keyType ) {
            case "integer":
              self[keyPath] = ( dataValue === "" ) ? null : parseInt( dataValue, 10 );
              break;
            case "float":
              self[keyPath] = ( dataValue === "" ) ? null : parseFloat( dataValue );
              break;
            case "boolean":
              if ( this.checked !== undefined ) {
                self[keyPath] = this.checked;
              } else {
                self[keyPath] = ( "" + dataValue ) === "1" || dataValue.toLowerCase() === "true"
              }
              break;
            case "date":
              if ( this.type === "text" ) {
                try {
                  console.log( "trying to pull date from ", this.value );
                  self[keyPath] = new Date( this.value )
                }
                catch ( err ) {
                  console.log( "nope; set to null" );
                  self[keyPath] = null;
                }
              } else {
                self[keyPath] = this.valueAsDate;
              }
              break;
            default:
              self[keyPath] = dataValue;
          }
          return;
        }
        if ( keyType === undefined ) {
          keyType = self._dataBindingTypes[keyPath];
        }
        switch ( keyType ) {
          case "integer":
            self[keyPath] = parseInt( dataValue, 10 );
            break;
          case "float":
            self[keyPath] = parseFloat( dataValue );
            break;
          case "boolean":
            if ( dataValue === "1" || dataValue === 1 || dataValue.toLowerCase() === "true" || dataValue === true ) {
              self[keyPath] = true;
            } else {
              self[keyPath] = false;
            }
            break;
          case "date":
            self[keyPath] = new Date( dataValue );
            break;
          default:
            self[keyPath] = dataValue;
        }
      }
      catch ( err ) {
        console.log( "Failed to update", keyPath, "with", dataValue, "and", keyType, err, this, arguments );
      }
    };
    /**
     * notify all elements attached to a
     * key path that the source value has changed. Called by all properties created
     * with defineProperty and defineObservableProperty.
     *
     * @method @notifyDataBindingElementsForKeyPath
     * @param  {String} keyPath keypath of elements to notify
     */
    self.notifyDataBindingElementsForKeyPath = function notifyDataBindingElementsForKeyPath( keyPath ) {
      try {
        var keyPathEls = self._dataBindings[keyPath],
          keyType = self._dataBindingTypes[keyPath],
          el, v, elType, t, cursorPos, selectionPos;
        if ( keyType === undefined ) {
          keyType = "string";
        }
        v = self[keyPath];
        if ( v === undefined || v === null ) {
          v = "";
        }
        if ( keyPathEls !== undefined ) {
          for ( var i = 0, l = keyPathEls.length; i < l; i++ ) {
            el = keyPathEls[i];
            try {
              if ( typeof el.selectionStart === "number" ) {
                cursorPos = el.selectionStart;
                selectionPos = el.selectionEnd;
              } else {
                cursorPos = -1;
                selectionPos = -1;
              }
            }
            catch ( err ) {
              cursorPos = -1;
              selectionPos = -1;
            }
            elType = el.getAttribute( "type" );
            if ( elType === "date" ) {
              if ( el.type !== elType ) {
                // problem; we almost certainly have a field that doesn't understand valueAsDate
                if ( v.toISOString ) {
                  t = v.toISOString().split( "T" )[0];
                  console.log( "trying to set value to  ", t );
                  if ( el.value !== t ) {
                    console.log( "doing it  ", t );
                    el.value = t;
                  }
                } else {
                  throw new Error( "v is an unexpected type: " + typeof v + "; " + v );
                }
              } else {
                if ( el.valueAsDate !== v ) {
                  el.valueAsDate = v;
                }
              }
            } else if ( el.type === "checkbox" ) {
              el.indeterminate = ( v === undefined || v === null );
              if ( el.checked !== v ) {
                el.checked = v;
              }
            } else if ( typeof el.value !== "undefined" ) {
              if ( el.value != v || (v !== "" && el.value === "") ) {
                el.value = v;
              }
              el.setAttribute("value", v);
            } else if ( typeof el.textContent !== "undefined" ) {
              if ( el.textContent != v || (v !== "" && el.textContent !== "") ) {
                el.textContent = v;
              }
            } else if ( typeof el.innerText !== "undefined" ) {
              if ( el.innerText != v || (v !== "" && el.innerText !== "") ) {
                el.innerText = v;
              }
            } else {
              console.log( "Data bind failure; browser doesn't understand value, textContent, or innerText." );
            }
            if ( cursorPos > -1 && document.activeElement === el ) {
              el.selectionStart = cursorPos;
              el.selectionEnd = selectionPos;
            }
          }
        }
      }
      catch ( err ) {
        console.log( "Failed to update elements for ", keyPath, err, arguments );
      }
    };
    /**
     * Auto initializes the object based on the arguments passed to the object constructor. Any object
     * that desires to be auto-initializable must perform the following prior to returning themselves:
     *
     * ```
     * self._autoInit.apply (self, arguments);
     * ```
     *
     * Each init must call the super of init, and each init must return self.
     *
     * If the first parameter to _autoInit (and thus to the object constructor) is an object,
     * initWithOptions is called if it exists. Otherwise init is called with all the arguments.
     *
     * If NO arguments are passed to the constructor (and thus to this method), then no
     * auto initialization is performed. If one desires an auto-init on an object that requires
     * no parameters, pass a dummy parameter to ensure init will be called
     *
     * @method _autoInit
     * @returns {*}
     */
    self._autoInit = function () {
      if ( arguments.length > 0 ) {
        if ( arguments.length === 1 ) {
          // chances are this is an initWithOptions, but make sure the incoming parameter is an object
          if ( typeof arguments[0] === "object" ) {
            if ( typeof self.initWithOptions !== "undefined" ) {
              return self.initWithOptions.apply( self, arguments );
            } else {
              return self.init.apply( self, arguments );
            }
          } else {
            return self.init.apply( self, arguments );
          }
        } else {
          return self.init.apply( self, arguments );
        }
      }
    };
    /**
     *
     * Readies an object to be destroyed. The base object only clears the notifications and
     * the attached listeners.
     * @method destroy
     */
    self.destroy = function () {
      // clear data bindings
      self.dataBindAllOff();
      // clear any listeners.
      self._notificationListeners = {};
      self._tagListeners = {};
      self._constructObjectCategories( BaseObject.ON_DESTROY_CATEGORY );
      // ready to be destroyed
    };
    // self-categorize
    self._constructObjectCategories();
    // call auto init
    self._autoInit.apply( self, arguments );
    // done
    return self;
  };
/**
 * Promotes a non-BaseObject into a BaseObject by copying all its methods to
 * the new object and copying all its properties as observable properties.
 *
 * @method promote
 * @param  {*} nonBaseObject The non-BaseObject to promote
 * @return {BaseObject}               BaseObject
 */
BaseObject.promote = function promote( nonBaseObject ) {
  var newBaseObject, theProp;
  if ( nonBaseObject !== undefined ) {
    newBaseObject = new BaseObject();
    for ( var prop in nonBaseObject ) {
      if ( nonBaseObject.hasOwnProperty( prop ) ) {
        theProp = nonBaseObject[prop];
        if ( typeof theProp === "function" ) {
          newBaseObject[prop] = theProp;
        } else {
          newBaseObject.defineObservableProperty( prop, {
            default: theProp
          } );
        }
      }
    }
  }
  return newBaseObject;
};
/**
 * Object categories. Of the form:
 *
 * ```
 * { className: [ constructor1, constructor2, ... ], ... }
 * ```
 *
 * Global to the app and library. BaseObject's init() method will call each category in the class hierarchy.
 *
 * @property _objectCategories
 * @type {{}}
 * @private
 */
BaseObject._objectCategories = [{}, {}, {}];
BaseObject.ON_CREATE_CATEGORY = 0;
BaseObject.ON_INIT_CATEGORY = 1;
BaseObject.ON_DESTROY_CATEGORY = 2;
/**
 * Register a category constructor for a specific class. The function must take `self` as a parameter, and must
 * not assume the presence of any other category
 *
 * The options parameter takes the form:
 *
 * ```
 * { class: class name to register for
   *   method: constructor method
   *   priority: ON_CREATE_CATEGORY or ON_INIT_CATEGORY
   * }
 * ```
 *
 * @method registerCategoryConstructor
 * @param {Object} options
 */
BaseObject.registerCategoryConstructor = function registerCategoryConstructor( options ) {
  if ( typeof options === "undefined" ) {
    throw new Error( "registerCategoryConstructor requires a class name and a constructor method." );
  }
  if ( typeof options.class !== "undefined" ) {
    throw new Error( "registerCategoryConstructor requires options.class" );
  }
  if ( typeof options.method !== "undefined" ) {
    throw new Error( "registerCategoryConstructor requires options.method" );
  }
  var className = options.class;
  var method = options.method;
  var priority = BaseObject.ON_CREATE_CATEGORY;
  if ( typeof options.priority !== "undefined" ) {
    priority = options.priority;
  }
  if ( typeof BaseObject._objectCategories[priority][className] === "undefined" ) {
    BaseObject._objectCategories[priority][className] = [];
  }
  BaseObject._objectCategories[priority][className].push( method );
};
/**
 * Extend (subclass) an object. `o` should be of the form:
 *
 * {
   *   className: "NewClass",
   *   properties: [],
   *   observableProperties: [],
   *   methods: [],
   *   overrides: []
   * }
 *
 * @method   extend
 *
 * @param    {[type]}   classObject   [description]
 * @param    {[type]}   o             [description]
 *
 * @return   {[type]}                 [description]
 */
BaseObject.extend = function extend( classObject, o ) {
  return function () {};
};
BaseObject.meta = {
  version:           "00.05.101",
  class:             _className,
  autoInitializable: true,
  categorizable:     true
};
module.exports = BaseObject;

},{}],20:[function(require,module,exports){
/**
 *
 * # simple routing
 *
 * @module router.js
 * @author Kerri Shotts
 * @version 0.1
 *
 * Simple example:
 * ```
 * var y = function (v,s,r,t,u) { console.log(v,s,r,t,u); }, router = _y.Router;
 * router.addURL ( "/", "Home" )
 * .addURL ( "/task", "Task List" )
 * .addURL ( "/task/:taskId", "Task View" )
 * .addHandler ( "/", y )
 * .addHandler ( "/task", y )
 * .addHandler ( "/task/:taskId", y )
 * .replace( "/", 1)
 * .listen();
 * ```
 *
 * ```
 * Copyright (c) 2014 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */
/*global module, Node, document, history, window, console*/
"use strict";
var routes = [];
/**
 * Parses a URL into its constituent parts. The return value
 * is an object containing the path, the query, and the hash components.
 * Each of those is also split up into parts -- path and hash separated
 * by slashes, while query is separated by ampersands. If hash is empty
 * this routine treates it as a "#/" unlese `parseHash` is `false`.
 * The `baseURL` is also removed from the path; if not specified it
 * defaults to `/`.
 *
 * @method parseURL
 * @param  {String}  url        url to parse
 * @param  {String}  baseURL    optional base url, defaults to "/"
 * @param  {Boolean} parseHash  optional, indicates if hash should be parsed with slashes
 * @return {*}                  component pieces
 */
function parseURL( url, baseURL, parseHash ) {
  if ( baseURL === undefined ) {
    baseURL = "/";
  }
  if ( parseHash === undefined ) {
    parseHash = true;
  }
  var a = document.createElement( "a" ),
    pathString,
    queryString,
    hashString,
    queryParts, pathParts, hashParts;
  // parse the url
  a.href = url;
  pathString = decodeURIComponent( a.pathname );
  queryString = decodeURIComponent( a.search );
  hashString = decodeURIComponent( a.hash );
  if ( hashString === "" && parseHash ) {
    hashString = "#/";
  }
  // remove the base url
  if ( pathString.substr( 0, baseURL.length ) === baseURL ) {
    pathString = pathString.substr( baseURL.length );
  }
  // don't need the ? or # on the query/hash string
  queryString = queryString.substr( 1 );
  hashString = hashString.substr( 1 );
  // split the query string
  queryParts = queryString.split( "&" );
  // and split the href
  pathParts = pathString.split( "/" );
  // split the hash, too
  if ( parseHash ) {
    hashParts = hashString.split( "/" );
  }
  return {
    path:       pathString,
    query:      queryString,
    hash:       hashString,
    queryParts: queryParts,
    pathParts:  pathParts,
    hashParts:  hashParts
  };
}
/**
 * Determines if a route matches, and if it does, copies
 * any variables out into `vars`. The routes must have been previously
 * parsed with parseURL.
 *
 * @method routeMatches
 * @param  {type} candidate candidate URL
 * @param  {type} template  template to check (variables of the form :someId)
 * @param  {type} vars      byref: this object will receive any variables
 * @return {*}              if matches, true.
 */
function routeMatches( candidate, template, vars ) {
  // routes must have the same number of parts
  if ( candidate.hashParts.length !== template.hashParts.length ) {
    return false;
  }
  var cp, tp;
  for ( var i = 0, l = candidate.hashParts.length; i < l; i++ ) {
    // each part needs to match exactly, OR it needs to start with a ":" to denote a variable
    cp = candidate.hashParts[i];
    tp = template.hashParts[i];
    if ( tp.substr( 0, 1 ) === ":" && tp.length > 1 ) {
      // variable
      vars[tp.substr( 1 )] = cp; // return the variable to the caller
    } else if ( cp !== tp ) {
      return false;
    }
  }
  return true;
}
var Router = {
  VERSION:        "0.1.100",
  baseURL:        "/", // not currently used
  /**
   * registers a URL and an associated title
   *
   * @method addURL
   * @param  {string} url   url to register
   * @param  {string} title associated title (not visible anywhere)
   * @return {*}            self
   */
  addURL:         function addURL( url, title ) {
    if ( routes[url] === undefined ) {
      routes[url] = [];
    }
    routes[url].title = title;
    return this;
  },
  /**
   * Adds a handler to the associated URL. Handlers
   * should be of the form `function( vars, state, url, title, parsedURL )`
   * where `vars` contains the variables in the URL, `state` contains any
   * state passed to history, `url` is the matched URL, `title` is the
   * title of the URL, and `parsedURL` contains the actual URL components.
   *
   * @method addHandler
   * @param  {string} url       url to register the handler for
   * @param  {function} handler handler to call
   * @return {*}                self
   */
  addHandler:     function addHandler( url, handler ) {
    routes[url].push( handler );
    return this;
  },
  /**
   * Removes a handler from the specified url
   *
   * @method removeHandler
   * @param  {string}   url     url
   * @param  {function} handler handler to remove
   * @return {*}        self
   */
  removeHandler:  function removeHandler( url, handler ) {
    var handlers = routes[url],
      handlerIndex;
    if ( handlers !== undefined ) {
      handlerIndex = handlers.indexOf( handler );
      if ( handlerIndex > -1 ) {
        handlers.splice( handlerIndex, 1 );
      }
    }
    return this;
  },
  /**
   * Parses a URL into its constituent parts. The return value
   * is an object containing the path, the query, and the hash components.
   * Each of those is also split up into parts -- path and hash separated
   * by slashes, while query is separated by ampersands. If hash is empty
   * this routine treates it as a "#/" unlese `parseHash` is `false`.
   * The `baseURL` is also removed from the path; if not specified it
   * defaults to `/`.
   *
   * @method parseURL
   * @param  {String}  url        url to parse
   * @param  {String}  baseURL    optional base url, defaults to "/"
   * @param  {Boolean} parseHash  optional, indicates if hash should be parsed with slashes
   * @return {*}                  component pieces
   */
  parseURL:       parseURL,
  /**
   * Given a url and state, process the url handlers that
   * are associated with the given url. Does not affect history in any way,
   * so can be used to call handler without actually navigating (most useful
   * during testing).
   *
   * @method processRoute
   * @param  {string} url   url to process
   * @param  {*} state      state to pass (can be anything or nothing)
   */
  processRoute:   function processRoute( url, state ) {
    if ( url === undefined ) {
      url = window.location.href;
    }
    var parsedURL = parseURL( url ),
      templateURL, handlers, vars, title;
    for ( url in routes ) {
      if ( routes.hasOwnProperty( url ) ) {
        templateURL = parseURL( "#" + url );
        handlers = routes[url];
        title = handlers.title;
        vars = {};
        if ( routeMatches( parsedURL, templateURL, vars ) ) {
          handlers.forEach( function ( handler ) {
            try {
              handler( vars, state, url, title, parsedURL );
            }
            catch ( err ) {
              console.log( "WARNING! Failed to process a route for", url );
            }
          } );
        }
      }
    }
  },
  /**
   * private route listener; calls `processRoute` with
   * the event state retrieved when the history is popped.
   * @method _routeListener
   * @private
   */
  _routeListener: function _routeListener( e ) {
    Router.processRoute( window.location.href, e.state );
  },
  /**
   * Check the current URL and call any associated handlers
   *
   * @method check
   * @return {*} self
   */
  check:          function check() {
    this.processRoute( window.location.href );
    return this;
  },
  /**
   * Indicates if the router is listening to history changes.
   * @property listening
   * @type boolean
   * @default false
   */
  listening:      false,
  /**
   * Start listening for history changes
   * @method listen
   */
  listen:         function listen() {
    if ( this.listening ) {
      return;
    }
    this.listening = true;
    window.addEventListener( "popstate", this._routeListener, false );
  },
  /**
   * Stop listening for history changes
   *
   * @method stopListening
   * @return {type}  description
   */
  stopListening:  function stopListening() {
    if ( !this.listening ) {
      return;
    }
    window.removeEventListener( "popstate", this._routeListener );
  },
  /**
   * Navigate to a url with a given state, calling handlers
   *
   * @method go
   * @param  {string} url   url
   * @param  {*} state      state to store for this URL, can be anything
   * @return {*}            self
   */
  go:             function go( url, state ) {
    history.pushState( state, null, "#" + encodeURIComponent( url ) );
    return this.check();
  },
  /**
   * Navigate to url with a given state, replacing history
   * and calling handlers. Should be called initially with "/" and
   * any initial state should you want to receive a state value when
   * navigating back from a future page
   *
   * @method replace
   * @param  {string} url   url
   * @param  {*} state      state to store for this URL, can be anything
   * @return {*}            self
   */
  replace:        function replace( url, state ) {
    history.replaceState( state, null, "#" + encodeURIComponent( url ) );
    return this.check();
  },
  /**
   * Navigates back in history
   *
   * @method back
   * @param  {number} n number of pages to navigate back, optional (1 is default)
   */
  back:           function back( n ) {
    history.back( n );
    if ( !this.listening ) {
      this.processRoute( window.location.href, history.state );
    }
  }
};
module.exports = Router;

},{}],21:[function(require,module,exports){
/**
 *
 * # h - simple DOM templating
 *
 * @module h.js
 * @author Kerri Shotts
 * @version 0.1
 *
 * ```
 * Copyright (c) 2014 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 *
 * Generates a DOM tree (or just a single node) based on a series of method calls
 * into **h**. **h** has one root method (`el`) that creates all DOM elements, but also has
 * helper methods for each HTML tag. This means that a UL can be created simply by
 * calling `h.ul`.
 *
 * Technically there's no such thing as a template using this library, but functions
 * encapsulating a series of h calls function as an equivalent if properly decoupled
 * from their surrounds.
 *
 * Templates are essentially methods attached to the DOM using `h.renderTo(templateFn(context,...))`
 * and return DOM node elements or arrays. For example:
 *
 * ```
 * function aTemplate ( context ) {
 *   return h.div (
 *     [ h.span ( context.title ), h.span ( context.description ) ]
 *   );
 * };
 * ```
 *
 * The resulting DOM tree looks like this (assuming `context` is defined as
 * `{title: "Title", description: "Description"}`:
 *
 * ```
 * <div>
 *   <span>Title</span>
 *   <span>Description</span>
 * </div>
 * ```
 *
 * Template results are added to the DOM using `h.renderTo`:
 *
 * ```
 * h.renderTo ( aDOMElement, aTemplate ( context ) );
 * ```
 *
 * Technically `appendChild` could be used, but it's possible that an attribute
 * might just return an array of DOM nodes, in which case `appendChild` fails.
 *
 * There are also a variety of utility methods defined in **h**, such as:
 * - `forEach ( arr, fn )` -- this executes `arr.map(fn)`.
 * - `forIn ( object, fn )` -- iterates over each property owned by `object` and calls `fn`
 * - `ifdef ( expr, a, b )` -- determines if `expr` is defined, and if so, returns `a`, otherwise `b`
 * - `iif ( expr, a, b )` -- returns `a` if `expr` evaluates to true, otherwise `b`
 *
 * When constructing Node elements using `h`, it's important to recognize that an underlying
 * function called `el` is being called (and can be called directly). The order parameters here is
 * somewhat malleable - only the first parameter must be the tag name (when using `el`). Otherwise,
 * the options for the tag must be within the first three parameters. The text content or value content
 * for the tag must be in the same first three parameters. For example:
 *
 * ```
 * return h.el("div", { attrs: { id: "anElement" } }, "Text content");
 * ```
 *
 * is equivalent to:
 *
 * ```
 * return h.el("div", "Text Content", { attrs: { id: "anElement" } } );
 * ```
 *
 * which is also in turn equivalent to:
 *
 * ```
 * return h.div("Text Content", { attrs: { id: "anElement" } } );
 * ```
 *
 * If an object has both text and value content (like buttons), the first string or number is used
 * as the `value` and the second is used as `textContent`:
 *
 * ```
 * return h.button("This goes into value attribute", "This is in textContent");
 * ```
 *
 * So why `el` and `h.div` equivalents? If you need to specify a custom tag OR want to use shorthand
 * you'll want to use `el`. If you don't need to specify shorthand properties, use the easier-to-read
 * `h.tagName`. For example:
 *
 * ```
 * return h.p ( "paragraph content" );
 * return h.el ( "p", "paragraph content" );
 *
 * return h.el ( "input#txtUsername.bigField?type=text&size=20", "starting value" );
 * return h.input ( { attrs: { type: "text", size: "20", class: "bigField", id: "txtUserName" } },
 *                  "starting value" );
 * ```
 *
 * When specifying tag options, you have several options that can be specified:
 * * attributes using `attrs` object
 * * styles using `styles` object
 * * event handlers using `on` object
 * * hammer handlers using `hammer` object
 * * data binding using `bind` object
 * * store element references to a container object using `storeTo` object
 *
 *
 */
/*global module, Node, document, require*/
"use strict";
var parseTag      = require("./lib/parseTag"),
    onEachDefined = require("./lib/onEachDefined");

var globalEvents = {},
    renderEvents = {};
var globalSequence = 0;

/**
 *
 * internal private method to handle parsing children
 * and attaching them to their parents
 *
 * If the child is a `Node`, it is attached directly to the parent as a child
 * If the child is a `function`, the *results* are re-parsed, ultimately to be attached to the parent
 *   as children
 * If the child is an `Array`, each element within the array is re-parsed, ultimately to be attached
 *   to the parent as children
 *
 * @method appendChildToParent
 * @private
 * @param {Array|Function|Node} child       child to handle and attach
 * @param {Node} parent                     parent
 *
 */
function appendChildToParent(child, parent) {
    if (typeof child === "object") {
        if (child instanceof Array) {
            for (var i = 0, l = child.length; i < l; i++) {
                appendChildToParent(child[i], parent);
            }
        }
        if (child instanceof Node) {
            parent.appendChild(child);
        }
    }
    if (typeof child === "function") {
        appendChildToParent(child(), parent);
    }
}


function getAndSetElementId(e) {
    var id = e.getAttribute("id");
    if (id === undefined || id === null) {
        globalSequence++;
        id = "h-y-" + globalSequence;
        e.setAttribute("id", id);
    }
    return id;
}


function transform(parent, nodeA, nodeB) {
    var hasChildren = [false, false],
        childNodes = [[], []],
        _A = 0,
        _B = 1,
        i, l,
        len = [0, 0],
        nodes = [nodeA, nodeB],
        attrs = [[], []],
        styles = [{}, {}],
        styleKeys = [[], []],
        elid = [null, null];
    if (!nodeA && !nodeB) {
        // nothing to do.
        return;
    }
    if (!nodeA && nodeB) {
        // there's no corresponding element in A; just add B.
        parent.appendChild(nodeB);
        return;
    }
    if (nodeA && !nodeB) {
        // there's no corresponding element in B; remove A's element
        nodeA.remove();
        return;
    }
    if (( nodeA.nodeType !== nodeB.nodeType ) || ( nodeB.nodeType !== 1 )) {
        // if the node types are different, there's no reason to transform tree A -- just replace the whole thing
        parent.replaceChild(nodeB, nodeA);
        return;
    }
    if (nodeB.classList) {
        if (!nodeB.classList.contains("ui-container") && !nodeB.classList.contains("ui-list") && !nodeB.classList.contains("ui-scroll-container")) {
            // if the node types are different, there's no reason to transform tree A -- just replace the whole thing
            parent.replaceChild(nodeB, nodeA);
            return;
        }
    }
    // set up for transforming this node
    nodes.forEach(
        /**
         * @param {{getAttribute: function, childNodes: Array<Node>, attributes: object, styles: object}} node
         * @param {number} idx
         */
        function init(node, idx) {
        hasChildren[idx] = node.hasChildNodes();
        len[idx] = node.childNodes.length;
        if (node.getAttribute) {
            elid[idx] = node.getAttribute("id");
        }
        if (node.childNodes) {
            childNodes[idx] = [].slice.call(node.childNodes, 0);
        }
        if (node.attributes) {
            attrs[idx] = [].slice.call(node.attributes, 0);
        }
        if (node.styles) {
            styles[idx] = node.style;
            styleKeys[idx] = Object.keys(styles[idx]);
        }
    });
    // transform all our children
    for (i = 0, l = Math.max(len[_A], len[_B]); i < l; i++) {
        transform(nodeA, childNodes[_A][i], childNodes[_B][i]);
    }
    // copy attributes
    for (i = 0, l = Math.max(attrs[_A].length, attrs[_B].length); i < l; i++) {
        if (attrs[_A][i]) {
            if (!nodeB.hasAttribute(attrs[_A][i].name)) {
                // remove any attributes that aren't present in B
                nodeA.removeAttribute(attrs[_A][i].name);
            }
        }
        if (attrs[_B][i]) {
            nodeA.setAttribute(attrs[_B][i].name, attrs[_B][i].value);
        }
    }
    // copy styles
    for (i = 0, l = Math.max(styles[_A].length, styles[_B].length); i < l; i++) {
        if (styles[_A][i]) {
            if (!( styleKeys[_B][i] in styleKeys[_A] )) {
                // remove any styles that aren't present in B
                nodeA.style[styleKeys[_B][i]] = null;
            }
        }
        if (styles[_B][i]) {
            nodeA.style[styleKeys[_B][i]] = styles[_B][styleKeys[_B][i]];
        }
    }
    // copy events... I wish.
}

/**
 * h templating engine
 */
var h = {
    VERSION:       "0.1.100",
    useDomMerging: false,
    debug:         false,
    Hammer:        null,
    BaseObject:    null,
    _globalEvents: globalEvents,
    _renderEvents: renderEvents,
    /* experimental! */

    /**
     * @typedef {{object:object, keyPath:string, [keyType]:string }} bindObj
     * @typedef {{object:object, keyPath:string, [idOnly]:boolean }} storeObj
     * @typedef {{handler:function, [capture]:boolean }} onObj
     * @typedef {{handler:function, [options]:object }} hammerObj
     * @typedef {{[attrs]:object, [styles]:object, [on]:object<function|onObj>, [hammer]:object<function|hammerObj>, [bind]:bindObj, [store]:storeObj}} tagOpts
     */
    /**
     * Returns a DOM tree containing the requested element and any further child
     * elements (as extra parameters)
     *
     * `tagOptions` should be an object consisting of the following optional segments:
     *
     * ```
     * {
       *    attrs: {...}                     attributes to add to the element
       *    styles: {...}                    style attributes to add to the element
       *    on: {...}                        event handlers to attach to the element
       *    hammer: {...}                    hammer handlers
       *    bind: { object:, keyPath:, keyType: }      data binding
       *    store: { object:, keyPath:, idOnly: }     store element to object.keyPath
       * }
     * ```
     *
     * @method el
     * @param {string} tag                       tag of the form `tagName.class#id` or `tagName#id.class`
     *                                           tag can also specify attributes:
     *                                              `input?type=text&size=20`
     * @param {tagOpts} tagOptions               options for the tag (see above)
     * @param {...(Array|Function|String)} args  children that should be attached
     * @returns {Node}                           DOM tree
     *
     */
    el:            function (tag /*, tagOptions, args */) {
        var e, i, l, f,
            options,
            content = [],
            contentTarget = [],
            tagParts = parseTag(tag),
            elid;

        // parse tag; it should be of the form `tag[#id][.class][?attr=value[&attr=value...]`
        // create the element; if `@DF` is used, a document fragment is used instead
        if (tagParts.tag !== "@DF") {
            e = document.createElement(tagParts.tag);
        } else {
            e = document.createDocumentFragment();
        }
        // attach the `class` and `id` from the tag name, if available
        if (tagParts.class !== undefined) {
            e.className = tagParts.class;
        }
        if (tagParts.id !== undefined) {
            elid = tagParts.id;
            e.setAttribute("id", tagParts.id);
        }
        // get the arguments as an array, ignoring the first parameter
        var args = Array.prototype.slice.call(arguments, 1);
        // determine what we've passed in the second/third parameter
        // if it is an object (but not a node or array), it's a list of
        // options to attach to the element. If it is a string, it's text
        // content that should be added using `textContent` or `value`
        // > we could parse the entire argument list, but that would
        // > a bit absurd.
        for (i = 0; i < 3; i++) {
            if (typeof args[0] !== "undefined") {
                if (typeof args[0] === "object") {
                    // could be a DOM node, an array, or tag options
                    if (!( args[0] instanceof Node ) && !( args[0] instanceof Array )) {
                        options = args.shift();
                    }
                }
                if (typeof args[0] === "string" || typeof args[0] === "number") {
                    // this is text content
                    content.push(args.shift());
                }
            }
        }
        // copy over any `queryParts` attributes
        onEachDefined(tagParts.queryParts, function (v) {
            var arr = v.split("=");
            if (arr.length === 2) {
                e.setAttribute(arr[0].trim(), arr[1].trim());
            } else {
                // an attr with no = will be treated as readonly = readonly
                e.setAttribute(arr[0].trim(), arr[0].trim());
            }
        });

        if (typeof options === "object" && options !== null) {
            // add attributes
            onEachDefined(options, "attrs", function (v, p) {
                e.setAttribute(p, v);
            });
            // add styles
            onEachDefined(options, "styles", function (v, p) {
                e.style[p] = v;
            });
            // add event handlers; handler property is expected to be a valid DOM
            // event, i.e. `{ "change": function... }` or `{ change: function... }`
            // if the handler is an object, it must be of the form
            // ```
            //   { handler: function, capture: true/false }
            // ```
            onEachDefined(options, "on",
                /**
                 * @param {function|{handler:function, [capture]:boolean}} v
                 * @param {string} p
                 */
                function (v, p) {
                    if (typeof v === "function") {
                        f = v.bind(e);
                        e.addEventListener(p, f, false);
                    } else {
                        f = v.handler.bind(e);
                        e.addEventListener(p, f, typeof v.capture !== "undefined" ? v.capture : false);
                    }
                });
            // we support hammer too, assuming we're given a reference
            // it must be of the form `{ hammer: { gesture: { handler: fn, options: }, hammer: hammer } }`
            if (options.hammer) {
                var hammer = options.hammer.hammer || h.Hammer;
                onEachDefined(options, "hammer",
                    /**
                     * @param {{handler: function, [options]:object}} v
                     * @param {string} p
                     */
                    function (v, p) {
                        if (p !== "hammer") {
                            hammer(e, v.options).on(p, v.handler);
                        }
                    });
            }
            // allow elements to be stored into a context
            // store must be an object of the form `{object:objectRef, keyPath: "keyPath", [idOnly:true|false] }`
            // if idOnly is true, only the element's id is stored
            if (options.store) {
                if (options.store.idOnly) {
                    elid = getAndSetElementId(e);
                }
                options.store.object[options.store.keyPath] = options.store.idOnly ? elid : e;
            }
        }
        // Determine if we have `value` and `textContent` options or only
        // `textContent` (buttons have both) If both are present, the first
        // content item is applied to `value`, and the second is applied to
        // `textContent`|`innerText`
        // NOTE: LIs have values. Whodathunk?
        if (e.value !== undefined && tagParts.tag !== "li") {
            contentTarget.push("value");
        }
        if (( e.textContent !== undefined ) || ( e.innerText !== undefined )) {
            contentTarget.push(e.textContent !== undefined ? "textContent" : "innerText");
        }
        for (i = 0, l = contentTarget.length; i < l; i++) {
            var x = content.shift();
            if (x !== undefined) {
                e[contentTarget[i]] = x;
            }
        }

        // add children to the parent too
        var child;
        for (i = 0, l = args.length; i < l; i++) {
            child = args[i];
            appendChildToParent(child, e);
        }
        if (typeof options === "object" && options !== null) {
            // Data binding only occurs if using YASMF's BaseObject for now (built-in pubsub/observables)
            // along with observable properties
            // the binding object is of the form `{ object: objectRef, keyPath: "keyPath", [keyType:"string"] }`
            if (options.bind) {
                if (typeof h.BaseObject !== "undefined") {
                    if (options.bind.object instanceof h.BaseObject) {
                        elid = getAndSetElementId(e);
                        // we have an object that has observable properties
                        options.bind.object.dataBindOn(e, options.bind.keyPath, options.bind.keyType);
                        options.bind.object.notifyDataBindingElementsForKeyPath(options.bind.keyPath);
                    }
                }
            }
        }
        // return the element (and associated tree)
        return e;
    },
    /**
     * mapTo - Maps a keypath to another keypath based on `map`. `map` should look like this:
     *
     * ```
     * {
     *   "mapping_key": "target_key", ...
     * }
     * ```
     *
     * For example, let's assume that some object `o` has the properties `id` and `name`. We
     * want to map these to consistent values like `value` and `description` for a component.
     * `map` should look like this: `{ "value": "id", "description": "name" }`. In this case
     * calling `mapTo("value", map)` would return `id`, which could then be indexed on `o`
     * like so: `o[mapTo("value",map)]`.
     *
     * @method mapTo
     * @param  {String}    keyPath to map
     * @param  {*} map     map description
     * @return {String}    mapped keyPath
     */
    mapTo:         function mapTo(keyPath, map) {
        if (map === undefined || map === null) {
            return keyPath;
        }
        return (map[keyPath] !== undefined) ? map[keyPath] : keyPath;
    },
    /**
     * iif - evaluate `expr` and if it is `true`, return `a`. If it is false,
     * return `b`. If `a` is not supplied, `true` is the return result if `a`
     * would have been returned. If `b` is not supplied, `false` is the return
     * result if `b` would have been returned. Not much difference than the
     * ternary (`?:`) operator, but might be easier to read for some.
     *
     * If you need short circuiting, this function is no use. Use ?: instead.
     *
     * @method iif
     * @param  {boolean} expr expression to evaluate
     * @param  {*} a     value to return if `expr` is true; `true` is the default if not supplied
     * @param  {*} b     value to return if `expr` is false; `false` is the default if not supplied
     * @return {*}       `expr ? a : b`
     */
    iif:           function iif(expr, a, b) {
        return expr ? ( ( typeof a !== "undefined" ) ? a : true ) : ( ( typeof b !== "undefined" ) ? b : false );
    },
    /**
     * ifdef - Check if an expression is defined and return `a` if it is and `b`
     * if it isn't. If `a` is not supplied, `a` evaluates to `true` and if `b`
     * is not supplied, `b` evaluates to `false`.
     *
     * @method ifdef
     * @param  {boolean} expr expression to check
     * @param  {*}       a    value to return if expression is defined
     * @param  {*}       b    value to return if expression is not defined
     * @return {*}       a or b
     */
    ifdef:         function ifdef(expr, a, b) {
        return ( typeof expr !== "undefined" ) ? ( ( typeof a !== "undefined" ) ? a : true ) : ( ( typeof b !== "undefined" ) ?
            b : false );
    },
    /**
     * forIn - return an array containing the results of calling `fn` for
     * each property within `object`. Equivalent to `map` on an array.
     *
     * The function should have the signature `( value, object, property )`
     * and return the result. The results will automatically be collated in
     * an array.
     *
     * @method forIn
     * @param  {*}        object object to iterate over
     * @param  {function} fn     function to call
     * @return {Array}           resuts
     */
    forIn:         function forIn(object, fn) {
        return Object.keys(object).map(function (prop) {
            return fn(object[prop], object, prop);
        });
    },
    /**
     * forEach - Executes `map` on an array, calling `fn`. Named such because
     * it makes more sense than using `map` in a template, but it means the
     * same thing.
     *
     * @method forEach
     * @param  {Array}    arr Array to iterate
     * @param  {function} fn  Function to call
     * @return {Array}        Array after iteration
     */
    forEach:       function forEach(arr, fn) {
        return arr.map(fn);
    },
    /**
     * renderTo - Renders a node or array of nodes to a given element. If an
     * array is provided, each is appended in turn.
     *
     * Technically you can just use `appendChild` or equivalent DOM
     * methods, but this works only as far as the return result is a single
     * node. Occasionally your template may return an array of nodes, and
     * at that point `appendChild` fails.
     *
     * @method renderTo
     * @param  {Array|Node} n  Array or single node to append to the element
     * @param  {Node} el Element to attach to
     * @param  {Number} idx  index (optional)
     */
    renderTo:      function renderTo(n, el, idx) {
        if (!idx) {
            idx = 0;
        }
        if (n instanceof Array) {
            for (var i = 0, l = n.length; i < l; i++) {
                if (n[i] !== undefined && n[i] !== null) {
                    renderTo(n[i], el, i);
                }
            }
        } else {
            if (n === undefined || n === null || el === undefined || el === null) {
                return;
            }
            var elid = [null, null];
            if (el.hasChildNodes() && idx < el.childNodes.length) {
                elid[0] = el.childNodes[idx].getAttribute("id");
                if (h.useDomMerging) {
                    transform(el, el.childNodes[idx], n);
                } else {
                    el.replaceChild(n, el.childNodes[idx]);
                }
            } else {
                el.appendChild(n);
            }
        }
    }
},
// create bindings for each HTML element (from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
els   = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi",
    "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code",
    "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div",
    "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frameset", "h1",
    "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "isindex",
    "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta",
    "meter", "nav", "nobr", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture",
    "plaintext", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "shadow", "small",
    "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template",
    "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"
];
els.forEach(function (el) {
    h[el] = h.el.bind(h, el);
});
// bind document fragment too
h.DF = h.el.bind(h, "@DF");
h.dF = h.DF;
module.exports = h;

},{"./lib/onEachDefined":22,"./lib/parseTag":23}],22:[function(require,module,exports){
/*
 * _y-h - simple DOM templating
 *
 * @author Kerri Shotts
 * @license MIT
 *
 * ```
 * Copyright (c) 2014 - 2015 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */

function onEachDefined ( o, prop, cb ) {
    var oProp, propName, propValue;
    if (o !== undefined && o !== null) {
        if (typeof prop === "function") {
            cb = prop;
            oProp = o;
        } else {
            oProp = o[prop];
        }
        if (oProp !== undefined && oProp !== null) {
            if (oProp instanceof Array) {
                oProp.forEach(cb);
            } else if (typeof oProp === "object") {
                for (propName in oProp) {
                    if (oProp.hasOwnProperty(propName)) {
                        propValue = oProp[propName];
                        if (propValue !== undefined && propValue !== null) {
                            cb(oProp[propName], propName, oProp);
                        }
                    }
                }
            } else {
                throw new Error("Couldn't copy properties");
            }
        }
    }
}

module.exports = onEachDefined;

},{}],23:[function(require,module,exports){
/*
 * _y-h - simple DOM templating
 *
 * @author Kerri Shotts
 * @license MIT
 *
 * ```
 * Copyright (c) 2014 - 2015 Kerri Shotts, photoKandy Studios LLC
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * ```
 */

/**
 * Parses a tag string with a regular expression. Returns undefined if the
 * match is not found. If chop is true, the first character is eliminated
 * @param {string} str
 * @param {RegExp} regexp
 * @param {boolean} [chop]
 * @returns {*}
 */
function parse(str, regexp, chop) {
    var results = str.match(regexp),
        rStr;
    if (results === null || results === undefined) {
        return undefined;
    }
    if (results instanceof Array) {
        rStr = (chop ? results[0].substr(1) : results[0]).trim();
        return rStr === "" ? undefined : rStr;
    }
}

/**
 * parses an incoming tag into its tag `name`, `id`, and `class` constituents
 * A tag is of the form `tagName.class#id` or `tagName#id.class`. The `id` and `class`
 * are optional.
 *
 * If attributes need to be supplied, it's possible via the `?` query string. Attributes
 * are of the form `?attr=value&attr=value...`.
 *
 *
 *
 * @method parseTag
 * @private
 * @param {string} tag      tag to parse
 * @return {{tag: string, id: string, class: string, query: string, queryParts: Array<string>}} Object of the form `{ tag: tagName, id: id, class: class, query: query, queryPars: Array }`
 */
function parseTag(tag) {
    var tagParts = {
        tag:        "",
        id:         undefined,
        class:      undefined,
        query:      undefined,
        queryParts: []
    };

    // if no tag, return a blank structure
    if (tag === undefined || tag === null) {
        return tagParts;
    }

    // pick out the relevant pieces of the tag
    // element tag name is at the front
    // # identifies ID
    // . identifies class
    // ? identifies attributes (query string format)
    tagParts.tag = parse(tag, /.[^\#\.\?]*/);
    tagParts.id = parse(tag, /\#[^\#\.\?]+/, true);
    tagParts.query = parse(tag, /\?[^\#\.\?]+/, true);
    tagParts.class = parse(tag, /\.[^\#\.\?]+/, true);

    if (tagParts.query !== undefined) {
        // split on &. We don't do anything further (like split on =)
        tagParts.queryParts = tagParts.query.split("&");
    }

    return tagParts;
}

module.exports = parseTag;

},{}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvcS5qcyIsImxpYi95YXNtZi5qcyIsImxpYi95YXNtZi91aS9hbGVydC5qcyIsImxpYi95YXNtZi91aS9jb3JlLmpzIiwibGliL3lhc21mL3VpL2V2ZW50LmpzIiwibGliL3lhc21mL3VpL25hdmlnYXRpb25Db250cm9sbGVyLmpzIiwibGliL3lhc21mL3VpL3NwaW5uZXIuanMiLCJsaWIveWFzbWYvdWkvc3BsaXRWaWV3Q29udHJvbGxlci5qcyIsImxpYi95YXNtZi91aS90YWJWaWV3Q29udHJvbGxlci5qcyIsImxpYi95YXNtZi91aS90ZW1wbGF0ZXMvdWlCYXJCdXR0b24uanMiLCJsaWIveWFzbWYvdWkvdGVtcGxhdGVzL3VpTmF2aWdhdGlvbkJhci5qcyIsImxpYi95YXNtZi91aS92aWV3Q29udGFpbmVyLmpzIiwibGliL3lhc21mL3V0aWwvY29yZS5qcyIsImxpYi95YXNtZi91dGlsL2RhdGV0aW1lLmpzIiwibGliL3lhc21mL3V0aWwvZGV2aWNlLmpzIiwibGliL3lhc21mL3V0aWwvZmlsZU1hbmFnZXIuanMiLCJsaWIveWFzbWYvdXRpbC9maWxlbmFtZS5qcyIsImxpYi95YXNtZi91dGlsL21pc2MuanMiLCJsaWIveWFzbWYvdXRpbC9vYmplY3QuanMiLCJsaWIveWFzbWYvdXRpbC9yb3V0ZXIuanMiLCJub2RlX21vZHVsZXMveWFzbWYtaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy95YXNtZi1oL2xpYi9vbkVhY2hEZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL3lhc21mLWgvbGliL3BhcnNlVGFnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3p1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2g3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzF0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyMkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFtQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93LlE7XG4iLCIvKipcbiAqXG4gKiAjIFlBU01GLU5leHQgKFlldCBBbm90aGVyIFNpbXBsZSBNb2JpbGUgRnJhbWV3b3JrIE5leHQgR2VuKVxuICpcbiAqIFlBU01GLU5leHQgaXMgdGhlIHN1Y2Nlc3NvciB0byB0aGUgWUFTTUYgZnJhbWV3b3JrLiBXaGlsZSB0aGF0IGZyYW1ld29yayB3YXMgdXNlZnVsXG4gKiBhbmQgdXNhYmxlIGV2ZW4gaW4gYSBwcm9kdWN0aW9uIGVudmlyb25tZW50LCBhcyBteSBleHBlcmllbmNlIGhhcyBncm93biwgaXQgYmVjYW1lXG4gKiBuZWNlc3NhcnkgdG8gcmUtYXJjaGl0ZWN0IHRoZSBlbnRpcmUgZnJhbWV3b3JrIGluIG9yZGVyIHRvIHByb3ZpZGUgYSBtb2Rlcm5cbiAqIG1vYmlsZSBmcmFtZXdvcmsuXG4gKlxuICogWUFTTUYtTmV4dCBpcyB0aGUgcmVzdWx0LiBJdCdzIHlvdW5nLCB1bmRlciBhY3RpdmUgZGV2ZWxvcG1lbnQsIGFuZCBub3QgYXQgYWxsXG4gKiBjb21wYXRpYmxlIHdpdGggWUFTTUYgdjAuMi4gSXQgdXNlcyBhbGwgc29ydHMgb2YgbW9yZSBtb2Rlcm4gdGVjaG5vbG9naWVzIHN1Y2ggYXNcbiAqIFNBU1MgZm9yIENTUyBzdHlsaW5nLCBBTUQsIGV0Yy5cbiAqXG4gKiBZQVNNRi1OZXh0IGlzIGludGVuZGVkIHRvIGJlIGEgc2ltcGxlIGFuZCBmYXN0IGZyYW1ld29yayBmb3IgbW9iaWxlIGFuZCBkZXNrdG9wXG4gKiBkZXZpY2VzLiBJdCBwcm92aWRlcyBzZXZlcmFsIHV0aWxpdHkgZnVuY3Rpb25zIGFuZCBhbHNvIHByb3ZpZGVzIGEgVUkgZnJhbWV3b3JrLlxuICpcbiAqIEBtb2R1bGUgX3lcbiAqIEBhdXRob3IgS2VycmkgU2hvdHRzXG4gKiBAdmVyc2lvbiAwLjRcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG4vKmdsb2JhbCBtb2R1bGUsIHJlcXVpcmUqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIFVUSUwgKi9cbnZhciBfeSA9IHJlcXVpcmUoIFwiLi95YXNtZi91dGlsL2NvcmVcIiApO1xuX3kuZGF0ZXRpbWUgPSByZXF1aXJlKCBcIi4veWFzbWYvdXRpbC9kYXRldGltZVwiICk7XG5feS5maWxlbmFtZSA9IHJlcXVpcmUoIFwiLi95YXNtZi91dGlsL2ZpbGVuYW1lXCIgKTtcbl95Lm1pc2MgPSByZXF1aXJlKCBcIi4veWFzbWYvdXRpbC9taXNjXCIgKTtcbl95LmRldmljZSA9IHJlcXVpcmUoIFwiLi95YXNtZi91dGlsL2RldmljZVwiICk7XG5feS5CYXNlT2JqZWN0ID0gcmVxdWlyZSggXCIuL3lhc21mL3V0aWwvb2JqZWN0XCIgKTtcbl95LkZpbGVNYW5hZ2VyID0gcmVxdWlyZSggXCIuL3lhc21mL3V0aWwvZmlsZU1hbmFnZXJcIiApO1xuX3kuaCA9IHJlcXVpcmUoIFwieWFzbWYtaFwiICk7XG5feS5oLkJhc2VPYmplY3QgPSBfeS5CYXNlT2JqZWN0O1xuX3kuUm91dGVyID0gcmVxdWlyZSggXCIuL3lhc21mL3V0aWwvcm91dGVyXCIgKTtcblxuLyogVUkgKi9cbl95LlVJID0gcmVxdWlyZSggXCIuL3lhc21mL3VpL2NvcmVcIiApO1xuX3kuVUkuZXZlbnQgPSByZXF1aXJlKCBcIi4veWFzbWYvdWkvZXZlbnRcIiApO1xuX3kuVUkuVmlld0NvbnRhaW5lciA9IHJlcXVpcmUoIFwiLi95YXNtZi91aS92aWV3Q29udGFpbmVyXCIgKTtcbl95LlVJLk5hdmlnYXRpb25Db250cm9sbGVyID0gcmVxdWlyZSggXCIuL3lhc21mL3VpL25hdmlnYXRpb25Db250cm9sbGVyXCIgKTtcbl95LlVJLlNwbGl0Vmlld0NvbnRyb2xsZXIgPSByZXF1aXJlKCBcIi4veWFzbWYvdWkvc3BsaXRWaWV3Q29udHJvbGxlclwiICk7XG5feS5VSS5UYWJWaWV3Q29udHJvbGxlciA9IHJlcXVpcmUoIFwiLi95YXNtZi91aS90YWJWaWV3Q29udHJvbGxlclwiICk7XG5feS5VSS5BbGVydCA9IHJlcXVpcmUoIFwiLi95YXNtZi91aS9hbGVydFwiICk7XG5feS5VSS5TcGlubmVyID0gcmVxdWlyZSggXCIuL3lhc21mL3VpL3NwaW5uZXJcIiApO1xuXG4vKiBURU1QTEFURVMgKi9cbl95LlVJLnRlbXBsYXRlcyA9IHt9O1xuX3kuVUkudGVtcGxhdGVzLnVpQmFyQnV0dG9uID0gcmVxdWlyZSggXCIuL3lhc21mL3VpL3RlbXBsYXRlcy91aUJhckJ1dHRvblwiICk7XG5feS5VSS50ZW1wbGF0ZXMudWlOYXZpZ2F0aW9uQmFyID0gcmVxdWlyZSggXCIuL3lhc21mL3VpL3RlbXBsYXRlcy91aU5hdmlnYXRpb25CYXJcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IF95O1xuIiwiLyoqXG4gKlxuICogUHJvdmlkZXMgbmF0aXZlLWxpa2UgYWxlcnQgbWV0aG9kcywgaW5jbHVkaW5nIHByb21wdHMgYW5kIG1lc3NhZ2VzLlxuICpcbiAqIEBtb2R1bGUgYWxlcnQuanNcbiAqIEBhdXRob3IgS2VycmkgU2hvdHRzXG4gKiBAdmVyc2lvbiAwLjRcbiAqXG4gKiBgYGBcbiAqIENvcHlyaWdodCAoYykgMjAxMyBLZXJyaSBTaG90dHMsIHBob3RvS2FuZHkgU3R1ZGlvcyBMTENcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZ1xuICogY29uZGl0aW9uczpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXNcbiAqIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVJcbiAqIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlRcbiAqIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gKiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKiBgYGBcbiAqL1xuLypnbG9iYWwgbW9kdWxlKi9cbnZhciBfeSA9IHJlcXVpcmUoIFwiLi4vdXRpbC9jb3JlXCIgKSxcbiAgdGhlRGV2aWNlID0gcmVxdWlyZSggXCIuLi91dGlsL2RldmljZVwiICksXG4gIEJhc2VPYmplY3QgPSByZXF1aXJlKCBcIi4uL3V0aWwvb2JqZWN0XCIgKSxcbiAgVUkgPSByZXF1aXJlKCBcIi4vY29yZVwiICksXG4gIFEgPSByZXF1aXJlKCBcIi4uLy4uL3FcIiApLFxuICBldmVudCA9IHJlcXVpcmUoIFwiLi9ldmVudFwiICksXG4gIGggPSByZXF1aXJlKCBcInlhc21mLWhcIiApO1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX2NsYXNzTmFtZSA9IFwiQWxlcnRcIjtcbnZhciBBbGVydCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSBuZXcgQmFzZU9iamVjdCgpO1xuICBzZWxmLnN1YmNsYXNzKCBfY2xhc3NOYW1lICk7XG4gIC8qXG4gICAqICMgTm90aWZpY2F0aW9uc1xuICAgKlxuICAgKiAqIGBidXR0b25UYXBwZWRgIGluZGljYXRlcyB3aGljaCBidXR0b24gd2FzIHRhcHBlZCB3aGVuIHRoZSB2aWV3IGlzIGRpc21pc3NpbmdcbiAgICogKiBgZGlzbWlzc2VkYCBpbmRpY2F0ZXMgdGhhdCB0aGUgYWxlcnQgd2FzIGRpc21pc3NlZCAoYnkgdXNlciBvciBjb2RlKVxuICAgKi9cbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJidXR0b25UYXBwZWRcIiApO1xuICBzZWxmLnJlZ2lzdGVyTm90aWZpY2F0aW9uKCBcImRpc21pc3NlZFwiICk7XG4gIC8qKlxuICAgKiBUaGUgdGl0bGUgdG8gc2hvdyBpbiB0aGUgYWxlcnQuXG4gICAqIEBwcm9wZXJ0eSB0aXRsZVxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgc2VsZi5fdGl0bGVFbGVtZW50ID0gbnVsbDsgLy8gdGhlIGNvcnJlc3BvbmRpbmcgRE9NIGVsZW1lbnRcbiAgc2VsZi5zZXRUaXRsZSA9IGZ1bmN0aW9uICggdGhlVGl0bGUgKSB7XG4gICAgc2VsZi5fdGl0bGUgPSB0aGVUaXRsZTtcbiAgICBpZiAoIHNlbGYuX3RpdGxlRWxlbWVudCAhPT0gbnVsbCApIHtcbiAgICAgIGlmICggdHlwZW9mIHNlbGYuX3RpdGxlRWxlbWVudC50ZXh0Q29udGVudCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgc2VsZi5fdGl0bGVFbGVtZW50LnRleHRDb250ZW50ID0gdGhlVGl0bGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLl90aXRsZUVsZW1lbnQuaW5uZXJIVE1MID0gdGhlVGl0bGU7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcInRpdGxlXCIsIHtcbiAgICByZWFkOiAgICB0cnVlLFxuICAgIHdyaXRlOiAgIHRydWUsXG4gICAgZGVmYXVsdDogX3kuVCggXCJBTEVSVFwiIClcbiAgfSApO1xuICAvKipcbiAgICogVGhlIGJvZHkgb2YgdGhlIGFsZXJ0LiBMZWF2ZSBibGFuayBpZiB5b3UgZG9uJ3QgbmVlZCB0byBzaG93XG4gICAqIGFueXRoaW5nIG1vcmUgdGhhbiB0aGUgdGl0bGUuXG4gICAqIEBwcm9wZXJ0eSB0ZXh0XG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBzZWxmLl90ZXh0RWxlbWVudCA9IG51bGw7XG4gIHNlbGYuc2V0VGV4dCA9IGZ1bmN0aW9uICggdGhlVGV4dCApIHtcbiAgICBzZWxmLl90ZXh0ID0gdGhlVGV4dDtcbiAgICBpZiAoIHNlbGYuX3RleHRFbGVtZW50ICE9PSBudWxsICkge1xuICAgICAgaWYgKCB0eXBlb2YgdGhlVGV4dCAhPT0gXCJvYmplY3RcIiApIHtcbiAgICAgICAgaWYgKCB0eXBlb2Ygc2VsZi5fdGV4dEVsZW1lbnQudGV4dENvbnRlbnQgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgc2VsZi5fdGV4dEVsZW1lbnQudGV4dENvbnRlbnQgPSAoIFwiXCIgKyB0aGVUZXh0ICkucmVwbGFjZSggL1xcPGJyXFx3KlxcL1xcPi9nLCBcIlxcclxcblwiICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5fdGV4dEVsZW1lbnQuaW5uZXJIVE1MID0gdGhlVGV4dDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaC5yZW5kZXJUbyggdGhlVGV4dCwgc2VsZi5fdGV4dEVsZW1lbnQsIDAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwidGV4dFwiLCB7XG4gICAgcmVhZDogIHRydWUsXG4gICAgd3JpdGU6IHRydWVcbiAgfSApO1xuICAvKipcbiAgICogVGhlIGFsZXJ0J3MgYnV0dG9ucyBhcmUgc3BlY2lmaWVkIGluIHRoaXMgcHJvcGVydHkuIFRoZSBsYXlvdXRcbiAgICogaXMgZXhwZWN0ZWQgdG8gYmU6IGBbIHsgdGl0bGU6IHRpdGxlIFssIHR5cGU6IHR5cGVdIFssIHRhZzogdGFnXSB9IFssIHt9IC4uLl0gXWBcbiAgICpcbiAgICogRWFjaCBidXR0b24ncyB0eXBlIGNhbiBiZSBcIm5vcm1hbFwiLCBcImJvbGRcIiwgXCJkZXN0cnVjdGl2ZVwiLiBUaGUgdGFnIG1heSBiZVxuICAgKiBudWxsOyBpZiBpdCBpcywgaXQgaXMgYXNzaWduZWQgdGhlIGJ1dHRvbiBpbmRleC4gSWYgYSB0YWcgaXMgc3BlY2lmZWQgKGNvbW1vblxuICAgKiBmb3IgY2FuY2VsIGJ1dHRvbnMpLCB0aGF0IGlzIHRoZSByZXR1cm4gdmFsdWUuXG4gICAqIEBwcm9wZXJ0eSBidXR0b25zXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gIHNlbGYuX2J1dHRvbnMgPSBbXTtcbiAgc2VsZi5fYnV0dG9uQ29udGFpbmVyID0gbnVsbDtcbiAgc2VsZi5kZWZpbmVQcm9wZXJ0eSggXCJ3aWRlQnV0dG9uc1wiLCB7XG4gICAgZGVmYXVsdDogXCJhdXRvXCJcbiAgfSApO1xuICBzZWxmLnNldEJ1dHRvbnMgPSBmdW5jdGlvbiAoIHRoZUJ1dHRvbnMgKSB7XG4gICAgZnVuY3Rpb24gdG91Y2hTdGFydCggZSApIHtcbiAgICAgIGlmICggZS50b3VjaGVzICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHRoaXMuc3RhcnRYID0gZS50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgIHRoaXMuc3RhcnRZID0gZS50b3VjaGVzWzBdLmNsaWVudFk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0WCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy5zdGFydFkgPSBlLmNsaWVudFk7XG4gICAgICB9XG4gICAgICB0aGlzLm1vdmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlU2Nyb2xsaW5nKCBlICkge1xuICAgICAgdmFyIG5ld1ggPSAoIGUudG91Y2hlcyAhPT0gdW5kZWZpbmVkICkgPyBlLnRvdWNoZXNbMF0uY2xpZW50WCA6IGUuY2xpZW50WCxcbiAgICAgICAgbmV3WSA9ICggZS50b3VjaGVzICE9PSB1bmRlZmluZWQgKSA/IGUudG91Y2hlc1swXS5jbGllbnRZIDogZS5jbGllbnRZLFxuICAgICAgICBkWCA9IE1hdGguYWJzKCB0aGlzLnN0YXJ0WCAtIG5ld1ggKSxcbiAgICAgICAgZFkgPSBNYXRoLmFicyggdGhpcy5zdGFydFkgLSBuZXdZICk7XG4gICAgICBjb25zb2xlLmxvZyggZFgsIGRZICk7XG4gICAgICBpZiAoIGRYID4gMjAgfHwgZFkgPiAyMCApIHtcbiAgICAgICAgdGhpcy5tb3ZlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlzbWlzc1dpdGhJbmRleCggaWR4ICkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoIHRoaXMubW92ZWQgKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuZGlzbWlzcyggaWR4ICk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBpO1xuICAgIC8vIGNsZWFyIG91dCBhbnkgcHJldmlvdXMgYnV0dG9ucyBpbiB0aGUgRE9NXG4gICAgaWYgKCBzZWxmLl9idXR0b25Db250YWluZXIgIT09IG51bGwgKSB7XG4gICAgICBmb3IgKCBpID0gMDsgaSA8IHNlbGYuX2J1dHRvbnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgIHNlbGYuX2J1dHRvbkNvbnRhaW5lci5yZW1vdmVDaGlsZCggc2VsZi5fYnV0dG9uc1tpXS5lbGVtZW50ICk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYuX2J1dHRvbnMgPSB0aGVCdXR0b25zO1xuICAgIC8vIGRldGVybWluZSBpZiB3ZSBuZWVkIHdpZGUgYnV0dG9ucyBvciBub3RcbiAgICB2YXIgd2lkZUJ1dHRvbnMgPSBmYWxzZTtcbiAgICBpZiAoIHNlbGYud2lkZUJ1dHRvbnMgPT09IFwiYXV0b1wiICkge1xuICAgICAgd2lkZUJ1dHRvbnMgPSAhKCAoIHNlbGYuX2J1dHRvbnMubGVuZ3RoID49IDIgKSAmJiAoIHNlbGYuX2J1dHRvbnMubGVuZ3RoIDw9IDMgKSApO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aWRlQnV0dG9ucyA9IHNlbGYud2lkZUJ1dHRvbnM7XG4gICAgfVxuICAgIGlmICggd2lkZUJ1dHRvbnMgKSB7XG4gICAgICBzZWxmLl9idXR0b25Db250YWluZXIuY2xhc3NMaXN0LmFkZCggXCJ3aWRlXCIgKTtcbiAgICB9XG4gICAgLy8gYWRkIHRoZSBidXR0b25zIGJhY2sgdG8gdGhlIERPTSBpZiB3ZSBjYW5cbiAgICBpZiAoIHNlbGYuX2J1dHRvbkNvbnRhaW5lciAhPT0gbnVsbCApIHtcbiAgICAgIGZvciAoIGkgPSAwOyBpIDwgc2VsZi5fYnV0dG9ucy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG4gICAgICAgIHZhciBiID0gc2VsZi5fYnV0dG9uc1tpXTtcbiAgICAgICAgLy8gaWYgdGhlIHRhZyBpcyBudWxsLCBnaXZlIGl0IChpKVxuICAgICAgICBpZiAoIGIudGFnID09PSBudWxsICkge1xuICAgICAgICAgIGIudGFnID0gaTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjbGFzcyBpcyB1aS1hbGVydC1idXR0b24gbm9ybWFsfGJvbGR8ZGVzdHJ1Y3RpdmUgW3dpZGVdXG4gICAgICAgIC8vIHdpZGUgYnV0dG9ucyBhcmUgZm9yIDEgYnV0dG9uIG9yIDQrIGJ1dHRvbnMuXG4gICAgICAgIGUuY2xhc3NOYW1lID0gXCJ1aS1hbGVydC1idXR0b24gXCIgKyBiLnR5cGUgKyBcIiBcIiArICggd2lkZUJ1dHRvbnMgPyBcIndpZGVcIiA6IFwiXCIgKTtcbiAgICAgICAgLy8gdGl0bGVcbiAgICAgICAgZS5pbm5lckhUTUwgPSBiLnRpdGxlO1xuICAgICAgICBpZiAoICF3aWRlQnV0dG9ucyApIHtcbiAgICAgICAgICAvLyBzZXQgdGhlIHdpZHRoIG9mIGVhY2ggYnV0dG9uIHRvIGZpbGwgb3V0IHRoZSBhbGVydCBlcXVhbGx5XG4gICAgICAgICAgLy8gMyBidXR0b25zIGdldHMgMzMuMzMzJTsgMiBnZXRzIDUwJS5cbiAgICAgICAgICBlLnN0eWxlLndpZHRoID0gXCJcIiArICggMTAwIC8gc2VsZi5fYnV0dG9ucy5sZW5ndGggKSArIFwiJVwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIGxpc3RlbiBmb3IgYSB0b3VjaFxuICAgICAgICBpZiAoIEhhbW1lciApIHtcbiAgICAgICAgICBIYW1tZXIoIGUgKS5vbiggXCJ0YXBcIiwgZGlzbWlzc1dpdGhJbmRleCggaSApICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXZlbnQuYWRkTGlzdGVuZXIoIGUsIFwidG91Y2hzdGFydFwiLCB0b3VjaFN0YXJ0ICk7XG4gICAgICAgICAgZXZlbnQuYWRkTGlzdGVuZXIoIGUsIFwidG91Y2htb3ZlXCIsIGhhbmRsZVNjcm9sbGluZyApO1xuICAgICAgICAgIGV2ZW50LmFkZExpc3RlbmVyKCBlLCBcInRvdWNoZW5kXCIsIGRpc21pc3NXaXRoSW5kZXgoIGkgKSApO1xuICAgICAgICB9XG4gICAgICAgIGIuZWxlbWVudCA9IGU7XG4gICAgICAgIC8vIGFkZCB0aGUgYnV0dG9uIHRvIHRoZSBET01cbiAgICAgICAgc2VsZi5fYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKCBiLmVsZW1lbnQgKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwiYnV0dG9uc1wiLCB7XG4gICAgcmVhZDogICAgdHJ1ZSxcbiAgICB3cml0ZTogICB0cnVlLFxuICAgIGRlZmF1bHQ6IFtdXG4gIH0gKTtcbiAgLy8gb3RoZXIgRE9NIGVsZW1lbnRzIHdlIG5lZWQgdG8gY29uc3RydWN0IHRoZSBhbGVydFxuICBzZWxmLl9yb290RWxlbWVudCA9IG51bGw7IC8vIHJvb3QgZWxlbWVudCBjb250YWlucyB0aGUgY29udGFpbmVyXG4gIHNlbGYuX2FsZXJ0RWxlbWVudCA9IG51bGw7IC8vIHBvaW50cyB0byB0aGUgYWxlcnQgaXRzZWxmXG4gIHNlbGYuX3ZhRWxlbWVudCA9IG51bGw7IC8vIHBvaW50cyB0byB0aGUgRElWIHVzZWQgdG8gdmVydGljYWxseSBhbGlnbiB1c1xuICBzZWxmLl9kZWZlcnJlZCA9IG51bGw7IC8vIHN0b3JlcyBhIHByb21pc2VcbiAgLyoqXG4gICAqIElmIHRydWUsIHNob3coKSByZXR1cm5zIGEgcHJvbWlzZS5cbiAgICogQHByb3BlcnR5IHVzZVByb21pc2VcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcInVzZVByb21pc2VcIiwge1xuICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgd3JpdGU6ICAgZmFsc2UsXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgfSApO1xuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoZSBhbGVydCBpcyB2ZWlzaWJsZS5cbiAgICogQHByb3BlcnR5IHZpc2libGVcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcInZpc2libGVcIiwge1xuICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgd3JpdGU6ICAgZmFsc2UsXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgfSApO1xuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgRE9NIGVsZW1lbnRzIGZvciBhbiBBbGVydC4gQXNzdW1lcyB0aGUgc3R5bGVzIGFyZVxuICAgKiBhbHJlYWR5IGluIHRoZSBzdHlsZSBzaGVldC5cbiAgICogQG1ldGhvZCBfY3JlYXRlRWxlbWVudHNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbGYuX2NyZWF0ZUVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX3Jvb3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIHNlbGYuX3Jvb3RFbGVtZW50LmNsYXNzTmFtZSA9IFwidWktYWxlcnQtY29udGFpbmVyXCI7XG4gICAgc2VsZi5fdmFFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIHNlbGYuX3ZhRWxlbWVudC5jbGFzc05hbWUgPSBcInVpLWFsZXJ0LXZlcnRpY2FsLWFsaWduXCI7XG4gICAgc2VsZi5fYWxlcnRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIHNlbGYuX2FsZXJ0RWxlbWVudC5jbGFzc05hbWUgPSBcInVpLWFsZXJ0XCI7XG4gICAgc2VsZi5fdGl0bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIHNlbGYuX3RpdGxlRWxlbWVudC5jbGFzc05hbWUgPSBcInVpLWFsZXJ0LXRpdGxlXCI7XG4gICAgc2VsZi5fdGV4dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG4gICAgc2VsZi5fdGV4dEVsZW1lbnQuY2xhc3NOYW1lID0gXCJ1aS1hbGVydC10ZXh0XCI7XG4gICAgc2VsZi5fYnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIHNlbGYuX2J1dHRvbkNvbnRhaW5lci5jbGFzc05hbWUgPSBcInVpLWFsZXJ0LWJ1dHRvbi1jb250YWluZXJcIjtcbiAgICBzZWxmLl9hbGVydEVsZW1lbnQuYXBwZW5kQ2hpbGQoIHNlbGYuX3RpdGxlRWxlbWVudCApO1xuICAgIHNlbGYuX2FsZXJ0RWxlbWVudC5hcHBlbmRDaGlsZCggc2VsZi5fdGV4dEVsZW1lbnQgKTtcbiAgICBzZWxmLl9hbGVydEVsZW1lbnQuYXBwZW5kQ2hpbGQoIHNlbGYuX2J1dHRvbkNvbnRhaW5lciApO1xuICAgIHNlbGYuX3ZhRWxlbWVudC5hcHBlbmRDaGlsZCggc2VsZi5fYWxlcnRFbGVtZW50ICk7XG4gICAgc2VsZi5fcm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQoIHNlbGYuX3ZhRWxlbWVudCApO1xuICB9O1xuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGJhY2sgYnV0dG9uIGlzIHByZXNzZWQuIERpc21pc3NlcyB3aXRoIGEgLTEgaW5kZXguIEVmZmVjdGl2ZWx5IGEgQ2FuY2VsLlxuICAgKiBAbWV0aG9kIGJhY2tCdXR0b25QcmVzc2VkXG4gICAqL1xuICBzZWxmLmJhY2tCdXR0b25QcmVzc2VkID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuZGlzbWlzcyggLTEgKTtcbiAgfTtcbiAgLyoqXG4gICAqIEhpZGUgZGlzbWlzc2VzIHRoZSBhbGVydCBhbmQgZGlzbWlzc2VzIGl0IHdpdGggLTEuIEVmZmVjdGl2ZWx5IGEgQ2FuY2VsLlxuICAgKiBAbWV0aG9kIGhpZGVcbiAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBzZWxmLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5kaXNtaXNzKCAtMSApO1xuICB9O1xuICAvKipcbiAgICogU2hvd3MgYW4gYWxlcnQuXG4gICAqIEBtZXRob2Qgc2hvd1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgaWYgdXNlUHJvbWlzZSA9IHRydWVcbiAgICovXG4gIHNlbGYuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIHNlbGYudmlzaWJsZSApIHtcbiAgICAgIGlmICggc2VsZi51c2VQcm9taXNlICYmIHNlbGYuX2RlZmVycmVkICE9PSBudWxsICkge1xuICAgICAgICByZXR1cm4gc2VsZi5fZGVmZXJyZWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdm9pZCAwOyAvLyBjYW4ndCBkbyBhbnl0aGluZyBtb3JlLlxuICAgIH1cbiAgICAvLyBsaXN0ZW4gZm9yIHRoZSBiYWNrIGJ1dHRvblxuICAgIFVJLmJhY2tCdXR0b24uYWRkTGlzdGVuZXJGb3JOb3RpZmljYXRpb24oIFwiYmFja0J1dHRvblByZXNzZWRcIiwgc2VsZi5iYWNrQnV0dG9uUHJlc3NlZCApO1xuICAgIC8vIGFkZCB0byB0aGUgYm9keVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHNlbGYuX3Jvb3RFbGVtZW50ICk7XG4gICAgLy8gYW5pbWF0ZSBpblxuICAgIFVJLnN0eWxlRWxlbWVudCggc2VsZi5fYWxlcnRFbGVtZW50LCBcInRyYW5zZm9ybVwiLCBcInNjYWxlM2QoMi4wMCwgMi4wMCwxKVwiICk7XG4gICAgc2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fcm9vdEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuICAgICAgc2VsZi5fYWxlcnRFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcbiAgICAgIFVJLnN0eWxlRWxlbWVudCggc2VsZi5fYWxlcnRFbGVtZW50LCBcInRyYW5zZm9ybVwiLCBcInNjYWxlM2QoMS4wMCwgMS4wMCwxKVwiIClcbiAgICB9LCAxMCApO1xuICAgIHNlbGYuX3Zpc2libGUgPSB0cnVlO1xuICAgIGlmICggc2VsZi51c2VQcm9taXNlICkge1xuICAgICAgc2VsZi5fZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICByZXR1cm4gc2VsZi5fZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIGFsZXJ0IHdpdGggdGhlIHNlcGNpZmllZCBidXR0b24gaW5kZXhcbiAgICpcbiAgICogQG1ldGhvZCBkaXNtaXNzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpZHhcbiAgICovXG4gIHNlbGYuZGlzbWlzcyA9IGZ1bmN0aW9uICggaWR4ICkge1xuICAgIGlmICggIXNlbGYudmlzaWJsZSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gZHJvcCB0aGUgbGlzdGVuZXIgZm9yIHRoZSBiYWNrIGJ1dHRvblxuICAgIFVJLmJhY2tCdXR0b24ucmVtb3ZlTGlzdGVuZXJGb3JOb3RpZmljYXRpb24oIFwiYmFja0J1dHRvblByZXNzZWRcIiwgc2VsZi5iYWNrQnV0dG9uUHJlc3NlZCApO1xuICAgIC8vIHJlbW92ZSBmcm9tIHRoZSBib2R5XG4gICAgc2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fcm9vdEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgICAgVUkuc3R5bGVFbGVtZW50KCBzZWxmLl9hbGVydEVsZW1lbnQsIFwidHJhbnNmb3JtXCIsIFwic2NhbGUzZCgwLjc1LCAwLjc1LDEpXCIgKVxuICAgIH0sIDEwICk7XG4gICAgc2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCggc2VsZi5fcm9vdEVsZW1lbnQgKTtcbiAgICB9LCA2MTAgKTtcbiAgICAvLyBnZXQgbm90aWZpY2F0aW9uIHRhZ1xuICAgIHZhciB0YWcgPSAtMTtcbiAgICBpZiAoICggaWR4ID4gLTEgKSAmJiAoIGlkeCA8IHNlbGYuX2J1dHRvbnMubGVuZ3RoICkgKSB7XG4gICAgICB0YWcgPSBzZWxmLl9idXR0b25zW2lkeF0udGFnO1xuICAgIH1cbiAgICAvLyBzZW5kIG91ciBub3RpZmljYXRpb25zIGFzIGFwcHJvcHJpYXRlXG4gICAgc2VsZi5ub3RpZnkoIFwiZGlzbWlzc2VkXCIgKTtcbiAgICBzZWxmLm5vdGlmeSggXCJidXR0b25UYXBwZWRcIiwgW3RhZ10gKTtcbiAgICBzZWxmLl92aXNpYmxlID0gZmFsc2U7XG4gICAgLy8gYW5kIHJlc29sdmUvcmVqZWN0IHRoZSBwcm9taXNlXG4gICAgaWYgKCBzZWxmLnVzZVByb21pc2UgKSB7XG4gICAgICBpZiAoIHRhZyA+IC0xICkge1xuICAgICAgICBzZWxmLl9kZWZlcnJlZC5yZXNvbHZlKCB0YWcgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuX2RlZmVycmVkLnJlamVjdCggbmV3IEVycm9yKCB0YWcgKSApO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBBbGVydCBhbmQgY2FsbHMgX2NyZWF0ZUVsZW1lbnRzLlxuICAgKiBAbWV0aG9kIGluaXRcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgc2VsZi5vdmVycmlkZSggZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBzZWxmLnN1cGVyKCBfY2xhc3NOYW1lLCBcImluaXRcIiApO1xuICAgIHNlbGYuX2NyZWF0ZUVsZW1lbnRzKCk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH0gKTtcbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBBbGVydC4gT3B0aW9ucyBpbmNsdWRlcyB0aXRsZSwgdGV4dCwgYnV0dG9ucywgYW5kIHByb21pc2UuXG4gICAqIEBtZXRob2Qgb3ZlcnJpZGVTdXBlclxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBzZWxmLm92ZXJyaWRlKCBmdW5jdGlvbiBpbml0V2l0aE9wdGlvbnMoIG9wdGlvbnMgKSB7XG4gICAgc2VsZi5pbml0KCk7XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMudGl0bGUgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHNlbGYudGl0bGUgPSBvcHRpb25zLnRpdGxlO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50ZXh0ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBzZWxmLnRleHQgPSBvcHRpb25zLnRleHQ7XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLndpZGVCdXR0b25zICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBzZWxmLndpZGVCdXR0b25zID0gb3B0aW9ucy53aWRlQnV0dG9uc1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5idXR0b25zICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBzZWxmLmJ1dHRvbnMgPSBvcHRpb25zLmJ1dHRvbnM7XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLnByb21pc2UgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHNlbGYuX3VzZVByb21pc2UgPSBvcHRpb25zLnByb21pc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZWxmO1xuICB9ICk7XG4gIC8qKlxuICAgKiBDbGVhbiB1cCBhZnRlciBvdXJzZWx2ZXMuXG4gICAqIEBtZXRob2QgZGVzdHJveVxuICAgKi9cbiAgc2VsZi5vdmVycmlkZVN1cGVyKCBzZWxmLmNsYXNzLCBcImRlc3Ryb3lcIiwgc2VsZi5kZXN0cm95ICk7XG4gIHNlbGYuZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgaWYgKCBzZWxmLnZpc2libGUgKSB7XG4gICAgICBzZWxmLmhpZGUoKTtcbiAgICAgIHNldFRpbWVvdXQoIGRlc3Ryb3ksIDYwMCApOyAvLyB3ZSB3b24ndCBkZXN0cm95IGltbWVkaWF0ZWx5LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZWxmLl9yb290RWxlbWVudCA9IG51bGw7XG4gICAgc2VsZi5fdmFFbGVtZW50ID0gbnVsbDtcbiAgICBzZWxmLl9hbGVydEVsZW1lbnQgPSBudWxsO1xuICAgIHNlbGYuX3RpdGxlRWxlbWVudCA9IG51bGw7XG4gICAgc2VsZi5fdGV4dEVsZW1lbnQgPSBudWxsO1xuICAgIHNlbGYuX2J1dHRvbkNvbnRhaW5lciA9IG51bGw7XG4gICAgc2VsZi5zdXBlciggX2NsYXNzTmFtZSwgXCJkZXN0cm95XCIgKTtcbiAgfTtcbiAgLy8gaGFuZGxlIGF1dG8taW5pdFxuICBzZWxmLl9hdXRvSW5pdC5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XG4gIHJldHVybiBzZWxmO1xufTtcbi8qKlxuICogQ3JlYXRlcyBhIGJ1dHRvbiBzdWl0YWJsZSBmb3IgYW4gQWxlcnRcbiAqIEBtZXRob2QgYnV0dG9uXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHRpdGxlICAgVGhlIHRpdGxlIG9mIHRoZSBidXR0b25cbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyBUaGUgYWRkaXRpb25hbCBvcHRpb25zOiB0eXBlIGFuZCB0YWdcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICBBIGJ1dHRvblxuICovXG5BbGVydC5idXR0b24gPSBmdW5jdGlvbiAoIHRpdGxlLCBvcHRpb25zICkge1xuICB2YXIgYnV0dG9uID0ge307XG4gIGJ1dHRvbi50aXRsZSA9IHRpdGxlO1xuICBidXR0b24udHlwZSA9IFwibm9ybWFsXCI7IC8vIG5vcm1hbCwgYm9sZCwgZGVzdHJ1Y3RpdmVcbiAgYnV0dG9uLnRhZyA9IG51bGw7IC8vIGFzc2lnbiBmb3IgYSBzcGVjaWZpYyB0YWdcbiAgYnV0dG9uLmVuYWJsZWQgPSB0cnVlOyAvLyBmYWxzZSA9IGRpc2FibGVkLlxuICBidXR0b24uZWxlbWVudCA9IG51bGw7IC8vIGF0dGFjaGVkIERPTSBlbGVtZW50XG4gIGlmICggdHlwZW9mIG9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50eXBlICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgYnV0dG9uLnR5cGUgPSBvcHRpb25zLnR5cGU7XG4gICAgfVxuICAgIGlmICggdHlwZW9mIG9wdGlvbnMudGFnICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgYnV0dG9uLnRhZyA9IG9wdGlvbnMudGFnO1xuICAgIH1cbiAgICBpZiAoIHR5cGVvZiBvcHRpb25zLmVuYWJsZWQgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICBidXR0b24uZW5hYmxlZCA9IG9wdGlvbnMuZW5hYmxlZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ1dHRvbjtcbn07XG4vKipcbiAqIENyZWF0ZXMgYW4gT0stc3R5bGUgQWxlcnQuIEl0IG9ubHkgaGFzIGFuIE9LIGJ1dHRvbi5cbiAqIEBtZXRob2QgT0tcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFNwZWNpZnkgdGhlIHRpdGxlLCB0ZXh0LCBhbmQgcHJvbWlzZSBvcHRpb25zIGlmIGRlc2lyZWQuXG4gKi9cbkFsZXJ0Lk9LID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuICB2YXIgYW5PSyA9IG5ldyBBbGVydCgpO1xuICB2YXIgYW5PS09wdGlvbnMgPSB7XG4gICAgdGl0bGU6ICAgX3kuVCggXCJPS1wiICksXG4gICAgdGV4dDogICAgXCJcIixcbiAgICBidXR0b25zOiBbQWxlcnQuYnV0dG9uKCBfeS5UKCBcIk9LXCIgKSwge1xuICAgICAgdHlwZTogXCJib2xkXCJcbiAgICB9ICldXG4gIH07XG4gIGlmICggdHlwZW9mIG9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50aXRsZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIGFuT0tPcHRpb25zLnRpdGxlID0gb3B0aW9ucy50aXRsZTtcbiAgICB9XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50ZXh0ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgYW5PS09wdGlvbnMudGV4dCA9IG9wdGlvbnMudGV4dDtcbiAgICB9XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5wcm9taXNlICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgYW5PS09wdGlvbnMucHJvbWlzZSA9IG9wdGlvbnMucHJvbWlzZTtcbiAgICB9XG4gIH1cbiAgYW5PSy5pbml0V2l0aE9wdGlvbnMoIGFuT0tPcHRpb25zICk7XG4gIHJldHVybiBhbk9LO1xufTtcbi8qKlxuICogQ3JlYXRlcyBhbiBPSy9DYW5jZWwtc3R5bGUgQWxlcnQuIEl0IG9ubHkgaGFzIGFuIE9LIGFuZCBDQU5DRUwgYnV0dG9uLlxuICogQG1ldGhvZCBDb25maXJtXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBTcGVjaWZ5IHRoZSB0aXRsZSwgdGV4dCwgYW5kIHByb21pc2Ugb3B0aW9ucyBpZiBkZXNpcmVkLlxuICovXG5BbGVydC5Db25maXJtID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuICB2YXIgYUNvbmZpcm1hdGlvbiA9IG5ldyBBbGVydCgpO1xuICB2YXIgY29uZmlybWF0aW9uT3B0aW9ucyA9IHtcbiAgICB0aXRsZTogICBfeS5UKCBcIkNvbmZpcm1cIiApLFxuICAgIHRleHQ6ICAgIFwiXCIsXG4gICAgYnV0dG9uczogW0FsZXJ0LmJ1dHRvbiggX3kuVCggXCJPS1wiICkgKSxcbiAgICAgICAgICAgICAgQWxlcnQuYnV0dG9uKCBfeS5UKCBcIkNhbmNlbFwiICksIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImJvbGRcIixcbiAgICAgICAgICAgICAgICB0YWc6ICAtMVxuICAgICAgICAgICAgICB9IClcbiAgICBdXG4gIH07XG4gIGlmICggdHlwZW9mIG9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50aXRsZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIGNvbmZpcm1hdGlvbk9wdGlvbnMudGl0bGUgPSBvcHRpb25zLnRpdGxlO1xuICAgIH1cbiAgICBpZiAoIHR5cGVvZiBvcHRpb25zLnRleHQgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICBjb25maXJtYXRpb25PcHRpb25zLnRleHQgPSBvcHRpb25zLnRleHQ7XG4gICAgfVxuICAgIGlmICggdHlwZW9mIG9wdGlvbnMucHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIGNvbmZpcm1hdGlvbk9wdGlvbnMucHJvbWlzZSA9IG9wdGlvbnMucHJvbWlzZTtcbiAgICB9XG4gIH1cbiAgYUNvbmZpcm1hdGlvbi5pbml0V2l0aE9wdGlvbnMoIGNvbmZpcm1hdGlvbk9wdGlvbnMgKTtcbiAgcmV0dXJuIGFDb25maXJtYXRpb247XG59O1xubW9kdWxlLmV4cG9ydHMgPSBBbGVydDtcbiIsIi8qKlxuICpcbiAqIENvcmUgb2YgWUFTTUYtVUk7IGRlZmluZXMgdGhlIHZlcnNpb24gYW5kIGJhc2ljIFVJICBjb252ZW5pZW5jZSBtZXRob2RzLlxuICpcbiAqIEBtb2R1bGUgY29yZS5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNFxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKi9cbi8qZ2xvYmFsIG1vZHVsZSovXG5cInVzZSBzdHJpY3RcIjtcbnZhciB0aGVEZXZpY2UgPSByZXF1aXJlKCBcIi4uL3V0aWwvZGV2aWNlXCIgKTtcbnZhciBCYXNlT2JqZWN0ID0gcmVxdWlyZSggXCIuLi91dGlsL29iamVjdFwiICk7XG52YXIgcHJlZml4ZXMgPSBbXCItd2Via2l0LVwiLCBcIi1tb3otXCIsIFwiLW1zLVwiLCBcIi1vLVwiLCBcIlwiXSxcbiAganNQcmVmaXhlcyA9IFtcIndlYmtpdFwiLCBcIm1velwiLCBcIm1zXCIsIFwib1wiLCBcIlwiXSxcbiAgLyoqXG4gICAqIEBtZXRob2QgQW5pbWF0aW9uXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0FycmF5fSBlbHMgICAgICAgICAgICAgZWxlbWVudHMgdG8gYW5pbWF0ZVxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltaW5nICAgICAgICAgc2Vjb25kcyB0byBhbmltYXRlIG92ZXIgKDAuMyBkZWZhdWx0KVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltaW5nRnVuY3Rpb24gdGltaW5nIGZ1bmN0aW9uIChlYXNlLWluLW91dCBkZWZhdWx0KVxuICAgKiBAcmV0dXJuIHtBbmltYXRpb259XG4gICAqL1xuICBBbmltYXRpb24gPSBmdW5jdGlvbiAoIGVscywgdGltaW5nLCB0aW1pbmdGdW5jdGlvbiApIHtcbiAgICB0aGlzLl9lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcbiAgICB0aGlzLl9lbHMgPSBlbHM7XG4gICAgdGhpcy5fYW5pbWF0aW9ucyA9IFtdO1xuICAgIHRoaXMuX3RyYW5zaXRpb25zID0gW107XG4gICAgdGhpcy50aW1pbmdGdW5jdGlvbiA9IFwiZWFzZS1pbi1vdXRcIjtcbiAgICB0aGlzLnRpbWluZyA9IDAuMztcbiAgICB0aGlzLl9tYXhUaW1pbmcgPSAwO1xuICAgIGlmICggdHlwZW9mIHRpbWluZyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIHRoaXMudGltaW5nID0gdGltaW5nO1xuICAgIH1cbiAgICBpZiAoIHR5cGVvZiB0aW1pbmdGdW5jdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIHRoaXMudGltaW5nRnVuY3Rpb24gPSB0aW1pbmdGdW5jdGlvbjtcbiAgICB9XG4gIH07XG4vKipcbiAqIEBtZXRob2QgX3B1c2hBbmltYXRpb25cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgICAgICAgICBzdHlsZSBwcm9wZXJ0eVxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlICAgICAgICAgICAgdmFsdWUgdG8gYXNzaWduIHRvIHByb3BlcnR5XG4gKiBAcGFyYW0ge251bWJlcn0gdGltaW5nICAgICAgICAgICBzZWNvbmRzIGZvciBhbmltYXRpb24gKG9wdGlvbmFsKVxuICogQHBhcmFtIHtzdHJpbmd9IHRpbWluZ0Z1bmN0aW9uICAgdGltaW5nIGZ1bmN0aW9uIChvcHRpb25hbClcbiAqIEByZXR1cm4ge0FuaW1hdGlvbn0gICAgICAgICAgICAgIHNlbGYsIGZvciBjaGFpbmluZ1xuICovXG5mdW5jdGlvbiBfcHVzaEFuaW1hdGlvbiggcHJvcGVydHksIHZhbHVlLCB0aW1pbmcsIHRpbWluZ0Z1bmN0aW9uICkge1xuICB2YXIgbmV3UHJvcCwgbmV3VmFsdWUsIHByZWZpeCwganNQcmVmaXgsIG5ld0pzUHJvcDtcbiAgZm9yICggdmFyIGkgPSAwLCBsID0gcHJlZml4ZXMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgIHByZWZpeCA9IHByZWZpeGVzW2ldO1xuICAgIGpzUHJlZml4ID0ganNQcmVmaXhlc1tpXTtcbiAgICBuZXdQcm9wID0gcHJlZml4ICsgcHJvcGVydHk7XG4gICAgaWYgKCBqc1ByZWZpeCAhPT0gXCJcIiApIHtcbiAgICAgIG5ld0pzUHJvcCA9IGpzUHJlZml4ICsgcHJvcGVydHkuc3Vic3RyKCAwLCAxICkudG9VcHBlckNhc2UoKSArIHByb3BlcnR5LnN1YnN0ciggMSApO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdKc1Byb3AgPSBwcm9wZXJ0eTtcbiAgICB9XG4gICAgbmV3VmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCBcInstfVwiLCBwcmVmaXggKTtcbiAgICBpZiAoIHR5cGVvZiB0aGlzLl9lbC5zdHlsZVtuZXdKc1Byb3BdICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgdGhpcy5fYW5pbWF0aW9ucy5wdXNoKCBbbmV3UHJvcCwgbmV3VmFsdWVdICk7XG4gICAgICB0aGlzLl90cmFuc2l0aW9ucy5wdXNoKCBbbmV3UHJvcCwgKCB0eXBlb2YgdGltaW5nICE9PSBcInVuZGVmaW5lZFwiID8gdGltaW5nIDogdGhpcy50aW1pbmcgKSArIFwic1wiLCAoIHR5cGVvZiB0aW1pbmdGdW5jdGlvbiAhPT1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInVuZGVmaW5lZFwiID8gdGltaW5nRnVuY3Rpb24gOiB0aGlzLnRpbWluZ0Z1bmN0aW9uICldICk7XG4gICAgfVxuICAgIHRoaXMuX21heFRpbWluZyA9IE1hdGgubWF4KCB0aGlzLl9tYXhUaW1pbmcsICggdHlwZW9mIHRpbWluZyAhPT0gXCJ1bmRlZmluZWRcIiA/IHRpbWluZyA6IHRoaXMudGltaW5nICkgKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cbi8qKlxuICogU2V0IHRoZSBkZWZhdWx0IHRpbWluZyBmdW5jdGlvbiBmb3IgZm9sbG93aW5nIGFuaW1hdGlvbnNcbiAqIEBtZXRob2Qgc2V0VGltaW5nRnVuY3Rpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB0aW1pbmdGdW5jdGlvbiAgICAgIHRoZSB0aW1pbmcgZnVuY3Rpb24gdG8gYXNzaWduLCBsaWtlIFwiZWFzZS1pbi1vdXRcIlxuICogQHJldHVybiB7QW5pbWF0aW9ufSAgICAgICAgICAgICAgICAgc2VsZlxuICovXG5BbmltYXRpb24ucHJvdG90eXBlLnNldFRpbWluZ0Z1bmN0aW9uID0gZnVuY3Rpb24gc2V0VGltaW5nRnVuY3Rpb24oIHRpbWluZ0Z1bmN0aW9uICkge1xuICB0aGlzLnRpbWluZ0Z1bmN0aW9uID0gdGltaW5nRnVuY3Rpb247XG4gIHJldHVybiB0aGlzO1xufTtcbi8qKlxuICogU2V0IHRoZSB0aW1pbmcgZm9yIHRoZSBmb2xsb3dpbmcgYW5pbWF0aW9ucywgaW4gc2Vjb25kc1xuICogQG1ldGhvZCBzZXRUaW1pbmdcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1pbmcgICAgICAgICAgICAgIHRoZSBsZW5ndGggb2YgdGhlIGFuaW1hdGlvbiwgaW4gc2Vjb25kc1xuICogQHJldHVybiB7QW5pbWF0aW9ufSAgICAgICAgICAgICAgICAgc2VsZlxuICovXG5BbmltYXRpb24ucHJvdG90eXBlLnNldFRpbWluZyA9IGZ1bmN0aW9uIHNldFRpbWluZyggdGltaW5nICkge1xuICB0aGlzLnRpbWluZyA9IHRpbWluZztcbiAgcmV0dXJuIHRoaXM7XG59O1xuLyoqXG4gKiBNb3ZlIHRoZSBlbGVtZW50IHRvIHRoZSBzcGVjaWZpYyBwb3NpdGlvbiAodXNpbmcgbGVmdCwgdG9wKVxuICpcbiAqIEBtZXRob2QgbW92ZVxuICogQHBhcmFtIHtzdHJpbmd9IHggICAgICAgICAgIHRoZSB4IHBvc2l0aW9uIChweCBvciAlKVxuICogQHBhcmFtIHtzdHJpbmd9IHkgICAgICAgICAgIHRoZSB5IHBvc2l0aW9uIChweCBvciAlKVxuICogQHJldHVybiB7QW5pbWF0aW9ufSBzZWxmXG4gKi9cbkFuaW1hdGlvbi5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uICggeCwgeSApIHtcbiAgX3B1c2hBbmltYXRpb24uY2FsbCggdGhpcywgXCJsZWZ0XCIsIHggKTtcbiAgcmV0dXJuIF9wdXNoQW5pbWF0aW9uLmNhbGwoIHRoaXMsIFwidG9wXCIsIHkgKTtcbn07XG4vKipcbiAqIFJlc2l6ZSB0aGUgZWxlbWVudCAodXNpbmcgd2lkdGgsIGhlaWdodClcbiAqXG4gKiBAbWV0aG9kIHJlc2l6ZVxuICogQHBhcmFtIHtzdHJpbmd9IHcgICAgICAgICAgIHRoZSB3aWR0aCAocHggb3IgJSlcbiAqIEBwYXJhbSB7c3RyaW5nfSBoICAgICAgICAgICB0aGUgaGVpZ2h0IChweCBvciAlKVxuICogQHJldHVybiB7QW5pbWF0aW9ufSBzZWxmXG4gKi9cbkFuaW1hdGlvbi5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24gKCB3LCBoICkge1xuICBfcHVzaEFuaW1hdGlvbi5jYWxsKCB0aGlzLCBcIndpZHRoXCIsIHcgKTtcbiAgcmV0dXJuIF9wdXNoQW5pbWF0aW9uLmNhbGwoIHRoaXMsIFwiaGVpZ2h0XCIsIGggKTtcbn07XG4vKipcbiAqIENoYW5nZSBvcGFjaXR5XG4gKiBAbWV0aG9kIG9wYWNpdHlcbiAqIEBwYXJhbSB7c3RyaW5nfSBvICAgICAgICAgICBvcGFjaXR5XG4gKiBAcmV0dXJuIHtBbmltYXRpb259IHNlbGZcbiAqL1xuQW5pbWF0aW9uLnByb3RvdHlwZS5vcGFjaXR5ID0gZnVuY3Rpb24gKCBvICkge1xuICByZXR1cm4gX3B1c2hBbmltYXRpb24uY2FsbCggdGhpcywgXCJvcGFjaXR5XCIsIG8gKTtcbn07XG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZWxlbWVudCB1c2luZyB0cmFuc2xhdGUgeCwgeVxuICogQG1ldGhvZCB0cmFuc2xhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSB4ICAgICAgIHggcG9zaXRpb24gKHB4IG9yICUpXG4gKiBAcGFyYW0ge3N0cmluZ30geSAgICAgICB5IHBvc2l0aW9uIChweCBvciAlKVxuICogQHJldHVybiB7QW5pbWF0aW9ufSBzZWxmXG4gKi9cbkFuaW1hdGlvbi5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKCB4LCB5ICkge1xuICByZXR1cm4gX3B1c2hBbmltYXRpb24uY2FsbCggdGhpcywgXCJ0cmFuc2Zvcm1cIiwgW1widHJhbnNsYXRlKFwiLCBbeCwgeV0uam9pbiggXCIsIFwiICksIFwiKVwiXS5qb2luKCBcIlwiICkgKTtcbn07XG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZWxlbWVudCB1c2luZyB0cmFuc2xhdGUzZCB4LCB5LCB6XG4gKiBAbWV0aG9kIHRyYW5zbGF0ZTNkXG4gKiBAcGFyYW0ge3N0cmluZ30geCAgICAgICB4IHBvc2l0aW9uIChweCBvciAlKVxuICogQHBhcmFtIHtzdHJpbmd9IHkgICAgICAgeSBwb3NpdGlvbiAocHggb3IgJSlcbiAqIEBwYXJhbSB7c3RyaW5nfSB6ICAgICAgIHogcG9zaXRpb24gKHB4IG9yICUpXG4gKiBAcmV0dXJuIHtBbmltYXRpb259IHNlbGZcbiAqL1xuQW5pbWF0aW9uLnByb3RvdHlwZS50cmFuc2xhdGUzZCA9IGZ1bmN0aW9uICggeCwgeSwgeiApIHtcbiAgcmV0dXJuIF9wdXNoQW5pbWF0aW9uLmNhbGwoIHRoaXMsIFwidHJhbnNmb3JtXCIsIFtcInRyYW5zbGF0ZTNkKFwiLCBbeCwgeSwgel0uam9pbiggXCIsIFwiICksIFwiKVwiXS5qb2luKCBcIlwiICkgKTtcbn07XG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZWxlbWVudCB1c2luZyBzY2FsZVxuICogQG1ldGhvZCBzY2FsZVxuICogQHBhcmFtIHtzdHJpbmd9IHAgICAgICAgcGVyY2VudCAoMC4wMC0xLjAwKVxuICogQHJldHVybiB7QW5pbWF0aW9ufSBzZWxmXG4gKi9cbkFuaW1hdGlvbi5wcm90b3R5cGUuc2NhbGUgPSBmdW5jdGlvbiAoIHAgKSB7XG4gIHJldHVybiBfcHVzaEFuaW1hdGlvbi5jYWxsKCB0aGlzLCBcInRyYW5zZm9ybVwiLCBbXCJzY2FsZShcIiwgcCwgXCIpXCJdLmpvaW4oIFwiXCIgKSApO1xufTtcbi8qKlxuICogVHJhbnNmb3JtIHRoZSBlbGVtZW50IHVzaW5nIHNjYWxlXG4gKiBAbWV0aG9kIHJvdGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGQgICAgICAgZGVncmVlc1xuICogQHJldHVybiB7QW5pbWF0aW9ufSBzZWxmXG4gKi9cbkFuaW1hdGlvbi5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24gKCBkICkge1xuICByZXR1cm4gX3B1c2hBbmltYXRpb24uY2FsbCggdGhpcywgXCJ0cmFuc2Zvcm1cIiwgW1wicm90YXRlKFwiLCBkLCBcImRlZylcIl0uam9pbiggXCJcIiApICk7XG59O1xuLyoqXG4gKiBlbmQgdGhlIGFuaW1hdGlvbiBkZWZpbml0aW9uIGFuZCB0cmlnZ2VyIHRoZSBzZXF1ZW5jZS4gSWYgYSBjYWxsYmFjayBtZXRob2RcbiAqIGlzIHN1cHBsaWVkLCBpdCBpcyBjYWxsZWQgd2hlbiB0aGUgYW5pbWF0aW9uIGlzIG92ZXJcbiAqIEBtZXRob2QgZW5kQW5pbWF0aW9uXG4gKiBAYWxpYXMgdGhlblxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gICAgICAgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIGFuaW1hdGlvbiBpcyBjb21wbGV0ZWQ7XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdCBpcyBib3VuZCB0byB0aGUgQW5pbWF0aW9uIG1ldGhvZCBzbyB0aGF0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdXJ0aGVyIGFuaW1hdGlvbnMgY2FuIGJlIHRyaWdnZXJlZC5cbiAqIEByZXR1cm4ge0FuaW1hdGlvbn0gc2VsZlxuICovXG5BbmltYXRpb24ucHJvdG90eXBlLmVuZEFuaW1hdGlvbiA9IGZ1bmN0aW9uIGVuZEFuaW1hdGlvbiggZm4gKSB7XG4gIC8vIGNyZWF0ZSB0aGUgbGlzdCBvZiB0cmFuc2l0aW9ucyB3ZSBuZWVkIHRvIHB1dCBvbiB0aGUgZWxlbWVudHNcbiAgdmFyIHRyYW5zaXRpb24gPSB0aGlzLl90cmFuc2l0aW9ucy5tYXAoIGZ1bmN0aW9uICggdCApIHtcbiAgICAgIHJldHVybiB0LmpvaW4oIFwiIFwiICk7XG4gICAgfSApLmpvaW4oIFwiLCBcIiApLFxuICAgIHRoYXQgPSB0aGlzO1xuICAvLyBmb3IgZWFjaCBlbGVtZW50LCBhc3NpZ24gdGhpcyBsaXN0IG9mIHRyYW5zaXRpb25zXG4gIHRoYXQuX2Vscy5mb3JFYWNoKCBmdW5jdGlvbiBpbml0aWFsaXplRWwoIGVsICkge1xuICAgIHZhciBpLCBsLCBwcmVmaXhlZFRyYW5zaXRpb247XG4gICAgZm9yICggaSA9IDAsIGwgPSBwcmVmaXhlcy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG4gICAgICBwcmVmaXhlZFRyYW5zaXRpb24gPSBwcmVmaXhlc1tpXSArIFwidHJhbnNpdGlvblwiO1xuICAgICAgZWwuc3R5bGUuc2V0UHJvcGVydHkoIHByZWZpeGVkVHJhbnNpdGlvbiwgdHJhbnNpdGlvbiApO1xuICAgIH1cbiAgfSApO1xuICAvLyB3YWl0IGEgZmV3IG1zIHRvIGxldCB0aGUgRE9NIHNldHRsZSwgYW5kIHRoZW4gc3RhcnQgdGhlIGFuaW1hdGlvbnNcbiAgc2V0VGltZW91dCggZnVuY3Rpb24gc3RhcnRBbmltYXRpb25zKCkge1xuICAgIHZhciBpLCBsLCBwcm9wLCB2YWx1ZTtcbiAgICAvLyBmb3IgZWFjaCBlbGVtZW50LCBhc3NpZ24gdGhlIGRlc2lyZWQgcHJvcGVydHkgYW5kIHZhbHVlIHRvIHRoZSBlbGVtZW50XG4gICAgdGhhdC5fZWxzLmZvckVhY2goIGZ1bmN0aW9uIGFuaW1hdGVFbCggZWwgKSB7XG4gICAgICBmb3IgKCBpID0gMCwgbCA9IHRoYXQuX2FuaW1hdGlvbnMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICBwcm9wID0gdGhhdC5fYW5pbWF0aW9uc1tpXVswXTtcbiAgICAgICAgdmFsdWUgPSB0aGF0Ll9hbmltYXRpb25zW2ldWzFdO1xuICAgICAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eSggcHJvcCwgdmFsdWUgKTtcbiAgICAgIH1cbiAgICB9ICk7XG4gICAgLy8gd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLCByZW1vdmUgdGhlIHRyYW5zaXRpb24gcHJvcGVydHkgZnJvbVxuICAgIC8vIHRoZSBlbGVtZW50cyBhbmQgY2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gKGlmIHNwZWNpZmllZClcbiAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbiBhZnRlckFuaW1hdGlvbkNhbGxiYWNrKCkge1xuICAgICAgdmFyIHByZWZpeGVkVHJhbnNpdGlvbjtcbiAgICAgIHRoYXQuX2FuaW1hdGlvbnMgPSBbXTtcbiAgICAgIHRoYXQuX3RyYW5zaXRpb25zID0gW107XG4gICAgICB0aGF0Ll9lbHMuZm9yRWFjaCggZnVuY3Rpb24gYW5pbWF0ZUVsKCBlbCApIHtcbiAgICAgICAgZm9yICggdmFyIGkgPSAwLCBsID0gcHJlZml4ZXMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICAgIHByZWZpeGVkVHJhbnNpdGlvbiA9IHByZWZpeGVzW2ldICsgXCJ0cmFuc2l0aW9uXCI7XG4gICAgICAgICAgZWwuc3R5bGUuc2V0UHJvcGVydHkoIHByZWZpeGVkVHJhbnNpdGlvbiwgXCJcIiApO1xuICAgICAgICB9XG4gICAgICB9ICk7XG4gICAgICBpZiAoIHR5cGVvZiBmbiA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICBmbi5jYWxsKCB0aGF0ICk7XG4gICAgICB9XG4gICAgfSwgdGhhdC5fbWF4VGltaW5nICogMTAwMCApO1xuICB9LCA1MCApO1xuICByZXR1cm4gdGhpcztcbn07XG5BbmltYXRpb24ucHJvdG90eXBlLnRoZW4gPSBBbmltYXRpb24ucHJvdG90eXBlLmVuZEFuaW1hdGlvbjtcbnZhciBVSSA9IHt9O1xuLyoqXG4gKiBWZXJzaW9uIG9mIHRoZSBVSSBOYW1lc3BhY2VcbiAqIEBwcm9wZXJ0eSB2ZXJzaW9uXG4gKiBAdHlwZSBPYmplY3RcbiAqKi9cblVJLnZlcnNpb24gPSBcIjAuNS4xMDBcIjtcbi8qKlxuICogU3R5bGVzIHRoZSBlbGVtZW50IHdpdGggdGhlIGdpdmVuIHN0eWxlIGFuZCB2YWx1ZS4gQWRkcyBpbiB0aGUgYnJvd3NlclxuICogcHJlZml4ZXMgdG8gbWFrZSBpdCBlYXNpZXIuIEFsc28gYXZhaWxhYmxlIGFzIGAkc2Agb24gbm9kZXMuXG4gKlxuICogQG1ldGhvZCBzdHlsZUVsZW1lbnRcbiAqIEBhbGlhcyAkc1xuICogQHBhcmFtICB7Tm9kZX0gdGhlRWxlbWVudFxuICogQHBhcmFtICB7Q3NzU3R5bGV9IHRoZVN0eWxlICAgRG9uJ3QgY2FtZWxDYXNlIHRoZXNlLCB1c2UgZGFzaGVzIGFzIGluIHJlZ3VsYXIgc3R5bGVzXG4gKiBAcGFyYW0gIHt2YWx1ZX0gdGhlVmFsdWVcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5VSS5zdHlsZUVsZW1lbnQgPSBmdW5jdGlvbiAoIHRoZUVsZW1lbnQsIHRoZVN0eWxlLCB0aGVWYWx1ZSApIHtcbiAgaWYgKCB0eXBlb2YgdGhlRWxlbWVudCAhPT0gXCJvYmplY3RcIiApIHtcbiAgICBpZiAoICEoIHRoZUVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlICkgKSB7XG4gICAgICB0aGVWYWx1ZSA9IHRoZVN0eWxlO1xuICAgICAgdGhlU3R5bGUgPSB0aGVFbGVtZW50O1xuICAgICAgdGhlRWxlbWVudCA9IHRoaXM7XG4gICAgfVxuICB9XG4gIGZvciAoIHZhciBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrICkge1xuICAgIHZhciB0aGVQcmVmaXggPSBwcmVmaXhlc1tpXSxcbiAgICAgIHRoZU5ld1N0eWxlID0gdGhlUHJlZml4ICsgdGhlU3R5bGUsXG4gICAgICB0aGVOZXdWYWx1ZSA9IHRoZVZhbHVlLnJlcGxhY2UoIFwiJVBSRUZJWCVcIiwgdGhlUHJlZml4ICkucmVwbGFjZSggXCJ7LX1cIiwgdGhlUHJlZml4ICk7XG4gICAgdGhlRWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eSggdGhlTmV3U3R5bGUsIHRoZU5ld1ZhbHVlICk7XG4gIH1cbn07XG4vKipcbiAqIFN0eWxlIHRoZSBsaXN0IG9mIGVsZW1lbnRzIHdpdGggdGhlIHN0eWxlIGFuZCB2YWx1ZSB1c2luZyBgc3R5bGVFbGVtZW50YFxuICogQG1ldGhvZCBzdHlsZUVsZW1lbnRzXG4gKiBAcGFyYW0gIHtBcnJheX0gIHRoZUVsZW1lbnRzXG4gKiBAcGFyYW0gIHtDc3NTdHlsZX0gdGhlU3R5bGVcbiAqIEBwYXJhbSB7dmFsdWV9IHRoZVZhbHVlXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuVUkuc3R5bGVFbGVtZW50cyA9IGZ1bmN0aW9uICggdGhlRWxlbWVudHMsIHRoZVN0eWxlLCB0aGVWYWx1ZSApIHtcbiAgdmFyIGk7XG4gIGZvciAoIGkgPSAwOyBpIDwgdGhlRWxlbWVudHMubGVuZ3RoOyBpKysgKSB7XG4gICAgVUkuc3R5bGVFbGVtZW50KCB0aGVFbGVtZW50c1tpXSwgdGhlU3R5bGUsIHRoZVZhbHVlICk7XG4gIH1cbn07XG4vKipcbiAqIEJlZ2luIGFuIGFuaW1hdGlvbiBkZWZpbml0aW9uIGFuZCBhcHBseSBpdCB0byB0aGUgc3BlY2lmaWNcbiAqIGVsZW1lbnRzIGRlZmluZWQgYnkgc2VsZWN0b3IuIElmIHBhcmVudCBpcyBzdXBwbGllZCwgdGhlIHNlbGVjdG9yXG4gKiBpcyByZWxhdGl2ZSB0byB0aGUgcGFyZW50LCBvdGhlcndpc2UgaXQgaXMgcmVsYXRpdmUgdG8gZG9jdW1lbnRcbiAqIEBtZXRob2QgYmVnaW5BbmltYXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfEFycmF5fE5vZGV9IHNlbGVjdG9yICAgICAgSWYgYSBzdHJpbmcsIGFuaW1hdGlvbiBhcHBsaWVzIHRvIGFsbFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcyB0aGF0IG1hdGNoIHRoZSBzZWxlY3Rvci4gSWYgYW5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXksIGFuaW1hdGlvbiBhcHBsaWVzIHRvIGFsbCBub2Rlc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbiB0aGUgYXJyYXkuIElmIGEgbm9kZSwgdGhlIGFuaW1hdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBsaWVzIG9ubHkgdG8gdGhlIG5vZGUuXG4gKiBAcGFyYW0ge05vZGV9IHBhcmVudCAgICAgICAgICAgICAgICAgICAgIE9wdGlvbmFsOyBpZiBwcm92aWRlZCwgc2VsZWN0b3IgaXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUgdG8gdGhpcyBub2RlXG4gKiBAcmV0dXJuIHtBbmltYXRpb259ICAgICAgICAgICAgICAgICAgICAgIEFuaW1hdGlvbiBvYmplY3RcbiAqL1xuVUkuYmVnaW5BbmltYXRpb24gPSBmdW5jdGlvbiAoIHNlbGVjdG9yLCBwYXJlbnQgKSB7XG4gIHZhciBlbHMgPSBbXTtcbiAgaWYgKCB0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgaWYgKCB0eXBlb2YgcGFyZW50ID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgcGFyZW50ID0gZG9jdW1lbnQ7XG4gICAgfVxuICAgIGVscyA9IGVscy5jb25jYXQoIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuY2FsbCggcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIHNlbGVjdG9yICksIDAgKSApO1xuICB9XG4gIGlmICggdHlwZW9mIHNlbGVjdG9yID09PSBcIm9iamVjdFwiICYmIHNlbGVjdG9yIGluc3RhbmNlb2YgQXJyYXkgKSB7XG4gICAgZWxzID0gZWxzLmNvbmNhdCggc2VsZWN0b3IgKTtcbiAgfVxuICBpZiAoIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJvYmplY3RcIiAmJiBzZWxlY3RvciBpbnN0YW5jZW9mIE5vZGUgKSB7XG4gICAgZWxzID0gZWxzLmNvbmNhdCggW3NlbGVjdG9yXSApO1xuICB9XG4gIHJldHVybiBuZXcgQW5pbWF0aW9uKCBlbHMgKTtcbn07XG4vKipcbiAqXG4gKiBDb252ZXJ0cyBhIGNvbG9yIG9iamVjdCB0byBhbiByZ2JhKHIsZyxiLGEpIHN0cmluZywgc3VpdGFibGUgZm9yIGFwcGx5aW5nIHRvXG4gKiBhbnkgbnVtYmVyIG9mIENTUyBzdHlsZXMuIElmIHRoZSBjb2xvcidzIGFscGhhIGlzIHplcm8sIHRoZSByZXR1cm4gdmFsdWUgaXNcbiAqIFwidHJhbnNwYXJlbnRcIi4gSWYgdGhlIGNvbG9yIGlzIG51bGwsIHRoZSByZXR1cm4gdmFsdWUgaXMgXCJpbmhlcml0XCIuXG4gKlxuICogQG1ldGhvZCBjb2xvclRvUkdCQVxuICogQHN0YXRpY1xuICogQHBhcmFtIHtjb2xvcn0gdGhlQ29sb3IgLSB0aGVDb2xvciB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gYSBDU1MgdmFsdWUgc3VpdGFibGUgZm9yIGNvbG9yIHByb3BlcnRpZXNcbiAqL1xuVUkuY29sb3JUb1JHQkEgPSBmdW5jdGlvbiAoIHRoZUNvbG9yICkge1xuICBpZiAoICF0aGVDb2xvciApIHtcbiAgICByZXR1cm4gXCJpbmhlcml0XCI7XG4gIH1cbiAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkVmFyaWFibGVcbiAgaWYgKCB0aGVDb2xvci5hbHBoYSAhPT0gMCApIHtcbiAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRWYXJpYWJsZVxuICAgIHJldHVybiBcInJnYmEoXCIgKyB0aGVDb2xvci5yZWQgKyBcIixcIiArIHRoZUNvbG9yLmdyZWVuICsgXCIsXCIgKyB0aGVDb2xvci5ibHVlICsgXCIsXCIgKyB0aGVDb2xvci5hbHBoYSArIFwiKVwiO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcInRyYW5zcGFyZW50XCI7XG4gIH1cbn07XG4vKipcbiAqIEB0eXBlZGVmIHt7cmVkOiBOdW1iZXIsIGdyZWVuOiBOdW1iZXIsIGJsdWU6IE51bWJlciwgYWxwaGE6IE51bWJlcn19IGNvbG9yXG4gKi9cbi8qKlxuICpcbiAqIENyZWF0ZXMgYSBjb2xvciBvYmplY3Qgb2YgdGhlIGZvcm0gYHtyZWQ6ciwgZ3JlZW46ZywgYmx1ZTpiLCBhbHBoYTphfWAuXG4gKlxuICogQG1ldGhvZCBtYWtlQ29sb3JcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7TnVtYmVyfSByIC0gcmVkIGNvbXBvbmVudCAoMC0yNTUpXG4gKiBAcGFyYW0ge051bWJlcn0gZyAtIGdyZWVuIGNvbXBvbmVudCAoMC0yNTUpXG4gKiBAcGFyYW0ge051bWJlcn0gYiAtIGJsdWUgY29tcG9uZW50ICgwLTI1NSlcbiAqIEBwYXJhbSB7TnVtYmVyfSBhIC0gYWxwaGEgY29tcG9uZW50ICgwLjAtMS4wKVxuICogQHJldHVybnMge2NvbG9yfVxuICpcbiAqL1xuVUkubWFrZUNvbG9yID0gZnVuY3Rpb24gKCByLCBnLCBiLCBhICkge1xuICByZXR1cm4ge1xuICAgIHJlZDogICByLFxuICAgIGdyZWVuOiBnLFxuICAgIGJsdWU6ICBiLFxuICAgIGFscGhhOiBhXG4gIH07XG59O1xuLyoqXG4gKlxuICogQ29waWVzIGEgY29sb3IgYW5kIHJldHVybnMgaXQgc3VpdGFibGUgZm9yIG1vZGlmaWNhdGlvbi4gWW91IHNob3VsZCBjb3B5XG4gKiBjb2xvcnMgcHJpb3IgdG8gbW9kaWZpY2F0aW9uLCBvdGhlcndpc2UgeW91IHJpc2sgbW9kaWZ5aW5nIHRoZSBvcmlnaW5hbC5cbiAqXG4gKiBAbWV0aG9kIGNvcHlDb2xvclxuICogQHN0YXRpY1xuICogQHBhcmFtIHtjb2xvcn0gdGhlQ29sb3IgLSB0aGUgY29sb3IgdG8gYmUgZHVwbGljYXRlZFxuICogQHJldHVybnMge2NvbG9yfSBhIGNvbG9yIHJlYWR5IGZvciBjaGFuZ2VzXG4gKlxuICovXG5VSS5jb3B5Q29sb3IgPSBmdW5jdGlvbiAoIHRoZUNvbG9yICkge1xuICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRWYXJpYWJsZVxuICByZXR1cm4gVUkubWFrZUNvbG9yKCB0aGVDb2xvci5yZWQsIHRoZUNvbG9yLmdyZWVuLCB0aGVDb2xvci5ibHVlLCB0aGVDb2xvci5hbHBoYSApO1xufTtcbi8qKlxuICogVUkuQ09MT1JcbiAqIEBuYW1lc3BhY2UgVUlcbiAqIEBjbGFzcyBDT0xPUlxuICovXG5VSS5DT0xPUiA9IFVJLkNPTE9SIHx8IHt9O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgYmxhY2tDb2xvclxuICogQHJldHVybnMge2NvbG9yfSBhIGJsYWNrIGNvbG9yLlxuICovXG5VSS5DT0xPUi5ibGFja0NvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAwLCAwLCAwLCAxLjAgKTtcbn07XG4vKiogQHN0YXRpY1xuICogQG1ldGhvZCBkYXJrR3JheUNvbG9yXG4gKiBAcmV0dXJucyB7Y29sb3J9IGEgZGFyayBncmF5IGNvbG9yLlxuICovXG5VSS5DT0xPUi5kYXJrR3JheUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCA4NSwgODUsIDg1LCAxLjAgKTtcbn07XG4vKiogQHN0YXRpY1xuICogQG1ldGhvZCBHcmF5Q29sb3JcbiAqIEByZXR1cm5zIHtjb2xvcn0gYSBncmF5IGNvbG9yLlxuICovXG5VSS5DT0xPUi5HcmF5Q29sb3IgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBVSS5tYWtlQ29sb3IoIDEyNywgMTI3LCAxMjcsIDEuMCApO1xufTtcbi8qKiBAc3RhdGljXG4gKiBAbWV0aG9kIGxpZ2h0R3JheUNvbG9yXG4gKiBAcmV0dXJucyB7Y29sb3J9IGEgbGlnaHQgZ3JheSBjb2xvci5cbiAqL1xuVUkuQ09MT1IubGlnaHRHcmF5Q29sb3IgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBVSS5tYWtlQ29sb3IoIDE3MCwgMTcwLCAxNzAsIDEuMCApO1xufTtcbi8qKiBAc3RhdGljXG4gKiBAbWV0aG9kIHdoaXRlQ29sb3JcbiAqIEByZXR1cm5zIHtjb2xvcn0gYSB3aGl0ZSBjb2xvci5cbiAqL1xuVUkuQ09MT1Iud2hpdGVDb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFVJLm1ha2VDb2xvciggMjU1LCAyNTUsIDI1NSwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgYmx1ZUNvbG9yXG4gKiBAcmV0dXJucyB7Y29sb3J9IGEgYmx1ZSBjb2xvci5cbiAqL1xuVUkuQ09MT1IuYmx1ZUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAwLCAwLCAyNTUsIDEuMCApO1xufTtcbi8qKiBAc3RhdGljXG4gKiBAbWV0aG9kIGdyZWVuQ29sb3JcbiAqIEByZXR1cm5zIHtjb2xvcn0gYSBncmVlbiBjb2xvci5cbiAqL1xuVUkuQ09MT1IuZ3JlZW5Db2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFVJLm1ha2VDb2xvciggMCwgMjU1LCAwLCAxLjAgKTtcbn07XG4vKiogQHN0YXRpY1xuICogQG1ldGhvZCByZWRDb2xvclxuICogQHJldHVybnMge2NvbG9yfSBhIHJlZCBjb2xvci5cbiAqL1xuVUkuQ09MT1IucmVkQ29sb3IgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBVSS5tYWtlQ29sb3IoIDI1NSwgMCwgMCwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgY3lhbkNvbG9yXG4gKiBAcmV0dXJucyB7Y29sb3J9IGEgY3lhbiBjb2xvci5cbiAqL1xuVUkuQ09MT1IuY3lhbkNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAwLCAyNTUsIDI1NSwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgeWVsbG93Q29sb3JcbiAqIEByZXR1cm5zIHtjb2xvcn0gYSB5ZWxsb3cgY29sb3IuXG4gKi9cblVJLkNPTE9SLnllbGxvd0NvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAyNTUsIDI1NSwgMCwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgbWFnZW50YUNvbG9yXG4gKiBAcmV0dXJucyB7Y29sb3J9IGEgbWFnZW50YSBjb2xvci5cbiAqL1xuVUkuQ09MT1IubWFnZW50YUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAyNTUsIDAsIDI1NSwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2Qgb3JhbmdlQ29sb3JcbiAqIEByZXR1cm5zIHtjb2xvcn0gYSBvcmFuZ2UgY29sb3IuXG4gKi9cblVJLkNPTE9SLm9yYW5nZUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAyNTUsIDEyNywgMCwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgcHVycGxlQ29sb3JcbiAqIEByZXR1cm5zIHtjb2xvcn0gYSBwdXJwbGUgY29sb3IuXG4gKi9cblVJLkNPTE9SLnB1cnBsZUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAxMjcsIDAsIDEyNywgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgYnJvd25Db2xvclxuICogQHJldHVybnMge2NvbG9yfSBhIGJyb3duIGNvbG9yLlxuICovXG5VSS5DT0xPUi5icm93bkNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAxNTMsIDEwMiwgNTEsIDEuMCApO1xufTtcbi8qKiBAc3RhdGljXG4gKiBAbWV0aG9kIGxpZ2h0VGV4dENvbG9yXG4gKiBAcmV0dXJucyB7Y29sb3J9IGEgbGlnaHQgdGV4dCBjb2xvciBzdWl0YWJsZSBmb3IgZGlzcGxheSBvbiBkYXJrIGJhY2tncm91bmRzLlxuICovXG5VSS5DT0xPUi5saWdodFRleHRDb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFVJLm1ha2VDb2xvciggMjQwLCAyNDAsIDI0MCwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgZGFya1RleHRDb2xvclxuICogQHJldHVybnMge2NvbG9yfSBhIGRhcmsgdGV4dCBjb2xvciBzdWl0YWJsZSBmb3IgZGlzcGxheSBvbiBsaWdodCBiYWNrZ3JvdW5kcy5cbiAqL1xuVUkuQ09MT1IuZGFya1RleHRDb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFVJLm1ha2VDb2xvciggMTUsIDE1LCAxNSwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgY2xlYXJDb2xvclxuICogQHJldHVybnMge2NvbG9yfSBhIHRyYW5zcGFyZW50IGNvbG9yLlxuICovXG5VSS5DT0xPUi5jbGVhckNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAwLCAwLCAwLCAwLjAgKTtcbn07XG4vKipcbiAqIE1hbmFnZXMgdGhlIHJvb3QgZWxlbWVudFxuICpcbiAqIEBwcm9wZXJ0eSBfcm9vdENvbnRhaW5lclxuICogQHByaXZhdGVcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIE5vZGVcbiAqL1xuVUkuX3Jvb3RDb250YWluZXIgPSBudWxsO1xuLyoqXG4gKiBDcmVhdGVzIHRoZSByb290IGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgdmlldyBoaWVyYXJjaHlcbiAqXG4gKiBAbWV0aG9kIF9jcmVhdGVSb290Q29udGFpbmVyXG4gKiBAc3RhdGljXG4gKiBAcHJvdGVjdGVkXG4gKi9cblVJLl9jcmVhdGVSb290Q29udGFpbmVyID0gZnVuY3Rpb24gKCkge1xuICBVSS5fcm9vdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcbiAgVUkuX3Jvb3RDb250YWluZXIuY2xhc3NOYW1lID0gXCJ1aS1jb250YWluZXJcIjtcbiAgVUkuX3Jvb3RDb250YWluZXIuaWQgPSBcInJvb3RDb250YWluZXJcIjtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggVUkuX3Jvb3RDb250YWluZXIgKTtcbn07XG4vKipcbiAqIE1hbmFnZXMgdGhlIHJvb3QgdmlldyAodG9wbW9zdClcbiAqXG4gKiBAcHJvcGVydHkgX3Jvb3RWaWV3XG4gKiBAcHJpdmF0ZVxuICogQHN0YXRpY1xuICogQHR5cGUgVmlld0NvbnRhaW5lclxuICogQGRlZmF1bHQgbnVsbFxuICovXG5VSS5fcm9vdFZpZXcgPSBudWxsO1xuLyoqXG4gKiBBc3NpZ25zIGEgdmlldyB0byBiZSB0aGUgdG9wIHZpZXcgaW4gdGhlIGhpZXJhcmNoeVxuICpcbiAqIEBtZXRob2Qgc2V0Um9vdFZpZXdcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7Vmlld0NvbnRhaW5lcn0gdGhlVmlld1xuICovXG5VSS5zZXRSb290VmlldyA9IGZ1bmN0aW9uICggdGhlVmlldyApIHtcbiAgaWYgKCBVSS5fcm9vdENvbnRhaW5lciA9PT0gbnVsbCApIHtcbiAgICBVSS5fY3JlYXRlUm9vdENvbnRhaW5lcigpO1xuICB9XG4gIGlmICggVUkuX3Jvb3RWaWV3ICE9PSBudWxsICkge1xuICAgIFVJLnJlbW92ZVJvb3RWaWV3KCk7XG4gIH1cbiAgVUkuX3Jvb3RWaWV3ID0gdGhlVmlldztcbiAgVUkuX3Jvb3RWaWV3LnBhcmVudEVsZW1lbnQgPSBVSS5fcm9vdENvbnRhaW5lcjtcbn07XG4vKipcbiAqIFJlbW92ZXMgYSB2aWV3IGZyb20gdGhlIHJvb3Qgdmlld1xuICpcbiAqIEBtZXRob2QgcmVtb3ZlUm9vdFZpZXdcbiAqIEBzdGF0aWNcbiAqL1xuVUkucmVtb3ZlUm9vdFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICggVUkuX3Jvb3RWaWV3ICE9PSBudWxsICkge1xuICAgIFVJLl9yb290Vmlldy5wYXJlbnRFbGVtZW50ID0gbnVsbDtcbiAgfVxuICBVSS5fcm9vdFZpZXcgPSBudWxsO1xufTtcbi8qKlxuICpcbiAqIFJldHVybnMgdGhlIHJvb3Qgdmlld1xuICpcbiAqIEBtZXRob2QgZ2V0Um9vdFZpZXdcbiAqIEBzdGF0aWNcbiAqIEByZXR1cm5zIHtWaWV3Q29udGFpbmVyfVxuICovXG5VSS5nZXRSb290VmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFVJLl9yb290Vmlldztcbn07XG4vKipcbiAqIFRoZSByb290IHZpZXdcbiAqIEBwcm9wZXJ0eSByb290Vmlld1xuICogQHN0YXRpY1xuICogQHR5cGUgTm9kZVxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoIFVJLCBcInJvb3RWaWV3XCIsIHtcbiAgZ2V0OiBVSS5nZXRSb290VmlldyxcbiAgc2V0OiBVSS5zZXRSb290Vmlld1xufSApO1xuLyoqXG4gKiBQcml2YXRlIGJhY2sgYnV0dG9uIGhhbmRsZXIgY2xhc3NcbiAqIEBwcml2YXRlXG4gKiBAY2xhc3MgX0JhY2tCdXR0b25IYW5kbGVyXG4gKiBAcmV0dXJucyB7QmFzZU9iamVjdH1cbiAqIEBwcml2YXRlXG4gKi9cblVJLl9CYWNrQnV0dG9uSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSBuZXcgQmFzZU9iamVjdCgpO1xuICBzZWxmLnN1YmNsYXNzKCBcIkJhY2tCdXR0b25IYW5kbGVyXCIgKTtcbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJiYWNrQnV0dG9uUHJlc3NlZFwiICk7XG4gIHNlbGYuX2xhc3RCYWNrQnV0dG9uVGltZSA9IC0xO1xuICBzZWxmLmhhbmRsZUJhY2tCdXR0b24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gKCBuZXcgRGF0ZSgpICkuZ2V0VGltZSgpO1xuICAgIGlmICggc2VsZi5fbGFzdEJhY2tCdXR0b25UaW1lIDwgY3VycmVudFRpbWUgLSAxMDAwICkge1xuICAgICAgc2VsZi5fbGFzdEJhY2tCdXR0b25UaW1lID0gKCBuZXcgRGF0ZSgpICkuZ2V0VGltZSgpO1xuICAgICAgc2VsZi5ub3RpZnlNb3N0UmVjZW50KCBcImJhY2tCdXR0b25QcmVzc2VkXCIgKTtcbiAgICB9XG4gIH07XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiYmFja2J1dHRvblwiLCBzZWxmLmhhbmRsZUJhY2tCdXR0b24sIGZhbHNlICk7XG4gIHJldHVybiBzZWxmO1xufTtcbi8qKlxuICpcbiAqIEdsb2JhbCBCYWNrIEJ1dHRvbiBIYW5kbGVyIE9iamVjdFxuICpcbiAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIHRoZSBiYWNrQnV0dG9uUHJlc3NlZCBub3RpZmljYXRpb24gaW4gb3JkZXJcbiAqIHRvIGJlIG5vdGlmaWVkIHdoZW4gdGhlIGJhY2sgYnV0dG9uIGlzIHByZXNzZWQuXG4gKlxuICogQXBwbGllcyBvbmx5IHRvIGEgcGh5c2ljYWwgYmFjayBidXR0b24sIG5vdCBvbmUgb24gdGhlIHNjcmVlbi5cbiAqXG4gKiBAcHJvcGVydHkgYmFja0J1dHRvblxuICogQHN0YXRpY1xuICogQGZpbmFsXG4gKiBAdHlwZSBfQmFja0J1dHRvbkhhbmRsZXJcbiAqL1xuVUkuYmFja0J1dHRvbiA9IG5ldyBVSS5fQmFja0J1dHRvbkhhbmRsZXIoKTtcbi8qKlxuICogUHJpdmF0ZSBvcmllbnRhdGlvbiBoYW5kbGVyIGNsYXNzXG4gKiBAY2xhc3MgX09yaWVudGF0aW9uSGFuZGxlclxuICogQHJldHVybnMge0Jhc2VPYmplY3R9XG4gKiBAcHJpdmF0ZVxuICovXG5VSS5fT3JpZW50YXRpb25IYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IG5ldyBCYXNlT2JqZWN0KCk7XG4gIHNlbGYuc3ViY2xhc3MoIFwiT3JpZW50YXRpb25IYW5kbGVyXCIgKTtcbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJvcmllbnRhdGlvbkNoYW5nZWRcIiApO1xuICBzZWxmLmhhbmRsZU9yaWVudGF0aW9uQ2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJPcmllbnRhdGlvbixcbiAgICAgIGN1ckZvcm1GYWN0b3IsXG4gICAgICBjdXJTY2FsZSxcbiAgICAgIGN1ckNvbnZlbmllbmNlLFxuICAgICAgY3VyRGV2aWNlID0gdGhlRGV2aWNlLnBsYXRmb3JtKCksXG4gICAgICBPU0xldmVsO1xuICAgIHN3aXRjaCAoIGN1ckRldmljZSApIHtcbiAgICAgIGNhc2UgXCJtYWNcIjpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBPU0xldmVsID0gXCJcIiArIHBhcnNlRmxvYXQoICggbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCggL09TIFggKFswLTlfXSspLyApWzFdICkucmVwbGFjZSggL18vZywgXCIuXCIgKSApO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoICggZSApIHt9XG4gICAgICAgIGlmICggT1NMZXZlbCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgIGN1ckRldmljZSArPSBcIiBtYWNcIiArICggT1NMZXZlbC5sZW5ndGggPCA1ID8gXCJDXCIgOiBcIk1cIiApO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImlvc1wiOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIE9TTGV2ZWwgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKCAvT1MgKFswLTldKykvIClbMV07XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKCBlICkge31cbiAgICAgICAgaWYgKCBPU0xldmVsICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgY3VyRGV2aWNlICs9IFwiIGlvc1wiICsgT1NMZXZlbCArIFwiIGlvc1wiICsgKCBPU0xldmVsIDwgNyA/IFwiQ1wiIDogXCJNXCIgKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJhbmRyb2lkXCI6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgT1NMZXZlbCA9IHBhcnNlRmxvYXQoIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goIC9BbmRyb2lkIChbMC05Ll0rKS8gKVsxXSApO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoICggZSApIHt9XG4gICAgICAgIGlmICggT1NMZXZlbCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgIGN1ckRldmljZSArPSBcIiBhbmRyb2lkXCIgKyAoIFwiXCIgKyBPU0xldmVsICkucmVwbGFjZSggL1xcLi9nLCBcIi1cIiApICsgXCIgYW5kcm9pZFwiICsgKCAoIE9TTGV2ZWwgPCA0LjQgKSA/IFwiQ1wiIDogKCAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPU0xldmVsID49IDUgKSA/IFwiTVwiIDogXCJLXCIgKSApXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgIH1cbiAgICAvKlxuICAgICBpZiAoIGN1ckRldmljZSA9PT0gXCJpb3NcIiApIHtcbiAgICAgaWYgKCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoIFwiT1MgOVwiICkgPiAtMSApIHtcbiAgICAgY3VyRGV2aWNlICs9IFwiIGlvczkgaW9zTVwiO1xuICAgICB9XG4gICAgIGlmICggbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCBcIk9TIDhcIiApID4gLTEgKSB7XG4gICAgIGN1ckRldmljZSArPSBcIiBpb3M4IGlvc01cIjtcbiAgICAgfVxuICAgICBpZiAoIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZiggXCJPUyA3XCIgKSA+IC0xICkge1xuICAgICBjdXJEZXZpY2UgKz0gXCIgaW9zNyBpb3NNXCI7XG4gICAgIH1cbiAgICAgaWYgKCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoIFwiT1MgNlwiICkgPiAtMSApIHtcbiAgICAgY3VyRGV2aWNlICs9IFwiIGlvczYgaW9zQ1wiO1xuICAgICB9XG4gICAgIGlmICggbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCBcIk9TIDVcIiApID4gLTEgKSB7XG4gICAgIGN1ckRldmljZSArPSBcIiBpb3M1IGlvc0NcIjtcbiAgICAgfVxuICAgICB9ICovXG4gICAgY3VyRm9ybUZhY3RvciA9IHRoZURldmljZS5mb3JtRmFjdG9yKCk7XG4gICAgY3VyT3JpZW50YXRpb24gPSB0aGVEZXZpY2UuaXNQb3J0cmFpdCgpID8gXCJwb3J0cmFpdFwiIDogXCJsYW5kc2NhcGVcIjtcbiAgICBjdXJTY2FsZSA9IHRoZURldmljZS5pc1JldGluYSgpID8gXCJoaURQSVwiIDogXCJsb0RQSVwiO1xuICAgIGN1clNjYWxlICs9IFwiIHNjYWxlXCIgKyB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyArIFwieFwiO1xuICAgIGN1ckNvbnZlbmllbmNlID0gXCJcIjtcbiAgICBpZiAoIHRoZURldmljZS5pUGFkKCkgKSB7XG4gICAgICBjdXJDb252ZW5pZW5jZSA9IFwiaXBhZFwiO1xuICAgIH1cbiAgICBpZiAoIHRoZURldmljZS5pUGhvbmUoKSApIHtcbiAgICAgIGN1ckNvbnZlbmllbmNlID0gXCJpcGhvbmVcIjtcbiAgICB9XG4gICAgaWYgKCB0aGVEZXZpY2UuZHJvaWRUYWJsZXQoKSApIHtcbiAgICAgIGN1ckNvbnZlbmllbmNlID0gXCJkcm9pZC10YWJsZXRcIjtcbiAgICB9XG4gICAgaWYgKCB0aGVEZXZpY2UuZHJvaWRQaG9uZSgpICkge1xuICAgICAgY3VyQ29udmVuaWVuY2UgPSBcImRyb2lkLXBob25lXCI7XG4gICAgfVxuICAgIGlmICggdHlwZW9mIGRvY3VtZW50LmJvZHkgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnQuYm9keSAhPT0gbnVsbCApIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCBcImNsYXNzXCIsIFtjdXJEZXZpY2UsIGN1ckZvcm1GYWN0b3IsIGN1ck9yaWVudGF0aW9uLCBjdXJTY2FsZSwgY3VyQ29udmVuaWVuY2VdLmpvaW4oXG4gICAgICAgIFwiIFwiICkgKTtcbiAgICB9XG4gICAgc2VsZi5ub3RpZnkoIFwib3JpZW50YXRpb25DaGFuZ2VkXCIgKTtcbiAgfTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoIFwib3JpZW50YXRpb25jaGFuZ2VcIiwgc2VsZi5oYW5kbGVPcmllbnRhdGlvbkNoYW5nZSwgZmFsc2UgKTtcbiAgaWYgKCB0eXBlb2YgZG9jdW1lbnQuYm9keSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudC5ib2R5ICE9PSBudWxsICkge1xuICAgIHNlbGYuaGFuZGxlT3JpZW50YXRpb25DaGFuZ2UoKTtcbiAgfSBlbHNlIHtcbiAgICBzZXRUaW1lb3V0KCBzZWxmLmhhbmRsZU9yaWVudGF0aW9uQ2hhbmdlLCAwICk7XG4gIH1cbiAgcmV0dXJuIHNlbGY7XG59O1xuLyoqXG4gKlxuICogR2xvYmFsIE9yaWVudGF0aW9uIEhhbmRsZXIgT2JqZWN0XG4gKlxuICogUmVnaXN0ZXIgYSBsaXN0ZW5lciBmb3IgdGhlIG9yaWVudGF0aW9uQ2hhbmdlZCBub3RpZmljYXRpb24gaW4gb3JkZXJcbiAqIHRvIGJlIG5vdGlmaWVkIHdoZW4gdGhlIG9yaWVudGF0aW9uIGNoYW5nZXMuXG4gKlxuICogQHByb3BlcnR5IG9yaWVudGF0aW9uSGFuZGxlclxuICogQHN0YXRpY1xuICogQGZpbmFsXG4gKiBAdHlwZSBfT3JpZW50YXRpb25IYW5kbGVyXG4gKi9cblVJLm9yaWVudGF0aW9uSGFuZGxlciA9IG5ldyBVSS5fT3JpZW50YXRpb25IYW5kbGVyKCk7XG4vKipcbiAqXG4gKiBHbG9iYWwgTm90aWZpY2F0aW9uIE9iamVjdCAtLSB1c2VkIGZvciBzZW5kaW5nIGFuZCByZWNlaXZpbmcgZ2xvYmFsIG5vdGlmaWNhdGlvbnNcbiAqXG4gKiBAcHJvcGVydHkgZ2xvYmFsTm90aWZpY2F0aW9uc1xuICogQHN0YXRpY1xuICogQGZpbmFsXG4gKiBAdHlwZSBCYXNlT2JqZWN0XG4gKi9cblVJLmdsb2JhbE5vdGlmaWNhdGlvbnMgPSBuZXcgQmFzZU9iamVjdCgpO1xuLyoqXG4gKiBDcmVhdGUgdGhlIHJvb3QgY29udGFpbmVyXG4gKi9cbmlmICggdHlwZW9mIGRvY3VtZW50LmJvZHkgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnQuYm9keSAhPT0gbnVsbCApIHtcbiAgVUkuX2NyZWF0ZVJvb3RDb250YWluZXIoKTtcbn0gZWxzZSB7XG4gIHNldFRpbWVvdXQoIFVJLl9jcmVhdGVSb290Q29udGFpbmVyLCAwICk7XG59XG4vLyBoZWxwZXIgbWV0aG9kcyBvbiBOb2Rlc1xuTm9kZS5wcm90b3R5cGUuJHMgPSBVSS5zdHlsZUVsZW1lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IFVJO1xuIiwiLyoqXG4gKlxuICogQmFzaWMgY3Jvc3MtcGxhdGZvcm0gbW9iaWxlIEV2ZW50IEhhbmRsaW5nIGZvciBZQVNNRlxuICpcbiAqIEBtb2R1bGUgZXZlbnRzLmpzXG4gKiBAYXV0aG9yIEtlcnJpIFNob3R0c1xuICogQHZlcnNpb24gMC40XG4gKiBgYGBcbiAqIENvcHlyaWdodCAoYykgMjAxMyBLZXJyaSBTaG90dHMsIHBob3RvS2FuZHkgU3R1ZGlvcyBMTENcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZ1xuICogY29uZGl0aW9uczpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXNcbiAqIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVJcbiAqIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlRcbiAqIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gKiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKiBgYGBcbiAqL1xuLypnbG9iYWwgZGVmaW5lKi9cblwidXNlIHN0cmljdFwiO1xudmFyIHRoZURldmljZSA9IHJlcXVpcmUoIFwiLi4vdXRpbC9kZXZpY2VcIiApO1xuLyoqXG4gKiBUcmFuc2xhdGVzIHRvdWNoIGV2ZW50cyB0byBtb3VzZSBldmVudHMgaWYgdGhlIHBsYXRmb3JtIGRvZXNuJ3Qgc3VwcG9ydFxuICogdG91Y2ggZXZlbnRzLiBMZWF2ZXMgb3RoZXIgZXZlbnRzIHVuYWZmZWN0ZWQuXG4gKlxuICogQG1ldGhvZCBfdHJhbnNsYXRlRXZlbnRcbiAqIEBzdGF0aWNcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gdGhlRXZlbnQgLSB0aGUgZXZlbnQgbmFtZSB0byB0cmFuc2xhdGVcbiAqL1xudmFyIF90cmFuc2xhdGVFdmVudCA9IGZ1bmN0aW9uICggdGhlRXZlbnQgKSB7XG4gIHZhciB0aGVUcmFuc2xhdGVkRXZlbnQgPSB0aGVFdmVudDtcbiAgaWYgKCAhdGhlVHJhbnNsYXRlZEV2ZW50ICkge1xuICAgIHJldHVybiB0aGVUcmFuc2xhdGVkRXZlbnQ7XG4gIH1cbiAgdmFyIHBsYXRmb3JtID0gdGhlRGV2aWNlLnBsYXRmb3JtKCk7XG4gIHZhciBub25Ub3VjaFBsYXRmb3JtID0gKCBwbGF0Zm9ybSA9PT0gXCJ3aW5jZVwiIHx8IHBsYXRmb3JtID09PSBcInVua25vd25cIiB8fCBwbGF0Zm9ybSA9PT0gXCJtYWNcIiB8fCBwbGF0Zm9ybSA9PT0gXCJ3aW5kb3dzXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXRmb3JtID09PSBcImxpbnV4XCIgKTtcbiAgaWYgKCBub25Ub3VjaFBsYXRmb3JtICYmIHRoZVRyYW5zbGF0ZWRFdmVudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoIFwidG91Y2hcIiApID4gLTEgKSB7XG4gICAgdGhlVHJhbnNsYXRlZEV2ZW50ID0gdGhlVHJhbnNsYXRlZEV2ZW50LnJlcGxhY2UoIFwidG91Y2hcIiwgXCJtb3VzZVwiICk7XG4gICAgdGhlVHJhbnNsYXRlZEV2ZW50ID0gdGhlVHJhbnNsYXRlZEV2ZW50LnJlcGxhY2UoIFwic3RhcnRcIiwgXCJkb3duXCIgKTtcbiAgICB0aGVUcmFuc2xhdGVkRXZlbnQgPSB0aGVUcmFuc2xhdGVkRXZlbnQucmVwbGFjZSggXCJlbmRcIiwgXCJ1cFwiICk7XG4gIH1cbiAgcmV0dXJuIHRoZVRyYW5zbGF0ZWRFdmVudDtcbn07XG52YXIgZXZlbnQgPSB7fTtcbi8qKlxuICogQHR5cGVkZWYge3tfb3JpZ2luYWxFdmVudDogRXZlbnQsIHRvdWNoZXM6IEFycmF5LCB4OiBudW1iZXIsIHk6IG51bWJlciwgYXZnWDogbnVtYmVyLCBhdmdZOiBudW1iZXIsIGVsZW1lbnQ6IChFdmVudFRhcmdldHxPYmplY3QpLCB0YXJnZXQ6IE5vZGV9fSBOb3JtYWxpemVkRXZlbnRcbiAqL1xuLyoqXG4gKlxuICogQ3JlYXRlcyBhbiBldmVudCBvYmplY3QgZnJvbSBhIERPTSBldmVudC5cbiAqXG4gKiBUaGUgZXZlbnQgcmV0dXJuZWQgY29udGFpbnMgYWxsIHRoZSB0b3VjaGVzIGZyb20gdGhlIERPTSBldmVudCBpbiBhbiBhcnJheSBvZiB7eCx5fSBvYmplY3RzLlxuICogVGhlIGV2ZW50IGFsc28gY29udGFpbnMgdGhlIGZpcnN0IHRvdWNoIGFzIHgseSBwcm9wZXJ0aWVzIGFuZCB0aGUgYXZlcmFnZSBvZiBhbGwgdG91Y2hlc1xuICogYXMgYXZnWCxhdmdZLiBJZiBubyB0b3VjaGVzIGFyZSBpbiB0aGUgZXZlbnQsIHRoZXNlIHZhbHVlcyB3aWxsIGJlIC0xLlxuICpcbiAqIEBtZXRob2QgbWFrZUV2ZW50XG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge05vZGV9IHRoYXQgLSBgdGhpc2A7IHdoYXQgZmlyZXMgdGhlIGV2ZW50XG4gKiBAcGFyYW0ge0V2ZW50fSBlIC0gdGhlIERPTSBldmVudFxuICogQHJldHVybnMge05vcm1hbGl6ZWRFdmVudH1cbiAqXG4gKi9cbmV2ZW50LmNvbnZlcnQgPSBmdW5jdGlvbiAoIHRoYXQsIGUgKSB7XG4gIGlmICggdHlwZW9mIGUgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgZSA9IHdpbmRvdy5ldmVudDtcbiAgfVxuICB2YXIgbmV3RXZlbnQgPSB7XG4gICAgX29yaWdpbmFsRXZlbnQ6IGUsXG4gICAgdG91Y2hlczogICAgICAgIFtdLFxuICAgIHg6ICAgICAgICAgICAgICAtMSxcbiAgICB5OiAgICAgICAgICAgICAgLTEsXG4gICAgYXZnWDogICAgICAgICAgIC0xLFxuICAgIGF2Z1k6ICAgICAgICAgICAtMSxcbiAgICBlbGVtZW50OiAgICAgICAgZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50LFxuICAgIHRhcmdldDogICAgICAgICB0aGF0XG4gIH07XG4gIGlmICggZS50b3VjaGVzICkge1xuICAgIHZhciBhdmdYVG90YWwgPSAwO1xuICAgIHZhciBhdmdZVG90YWwgPSAwO1xuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IGUudG91Y2hlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIG5ld0V2ZW50LnRvdWNoZXMucHVzaCgge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGUudG91Y2hlc1tpXS5jbGllbnRYLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGUudG91Y2hlc1tpXS5jbGllbnRZXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgIGF2Z1hUb3RhbCArPSBlLnRvdWNoZXNbaV0uY2xpZW50WDtcbiAgICAgIGF2Z1lUb3RhbCArPSBlLnRvdWNoZXNbaV0uY2xpZW50WTtcbiAgICAgIGlmICggaSA9PT0gMCApIHtcbiAgICAgICAgbmV3RXZlbnQueCA9IGUudG91Y2hlc1tpXS5jbGllbnRYO1xuICAgICAgICBuZXdFdmVudC55ID0gZS50b3VjaGVzW2ldLmNsaWVudFk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICggZS50b3VjaGVzLmxlbmd0aCA+IDAgKSB7XG4gICAgICBuZXdFdmVudC5hdmdYID0gYXZnWFRvdGFsIC8gZS50b3VjaGVzLmxlbmd0aDtcbiAgICAgIG5ld0V2ZW50LmF2Z1kgPSBhdmdZVG90YWwgLyBlLnRvdWNoZXMubGVuZ3RoO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoIGV2ZW50LnBhZ2VYICkge1xuICAgICAgbmV3RXZlbnQudG91Y2hlcy5wdXNoKCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZS5wYWdlWCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBlLnBhZ2VZXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgIG5ld0V2ZW50LnggPSBlLnBhZ2VYO1xuICAgICAgbmV3RXZlbnQueSA9IGUucGFnZVk7XG4gICAgICBuZXdFdmVudC5hdmdYID0gZS5wYWdlWDtcbiAgICAgIG5ld0V2ZW50LmF2Z1kgPSBlLnBhZ2VZO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3RXZlbnQ7XG59O1xuLyoqXG4gKlxuICogQ2FuY2VscyBhbiBldmVudCB0aGF0J3MgYmVlbiBjcmVhdGVkIHVzaW5nIHtAbGluayBldmVudC5jb252ZXJ0fS5cbiAqXG4gKiBAbWV0aG9kIGNhbmNlbEV2ZW50XG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge05vcm1hbGl6ZWRFdmVudH0gZSAtIHRoZSBldmVudCB0byBjYW5jZWxcbiAqXG4gKi9cbmV2ZW50LmNhbmNlbCA9IGZ1bmN0aW9uICggZSApIHtcbiAgaWYgKCBlLl9vcmlnaW5hbEV2ZW50LmNhbmNlbEJ1YmJsZSApIHtcbiAgICBlLl9vcmlnaW5hbEV2ZW50LmNhbmNlbEJ1YmJsZSgpO1xuICB9XG4gIGlmICggZS5fb3JpZ2luYWxFdmVudC5zdG9wUHJvcGFnYXRpb24gKSB7XG4gICAgZS5fb3JpZ2luYWxFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxuICBpZiAoIGUuX29yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQgKSB7XG4gICAgZS5fb3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9IGVsc2Uge1xuICAgIGUuX29yaWdpbmFsRXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgfVxufTtcbi8qKlxuICogQWRkcyBhIHRvdWNoIGxpc3RlbmVyIHRvIHRoZUVsZW1lbnQsIGNvbnZlcnRpbmcgdG91Y2ggZXZlbnRzIGZvciBXUDcuXG4gKlxuICogQG1ldGhvZCBhZGRFdmVudExpc3RlbmVyXG4gKiBAcGFyYW0ge05vZGV9IHRoZUVsZW1lbnQgIHRoZSBlbGVtZW50IHRvIGF0dGFjaCB0aGUgZXZlbnQgdG9cbiAqIEBwYXJhbSB7U3RyaW5nfSB0aGVFdmVudCAgdGhlIGV2ZW50IHRvIGhhbmRsZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gdGhlRnVuY3Rpb24gIHRoZSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGV2ZW50IGlzIGZpcmVkXG4gKlxuICovXG5ldmVudC5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uICggdGhlRWxlbWVudCwgdGhlRXZlbnQsIHRoZUZ1bmN0aW9uICkge1xuICB2YXIgdGhlVHJhbnNsYXRlZEV2ZW50ID0gX3RyYW5zbGF0ZUV2ZW50KCB0aGVFdmVudC50b0xvd2VyQ2FzZSgpICk7XG4gIHRoZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggdGhlVHJhbnNsYXRlZEV2ZW50LCB0aGVGdW5jdGlvbiwgZmFsc2UgKTtcbn07XG4vKipcbiAqIFJlbW92ZXMgYSB0b3VjaCBsaXN0ZW5lciBhZGRlZCBieSBhZGRUb3VjaExpc3RlbmVyXG4gKlxuICogQG1ldGhvZCByZW1vdmVFdmVudExpc3RlbmVyXG4gKiBAcGFyYW0ge05vZGV9IHRoZUVsZW1lbnQgIHRoZSBlbGVtZW50IHRvIHJlbW92ZSBhbiBldmVudCBmcm9tXG4gKiBAcGFyYW0ge1N0cmluZ30gdGhlRXZlbnQgIHRoZSBldmVudCB0byByZW1vdmVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRoZUZ1bmN0aW9uICB0aGUgZnVuY3Rpb24gdG8gcmVtb3ZlXG4gKlxuICovXG5ldmVudC5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uICggdGhlRWxlbWVudCwgdGhlRXZlbnQsIHRoZUZ1bmN0aW9uICkge1xuICB2YXIgdGhlVHJhbnNsYXRlZEV2ZW50ID0gX3RyYW5zbGF0ZUV2ZW50KCB0aGVFdmVudC50b0xvd2VyQ2FzZSgpICk7XG4gIHRoZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggdGhlVHJhbnNsYXRlZEV2ZW50LCB0aGVGdW5jdGlvbiApO1xufTtcbm1vZHVsZS5leHBvcnRzID0gZXZlbnQ7XG4iLCIvKipcbiAqXG4gKiBOYXZpZ2F0aW9uIENvbnRyb2xsZXJzIHByb3ZpZGUgYmFzaWMgc3VwcG9ydCBmb3IgdmlldyBzdGFjayBtYW5hZ2VtZW50IChhcyBpbiBwdXNoLCBwb3ApXG4gKlxuICogQG1vZHVsZSBuYXZpZ2F0aW9uQ29udHJvbGxlci5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNVxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKi9cbi8qZ2xvYmFsIG1vZHVsZSovXG5cInVzZSBzdHJpY3RcIjtcbnZhciBVSSA9IHJlcXVpcmUoIFwiLi9jb3JlXCIgKSxcbiAgVmlld0NvbnRhaW5lciA9IHJlcXVpcmUoIFwiLi92aWV3Q29udGFpbmVyXCIgKSxcbiAgVVRJTCA9IHJlcXVpcmUoIFwiLi4vdXRpbC9jb3JlXCIgKTtcbnZhciBfY2xhc3NOYW1lID0gXCJOYXZpZ2F0aW9uQ29udHJvbGxlclwiLFxuICBOYXZpZ2F0aW9uQ29udHJvbGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IG5ldyBWaWV3Q29udGFpbmVyKCk7XG4gICAgc2VsZi5zdWJjbGFzcyggX2NsYXNzTmFtZSApO1xuICAgIC8vICMgTm90aWZpY2F0aW9uc1xuICAgIC8vXG4gICAgLy8gKiBgdmlld1B1c2hlZGAgaXMgZmlyZWQgd2hlbiBhIHZpZXcgaXMgcHVzaGVkIG9udG8gdGhlIHZpZXcgc3RhY2suIFRoZSB2aWV3IHB1c2hlZCBpcyBwYXNzZWQgYXMgYSBwYXJhbWV0ZXIuXG4gICAgLy8gKiBgdmlld1BvcHBlZGAgaXMgZmlyZWQgd2hlbiBhIHZpZXcgaXMgcG9wcGVkIG9mZiB0aGUgdmlldyBzdGFjay4gVGhlIHZpZXcgcG9wcGVkIGlzIHBhc3NlZCBhcyBhIHBhcmFtZXRlci5cbiAgICAvL1xuICAgIHNlbGYucmVnaXN0ZXJOb3RpZmljYXRpb24oIFwidmlld1B1c2hlZFwiICk7XG4gICAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJ2aWV3UG9wcGVkXCIgKTtcbiAgICAvKipcbiAgICAgKiBUaGUgYXJyYXkgb2Ygdmlld3MgdGhhdCB0aGlzIG5hdmlnYXRpb24gY29udHJvbGxlciBtYW5hZ2VzLlxuICAgICAqIEBwcm9wZXJ0eSBzdWJ2aWV3c1xuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICBzZWxmLmRlZmluZVByb3BlcnR5KCBcInN1YnZpZXdzXCIsIHtcbiAgICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgICB3cml0ZTogICBmYWxzZSxcbiAgICAgIGRlZmF1bHQ6IFtdXG4gICAgfSApO1xuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyB0aGUgY3VycmVudCB0b3Agdmlld1xuICAgICAqIEBwcm9wZXJ0eSB0b3BWaWV3XG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBzZWxmLmdldFRvcFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIHNlbGYuX3N1YnZpZXdzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgIHJldHVybiBzZWxmLl9zdWJ2aWV3c1tzZWxmLl9zdWJ2aWV3cy5sZW5ndGggLSAxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH07XG4gICAgc2VsZi5kZWZpbmVQcm9wZXJ0eSggXCJ0b3BWaWV3XCIsIHtcbiAgICAgIHJlYWQ6ICAgICAgICAgICAgdHJ1ZSxcbiAgICAgIHdyaXRlOiAgICAgICAgICAgZmFsc2UsXG4gICAgICBiYWNraW5nVmFyaWFibGU6IGZhbHNlXG4gICAgfSApO1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGluaXRpYWwgdmlldyBpbiB0aGUgdmlldyBzdGFja1xuICAgICAqIEBwcm9wZXJ0eSByb290Vmlld1xuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgc2VsZi5nZXRSb290VmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICggc2VsZi5fc3Vidmlld3MubGVuZ3RoID4gMCApIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX3N1YnZpZXdzWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfTtcbiAgICBzZWxmLnNldFJvb3RWaWV3ID0gZnVuY3Rpb24gKCB0aGVOZXdSb290ICkge1xuICAgICAgaWYgKCBzZWxmLl9zdWJ2aWV3cy5sZW5ndGggPiAwICkge1xuICAgICAgICAvLyBtdXN0IHJlbW92ZSBhbGwgdGhlIHN1YnZpZXdzIGZyb20gdGhlIERPTVxuICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBzZWxmLl9zdWJ2aWV3cy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICB2YXIgdGhlUG9wcGluZ1ZpZXcgPSBzZWxmLl9zdWJ2aWV3c1tpXTtcbiAgICAgICAgICB0aGVQb3BwaW5nVmlldy5ub3RpZnkoIFwidmlld1dpbGxEaXNhcHBlYXJcIiApO1xuICAgICAgICAgIGlmICggaSA9PT0gMCApIHtcbiAgICAgICAgICAgIHRoZVBvcHBpbmdWaWV3LmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggXCJ1aS1yb290LXZpZXdcIiApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGVQb3BwaW5nVmlldy5wYXJlbnRFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICB0aGVQb3BwaW5nVmlldy5ub3RpZnkoIFwidmlld0RpZERpc2FwcGVhclwiICk7XG4gICAgICAgICAgdGhlUG9wcGluZ1ZpZXcubm90aWZ5KCBcInZpZXdXYXNQb3BwZWRcIiApO1xuICAgICAgICAgIGRlbGV0ZSB0aGVQb3BwaW5nVmlldy5uYXZpZ2F0aW9uQ29udHJvbGxlcjtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLl9zdWJ2aWV3cyA9IFtdO1xuICAgICAgfVxuICAgICAgc2VsZi5fc3Vidmlld3MucHVzaCggdGhlTmV3Um9vdCApOyAvLyBhZGQgaXQgdG8gb3VyIHZpZXdzXG4gICAgICB0aGVOZXdSb290Lm5hdmlnYXRpb25Db250cm9sbGVyID0gc2VsZjtcbiAgICAgIHRoZU5ld1Jvb3Qubm90aWZ5KCBcInZpZXdXYXNQdXNoZWRcIiApO1xuICAgICAgdGhlTmV3Um9vdC5ub3RpZnkoIFwidmlld1dpbGxBcHBlYXJcIiApOyAvLyBub3RpZnkgdGhlIHZpZXdcbiAgICAgIHRoZU5ld1Jvb3QucGFyZW50RWxlbWVudCA9IHNlbGYuZWxlbWVudDsgLy8gYW5kIG1ha2UgdXMgdGhlIHBhcmVudFxuICAgICAgdGhlTmV3Um9vdC5lbGVtZW50LmNsYXNzTGlzdC5hZGQoIFwidWktcm9vdC12aWV3XCIgKTtcbiAgICAgIHRoZU5ld1Jvb3Qubm90aWZ5KCBcInZpZXdEaWRBcHBlYXJcIiApOyAvLyBhbmQgbm90aWZ5IGl0IHRoYXQgaXQncyBhY3R1YWxseSB0aGVyZS5cbiAgICB9O1xuICAgIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwicm9vdFZpZXdcIiwge1xuICAgICAgcmVhZDogICAgICAgICAgICB0cnVlLFxuICAgICAgd3JpdGU6ICAgICAgICAgICB0cnVlLFxuICAgICAgYmFja2luZ1ZhcmlhYmxlOiBmYWxzZVxuICAgIH0gKTtcbiAgICBzZWxmLmRlZmluZVByb3BlcnR5KCBcIm1vZGFsXCIsIHtcbiAgICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgICB3cml0ZTogICBmYWxzZSxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSApO1xuICAgIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwibW9kYWxWaWV3XCIsIHtcbiAgICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgICB3cml0ZTogICBmYWxzZSxcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICB9ICk7XG4gICAgc2VsZi5kZWZpbmVQcm9wZXJ0eSggXCJtb2RhbFZpZXdUeXBlXCIsIHtcbiAgICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgICB3cml0ZTogICBmYWxzZSxcbiAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICB9ICk7XG4gICAgc2VsZi5fbW9kYWxDbGlja1ByZXZlbnRlciA9IG51bGw7XG4gICAgc2VsZi5fcHJldmVudENsaWNrcyA9IG51bGw7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGNsaWNrLXByZXZlbnRpb24gZWxlbWVudCAtLSBlc3NlbnRpYWxseSBhIHRyYW5zcGFyZW50IERJViB0aGF0XG4gICAgICogZmlsbHMgdGhlIHNjcmVlbi5cbiAgICAgKiBAbWV0aG9kIF9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBzZWxmLl9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5jcmVhdGVFbGVtZW50SWZOb3RDcmVhdGVkKCk7XG4gICAgICBzZWxmLl9wcmV2ZW50Q2xpY2tzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgICAgc2VsZi5fcHJldmVudENsaWNrcy5jbGFzc05hbWUgPSBcInVpLXByZXZlbnQtY2xpY2tzXCI7XG4gICAgICBzZWxmLmVsZW1lbnQuYXBwZW5kQ2hpbGQoIHNlbGYuX3ByZXZlbnRDbGlja3MgKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIGNsaWNrLXByZXZlbnRpb24gZWxlbWVudCBpZiBuZWNlc3NhcnlcbiAgICAgKiBAbWV0aG9kIF9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50SWZOb3RDcmVhdGVkXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBzZWxmLl9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50SWZOb3RDcmVhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCBzZWxmLl9wcmV2ZW50Q2xpY2tzID09PSBudWxsICkge1xuICAgICAgICBzZWxmLl9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50KCk7XG4gICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBwdXNoIGEgdmlldyBvbnRvIHRoZSB2aWV3IHN0YWNrLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBwdXNoVmlld1xuICAgICAqIEBwYXJhbSB7Vmlld0NvbnRhaW5lcn0gYVZpZXdcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFt3aXRoQW5pbWF0aW9uXSBEZXRlcm1pbmUgaWYgdGhlIHZpZXcgc2hvdWxkIGJlIHB1c2hlZCB3aXRoIGFuIGFuaW1hdGlvbiwgZGVmYXVsdCBpcyBgdHJ1ZWBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3dpdGhEZWxheV0gTnVtYmVyIG9mIHNlY29uZHMgZm9yIHRoZSBhbmltYXRpb24sIGRlZmF1bHQgaXMgYDAuM2BcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW3dpdGhUeXBlXSBDU1MgQW5pbWF0aW9uLCBkZWZhdWx0IGlzIGBlYXNlLWluLW91dGBcbiAgICAgKi9cbiAgICBzZWxmLnB1c2hWaWV3ID0gZnVuY3Rpb24gKCBhVmlldywgd2l0aEFuaW1hdGlvbiwgd2l0aERlbGF5LCB3aXRoVHlwZSApIHtcbiAgICAgIHZhciB0aGVIaWRpbmdWaWV3ID0gc2VsZi50b3BWaWV3LFxuICAgICAgICB0aGVTaG93aW5nVmlldyA9IGFWaWV3LFxuICAgICAgICB1c2luZ0FuaW1hdGlvbiA9IHRydWUsXG4gICAgICAgIGFuaW1hdGlvbkRlbGF5ID0gMC4zLFxuICAgICAgICBhbmltYXRpb25UeXBlID0gXCJlYXNlLWluLW91dFwiO1xuICAgICAgaWYgKCB0eXBlb2Ygd2l0aEFuaW1hdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgdXNpbmdBbmltYXRpb24gPSB3aXRoQW5pbWF0aW9uO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygd2l0aERlbGF5ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBhbmltYXRpb25EZWxheSA9IHdpdGhEZWxheTtcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIHdpdGhUeXBlICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBhbmltYXRpb25UeXBlID0gd2l0aFR5cGU7XG4gICAgICB9XG4gICAgICBpZiAoICF1c2luZ0FuaW1hdGlvbiApIHtcbiAgICAgICAgYW5pbWF0aW9uRGVsYXkgPSAwO1xuICAgICAgfVxuICAgICAgLy8gYWRkIHRoZSB2aWV3IHRvIG91ciBhcnJheSwgYXQgdGhlIGVuZFxuICAgICAgc2VsZi5fc3Vidmlld3MucHVzaCggdGhlU2hvd2luZ1ZpZXcgKTtcbiAgICAgIHRoZVNob3dpbmdWaWV3Lm5hdmlnYXRpb25Db250cm9sbGVyID0gc2VsZjtcbiAgICAgIHRoZVNob3dpbmdWaWV3Lm5vdGlmeSggXCJ2aWV3V2FzUHVzaGVkXCIgKTtcbiAgICAgIC8vIGdldCBlYWNoIGVsZW1lbnQncyB6LWluZGV4LCBpZiBzcGVjaWZpZWRcbiAgICAgIHZhciB0aGVIaWRpbmdWaWV3WiA9IHBhcnNlSW50KCBnZXRDb21wdXRlZFN0eWxlKCB0aGVIaWRpbmdWaWV3LmVsZW1lbnQgKS5nZXRQcm9wZXJ0eVZhbHVlKCBcInotaW5kZXhcIiApIHx8IFwiMFwiLCAxMCApLFxuICAgICAgICB0aGVTaG93aW5nVmlld1ogPSBwYXJzZUludCggZ2V0Q29tcHV0ZWRTdHlsZSggdGhlU2hvd2luZ1ZpZXcuZWxlbWVudCApLmdldFByb3BlcnR5VmFsdWUoIFwiei1pbmRleFwiICkgfHwgXCIwXCIsIDEwICk7XG4gICAgICBpZiAoIHRoZUhpZGluZ1ZpZXdaID49IHRoZVNob3dpbmdWaWV3WiApIHtcbiAgICAgICAgdGhlU2hvd2luZ1ZpZXdaID0gdGhlSGlkaW5nVmlld1ogKyAxMDtcbiAgICAgIH1cbiAgICAgIC8vIHRoZW4gcG9zaXRpb24gdGhlIHZpZXcgc28gYXMgdG8gYmUgb2ZmLXNjcmVlbiwgd2l0aCB0aGUgY3VycmVudCB2aWV3IG9uIHNjcmVlblxuICAgICAgVUkuc3R5bGVFbGVtZW50KCB0aGVIaWRpbmdWaWV3LmVsZW1lbnQsIFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlM2QoMCwwLFwiICsgdGhlSGlkaW5nVmlld1ogKyBcInB4KVwiICk7XG4gICAgICBVSS5zdHlsZUVsZW1lbnQoIHRoZVNob3dpbmdWaWV3LmVsZW1lbnQsIFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlM2QoMTAwJSwwLFwiICsgdGhlU2hvd2luZ1ZpZXdaICsgXCJweClcIiApO1xuICAgICAgLy8gc2V0IHVwIGFuIGFuaW1hdGlvblxuICAgICAgaWYgKCB1c2luZ0FuaW1hdGlvbiApIHtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggW3RoZVNob3dpbmdWaWV3LmVsZW1lbnQsIHRoZUhpZGluZ1ZpZXcuZWxlbWVudF0sIFwidHJhbnNpdGlvblwiLCBcIi13ZWJraXQtdHJhbnNmb3JtIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uRGVsYXkgKyBcInMgXCIgKyBhbmltYXRpb25UeXBlICk7XG4gICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIFt0aGVTaG93aW5nVmlldy5lbGVtZW50LCB0aGVIaWRpbmdWaWV3LmVsZW1lbnRdLCBcInRyYW5zaXRpb25cIiwgXCItbW96LXRyYW5zZm9ybSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbkRlbGF5ICsgXCJzIFwiICsgYW5pbWF0aW9uVHlwZSApO1xuICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCBbdGhlU2hvd2luZ1ZpZXcuZWxlbWVudCwgdGhlSGlkaW5nVmlldy5lbGVtZW50XSwgXCJ0cmFuc2l0aW9uXCIsIFwiLW1zLXRyYW5zZm9ybSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbkRlbGF5ICsgXCJzIFwiICsgYW5pbWF0aW9uVHlwZSApO1xuICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCBbdGhlU2hvd2luZ1ZpZXcuZWxlbWVudCwgdGhlSGlkaW5nVmlldy5lbGVtZW50XSwgXCJ0cmFuc2l0aW9uXCIsIFwidHJhbnNmb3JtIFwiICsgYW5pbWF0aW9uRGVsYXkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInMgXCIgKyBhbmltYXRpb25UeXBlICk7XG4gICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZUhpZGluZ1ZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi51aS1uYXZpZ2F0aW9uLWJhciAqXCIgKSwgXCJ0cmFuc2l0aW9uXCIsIFwib3BhY2l0eSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uRGVsYXkgKyBcInMgXCIgKyBhbmltYXRpb25UeXBlICk7XG4gICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZVNob3dpbmdWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIudWktbmF2aWdhdGlvbi1iYXIgKlwiICksIFwidHJhbnNpdGlvblwiLCBcIm9wYWNpdHkgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25EZWxheSArIFwicyBcIiArIGFuaW1hdGlvblR5cGUgKTtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggdGhlSGlkaW5nVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLnVpLW5hdmlnYXRpb24tYmFyICpcIiApLCBcIm9wYWNpdHlcIiwgXCIxXCIgKTtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggdGhlU2hvd2luZ1ZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi51aS1uYXZpZ2F0aW9uLWJhciAqXCIgKSwgXCJvcGFjaXR5XCIsIFwiMFwiICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCBbdGhlU2hvd2luZ1ZpZXcuZWxlbWVudCwgdGhlSGlkaW5nVmlldy5lbGVtZW50XSwgXCJ0cmFuc2l0aW9uXCIsIFwiaW5oZXJpdFwiICk7XG4gICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZUhpZGluZ1ZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi51aS1uYXZpZ2F0aW9uLWJhciAqXCIgKSwgXCJ0cmFuc2l0aW9uXCIsIFwiaW5oZXJpdFwiICk7XG4gICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZVNob3dpbmdWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIudWktbmF2aWdhdGlvbi1iYXIgKlwiICksIFwidHJhbnNpdGlvblwiLCBcImluaGVyaXRcIiApO1xuICAgICAgfVxuICAgICAgLy8gYW5kIGFkZCB0aGUgZWxlbWVudCB3aXRoIHVzIGFzIHRoZSBwYXJlbnRcbiAgICAgIHRoZVNob3dpbmdWaWV3LnBhcmVudEVsZW1lbnQgPSBzZWxmLmVsZW1lbnQ7XG4gICAgICAvLyBkaXNwbGF5IHRoZSBjbGljayBwcmV2ZW50aW9uIGVsZW1lbnRcbiAgICAgIHNlbGYuX3ByZXZlbnRDbGlja3Muc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdGVsbCB0aGUgdG9wVmlldyB0byBtb3ZlIG92ZXIgdG8gdGhlIGxlZnRcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50KCB0aGVIaWRpbmdWaWV3LmVsZW1lbnQsIFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlM2QoLTUwJSwwLFwiICsgdGhlSGlkaW5nVmlld1ogKyBcInB4KVwiICk7XG4gICAgICAgIC8vIGFuZCB0ZWxsIG91ciBuZXcgdmlldyB0byBtb3ZlIGFzIHdlbGxcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50KCB0aGVTaG93aW5nVmlldy5lbGVtZW50LCBcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZTNkKDAsMCxcIiArIHRoZVNob3dpbmdWaWV3WiArIFwicHgpXCIgKTtcbiAgICAgICAgaWYgKCB1c2luZ0FuaW1hdGlvbiApIHtcbiAgICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCB0aGVIaWRpbmdWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIudWktbmF2aWdhdGlvbi1iYXIgKlwiICksIFwib3BhY2l0eVwiLCBcIjBcIiApO1xuICAgICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZVNob3dpbmdWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIudWktbmF2aWdhdGlvbi1iYXIgKlwiICksIFwib3BhY2l0eVwiLCBcIjFcIiApO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoZSB0aGUgdmlldyBpdCdzIGFib3V0IHRvIHNob3cuLi5cbiAgICAgICAgdGhlSGlkaW5nVmlldy5ub3RpZnkoIFwidmlld1dpbGxEaXNhcHBlYXJcIiApO1xuICAgICAgICB0aGVTaG93aW5nVmlldy5ub3RpZnkoIFwidmlld1dpbGxBcHBlYXJcIiApO1xuICAgICAgICAvLyB0ZWxsIGFueW9uZSB3aG8gaXMgbGlzdGVuaW5nIHdobyBnb3QgcHVzaGVkXG4gICAgICAgIHNlbGYubm90aWZ5KCBcInZpZXdQdXNoZWRcIiwgW3RoZVNob3dpbmdWaWV3XSApO1xuICAgICAgICAvLyB0ZWxsIHRoZSB2aWV3IGl0J3MgdmlzaWJsZSBhZnRlciB0aGUgZGVsYXkgaGFzIHBhc3NlZFxuICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhlSGlkaW5nVmlldy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICB0aGVIaWRpbmdWaWV3Lm5vdGlmeSggXCJ2aWV3RGlkRGlzYXBwZWFyXCIgKTtcbiAgICAgICAgICB0aGVTaG93aW5nVmlldy5ub3RpZnkoIFwidmlld0RpZEFwcGVhclwiICk7XG4gICAgICAgICAgLy8gaGlkZSBjbGljayBwcmV2ZW50ZXJcbiAgICAgICAgICBzZWxmLl9wcmV2ZW50Q2xpY2tzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfSwgYW5pbWF0aW9uRGVsYXkgKiAxMDAwICk7XG4gICAgICB9LCA1MCApO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogcG9wcyB0aGUgdG9wIHZpZXcgZnJvbSB0aGUgdmlldyBzdGFja1xuICAgICAqXG4gICAgICogQG1ldGhvZCBwb3BWaWV3XG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aXRoQW5pbWF0aW9uIFVzZSBhbmltYXRpb24gd2hlbiBwb3BwaW5nLCBkZWZhdWx0IGB0cnVlYFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB3aXRoRGVsYXkgRHVyYXRpb24gb2YgYW5pbWF0aW9uIGluIHNlY29uZHMsIERlZmF1bHQgYDAuM2BcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gd2l0aFR5cGUgQ1NTIEFuaW1hdGlvbiwgZGVmYXVsdCBpcyBgZWFzZS1pbi1vdXRgXG4gICAgICovXG4gICAgc2VsZi5wb3BWaWV3ID0gZnVuY3Rpb24gKCB3aXRoQW5pbWF0aW9uLCB3aXRoRGVsYXksIHdpdGhUeXBlICkge1xuICAgICAgdmFyIHVzaW5nQW5pbWF0aW9uID0gdHJ1ZSxcbiAgICAgICAgYW5pbWF0aW9uRGVsYXkgPSAwLjMsXG4gICAgICAgIGFuaW1hdGlvblR5cGUgPSBcImVhc2UtaW4tb3V0XCI7XG4gICAgICBpZiAoIHR5cGVvZiB3aXRoQW5pbWF0aW9uICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICB1c2luZ0FuaW1hdGlvbiA9IHdpdGhBbmltYXRpb247XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiB3aXRoRGVsYXkgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIGFuaW1hdGlvbkRlbGF5ID0gd2l0aERlbGF5O1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygd2l0aFR5cGUgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIGFuaW1hdGlvblR5cGUgPSB3aXRoVHlwZTtcbiAgICAgIH1cbiAgICAgIGlmICggIXVzaW5nQW5pbWF0aW9uICkge1xuICAgICAgICBhbmltYXRpb25EZWxheSA9IDA7XG4gICAgICB9XG4gICAgICAvLyBvbmx5IHBvcCBpZiB3ZSBoYXZlIHZpZXdzIHRvIHBvcCAoQ2FuJ3QgcG9wIHRoZSBmaXJzdCEpXG4gICAgICBpZiAoIHNlbGYuX3N1YnZpZXdzLmxlbmd0aCA8PSAxICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBwb3AgdGhlIHRvcCB2aWV3IG9mZiB0aGUgc3RhY2tcbiAgICAgIHZhciB0aGVQb3BwaW5nVmlldyA9IHNlbGYuX3N1YnZpZXdzLnBvcCgpLFxuICAgICAgICB0aGVTaG93aW5nVmlldyA9IHNlbGYudG9wVmlldyxcbiAgICAgICAgdGhlUG9wcGluZ1ZpZXdaID0gcGFyc2VJbnQoIGdldENvbXB1dGVkU3R5bGUoIHRoZVBvcHBpbmdWaWV3LmVsZW1lbnQgKS5nZXRQcm9wZXJ0eVZhbHVlKCBcInotaW5kZXhcIiApIHx8IFwiMFwiLCAxMCApLFxuICAgICAgICB0aGVTaG93aW5nVmlld1ogPSBwYXJzZUludCggZ2V0Q29tcHV0ZWRTdHlsZSggdGhlU2hvd2luZ1ZpZXcuZWxlbWVudCApLmdldFByb3BlcnR5VmFsdWUoIFwiei1pbmRleFwiICkgfHwgXCIwXCIsIDEwICk7XG4gICAgICBpZiAoIHRoZVNob3dpbmdWaWV3WiA+PSB0aGVQb3BwaW5nVmlld1ogKSB7XG4gICAgICAgIHRoZVBvcHBpbmdWaWV3WiA9IHRoZVNob3dpbmdWaWV3WiArIDEwO1xuICAgICAgfVxuICAgICAgdGhlU2hvd2luZ1ZpZXcuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJpbmhlcml0XCI7XG4gICAgICAvLyBtYWtlIHN1cmUgdGhhdCB0aGVTaG93aW5nVmlldyBpcyBvZmYgc2NyZWVuIHRvIHRoZSBsZWZ0LCBhbmQgdGhlIHBvcHBpbmdcbiAgICAgIC8vIHZpZXcgaXMgYXQgMFxuICAgICAgVUkuc3R5bGVFbGVtZW50cyggW3RoZVBvcHBpbmdWaWV3LmVsZW1lbnQsIHRoZVNob3dpbmdWaWV3LmVsZW1lbnRdLCBcInRyYW5zaXRpb25cIiwgXCJpbmhlcml0XCIgKTtcbiAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZVBvcHBpbmdWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIudWktbmF2aWdhdGlvbi1iYXIgKlwiICksIFwidHJhbnNpdGlvblwiLCBcImluaGVyaXRcIiApO1xuICAgICAgVUkuc3R5bGVFbGVtZW50cyggdGhlU2hvd2luZ1ZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi51aS1uYXZpZ2F0aW9uLWJhciAqXCIgKSwgXCJ0cmFuc2l0aW9uXCIsIFwiaW5oZXJpdFwiICk7XG4gICAgICBVSS5zdHlsZUVsZW1lbnQoIHRoZVNob3dpbmdWaWV3LmVsZW1lbnQsIFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlM2QoLTUwJSwwLFwiICsgdGhlU2hvd2luZ1ZpZXdaICsgXCJweClcIiApO1xuICAgICAgVUkuc3R5bGVFbGVtZW50KCB0aGVQb3BwaW5nVmlldy5lbGVtZW50LCBcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZTNkKDAsMCxcIiArIHRoZVBvcHBpbmdWaWV3WiArIFwicHhcIiApO1xuICAgICAgaWYgKCB1c2luZ0FuaW1hdGlvbiApIHtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggdGhlU2hvd2luZ1ZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi51aS1uYXZpZ2F0aW9uLWJhciAqXCIgKSwgXCJvcGFjaXR5XCIsIFwiMFwiICk7XG4gICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZVBvcHBpbmdWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIudWktbmF2aWdhdGlvbi1iYXIgKlwiICksIFwib3BhY2l0eVwiLCBcIjFcIiApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggdGhlU2hvd2luZ1ZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi51aS1uYXZpZ2F0aW9uLWJhciAqXCIgKSwgXCJvcGFjaXR5XCIsIFwiMVwiICk7XG4gICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZVBvcHBpbmdWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIudWktbmF2aWdhdGlvbi1iYXIgKlwiICksIFwib3BhY2l0eVwiLCBcIjFcIiApO1xuICAgICAgfVxuICAgICAgLy8gc2V0IHVwIGFuIGFuaW1hdGlvblxuICAgICAgaWYgKCB1c2luZ0FuaW1hdGlvbiApIHtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggW3RoZVBvcHBpbmdWaWV3LmVsZW1lbnQsIHRoZVNob3dpbmdWaWV3LmVsZW1lbnRdLCBcInRyYW5zaXRpb25cIiwgXCItd2Via2l0LXRyYW5zZm9ybSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25EZWxheSArIFwicyBcIiArIGFuaW1hdGlvblR5cGUgKTtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggW3RoZVBvcHBpbmdWaWV3LmVsZW1lbnQsIHRoZVNob3dpbmdWaWV3LmVsZW1lbnRdLCBcInRyYW5zaXRpb25cIiwgXCItbW96LXRyYW5zZm9ybSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25EZWxheSArIFwicyBcIiArIGFuaW1hdGlvblR5cGUgKTtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggW3RoZVBvcHBpbmdWaWV3LmVsZW1lbnQsIHRoZVNob3dpbmdWaWV3LmVsZW1lbnRdLCBcInRyYW5zaXRpb25cIiwgXCItbXMtdHJhbnNmb3JtIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbkRlbGF5ICsgXCJzIFwiICsgYW5pbWF0aW9uVHlwZSApO1xuICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCBbdGhlUG9wcGluZ1ZpZXcuZWxlbWVudCwgdGhlU2hvd2luZ1ZpZXcuZWxlbWVudF0sIFwidHJhbnNpdGlvblwiLCBcInRyYW5zZm9ybSBcIiArIGFuaW1hdGlvbkRlbGF5ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicyBcIiArIGFuaW1hdGlvblR5cGUgKTtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggdGhlUG9wcGluZ1ZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi51aS1uYXZpZ2F0aW9uLWJhciAqXCIgKSwgXCJ0cmFuc2l0aW9uXCIsIFwib3BhY2l0eSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbkRlbGF5ICsgXCJzIFwiICsgYW5pbWF0aW9uVHlwZSApO1xuICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCB0aGVTaG93aW5nVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLnVpLW5hdmlnYXRpb24tYmFyICpcIiApLCBcInRyYW5zaXRpb25cIiwgXCJvcGFjaXR5IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uRGVsYXkgKyBcInMgXCIgKyBhbmltYXRpb25UeXBlICk7XG4gICAgICB9XG4gICAgICAvLyBkaXNwbGF5IHRoZSBjbGljayBwcmV2ZW50aW9uIGVsZW1lbnRcbiAgICAgIHNlbGYuX3ByZXZlbnRDbGlja3Muc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gYW5kIG1vdmUgZXZlcnlvbmVcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50KCB0aGVTaG93aW5nVmlldy5lbGVtZW50LCBcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZTNkKDAsMCxcIiArIHRoZVNob3dpbmdWaWV3WiArIFwicHgpXCIgKTtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50KCB0aGVQb3BwaW5nVmlldy5lbGVtZW50LCBcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZTNkKDEwMCUsMCxcIiArIHRoZVBvcHBpbmdWaWV3WiArIFwicHgpXCIgKTtcbiAgICAgICAgaWYgKCB1c2luZ0FuaW1hdGlvbiApIHtcbiAgICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCB0aGVQb3BwaW5nVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLnVpLW5hdmlnYXRpb24tYmFyICpcIiApLCBcIm9wYWNpdHlcIiwgXCIwXCIgKTtcbiAgICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCB0aGVTaG93aW5nVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLnVpLW5hdmlnYXRpb24tYmFyICpcIiApLCBcIm9wYWNpdHlcIiwgXCIxXCIgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGUgdGhlIHZpZXcgaXQncyBhYm91dCB0byBzaG93Li4uXG4gICAgICAgIHRoZVBvcHBpbmdWaWV3Lm5vdGlmeSggXCJ2aWV3V2lsbERpc2FwcGVhclwiICk7XG4gICAgICAgIHRoZVNob3dpbmdWaWV3Lm5vdGlmeSggXCJ2aWV3V2lsbEFwcGVhclwiICk7XG4gICAgICAgIC8vIHRlbGwgdGhlIHZpZXcgaXQncyB2aXNpYmxlIGFmdGVyIHRoZSBkZWxheSBoYXMgcGFzc2VkXG4gICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGVQb3BwaW5nVmlldy5ub3RpZnkoIFwidmlld0RpZERpc2FwcGVhclwiICk7XG4gICAgICAgICAgdGhlUG9wcGluZ1ZpZXcubm90aWZ5KCBcInZpZXdXYXNQb3BwZWRcIiApO1xuICAgICAgICAgIHRoZVNob3dpbmdWaWV3Lm5vdGlmeSggXCJ2aWV3RGlkQXBwZWFyXCIgKTtcbiAgICAgICAgICAvLyB0ZWxsIGFueW9uZSB3aG8gaXMgbGlzdGVuaW5nIHdobyBnb3QgcG9wcGVkXG4gICAgICAgICAgc2VsZi5ub3RpZnkoIFwidmlld1BvcHBlZFwiLCBbdGhlUG9wcGluZ1ZpZXddICk7XG4gICAgICAgICAgLy8gaGlkZSBjbGljayBwcmV2ZW50ZXJcbiAgICAgICAgICBzZWxmLl9wcmV2ZW50Q2xpY2tzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAvLyBhbmQgcmVtb3ZlIHRoZSBwb3BwaW5nIHZpZXcgZnJvbSB0aGUgaGllcmFyY2h5XG4gICAgICAgICAgdGhlUG9wcGluZ1ZpZXcucGFyZW50RWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgZGVsZXRlIHRoZVBvcHBpbmdWaWV3Lm5hdmlnYXRpb25Db250cm9sbGVyO1xuICAgICAgICB9LCAoIGFuaW1hdGlvbkRlbGF5ICogMTAwMCApICk7XG4gICAgICB9LCA1MCApO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUHJlc2VudHMgdGhlIG5hdmlnYXRpb24gY29udHJvbGxlciBhcyBhIG1vZGFsIG5hdmlnYXRpb24gY29udHJvbGxlci4gSXQgc2l0c1xuICAgICAqIGFkamFjZW50IHRvIGBmcm9tVmlld2AgaW4gdGhlIERPTSwgbm90IHdpdGhpbiwgYW5kIGFzIHN1Y2ggY2FuIHByZXZlbnQgaXRcbiAgICAgKiBmcm9tIHJlY2VpdmluZyBhbnkgZXZlbnRzLiBUaGUgcmVuZGVyaW5nIGlzIHJvdWdseSB0aGUgc2FtZSBhcyBhbnkgb3RoZXJcbiAgICAgKiBuYXZpZ2F0aW9uIGNvbnRyb2xsZXIsIHNhdmUgdGhhdCBhbiBleHRyYSBjbGFzcyBhZGRlZCB0byB0aGUgZWxlbWVudCdzXG4gICAgICogYHVpLWNvbnRhaW5lcmAgdGhhdCBlbnN1cmVzIHRoYXQgb24gbGFyZ2VyIGRpc3BsYXlzIHRoZSBtb2RhbCBkb2Vzbid0XG4gICAgICogZmlsbCB0aGUgZW50aXJlIHNjcmVlbi4gSWYgZGVzaXJlZCwgdGhpcyBjbGFzcyBjYW4gYmUgY29udHJvbGxlZCBieSB0aGUgc2Vjb25kXG4gICAgICogcGFyYW1ldGVyIChgb3B0aW9uc2ApLlxuICAgICAqXG4gICAgICogaWYgYG9wdGlvbnNgIGFyZSBzcGVjaWZpZWQsIGl0IG11c3QgYmUgb2YgdGhlIGZvcm06XG4gICAgICogYGBgXG4gICAgICogeyBkaXNwbGF5VHlwZTogXCJtb2RhbFdpbmRvd3xtb2RhbFBhZ2V8bW9kYWxGaWxsXCIsICAgLy8gbW9kYWwgZGlzcGxheSB0eXBlXG4gICAgICAgKiAgIHdpdGhBbmltYXRpb246IHRydWV8ZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2hvdWxkIGFuaW1hdGlvbiBiZSB1c2VkP1xuICAgICAgICogICB3aXRoRGVsYXk6IDAuMywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGFuaW1hdGlvbiBpcyB1c2VkLCB0aW1lIGluIHNlY29uZHNcbiAgICAgICAqICAgd2l0aFRpbWluZ0Z1bmN0aW9uOiBcImVhc2UtaW4tb3V0fC4uLlwiICAgICAgICAgICAgIC8vIHRpbWluZyBmdW5jdGlvbiB0byB1c2UgZm9yIGFuaW1hdGlvblxuICAgICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1ldGhvZCBwcmVzZW50TW9kYWxDb250cm9sbGVyXG4gICAgICogQHBhcmFtIHtOb2RlfSBmcm9tVmlldyAgICAgICAgICAgICAgICAgICAgICB0aGUgdG9wLWxldmVsIHZpZXcgdG8gY292ZXIgKHR5cGljYWxseSByb290Q29udGFpbmVyKVxuICAgICAqIEBwYXJhbSB7Kn0gb3B0aW9ucyAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyB0byBhcHBseVxuICAgICAqL1xuICAgIHNlbGYucHJlc2VudE1vZGFsQ29udHJvbGxlciA9IGZ1bmN0aW9uIHByZXNlbnRNb2RlbENvbnRyb2xsZXIoIGZyb21WaWV3LCBvcHRpb25zICkge1xuICAgICAgdmFyIGRlZmF1bHRPcHRzID0ge1xuICAgICAgICBkaXNwbGF5VHlwZTogICAgICAgIFwibW9kYWxXaW5kb3dcIixcbiAgICAgICAgd2l0aEFuaW1hdGlvbjogICAgICB0cnVlLFxuICAgICAgICB3aXRoRGVsYXk6ICAgICAgICAgIDAuMyxcbiAgICAgICAgd2l0aFRpbWluZ0Z1bmN0aW9uOiBcImVhc2UtaW4tb3V0XCJcbiAgICAgIH07XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLmRpc3BsYXlUeXBlICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgIGRlZmF1bHRPcHRzLmRpc3BsYXlUeXBlID0gb3B0aW9ucy5kaXNwbGF5VHlwZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLndpdGhBbmltYXRpb24gIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgZGVmYXVsdE9wdHMud2l0aEFuaW1hdGlvbiA9IG9wdGlvbnMud2l0aEFuaW1hdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLndpdGhEZWxheSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICBkZWZhdWx0T3B0cy53aXRoRGVsYXkgPSBvcHRpb25zLndpdGhEZWxheTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLndpdGhUaW1pbmdGdW5jdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICBkZWZhdWx0T3B0cy53aXRoVGltaW5nRnVuY3Rpb24gPSBvcHRpb25zLndpdGhUaW1pbmdGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCAhZGVmYXVsdE9wdHMud2l0aEFuaW1hdGlvbiApIHtcbiAgICAgICAgZGVmYXVsdE9wdHMud2l0aERlbGF5ID0gMDtcbiAgICAgIH1cbiAgICAgIC8vIGNoZWNrIG91ciBmb3JtIGZhY3RvciBjbGFzczsgaWYgd2UncmUgYSBwaG9uZSwgb25seSBwZXJtaXQgbW9kYWxGaWxsXG4gICAgICBpZiAoIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCBcInBob25lXCIgKSApIHtcbiAgICAgICAgZGVmYXVsdE9wdHMuZGlzcGxheVR5cGUgPSBcIm1vZGFsRmlsbFwiO1xuICAgICAgfVxuICAgICAgc2VsZi5fbW9kYWxWaWV3ID0gZnJvbVZpZXc7XG4gICAgICBzZWxmLl9tb2RhbCA9IHRydWU7XG4gICAgICBzZWxmLl9tb2RhbFZpZXdUeXBlID0gZGVmYXVsdE9wdHMuZGlzcGxheVR5cGU7XG4gICAgICBzZWxmLl9tb2RhbENsaWNrUHJldmVudGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgICAgc2VsZi5fbW9kYWxDbGlja1ByZXZlbnRlci5jbGFzc05hbWUgPSBcInVpLWNvbnRhaW5lciB1aS10cmFuc3BhcmVudFwiO1xuICAgICAgLy8gd2UgbmVlZCB0byBjYWxjdWxhdGUgdGhlIHogaW5kaWNlcyBvZiB0aGUgYWRqYWNlbnQgdmlldyBhbmQgdXNcbiAgICAgIHZhciB0aGVBZGphY2VudFZpZXdaID0gcGFyc2VJbnQoIGdldENvbXB1dGVkU3R5bGUoIGZyb21WaWV3ICkuZ2V0UHJvcGVydHlWYWx1ZSggXCJ6LWluZGV4XCIgKSB8fCBcIjBcIiwgMTAgKSxcbiAgICAgICAgdGhlTW9kYWxWaWV3WiA9IHBhcnNlSW50KCBnZXRDb21wdXRlZFN0eWxlKCBzZWxmLmVsZW1lbnQgKS5nZXRQcm9wZXJ0eVZhbHVlKCBcInotaW5kZXhcIiApIHx8IFwiMFwiLCAxMCApO1xuICAgICAgaWYgKCB0aGVNb2RhbFZpZXdaIDw9IHRoZUFkamFjZW50Vmlld1ogKSB7XG4gICAgICAgIHRoZU1vZGFsVmlld1ogPSB0aGVBZGphY2VudFZpZXdaICsgMTA7IC8vIHRoZSBtb2RhbCBzaG91bGQgYWx3YXlzIGJlIGFib3ZlIHRoZSBhZGphY2VudCB2aWV3XG4gICAgICB9XG4gICAgICAvLyBtYWtlIHN1cmUgb3VyIGN1cnJlbnQgdmlldyBpcyBvZmYtc2NyZWVuIHNvIHRoYXQgd2hlbiBpdCBpcyBhZGRlZCwgaXQgd29uJ3QgZmxpY2tlclxuICAgICAgc2VsZi5lbGVtZW50LiRzKCBcInRyYW5zZm9ybVwiLCBVVElMLnRlbXBsYXRlKCBcInRyYW5zbGF0ZTNkKCVYJSwlWSUsJVolKVwiLCB7XG4gICAgICAgIHg6IFwiMFwiLFxuICAgICAgICB5OiBcIjE1MCVcIixcbiAgICAgICAgejogXCJcIiArIHRoZU1vZGFsVmlld1ogKyBcInB4XCJcbiAgICAgIH0gKSApO1xuICAgICAgc2VsZi5lbGVtZW50LmNsYXNzTGlzdC5hZGQoIGRlZmF1bHRPcHRzLmRpc3BsYXlUeXBlICk7XG4gICAgICAvLyBhbmQgYXR0YWNoIHRoZSBlbGVtZW50XG4gICAgICBzZWxmLl9tb2RhbENsaWNrUHJldmVudGVyLmFwcGVuZENoaWxkKCBzZWxmLmVsZW1lbnQgKTtcbiAgICAgIGZyb21WaWV3LnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoIHNlbGYuX21vZGFsQ2xpY2tQcmV2ZW50ZXIgKTtcbiAgICAgIC8vIHNlbmQgYW55IG5vdGlmaWNhdGlvbnMgd2UgbmVlZFxuICAgICAgc2VsZi5lbWl0KCBcInZpZXdXYXNQdXNoZWRcIiApO1xuICAgICAgc2VsZi5lbWl0KCBcInZpZXdXaWxsQXBwZWFyXCIgKTtcbiAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnJvbVZpZXcuY2xhc3NMaXN0LmFkZCggXCJ1aS1kaXNhYmxlZFwiICk7XG4gICAgICAgIFVJLmJlZ2luQW5pbWF0aW9uKCBmcm9tVmlldyApLnNldFRpbWluZyggZGVmYXVsdE9wdHMud2l0aERlbGF5ICkuc2V0VGltaW5nRnVuY3Rpb24oIGRlZmF1bHRPcHRzLndpdGhUaW1pbmdGdW5jdGlvbiApXG4gICAgICAgICAgLnNjYWxlKCBcIjAuOVwiICkub3BhY2l0eSggXCIwLjlcIiApLmVuZEFuaW1hdGlvbigpO1xuICAgICAgICBVSS5iZWdpbkFuaW1hdGlvbiggc2VsZi5lbGVtZW50ICkuc2V0VGltaW5nKCBkZWZhdWx0T3B0cy53aXRoRGVsYXkgKS5zZXRUaW1pbmdGdW5jdGlvbiggZGVmYXVsdE9wdHMud2l0aFRpbWluZ0Z1bmN0aW9uIClcbiAgICAgICAgICAudHJhbnNsYXRlM2QoIFwiMFwiLCBcIjBcIiwgXCJcIiArIHRoZU1vZGFsVmlld1ogKyBcInB4XCIgKS5lbmRBbmltYXRpb24oIGZ1bmN0aW9uIHNlbmROb3RpZmljYXRpb25zKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbWl0KCBcInZpZXdEaWRBcHBlYXJcIiApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgIH0sIDUwICk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBEaXNtaXNzIGEgY29udHJvbGxlciBwcmVzZW50ZWQgd2l0aCBgcHJlc2VudE1vZGVsQ29udHJvbGxlcmAuIE9wdGlvbnMgY2FuIGJlXG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiB7IHdpdGhBbmltYXRpb246IHRydWV8ZmFsc2UsICAgICAgICAgLy8gaWYgZmFsc2UsIG5vIGFuaW1hdGlvbiBvY2N1cnNcbiAgICAgICAqICAgd2l0aERlbGF5OiAwLjMsICAgICAgICAgICAgICAgICAgICAvLyB0aW1lIGluIHNlY29uZHNcbiAgICAgICAqICAgd2l0aFRpbWluZ0Z1bmN0aW9uOiBcImVhc2UtaW4tb3V0XCIgIC8vIGVhc2luZyBmdW5jdGlvbiB0byB1c2VcbiAgICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGlzbWlzc01vZGFsQ29udHJvbGxlclxuICAgICAqIEBwYXJhbSB7Kn0gb3B0aW9uc1xuICAgICAqL1xuICAgIHNlbGYuZGlzbWlzc01vZGFsQ29udHJvbGxlciA9IGZ1bmN0aW9uIGRpc21pc3NNb2RlbENvbnRyb2xsZXIoIG9wdGlvbnMgKSB7XG4gICAgICB2YXIgZGVmYXVsdE9wdHMgPSB7XG4gICAgICAgIHdpdGhBbmltYXRpb246ICAgICAgdHJ1ZSxcbiAgICAgICAgd2l0aERlbGF5OiAgICAgICAgICAwLjMsXG4gICAgICAgIHdpdGhUaW1pbmdGdW5jdGlvbjogXCJlYXNlLWluLW91dFwiXG4gICAgICB9O1xuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy53aXRoQW5pbWF0aW9uICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgIGRlZmF1bHRPcHRzLndpdGhBbmltYXRpb24gPSBvcHRpb25zLndpdGhBbmltYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy53aXRoRGVsYXkgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgZGVmYXVsdE9wdHMud2l0aERlbGF5ID0gb3B0aW9ucy53aXRoRGVsYXk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy53aXRoVGltaW5nRnVuY3Rpb24gIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgZGVmYXVsdE9wdHMud2l0aFRpbWluZ0Z1bmN0aW9uID0gb3B0aW9ucy53aXRoVGltaW5nRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICggIWRlZmF1bHRPcHRzLndpdGhBbmltYXRpb24gKSB7XG4gICAgICAgIGRlZmF1bHRPcHRzLndpdGhEZWxheSA9IDA7XG4gICAgICB9XG4gICAgICAvLyB3ZSBuZWVkIHRvIGNhbGN1bGF0ZSB0aGUgeiBpbmRpY2VzIG9mIHRoZSBhZGphY2VudCB2aWV3IGFuZCB1c1xuICAgICAgdmFyIHRoZUFkamFjZW50Vmlld1ogPSBwYXJzZUludCggZ2V0Q29tcHV0ZWRTdHlsZSggc2VsZi5tb2RhbFZpZXcgKS5nZXRQcm9wZXJ0eVZhbHVlKCBcInotaW5kZXhcIiApIHx8IFwiMFwiLCAxMCApLFxuICAgICAgICB0aGVNb2RhbFZpZXdaID0gcGFyc2VJbnQoIGdldENvbXB1dGVkU3R5bGUoIHNlbGYuZWxlbWVudCApLmdldFByb3BlcnR5VmFsdWUoIFwiei1pbmRleFwiICkgfHwgXCIwXCIsIDEwICk7XG4gICAgICBpZiAoIHRoZU1vZGFsVmlld1ogPD0gdGhlQWRqYWNlbnRWaWV3WiApIHtcbiAgICAgICAgdGhlTW9kYWxWaWV3WiA9IHRoZUFkamFjZW50Vmlld1ogKyAxMDsgLy8gdGhlIG1vZGFsIHNob3VsZCBhbHdheXMgYmUgYWJvdmUgdGhlIGFkamFjZW50IHZpZXdcbiAgICAgIH1cbiAgICAgIC8vIHNlbmQgYW55IG5vdGlmaWNhdGlvbnMgd2UgbmVlZFxuICAgICAgc2VsZi5lbWl0KCBcInZpZXdXaWxsRGlzYXBwZWFyXCIgKTtcbiAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5tb2RhbFZpZXcuY2xhc3NMaXN0LnJlbW92ZSggXCJ1aS1kaXNhYmxlZFwiICk7XG4gICAgICAgIFVJLmJlZ2luQW5pbWF0aW9uKCBzZWxmLm1vZGFsVmlldyApLnNldFRpbWluZyggZGVmYXVsdE9wdHMud2l0aERlbGF5ICkuc2V0VGltaW5nRnVuY3Rpb24oIGRlZmF1bHRPcHRzLndpdGhUaW1pbmdGdW5jdGlvbiApXG4gICAgICAgICAgLnNjYWxlKCBcIjFcIiApLm9wYWNpdHkoIFwiMVwiICkuZW5kQW5pbWF0aW9uKCk7XG4gICAgICAgIFVJLmJlZ2luQW5pbWF0aW9uKCBzZWxmLmVsZW1lbnQgKS5zZXRUaW1pbmcoIGRlZmF1bHRPcHRzLndpdGhEZWxheSApLnNldFRpbWluZ0Z1bmN0aW9uKCBkZWZhdWx0T3B0cy53aXRoVGltaW5nRnVuY3Rpb24gKVxuICAgICAgICAgIC50cmFuc2xhdGUzZCggXCIwXCIsIFwiMTUwJVwiLCBcIlwiICsgdGhlTW9kYWxWaWV3WiArIFwicHhcIiApLmVuZEFuaW1hdGlvbihcbiAgICAgICAgICBmdW5jdGlvbiBzZW5kTm90aWZpY2F0aW9ucygpIHtcbiAgICAgICAgICAgIHNlbGYuZW1pdCggXCJ2aWV3RGlkRGlzYXBwZWFyXCIgKTtcbiAgICAgICAgICAgIHNlbGYuZW1pdCggXCJ2aWV3V2FzUG9wcGVkXCIgKTtcbiAgICAgICAgICAgIHNlbGYuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCBzZWxmLm1vZGFsVmlld1R5cGUgKTtcbiAgICAgICAgICAgIHNlbGYuX21vZGFsQ2xpY2tQcmV2ZW50ZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggc2VsZi5fbW9kYWxDbGlja1ByZXZlbnRlciApO1xuICAgICAgICAgICAgc2VsZi5fbW9kYWxDbGlja1ByZXZlbnRlci5yZW1vdmVDaGlsZCggc2VsZi5lbGVtZW50ICk7XG4gICAgICAgICAgICBzZWxmLl9tb2RhbCA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi5fbW9kYWxWaWV3ID0gbnVsbDtcbiAgICAgICAgICAgIHNlbGYuX21vZGFsVmlld1R5cGUgPSBcIlwiO1xuICAgICAgICAgICAgc2VsZi5fbW9kYWxDbGlja1ByZXZlbnRlciA9IG51bGw7XG4gICAgICAgICAgfSApO1xuICAgICAgfSwgNTAgKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBtZXRob2QgcmVuZGVyXG4gICAgICogQGFic3RyYWN0XG4gICAgICovXG4gICAgc2VsZi5vdmVycmlkZSggZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgcmV0dXJuIFwiXCI7IC8vIG5vdGhpbmcgdG8gcmVuZGVyIVxuICAgIH0gKTtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgZWxlbWVudHMgYW5kIGNsaWNrIHByZXZlbnRpb24gZWxlbWVudHMgaWYgbmVjZXNzYXJ5OyBvdGhlcndpc2UgdGhlcmUncyBub3RoaW5nIHRvIGRvXG4gICAgICogQG1ldGhvZCByZW5kZXJUb0VsZW1lbnRcbiAgICAgKi9cbiAgICBzZWxmLm92ZXJyaWRlKCBmdW5jdGlvbiByZW5kZXJUb0VsZW1lbnQoKSB7XG4gICAgICBzZWxmLmNyZWF0ZUVsZW1lbnRJZk5vdENyZWF0ZWQoKTtcbiAgICAgIHNlbGYuX2NyZWF0ZUNsaWNrUHJldmVudGlvbkVsZW1lbnRJZk5vdENyZWF0ZWQoKTtcbiAgICAgIHJldHVybjsgLy8gbm90aGluZyB0byBkby5cbiAgICB9ICk7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgbmF2aWdhdGlvbiBjb250cm9sbGVyXG4gICAgICogQG1ldGhvZCBpbml0XG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHNlbGYub3ZlcnJpZGUoIGZ1bmN0aW9uIGluaXQoIHRoZVJvb3RWaWV3LCB0aGVFbGVtZW50SWQsIHRoZUVsZW1lbnRUYWcsIHRoZUVsZW1lbnRDbGFzcywgdGhlUGFyZW50RWxlbWVudCApIHtcbiAgICAgIGlmICggdHlwZW9mIHRoZVJvb3RWaWV3ID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiQ2FuJ3QgaW5pdGlhbGl6ZSBhIG5hdmlnYXRpb24gY29udHJvbGxlciB3aXRob3V0IGEgcm9vdCB2aWV3LlwiICk7XG4gICAgICB9XG4gICAgICAvLyBkbyB3aGF0IGEgbm9ybWFsIHZpZXcgY29udGFpbmVyIGRvZXNcbiAgICAgIHNlbGYuJHN1cGVyKCB0aGVFbGVtZW50SWQsIHRoZUVsZW1lbnRUYWcsIHRoZUVsZW1lbnRDbGFzcywgdGhlUGFyZW50RWxlbWVudCApO1xuICAgICAgLy9zZWxmLnN1cGVyKCBfY2xhc3NOYW1lLCBcImluaXRcIiwgW3RoZUVsZW1lbnRJZCwgdGhlRWxlbWVudFRhZywgdGhlRWxlbWVudENsYXNzLCB0aGVQYXJlbnRFbGVtZW50IF0gKTtcbiAgICAgIC8vIG5vdyBhZGQgdGhlIHJvb3Qgdmlld1xuICAgICAgc2VsZi5yb290VmlldyA9IHRoZVJvb3RWaWV3O1xuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfSApO1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgdGhlIG5hdmlnYXRpb24gY29udHJvbGxlclxuICAgICAqIEBtZXRob2QgaW5pdFdpdGhPcHRpb25zXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHNlbGYub3ZlcnJpZGUoIGZ1bmN0aW9uIGluaXRXaXRoT3B0aW9ucyggb3B0aW9ucyApIHtcbiAgICAgIHZhciB0aGVSb290VmlldywgdGhlRWxlbWVudElkLCB0aGVFbGVtZW50VGFnLCB0aGVFbGVtZW50Q2xhc3MsXG4gICAgICAgIHRoZVBhcmVudEVsZW1lbnQ7XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLmlkICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgIHRoZUVsZW1lbnRJZCA9IG9wdGlvbnMuaWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50YWcgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgdGhlRWxlbWVudFRhZyA9IG9wdGlvbnMudGFnO1xuICAgICAgICB9XG4gICAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMuY2xhc3MgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgdGhlRWxlbWVudENsYXNzID0gb3B0aW9ucy5jbGFzcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLnBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICB0aGVQYXJlbnRFbGVtZW50ID0gb3B0aW9ucy5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5yb290VmlldyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICB0aGVSb290VmlldyA9IG9wdGlvbnMucm9vdFZpZXc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLmluaXQoIHRoZVJvb3RWaWV3LCB0aGVFbGVtZW50SWQsIHRoZUVsZW1lbnRUYWcsIHRoZUVsZW1lbnRDbGFzcywgdGhlUGFyZW50RWxlbWVudCApO1xuICAgIH0gKTtcbiAgICAvLyBoYW5kbGUgYXV0byBpbml0aWFsaXphdGlvblxuICAgIHNlbGYuX2F1dG9Jbml0LmFwcGx5KCBzZWxmLCBhcmd1bWVudHMgKTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcbm1vZHVsZS5leHBvcnRzID0gTmF2aWdhdGlvbkNvbnRyb2xsZXI7XG4iLCIvKipcbiAqXG4gKiBQcm92aWRlcyBuYXRpdmUtbGlrZSBhbGVydCBtZXRob2RzLCBpbmNsdWRpbmcgcHJvbXB0cyBhbmQgbWVzc2FnZXMuXG4gKlxuICogQG1vZHVsZSBhbGVydC5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNFxuICpcbiAqIGBgYFxuICogQ29weXJpZ2h0IChjKSAyMDEzIEtlcnJpIFNob3R0cywgcGhvdG9LYW5keSBTdHVkaW9zIExMQ1xuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nXG4gKiBjb25kaXRpb25zOlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllc1xuICogb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUlxuICogUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuICogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVFxuICogT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1JcbiAqIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqIGBgYFxuICovXG4vKmdsb2JhbCBtb2R1bGUqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX3kgPSByZXF1aXJlKCBcIi4uL3V0aWwvY29yZVwiICksXG4gIEJhc2VPYmplY3QgPSByZXF1aXJlKCBcIi4uL3V0aWwvb2JqZWN0XCIgKSxcbiAgVUkgPSByZXF1aXJlKCBcIi4vY29yZVwiICksXG4gIGggPSByZXF1aXJlKCBcInlhc21mLWhcIiApO1xudmFyIF9jbGFzc05hbWUgPSBcIlNwaW5uZXJcIjtcblxuZnVuY3Rpb24gU3Bpbm5lcigpIHtcbiAgdmFyIHNlbGYgPSBuZXcgQmFzZU9iamVjdCgpO1xuICBzZWxmLnN1YmNsYXNzKCBfY2xhc3NOYW1lICk7XG4gIHNlbGYuX2VsZW1lbnQgPSBudWxsO1xuICBzZWxmLmRlZmluZU9ic2VydmFibGVQcm9wZXJ0eSggXCJ0ZXh0XCIgKTtcbiAgc2VsZi5kZWZpbmVQcm9wZXJ0eSggXCJ2aXNpYmxlXCIsIHtcbiAgICBkZWZhdWx0OiBmYWxzZVxuICB9ICk7XG4gIHNlbGYuc2V0T2JzZXJ2YWJsZVRpbnRlZEJhY2tncm91bmQgPSBmdW5jdGlvbiBzZXRPYnNlcnZhYmxlVGludGVkQmFja2dyb3VuZCggdiApIHtcbiAgICBpZiAoIHYgKSB7XG4gICAgICBzZWxmLl9lbGVtZW50LmNsYXNzTGlzdC5hZGQoIFwib2JzY3VyZS1iYWNrZ3JvdW5kXCIgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCBcIm9ic2N1cmUtYmFja2dyb3VuZFwiICk7XG4gICAgfVxuICAgIHJldHVybiB2O1xuICB9XG4gIHNlbGYuZGVmaW5lT2JzZXJ2YWJsZVByb3BlcnR5KCBcInRpbnRlZEJhY2tncm91bmRcIiwge1xuICAgIGRlZmF1bHQ6IGZhbHNlXG4gIH0gKTtcbiAgc2VsZi5zaG93ID0gZnVuY3Rpb24gc2hvdygpIHtcbiAgICBpZiAoICFzZWxmLnZpc2libGUgKSB7XG4gICAgICBVSS5fcm9vdENvbnRhaW5lci5wYXJlbnROb2RlLmFwcGVuZENoaWxkKCBzZWxmLl9lbGVtZW50ICk7XG4gICAgICBzZWxmLnZpc2libGUgPSB0cnVlO1xuICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLl9lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcbiAgICAgIH0sIDAgKTtcbiAgICB9XG4gIH07XG4gIHNlbGYuaGlkZSA9IGZ1bmN0aW9uIGhpZGUoIGNiICkge1xuICAgIGlmICggc2VsZi52aXNpYmxlICkge1xuICAgICAgc2VsZi5fZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gXCIwXCI7XG4gICAgICBzZWxmLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVUkuX3Jvb3RDb250YWluZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggc2VsZi5fZWxlbWVudCApO1xuICAgICAgICBpZiAoIHR5cGVvZiBjYiA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICAgIHNldFRpbWVvdXQoIGNiLCAwICk7XG4gICAgICAgIH1cbiAgICAgIH0sIDI1MCApO1xuICAgIH1cbiAgfTtcbiAgc2VsZi5vdmVycmlkZSggZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBzZWxmLnN1cGVyKCBfY2xhc3NOYW1lLCBcImluaXRcIiApO1xuICAgIHNlbGYuX2VsZW1lbnQgPSBoLmVsKCBcImRpdi51aS1zcGlubmVyLW91dGVyLWNvbnRhaW5lclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBoLmVsKCBcImRpdi51aS1zcGlubmVyLWlubmVyLWNvbnRhaW5lclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbaC5lbCggXCJkaXYudWktc3Bpbm5lci1pbm5lci1zcGlubmVyXCIgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGguZWwoIFwiZGl2LnVpLXNwaW5uZXItaW5uZXItdGV4dFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Q6ICBzZWxmLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleVBhdGg6IFwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdICkgKTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfSApO1xuICBzZWxmLmluaXRXaXRoT3B0aW9ucyA9IGZ1bmN0aW9uIGluaXRXaXRoT3B0aW9ucyggb3B0aW9ucyApIHtcbiAgICBzZWxmLmluaXQoKTtcbiAgICBzZWxmLnRleHQgPSBvcHRpb25zLnRleHQ7XG4gICAgc2VsZi50aW50ZWRCYWNrZ3JvdW5kID0gKCBvcHRpb25zLnRpbnRlZEJhY2tncm91bmQgIT09IHVuZGVmaW5lZCApID8gb3B0aW9ucy50aW50ZWRCYWNrZ3JvdW5kIDogZmFsc2U7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH07XG4gIHNlbGYub3ZlcnJpZGUoIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgaWYgKCBzZWxmLnZpc2libGUgKSB7XG4gICAgICBVSS5fcm9vdENvbnRhaW5lci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBzZWxmLl9lbGVtZW50ICk7XG4gICAgICBzZWxmLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG4gICAgc2VsZi5fZWxlbWVudCA9IG51bGw7XG4gICAgc2VsZi5zdXBlciggX2NsYXNzTmFtZSwgXCJkZXN0cm95XCIgKTtcbiAgfSApXG4gIHNlbGYuX2F1dG9Jbml0LmFwcGx5KCBzZWxmLCBhcmd1bWVudHMgKTtcbiAgcmV0dXJuIHNlbGY7XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNwaW5uZXI7XG4iLCIvKipcbiAqXG4gKiBTcGxpdCBWaWV3IENvbnRyb2xsZXJzIHByb3ZpZGUgYmFzaWMgc3VwcG9ydCBmb3Igc2lkZS1ieS1zaWRlIHZpZXdzXG4gKlxuICogQG1vZHVsZSBzcGxpdFZpZXdDb250cm9sbGVyLmpzXG4gKiBAYXV0aG9yIEtlcnJpIFNob3R0c1xuICogQHZlcnNpb24gMC40XG4gKiBgYGBcbiAqIENvcHlyaWdodCAoYykgMjAxMyBLZXJyaSBTaG90dHMsIHBob3RvS2FuZHkgU3R1ZGlvcyBMTENcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZ1xuICogY29uZGl0aW9uczpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXNcbiAqIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVJcbiAqIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlRcbiAqIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gKiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKiBgYGBcbiAqL1xuLypnbG9iYWwgbW9kdWxlKi9cblwidXNlIHN0cmljdFwiO1xudmFyIFVJID0gcmVxdWlyZSggXCIuL2NvcmVcIiApLFxuICBWaWV3Q29udGFpbmVyID0gcmVxdWlyZSggXCIuL3ZpZXdDb250YWluZXJcIiApO1xudmFyIF9jbGFzc05hbWUgPSBcIlNwbGl0Vmlld0NvbnRyb2xsZXJcIjtcbnZhciBTcGxpdFZpZXdDb250cm9sbGVyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IG5ldyBWaWV3Q29udGFpbmVyKCk7XG4gIHNlbGYuc3ViY2xhc3MoIF9jbGFzc05hbWUgKTtcbiAgLy8gIyBOb3RpZmljYXRpb25zXG4gIC8vXG4gIC8vICogYHZpZXdzQ2hhbmdlZGAgLSBmaXJlZCB3aGVuIHRoZSBsZWZ0IG9yIHJpZ2h0IHNpZGUgdmlldyBjaGFuZ2VzXG4gIC8vXG4gIHNlbGYucmVnaXN0ZXJOb3RpZmljYXRpb24oIFwidmlld3NDaGFuZ2VkXCIgKTtcbiAgc2VsZi5fcHJldmVudENsaWNrcyA9IG51bGw7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgY2xpY2stcHJldmVudGlvbiBlbGVtZW50IC0tIGVzc2VudGlhbGx5IGEgdHJhbnNwYXJlbnQgRElWIHRoYXRcbiAgICogZmlsbHMgdGhlIHNjcmVlbi5cbiAgICogQG1ldGhvZCBfY3JlYXRlQ2xpY2tQcmV2ZW50aW9uRWxlbWVudFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2VsZi5fY3JlYXRlQ2xpY2tQcmV2ZW50aW9uRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLmNyZWF0ZUVsZW1lbnRJZk5vdENyZWF0ZWQoKTtcbiAgICBzZWxmLl9wcmV2ZW50Q2xpY2tzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIHNlbGYuX3ByZXZlbnRDbGlja3MuY2xhc3NOYW1lID0gXCJ1aS1wcmV2ZW50LWNsaWNrc1wiO1xuICAgIHNlbGYuZWxlbWVudC5hcHBlbmRDaGlsZCggc2VsZi5fcHJldmVudENsaWNrcyApO1xuICB9O1xuICAvKipcbiAgICogQ3JlYXRlIGEgY2xpY2stcHJldmVudGlvbiBlbGVtZW50IGlmIG5lY2Vzc2FyeVxuICAgKiBAbWV0aG9kIF9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50SWZOb3RDcmVhdGVkXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZWxmLl9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50SWZOb3RDcmVhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICggc2VsZi5fcHJldmVudENsaWNrcyA9PT0gbnVsbCApIHtcbiAgICAgIHNlbGYuX2NyZWF0ZUNsaWNrUHJldmVudGlvbkVsZW1lbnQoKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhlIHR5cGUgb2Ygc3BsaXQgY2FudmFzOlxuICAgKlxuICAgKiAqIGBzcGxpdGA6IHR5cGljYWwgc3BsaXQtdmlldyAtIGxlZnQgYW5kIHJpZ2h0IHNpZGUgc2hhcmVzIHNwYWNlIG9uIHNjcmVlblxuICAgKiAqIGBvZmYtY2FudmFzYDogb2ZmLWNhbnZhcyB2aWV3IEFLQSBGYWNlYm9vayBzcGxpdCB2aWV3LiBMZWZ0IHNpZGUgaXMgb2ZmIHNjcmVlbiBhbmQgY2FuIHNsaWRlIGluXG4gICAqICogYHNwbGl0LW92ZXJsYXlgOiBsZWZ0IHNpZGUgc2xpZGVzIG92ZXIgdGhlIHJpZ2h0IHNpZGUgd2hlbiB2aXNpYmxlXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB2aWV3VHlwZVxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgc2VsZi5zZXRWaWV3VHlwZSA9IGZ1bmN0aW9uICggdGhlVmlld1R5cGUgKSB7XG4gICAgc2VsZi5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoIFwidWktXCIgKyBzZWxmLl92aWV3VHlwZSArIFwiLXZpZXdcIiApO1xuICAgIHNlbGYuX3ZpZXdUeXBlID0gdGhlVmlld1R5cGU7XG4gICAgc2VsZi5lbGVtZW50LmNsYXNzTGlzdC5hZGQoIFwidWktXCIgKyB0aGVWaWV3VHlwZSArIFwiLXZpZXdcIiApO1xuICAgIHNlbGYubGVmdFZpZXdTdGF0dXMgPSBcImludmlzaWJsZVwiO1xuICB9O1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcInZpZXdUeXBlXCIsIHtcbiAgICByZWFkOiAgICB0cnVlLFxuICAgIHdyaXRlOiAgIHRydWUsXG4gICAgZGVmYXVsdDogXCJzcGxpdFwiXG4gIH0gKTtcbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGUgbGVmdCB2aWV3IGlzIGB2aXNpYmxlYCBvciBgaW52aXNpYmxlYC5cbiAgICpcbiAgICogQHByb3BlcnR5IGxlZnRWaWV3U3RhdHVzXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBzZWxmLnNldExlZnRWaWV3U3RhdHVzID0gZnVuY3Rpb24gKCB2aWV3U3RhdHVzICkge1xuICAgIHNlbGYuX3ByZXZlbnRDbGlja3Muc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICBzZWxmLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggXCJ1aS1sZWZ0LXNpZGUtXCIgKyBzZWxmLl9sZWZ0Vmlld1N0YXR1cyApO1xuICAgIHNlbGYuX2xlZnRWaWV3U3RhdHVzID0gdmlld1N0YXR1cztcbiAgICBzZWxmLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCggXCJ1aS1sZWZ0LXNpZGUtXCIgKyB2aWV3U3RhdHVzICk7XG4gICAgc2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fcHJldmVudENsaWNrcy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfSwgNjAwICk7XG4gIH07XG4gIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwibGVmdFZpZXdTdGF0dXNcIiwge1xuICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgd3JpdGU6ICAgdHJ1ZSxcbiAgICBkZWZhdWx0OiBcImludmlzaWJsZVwiXG4gIH0gKTtcbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgbGVmdCBzaWRlIHZpZXdcbiAgICogQG1ldGhvZCB0b2dnbGVMZWZ0Vmlld1xuICAgKi9cbiAgc2VsZi50b2dnbGVMZWZ0VmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIHNlbGYubGVmdFZpZXdTdGF0dXMgPT09IFwidmlzaWJsZVwiICkge1xuICAgICAgc2VsZi5sZWZ0Vmlld1N0YXR1cyA9IFwiaW52aXNpYmxlXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYubGVmdFZpZXdTdGF0dXMgPSBcInZpc2libGVcIjtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBUaGUgYXJyYXkgb2Ygdmlld3MgdGhhdCB0aGlzIHNwbGl0IHZpZXcgY29udHJvbGxlciBtYW5hZ2VzLlxuICAgKiBAcHJvcGVydHkgc3Vidmlld3NcbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cbiAgc2VsZi5kZWZpbmVQcm9wZXJ0eSggXCJzdWJ2aWV3c1wiLCB7XG4gICAgcmVhZDogICAgdHJ1ZSxcbiAgICB3cml0ZTogICBmYWxzZSxcbiAgICBkZWZhdWx0OiBbbnVsbCwgbnVsbF1cbiAgfSApO1xuICAvLyBpbnRlcm5hbCBlbGVtZW50c1xuICBzZWxmLl9sZWZ0RWxlbWVudCA9IG51bGw7XG4gIHNlbGYuX3JpZ2h0RWxlbWVudCA9IG51bGw7XG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIGxlZnQgYW5kIHJpZ2h0IGVsZW1lbnRzXG4gICAqIEBtZXRob2QgX2NyZWF0ZUVsZW1lbnRzXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZWxmLl9jcmVhdGVFbGVtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIHNlbGYuX2xlZnRFbGVtZW50ICE9PSBudWxsICkge1xuICAgICAgc2VsZi5lbGVtZW50LnJlbW92ZUNoaWxkKCBzZWxmLl9sZWZ0RWxlbWVudCApO1xuICAgIH1cbiAgICBpZiAoIHNlbGYuX3JpZ2h0RWxlbWVudCAhPT0gbnVsbCApIHtcbiAgICAgIHNlbGYuZWxlbWVudC5yZW1vdmVDaGlsZCggc2VsZi5fcmlnaHRFbGVtZW50ICk7XG4gICAgfVxuICAgIHNlbGYuX2xlZnRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIHNlbGYuX3JpZ2h0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcbiAgICBzZWxmLl9sZWZ0RWxlbWVudC5jbGFzc05hbWUgPSBcInVpLWNvbnRhaW5lciBsZWZ0LXNpZGVcIjtcbiAgICBzZWxmLl9yaWdodEVsZW1lbnQuY2xhc3NOYW1lID0gXCJ1aS1jb250YWluZXIgcmlnaHQtc2lkZVwiO1xuICAgIHNlbGYuZWxlbWVudC5hcHBlbmRDaGlsZCggc2VsZi5fbGVmdEVsZW1lbnQgKTtcbiAgICBzZWxmLmVsZW1lbnQuYXBwZW5kQ2hpbGQoIHNlbGYuX3JpZ2h0RWxlbWVudCApO1xuICB9O1xuICAvKipcbiAgICogQ3JlYXRlIHRoZSBsZWZ0IGFuZCByaWdodCBlbGVtZW50cyBpZiBuZWNlc3NhcnlcbiAgICogQG1ldGhvZCBfY3JlYXRlRWxlbWVudHNJZk5lY2Vzc2FyeVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2VsZi5fY3JlYXRlRWxlbWVudHNJZk5lY2Vzc2FyeSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIHNlbGYuX2xlZnRFbGVtZW50ICE9PSBudWxsICYmIHNlbGYuX3JpZ2h0RWxlbWVudCAhPT0gbnVsbCApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2VsZi5fY3JlYXRlRWxlbWVudHMoKTtcbiAgfTtcbiAgLyoqXG4gICAqIEFzc2lnbnMgYSB2aWV3IHRvIGEgZ2l2ZW4gc2lkZVxuICAgKiBAbWV0aG9kIF9hc3NpZ25WaWV3VG9TaWRlXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gd2hpY2hFbGVtZW50XG4gICAqIEBwYXJhbSB7Vmlld0NvbnRhaW5lcn0gYVZpZXdcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbGYuX2Fzc2lnblZpZXdUb1NpZGUgPSBmdW5jdGlvbiAoIHdoaWNoRWxlbWVudCwgYVZpZXcgKSB7XG4gICAgc2VsZi5fY3JlYXRlRWxlbWVudHNJZk5lY2Vzc2FyeSgpO1xuICAgIGFWaWV3LnNwbGl0Vmlld0NvbnRyb2xsZXIgPSBzZWxmO1xuICAgIGFWaWV3Lm5vdGlmeSggXCJ2aWV3V2FzUHVzaGVkXCIgKTsgLy8gbm90aWZ5IHRoZSB2aWV3IGl0IHdhcyBcInB1c2hlZFwiXG4gICAgYVZpZXcubm90aWZ5KCBcInZpZXdXaWxsQXBwZWFyXCIgKTsgLy8gbm90aWZ5IHRoZSB2aWV3IGl0IHdpbGwgYXBwZWFyXG4gICAgYVZpZXcucGFyZW50RWxlbWVudCA9IHdoaWNoRWxlbWVudDsgLy8gYW5kIG1ha2UgdXMgdGhlIHBhcmVudFxuICAgIGFWaWV3Lm5vdGlmeSggXCJ2aWV3RGlkQXBwZWFyXCIgKTsgLy8gYW5kIG5vdGlmeSBpdCB0aGF0IGl0J3MgYWN0dWFsbHkgdGhlcmUuXG4gIH07XG4gIC8qKlxuICAgKiBVbnBhcmVudHMgYSB2aWV3IG9uIGEgZ2l2ZW4gc2lkZSwgc2VuZGluZyBhbGwgdGhlIHJlcXVpc2l0ZSBub3RpZmljYXRpb25zXG4gICAqXG4gICAqIEBtZXRob2QgX3VucGFyZW50U2lkZVxuICAgKiBAcGFyYW0ge051bWJlcn0gc2lkZUluZGV4XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZWxmLl91bnBhcmVudFNpZGUgPSBmdW5jdGlvbiAoIHNpZGVJbmRleCApIHtcbiAgICBpZiAoIHNlbGYuX3N1YnZpZXdzLmxlbmd0aCA+PSBzaWRlSW5kZXggKSB7XG4gICAgICB2YXIgYVZpZXcgPSBzZWxmLl9zdWJ2aWV3c1tzaWRlSW5kZXhdO1xuICAgICAgaWYgKCBhVmlldyAhPT0gbnVsbCApIHtcbiAgICAgICAgYVZpZXcubm90aWZ5KCBcInZpZXdXaWxsRGlzYXBwZWFyXCIgKTsgLy8gbm90aWZ5IHRoZSB2aWV3IHRoYXQgaXQgaXMgZ29pbmcgdG8gZGlzYXBwZWFyXG4gICAgICAgIGFWaWV3LnBhcmVudEVsZW1lbnQgPSBudWxsOyAvLyByZW1vdmUgdGhlIHZpZXdcbiAgICAgICAgYVZpZXcubm90aWZ5KCBcInZpZXdEaWREaXNhcHBlYXJcIiApOyAvLyBub3RpZnkgdGhlIHZpZXcgdGhhdCBpdCBkaWQgZGlzYXBwZWFyXG4gICAgICAgIGFWaWV3Lm5vdGlmeSggXCJ2aWV3V2FzUG9wcGVkXCIgKTsgLy8gbm90aWZ5IHRoZSB2aWV3IHRoYXQgaXQgd2FzIFwicG9wcGVkXCJcbiAgICAgICAgZGVsZXRlIGFWaWV3LnNwbGl0Vmlld0NvbnRyb2xsZXI7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQWxsb3dzIGFjY2VzcyB0byB0aGUgbGVmdCB2aWV3XG4gICAqIEBwcm9wZXJ0eSBsZWZ0Vmlld1xuICAgKiBAdHlwZSB7Vmlld0NvbnRhaW5lcn1cbiAgICovXG4gIHNlbGYuZ2V0TGVmdFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCBzZWxmLl9zdWJ2aWV3cy5sZW5ndGggPiAwICkge1xuICAgICAgcmV0dXJuIHNlbGYuX3N1YnZpZXdzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG4gIHNlbGYuc2V0TGVmdFZpZXcgPSBmdW5jdGlvbiAoIGFWaWV3ICkge1xuICAgIHNlbGYuX3VucGFyZW50U2lkZSggMCApOyAvLyBzZW5kIGRpc2FwcGVhciBub3RpY2VzXG4gICAgaWYgKCBzZWxmLl9zdWJ2aWV3cy5sZW5ndGggPiAwICkge1xuICAgICAgc2VsZi5fc3Vidmlld3NbMF0gPSBhVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5fc3Vidmlld3MucHVzaCggYVZpZXcgKTtcbiAgICB9XG4gICAgc2VsZi5fYXNzaWduVmlld1RvU2lkZSggc2VsZi5fbGVmdEVsZW1lbnQsIGFWaWV3ICk7XG4gICAgc2VsZi5ub3RpZnkoIFwidmlld3NDaGFuZ2VkXCIgKTtcbiAgfTtcbiAgc2VsZi5kZWZpbmVQcm9wZXJ0eSggXCJsZWZ0Vmlld1wiLCB7XG4gICAgcmVhZDogICAgICAgICAgICB0cnVlLFxuICAgIHdyaXRlOiAgICAgICAgICAgdHJ1ZSxcbiAgICBiYWNraW5nVmFyaWFibGU6IGZhbHNlXG4gIH0gKTtcbiAgLyoqXG4gICAqIEFsbG93cyBhY2Nlc3MgdG8gdGhlIHJpZ2h0IHZpZXdcbiAgICogQHByb3BlcnR5IHJpZ2h0Vmlld1xuICAgKiBAdHlwZSB7Vmlld0NvbnRhaW5lcn1cbiAgICovXG4gIHNlbGYuZ2V0UmlnaHRWaWV3ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICggc2VsZi5fc3Vidmlld3MubGVuZ3RoID4gMSApIHtcbiAgICAgIHJldHVybiBzZWxmLl9zdWJ2aWV3c1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuICBzZWxmLnNldFJpZ2h0VmlldyA9IGZ1bmN0aW9uICggYVZpZXcgKSB7XG4gICAgc2VsZi5fdW5wYXJlbnRTaWRlKCAxICk7IC8vIHNlbmQgZGlzYXBwZWFyIG5vdGljZXMgZm9yIHJpZ2h0IHNpZGVcbiAgICBpZiAoIHNlbGYuX3N1YnZpZXdzLmxlbmd0aCA+IDEgKSB7XG4gICAgICBzZWxmLl9zdWJ2aWV3c1sxXSA9IGFWaWV3O1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLl9zdWJ2aWV3cy5wdXNoKCBhVmlldyApO1xuICAgIH1cbiAgICBzZWxmLl9hc3NpZ25WaWV3VG9TaWRlKCBzZWxmLl9yaWdodEVsZW1lbnQsIGFWaWV3ICk7XG4gICAgc2VsZi5ub3RpZnkoIFwidmlld3NDaGFuZ2VkXCIgKTtcbiAgfTtcbiAgc2VsZi5kZWZpbmVQcm9wZXJ0eSggXCJyaWdodFZpZXdcIiwge1xuICAgIHJlYWQ6ICAgICAgICAgICAgdHJ1ZSxcbiAgICB3cml0ZTogICAgICAgICAgIHRydWUsXG4gICAgYmFja2luZ1ZhcmlhYmxlOiBmYWxzZVxuICB9ICk7XG4gIC8qKlxuICAgKiBAbWV0aG9kIHJlbmRlclxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHNlbGYub3ZlcnJpZGUoIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gXCJcIjsgLy8gbm90aGluZyB0byByZW5kZXIhXG4gIH0gKTtcbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGxlZnQgYW5kIHJpZ2h0IGVsZW1lbnRzIGlmIG5lY2Vzc2FyeVxuICAgKiBAbWV0aG9kIHJlbmRlclRvRWxlbWVudFxuICAgKi9cbiAgc2VsZi5vdmVycmlkZSggZnVuY3Rpb24gcmVuZGVyVG9FbGVtZW50KCkge1xuICAgIHNlbGYuX2NyZWF0ZUVsZW1lbnRzSWZOZWNlc3NhcnkoKTtcbiAgICBzZWxmLl9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50SWZOb3RDcmVhdGVkKCk7XG4gICAgcmV0dXJuOyAvLyBub3RoaW5nIHRvIGRvLlxuICB9ICk7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBzcGxpdCB2aWV3IGNvbnRyb2xsZXJcbiAgICogQG1ldGhvZCBpbml0XG4gICAqIEBwYXJhbSB7Vmlld0NvbnRhaW5lcn0gdGhlTGVmdFZpZXdcbiAgICogQHBhcmFtIHtWaWV3Q29udGFpbmVyfSB0aGVSaWdodFZpZXdcbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0aGVFbGVtZW50SWRdXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdGhlRWxlbWVudENsYXNzXVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3RoZUVsZW1lbnRUYWddXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gW3RoZVBhcmVudEVsZW1lbnRdXG4gICAqL1xuICBzZWxmLm92ZXJyaWRlKCBmdW5jdGlvbiBpbml0KCB0aGVMZWZ0VmlldywgdGhlUmlnaHRWaWV3LCB0aGVFbGVtZW50SWQsIHRoZUVsZW1lbnRUYWcsIHRoZUVsZW1lbnRDbGFzcywgdGhlUGFyZW50RWxlbWVudCApIHtcbiAgICBpZiAoIHR5cGVvZiB0aGVMZWZ0VmlldyA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvciggXCJDYW4ndCBpbml0aWFsaXplIGEgbmF2aWdhdGlvbiBjb250cm9sbGVyIHdpdGhvdXQgYSBsZWZ0IHZpZXcuXCIgKTtcbiAgICB9XG4gICAgaWYgKCB0eXBlb2YgdGhlUmlnaHRWaWV3ID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIkNhbid0IGluaXRpYWxpemUgYSBuYXZpZ2F0aW9uIGNvbnRyb2xsZXIgd2l0aG91dCBhIHJpZ2h0IHZpZXcuXCIgKTtcbiAgICB9XG4gICAgLy8gZG8gd2hhdCBhIG5vcm1hbCB2aWV3IGNvbnRhaW5lciBkb2VzXG4gICAgc2VsZi4kc3VwZXIoIHRoZUVsZW1lbnRJZCwgdGhlRWxlbWVudFRhZywgdGhlRWxlbWVudENsYXNzLCB0aGVQYXJlbnRFbGVtZW50ICk7XG4vLyAgICBzZWxmLnN1cGVyKCBfY2xhc3NOYW1lLCBcImluaXRcIiwgW3RoZUVsZW1lbnRJZCwgdGhlRWxlbWVudFRhZywgdGhlRWxlbWVudENsYXNzLCB0aGVQYXJlbnRFbGVtZW50IF0gKTtcbiAgICAvLyBub3cgYWRkIHRoZSBsZWZ0IGFuZCByaWdodCB2aWV3c1xuICAgIHNlbGYubGVmdFZpZXcgPSB0aGVMZWZ0VmlldztcbiAgICBzZWxmLnJpZ2h0VmlldyA9IHRoZVJpZ2h0VmlldztcbiAgICByZXR1cm4gc2VsZjtcbiAgfSApO1xuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgc3BsaXQgdmlldyBjb250cm9sbGVyXG4gICAqIEBtZXRob2QgaW5pdFdpdGhPcHRpb25zXG4gICAqL1xuICBzZWxmLm92ZXJyaWRlKCBmdW5jdGlvbiBpbml0V2l0aE9wdGlvbnMoIG9wdGlvbnMgKSB7XG4gICAgdmFyIHRoZUxlZnRWaWV3LCB0aGVSaWdodFZpZXcsIHRoZUVsZW1lbnRJZCwgdGhlRWxlbWVudFRhZywgdGhlRWxlbWVudENsYXNzLFxuICAgICAgdGhlUGFyZW50RWxlbWVudDtcbiAgICBpZiAoIHR5cGVvZiBvcHRpb25zICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5pZCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgdGhlRWxlbWVudElkID0gb3B0aW9ucy5pZDtcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMudGFnICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICB0aGVFbGVtZW50VGFnID0gb3B0aW9ucy50YWc7XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLmNsYXNzICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICB0aGVFbGVtZW50Q2xhc3MgPSBvcHRpb25zLmNsYXNzO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5wYXJlbnQgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHRoZVBhcmVudEVsZW1lbnQgPSBvcHRpb25zLnBhcmVudDtcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMubGVmdFZpZXcgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHRoZUxlZnRWaWV3ID0gb3B0aW9ucy5sZWZ0VmlldztcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMucmlnaHRWaWV3ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICB0aGVSaWdodFZpZXcgPSBvcHRpb25zLnJpZ2h0VmlldztcbiAgICAgIH1cbiAgICB9XG4gICAgc2VsZi5pbml0KCB0aGVMZWZ0VmlldywgdGhlUmlnaHRWaWV3LCB0aGVFbGVtZW50SWQsIHRoZUVsZW1lbnRUYWcsIHRoZUVsZW1lbnRDbGFzcywgdGhlUGFyZW50RWxlbWVudCApO1xuICAgIGlmICggdHlwZW9mIG9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLnZpZXdUeXBlICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBzZWxmLnZpZXdUeXBlID0gb3B0aW9ucy52aWV3VHlwZTtcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMubGVmdFZpZXdTdGF0dXMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHNlbGYubGVmdFZpZXdTdGF0dXMgPSBvcHRpb25zLmxlZnRWaWV3U3RhdHVzO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2VsZjtcbiAgfSApO1xuICAvKipcbiAgICogRGVzdHJveSBvdXIgZWxlbWVudHMgYW5kIGNsZWFuIHVwXG4gICAqXG4gICAqIEBtZXRob2QgZGVzdHJveVxuICAgKi9cbiAgc2VsZi5vdmVycmlkZSggZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICBzZWxmLl91bnBhcmVudFNpZGUoIDAgKTtcbiAgICBzZWxmLl91bnBhcmVudFNpZGUoIDEgKTtcbiAgICBpZiAoIHNlbGYuX2xlZnRFbGVtZW50ICE9PSBudWxsICkge1xuICAgICAgc2VsZi5lbGVtZW50LnJlbW92ZUNoaWxkKCBzZWxmLl9sZWZ0RWxlbWVudCApO1xuICAgIH1cbiAgICBpZiAoIHNlbGYuX3JpZ2h0RWxlbWVudCAhPT0gbnVsbCApIHtcbiAgICAgIHNlbGYuZWxlbWVudC5yZW1vdmVDaGlsZCggc2VsZi5fcmlnaHRFbGVtZW50ICk7XG4gICAgfVxuICAgIHNlbGYuX2xlZnRFbGVtZW50ID0gbnVsbDtcbiAgICBzZWxmLl9yaWdodEVsZW1lbnQgPSBudWxsO1xuICAgIHNlbGYuJHN1cGVyKCk7XG4gICAgLy9zZWxmLnN1cGVyKCBfY2xhc3NOYW1lLCBcImRlc3Ryb3lcIiApO1xuICB9ICk7XG4gIC8vIGF1dG8gaW5pdGlhbGl6ZVxuICBzZWxmLl9hdXRvSW5pdC5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XG4gIHJldHVybiBzZWxmO1xufTtcbm1vZHVsZS5leHBvcnRzID0gU3BsaXRWaWV3Q29udHJvbGxlcjtcbiIsIi8qKlxuICpcbiAqIFRhYiBWaWV3IENvbnRyb2xsZXJzIHByb3ZpZGUgYmFzaWMgc3VwcG9ydCBmb3IgdGFiYmVkIHZpZXdzXG4gKlxuICogQG1vZHVsZSB0YWJWaWV3Q29udHJvbGxlci5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNFxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKi9cbi8qZ2xvYmFsIG1vZHVsZSovXG5cInVzZSBzdHJpY3RcIjtcbnZhciBVSSA9IHJlcXVpcmUoIFwiLi9jb3JlXCIgKSxcbiAgVmlld0NvbnRhaW5lciA9IHJlcXVpcmUoIFwiLi92aWV3Q29udGFpbmVyXCIgKSxcbiAgZXZlbnQgPSByZXF1aXJlKCBcIi4vZXZlbnRcIiApO1xudmFyIF9jbGFzc05hbWUgPSBcIlRhYlZpZXdDb250cm9sbGVyXCI7XG52YXIgVGFiVmlld0NvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gbmV3IFZpZXdDb250YWluZXIoKTtcbiAgc2VsZi5zdWJjbGFzcyggX2NsYXNzTmFtZSApO1xuICAvLyAjIE5vdGlmaWNhdGlvbnNcbiAgLy9cbiAgLy8gKiBgdmlld3NDaGFuZ2VkYCAtIEZpcmVkIHdoZW4gdGhlIHZpZXdzIGNoYW5nZVxuICBzZWxmLnJlZ2lzdGVyTm90aWZpY2F0aW9uKCBcInZpZXdzQ2hhbmdlZFwiICk7XG4gIC8vIGludGVybmFsIGVsZW1lbnRzXG4gIHNlbGYuX3RhYkVsZW1lbnRzID0gW107IC8vIGVhY2ggdGFiIG9uIHRoZSB0YWIgYmFyXG4gIHNlbGYuX3RhYkJhckVsZW1lbnQgPSBudWxsOyAvLyBjb250YWlucyBvdXIgYmFyIGJ1dHRvbiBncm91cFxuICBzZWxmLl9iYXJCdXR0b25Hcm91cCA9IG51bGw7IC8vIGNvbnRhaW5zIGFsbCBvdXIgdGFic1xuICBzZWxmLl92aWV3Q29udGFpbmVyID0gbnVsbDsgLy8gY29udGFpbnMgYWxsIG91ciBzdWJ2aWV3c1xuICAvKipcbiAgICogQ3JlYXRlIHRoZSB0YWIgYmFyIGVsZW1lbnRcbiAgICogQG1ldGhvZCBfY3JlYXRlVGFiQmFyRWxlbWVudFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2VsZi5fY3JlYXRlVGFiQmFyRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLl90YWJCYXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIHNlbGYuX3RhYkJhckVsZW1lbnQuY2xhc3NOYW1lID0gXCJ1aS10YWItYmFyIHVpLXRhYi1kZWZhdWx0LXBvc2l0aW9uXCI7XG4gICAgc2VsZi5fYmFyQnV0dG9uR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG4gICAgc2VsZi5fYmFyQnV0dG9uR3JvdXAuY2xhc3NOYW1lID0gXCJ1aS1iYXItYnV0dG9uLWdyb3VwIHVpLWFsaWduLWNlbnRlclwiO1xuICAgIHNlbGYuX3RhYkJhckVsZW1lbnQuYXBwZW5kQ2hpbGQoIHNlbGYuX2JhckJ1dHRvbkdyb3VwICk7XG4gIH07XG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIHRhYiBiYXIgZWxlbWVudCBpZiBuZWNlc3NhcnlcbiAgICogQG1ldGhvZCBfY3JlYXRlVGFiQmFyRWxlbWVudElmTmVjZXNzYXJ5XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZWxmLl9jcmVhdGVUYWJCYXJFbGVtZW50SWZOZWNlc3NhcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCBzZWxmLl90YWJCYXJFbGVtZW50ID09PSBudWxsICkge1xuICAgICAgc2VsZi5fY3JlYXRlVGFiQmFyRWxlbWVudCgpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIGNyZWF0ZSB0aGUgdmlldyBjb250YWluZXIgdGhhdCB3aWxsIGhvbGQgYWxsIHRoZSB2aWV3cyB0aGlzIHRhYiBiYXIgb3duc1xuICAgKiBAbWV0aG9kIF9jcmVhdGVWaWV3Q29udGFpbmVyXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZWxmLl9jcmVhdGVWaWV3Q29udGFpbmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX3ZpZXdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG4gICAgc2VsZi5fdmlld0NvbnRhaW5lci5jbGFzc05hbWUgPSBcInVpLWNvbnRhaW5lciB1aS1hdm9pZC10YWItYmFyIHVpLXRhYi1kZWZhdWx0LXBvc2l0aW9uXCI7XG4gIH07XG4gIC8qKlxuICAgKiBAbWV0aG9kIF9jcmVhdGVWaWV3Q29udGFpbmVySWZOZWNlc3NhcnlcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbGYuX2NyZWF0ZVZpZXdDb250YWluZXJJZk5lY2Vzc2FyeSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIHNlbGYuX3ZpZXdDb250YWluZXIgPT09IG51bGwgKSB7XG4gICAgICBzZWxmLl9jcmVhdGVWaWV3Q29udGFpbmVyKCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQ3JlYXRlIGFsbCB0aGUgZWxlbWVudHMgYW5kIHRoZSBET00gc3RydWN0dXJlXG4gICAqIEBtZXRob2QgX2NyZWF0ZUVsZW1lbnRzXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZWxmLl9jcmVhdGVFbGVtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLl9jcmVhdGVUYWJCYXJFbGVtZW50SWZOZWNlc3NhcnkoKTtcbiAgICBzZWxmLl9jcmVhdGVWaWV3Q29udGFpbmVySWZOZWNlc3NhcnkoKTtcbiAgICBzZWxmLmVsZW1lbnQuYXBwZW5kQ2hpbGQoIHNlbGYuX3RhYkJhckVsZW1lbnQgKTtcbiAgICBzZWxmLmVsZW1lbnQuYXBwZW5kQ2hpbGQoIHNlbGYuX3ZpZXdDb250YWluZXIgKTtcbiAgfTtcbiAgLyoqXG4gICAqIEBtZXRob2QgX2NyZWF0ZUVsZW1lbnRzSWZOZWNlc3NhcnlcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbGYuX2NyZWF0ZUVsZW1lbnRzSWZOZWNlc3NhcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCBzZWxmLl90YWJCYXJFbGVtZW50ICE9PSBudWxsIHx8IHNlbGYuX3ZpZXdDb250YWluZXIgIT09IG51bGwgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNlbGYuX2NyZWF0ZUVsZW1lbnRzKCk7XG4gIH07XG4gIC8qKlxuICAgKiBDcmVhdGUgYSB0YWIgZWxlbWVudCBhbmQgYXR0YWNoIHRoZSBhcHByb3ByaWF0ZSBldmVudCBsaXN0ZW5lclxuICAgKiBAbWV0aG9kIF9jcmVhdGVUYWJFbGVtZW50XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZWxmLl9jcmVhdGVUYWJFbGVtZW50ID0gZnVuY3Rpb24gKCBhVmlldywgaWR4ICkge1xuICAgIHZhciBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIGUuY2xhc3NOYW1lID0gXCJ1aS1iYXItYnV0dG9uIHVpLXRpbnQtY29sb3JcIjtcbiAgICBlLmlubmVySFRNTCA9IGFWaWV3LnRpdGxlO1xuICAgIGUuc2V0QXR0cmlidXRlKCBcImRhdGEtdGFnXCIsIGlkeCApXG4gICAgZXZlbnQuYWRkTGlzdGVuZXIoIGUsIFwidG91Y2hzdGFydFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLnNlbGVjdGVkVGFiID0gcGFyc2VJbnQoIHRoaXMuZ2V0QXR0cmlidXRlKCBcImRhdGEtdGFnXCIgKSwgMTAgKTtcbiAgICB9ICk7XG4gICAgcmV0dXJuIGU7XG4gIH07XG4gIC8qKlxuICAgKiBUaGUgcG9zaXRpb24gb2YgdGhlIHRoZSB0YWIgYmFyXG4gICAqIFZhbGlkIG9wdGlvbnMgaW5jbHVkZTogYGRlZmF1bHRgLCBgdG9wYCwgYW5kIGBib3R0b21gXG4gICAqIEBwcm9wZXJ0eSBiYXJQb3NpdGlvblxuICAgKiBAdHlwZSB7VGFiVmlld0NvbnRyb2xsZXIuQkFSXFxfUE9TSVRJT059XG4gICAqL1xuICBzZWxmLnNldE9ic2VydmFibGVCYXJQb3NpdGlvbiA9IGZ1bmN0aW9uICggbmV3UG9zaXRpb24sIG9sZFBvc2l0aW9uICkge1xuICAgIHNlbGYuX2NyZWF0ZUVsZW1lbnRzSWZOZWNlc3NhcnkoKTtcbiAgICBzZWxmLl90YWJCYXJFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoIFwidWktdGFiLVwiICsgb2xkUG9zaXRpb24gKyBcIi1wb3NpdGlvblwiICk7XG4gICAgc2VsZi5fdGFiQmFyRWxlbWVudC5jbGFzc0xpc3QuYWRkKCBcInVpLXRhYi1cIiArIG5ld1Bvc2l0aW9uICsgXCItcG9zaXRpb25cIiApO1xuICAgIHNlbGYuX3ZpZXdDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSggXCJ1aS10YWItXCIgKyBvbGRQb3NpdGlvbiArIFwiLXBvc2l0aW9uXCIgKTtcbiAgICBzZWxmLl92aWV3Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoIFwidWktdGFiLVwiICsgbmV3UG9zaXRpb24gKyBcIi1wb3NpdGlvblwiICk7XG4gICAgcmV0dXJuIG5ld1Bvc2l0aW9uO1xuICB9O1xuICBzZWxmLmRlZmluZU9ic2VydmFibGVQcm9wZXJ0eSggXCJiYXJQb3NpdGlvblwiLCB7XG4gICAgZGVmYXVsdDogXCJkZWZhdWx0XCJcbiAgfSApO1xuICAvKipcbiAgICogVGhlIGFsaWdubWVudCBvZiB0aGUgYmFyIGl0ZW1zXG4gICAqIFZhbGlkIG9wdGlvbnMgYXJlOiBgbGVmdGAsIGBjZW50ZXJgLCBgcmlnaHRgXG4gICAqIEBwcm9wZXJ0eSBiYXJBbGlnbm1lbnRcbiAgICogQHR5cGUge1RhYlZpZXdDb250cm9sbGVyLkJBUlxcX0FMSUdOTUVOVH1cbiAgICovXG4gIHNlbGYuc2V0T2JzZXJ2YWJsZUJhckFsaWdubWVudCA9IGZ1bmN0aW9uICggbmV3QWxpZ25tZW50LCBvbGRBbGlnbm1lbnQgKSB7XG4gICAgc2VsZi5fY3JlYXRlRWxlbWVudHNJZk5lY2Vzc2FyeSgpO1xuICAgIHNlbGYuX2JhckJ1dHRvbkdyb3VwLmNsYXNzTGlzdC5yZW1vdmUoIFwidWktYWxpZ24tXCIgKyBvbGRBbGlnbm1lbnQgKTtcbiAgICBzZWxmLl9iYXJCdXR0b25Hcm91cC5jbGFzc0xpc3QuYWRkKCBcInVpLWFsaWduLVwiICsgbmV3QWxpZ25tZW50ICk7XG4gICAgcmV0dXJuIG5ld0FsaWdubWVudDtcbiAgfTtcbiAgc2VsZi5kZWZpbmVPYnNlcnZhYmxlUHJvcGVydHkoIFwiYmFyQWxpZ25tZW50XCIsIHtcbiAgICBkZWZhdWx0OiBcImNlbnRlclwiXG4gIH0gKTtcbiAgLyoqXG4gICAqIFRoZSBhcnJheSBvZiB2aWV3cyB0aGF0IHRoaXMgdGFiIHZpZXcgY29udHJvbGxlciBtYW5hZ2VzLlxuICAgKiBAcHJvcGVydHkgc3Vidmlld3NcbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cbiAgc2VsZi5kZWZpbmVQcm9wZXJ0eSggXCJzdWJ2aWV3c1wiLCB7XG4gICAgcmVhZDogICAgdHJ1ZSxcbiAgICB3cml0ZTogICBmYWxzZSxcbiAgICBkZWZhdWx0OiBbXVxuICB9ICk7XG4gIC8qKlxuICAgKiBBZGQgYSBzdWJ2aWV3IHRvIHRoZSB0YWIgYmFyLlxuICAgKiBAbWV0aG9kIGFkZFN1YnZpZXdcbiAgICogQHByb3BlcnR5IHtWaWV3Q29udGFpbmVyfSB2aWV3XG4gICAqL1xuICBzZWxmLmFkZFN1YnZpZXcgPSBmdW5jdGlvbiAoIHZpZXcgKSB7XG4gICAgc2VsZi5fY3JlYXRlRWxlbWVudHNJZk5lY2Vzc2FyeSgpO1xuICAgIHZhciBlID0gc2VsZi5fY3JlYXRlVGFiRWxlbWVudCggdmlldywgc2VsZi5fdGFiRWxlbWVudHMubGVuZ3RoICk7XG4gICAgc2VsZi5fYmFyQnV0dG9uR3JvdXAuYXBwZW5kQ2hpbGQoIGUgKTtcbiAgICBzZWxmLl90YWJFbGVtZW50cy5wdXNoKCBlICk7XG4gICAgc2VsZi5fc3Vidmlld3MucHVzaCggdmlldyApO1xuICAgIHZpZXcudGFiVmlld0NvbnRyb2xsZXIgPSBzZWxmO1xuICAgIHZpZXcubm90aWZ5KCBcInZpZXdXYXNQdXNoZWRcIiApO1xuICB9O1xuICAvKipcbiAgICogUmVtb3ZlIGEgc3BlY2lmaWMgdmlldyBmcm9tIHRoZSB0YWIgYmFyLlxuICAgKiBAbWV0aG9kIHJlbW92ZVN1YnZpZXdcbiAgICogQHByb3BlcnR5IHtWaWV3Q29udGFpbmVyfSB2aWV3XG4gICAqL1xuICBzZWxmLnJlbW92ZVN1YnZpZXcgPSBmdW5jdGlvbiAoIHZpZXcgKSB7XG4gICAgc2VsZi5fY3JlYXRlRWxlbWVudHNJZk5lY2Vzc2FyeSgpO1xuICAgIHZhciBpID0gc2VsZi5fc3Vidmlld3MuaW5kZXhPZiggdmlldyApO1xuICAgIGlmICggaSA+IC0xICkge1xuICAgICAgdmFyIGhpZGluZ1ZpZXcgPSBzZWxmLl9zdWJ2aWV3c1tpXTtcbiAgICAgIHZhciBoaWRpbmdWaWV3UGFyZW50ID0gaGlkaW5nVmlldy5wYXJlbnRFbGVtZW50O1xuICAgICAgaWYgKCBoaWRpbmdWaWV3UGFyZW50ICE9PSBudWxsICkge1xuICAgICAgICBoaWRpbmdWaWV3Lm5vdGlmeSggXCJ2aWV3V2lsbERpc2FwcGVhclwiICk7XG4gICAgICB9XG4gICAgICBoaWRpbmdWaWV3LnBhcmVudEVsZW1lbnQgPSBudWxsO1xuICAgICAgaWYgKCBoaWRpbmdWaWV3UGFyZW50ICE9PSBudWxsICkge1xuICAgICAgICBoaWRpbmdWaWV3Lm5vdGlmeSggXCJ2aWV3RGlkRGlzYXBwZWFyXCIgKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuX3N1YnZpZXdzLnNwbGljZSggaSwgMSApO1xuICAgICAgc2VsZi5fYmFyQnV0dG9uR3JvdXAucmVtb3ZlQ2hpbGQoIHNlbGYuX3RhYkVsZW1lbnRzW2ldICk7XG4gICAgICBzZWxmLl90YWJFbGVtZW50cy5zcGxpY2UoIGksIDEgKTtcbiAgICAgIHZhciBjdXJTZWxlY3RlZFRhYiA9IHNlbGYuc2VsZWN0ZWRUYWI7XG4gICAgICBpZiAoIGN1clNlbGVjdGVkVGFiID4gaSApIHtcbiAgICAgICAgY3VyU2VsZWN0ZWRUYWItLTtcbiAgICAgIH1cbiAgICAgIGlmICggY3VyU2VsZWN0ZWRUYWIgPiBzZWxmLl90YWJFbGVtZW50cy5sZW5ndGggKSB7XG4gICAgICAgIGN1clNlbGVjdGVkVGFiID0gc2VsZi5fdGFiRWxlbWVudHMubGVuZ3RoO1xuICAgICAgfVxuICAgICAgc2VsZi5zZWxlY3RlZFRhYiA9IGN1clNlbGVjdGVkVGFiO1xuICAgIH1cbiAgICB2aWV3Lm5vdGlmeSggXCJ2aWV3V2FzUG9wcGVkXCIgKTtcbiAgICBkZWxldGUgdmlldy50YWJWaWV3Q29udHJvbGxlcjtcbiAgfTtcbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hpY2ggdGFiIGlzIHNlbGVjdGVkOyBjaGFuZ2luZyB3aWxsIGRpc3BsYXkgdGhlIGFwcHJvcHJpYXRlXG4gICAqIHRhYi5cbiAgICpcbiAgICogQHByb3BlcnR5IHNlbGVjdGVkVGFiXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBzZWxmLnNldE9ic2VydmFibGVTZWxlY3RlZFRhYiA9IGZ1bmN0aW9uICggbmV3SW5kZXgsIG9sZEluZGV4ICkge1xuICAgIHZhciBvbGRWaWV3LCBuZXdWaWV3O1xuICAgIHNlbGYuX2NyZWF0ZUVsZW1lbnRzSWZOZWNlc3NhcnkoKTtcbiAgICBpZiAoIG9sZEluZGV4ID4gLTEgKSB7XG4gICAgICBvbGRWaWV3ID0gc2VsZi5fc3Vidmlld3Nbb2xkSW5kZXhdO1xuICAgICAgaWYgKCBuZXdJbmRleCA+IC0xICkge1xuICAgICAgICBuZXdWaWV3ID0gc2VsZi5fc3Vidmlld3NbbmV3SW5kZXhdO1xuICAgICAgfVxuICAgICAgb2xkVmlldy5ub3RpZnkoIFwidmlld1dpbGxEaXNhcHBlYXJcIiApO1xuICAgICAgaWYgKCBuZXdJbmRleCA+IC0xICkge1xuICAgICAgICBuZXdWaWV3Lm5vdGlmeSggXCJ2aWV3V2lsbEFwcGVhclwiICk7XG4gICAgICB9XG4gICAgICBvbGRWaWV3LnBhcmVudEVsZW1lbnQgPSBudWxsO1xuICAgICAgaWYgKCBuZXdJbmRleCA+IC0xICkge1xuICAgICAgICBzZWxmLl9zdWJ2aWV3c1tuZXdJbmRleF0ucGFyZW50RWxlbWVudCA9IHNlbGYuX3ZpZXdDb250YWluZXI7XG4gICAgICB9XG4gICAgICBvbGRWaWV3Lm5vdGlmeSggXCJ2aWV3RGlkRGlzYXBwZWFyXCIgKTtcbiAgICAgIGlmICggbmV3SW5kZXggPiAtMSApIHtcbiAgICAgICAgbmV3Vmlldy5ub3RpZnkoIFwidmlld0RpZEFwcGVhclwiICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1ZpZXcgPSBzZWxmLl9zdWJ2aWV3c1tuZXdJbmRleF07XG4gICAgICBuZXdWaWV3Lm5vdGlmeSggXCJ2aWV3V2lsbEFwcGVhclwiICk7XG4gICAgICBzZWxmLl9zdWJ2aWV3c1tuZXdJbmRleF0ucGFyZW50RWxlbWVudCA9IHNlbGYuX3ZpZXdDb250YWluZXI7XG4gICAgICBuZXdWaWV3Lm5vdGlmeSggXCJ2aWV3RGlkQXBwZWFyXCIgKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0luZGV4O1xuICB9O1xuICBzZWxmLmRlZmluZU9ic2VydmFibGVQcm9wZXJ0eSggXCJzZWxlY3RlZFRhYlwiLCB7XG4gICAgZGVmYXVsdDogICAgICAtMSxcbiAgICBub3RpZnlBbHdheXM6IHRydWVcbiAgfSApO1xuICAvKipcbiAgICogQG1ldGhvZCByZW5kZXJcbiAgICovXG4gIHNlbGYub3ZlcnJpZGUoIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gXCJcIjsgLy8gbm90aGluZyB0byByZW5kZXIhXG4gIH0gKTtcbiAgLyoqXG4gICAqIEBtZXRob2QgcmVuZGVyVG9FbGVtZW50XG4gICAqL1xuICBzZWxmLm92ZXJyaWRlKCBmdW5jdGlvbiByZW5kZXJUb0VsZW1lbnQoKSB7XG4gICAgc2VsZi5fY3JlYXRlRWxlbWVudHNJZk5lY2Vzc2FyeSgpO1xuICAgIHJldHVybjsgLy8gbm90aGluZyB0byBkby5cbiAgfSApO1xuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgdGFiIGNvbnRyb2xsZXJcbiAgICogQG1ldGhvZCBpbml0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdGhlRWxlbWVudElkXVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3RoZUVsZW1lbnRUYWddXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdGhlRWxlbWVudENsYXNzXVxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IFt0aGVQYXJlbnRFbGVtZW50XVxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBzZWxmLm92ZXJyaWRlKCBmdW5jdGlvbiBpbml0KCB0aGVFbGVtZW50SWQsIHRoZUVsZW1lbnRUYWcsIHRoZUVsZW1lbnRDbGFzcywgdGhlUGFyZW50RWxlbWVudCApIHtcbiAgICAvLyBkbyB3aGF0IGEgbm9ybWFsIHZpZXcgY29udGFpbmVyIGRvZXNcbiAgICBzZWxmLiRzdXBlciggdGhlRWxlbWVudElkLCB0aGVFbGVtZW50VGFnLCB0aGVFbGVtZW50Q2xhc3MsIHRoZVBhcmVudEVsZW1lbnQgKTtcbiAgICAvL3NlbGYuc3VwZXIoIF9jbGFzc05hbWUsIFwiaW5pdFwiLCBbdGhlRWxlbWVudElkLCB0aGVFbGVtZW50VGFnLCB0aGVFbGVtZW50Q2xhc3MsIHRoZVBhcmVudEVsZW1lbnQgXSApO1xuICAgIHJldHVybiBzZWxmO1xuICB9ICk7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSB0YWIgY29udHJvbGxlclxuICAgKiBAbWV0aG9kIGluaXRXaXRoT3B0aW9uc1xuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBzZWxmLm92ZXJyaWRlKCBmdW5jdGlvbiBpbml0V2l0aE9wdGlvbnMoIG9wdGlvbnMgKSB7XG4gICAgdmFyIHRoZUVsZW1lbnRJZCwgdGhlRWxlbWVudFRhZywgdGhlRWxlbWVudENsYXNzLCB0aGVQYXJlbnRFbGVtZW50O1xuICAgIGlmICggdHlwZW9mIG9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLmlkICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICB0aGVFbGVtZW50SWQgPSBvcHRpb25zLmlkO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50YWcgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHRoZUVsZW1lbnRUYWcgPSBvcHRpb25zLnRhZztcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMuY2xhc3MgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHRoZUVsZW1lbnRDbGFzcyA9IG9wdGlvbnMuY2xhc3M7XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLnBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgdGhlUGFyZW50RWxlbWVudCA9IG9wdGlvbnMucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgICBzZWxmLmluaXQoIHRoZUVsZW1lbnRJZCwgdGhlRWxlbWVudFRhZywgdGhlRWxlbWVudENsYXNzLCB0aGVQYXJlbnRFbGVtZW50ICk7XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMuYmFyUG9zaXRpb24gIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHNlbGYuYmFyUG9zaXRpb24gPSBvcHRpb25zLmJhclBvc2l0aW9uO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5iYXJBbGlnbm1lbnQgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHNlbGYuYmFyQWxpZ25tZW50ID0gb3B0aW9ucy5iYXJBbGlnbm1lbnQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZWxmO1xuICB9ICk7XG4gIC8vIGF1dG8gaW5pdFxuICBzZWxmLl9hdXRvSW5pdC5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XG4gIHJldHVybiBzZWxmO1xufTtcblRhYlZpZXdDb250cm9sbGVyLkJBUl9QT1NJVElPTiA9IHtcbiAgZGVmYXVsdDogXCJkZWZhdWx0XCIsXG4gIHRvcDogICAgIFwidG9wXCIsXG4gIGJvdHRvbTogIFwiYm90dG9tXCJcbn07XG5UYWJWaWV3Q29udHJvbGxlci5CQVJfQUxJR05NRU5UID0ge1xuICBjZW50ZXI6IFwiY2VudGVyXCIsXG4gIGxlZnQ6ICAgXCJsZWZ0XCIsXG4gIHJpZ2h0OiAgXCJyaWdodFwiXG59O1xubW9kdWxlLmV4cG9ydHMgPSBUYWJWaWV3Q29udHJvbGxlcjtcbiIsIi8qKlxuICpcbiAqIHVpIEJhciBCdXR0b24gVGVtcGxhdGVcbiAqXG4gKiBAbW9kdWxlIHVpQmFyQnV0dG9uLmpzXG4gKiBAYXV0aG9yIEtlcnJpIFNob3R0c1xuICogQHZlcnNpb24gMC40XG4gKlxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKi9cbi8qZ2xvYmFsIG1vZHVsZSovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyXG4gIGggPSByZXF1aXJlKCBcInlhc21mLWhcIiApO1xuXG4vKipcbiAqIFJldHVybiBhIFVJIEJhciBCdXR0b24gbm9kZVxuICpcbiAqIE9wdGlvbnMgc2hvdWxkIGxvb2sgbGlrZSB0aGlzOlxuICpcbiAqIHtcbiAqICAgW3JlZ3VsYXIgaCBvcHRpb25zXSxcbiAqICAgZ2x5cGg6IFwiY2xvY2tcIiwgLy8gbXV0dWFsbHkgZXhjbHVzaXZlIHdpdGggdGV4dFxuICogICB0ZXh0OiBcInRhcCBtZSFcIiwgLy8gbXV0dWFsbHkgZXhjbHVzaXZlIHdpdGggZ2x5cGhcbiAqICAgYmFja0J1dHRvbjogZmFsc2UsIC8vIG9yIHRydWU7IGlmIHRydWUsIHJlcXVpcmVzIHRleHRcbiAqIH1cbiAqXG4gKiBAbWV0aG9kIHVpQmFyQnV0dG9uXG4gKiBAcGFyYW0ge3tbZ2x5cGhdOiBzdHJpbmcsIFt0ZXh0XTogc3RyaW5nLCBbYmFja0J1dHRvbl06IGJvb2xlYW59fSBvcHRpb25zXG4gKiBAcmV0dXJucyB7Tm9kZX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB1aUJhckJ1dHRvbiggb3B0aW9ucyApIHtcbiAgdmFyIGJ1dHRvbkNsYXNzID0gXCJ1aS1iYXItYnV0dG9uXCIsXG4gICAgaXNCdXR0b25HbHlwaCA9IGZhbHNlO1xuICBpZiAoIG9wdGlvbnMgKSB7XG4gICAgaWYgKCBvcHRpb25zLmdseXBoICkge1xuICAgICAgYnV0dG9uQ2xhc3MgKz0gW1wiXCIsIFwidWktZ2x5cGhcIiwgXCJ1aS1nbHlwaC1cIiArIG9wdGlvbnMuZ2x5cGgsIFwidWktYmFja2dyb3VuZC10aW50LWNvbG9yXCJdLmpvaW4oIFwiIFwiICk7XG4gICAgICBpc0J1dHRvbkdseXBoID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYmFja0J1dHRvbikge1xuICAgICAgYnV0dG9uQ2xhc3MgKz0gXCIgdWktYmFjay1idXR0b25cIjtcbiAgICB9XG4gIH1cblxuICBpZiAoICFpc0J1dHRvbkdseXBoICkge1xuICAgIGJ1dHRvbkNsYXNzICs9IFwiIHVpLXRpbnQtY29sb3JcIjtcbiAgfVxuXG4gIHJldHVybiBoLmVsKCBcImRpdi5cIiArIGJ1dHRvbkNsYXNzLCBvcHRpb25zLCBvcHRpb25zICYmIG9wdGlvbnMudGV4dCApO1xufTtcbiIsIi8qKlxuICpcbiAqIHVpIE5hdmlnYXRpb24gQmFyIFRlbXBsYXRlXG4gKlxuICogQG1vZHVsZSB1aU5hdmlnYXRpb25CYXIuanNcbiAqIEBhdXRob3IgS2VycmkgU2hvdHRzXG4gKiBAdmVyc2lvbiAwLjRcbiAqXG4gKiBgYGBcbiAqIENvcHlyaWdodCAoYykgMjAxNSBLZXJyaSBTaG90dHMsIHBob3RvS2FuZHkgU3R1ZGlvcyBMTENcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZ1xuICogY29uZGl0aW9uczpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXNcbiAqIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVJcbiAqIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlRcbiAqIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gKiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKiBgYGBcbiAqL1xuLypnbG9iYWwgbW9kdWxlKi9cblwidXNlIHN0cmljdFwiO1xudmFyXG4gIGggPSByZXF1aXJlKCBcInlhc21mLWhcIiApO1xuXG5mdW5jdGlvbiBzY3JvbGxUb1RvcCgpIHtcbiAgdmFyIHNjcm9sbGVyID0gdGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUuJCggXCIudWktc2Nyb2xsLWNvbnRhaW5lclwiICk7XG4gIGlmICggc2Nyb2xsZXIgKSB7XG4gICAgc2Nyb2xsZXIuc2Nyb2xsVG9wID0gMDsgLy8gc2Nyb2xsIHRvIHRvcCwgcGxlYXNlIVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdWlOYXZpZ2F0aW9uQmFyKCBvcHRpb25zICkge1xuICByZXR1cm4gaC5lbCggXCJkaXYudWktbmF2aWdhdGlvbi1iYXJcIixcbiAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgb3B0aW9ucyAmJiBvcHRpb25zLmxlZnRHcm91cCA/IGguZWwoIFwiZGl2LnVpLWJhci1idXR0b24tZ3JvdXAgdWktYWxpZ24tbGVmdFwiLCBvcHRpb25zLmxlZnRHcm91cCApIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICBvcHRpb25zICYmIG9wdGlvbnMudGl0bGUgPyBoLmVsKCBcImRpdi51aS10aXRsZVwiLCBvcHRpb25zLnRpdGxlLCBvcHRpb25zLnRpdGxlT3B0aW9ucyApIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICBvcHRpb25zICYmIG9wdGlvbnMuY2VudGVyR3JvdXAgPyBoLmVsKCBcImRpdi51aS1iYXItYnV0dG9uLWdyb3VwIHVpLWFsaWduLWNlbnRlclwiLCBvcHRpb25zLmNlbnRlckdyb3VwICkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgIG9wdGlvbnMgJiYgb3B0aW9ucy5yaWdodEdyb3VwID8gaC5lbCggXCJkaXYudWktYmFyLWJ1dHRvbi1ncm91cCB1aS1hbGlnbi1yaWdodFwiLCBvcHRpb25zLnJpZ2h0R3JvdXAgKSA6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgXVxuICApO1xufTtcbiIsIi8qKlxuICpcbiAqIFZpZXcgQ29udGFpbmVycyBhcmUgc2ltcGxlIG9iamVjdHMgdGhhdCBwcm92aWRlIHZlcnkgYmFzaWMgdmlldyBtYW5hZ2VtZW50IHdpdGhcbiAqIGEgdGhpbiBsYXllciBvdmVyIHRoZSBjb3JyZXNwb25kaW5nIERPTSBlbGVtZW50LlxuICpcbiAqIEBtb2R1bGUgdmlld0NvbnRhaW5lci5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNVxuICpcbiAqIGBgYFxuICogQ29weXJpZ2h0IChjKSAyMDEzIEtlcnJpIFNob3R0cywgcGhvdG9LYW5keSBTdHVkaW9zIExMQ1xuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nXG4gKiBjb25kaXRpb25zOlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllc1xuICogb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUlxuICogUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuICogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVFxuICogT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1JcbiAqIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqIGBgYFxuICovXG4vKmdsb2JhbCBtb2R1bGUqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQmFzZU9iamVjdCA9IHJlcXVpcmUoIFwiLi4vdXRpbC9vYmplY3RcIiApLFxuICBoID0gcmVxdWlyZSggXCJ5YXNtZi1oXCIgKTtcbnZhciBfY2xhc3NOYW1lID0gXCJWaWV3Q29udGFpbmVyXCI7XG52YXIgVmlld0NvbnRhaW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSBuZXcgQmFzZU9iamVjdCgpO1xuICBzZWxmLnN1YmNsYXNzKCBfY2xhc3NOYW1lICk7XG4gIC8vICMgTm90aWZpY2F0aW9uc1xuICAvLyAqIGB2aWV3V2FzUHVzaGVkYCBpcyBmaXJlZCBieSBhIGNvbnRhaW5pbmcgYFZpZXdDb250cm9sbGVyYCB3aGVuIHRoZSB2aWV3IGlzIGFkZGVkXG4gIC8vICAgdG8gdGhlIHZpZXcgc3RhY2tcbiAgLy8gKiBgdmlld1dhc1BvcHBlZGAgaXMgZmlyZWQgYnkgYSBjb250YWluZXIgd2hlbiB0aGUgdmlldyBpcyByZW1vdmVkIGZyb20gdGhlIHZpZXcgc3RhY2tcbiAgLy8gKiBgdmlld1dpbGxBcHBlYXJgIGlzIGZpcmVkIGJ5IGEgY29udGFpbmVyIHdoZW4gdGhlIHZpZXcgaXMgYWJvdXQgdG8gYXBwZWFyIChvbmUgc2hvdWxkIGF2b2lkXG4gIC8vICAgYW55IHNpZ25pZmljYW50IERPTSBjaGFuZ2VzIG9yIGNhbGN1bGF0aW9ucyBkdXJpbmcgdGhpcyB0aW1lLCBvciBhbmltYXRpb25zIG1heSBzdHV0dGVyKVxuICAvLyAqIGB2aWV3V2lsbERpc2FwcGVhcmAgaXMgZmlyZWQgYnkgYSBjb250YWluZXIgd2hlbiB0aGUgdmlldyBpcyBhYm91dCB0byBkaXNhcHBlYXJcbiAgLy8gKiBgdmlld0RpZEFwcGVhcmAgaXMgZmlyZWQgYnkgYSBjb250YWluZXIgd2hlbiB0aGUgdmlldyBpcyBvbiBzY3JlZW4uXG4gIC8vICogYHZpZXdEaWREaXNhcHBlYXJgIGlzIGZpcmVkIGJ5IGEgY29udGFpbmVyIHdoZW4gdGhlIHZpZXcgaXMgb2ZmIHNjcmVlbi5cbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJ2aWV3V2FzUHVzaGVkXCIgKTtcbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJ2aWV3V2FzUG9wcGVkXCIgKTtcbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJ2aWV3V2lsbEFwcGVhclwiICk7XG4gIHNlbGYucmVnaXN0ZXJOb3RpZmljYXRpb24oIFwidmlld1dpbGxEaXNhcHBlYXJcIiApO1xuICBzZWxmLnJlZ2lzdGVyTm90aWZpY2F0aW9uKCBcInZpZXdEaWRBcHBlYXJcIiApO1xuICBzZWxmLnJlZ2lzdGVyTm90aWZpY2F0aW9uKCBcInZpZXdEaWREaXNhcHBlYXJcIiApO1xuICBzZWxmLnJlZ2lzdGVyTm90aWZpY2F0aW9uKCBcIndpbGxSZW5kZXJcIiwgZmFsc2UgKTtcbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJkaWRSZW5kZXJcIiwgZmFsc2UgKTtcbiAgLy8gcHJpdmF0ZSBwcm9wZXJ0aWVzIHVzZWQgdG8gbWFuYWdlIHRoZSBjb3JyZXNwb25kaW5nIERPTSBlbGVtZW50XG4gIHNlbGYuX2VsZW1lbnQgPSBudWxsO1xuICBzZWxmLl9lbGVtZW50Q2xhc3MgPSBcInVpLWNvbnRhaW5lclwiOyAvLyBkZWZhdWx0OyBjYW4gYmUgY2hhbmdlZCB0byBhbnkgY2xhc3MgZm9yIHN0eWxpbmcgcHVycG9zZXNcbiAgc2VsZi5fZWxlbWVudElkID0gbnVsbDsgLy8gYmFkIGRlc2lnbiBkZWNpc2lvbiAtLSBwcm9iYWJseSBnb2luZyB0byBtYXJrIHRoaXMgYXMgZGVwcmVjYXRlZCBzb29uXG4gIHNlbGYuX2VsZW1lbnRUYWcgPSBcImRpdlwiOyAvLyBzb21lIGVsZW1lbnRzIG1pZ2h0IG5lZWQgdG8gYmUgc29tZXRoaW5nIG90aGVyIHRoYW4gYSBESVZcbiAgc2VsZi5fcGFyZW50RWxlbWVudCA9IG51bGw7IC8vIG93bmluZyBlbGVtZW50XG4gIC8qKlxuICAgKiBUaGUgdGl0bGUgaXNuJ3QgZGlzcGxheWVkIGFueXdoZXJlICh1bmxlc3MgeW91IHVzZSBpdCB5b3Vyc2VsZiBpbiBgcmVuZGVyVG9FbGVtZW50YCwgYnV0XG4gICAqIGlzIHVzZWZ1bCBmb3IgY29udGFpbmVycyB0aGF0IHdhbnQgdG8ga25vdyB0aGUgdGl0bGUgb2YgdGhlaXIgdmlld3MuXG4gICAqIEBwcm9wZXJ0eSB0aXRsZVxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAb2JzZXJ2YWJsZVxuICAgKi9cbiAgc2VsZi5kZWZpbmVPYnNlcnZhYmxlUHJvcGVydHkoIFwidGl0bGVcIiApO1xuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgaW50ZXJuYWwgZWxlbWVudHMuXG4gICAqIEBtZXRob2QgY3JlYXRlRWxlbWVudFxuICAgKi9cbiAgc2VsZi5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBzZWxmLl9lbGVtZW50VGFnICk7XG4gICAgaWYgKCBzZWxmLmVsZW1lbnRDbGFzcyAhPT0gbnVsbCApIHtcbiAgICAgIHNlbGYuX2VsZW1lbnQuY2xhc3NOYW1lID0gc2VsZi5lbGVtZW50Q2xhc3M7XG4gICAgfVxuICAgIGlmICggc2VsZi5lbGVtZW50SWQgIT09IG51bGwgKSB7XG4gICAgICBzZWxmLl9lbGVtZW50LmlkID0gc2VsZi5lbGVtZW50SWQ7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgaW50ZXJuYWwgZWxlbWVudHMgaWYgbmVjZXNzYXJ5ICh0aGF0IGlzLCBpZiB0aGV5IGFyZW4ndCBhbHJlYWR5IGluIGV4aXN0ZW5jZSlcbiAgICogQG1ldGhvZCBjcmVhdGVFbGVtZW50SWZOb3RDcmVhdGVkXG4gICAqL1xuICBzZWxmLmNyZWF0ZUVsZW1lbnRJZk5vdENyZWF0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCBzZWxmLl9lbGVtZW50ID09PSBudWxsICkge1xuICAgICAgc2VsZi5jcmVhdGVFbGVtZW50KCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogVGhlIGBlbGVtZW50YCBwcm9wZXJ0eSBhbGxvdyBkaXJlY3QgYWNjZXNzIHRvIHRoZSBET00gZWxlbWVudCBiYWNraW5nIHRoZSB2aWV3XG4gICAqIEBwcm9wZXJ0eSBlbGVtZW50XG4gICAqIEB0eXBlIHtET01FbGVtZW50fVxuICAgKi9cbiAgc2VsZi5nZXRFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuY3JlYXRlRWxlbWVudElmTm90Q3JlYXRlZCgpO1xuICAgIHJldHVybiBzZWxmLl9lbGVtZW50O1xuICB9O1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcImVsZW1lbnRcIiwge1xuICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgd3JpdGU6ICAgdHJ1ZSxcbiAgICBkZWZhdWx0OiBudWxsXG4gIH0gKTtcbiAgLyoqXG4gICAqIFRoZSBgZWxlbWVudENsYXNzYCBwcm9wZXJ0eSBpbmRpY2F0ZXMgdGhlIGNsYXNzIG9mIHRoZSBET00gZWxlbWVudC4gQ2hhbmdpbmdcbiAgICogdGhlIGNsYXNzIHdpbGwgYWx0ZXIgdGhlIGJhY2tpbmcgRE9NIGVsZW1lbnQgaWYgY3JlYXRlZC5cbiAgICogQHByb3BlcnR5IGVsZW1lbnRDbGFzc1xuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAZGVmYXVsdCBcInVpLWNvbnRhaW5lclwiXG4gICAqL1xuICBzZWxmLnNldEVsZW1lbnRDbGFzcyA9IGZ1bmN0aW9uICggdGhlQ2xhc3NOYW1lICkge1xuICAgIHNlbGYuX2VsZW1lbnRDbGFzcyA9IHRoZUNsYXNzTmFtZTtcbiAgICBpZiAoIHNlbGYuX2VsZW1lbnQgIT09IG51bGwgKSB7XG4gICAgICBzZWxmLl9lbGVtZW50LmNsYXNzTmFtZSA9IHRoZUNsYXNzTmFtZTtcbiAgICB9XG4gIH07XG4gIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwiZWxlbWVudENsYXNzXCIsIHtcbiAgICByZWFkOiAgICB0cnVlLFxuICAgIHdyaXRlOiAgIHRydWUsXG4gICAgZGVmYXVsdDogXCJ1aS1jb250YWluZXJcIlxuICB9ICk7XG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHRoZSBgaWRgIGZvciB0aGUgYmFja2luZyBET00gZWxlbWVudC4gTm90IHRoZSBiZXN0IGNob2ljZSB0b1xuICAgKiB1c2UsIHNpbmNlIHRoaXMgbXVzdCBiZSB1bmlxdWUgd2l0aGluIHRoZSBET00uIFByb2JhYmx5IGdvaW5nIHRvIGJlY29tZVxuICAgKiBkZXByZWNhdGVkIGV2ZW50dWFsbHlcbiAgICovXG4gIHNlbGYuc2V0RWxlbWVudElkID0gZnVuY3Rpb24gKCB0aGVFbGVtZW50SWQgKSB7XG4gICAgc2VsZi5fZWxlbWVudElkID0gdGhlRWxlbWVudElkO1xuICAgIGlmICggc2VsZi5fZWxlbWVudCAhPT0gbnVsbCApIHtcbiAgICAgIHNlbGYuX2VsZW1lbnQuaWQgPSB0aGVFbGVtZW50SWQ7XG4gICAgfVxuICB9O1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcImVsZW1lbnRJZFwiLCB7XG4gICAgcmVhZDogICAgdHJ1ZSxcbiAgICB3cml0ZTogICB0cnVlLFxuICAgIGRlZmF1bHQ6IG51bGxcbiAgfSApO1xuICAvKipcbiAgICogRGV0ZXJtaW5lcyB0aGUgdHlwZSBvZiBET00gRWxlbWVudDsgYnkgZGVmYXVsdCB0aGlzIGlzIGEgRElWLlxuICAgKiBAcHJvcGVydHkgZWxlbWVudFRhZ1xuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAZGVmYXVsdCBcImRpdlwiXG4gICAqL1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcImVsZW1lbnRUYWdcIiwge1xuICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgd3JpdGU6ICAgdHJ1ZSxcbiAgICBkZWZhdWx0OiBcImRpdlwiXG4gIH0gKTtcbiAgLyoqXG4gICAqIEluZGljYXRlcyB0aGUgcGFyZW50IGVsZW1lbnQsIGlmIGl0IGV4aXN0cy4gVGhpcyBpcyBhIERPTSBlbGVtZW50XG4gICAqIHRoYXQgb3ducyB0aGlzIHZpZXcgKHBhcmVudCAtPiBjaGlsZCkuIENoYW5naW5nIHRoZSBwYXJlbnQgcmVtb3Zlc1xuICAgKiB0aGlzIGVsZW1lbnQgZnJvbSB0aGUgcGFyZW50IGFuZCByZXBhcmVudHMgdG8gYW5vdGhlciBlbGVtZW50LlxuICAgKiBAcHJvcGVydHkgcGFyZW50RWxlbWVudFxuICAgKiBAdHlwZSB7RE9NRWxlbWVudH1cbiAgICovXG4gIHNlbGYuc2V0UGFyZW50RWxlbWVudCA9IGZ1bmN0aW9uICggdGhlUGFyZW50RWxlbWVudCApIHtcbiAgICBpZiAoIHNlbGYuX3BhcmVudEVsZW1lbnQgIT09IG51bGwgJiYgc2VsZi5fZWxlbWVudCAhPT0gbnVsbCApIHtcbiAgICAgIC8vIHJlbW92ZSBvdXJzZWx2ZXMgZnJvbSB0aGUgZXhpc3RpbmcgcGFyZW50IGVsZW1lbnQgZmlyc3RcbiAgICAgIHNlbGYuX3BhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoIHNlbGYuX2VsZW1lbnQgKTtcbiAgICAgIHNlbGYuX3BhcmVudEVsZW1lbnQgPSBudWxsO1xuICAgIH1cbiAgICBzZWxmLl9wYXJlbnRFbGVtZW50ID0gdGhlUGFyZW50RWxlbWVudDtcbiAgICBpZiAoIHNlbGYuX3BhcmVudEVsZW1lbnQgIT09IG51bGwgJiYgc2VsZi5fZWxlbWVudCAhPT0gbnVsbCApIHtcbiAgICAgIHNlbGYuX3BhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoIHNlbGYuX2VsZW1lbnQgKTtcbiAgICB9XG4gIH07XG4gIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwicGFyZW50RWxlbWVudFwiLCB7XG4gICAgcmVhZDogICAgdHJ1ZSxcbiAgICB3cml0ZTogICB0cnVlLFxuICAgIGRlZmF1bHQ6IG51bGxcbiAgfSApO1xuICAvKipcbiAgICogQG1ldGhvZCByZW5kZXJcbiAgICogQHJldHVybiB7U3RyaW5nfERPTUVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH1cbiAgICogYHJlbmRlcmAgaXMgY2FsbGVkIGJ5IGByZW5kZXJUb0VsZW1lbnRgLiBUaGUgaWRlYSBiZWhpbmQgdGhpcyBpcyB0byBnZW5lcmF0ZVxuICAgKiBhIHJldHVybiB2YWx1ZSBjb25zaXN0aW5nIG9mIHRoZSBET00gdHJlZSBuZWNlc3NhcnkgdG8gY3JlYXRlIHRoZSB2aWV3J3NcbiAgICogY29udGVudHMuXG4gICAqKi9cbiAgc2VsZi5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gcmlnaHQgbm93LCB0aGlzIGRvZXNuJ3QgZG8gYW55dGhpbmcsIGJ1dCBpdCdzIGhlcmUgZm9yIGluaGVyaXRhbmNlIHB1cnBvc2VzXG4gICAgcmV0dXJuIFwiRXJyb3I6IEFic3RyYWN0IE1ldGhvZFwiO1xuICB9O1xuICAvKipcbiAgICogUmVuZGVycyB0aGUgY29udGVudCBvZiB0aGUgdmlldy4gQ2FuIGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSwgYnV0IG1vcmVcbiAgICogb2Z0ZW4gaXMgY2FsbGVkIG9uY2UgZHVyaW5nIGBpbml0YC4gQ2FsbHMgYHJlbmRlcmAgaW1tZWRpYXRlbHkgYW5kXG4gICAqIGFzc2lnbnMgaXQgdG8gYGVsZW1lbnRgJ3MgYGlubmVySFRNTGAgLS0gdGhpcyBpbXBsaWNpdGx5IGNyZWF0ZXMgdGhlXG4gICAqIERPTSBlbGVtZW50cyBiYWNraW5nIHRoZSB2aWV3IGlmIHRoZXkgd2VyZW4ndCBhbHJlYWR5IGNyZWF0ZWQuXG4gICAqIEBtZXRob2QgcmVuZGVyVG9FbGVtZW50XG4gICAqL1xuICBzZWxmLnJlbmRlclRvRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLmVtaXQoIFwid2lsbFJlbmRlclwiICk7XG4gICAgdmFyIHJlbmRlck91dHB1dCA9IHNlbGYucmVuZGVyKCk7XG4gICAgaWYgKCB0eXBlb2YgcmVuZGVyT3V0cHV0ID09PSBcInN0cmluZ1wiICkge1xuICAgICAgc2VsZi5lbGVtZW50LmlubmVySFRNTCA9IHNlbGYucmVuZGVyKCk7XG4gICAgfSBlbHNlIGlmICggdHlwZW9mIHJlbmRlck91dHB1dCA9PT0gXCJvYmplY3RcIiApIHtcbiAgICAgIGgucmVuZGVyVG8oIHJlbmRlck91dHB1dCwgc2VsZi5lbGVtZW50ICk7XG4gICAgfVxuICAgIHNlbGYuZW1pdCggXCJkaWRSZW5kZXJcIiApO1xuICB9O1xuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhlIHZpZXcgY29udGFpbmVyOyByZXR1cm5zIGBzZWxmYFxuICAgKiBAbWV0aG9kIGluaXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0aGVFbGVtZW50SWRdXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdGhlRWxlbWVudFRhZ11cbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0aGVFbGVtZW50Q2xhc3NdXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gW3RoZVBhcmVudEVsZW1lbnRdXG4gICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAqL1xuICBzZWxmLm92ZXJyaWRlKCBmdW5jdGlvbiBpbml0KCB0aGVFbGVtZW50SWQsIHRoZUVsZW1lbnRUYWcsIHRoZUVsZW1lbnRDbGFzcywgdGhlUGFyZW50RWxlbWVudCApIHtcbiAgICBzZWxmLiRzdXBlcigpO1xuICAgIC8vc2VsZi5zdXBlciggX2NsYXNzTmFtZSwgXCJpbml0XCIgKTsgLy8gc3VwZXIgaGFzIG5vIHBhcmFtZXRlcnNcbiAgICAvLyBzZXQgb3VyIElkLCBUYWcsIGFuZCBDbGFzc1xuICAgIGlmICggdHlwZW9mIHRoZUVsZW1lbnRJZCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIHNlbGYuZWxlbWVudElkID0gdGhlRWxlbWVudElkO1xuICAgIH1cbiAgICBpZiAoIHR5cGVvZiB0aGVFbGVtZW50VGFnICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgc2VsZi5lbGVtZW50VGFnID0gdGhlRWxlbWVudFRhZztcbiAgICB9XG4gICAgaWYgKCB0eXBlb2YgdGhlRWxlbWVudENsYXNzICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgc2VsZi5lbGVtZW50Q2xhc3MgPSB0aGVFbGVtZW50Q2xhc3M7XG4gICAgfVxuICAgIC8vIHJlbmRlciBvdXJzZWx2ZXMgdG8gdGhlIGVsZW1lbnQgKHZpYSByZW5kZXIpOyB0aGlzIGltcGxpY2l0bHkgY3JlYXRlcyB0aGUgZWxlbWVudFxuICAgIC8vIHdpdGggdGhlIGFib3ZlIHByb3BlcnRpZXMuXG4gICAgc2VsZi5yZW5kZXJUb0VsZW1lbnQoKTtcbiAgICAvLyBhZGQgb3Vyc2VsdmVzIHRvIG91ciBwYXJlbnQuXG4gICAgaWYgKCB0eXBlb2YgdGhlUGFyZW50RWxlbWVudCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIHNlbGYucGFyZW50RWxlbWVudCA9IHRoZVBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiBzZWxmO1xuICB9ICk7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgdmlldyBjb250YWluZXIuIGBvcHRpb25zYCBjYW4gc3BlY2lmeSBhbnkgb2YgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKlxuICAgKiAgKiBgaWRgIC0gdGhlIGBpZGAgb2YgdGhlIGVsZW1lbnRcbiAgICogICogYHRhZ2AgLSB0aGUgZWxlbWVudCB0YWcgdG8gdXNlIChgZGl2YCBpcyB0aGUgZGVmYXVsdClcbiAgICogICogYGNsYXNzYCAtIHRoZSBjbGFzcyBuYW1lIHRvIHVzZSAoYHVpLWNvbnRhaW5lcmAgaXMgdGhlIGRlZmF1bHQpXG4gICAqICAqIGBwYXJlbnRgIC0gdGhlIHBhcmVudCBET01FbGVtZW50XG4gICAqXG4gICAqIEBtZXRob2QgaW5pdFdpdGhPcHRpb25zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIHNlbGYuaW5pdFdpdGhPcHRpb25zID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuICAgIHZhciB0aGVFbGVtZW50SWQsIHRoZUVsZW1lbnRUYWcsIHRoZUVsZW1lbnRDbGFzcywgdGhlUGFyZW50RWxlbWVudDtcbiAgICBpZiAoIHR5cGVvZiBvcHRpb25zICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5pZCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgdGhlRWxlbWVudElkID0gb3B0aW9ucy5pZDtcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMudGFnICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICB0aGVFbGVtZW50VGFnID0gb3B0aW9ucy50YWc7XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLmNsYXNzICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICB0aGVFbGVtZW50Q2xhc3MgPSBvcHRpb25zLmNsYXNzO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5wYXJlbnQgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHRoZVBhcmVudEVsZW1lbnQgPSBvcHRpb25zLnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VsZi5pbml0KCB0aGVFbGVtZW50SWQsIHRoZUVsZW1lbnRUYWcsIHRoZUVsZW1lbnRDbGFzcywgdGhlUGFyZW50RWxlbWVudCApO1xuICAgIGlmICggdHlwZW9mIG9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLnRpdGxlICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBzZWxmLnRpdGxlID0gb3B0aW9ucy50aXRsZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNlbGY7XG4gIH07XG4gIC8qKlxuICAgKiBDbGVhbiB1cFxuICAgKiBAbWV0aG9kIGRlc3Ryb3lcbiAgICovXG4gIHNlbGYub3ZlcnJpZGUoIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgLy8gcmVtb3ZlIG91cnNlbHZlcyBmcm9tIHRoZSBwYXJlbnQgdmlldywgaWYgYXR0YWNoZWRcbiAgICBpZiAoIHNlbGYuX3BhcmVudEVsZW1lbnQgIT09IG51bGwgJiYgc2VsZi5fZWxlbWVudCAhPT0gbnVsbCApIHtcbiAgICAgIC8vIHJlbW92ZSBvdXJzZWx2ZXMgZnJvbSB0aGUgZXhpc3RpbmcgcGFyZW50IGVsZW1lbnQgZmlyc3RcbiAgICAgIHNlbGYuX3BhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoIHNlbGYuX2VsZW1lbnQgKTtcbiAgICAgIHNlbGYuX3BhcmVudEVsZW1lbnQgPSBudWxsO1xuICAgIH1cbiAgICAvLyBhbmQgbGV0IG91ciBzdXBlciBrbm93IHRoYXQgaXQgY2FuIGNsZWFuIHVwXG4gICAgc2VsZi4kc3VwZXIoKTtcbiAgICAvL3NlbGYuc3VwZXIoIF9jbGFzc05hbWUsIFwiZGVzdHJveVwiICk7XG4gIH0gKTtcbiAgLy8gaGFuZGxlIGF1dG8taW5pdGlhbGl6YXRpb25cbiAgc2VsZi5fYXV0b0luaXQuYXBwbHkoIHNlbGYsIGFyZ3VtZW50cyApO1xuICAvLyByZXR1cm4gdGhlIG5ldyBvYmplY3RcbiAgcmV0dXJuIHNlbGY7XG59O1xuLy8gcmV0dXJuIHRoZSBuZXcgZmFjdG9yeVxubW9kdWxlLmV4cG9ydHMgPSBWaWV3Q29udGFpbmVyO1xuIiwiLyoqXG4gKlxuICogQ29yZSBvZiBZQVNNRi1VVElMOyBkZWZpbmVzIHRoZSB2ZXJzaW9uLCBET00sIGFuZCBsb2NhbGl6YXRpb24gY29udmVuaWVuY2UgbWV0aG9kcy5cbiAqXG4gKiBAbW9kdWxlIGNvcmUuanNcbiAqIEBhdXRob3IgS2VycmkgU2hvdHRzXG4gKiBAdmVyc2lvbiAwLjVcbiAqXG4gKiBgYGBcbiAqIENvcHlyaWdodCAoYykgMjAxMyBLZXJyaSBTaG90dHMsIHBob3RvS2FuZHkgU3R1ZGlvcyBMTENcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZ1xuICogY29uZGl0aW9uczpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXNcbiAqIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVJcbiAqIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlRcbiAqIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gKiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKiBgYGBcbiAqL1xuLypnbG9iYWwgZGVmaW5lLCBHbG9iYWxpemUsIGRldmljZSwgZG9jdW1lbnQsIHdpbmRvdywgc2V0VGltZW91dCwgbmF2aWdhdG9yLCBjb25zb2xlLCBOb2RlKi9cblwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBAbWV0aG9kIGdldENvbXB1dGVkU3R5bGVcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IGVsZW1lbnQgICAgICB0aGUgZWxlbWVudCB0byByZXF1ZXN0IHRoZSBjb21wdXRlZCBzdHlsZSBmcm9tXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgICB0aGUgcHJvcGVydHkgdG8gcmVxdWVzdCAobGlrZSBgd2lkdGhgKTsgb3B0aW9uYWxcbiAqIEByZXR1cm5zIHsqfSAgICAgICAgICAgICAgIEVpdGhlciB0aGUgcHJvcGVydHkgcmVxdWVzdGVkIG9yIHRoZSBlbnRpcmUgQ1NTIHN0eWxlIGRlY2xhcmF0aW9uXG4gKi9cbmZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoIGVsZW1lbnQsIHByb3BlcnR5ICkge1xuICBpZiAoICEoIGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlICkgJiYgdHlwZW9mIGVsZW1lbnQgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgcHJvcGVydHkgPSBlbGVtZW50O1xuICAgIGVsZW1lbnQgPSB0aGlzO1xuICB9XG4gIHZhciBjb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoIGVsZW1lbnQgKTtcbiAgaWYgKCB0eXBlb2YgcHJvcGVydHkgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgcmV0dXJuIGNvbXB1dGVkU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSggcHJvcGVydHkgKTtcbiAgfVxuICByZXR1cm4gY29tcHV0ZWRTdHlsZTtcbn1cbi8qKlxuICogQG1ldGhvZCBfYXJyYXlpemVcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGVMaXN0fSBsaXN0ICAgICB0aGUgbGlzdCB0byBjb252ZXJ0XG4gKiBAcmV0dXJucyB7QXJyYXl9ICAgICAgICAgICB0aGUgY29udmVydGVkIGFycmF5XG4gKi9cbmZ1bmN0aW9uIF9hcnJheWl6ZSggbGlzdCApIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuY2FsbCggbGlzdCwgMCApO1xufVxuLyoqXG4gKiBAbWV0aG9kIGdldEVsZW1lbnRCeUlkXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBwYXJlbnQgICAgICB0aGUgcGFyZW50IHRvIGV4ZWN1dGUgZ2V0RWxlbWVudEJ5SWQgb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBlbGVtZW50SWQgdGhlIGVsZW1lbnQgSUQgdG8gc2VhcmNoIGZvclxuICogQHJldHVybnMge05vZGV9ICAgICAgICAgICB0aGUgZWxlbWVudCBvciBudWxsIGlmIG5vdCBmb3VuZFxuICovXG5mdW5jdGlvbiBnZXRFbGVtZW50QnlJZCggcGFyZW50LCBlbGVtZW50SWQgKSB7XG4gIGlmICggdHlwZW9mIHBhcmVudCA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICBlbGVtZW50SWQgPSBwYXJlbnQ7XG4gICAgcGFyZW50ID0gZG9jdW1lbnQ7XG4gIH1cbiAgcmV0dXJuICggcGFyZW50LmdldEVsZW1lbnRCeUlkKCBlbGVtZW50SWQgKSApO1xufVxuLyoqXG4gKiBAbWV0aG9kIHF1ZXJ5U2VsZWN0b3JcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IHBhcmVudCAgICAgICB0aGUgcGFyZW50IHRvIGV4ZWN1dGUgcXVlcnlTZWxlY3RvciBvblxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yICAgdGhlIENTUyBzZWxlY3RvciB0byB1c2VcbiAqIEByZXR1cm5zIHtOb2RlfSAgICAgICAgICAgIHRoZSBsb2NhdGVkIGVsZW1lbnQgb3IgbnVsbCBpZiBub3QgZm91bmRcbiAqL1xuZnVuY3Rpb24gcXVlcnlTZWxlY3RvciggcGFyZW50LCBzZWxlY3RvciApIHtcbiAgaWYgKCB0eXBlb2YgcGFyZW50ID09PSBcInN0cmluZ1wiICkge1xuICAgIHNlbGVjdG9yID0gcGFyZW50O1xuICAgIHBhcmVudCA9IGRvY3VtZW50O1xuICB9XG4gIHJldHVybiAoIHBhcmVudC5xdWVyeVNlbGVjdG9yKCBzZWxlY3RvciApICk7XG59XG4vKipcbiAqIEBtZXRob2QgcXVlcnlTZWxlY3RvckFsbFxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gcGFyZW50ICAgICB0aGUgcGFyZW50IHRvIGV4ZWN1dGUgcXVlcnlTZWxlY3RvckFsbCBvblxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIHRoZSBzZWxlY3RvciB0byB1c2VcbiAqIEByZXR1cm5zIHtBcnJheX0gICAgICAgICB0aGUgZm91bmQgZWxlbWVudHM7IGlmIG5vbmU6IFtdXG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5U2VsZWN0b3JBbGwoIHBhcmVudCwgc2VsZWN0b3IgKSB7XG4gIGlmICggdHlwZW9mIHBhcmVudCA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICBzZWxlY3RvciA9IHBhcmVudDtcbiAgICBwYXJlbnQgPSBkb2N1bWVudDtcbiAgfVxuICByZXR1cm4gX2FycmF5aXplKCBwYXJlbnQucXVlcnlTZWxlY3RvckFsbCggc2VsZWN0b3IgKSApO1xufVxuLyoqXG4gKiBAbWV0aG9kICRcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgICB0aGUgQ1NTIHNlbGVjdG9yIHRvIHVzZVxuICogQHJldHVybnMge05vZGV9ICAgICAgICAgICAgVGhlIGxvY2F0ZWQgZWxlbWVudCwgcmVsYXRpdmUgdG8gYHRoaXNgXG4gKi9cbmZ1bmN0aW9uICQoIHNlbGVjdG9yICkge1xuICByZXR1cm4gcXVlcnlTZWxlY3RvciggdGhpcywgc2VsZWN0b3IgKTtcbn1cbi8qKlxuICogQG1ldGhvZCAkJFxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciAgIHRoZSBDU1Mgc2VsZWN0b3IgdG8gdXNlXG4gKiBAcmV0dXJucyB7QXJyYXl9ICAgICAgICAgICB0aGUgbG9jYXRlZCBlbGVtZW50cywgcmVsYXRpdmUgdG8gYHRoaXNgXG4gKi9cbmZ1bmN0aW9uICQkKCBzZWxlY3RvciApIHtcbiAgcmV0dXJuIHF1ZXJ5U2VsZWN0b3JBbGwoIHRoaXMsIHNlbGVjdG9yICk7XG59XG4vKipcbiAqIEBtZXRob2QgJGlkXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGlkICAgICAgICAgdGhlIGlkIG9mIHRoZSBlbGVtZW50XG4gKiBAcmV0dXJucyB7Tm9kZX0gICAgICAgICAgICB0aGUgbG9jYXRlZCBlbGVtZW50IG9yIG51bGwgaWYgbm90IGZvdW5kXG4gKi9cbmZ1bmN0aW9uICRpZCggaWQgKSB7XG4gIHJldHVybiBnZXRFbGVtZW50QnlJZCggdGhpcywgaWQgKTtcbn1cbi8vIG1vZGlmeSBOb2RlJ3MgcHJvdG90eXBlIHRvIHByb3ZpZGUgdXNlZnVsIGFkZGl0aW9uYWwgc2hvcnRjdXRzXG52YXIgcHJvdG8gPSBOb2RlLnByb3RvdHlwZTtcbltcbiAgW1wiJFwiLCAkXSxcbiAgW1wiJCRcIiwgJCRdLFxuICBbXCIkMVwiLCAkXSxcbiAgW1wiJGlkXCIsICRpZF0sXG4gIFtcImdzY1wiLCBnZXRDb21wdXRlZFN0eWxlXSxcbiAgW1wiZ2NzXCIsIGdldENvbXB1dGVkU3R5bGVdLFxuICBbXCJnZXRDb21wdXRlZFN0eWxlXCIsIGdldENvbXB1dGVkU3R5bGVdXG5dLmZvckVhY2goIGZ1bmN0aW9uICggaSApIHtcbiAgICAgICAgICAgICBpZiAoIHR5cGVvZiBwcm90b1tpWzBdXSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICAgICAgIHByb3RvW2lbMF1dID0gaVsxXTtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgIH0gKTtcbi8qKlxuICogUmV0dXJucyBhIHZhbHVlIGZvciB0aGUgc3BlY2lmaWVkIGtleXBhdGguIElmIGFueSBpbnRlcnZlbmluZ1xuICogdmFsdWVzIGV2YWx1YXRlIHRvIHVuZGVmaW5lZCBvciBudWxsLCB0aGUgZW50aXJlIHJlc3VsdCBpc1xuICogdW5kZWZpbmVkIG9yIG51bGwsIHJlc3BlY3RpdmVseS5cbiAqXG4gKiBJZiB5b3UgbmVlZCBhIGRlZmF1bHQgdmFsdWUgdG8gYmUgcmV0dXJuZWQgaW4gc3VjaCBhbiBpbnN0YW5jZSxcbiAqIHNwZWNpZnkgaXQgYWZ0ZXIgdGhlIGtleXBhdGguXG4gKlxuICogTm90ZTogaWYgYG9gIGlzIG5vdCBhbiBvYmplY3QsIGl0IGlzIGFzc3VtZWQgdGhhdCB0aGUgZnVuY3Rpb25cbiAqIGhhcyBiZWVuIGJvdW5kIHRvIGB0aGlzYC4gQXMgc3VjaCwgYWxsIGFyZ3VtZW50cyBhcmUgc2hpZnRlZCBieVxuICogb25lIHBvc2l0aW9uIHRvIHRoZSByaWdodC5cbiAqXG4gKiBLZXkgcGF0aHMgYXJlIG9mIHRoZSBmb3JtOlxuICpcbiAqICAgIG9iamVjdC5maWVsZC5maWVsZC5maWVsZFtpbmRleF1cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gbyAgICAgICAgdGhlIG9iamVjdCB0byBzZWFyY2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrICAgICAgICB0aGUga2V5cGF0aFxuICogQHBhcmFtIHsqfSBkICAgICAgICAgICAgIChvcHRpb25hbCkgdGhlIGRlZmF1bHQgdmFsdWUgdG8gcmV0dXJuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkIHRoZSBrZXlwYXRoIGV2YWx1YXRlIHRvIG51bGwgb3JcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQuXG4gKiBAcmV0dXJuIHsqfSAgICAgICAgICAgICAgdGhlIHZhbHVlIGF0IHRoZSBrZXlwYXRoXG4gKlxuICogTGljZW5zZSBNSVQ6IENvcHlyaWdodCAyMDE0IEtlcnJpIFNob3R0c1xuICovXG5mdW5jdGlvbiB2YWx1ZUZvcktleVBhdGgoIG8sIGssIGQgKSB7XG4gIGlmICggbyA9PT0gdW5kZWZpbmVkIHx8IG8gPT09IG51bGwgKSB7XG4gICAgcmV0dXJuICggZCAhPT0gdW5kZWZpbmVkICkgPyBkIDogbztcbiAgfVxuICBpZiAoICEoIG8gaW5zdGFuY2VvZiBPYmplY3QgKSApIHtcbiAgICBkID0gaztcbiAgICBrID0gbztcbiAgICBvID0gdGhpcztcbiAgfVxuICB2YXIgdiA9IG87XG4gIC8vIFRoZXJlJ3MgYSBtaWxsaW9uIHdheXMgdGhhdCB0aGlzIHJlZ2V4IGNhbiBnbyB3cm9uZ1xuICAvLyB3aXRoIHJlc3BlY3QgdG8gSmF2YVNjcmlwdCBpZGVudGlmaWVycy4gU3BsaXRzIHdpbGxcbiAgLy8gdGVjaG5pY2FsbHkgd29yayB3aXRoIGp1c3QgYWJvdXQgZXZlcnkgbm9uLUEtWmEtelxcJC1cbiAgLy8gdmFsdWUsIHNvIHlvdXIga2V5cGF0aCBjb3VsZCBiZSBcImZpZWxkL2ZpZWxkL2ZpZWxkXCJcbiAgLy8gYW5kIGl0IHdvdWxkIHdvcmsgbGlrZSBcImZpZWxkLmZpZWxkLmZpZWxkXCIuXG4gIHYgPSBrLm1hdGNoKCAvKFtcXHdcXCRcXFxcXFwtXSspL2cgKS5yZWR1Y2UoIGZ1bmN0aW9uICggdiwga2V5UGFydCApIHtcbiAgICBpZiAoIHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSBudWxsICkge1xuICAgICAgcmV0dXJuIHY7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdltrZXlQYXJ0XTtcbiAgICB9XG4gICAgY2F0Y2ggKCBlcnIgKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSwgdiApO1xuICByZXR1cm4gKCAoIHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSBudWxsICkgJiYgKCBkICE9PSB1bmRlZmluZWQgKSApID8gZCA6IHY7XG59XG4vKipcbiAqIEludGVycG9sYXRlcyB2YWx1ZXMgZnJvbSB0aGUgY29udGV4dCBpbnRvIHRoZSBzdHJpbmcuIFBsYWNlaG9sZGVycyBhcmUgb2YgdGhlXG4gKiBmb3JtIHsuLi59LiBJZiB2YWx1ZXMgd2l0aGluIHsuLi59IGRvIG5vdCBleGlzdCB3aXRoaW4gY29udGV4dCwgdGhleSBhcmVcbiAqIHJlcGxhY2VkIHdpdGggdW5kZWZpbmVkLlxuICogQHBhcmFtICB7c3RyaW5nfSBzdHIgICAgIHN0cmluZyB0byBpbnRlcnBvbGF0ZVxuICogQHBhcmFtICB7Kn0gY29udGV4dCAgICAgIGNvbnRleHQgdG8gdXNlIGZvciBpbnRlcnBvbGF0aW9uXG4gKiBAcmV0dXJuIHtzdHJpbmd9fSAgICAgICAgaW50ZXJwb2xhdGVkIHN0cmluZ1xuICovXG5mdW5jdGlvbiBpbnRlcnBvbGF0ZSggc3RyLCBjb250ZXh0ICkge1xuICB2YXIgbmV3U3RyID0gc3RyO1xuICBpZiAoIHR5cGVvZiBjb250ZXh0ID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgIHJldHVybiBuZXdTdHI7XG4gIH1cbiAgc3RyLm1hdGNoKCAvXFx7KFteXFx9XSspXFx9L2cgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIG1hdGNoICkge1xuICAgIHZhciBwcm9wID0gbWF0Y2guc3Vic3RyKCAxLCBtYXRjaC5sZW5ndGggLSAyICkudHJpbSgpO1xuICAgIG5ld1N0ciA9IG5ld1N0ci5yZXBsYWNlKCBtYXRjaCwgdmFsdWVGb3JLZXlQYXRoKCBjb250ZXh0LCBwcm9wICkgKTtcbiAgfSApO1xuICByZXR1cm4gbmV3U3RyO1xufVxuLyoqXG4gKiBNZXJnZXMgdGhlIHN1cHBsaWVkIG9iamVjdHMgdG9nZXRoZXIgYW5kIHJldHVybnMgYSBjb3B5IGNvbnRhaW5pbiB0aGUgbWVyZ2VkIG9iamVjdHMuIFRoZSBvcmlnaW5hbFxuICogb2JqZWN0cyBhcmUgdW50b3VjaGVkLCBhbmQgYSBuZXcgb2JqZWN0IGlzIHJldHVybmVkIGNvbnRhaW5pbmcgYSByZWxhdGl2ZWx5IGRlZXAgY29weSBvZiBlYWNoIG9iamVjdC5cbiAqXG4gKiBJbXBvcnRhbnQgTm90ZXM6XG4gKiAgIC0gSXRlbXMgdGhhdCBleGlzdCBpbiBhbnkgb2JqZWN0IGJ1dCBub3QgaW4gYW55IG90aGVyIHdpbGwgYmUgYWRkZWQgdG8gdGhlIHRhcmdldFxuICogICAtIFNob3VsZCBtb3JlIHRoYW4gb25lIGl0ZW0gZXhpc3QgaW4gdGhlIHNldCBvZiBvYmplY3RzIHdpdGggdGhlIHNhbWUga2V5LCB0aGUgZm9sbG93aW5nIHJ1bGVzIG9jY3VyOlxuICogICAgIC0gSWYgYm90aCB0eXBlcyBhcmUgYXJyYXlzLCB0aGUgcmVzdWx0IGlzIGEuY29uY2F0KGIpXG4gKiAgICAgLSBJZiBib3RoIHR5cGVzIGFyZSBvYmplY3RzLCB0aGUgcmVzdWx0IGlzIG1lcmdlKGEsYilcbiAqICAgICAtIE90aGVyd2lzZSB0aGUgcmVzdWx0IGlzIGIgKGIgb3ZlcndyaXRlcyBhKVxuICogICAtIFNob3VsZCBtb3JlIHRoYW4gb25lIGl0ZW0gZXhpc3QgaW4gdGhlIHNldCBvZiBvYmplY3RzIHdpdGggdGhlIHNhbWUga2V5LCBidXQgZGlmZmVyIGluIHR5cGUsIHRoZVxuICogICAgIHNlY29uZCB2YWx1ZSBvdmVyd3JpdGVzIHRoZSBmaXJzdC5cbiAqICAgLSBUaGlzIGlzIG5vdCBhIHRydWUgZGVlcCBjb3B5ISBTaG91bGQgYW55IHByb3BlcnR5IGJlIGEgcmVmZXJlbmNlIHRvIGFub3RoZXIgb2JqZWN0IG9yIGFycmF5LCB0aGVcbiAqICAgICBjb3BpZWQgcmVzdWx0IG1heSBhbHNvIGJlIGEgcmVmZXJlbmNlICh1bmxlc3MgYm90aCB0aGUgdGFyZ2V0IGFuZCB0aGUgc291cmNlIHNoYXJlIHRoZSBzYW1lIGl0ZW1cbiAqICAgICB3aXRoIHRoZSBzYW1lIHR5cGUpLiBJbiBvdGhlciB3b3JkczogRE9OJ1QgVVNFIFRISVMgQVMgQSBERUVQIENPUFkgTUVUSE9EXG4gKlxuICogSXQncyByZWFsbHkgbWVhbnQgdG8gbWFrZSB0aGlzIGtpbmQgb2Ygd29yayBlYXN5OlxuICpcbiAqIHZhciB4ID0geyBhOiAxLCBiOiBcImhpXCIsIGM6IFsxLDJdIH0sXG4gKiAgICAgeSA9IHsgYTogMywgYzogWzMsIDRdLCBkOiAwIH0sXG4gKiAgICAgeiA9IG1lcmdlICh4LHkpO1xuICpcbiAqIHogaXMgbm93IHsgYTogMywgYjogXCJoaVwiLCBjOiBbMSwyLDMsNF0sIGQ6MCB9LlxuICpcbiAqIExpY2Vuc2UgTUlULiBDb3B5cmlnaHQgS2VycmkgU2hvdHRzIDIwMTRcbiAqL1xuZnVuY3Rpb24gbWVyZ2UoKSB7XG4gIHZhciB0ID0ge30sXG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDAgKTtcbiAgYXJncy5mb3JFYWNoKCBmdW5jdGlvbiAoIHMgKSB7XG4gICAgaWYgKHMgPT09IHVuZGVmaW5lZCB8fCBzID09PSBudWxsKSB7XG4gICAgICByZXR1cm47IC8vIG5vIGtleXMsIHdoeSBib3RoZXIhXG4gICAgfVxuICAgIE9iamVjdC5rZXlzKCBzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBwcm9wICkge1xuICAgICAgdmFyIGUgPSBzW3Byb3BdO1xuICAgICAgaWYgKCBlIGluc3RhbmNlb2YgQXJyYXkgKSB7XG4gICAgICAgIGlmICggdFtwcm9wXSBpbnN0YW5jZW9mIEFycmF5ICkge1xuICAgICAgICAgIHRbcHJvcF0gPSB0W3Byb3BdLmNvbmNhdCggZSApO1xuICAgICAgICB9IGVsc2UgaWYgKCAhKCB0W3Byb3BdIGluc3RhbmNlb2YgT2JqZWN0ICkgfHwgISggdFtwcm9wXSBpbnN0YW5jZW9mIEFycmF5ICkgKSB7XG4gICAgICAgICAgdFtwcm9wXSA9IGU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIGUgaW5zdGFuY2VvZiBPYmplY3QgJiYgdFtwcm9wXSBpbnN0YW5jZW9mIE9iamVjdCApIHtcbiAgICAgICAgdFtwcm9wXSA9IG1lcmdlKCB0W3Byb3BdLCBlICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0W3Byb3BdID0gZTtcbiAgICAgIH1cbiAgICB9ICk7XG4gIH0gKTtcbiAgcmV0dXJuIHQ7XG59XG4vKipcbiAqIFZhbGlkYXRlcyBhIHNvdXJjZSBhZ2FpbnN0IHRoZSBzcGVjaWZpZWQgcnVsZXMuIGBzb3VyY2VgIGNhbiBsb29rIGxpa2UgdGhpczpcbiAqXG4gKiAgICAgeyBhU3RyaW5nOiBcImhpXCIsIGFOdW1iZXI6IHsgaGk6IDI5NC4xMiB9LCBhbkludGVnZXI6IDE5NDQuMzIgfVxuICpcbiAqIGBydWxlc2AgY2FuIGxvb2sgbGlrZSB0aGlzOlxuICpcbiAqICAgICB7XG4gICAgICogICAgICAgXCJhLXN0cmluZ1wiOiB7XG4gICAgICogICAgICAgICB0aXRsZTogXCJBIFN0cmluZ1wiLCAgICAgLS0gb3B0aW9uYWw7IGlmIG5vdCBzdXBwbGllZCwga2V5IGlzIHVzZWRcbiAgICAgKiAgICAgICAgIGtleTogXCJhU3RyaW5nXCIsICAgICAgICAtLSBvcHRpb25hbDogaWYgbm90IHN1cHBsaWVkIHRoZSBuYW1lIG9mIHRoaXMgcnVsZSBpcyB1c2VkIGFzIHRoZSBrZXlcbiAgICAgKiAgICAgICAgIHJlcXVpcmVkOiB0cnVlLCAgICAgICAgLS0gb3B0aW9uYWw6IGlmIG5vdCBzdXBwbGllZCwgdmFsdWUgaXMgbm90IHJlcXVpcmVkXG4gICAgICogICAgICAgICB0eXBlOiBcInN0cmluZ1wiLCAgICAgICAgLS0gc3RyaW5nLCBudW1iZXIsIGludGVnZXIsIGFycmF5LCBkYXRlLCBib29sZWFuLCBvYmplY3QsICooYW55KVxuICAgICAqICAgICAgICAgbWluTGVuZ3RoOiAxLCAgICAgICAgICAtLSBvcHRpb25hbDogbWluaW11bSBsZW5ndGggKHN0cmluZywgYXJyYXkpXG4gICAgICogICAgICAgICBtYXhMZW5ndGg6IDI1NSAgICAgICAgIC0tIG9wdGlvbmFsOiBtYXhpbXVtIGxlbmd0aCAoc3RyaW5nLCBhcnJheSlcbiAgICAgKiAgICAgICB9LFxuICAgICAqICAgICAgIFwiYS1udW1iZXJcIjoge1xuICAgICAqICAgICAgICAgdGl0bGU6IFwiQSBOdW1iZXJcIixcbiAgICAgKiAgICAgICAgIGtleTogXCJhTnVtYmVyLmhpXCIsICAgICAtLSBrZXlzIGNhbiBoYXZlIC4gYW5kIFtdIHRvIHJlZmVyZW5jZSBwcm9wZXJ0aWVzIHdpdGhpbiBvYmplY3RzXG4gICAgICogICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICogICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAqICAgICAgICAgbWluOiAwLCAgICAgICAgICAgICAgICAtLSBpZiBzcGVjaWZpZWQsIG51bWJlci9pbnRlZ2VyIGNhbid0IGJlIHNtYWxsZXIgdGhhbiB0aGlzIG51bWJlclxuICAgICAqICAgICAgICAgbWF4OiAxMDAgICAgICAgICAgICAgICAtLSBpZiBzcGVjaWZpZWQsIG51bWJlci9pbnRlZ2VyIGNhbid0IGJlIGxhcmdlciB0aGFuIHRoaXMgbnVtYmVyXG4gICAgICogICAgICAgfSxcbiAgICAgKiAgICAgICBcImFuLWludGVnZXJcIjoge1xuICAgICAqICAgICAgICAgdGl0bGU6IFwiQW4gSW50ZWdlclwiLFxuICAgICAqICAgICAgICAga2V5OiBcImFuSW50ZWdlclwiLFxuICAgICAqICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICogICAgICAgICB0eXBlOiBcImludGVnZXJcIixcbiAgICAgKiAgICAgICAgIGVudW06IFsxLCAyLCA0LCA4XSAgICAgLS0gaWYgc3BlY2lmaWVkLCB0aGUgdmFsdWUgbXVzdCBiZSBhIHBhcnQgb2YgdGhlIGFycmF5XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIG1heSBhbHNvIGJlIHNwZWNpZmllZCBhcyBhbiBhcnJheSBvZiBvYmplY3RzIHdpdGggdGl0bGUvdmFsdWUgcHJvcGVydGllc1xuICAgICAqICAgICAgIH1cbiAgICAgKiAgICAgfVxuICpcbiAqIEBwYXJhbSB7Kn0gc291cmNlICAgICAgIHNvdXJjZSB0byB2YWxpZGF0ZVxuICogQHBhcmFtIHsqfSBydWxlcyAgICAgICAgdmFsaWRhdGlvbiBydWxlc1xuICogQHJldHVybnMgeyp9ICAgICAgICAgICAgYW4gb2JqZWN0IHdpdGggdHdvIGZpZWxkczogYHZhbGlkYXRlczogdHJ1ZXxmYWxzZWAgYW5kIGBtZXNzYWdlOiB2YWxpZGF0aW9uIG1lc3NhZ2VgXG4gKlxuICogTElDRU5TRTogTUlUXG4gKiBDb3B5cmlnaHQgS2VycmkgU2hvdHRzLCAyMDE0XG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlKCBzb3VyY2UsIHJ1bGVzICkge1xuICB2YXIgciA9IHtcbiAgICB2YWxpZGF0ZXM6IHRydWUsXG4gICAgbWVzc2FnZTogICBcIlwiXG4gIH07XG4gIGlmICggISggcnVsZXMgaW5zdGFuY2VvZiBPYmplY3QgKSApIHtcbiAgICByZXR1cm4gcjtcbiAgfVxuICAvLyBnbyBvdmVyIGVhY2ggcnVsZSBpbiBgcnVsZXNgXG4gIE9iamVjdC5rZXlzKCBydWxlcyApLmZvckVhY2goIGZ1bmN0aW9uICggcHJvcCApIHtcbiAgICBpZiAoIHIudmFsaWRhdGVzICkge1xuICAgICAgLy8gZ2V0IHRoZSBydWxlXG4gICAgICB2YXIgcnVsZSA9IHJ1bGVzW3Byb3BdLFxuICAgICAgICB2ID0gc291cmNlLFxuICAgICAgLy8gYW5kIGdldCB0aGUgdmFsdWUgaW4gc291cmNlXG4gICAgICAgIGsgPSAoIHJ1bGUua2V5ICE9PSB1bmRlZmluZWQgKSA/IHJ1bGUua2V5IDogcHJvcCxcbiAgICAgICAgdGl0bGUgPSAoIHJ1bGUudGl0bGUgIT09IHVuZGVmaW5lZCApID8gcnVsZS50aXRsZSA6IHByb3A7XG4gICAgICBrID0gay5yZXBsYWNlKCBcIltcIiwgXCIuXCIgKS5yZXBsYWNlKCBcIl1cIiwgXCJcIiApLnJlcGxhY2UoIFwiXFxcIlwiLCBcIlwiICk7XG4gICAgICBrLnNwbGl0KCBcIi5cIiApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5UGFydCApIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2ID0gdltrZXlQYXJ0XTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoIGVyciApIHtcbiAgICAgICAgICB2ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9ICk7XG4gICAgICAvLyBpcyBpdCByZXF1aXJlZD9cbiAgICAgIGlmICggKCAoIHJ1bGUucmVxdWlyZWQgIT09IHVuZGVmaW5lZCApID8gcnVsZS5yZXF1aXJlZCA6IGZhbHNlICkgJiYgdiA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICByLnZhbGlkYXRlcyA9IGZhbHNlO1xuICAgICAgICByLm1lc3NhZ2UgPSBcIk1pc3NpbmcgcmVxdWlyZWQgdmFsdWUgXCIgKyB0aXRsZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gY2FuIGl0IGJlIG51bGw/XG4gICAgICBpZiAoICEoICggcnVsZS5udWxsYWJsZSAhPT0gdW5kZWZpbmVkICkgPyBydWxlLm51bGxhYmxlIDogZmFsc2UgKSAmJiB2ID09PSBudWxsICkge1xuICAgICAgICByLnZhbGlkYXRlcyA9IGZhbHNlO1xuICAgICAgICByLm1lc3NhZ2UgPSBcIlVuZXhwZWN0ZWQgbnVsbCBpbiBcIiArIHRpdGxlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBpcyBpdCBvZiB0aGUgcmlnaHQgdHlwZT9cbiAgICAgIGlmICggdiAhPT0gbnVsbCAmJiB2ICE9PSB1bmRlZmluZWQgJiYgdiAhPSBcIlwiICkge1xuICAgICAgICByLm1lc3NhZ2UgPSBcIlR5cGUgTWlzbWF0Y2g7IGV4cGVjdGVkIFwiICsgcnVsZS50eXBlICsgXCIgbm90IFwiICsgKCB0eXBlb2YgdiApICsgXCIgaW4gXCIgKyB0aXRsZTtcbiAgICAgICAgc3dpdGNoICggcnVsZS50eXBlICkge1xuICAgICAgICAgIGNhc2UgXCJmbG9hdFwiOlxuICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgICAgIGlmICggdiAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICBpZiAoIGlzTmFOKCBwYXJzZUZsb2F0KCB2ICkgKSApIHtcbiAgICAgICAgICAgICAgICByLnZhbGlkYXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoIHYgIT0gcGFyc2VGbG9hdCggdiApICkge1xuICAgICAgICAgICAgICAgIHIudmFsaWRhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiaW50ZWdlclwiOlxuICAgICAgICAgICAgaWYgKCB2ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgIGlmICggaXNOYU4oIHBhcnNlSW50KCB2LCAxMCApICkgKSB7XG4gICAgICAgICAgICAgICAgci52YWxpZGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKCB2ICE9IHBhcnNlSW50KCB2LCAxMCApICkge1xuICAgICAgICAgICAgICAgIHIudmFsaWRhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiYXJyYXlcIjpcbiAgICAgICAgICAgIGlmICggdiAhPT0gdW5kZWZpbmVkICYmICEoIHYgaW5zdGFuY2VvZiBBcnJheSApICkge1xuICAgICAgICAgICAgICByLnZhbGlkYXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiZGF0ZVwiOlxuICAgICAgICAgICAgaWYgKCB2IGluc3RhbmNlb2YgT2JqZWN0ICkge1xuICAgICAgICAgICAgICBpZiAoICEoIHYgaW5zdGFuY2VvZiBEYXRlICkgKSB7XG4gICAgICAgICAgICAgICAgci52YWxpZGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHYgaW5zdGFuY2VvZiBEYXRlICYmIGlzTmFOKCB2LmdldFRpbWUoKSApICkge1xuICAgICAgICAgICAgICAgIHIudmFsaWRhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgci5tZXNzYWdlID0gXCJJbnZhbGlkIGRhdGUgaW4gXCIgKyB0aXRsZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGVvZiB2ID09PSBcInN0cmluZ1wiICkge1xuICAgICAgICAgICAgICBpZiAoIGlzTmFOKCAoIG5ldyBEYXRlKCB2ICkgKS5nZXRUaW1lKCkgKSApIHtcbiAgICAgICAgICAgICAgICByLnZhbGlkYXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHIubWVzc2FnZSA9IFwiSW52YWxpZCBkYXRlIGluIFwiICsgdGl0bGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhKCB2IGluc3RhbmNlb2YgXCJvYmplY3RcIiApICYmIHYgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgci52YWxpZGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgICAgICAgaWYgKCAhKCB2IGluc3RhbmNlb2YgT2JqZWN0ICkgJiYgdiAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICByLnZhbGlkYXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiKlwiOlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlmICggISggdHlwZW9mIHYgPT09IHJ1bGUudHlwZSB8fCB2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gbnVsbCApICkge1xuICAgICAgICAgICAgICByLnZhbGlkYXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgci5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgLy8gaWYgd2UncmUgc3RpbGwgaGVyZSwgdHlwZXMgYXJlIGdvb2QuIE5vdyBjaGVjayBsZW5ndGgsIHJhbmdlLCBhbmQgZW51bVxuICAgICAgICAvLyBjaGVjayByYW5nZVxuICAgICAgICByLm1lc3NhZ2UgPSBcIlZhbHVlIG91dCBvZiByYW5nZSBcIiArIHYgKyBcIiBpbiBcIiArIHRpdGxlO1xuICAgICAgICBpZiAoIHR5cGVvZiBydWxlLm1pbiA9PT0gXCJudW1iZXJcIiAmJiB2IDwgcnVsZS5taW4gKSB7XG4gICAgICAgICAgci52YWxpZGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2YgcnVsZS5tYXggPT09IFwibnVtYmVyXCIgJiYgdiA+IHJ1bGUubWF4ICkge1xuICAgICAgICAgIHIudmFsaWRhdGVzID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHIubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgIC8vIGNoZWNrIGxlbmd0aFxuICAgICAgICBpZiAoICggdHlwZW9mIHJ1bGUubWluTGVuZ3RoID09PSBcIm51bWJlclwiICYmIHYgIT09IHVuZGVmaW5lZCAmJiB2Lmxlbmd0aCAhPT0gdW5kZWZpbmVkICYmIHYubGVuZ3RoIDwgcnVsZS5taW5MZW5ndGggKSB8fFxuICAgICAgICAgICAgICggdHlwZW9mIHJ1bGUubWF4TGVuZ3RoID09PSBcIm51bWJlclwiICYmIHYgIT09IHVuZGVmaW5lZCAmJiB2Lmxlbmd0aCAhPT0gdW5kZWZpbmVkICYmIHYubGVuZ3RoID4gcnVsZS5tYXhMZW5ndGggKVxuICAgICAgICApIHtcbiAgICAgICAgICByLm1lc3NhZ2UgPSBcIlwiICsgdGl0bGUgKyBcIiBvdXQgb2YgbGVuZ3RoIHJhbmdlXCI7XG4gICAgICAgICAgci52YWxpZGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgZW51bVxuICAgICAgICBpZiAoIHJ1bGUuZW51bSBpbnN0YW5jZW9mIE9iamVjdCAmJiB2ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgaWYgKCBydWxlLmVudW0uZmlsdGVyKCBmdW5jdGlvbiAoIGUgKSB7XG4gICAgICAgICAgICAgIGlmICggZS52YWx1ZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLnZhbHVlID09IHY7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUgPT0gdjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHIubWVzc2FnZSA9IFwiXCIgKyB0aXRsZSArIFwiIGNvbnRhaW5zIHVuZXhwZWN0ZWQgdmFsdWUgXCIgKyB2ICsgXCIgaW4gXCIgKyB0aXRsZTtcbiAgICAgICAgICAgIHIudmFsaWRhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNoZWNrIHBhdHRlcm5cbiAgICAgICAgaWYgKCBydWxlLnBhdHRlcm4gaW5zdGFuY2VvZiBPYmplY3QgJiYgdiAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgIGlmICggdi5tYXRjaCggcnVsZS5wYXR0ZXJuICkgPT09IG51bGwgKSB7XG4gICAgICAgICAgICByLm1lc3NhZ2UgPSBcIlwiICsgdGl0bGUgKyBcIiBkb2Vzbid0IG1hdGNoIHBhdHRlcm4gaW4gXCIgKyB0aXRsZTtcbiAgICAgICAgICAgIHIudmFsaWRhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9ICk7XG4gIHJldHVybiByO1xufVxudmFyIF95ID0ge1xuICBWRVJTSU9OOiAgICAgICAgICAgICAgICBcIjAuNS4xNDJcIixcbiAgdmFsdWVGb3JLZXlQYXRoOiAgICAgICAgdmFsdWVGb3JLZXlQYXRoLFxuICBpbnRlcnBvbGF0ZTogICAgICAgICAgICBpbnRlcnBvbGF0ZSxcbiAgbWVyZ2U6ICAgICAgICAgICAgICAgICAgbWVyZ2UsXG4gIHZhbGlkYXRlOiAgICAgICAgICAgICAgIHZhbGlkYXRlLFxuICAvKipcbiAgICogUmV0dXJucyBhbiBlbGVtZW50IGZyb20gdGhlIERPTSB3aXRoIHRoZSBzcGVjaWZpZWRcbiAgICogSUQuIFNpbWlsYXIgdG8gKGJ1dCBub3QgbGlrZSkgalF1ZXJ5J3MgJCgpLCBleGNlcHRcbiAgICogdGhhdCB0aGlzIGlzIGEgcHVyZSBET00gZWxlbWVudC5cbiAgICogQG1ldGhvZCBnZVxuICAgKiBAYWxpYXMgJGlkXG4gICAqIEBwYXJhbSAge1N0cmluZ30gZWxlbWVudElkICAgICBpZCB0byBzZWFyY2ggZm9yLCByZWxhdGl2ZSB0byBkb2N1bWVudFxuICAgKiBAcmV0dXJuIHtOb2RlfSAgICAgICAgICAgICAgICAgbnVsbCBpZiBubyBub2RlIGZvdW5kXG4gICAqL1xuICBnZTogICAgICAgICAgICAgICAgICAgICAkaWQuYmluZCggZG9jdW1lbnQgKSxcbiAgJGlkOiAgICAgICAgICAgICAgICAgICAgJGlkLmJpbmQoIGRvY3VtZW50ICksXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGVsZW1lbnQgZnJvbSB0aGUgRE9NIHVzaW5nIGBxdWVyeVNlbGVjdG9yYC5cbiAgICogQG1ldGhvZCBxc1xuICAgKiBAYWxpYXMgJFxuICAgKiBAYWxpYXMgJDFcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yICAgICAgIENTUyBzZWxlY3RvciB0byBzZWFyY2gsIHJlbGF0aXZlIHRvIGRvY3VtZW50XG4gICAqIEByZXR1cm5zIHtOb2RlfSAgICAgICAgICAgICAgICBudWxsIGlmIG5vIG5vZGUgZm91bmQgdGhhdCBtYXRjaGVzIHNlYXJjaFxuICAgKi9cbiAgJDogICAgICAgICAgICAgICAgICAgICAgJC5iaW5kKCBkb2N1bWVudCApLFxuICAkMTogICAgICAgICAgICAgICAgICAgICAkLmJpbmQoIGRvY3VtZW50ICksXG4gIHFzOiAgICAgICAgICAgICAgICAgICAgICQuYmluZCggZG9jdW1lbnQgKSxcbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIGVsZW1lbnRzIG1hdGNoaW5nIGEgZ2l2ZW5cbiAgICogc2VsZWN0b3IuIFRoZSBhcnJheSBpcyBwcm9jZXNzZWQgdG8gYmUgYSByZWFsIGFycmF5LFxuICAgKiBub3QgYSBub2RlTGlzdC5cbiAgICogQG1ldGhvZCBnYWNcbiAgICogQGFsaWFzICQkXG4gICAqIEBhbGlhcyBxc2FcbiAgICogQHBhcmFtICB7U3RyaW5nfSBzZWxlY3RvciAgICAgIENTUyBzZWxlY3RvciB0byBzZWFyY2gsIHJlbGF0aXZlIHRvIGRvY3VtZW50XG4gICAqIEByZXR1cm4ge0FycmF5fSBvZiBOb2RlcyAgICAgICBBcnJheSBvZiBub2RlczsgW10gaWYgbm9uZSBmb3VuZFxuICAgKi9cbiAgJCQ6ICAgICAgICAgICAgICAgICAgICAgJCQuYmluZCggZG9jdW1lbnQgKSxcbiAgZ2FjOiAgICAgICAgICAgICAgICAgICAgJCQuYmluZCggZG9jdW1lbnQgKSxcbiAgcXNhOiAgICAgICAgICAgICAgICAgICAgJCQuYmluZCggZG9jdW1lbnQgKSxcbiAgLyoqXG4gICAqIFJldHVybnMgYSBDb21wdXRlZCBDU1MgU3R5bGUgcmVhZHkgZm9yIGludGVycm9nYXRpb24gaWZcbiAgICogYHByb3BlcnR5YCBpcyBub3QgZGVmaW5lZCwgb3IgdGhlIGFjdHVhbCBwcm9wZXJ0eSB2YWx1ZVxuICAgKiBpZiBgcHJvcGVydHlgIGlzIGRlZmluZWQuXG4gICAqIEBtZXRob2QgZ2NzXG4gICAqIEBhbGlhcyBnc2NcbiAgICogQGFsaWFzIGdldENvbXB1dGVkU3R5bGVcbiAgICogQHBhcmFtIHtOb2RlfSBlbGVtZW50ICBBIHNwZWNpZmljIERPTSBlbGVtZW50XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbcHJvcGVydHldICBBIENTUyBwcm9wZXJ0eSB0byBxdWVyeVxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGdldENvbXB1dGVkU3R5bGU6ICAgICAgIGdldENvbXB1dGVkU3R5bGUsXG4gIGdjczogICAgICAgICAgICAgICAgICAgIGdldENvbXB1dGVkU3R5bGUsXG4gIGdzYzogICAgICAgICAgICAgICAgICAgIGdldENvbXB1dGVkU3R5bGUsXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcGFyc2VkIHRlbXBsYXRlLiBUaGUgdGVtcGxhdGUgY2FuIGJlIGEgc2ltcGxlXG4gICAqIHN0cmluZywgaW4gd2hpY2ggY2FzZSB0aGUgcmVwbGFjZW1lbnQgdmFyaWFibGUgYXJlIHJlcGxhY2VkXG4gICAqIGFuZCByZXR1cm5lZCBzaW1wbHksIG9yIHRoZSB0ZW1wbGF0ZSBjYW4gYmUgYSBET00gZWxlbWVudCxcbiAgICogaW4gd2hpY2ggY2FzZSB0aGUgdGVtcGxhdGUgaXMgYXNzdW1lZCB0byBiZSB0aGUgRE9NIEVsZW1lbnQnc1xuICAgKiBgaW5uZXJIVE1MYCwgYW5kIHRoZW4gdGhlIHJlcGxhY2VtZW50IHZhcmlhYmxlcyBhcmUgcGFyc2VkLlxuICAgKlxuICAgKiBSZXBsYWNlbWVudCB2YXJpYWJsZXMgYXJlIG9mIHRoZSBmb3JtIGAlVkFSSUFCTEUlYCwgYW5kXG4gICAqIGNhbiBvY2N1ciBhbnl3aGVyZSwgbm90IGp1c3Qgd2l0aGluIHN0cmluZ3MgaW4gSFRNTC5cbiAgICpcbiAgICogVGhlIHJlcGxhY2VtZW50cyBhcnJheSBpcyBvZiB0aGUgZm9ybVxuICAgKiBgYGBcbiAgICogICAgIHsgXCJWQVJJQUJMRVwiOiByZXBsYWNlbWVudCwgXCJWQVJJQUJMRTJcIjogcmVwbGFjZW1lbnQsIC4uLiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBJZiBgYWRkdGxPcHRpb25zYCBpcyBzcGVjaWZpZWQsIGl0IG1heSBvdmVycmlkZSB0aGUgZGVmYXVsdFxuICAgKiBvcHRpb25zIHdoZXJlIGAlYCBpcyB1c2VkIGFzIGEgc3Vic3RpdHV0aW9uIG1hcmtlciBhbmQgYHRvVXBwZXJDYXNlYFxuICAgKiBpcyB1c2VkIGFzIGEgdHJhbnNmb3JtLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogYGBgXG4gICAqIHRlbXBsYXRlICggXCJIZWxsbywge3tuYW1lfX1cIiwge1wibmFtZVwiOiBcIk1hcnlcIn0sXG4gICAqICAgICAgICAgICAgeyBicmFja2V0czogWyBcInt7XCIsIFwifX1cIiBdLFxuICAgICAqICAgICAgICAgICAgICB0cmFuc2Zvcm06IFwidG9Mb3dlckNhc2VcIiB9ICk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBAbWV0aG9kIHRlbXBsYXRlXG4gICAqIEBwYXJhbSAge05vZGV8U3RyaW5nfSB0ZW1wbGF0ZUVsZW1lbnRcbiAgICogQHBhcmFtICB7T2JqZWN0fSByZXBsYWNlbWVudHNcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgdGVtcGxhdGU6ICAgICAgICAgICAgICAgZnVuY3Rpb24gKCB0ZW1wbGF0ZUVsZW1lbnQsIHJlcGxhY2VtZW50cywgYWRkdGxPcHRpb25zICkge1xuICAgIHZhciBicmFja2V0cyA9IFtcIiVcIiwgXCIlXCJdLFxuICAgICAgdHJhbnNmb3JtID0gXCJ0b1VwcGVyQ2FzZVwiLFxuICAgICAgdGVtcGxhdGVIVE1MLCB0aGVWYXIsIHRoaXNWYXI7XG4gICAgaWYgKCB0eXBlb2YgYWRkdGxPcHRpb25zICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgaWYgKCB0eXBlb2YgYWRkdGxPcHRpb25zLmJyYWNrZXRzICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBicmFja2V0cyA9IGFkZHRsT3B0aW9ucy5icmFja2V0cztcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIGFkZHRsT3B0aW9ucy50cmFuc2Zvcm0gPT09IFwic3RyaW5nXCIgKSB7XG4gICAgICAgIHRyYW5zZm9ybSA9IGFkZHRsT3B0aW9ucy50cmFuc2Zvcm07XG4gICAgICB9XG4gICAgfVxuICAgIGlmICggdGVtcGxhdGVFbGVtZW50IGluc3RhbmNlb2YgTm9kZSApIHtcbiAgICAgIHRlbXBsYXRlSFRNTCA9IHRlbXBsYXRlRWxlbWVudC5pbm5lckhUTUw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlbXBsYXRlSFRNTCA9IHRlbXBsYXRlRWxlbWVudDtcbiAgICB9XG4gICAgZm9yICggdGhlVmFyIGluIHJlcGxhY2VtZW50cyApIHtcbiAgICAgIGlmICggcmVwbGFjZW1lbnRzLmhhc093blByb3BlcnR5KCB0aGVWYXIgKSApIHtcbiAgICAgICAgdGhpc1ZhciA9IGJyYWNrZXRzWzBdO1xuICAgICAgICBpZiAoIHRyYW5zZm9ybSAhPT0gXCJcIiApIHtcbiAgICAgICAgICB0aGlzVmFyICs9IHRoZVZhclt0cmFuc2Zvcm1dKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpc1ZhciArPSB0aGVWYXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpc1ZhciArPSBicmFja2V0c1sxXTtcbiAgICAgICAgd2hpbGUgKCB0ZW1wbGF0ZUhUTUwuaW5kZXhPZiggdGhpc1ZhciApID4gLTEgKSB7XG4gICAgICAgICAgdGVtcGxhdGVIVE1MID0gdGVtcGxhdGVIVE1MLnJlcGxhY2UoIHRoaXNWYXIsIHJlcGxhY2VtZW50c1t0aGVWYXJdICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRlbXBsYXRlSFRNTDtcbiAgfSxcbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiB0aGUgYXBwIGlzIHJ1bm5pbmcgaW4gYSBDb3Jkb3ZhIGNvbnRhaW5lci5cbiAgICogT25seSB2YWxpZCBpZiBgZXhlY3V0ZVdoZW5SZWFkeWAgaXMgdXNlZCB0byBzdGFydCBhbiBhcHAuXG4gICAqIEBwcm9wZXJ0eSB1bmRlckNvcmRvdmFcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHVuZGVyQ29yZG92YTogICAgICAgICAgIGZhbHNlLFxuICAvKipcbiAgICogSGFuZGxlcyB0aGUgY29udW5kcnVtIG9mIGV4ZWN1dGluZyBhIGJsb2NrIG9mIGNvZGUgd2hlblxuICAgKiB0aGUgbW9iaWxlIGRldmljZSBvciBkZXNrdG9wIGJyb3dzZXIgaXMgcmVhZHkuIElmIHJ1bm5pbmdcbiAgICogdW5kZXIgQ29yZG92YSwgdGhlIGBkZXZpY2VyZWFkeWAgZXZlbnQgd2lsbCBmaXJlLCBhbmRcbiAgICogdGhlIGBjYWxsYmFja2Agd2lsbCBleGVjdXRlLiBPdGhlcndpc2UsIGFmdGVyIDFzLCB0aGVcbiAgICogYGNhbGxiYWNrYCB3aWxsIGV4ZWN1dGUgKmlmIGl0IGhhc24ndCBhbHJlYWR5Ki5cbiAgICpcbiAgICogQG1ldGhvZCBleGVjdXRlV2hlblJlYWR5XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBleGVjdXRlV2hlblJlYWR5OiAgICAgICBmdW5jdGlvbiAoIGNhbGxiYWNrICkge1xuICAgIHZhciBleGVjdXRlZCA9IGZhbHNlO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiZGV2aWNlcmVhZHlcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCAhZXhlY3V0ZWQgKSB7XG4gICAgICAgIGV4ZWN1dGVkID0gdHJ1ZTtcbiAgICAgICAgX3kudW5kZXJDb3Jkb3ZhID0gdHJ1ZTtcbiAgICAgICAgaWYgKCB0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiApIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgZmFsc2UgKTtcbiAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoICFleGVjdXRlZCApIHtcbiAgICAgICAgZXhlY3V0ZWQgPSB0cnVlO1xuICAgICAgICBfeS51bmRlckNvcmRvdmEgPSBmYWxzZTtcbiAgICAgICAgaWYgKCB0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiApIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgMTAwMCApO1xuICB9LFxuICAvKipcbiAgICogPiBUaGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBhcmUgcmVsYXRlZCB0byBnbG9iYWxpemF0aW9uIGFuZCBsb2NhbGl6YXRpb24sIHdoaWNoXG4gICAqID4gYXJlIG5vdyBjb25zaWRlcmVkIHRvIGJlIGNvcmUgZnVuY3Rpb25zIChwcmV2aW91c2x5IGl0IHdhcyBicm9rZW4gb3V0IGluXG4gICAqID4gUEtMT0MpXG4gICAqL1xuICAvKipcbiAgICogQHR5cGVkZWYge1N0cmluZ30gTG9jYWxlXG4gICAqL1xuICAvKipcbiAgICogSW5kaWNhdGVzIHRoZSB1c2VyJ3MgbG9jYWxlLiBJdCdzIG9ubHkgdmFsaWQgYWZ0ZXJcbiAgICogYSBjYWxsIHRvIGBnZXRVc2VyTG9jYWxlYCwgYnV0IGl0IGNhbiBiZSB3cml0dGVuIHRvXG4gICAqIGF0IGFueSB0aW1lIGluIG9yZGVyIHRvIG92ZXJyaWRlIGBnZXRVc2VyTG9jYWxlYCdzXG4gICAqIGNhbGN1bGF0aW9uIG9mIHRoZSB1c2VyJ3MgbG9jYWxlLlxuICAgKlxuICAgKiBAcHJvcGVydHkgY3VycmVudFVzZXJMb2NhbGVcbiAgICogQGRlZmF1bHQgKGVtcHR5IHN0cmluZylcbiAgICogQHR5cGUge0xvY2FsZX1cbiAgICovXG4gIGN1cnJlbnRVc2VyTG9jYWxlOiAgICAgIFwiXCIsXG4gIC8qKlxuICAgKiBBIHRyYW5zbGF0aW9uIG1hdHJpeC4gVXNlZCBieSBgYWRkVHJhbnNsYXRpb24ocylgIGFuZCBgVGAuXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBsb2NhbGl6ZWRUZXh0XG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBsb2NhbGl6ZWRUZXh0OiAgICAgICAgICB7fSxcbiAgLyoqXG4gICAqIEdpdmVuIGEgbG9jYWxlIHN0cmluZywgbm9ybWFsaXplIGl0IHRvIHRoZSBmb3JtIG9mIGBsYS1SRWAgb3IgYGxhYCwgZGVwZW5kaW5nIG9uIHRoZSBsZW5ndGguXG4gICAqIGBgYFxuICAgKiAgICAgXCJlbnVzXCIsIFwiZW5fdXNcIiwgXCJlbl8tLS1fXy0tVVNcIiwgXCJFTi1VU1wiIC0tPiBcImVuLVVTXCJcbiAgICogICAgIFwiZW5cIiwgXCJlbi1cIiwgXCJFTiFcIiAtLT4gXCJlblwiXG4gICAqIGBgYFxuICAgKiBAbWV0aG9kIG5vcm1hbGl6ZUxvY2FsZVxuICAgKiBAcGFyYW0ge0xvY2FsZX0gdGhlTG9jYWxlXG4gICAqL1xuICBub3JtYWxpemVMb2NhbGU6ICAgICAgICBmdW5jdGlvbiAoIHRoZUxvY2FsZSApIHtcbiAgICB2YXIgdGhlTmV3TG9jYWxlID0gdGhlTG9jYWxlO1xuICAgIGlmICggdGhlTmV3TG9jYWxlLmxlbmd0aCA8IDIgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiRmF0YWw6IGludmFsaWQgbG9jYWxlOyBub3Qgb2YgdGhlIGZvcm1hdCBsYS1SRS5cIiApO1xuICAgIH1cbiAgICB2YXIgdGhlTGFuZ3VhZ2UgPSB0aGVOZXdMb2NhbGUuc3Vic3RyKCAwLCAyICkudG9Mb3dlckNhc2UoKSxcbiAgICAgIHRoZVJlZ2lvbiA9IHRoZU5ld0xvY2FsZS5zdWJzdHIoIC0yICkudG9VcHBlckNhc2UoKTtcbiAgICBpZiAoIHRoZU5ld0xvY2FsZS5sZW5ndGggPCA0ICkge1xuICAgICAgdGhlUmVnaW9uID0gXCJcIjsgLy8gdGhlcmUgY2FuJ3QgcG9zc2libHkgYmUgYSB2YWxpZCByZWdpb24gb24gYSAzLWNoYXIgc3RyaW5nXG4gICAgfVxuICAgIGlmICggdGhlUmVnaW9uICE9PSBcIlwiICkge1xuICAgICAgdGhlTmV3TG9jYWxlID0gdGhlTGFuZ3VhZ2UgKyBcIi1cIiArIHRoZVJlZ2lvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhlTmV3TG9jYWxlID0gdGhlTGFuZ3VhZ2U7XG4gICAgfVxuICAgIHJldHVybiB0aGVOZXdMb2NhbGU7XG4gIH0sXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjdXJyZW50IGxvY2FsZSBmb3IgalF1ZXJ5L0dsb2JhbGl6ZVxuICAgKiBAbWV0aG9kIHNldEdsb2JhbGl6YXRpb25Mb2NhbGVcbiAgICogQHBhcmFtIHtMb2NhbGV9IHRoZUxvY2FsZVxuICAgKi9cbiAgc2V0R2xvYmFsaXphdGlvbkxvY2FsZTogZnVuY3Rpb24gKCB0aGVMb2NhbGUgKSB7XG4gICAgdmFyIHRoZU5ld0xvY2FsZSA9IF95Lm5vcm1hbGl6ZUxvY2FsZSggdGhlTG9jYWxlICk7XG4gICAgR2xvYmFsaXplLmN1bHR1cmUoIHRoZU5ld0xvY2FsZSApO1xuICB9LFxuICAvKipcbiAgICogQWRkIGEgdHJhbnNsYXRpb24gdG8gdGhlIGV4aXN0aW5nIHRyYW5zbGF0aW9uIG1hdHJpeFxuICAgKiBAbWV0aG9kIGFkZFRyYW5zbGF0aW9uXG4gICAqIEBwYXJhbSB7TG9jYWxlfSBsb2NhbGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAgICovXG4gIGFkZFRyYW5zbGF0aW9uOiAgICAgICAgIGZ1bmN0aW9uICggbG9jYWxlLCBrZXksIHZhbHVlICkge1xuICAgIHZhciBzZWxmID0gX3ksXG4gICAgLy8gd2UnbGwgc3RvcmUgdHJhbnNsYXRpb25zIHdpdGggdXBwZXItY2FzZSBsb2NhbGVzLCBzbyBjYXNlIG5ldmVyIG1hdHRlcnNcbiAgICAgIHRoZU5ld0xvY2FsZSA9IHNlbGYubm9ybWFsaXplTG9jYWxlKCBsb2NhbGUgKS50b1VwcGVyQ2FzZSgpO1xuICAgIC8vIHN0b3JlIHRoZSB2YWx1ZVxuICAgIGlmICggdHlwZW9mIHNlbGYubG9jYWxpemVkVGV4dFt0aGVOZXdMb2NhbGVdID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgc2VsZi5sb2NhbGl6ZWRUZXh0W3RoZU5ld0xvY2FsZV0gPSB7fTtcbiAgICB9XG4gICAgc2VsZi5sb2NhbGl6ZWRUZXh0W3RoZU5ld0xvY2FsZV1ba2V5LnRvVXBwZXJDYXNlKCldID0gdmFsdWU7XG4gIH0sXG4gIC8qKlxuICAgKiBBZGQgdHJhbnNsYXRpb25zIGluIGJhdGNoLCBhcyBmb2xsb3dzOlxuICAgKiBgYGBcbiAgICogICB7XG4gICAgICogICAgIFwiSEVMTE9cIjpcbiAgICAgKiAgICAge1xuICAgICAqICAgICAgIFwiZW4tVVNcIjogXCJIZWxsb1wiLFxuICAgICAqICAgICAgIFwiZXMtVVNcIjogXCJIb2xhXCJcbiAgICAgKiAgICAgfSxcbiAgICAgKiAgICAgXCJHT09EQllFXCI6XG4gICAgICogICAgIHtcbiAgICAgKiAgICAgICBcImVuLVVTXCI6IFwiQnllXCIsXG4gICAgICogICAgICAgXCJlcy1VU1wiOiBcIkFkaW9zXCJcbiAgICAgKiAgICAgfVxuICAgICAqICAgfVxuICAgKiBgYGBcbiAgICogQG1ldGhvZCBhZGRUcmFuc2xhdGlvbnNcbiAgICogQHBhcmFtIHtPYmplY3R9IG9cbiAgICovXG4gIGFkZFRyYW5zbGF0aW9uczogICAgICAgIGZ1bmN0aW9uICggbyApIHtcbiAgICB2YXIgc2VsZiA9IF95O1xuICAgIGZvciAoIHZhciBrZXkgaW4gbyApIHtcbiAgICAgIGlmICggby5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XG4gICAgICAgIGZvciAoIHZhciBsb2NhbGUgaW4gb1trZXldICkge1xuICAgICAgICAgIGlmICggb1trZXldLmhhc093blByb3BlcnR5KCBsb2NhbGUgKSApIHtcbiAgICAgICAgICAgIHNlbGYuYWRkVHJhbnNsYXRpb24oIGxvY2FsZSwga2V5LCBvW2tleV1bbG9jYWxlXSApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHVzZXIncyBsb2NhbGUgKGUuZy4sIGBlbi1VU2Agb3IgYGZyLUZSYCkuIElmIG9uZVxuICAgKiBjYW4ndCBiZSBmb3VuZCwgYGVuLVVTYCBpcyByZXR1cm5lZC4gSWYgYGN1cnJlbnRVc2VyTG9jYWxlYFxuICAgKiBpcyBhbHJlYWR5IGRlZmluZWQsIGl0IHdvbid0IGF0dGVtcHQgdG8gcmVjYWxjdWxhdGUgaXQuXG4gICAqIEBtZXRob2QgZ2V0VXNlckxvY2FsZVxuICAgKiBAcmV0dXJuIHtMb2NhbGV9XG4gICAqL1xuICBnZXRVc2VyTG9jYWxlOiAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSBfeTtcbiAgICBpZiAoIHNlbGYuY3VycmVudFVzZXJMb2NhbGUgKSB7XG4gICAgICByZXR1cm4gc2VsZi5jdXJyZW50VXNlckxvY2FsZTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRQbGF0Zm9ybSA9IFwidW5rbm93blwiO1xuICAgIGlmICggdHlwZW9mIGRldmljZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIGN1cnJlbnRQbGF0Zm9ybSA9IGRldmljZS5wbGF0Zm9ybTtcbiAgICB9XG4gICAgdmFyIHVzZXJMb2NhbGUgPSBcImVuLVVTXCI7XG4gICAgLy8gYSBzdWl0YWJsZSBkZWZhdWx0XG4gICAgaWYgKCBjdXJyZW50UGxhdGZvcm0gPT09IFwiQW5kcm9pZFwiICkge1xuICAgICAgLy8gcGFyc2UgdGhlIG5hdmlnYXRvci51c2VyQWdlbnRcbiAgICAgIHZhciB1c2VyQWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LFxuICAgICAgLy8gaW5zcGlyZWQgYnkgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzcyODUwNy83NDEwNDNcbiAgICAgICAgdGVtcExvY2FsZSA9IHVzZXJBZ2VudC5tYXRjaCggL0FuZHJvaWQuKihbYS16QS1aXXsyfS1bYS16QS1aXXsyfSkvICk7XG4gICAgICBpZiAoIHRlbXBMb2NhbGUgKSB7XG4gICAgICAgIHVzZXJMb2NhbGUgPSB0ZW1wTG9jYWxlWzFdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyTG9jYWxlID0gbmF2aWdhdG9yLmxhbmd1YWdlIHx8IG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLnN5c3RlbUxhbmd1YWdlIHx8IG5hdmlnYXRvci51c2VyTGFuZ3VhZ2U7XG4gICAgfVxuICAgIHNlbGYuY3VycmVudFVzZXJMb2NhbGUgPSBzZWxmLm5vcm1hbGl6ZUxvY2FsZSggdXNlckxvY2FsZSApO1xuICAgIHJldHVybiBzZWxmLmN1cnJlbnRVc2VyTG9jYWxlO1xuICB9LFxuICAvKipcbiAgICogR2V0cyB0aGUgZGV2aWNlIGxvY2FsZSwgaWYgYXZhaWxhYmxlLiBJdCBkZXBlbmRzIG9uIHRoZVxuICAgKiBHbG9iYWxpemF0aW9uIHBsdWdpbiBwcm92aWRlZCBieSBDb3Jkb3ZhLCBidXQgaWYgdGhlXG4gICAqIHBsdWdpbiBpcyBub3QgYXZhaWxhYmxlLCBpdCBhc3N1bWVzIHRoZSBkZXZpY2UgbG9jYWxlXG4gICAqIGNhbid0IGJlIGRldGVybWluZWQgcmF0aGVyIHRoYW4gdGhyb3cgYW4gZXJyb3IuXG4gICAqXG4gICAqIE9uY2UgdGhlIGxvY2FsZSBpcyBkZXRlcm1pbmVkIG9uZSB3YXkgb3IgdGhlIG90aGVyLCBgY2FsbGJhY2tgXG4gICAqIGlzIGNhbGxlZC5cbiAgICpcbiAgICogQG1ldGhvZCBnZXREZXZpY2VMb2NhbGVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIGdldERldmljZUxvY2FsZTogICAgICAgIGZ1bmN0aW9uICggY2FsbGJhY2sgKSB7XG4gICAgdmFyIHNlbGYgPSBfeTtcbiAgICBpZiAoIHR5cGVvZiBuYXZpZ2F0b3IuZ2xvYmFsaXphdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIGlmICggdHlwZW9mIG5hdmlnYXRvci5nbG9iYWxpemF0aW9uLmdldExvY2FsZU5hbWUgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIG5hdmlnYXRvci5nbG9iYWxpemF0aW9uLmdldExvY2FsZU5hbWUoIGZ1bmN0aW9uICggbG9jYWxlICkge1xuICAgICAgICAgIHNlbGYuY3VycmVudFVzZXJMb2NhbGUgPSBzZWxmLm5vcm1hbGl6ZUxvY2FsZSggbG9jYWxlLnZhbHVlICk7XG4gICAgICAgICAgaWYgKCB0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gZXJyb3I7IGdvIGFoZWFkIGFuZCBjYWxsIHRoZSBjYWxsYmFjaywgYnV0IGRvbid0IHNldCB0aGUgbG9jYWxlXG4gICAgICAgICAgY29uc29sZS5sb2coIFwiV0FSTjogQ291bGRuJ3QgZ2V0IHVzZXIgbG9jYWxlIGZyb20gZGV2aWNlLlwiICk7XG4gICAgICAgICAgaWYgKCB0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9ICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCB0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiApIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogTG9va3MgdXAgYSB0cmFuc2xhdGlvbiBmb3IgYSBnaXZlbiBga2V5YCBhbmQgbG9jYWxlLiBJZlxuICAgKiB0aGUgdHJhbnNsYXRpb24gZG9lcyBub3QgZXhpc3QsIGB1bmRlZmluZWRgIGlzIHJldHVybmVkLlxuICAgKlxuICAgKiBUaGUgYGtleWAgaXMgY29udmVydGVkIHRvIHVwcGVyY2FzZSwgYW5kIHRoZSBsb2NhbGUgaXNcbiAgICogcHJvcGVybHkgbm9ybWFsaXplZCBhbmQgdGhlbiBjb252ZXJ0ZWQgdG8gdXBwZXJjYXNlIGJlZm9yZVxuICAgKiBhbnkgbG9va3VwIGlzIGF0dGVtcHRlZC5cbiAgICpcbiAgICogQG1ldGhvZCBsb29rdXBUcmFuc2xhdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAqIEBwYXJhbSB7TG9jYWxlfSBbdGhlTG9jYWxlXVxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGxvb2t1cFRyYW5zbGF0aW9uOiAgICAgIGZ1bmN0aW9uICgga2V5LCB0aGVMb2NhbGUgKSB7XG4gICAgdmFyIHNlbGYgPSBfeSxcbiAgICAgIHVwcGVyS2V5ID0ga2V5LnRvVXBwZXJDYXNlKCksXG4gICAgICB1c2VyTG9jYWxlID0gdGhlTG9jYWxlIHx8IHNlbGYuZ2V0VXNlckxvY2FsZSgpO1xuICAgIHVzZXJMb2NhbGUgPSBzZWxmLm5vcm1hbGl6ZUxvY2FsZSggdXNlckxvY2FsZSApLnRvVXBwZXJDYXNlKCk7XG4gICAgLy8gbG9vayBpdCB1cCBieSBjaGVja2luZyBpZiB1c2VyTG9jYWxlIGV4aXN0cywgYW5kIHRoZW4gaWYgdGhlIGtleSAodXBwZXJjYXNlZCkgZXhpc3RzXG4gICAgaWYgKCB0eXBlb2Ygc2VsZi5sb2NhbGl6ZWRUZXh0W3VzZXJMb2NhbGVdICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgaWYgKCB0eXBlb2Ygc2VsZi5sb2NhbGl6ZWRUZXh0W3VzZXJMb2NhbGVdW3VwcGVyS2V5XSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgcmV0dXJuIHNlbGYubG9jYWxpemVkVGV4dFt1c2VyTG9jYWxlXVt1cHBlcktleV07XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlmIG5vdCBmb3VuZCwgd2UgZG9uJ3QgcmV0dXJuIGFueXRoaW5nXG4gICAgcmV0dXJuIHZvaWQoIDAgKTtcbiAgfSxcbiAgLyoqXG4gICAqIEBwcm9wZXJ0eSBsb2NhbGVPZkxhc3RSZXNvcnRcbiAgICogQGRlZmF1bHQgXCJlbi1VU1wiXG4gICAqIEB0eXBlIHtMb2NhbGV9XG4gICAqL1xuICBsb2NhbGVPZkxhc3RSZXNvcnQ6ICAgICBcImVuLVVTXCIsXG4gIC8qKlxuICAgKiBAcHJvcGVydHkgbGFuZ3VhZ2VPZkxhc3RSZXNvcnRcbiAgICogQGRlZmF1bHQgXCJlblwiXG4gICAqIEB0eXBlIHtMb2NhbGV9XG4gICAqL1xuICBsYW5ndWFnZU9mTGFzdFJlc29ydDogICBcImVuXCIsXG4gIC8qKlxuICAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgdHJhbnNsYXRpbmcgdGV4dC4gS2V5IGlzIHRoZSBvbmx5XG4gICAqIHJlcXVpcmVkIHZhbHVlIGFuZCBjYXNlIGRvZXNuJ3QgbWF0dGVyIChpdCdzIHVwcGVyY2FzZWQpLiBSZXBsYWNlbWVudFxuICAgKiB2YXJpYWJsZXMgY2FuIGJlIHNwZWNpZmllZCB1c2luZyByZXBsYWNlbWVudCB2YXJpYWJsZXMgb2YgdGhlIGZvcm0gYHsgXCJWQVJcIjpcIlZBTFVFXCIgfWAsXG4gICAqIHVzaW5nIGAlVkFSJWAgaW4gdGhlIGtleS92YWx1ZSByZXR1cm5lZC4gSWYgYGxvY2FsZWAgaXMgc3BlY2lmaWVkLCBpdFxuICAgKiB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgdGhlIHVzZXIncyBjdXJyZW50IGxvY2FsZS5cbiAgICpcbiAgICogQG1ldGhvZCBUXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJtc10gcmVwbGFjZW1lbnQgdmFyaWFibGVzXG4gICAqIEBwYXJhbSB7TG9jYWxlfSBbbG9jYWxlXVxuICAgKi9cbiAgVDogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCBrZXksIHBhcm1zLCBsb2NhbGUgKSB7XG4gICAgdmFyIHNlbGYgPSBfeSxcbiAgICAgIHVzZXJMb2NhbGUgPSBsb2NhbGUgfHwgc2VsZi5nZXRVc2VyTG9jYWxlKCksXG4gICAgICBjdXJyZW50VmFsdWU7XG4gICAgaWYgKCB0eXBlb2YgKCBjdXJyZW50VmFsdWUgPSBzZWxmLmxvb2t1cFRyYW5zbGF0aW9uKCBrZXksIHVzZXJMb2NhbGUgKSApID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgLy8gd2UgaGF2ZW4ndCBmb3VuZCBpdCB1bmRlciB0aGUgZ2l2ZW4gbG9jYWxlIChvZiBmb3JtOiB4eC1YWCksIHRyeSB0aGUgZmFsbGJhY2sgbG9jYWxlICh4eClcbiAgICAgIHVzZXJMb2NhbGUgPSB1c2VyTG9jYWxlLnN1YnN0ciggMCwgMiApO1xuICAgICAgaWYgKCB0eXBlb2YgKCBjdXJyZW50VmFsdWUgPSBzZWxmLmxvb2t1cFRyYW5zbGF0aW9uKCBrZXksIHVzZXJMb2NhbGUgKSApID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAvLyB3ZSBoYXZlbid0IGZvdW5kIGl0IHVuZGVyIGFueSBvZiB0aGUgZ2l2ZW4gbG9jYWxlczsgdHJ5IHRoZSBsYW5ndWFnZSBvZiBsYXN0IHJlc29ydFxuICAgICAgICBpZiAoIHR5cGVvZiAoIGN1cnJlbnRWYWx1ZSA9IHNlbGYubG9va3VwVHJhbnNsYXRpb24oIGtleSwgc2VsZi5sYW5ndWFnZU9mTGFzdFJlc29ydCApICkgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgLy8gd2UgaGF2ZW4ndCBmb3VuZCBpdCB1bmRlciBhbnkgb2YgdGhlIGdpdmVuIGxvY2FsZXM7IHRyeSBsb2NhbGUgb2YgbGFzdCByZXNvcnRcbiAgICAgICAgICBpZiAoIHR5cGVvZiAoIGN1cnJlbnRWYWx1ZSA9IHNlbGYubG9va3VwVHJhbnNsYXRpb24oIGtleSwgc2VsZi5sb2NhbGVPZkxhc3RSZXNvcnQgKSApID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgICAgLy8gd2UgZGlkbid0IGZpbmQgaXQgYXQgYWxsLi4uIHdlJ2xsIHVzZSB0aGUga2V5XG4gICAgICAgICAgICBjdXJyZW50VmFsdWUgPSBrZXk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZWxmLnRlbXBsYXRlKCBjdXJyZW50VmFsdWUsIHBhcm1zICk7XG4gIH0sXG4gIC8qKlxuICAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgbG9jYWxpemluZyBudW1iZXJzIGFjY29yZGluZyB0aGUgZm9ybWF0IChvcHRpb25hbCkgYW5kXG4gICAqIHRoZSBsb2NhbGUgKG9wdGlvbmFsKS4gdGhlRm9ybWF0IGlzIHR5cGljYWxseSB0aGUgbnVtYmVyIG9mIHBsYWNlcyB0byB1c2U7IFwiblwiIGlmXG4gICAqIG5vdCBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBtZXRob2QgTlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGhlTnVtYmVyXG4gICAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gdGhlRm9ybWF0XG4gICAqIEBwYXJhbSB7TG9jYWxlfSBbdGhlTG9jYWxlXVxuICAgKi9cbiAgTjogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCB0aGVOdW1iZXIsIHRoZUZvcm1hdCwgdGhlTG9jYWxlICkge1xuICAgIHZhciBzZWxmID0gX3ksXG4gICAgICBpRm9ybWF0ID0gXCJuXCIgKyAoICggdHlwZW9mIHRoZUZvcm1hdCA9PT0gXCJ1bmRlZmluZWRcIiApID8gXCIwXCIgOiB0aGVGb3JtYXQgKSxcbiAgICAgIGlMb2NhbGUgPSB0aGVMb2NhbGUgfHwgc2VsZi5nZXRVc2VyTG9jYWxlKCk7XG4gICAgc2VsZi5zZXRHbG9iYWxpemF0aW9uTG9jYWxlKCBpTG9jYWxlICk7XG4gICAgcmV0dXJuIEdsb2JhbGl6ZS5mb3JtYXQoIHRoZU51bWJlciwgaUZvcm1hdCApO1xuICB9LFxuICAvKipcbiAgICogQ29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGxvY2FsaXppbmcgY3VycmVuY3kuIHRoZUZvcm1hdCBpcyB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzXG4gICAqIG9yIFwiMlwiIGlmIG5vdCBzcGVjaWZpZWQuIElmIHRoZXJlIGFyZSBtb3JlIHBsYWNlcyB0aGFuIGRpZ2l0cywgcGFkZGluZyBpcyBhZGRlZDsgaWYgdGhlcmVcbiAgICogYXJlIGZld2VyIHBsYWNlcywgcm91bmRpbmcgaXMgcGVyZm9ybWVkLlxuICAgKlxuICAgKiBAbWV0aG9kIENcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRoZU51bWJlclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlRm9ybWF0XG4gICAqIEBwYXJhbSB7TG9jYWxlfSBbdGhlTG9jYWxlXVxuICAgKi9cbiAgQzogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCB0aGVOdW1iZXIsIHRoZUZvcm1hdCwgdGhlTG9jYWxlICkge1xuICAgIHZhciBzZWxmID0gX3ksXG4gICAgICBpRm9ybWF0ID0gXCJjXCIgKyAoICggdHlwZW9mIHRoZUZvcm1hdCA9PT0gXCJ1bmRlZmluZWRcIiApID8gXCIyXCIgOiB0aGVGb3JtYXQgKSxcbiAgICAgIGlMb2NhbGUgPSB0aGVMb2NhbGUgfHwgc2VsZi5nZXRVc2VyTG9jYWxlKCk7XG4gICAgc2VsZi5zZXRHbG9iYWxpemF0aW9uTG9jYWxlKCBpTG9jYWxlICk7XG4gICAgcmV0dXJuIEdsb2JhbGl6ZS5mb3JtYXQoIHRoZU51bWJlciwgaUZvcm1hdCApO1xuICB9LFxuICAvKipcbiAgICogQ29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGxvY2FsaXppbmcgcGVyY2VudGFnZXMuIHRoZUZvcm1hdCBzcGVjaWZpZXMgdGhlIG51bWJlciBvZlxuICAgKiBkZWNpbWFsIHBsYWNlczsgdHdvIGlmIG5vdCBzcGVjaWZpZWQuXG4gICAqIEBtZXRob2QgUENUXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aGVOdW1iZXJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRoZUZvcm1hdFxuICAgKiBAcGFyYW0ge0xvY2FsZX0gW3RoZUxvY2FsZV1cbiAgICovXG4gIFBDVDogICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICggdGhlTnVtYmVyLCB0aGVGb3JtYXQsIHRoZUxvY2FsZSApIHtcbiAgICB2YXIgc2VsZiA9IF95LFxuICAgICAgaUZvcm1hdCA9IFwicFwiICsgKCAoIHR5cGVvZiB0aGVGb3JtYXQgPT09IFwidW5kZWZpbmVkXCIgKSA/IFwiMlwiIDogdGhlRm9ybWF0ICksXG4gICAgICBpTG9jYWxlID0gdGhlTG9jYWxlIHx8IHNlbGYuZ2V0VXNlckxvY2FsZSgpO1xuICAgIHNlbGYuc2V0R2xvYmFsaXphdGlvbkxvY2FsZSggaUxvY2FsZSApO1xuICAgIHJldHVybiBHbG9iYWxpemUuZm9ybWF0KCB0aGVOdW1iZXIsIGlGb3JtYXQgKTtcbiAgfSxcbiAgLyoqXG4gICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBsb2NhbGl6aW5nIGRhdGVzLlxuICAgKlxuICAgKiB0aGVGb3JtYXQgc3BlY2lmaWVzIHRoZSBmb3JtYXQ7IFwiZFwiIGlzIGFzc3VtZWQgaWYgbm90IHByb3ZpZGVkLlxuICAgKlxuICAgKiBAbWV0aG9kIERcbiAgICogQHBhcmFtIHtEYXRlfSB0aGVEYXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0aGVGb3JtYXRcbiAgICogQHBhcmFtIHtMb2NhbGV9IFt0aGVMb2NhbGVdXG4gICAqL1xuICBEOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoIHRoZURhdGUsIHRoZUZvcm1hdCwgdGhlTG9jYWxlICkge1xuICAgIHZhciBzZWxmID0gX3ksXG4gICAgICBpRm9ybWF0ID0gdGhlRm9ybWF0IHx8IFwiZFwiLFxuICAgICAgaUxvY2FsZSA9IHRoZUxvY2FsZSB8fCBzZWxmLmdldFVzZXJMb2NhbGUoKTtcbiAgICBzZWxmLnNldEdsb2JhbGl6YXRpb25Mb2NhbGUoIGlMb2NhbGUgKTtcbiAgICByZXR1cm4gR2xvYmFsaXplLmZvcm1hdCggdGhlRGF0ZSwgaUZvcm1hdCApO1xuICB9LFxuICAvKipcbiAgICogQ29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGpRdWVyeS9HbG9iYWxpemUncyBgZm9ybWF0YCBtZXRob2RcbiAgICogQG1ldGhvZCBmb3JtYXRcbiAgICogQHBhcmFtIHsqfSB0aGVWYWx1ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlRm9ybWF0XG4gICAqIEBwYXJhbSB7TG9jYWxlfSBbdGhlTG9jYWxlXVxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGZvcm1hdDogICAgICAgICAgICAgICAgIGZ1bmN0aW9uICggdGhlVmFsdWUsIHRoZUZvcm1hdCwgdGhlTG9jYWxlICkge1xuICAgIHZhciBzZWxmID0gX3ksXG4gICAgICBpRm9ybWF0ID0gdGhlRm9ybWF0LFxuICAgICAgaUxvY2FsZSA9IHRoZUxvY2FsZSB8fCBzZWxmLmdldFVzZXJMb2NhbGUoKTtcbiAgICBzZWxmLnNldEdsb2JhbGl6YXRpb25Mb2NhbGUoIGlMb2NhbGUgKTtcbiAgICByZXR1cm4gR2xvYmFsaXplLmZvcm1hdCggdGhlVmFsdWUsIGlGb3JtYXQgKTtcbiAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gX3k7XG4iLCIvKipcbiAqXG4gKiBQcm92aWRlcyBkYXRlL3RpbWUgY29udmVuaWVuY2UgbWV0aG9kc1xuICpcbiAqIEBtb2R1bGUgZGF0ZXRpbWUuanNcbiAqIEBhdXRob3IgS2VycmkgU2hvdHRzXG4gKiBAdmVyc2lvbiAwLjRcbiAqXG4gKiBgYGBcbiAqIENvcHlyaWdodCAoYykgMjAxMyBLZXJyaSBTaG90dHMsIHBob3RvS2FuZHkgU3R1ZGlvcyBMTENcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZ1xuICogY29uZGl0aW9uczpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXNcbiAqIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVJcbiAqIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlRcbiAqIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gKiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKiBgYGBcbiAqL1xuLypnbG9iYWwgbW9kdWxlKi9cblwidXNlIHN0cmljdFwiO1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHRpbWUgaW4gdGhlIFVuaXggdGltZSBmb3JtYXRcbiAgICogQG1ldGhvZCBnZXRVbml4VGltZVxuICAgKiBAcmV0dXJuIHtVbml4VGltZX1cbiAgICovXG4gIGdldFVuaXhUaW1lOiAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKCBuZXcgRGF0ZSgpICkuZ2V0VGltZSgpO1xuICB9LFxuICAvKipcbiAgICogIyBQUkVDSVNJT05feCBDb25zdGFudHNcbiAgICogVGhlc2Ugc3BlY2lmeSB0aGUgYW1vdW50IG9mIHByZWNpc2lvbiByZXF1aXJlZCBmb3IgYGdldFBhcnRzRnJvbVNlY29uZHNgLlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgYFBSRUNJU0lPTl9EQVlTYCBpcyBzcGVjaWZpZWQsIHRoZSBudW1iZXIgb2YgcGFydHMgb2J0YWluZWRcbiAgICogY29uc2lzdCBvZiBkYXlzLCBob3VycywgbWludXRlcywgYW5kIHNlY29uZHMuXG4gICAqL1xuICBQUkVDSVNJT05fU0VDT05EUzogICAxLFxuICBQUkVDSVNJT05fTUlOVVRFUzogICAyLFxuICBQUkVDSVNJT05fSE9VUlM6ICAgICAzLFxuICBQUkVDSVNJT05fREFZUzogICAgICA0LFxuICBQUkVDSVNJT05fV0VFS1M6ICAgICA1LFxuICBQUkVDSVNJT05fWUVBUlM6ICAgICA2LFxuICAvKipcbiAgICogQHR5cGVkZWYge3tmcmFjdGlvbnM6IG51bWJlciwgc2Vjb25kczogbnVtYmVyLCBtaW51dGVzOiBudW1iZXIsIGhvdXJzOiBudW1iZXIsIGRheXM6IG51bWJlciwgd2Vla3M6IG51bWJlciwgeWVhcnM6IG51bWJlcn19IFRpbWVQYXJ0c1xuICAgKi9cbiAgLyoqXG4gICAqIFRha2VzIGEgZ2l2ZW4gbnVtYmVyIG9mIHNlY29uZHMgYW5kIHJldHVybnMgYW4gb2JqZWN0IGNvbnNpc3Rpbmcgb2YgdGhlIG51bWJlciBvZiBzZWNvbmRzLCBtaW51dGVzLCBob3VycywgZXRjLlxuICAgKiBUaGUgdmFsdWUgaXMgbGltaXRlZCBieSB0aGUgcHJlY2lzaW9uIHBhcmFtZXRlciAtLSB3aGljaCBtdXN0IGJlIHNwZWNpZmllZC4gV2hpY2ggZXZlciB2YWx1ZSBpcyBzcGVjaWZpZWQgd2lsbFxuICAgKiBiZSB0aGUgbWF4aW11bSBsaW1pdCBmb3IgdGhlIHJvdXRpbmU7IHRoYXQgaXMgYFBSRUNJU0lPTl9EQVlTYCB3aWxsIG5ldmVyIHJldHVybiBhIHJlc3VsdCBmb3Igd2Vla3Mgb3IgeWVhcnMuXG4gICAqIEBtZXRob2QgZ2V0UGFydHNGcm9tU2Vjb25kc1xuICAgKiBAcGFyYW0ge251bWJlcn0gc2Vjb25kc1xuICAgKiBAcGFyYW0ge251bWJlcn0gcHJlY2lzaW9uXG4gICAqIEByZXR1cm5zIHtUaW1lUGFydHN9XG4gICAqL1xuICBnZXRQYXJ0c0Zyb21TZWNvbmRzOiBmdW5jdGlvbiAoIHNlY29uZHMsIHByZWNpc2lvbiApIHtcbiAgICB2YXIgcGFydFZhbHVlcyA9IFswLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgICAgIG1vZFZhbHVlcyA9IFsxLCA2MCwgMzYwMCwgODY0MDAsIDYwNDgwMCwgMzE1NTc2MDBdO1xuICAgIGZvciAoIHZhciBpID0gcHJlY2lzaW9uOyBpID4gMDsgaS0tICkge1xuICAgICAgaWYgKCBpID09PSAxICkge1xuICAgICAgICBwYXJ0VmFsdWVzW2kgLSAxXSA9IHNlY29uZHMgJSBtb2RWYWx1ZXNbaSAtIDFdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFydFZhbHVlc1tpIC0gMV0gPSBNYXRoLmZsb29yKCBzZWNvbmRzICUgbW9kVmFsdWVzW2kgLSAxXSApO1xuICAgICAgfVxuICAgICAgcGFydFZhbHVlc1tpXSA9IE1hdGguZmxvb3IoIHNlY29uZHMgLyBtb2RWYWx1ZXNbaSAtIDFdICk7XG4gICAgICBzZWNvbmRzID0gc2Vjb25kcyAtIHBhcnRWYWx1ZXNbaV0gKiBtb2RWYWx1ZXNbaSAtIDFdO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgZnJhY3Rpb25zOiBwYXJ0VmFsdWVzWzBdLFxuICAgICAgc2Vjb25kczogICBwYXJ0VmFsdWVzWzFdLFxuICAgICAgbWludXRlczogICBwYXJ0VmFsdWVzWzJdLFxuICAgICAgaG91cnM6ICAgICBwYXJ0VmFsdWVzWzNdLFxuICAgICAgZGF5czogICAgICBwYXJ0VmFsdWVzWzRdLFxuICAgICAgd2Vla3M6ICAgICBwYXJ0VmFsdWVzWzVdLFxuICAgICAgeWVhcnM6ICAgICBwYXJ0VmFsdWVzWzZdXG4gICAgfTtcbiAgfVxufTtcbiIsIi8qKlxuICpcbiAqIFByb3ZpZGVzIGJhc2ljIGRldmljZS1oYW5kbGluZyBjb252ZW5pZW5jZSBmdW5jdGlvbnMgZm9yIGRldGVybWluaW5nIGlmIHRoZSBkZXZpY2VcbiAqIGlzIGFuIGlEZXZpY2Ugb3IgYSBEcm9pZCBEZXZpY2UsIGFuZCB3aGF0IHRoZSBvcmllbnRhdGlvbiBpcy5cbiAqXG4gKiBAbW9kdWxlIGRldmljZS5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNVxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKi9cbi8qZ2xvYmFsIG1vZHVsZSwgZGVmaW5lLCBkZXZpY2UsIG5hdmlnYXRvciwgd2luZG93ICovXG5cInVzZSBzdHJpY3RcIjtcbi8qKlxuICpcbiAqIFBLREVWSUNFIHByb3ZpZGVzIHNpbXBsZSBtZXRob2RzIGZvciBnZXR0aW5nIGRldmljZSBpbmZvcm1hdGlvbiwgc3VjaCBhcyBwbGF0Zm9ybSxcbiAqIGZvcm0gZmFjdG9yLCBhbmQgb3JpZW50YXRpb24uXG4gKlxuICogQGNsYXNzIFBLREVWSUNFXG4gKi9cbnZhciBQS0RFVklDRSA9IHtcbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBjbGFzcyB3aXRoIG1ham9yLCBtaW5vciwgYW5kIHJldiBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAcHJvcGVydHkgdmVyc2lvblxuICAgKiBAdHlwZSBPYmplY3RcbiAgICpcbiAgICovXG4gIHZlcnNpb246ICAgICAgICAgICAgXCIwLjUuMTAwXCIsXG4gIC8qKlxuICAgKiBQZXJtaXRzIG92ZXJyaWRpbmcgdGhlIHBsYXRmb3JtIGZvciB0ZXN0aW5nLiBMZWF2ZSBzZXQgdG8gYGZhbHNlYCBmb3JcbiAgICogcHJvZHVjdGlvbiBhcHBsaWNhdGlvbnMuXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBwbGF0Zm9ybU92ZXJyaWRlXG4gICAqIEB0eXBlIGJvb2xlYW5cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHBsYXRmb3JtT3ZlcnJpZGU6ICAgZmFsc2UsXG4gIC8qKlxuICAgKiBQZXJtaXRzIG92ZXJyaWRpbmcgdGhlIGZvcm0gZmFjdG9yLiBVc3VhbGx5IHVzZWQgZm9yIHRlc3RpbmcuXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBmb3JtRmFjdG9yT3ZlcnJpZGVcbiAgICogQHR5cGUgYm9vbGVhblxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgZm9ybUZhY3Rvck92ZXJyaWRlOiBmYWxzZSxcbiAgLyoqXG4gICAqXG4gICAqIFJldHVybnMgdGhlIGRldmljZSBwbGF0Zm9ybSwgbG93ZXJjYXNlZC4gSWYgUEtERVZJQ0UucGxhdGZvcm1PdmVycmlkZSBpc1xuICAgKiBvdGhlciB0aGFuIFwiZmFsc2VcIiwgaXQgaXMgcmV0dXJuZWQgaW5zdGVhZC5cbiAgICpcbiAgICogU2VlIFBob25lR2FwJ3MgZG9jdW1lbnRhdGlvbiBvbiB0aGUgZnVsbCByYW5nZSBvZiBwbGF0Zm9ybXMgdGhhdCBjYW4gYmVcbiAgICogcmV0dXJuZWQ7IHdpdGhvdXQgUEcgYXZhaWxhYmxlLCB0aGUgbWV0aG9kIHdpbGwgYXR0ZW10IHRvIGRldGVybWluZSB0aGVcbiAgICogcGxhdGZvcm0gZnJvbSBgbmF2aWdhdG9yLnBsYXRmb3JtYCBhbmQgdGhlIGB1c2VyQWdlbnRgLCBidXQgb25seSBzdXBwb3J0c1xuICAgKiBpT1MgYW5kIEFuZHJvaWQgaW4gdGhhdCBjYXBhY2l0eS5cbiAgICpcbiAgICogQG1ldGhvZCBwbGF0Zm9ybVxuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHRoZSBkZXZpY2UgcGxhdGZvcm0sIGxvd2VyY2FzZS5cbiAgICovXG4gIHBsYXRmb3JtOiAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgIGlmICggUEtERVZJQ0UucGxhdGZvcm1PdmVycmlkZSApIHtcbiAgICAgIHJldHVybiBQS0RFVklDRS5wbGF0Zm9ybU92ZXJyaWRlLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGlmICggdHlwZW9mIGRldmljZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhZGV2aWNlLnBsYXRmb3JtICkge1xuICAgICAgLy8gZGV0ZWN0IG1vYmlsZSBkZXZpY2VzIGZpcnN0XG4gICAgICBpZiAoIG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gXCJpUGFkXCIgfHwgbmF2aWdhdG9yLnBsYXRmb3JtID09PSBcImlQYWQgU2ltdWxhdG9yXCIgfHwgbmF2aWdhdG9yLnBsYXRmb3JtID09PSBcImlQaG9uZVwiIHx8XG4gICAgICAgICAgIG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gXCJpUGhvbmUgU2ltdWxhdG9yXCIgfHwgbmF2aWdhdG9yLnBsYXRmb3JtID09PSBcImlQb2RcIiApIHtcbiAgICAgICAgcmV0dXJuIFwiaW9zXCI7XG4gICAgICB9XG4gICAgICBpZiAoIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCBcImFuZHJvaWRcIiApID4gLTEgKSB7XG4gICAgICAgIHJldHVybiBcImFuZHJvaWRcIjtcbiAgICAgIH1cbiAgICAgIC8vIG5vIHJlYXNvbiB3aHkgd2UgY2FuJ3QgcmV0dXJuIG90aGVyIGluZm9ybWF0aW9uXG4gICAgICBpZiAoIG5hdmlnYXRvci5wbGF0Zm9ybS5pbmRleE9mKCBcIk1hY1wiICkgPiAtMSApIHtcbiAgICAgICAgcmV0dXJuIFwibWFjXCI7XG4gICAgICB9XG4gICAgICBpZiAoIG5hdmlnYXRvci5wbGF0Zm9ybS5pbmRleE9mKCBcIldpblwiICkgPiAtMSApIHtcbiAgICAgICAgcmV0dXJuIFwid2luZG93c1wiO1xuICAgICAgfVxuICAgICAgaWYgKCBuYXZpZ2F0b3IucGxhdGZvcm0uaW5kZXhPZiggXCJMaW51eFwiICkgPiAtMSApIHtcbiAgICAgICAgcmV0dXJuIFwibGludXhcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBcInVua25vd25cIjtcbiAgICB9XG4gICAgdmFyIHRoZVBsYXRmb3JtID0gZGV2aWNlLnBsYXRmb3JtLnRvTG93ZXJDYXNlKCk7XG4gICAgLy9cbiAgICAvLyB0dXJucyBvdXQgdGhhdCBmb3IgQ29yZG92YSA+IDIuMywgZGVpdmNlcGxhdGZvcm0gbm93IHJldHVybnMgaU9TLCBzbyB0aGVcbiAgICAvLyBmb2xsb3dpbmcgaXMgcmVhbGx5IG5vdCBuZWNlc3Nhcnkgb24gdGhvc2UgdmVyc2lvbnMuIFdlIGxlYXZlIGl0IGhlcmVcbiAgICAvLyBmb3IgdGhvc2UgdXNpbmcgQ29yZG92YSA8PSAyLjIuXG4gICAgaWYgKCB0aGVQbGF0Zm9ybS5pbmRleE9mKCBcImlwYWRcIiApID4gLTEgfHwgdGhlUGxhdGZvcm0uaW5kZXhPZiggXCJpcGhvbmVcIiApID4gLTEgKSB7XG4gICAgICB0aGVQbGF0Zm9ybSA9IFwiaW9zXCI7XG4gICAgfVxuICAgIHJldHVybiB0aGVQbGF0Zm9ybTtcbiAgfSxcbiAgLyoqXG4gICAqXG4gICAqIFJldHVybnMgdGhlIGRldmljZSdzIGZvcm0gZmFjdG9yLiBQb3NzaWJsZSB2YWx1ZXMgYXJlIFwidGFibGV0XCIgYW5kXG4gICAqIFwicGhvbmVcIi4gSWYgUEtERVZJQ0UuZm9ybUZhY3Rvck92ZXJyaWRlIGlzIG5vdCBmYWxzZSwgaXQgaXMgcmV0dXJuZWRcbiAgICogaW5zdGVhZC5cbiAgICpcbiAgICogQG1ldGhvZCBmb3JtRmFjdG9yXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybnMge1N0cmluZ30gYHRhYmxldGAgb3IgYHBob25lYCwgYXMgYXBwcm9wcmlhdGVcbiAgICovXG4gIGZvcm1GYWN0b3I6ICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgIGlmICggUEtERVZJQ0UuZm9ybUZhY3Rvck92ZXJyaWRlICkge1xuICAgICAgcmV0dXJuIFBLREVWSUNFLmZvcm1GYWN0b3JPdmVycmlkZS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICBpZiAoIG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gXCJpUGFkXCIgKSB7XG4gICAgICByZXR1cm4gXCJ0YWJsZXRcIjtcbiAgICB9XG4gICAgaWYgKCAoIG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gXCJpUGhvbmVcIiApIHx8ICggbmF2aWdhdG9yLnBsYXRmb3JtID09PSBcImlQaG9uZSBTaW11bGF0b3JcIiApICkge1xuICAgICAgcmV0dXJuIFwicGhvbmVcIjtcbiAgICB9XG4gICAgdmFyIHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICggdWEuaW5kZXhPZiggXCJhbmRyb2lkXCIgKSA+IC0xICkge1xuICAgICAgLy8gYW5kcm9pZCByZXBvcnRzIGlmIGl0IGlzIGEgcGhvbmUgb3IgdGFibGV0IGJhc2VkIG9uIHVzZXIgYWdlbnRcbiAgICAgIGlmICggdWEuaW5kZXhPZiggXCJtb2JpbGUgc2FmYXJpXCIgKSA+IC0xICkge1xuICAgICAgICByZXR1cm4gXCJwaG9uZVwiO1xuICAgICAgfVxuICAgICAgaWYgKCB1YS5pbmRleE9mKCBcIm1vYmlsZSBzYWZhcmlcIiApIDwgMCAmJiB1YS5pbmRleE9mKCBcInNhZmFyaVwiICkgPiAtMSApIHtcbiAgICAgICAgcmV0dXJuIFwidGFibGV0XCI7XG4gICAgICB9XG4gICAgICBpZiAoICggTWF0aC5tYXgoIHdpbmRvdy5zY3JlZW4ud2lkdGgsIHdpbmRvdy5zY3JlZW4uaGVpZ2h0ICkgLyB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyApID49IDkwMCApIHtcbiAgICAgICAgcmV0dXJuIFwidGFibGV0XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJwaG9uZVwiO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyB0aGUgZm9sbG93aW5nIGlzIGhhY2t5LCBhbmQgbm90IGd1YXJhbnRlZWQgdG8gd29yayBhbGwgdGhlIHRpbWUsXG4gICAgLy8gZXNwZWNpYWxseSBhcyBwaG9uZXMgZ2V0IGJpZ2dlciBzY3JlZW5zIHdpdGggaGlnaGVyIERQSS5cbiAgICBpZiAoICggTWF0aC5tYXgoIHdpbmRvdy5zY3JlZW4ud2lkdGgsIHdpbmRvdy5zY3JlZW4uaGVpZ2h0ICkgKSA+PSA5MDAgKSB7XG4gICAgICByZXR1cm4gXCJ0YWJsZXRcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwicGhvbmVcIjtcbiAgfSxcbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgdGhlIGRldmljZSBpcyBhIHRhYmxldCAob3IgdGFibGV0LXNpemVkLCBtb3JlIGFjY3VyYXRlbHkpXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBpc1RhYmxldDogICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUEtERVZJQ0UuZm9ybUZhY3RvcigpID09PSBcInRhYmxldFwiO1xuICB9LFxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgZGV2aWNlIGlzIGEgdGFibGV0IChvciB0YWJsZXQtc2l6ZWQsIG1vcmUgYWNjdXJhdGVseSlcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGlzUGhvbmU6ICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQS0RFVklDRS5mb3JtRmFjdG9yKCkgPT09IFwicGhvbmVcIjtcbiAgfSxcbiAgLyoqXG4gICAqXG4gICAqIERldGVybWluZXMgaWYgdGhlIGRldmljZSBpcyBpbiBQb3J0cmFpdCBvcmllbnRhdGlvbi5cbiAgICpcbiAgICogQG1ldGhvZCBpc1BvcnRyYWl0XG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgZGV2aWNlIGlzIGluIGEgUG9ydHJhaXQgb3JpZW50YXRpb247IGBmYWxzZWAgb3RoZXJ3aXNlXG4gICAqL1xuICBpc1BvcnRyYWl0OiAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gd2luZG93Lm9yaWVudGF0aW9uID09PSAwIHx8IHdpbmRvdy5vcmllbnRhdGlvbiA9PT0gMTgwIHx8IHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoIFwiP3BvcnRyYWl0XCIgKSA+IC0xO1xuICB9LFxuICAvKipcbiAgICpcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgZGV2aWNlIGlzIGluIExhbmRzY2FwZSBvcmllbnRhdGlvbi5cbiAgICpcbiAgICogQG1ldGhvZCBpc0xhbmRzY2FwZVxuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgdGhlIGRldmljZSBpcyBpbiBhIGxhbmRzY2FwZSBvcmllbnRhdGlvbjsgYGZhbHNlYCBvdGhlcndpc2VcbiAgICovXG4gIGlzTGFuZHNjYXBlOiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgIGlmICggd2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZiggXCI/bGFuZHNjYXBlXCIgKSA+IC0xICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiAhUEtERVZJQ0UuaXNQb3J0cmFpdCgpO1xuICB9LFxuICAvKipcbiAgICpcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgZGV2aWNlIGlzIGEgaGlEUEkgZGV2aWNlIChha2EgcmV0aW5hKVxuICAgKlxuICAgKiBAbWV0aG9kIGlzUmV0aW5hXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgZGV2aWNlIGhhcyBhIGB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpb2AgZ3JlYXRlciB0aGFuIGAxLjBgOyBgZmFsc2VgIG90aGVyd2lzZVxuICAgKi9cbiAgaXNSZXRpbmE6ICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID4gMTtcbiAgfSxcbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBkZXZpY2UgaXMgYW4gaVBhZC5cbiAgICpcbiAgICogQG1ldGhvZCBpUGFkXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpUGFkOiAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUEtERVZJQ0UucGxhdGZvcm0oKSA9PT0gXCJpb3NcIiAmJiBQS0RFVklDRS5mb3JtRmFjdG9yKCkgPT09IFwidGFibGV0XCI7XG4gIH0sXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZGV2aWNlIGlzIGFuIGlQaG9uZSAob3IgaVBvZCkuXG4gICAqXG4gICAqIEBtZXRob2QgaVBob25lXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpUGhvbmU6ICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUEtERVZJQ0UucGxhdGZvcm0oKSA9PT0gXCJpb3NcIiAmJiBQS0RFVklDRS5mb3JtRmFjdG9yKCkgPT09IFwicGhvbmVcIjtcbiAgfSxcbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBkZXZpY2UgaXMgYW4gQW5kcm9pZCBQaG9uZS5cbiAgICpcbiAgICogQG1ldGhvZCBkcm9pZFBob25lXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBkcm9pZFBob25lOiAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUEtERVZJQ0UucGxhdGZvcm0oKSA9PT0gXCJhbmRyb2lkXCIgJiYgUEtERVZJQ0UuZm9ybUZhY3RvcigpID09PSBcInBob25lXCI7XG4gIH0sXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZGV2aWNlIGlzIGFuIEFuZHJvaWQgVGFibGV0LlxuICAgKlxuICAgKiBAbWV0aG9kIGRyb2lkVGFibGV0XG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBkcm9pZFRhYmxldDogICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUEtERVZJQ0UucGxhdGZvcm0oKSA9PT0gXCJhbmRyb2lkXCIgJiYgUEtERVZJQ0UuZm9ybUZhY3RvcigpID09PSBcInRhYmxldFwiO1xuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBQS0RFVklDRTtcbiIsIi8qKlxuICpcbiAqIEZpbGVNYW5hZ2VyIGltcGxlbWVudHMgbWV0aG9kcyB0aGF0IGludGVyYWN0IHdpdGggdGhlIEhUTUw1IEFQSVxuICpcbiAqIEBtb2R1bGUgZmlsZU1hbmFnZXIuanNcbiAqIEBhdXRob3IgS2VycmkgU2hvdHRzXG4gKiBAdmVyc2lvbiAwLjRcbiAqIGBgYFxuICogQ29weXJpZ2h0IChjKSAyMDEzIEtlcnJpIFNob3R0cywgcGhvdG9LYW5keSBTdHVkaW9zIExMQ1xuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nXG4gKiBjb25kaXRpb25zOlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllc1xuICogb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUlxuICogUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuICogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVFxuICogT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1JcbiAqIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqIGBgYFxuICovXG4vKmdsb2JhbHMgbW9kdWxlLCBkZWZpbmUsIFEsIExvY2FsRmlsZVN5c3RlbSwgY29uc29sZSwgd2luZG93LCBuYXZpZ2F0b3IsIEZpbGVSZWFkZXIqL1xudmFyIFEgPSByZXF1aXJlKCBcIi4uLy4uL3FcIiApO1xudmFyIEJhc2VPYmplY3QgPSByZXF1aXJlKCBcIi4vb2JqZWN0LmpzXCIgKTtcblwidXNlIHN0cmljdFwiO1xudmFyIElOX1lBU01GID0gdHJ1ZTtcbnJldHVybiAoZnVuY3Rpb24gKCBRLCBCYXNlT2JqZWN0LCBnbG9iYWxDb250ZXh0LCBtb2R1bGUgKSB7XG4gIC8qKlxuICAgKiBEZWZpbmVkIGJ5IFEsIGFjdHVhbGx5LCBidXQgZGVmaW5lZCBoZXJlIHRvIG1ha2UgdHlwZSBoYW5kbGluZyBuaWNlclxuICAgKiBAdHlwZWRlZiB7e319IFByb21pc2VcbiAgICovXG4gIHZhciBERUJVRyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBSZXF1ZXN0cyBhIHF1b3RhIGZyb20gdGhlIGZpbGUgc3lzdGVtXG4gICAqIEBtZXRob2QgX3JlcXVlc3RRdW90YVxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHsqfSBmaWxlU3lzdGVtVHlwZSAgICBQRVJTSVNURU5UIG9yIFRFTVBPUkFSWVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHJlcXVlc3RlZERhdGFTaXplIFRoZSBxdW90YSB3ZSdyZSBhc2tpbmcgZm9yXG4gICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICAgICAgIFRoZSBwcm9taXNlXG4gICAqL1xuICBmdW5jdGlvbiBfcmVxdWVzdFF1b3RhKCBmaWxlU3lzdGVtVHlwZSwgcmVxdWVzdGVkRGF0YVNpemUgKSB7XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGlmICggREVCVUcgKSB7XG4gICAgICBjb25zb2xlLmxvZyggW1wiX3JlcXVlc3RRdW90YTogXCIsIGZpbGVTeXN0ZW1UeXBlLCByZXF1ZXN0ZWREYXRhU2l6ZV0uam9pbiggXCIgXCIgKSApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gYXR0ZW1wdCB0byBhc2sgZm9yIGEgcXVvdGFcbiAgICAgIHZhciBQRVJTSVNURU5UID0gKCB0eXBlb2YgTG9jYWxGaWxlU3lzdGVtICE9PSBcInVuZGVmaW5lZFwiICkgPyBMb2NhbEZpbGVTeXN0ZW0uUEVSU0lTVEVOVCA6IHdpbmRvdy5QRVJTSVNURU5ULFxuICAgICAgLy8gQ2hyb21lIGhhcyBgd2Via2l0UGVyc2lzdGVudFN0b3JhZ2VgIGFuZCBgbmF2aWdhdG9yLndlYmtpdFRlbXBvcmFyeVN0b3JhZ2VgXG4gICAgICAgIHN0b3JhZ2VJbmZvID0gZmlsZVN5c3RlbVR5cGUgPT09IFBFUlNJU1RFTlQgPyBuYXZpZ2F0b3Iud2Via2l0UGVyc2lzdGVudFN0b3JhZ2UgOiBuYXZpZ2F0b3Iud2Via2l0VGVtcG9yYXJ5U3RvcmFnZTtcbiAgICAgIGlmICggc3RvcmFnZUluZm8gKSB7XG4gICAgICAgIC8vIG5vdyBtYWtlIHN1cmUgd2UgY2FuIHJlcXVlc3QgYSBxdW90YVxuICAgICAgICBpZiAoIHN0b3JhZ2VJbmZvLnJlcXVlc3RRdW90YSApIHtcbiAgICAgICAgICAvLyByZXF1ZXN0IHRoZSBxdW90YVxuICAgICAgICAgIHN0b3JhZ2VJbmZvLnJlcXVlc3RRdW90YSggcmVxdWVzdGVkRGF0YVNpemUsIGZ1bmN0aW9uIHN1Y2Nlc3MoIGdyYW50ZWRCeXRlcyApIHtcbiAgICAgICAgICAgIGlmICggREVCVUcgKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBbXCJfcmVxdWVzdFF1b3RhOiBxdW90YSBncmFudGVkOiBcIiwgZmlsZVN5c3RlbVR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JhbnRlZEJ5dGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oIFwiIFwiICkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIGdyYW50ZWRCeXRlcyApO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIGZhaWx1cmUoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgICBpZiAoIERFQlVHICkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyggW1wiX3JlcXVlc3RRdW90YTogcXVvdGEgcmVqZWN0ZWQ6IFwiLCBmaWxlU3lzdGVtVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0ZWREYXRhU2l6ZSwgYW5FcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCBcIiBcIiApICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICB9ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gbm90IGV2ZXJ5dGhpbmcgc3VwcG9ydHMgYXNraW5nIGZvciBhIHF1b3RhIC0tIGxpa2UgQ29yZG92YS5cbiAgICAgICAgICAvLyBJbnN0ZWFkLCBsZXQncyBhc3N1bWUgd2UgZ2V0IHBlcm1pc3Npb25cbiAgICAgICAgICBpZiAoIERFQlVHICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coIFtcIl9yZXF1ZXN0UXVvdGE6IGNvdWxkbid0IHJlcXVlc3QgcXVvdGEgLS0gbm8gcmVxdWVzdFF1b3RhOiBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbVR5cGUsIHJlcXVlc3RlZERhdGFTaXplXG4gICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCBcIiBcIiApICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHJlcXVlc3RlZERhdGFTaXplICk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICggREVCVUcgKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coIFtcIl9yZXF1ZXN0UXVvdGE6IGNvdWxkbid0IHJlcXVlc3QgcXVvdGEgLS0gbm8gc3RvcmFnZUluZm86IFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbVR5cGUsIHJlcXVlc3RlZERhdGFTaXplXG4gICAgICAgICAgICAgICAgICAgICAgIF0uam9pbiggXCIgXCIgKSApO1xuICAgICAgICB9XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHJlcXVlc3RlZERhdGFTaXplICk7XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoICggYW5FcnJvciApIHtcbiAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IGEgZmlsZSBzeXN0ZW0gd2l0aCB0aGUgcmVxdWVzdGVkIHNpemUgKG9idGFpbmVkIGZpcnN0IGJ5IGdldHRpbmcgYSBxdW90YSlcbiAgICogQG1ldGhvZCBfcmVxdWVzdEZpbGVTeXN0ZW1cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7Kn0gZmlsZVN5c3RlbVR5cGUgICAgVEVNUE9SQVJZIG9yIFBFUlNJU1RFTlRcbiAgICogQHBhcmFtICB7TnVtYmVyfSByZXF1ZXN0ZWREYXRhU2l6ZSBUaGUgcXVvdGFcbiAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICAgICAgVGhlIHByb21pc2VcbiAgICovXG4gIGZ1bmN0aW9uIF9yZXF1ZXN0RmlsZVN5c3RlbSggZmlsZVN5c3RlbVR5cGUsIHJlcXVlc3RlZERhdGFTaXplICkge1xuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBpZiAoIERFQlVHICkge1xuICAgICAgY29uc29sZS5sb2coIFtcIl9yZXF1ZXN0RmlsZVN5c3RlbTogXCIsIGZpbGVTeXN0ZW1UeXBlLCByZXF1ZXN0ZWREYXRhU2l6ZV0uam9pbiggXCIgXCIgKSApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gZml4IGlzc3VlICMyIGJ5IGNoYXNlbiB3aGVyZSB1c2luZyBgd2Via2l0UmVxdWVzdEZpbGVTeXN0ZW1gIHdhcyBoYXZpbmcgcHJvYmxlbXNcbiAgICAgIC8vIG9uIEFuZHJvaWQgNC4yLjJcbiAgICAgIHZhciByZXF1ZXN0RmlsZVN5c3RlbSA9IHdpbmRvdy5yZXF1ZXN0RmlsZVN5c3RlbSB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEZpbGVTeXN0ZW07XG4gICAgICByZXF1ZXN0RmlsZVN5c3RlbSggZmlsZVN5c3RlbVR5cGUsIHJlcXVlc3RlZERhdGFTaXplLCBmdW5jdGlvbiBzdWNjZXNzKCB0aGVGaWxlU3lzdGVtICkge1xuICAgICAgICBpZiAoIERFQlVHICkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCBbXCJfcmVxdWVzdEZpbGVTeXN0ZW06IGdvdCBhIGZpbGUgc3lzdGVtXCIsIHRoZUZpbGVTeXN0ZW1dLmpvaW4oIFwiIFwiICkgKTtcbiAgICAgICAgfVxuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVGaWxlU3lzdGVtICk7XG4gICAgICB9LCBmdW5jdGlvbiBmYWlsdXJlKCBhbkVycm9yICkge1xuICAgICAgICBpZiAoIERFQlVHICkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCBbXCJfcmVxdWVzdEZpbGVTeXN0ZW06IGNvdWxkbid0IGdldCBhIGZpbGUgc3lzdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtVHlwZVxuICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oIFwiIFwiICkgKTtcbiAgICAgICAgfVxuICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgIH0gKTtcbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc29sdmVzIHRoZVVSSSB0byBhIGZpbGVFbnRyeSBvciBkaXJlY3RvcnlFbnRyeSwgaWYgcG9zc2libGUuXG4gICAqIElmIGB0aGVVUkxgIGNvbnRhaW5zIGBwcml2YXRlYCBvciBgbG9jYWxob3N0YCBhcyBpdHMgZmlyc3QgZWxlbWVudCwgaXQgd2lsbCBiZSByZW1vdmVkLiBJZlxuICAgKiBgdGhlVVJMYCBkb2VzIG5vdCBoYXZlIGEgVVJMIHNjaGVtZSwgYGZpbGU6Ly9gIHdpbGwgYmUgYXNzdW1lZC5cbiAgICogQG1ldGhvZCBfcmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTFxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRoZVVSTCB0aGUgcGF0aCwgc2hvdWxkIHN0YXJ0IHdpdGggZmlsZTovLywgYnV0IGlmIGl0IGRvZXNuJ3Qgd2UnbGwgYWRkIGl0LlxuICAgKi9cbiAgZnVuY3Rpb24gX3Jlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoIHRoZVVSTCApIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgaWYgKCBERUJVRyApIHtcbiAgICAgIGNvbnNvbGUubG9nKCBbXCJfcmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTDogXCIsIHRoZVVSTF0uam9pbiggXCIgXCIgKSApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gc3BsaXQgdGhlIHBhcnRzIG9mIHRoZSBVUkxcbiAgICAgIHZhciBwYXJ0cyA9IHRoZVVSTC5zcGxpdCggXCI6XCIgKSxcbiAgICAgICAgcHJvdG9jb2wsIHBhdGg7XG4gICAgICAvLyBjYW4gb25seSBoYXZlIHR3byBwYXJ0c1xuICAgICAgaWYgKCBwYXJ0cy5sZW5ndGggPiAyICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVGhlIFVSSSBpcyBub3Qgd2VsbC1mb3JtZWQ7IG1pc3NpbmcgcHJvdG9jb2w6IFwiICsgdGhlVVJMICk7XG4gICAgICB9XG4gICAgICAvLyBpZiBvbmx5IG9uZSBwYXJ0LCB3ZSBhc3N1bWUgYGZpbGVgIGFzIHRoZSBwcm90b2NvbFxuICAgICAgaWYgKCBwYXJ0cy5sZW5ndGggPCAyICkge1xuICAgICAgICBwcm90b2NvbCA9IFwiZmlsZVwiO1xuICAgICAgICBwYXRoID0gcGFydHNbMF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcm90b2NvbCA9IHBhcnRzWzBdO1xuICAgICAgICBwYXRoID0gcGFydHNbMV07XG4gICAgICB9XG4gICAgICAvLyBzcGxpdCB0aGUgcGF0aCBjb21wb25lbnRzXG4gICAgICB2YXIgcGF0aENvbXBvbmVudHMgPSBwYXRoLnNwbGl0KCBcIi9cIiApLFxuICAgICAgICBuZXdQYXRoQ29tcG9uZW50cyA9IFtdO1xuICAgICAgLy8gaXRlcmF0ZSBvdmVyIGVhY2ggY29tcG9uZW50IGFuZCB0cmltIGFzIHdlIGdvXG4gICAgICBwYXRoQ29tcG9uZW50cy5mb3JFYWNoKCBmdW5jdGlvbiAoIHBhcnQgKSB7XG4gICAgICAgIHBhcnQgPSBwYXJ0LnRyaW0oKTtcbiAgICAgICAgaWYgKCBwYXJ0ICE9PSBcIlwiICkgeyAvLyByZW1vdmUgL3ByaXZhdGUgaWYgaXQgaXMgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIG5ldyBhcnJheSwgZm9yIGlPUyBzYWtlXG4gICAgICAgICAgaWYgKCAhKCAoIHBhcnQgPT09IFwicHJpdmF0ZVwiIHx8IHBhcnQgPT09IFwibG9jYWxob3N0XCIgKSAmJiBuZXdQYXRoQ29tcG9uZW50cy5sZW5ndGggPT09IDAgKSApIHtcbiAgICAgICAgICAgIG5ld1BhdGhDb21wb25lbnRzLnB1c2goIHBhcnQgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gKTtcbiAgICAgIC8vIHJlam9pbiB0aGUgcGF0aCBjb21wb25lbnRzXG4gICAgICB2YXIgdGhlTmV3VVJJID0gbmV3UGF0aENvbXBvbmVudHMuam9pbiggXCIvXCIgKTtcbiAgICAgIC8vIGFkZCB0aGUgcHJvdG9jb2xcbiAgICAgIHRoZU5ld1VSSSA9IHByb3RvY29sICsgXCI6Ly8vXCIgKyB0aGVOZXdVUkk7XG4gICAgICAvLyBhbmQgcmVzb2x2ZSB0aGUgVVJMLlxuICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoIHRoZU5ld1VSSSwgZnVuY3Rpb24gKCB0aGVFbnRyeSApIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlRW50cnkgKTtcbiAgICAgIH0sIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICB9ICk7XG4gICAgfVxuICAgIGNhdGNoICggYW5FcnJvciApIHtcbiAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7e319IERpcmVjdG9yeUVudHJ5XG4gICAqIEhUTUw1IEZpbGUgQVBJIERpcmVjdG9yeSBUeXBlXG4gICAqL1xuICAvKipcbiAgICogUmV0dXJucyBhIGRpcmVjdG9yeSBlbnRyeSBiYXNlZCBvbiB0aGUgcGF0aCBmcm9tIHRoZSBwYXJlbnQgdXNpbmdcbiAgICogdGhlIHNwZWNpZmllZCBvcHRpb25zLCBpZiBzcGVjaWZpZWQuIGBvcHRpb25zYCB0YWtlcyB0aGUgZm9ybTpcbiAgICogYCB7Y3JlYXRlOiB0cnVlL2ZhbHNlLCBleGNsdXNpdmUgdHJ1ZS9mYWxzZSB9YFxuICAgKiBAbWV0aG9kIF9nZXREaXJlY3RvcnlFbnRyeVxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtEaXJlY3RvcnlFbnRyeX0gcGFyZW50ICBUaGUgcGFyZW50IHRoYXQgcGF0aCBpcyByZWxhdGl2ZSBmcm9tIChvciBhYnNvbHV0ZSlcbiAgICogQHBhcmFtICB7U3RyaW5nfSBwYXRoICAgIFRoZSByZWxhdGl2ZSBvciBhYnNvbHV0ZSBwYXRoIG9yIGEge0RpcmVjdG9yeUVudHJ5fVxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgKHRoYXQgaXMsIGNyZWF0ZSB0aGUgZGlyZWN0b3J5IGlmIGl0IGRvZXNuJ3QgZXhpc3QsIGV0Yy4pXG4gICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgVGhlIHByb21pc2VcbiAgICovXG4gIGZ1bmN0aW9uIF9nZXREaXJlY3RvcnlFbnRyeSggcGFyZW50LCBwYXRoLCBvcHRpb25zICkge1xuICAgIGlmICggREVCVUcgKSB7XG4gICAgICBjb25zb2xlLmxvZyggW1wiX2dldERpcmVjdG9yeUVudHJ5OlwiLCBwYXJlbnQsIHBhdGgsIG9wdGlvbnNdLmpvaW4oIFwiIFwiICkgKTtcbiAgICB9XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIHRyeSB7XG4gICAgICBpZiAoIHR5cGVvZiBwYXRoID09PSBcIm9iamVjdFwiICkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCBwYXRoICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJlbnQuZ2V0RGlyZWN0b3J5KCBwYXRoLCBvcHRpb25zIHx8IHt9LCBmdW5jdGlvbiBzdWNjZXNzKCB0aGVEaXJlY3RvcnlFbnRyeSApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVEaXJlY3RvcnlFbnRyeSApO1xuICAgICAgICB9LCBmdW5jdGlvbiBmYWlsdXJlKCBhbkVycm9yICkge1xuICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgICB9ICk7XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoICggYW5FcnJvciApIHtcbiAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgZmlsZSBlbnRyeSBiYXNlZCBvbiB0aGUgcGF0aCBmcm9tIHRoZSBwYXJlbnQgdXNpbmdcbiAgICogdGhlIHNwZWNpZmllZCBvcHRpb25zLiBgb3B0aW9uc2AgdGFrZXMgdGhlIGZvcm0gb2YgYHsgY3JlYXRlOiB0cnVlL2ZhbHNlLCBleGNsdXNpdmU6IHRydWUvZmFsc2V9YFxuICAgKiBAbWV0aG9kIGdldEZpbGVFbnRyeVxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtEaXJlY3RvcnlFbnRyeX0gcGFyZW50ICBUaGUgcGFyZW50IHRoYXQgcGF0aCBpcyByZWxhdGl2ZSBmcm9tIChvciBhYnNvbHV0ZSlcbiAgICogQHBhcmFtICB7U3RyaW5nfSBwYXRoICAgIFRoZSByZWxhdGl2ZSBvciBhYnNvbHV0ZSBwYXRoXG4gICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyAodGhhdCBpcywgY3JlYXRlIHRoZSBmaWxlIGlmIGl0IGRvZXNuJ3QgZXhpc3QsIGV0Yy4pXG4gICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgVGhlIHByb21pc2VcbiAgICovXG4gIGZ1bmN0aW9uIF9nZXRGaWxlRW50cnkoIHBhcmVudCwgcGF0aCwgb3B0aW9ucyApIHtcbiAgICBpZiAoIERFQlVHICkge1xuICAgICAgY29uc29sZS5sb2coIFtcIl9nZXRGaWxlRW50cnk6XCIsIHBhcmVudCwgcGF0aCwgb3B0aW9uc10uam9pbiggXCIgXCIgKSApO1xuICAgIH1cbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgdHJ5IHtcbiAgICAgIGlmICggdHlwZW9mIHBhdGggPT09IFwib2JqZWN0XCIgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHBhdGggKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmVudC5nZXRGaWxlKCBwYXRoLCBvcHRpb25zIHx8IHt9LCBmdW5jdGlvbiBzdWNjZXNzKCB0aGVGaWxlRW50cnkgKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlRmlsZUVudHJ5ICk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIGZhaWx1cmUoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICAgIH0gKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHt7fX0gRmlsZUVudHJ5XG4gICAqIEhUTUw1IEZpbGUgQVBJIEZpbGUgRW50cnlcbiAgICovXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgZmlsZSBvYmplY3QgYmFzZWQgb24gdGhlIGZpbGUgZW50cnkuXG4gICAqIEBtZXRob2QgX2dldEZpbGVPYmplY3RcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7RmlsZUVudHJ5fSBmaWxlRW50cnkgVGhlIGZpbGUgRW50cnlcbiAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgIFRoZSBQcm9taXNlXG4gICAqL1xuICBmdW5jdGlvbiBfZ2V0RmlsZU9iamVjdCggZmlsZUVudHJ5ICkge1xuICAgIGlmICggREVCVUcgKSB7XG4gICAgICBjb25zb2xlLmxvZyggW1wiX2dldEZpbGVPYmplY3Q6XCIsIGZpbGVFbnRyeV0uam9pbiggXCIgXCIgKSApO1xuICAgIH1cbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgdHJ5IHtcbiAgICAgIGZpbGVFbnRyeS5maWxlKCBmdW5jdGlvbiBzdWNjZXNzKCB0aGVGaWxlICkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVGaWxlICk7XG4gICAgICB9LCBmdW5jdGlvbiBmYWlsdXJlKCBhbkVycm9yICkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgIH0gKTtcbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlYWRzIHRoZSBmaWxlIGNvbnRlbnRzIGZyb20gYSBmaWxlIG9iamVjdC4gcmVhZEFzS2luZCBpbmRpY2F0ZXMgaG93XG4gICAqIHRvIHJlYWQgdGhlIGZpbGUgKFwiVGV4dFwiLCBcIkRhdGFVUkxcIiwgXCJCaW5hcnlTdHJpbmdcIiwgXCJBcnJheUJ1ZmZlclwiKS5cbiAgICogQG1ldGhvZCBfcmVhZEZpbGVDb250ZW50c1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtGaWxlfSBmaWxlT2JqZWN0IEZpbGUgdG8gcmVhZFxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHJlYWRBc0tpbmQgXCJUZXh0XCIsIFwiRGF0YVVSTFwiLCBcIkJpbmFyeVN0cmluZ1wiLCBcIkFycmF5QnVmZmVyXCJcbiAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgKi9cbiAgZnVuY3Rpb24gX3JlYWRGaWxlQ29udGVudHMoIGZpbGVPYmplY3QsIHJlYWRBc0tpbmQgKSB7XG4gICAgaWYgKCBERUJVRyApIHtcbiAgICAgIGNvbnNvbGUubG9nKCBbXCJfcmVhZEZpbGVDb250ZW50czpcIiwgZmlsZU9iamVjdCwgcmVhZEFzS2luZF0uam9pbiggXCIgXCIgKSApO1xuICAgIH1cbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgIGZpbGVSZWFkZXIub25sb2FkZW5kID0gZnVuY3Rpb24gKCBlICkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCBlLnRhcmdldC5yZXN1bHQgKTtcbiAgICAgIH07XG4gICAgICBmaWxlUmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbiAoIGFuRXJyb3IgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgfTtcbiAgICAgIGZpbGVSZWFkZXJbXCJyZWFkQXNcIiArIHJlYWRBc0tpbmRdKCBmaWxlT2JqZWN0ICk7XG4gICAgfVxuICAgIGNhdGNoICggYW5FcnJvciApIHtcbiAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZmlsZSB3cml0ZXIgZm9yIHRoZSBmaWxlIGVudHJ5OyBgZmlsZUVudHJ5YCBtdXN0IGV4aXN0XG4gICAqIEBtZXRob2QgX2NyZWF0ZUZpbGVXcml0ZXJcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7RmlsZUVudHJ5fSBmaWxlRW50cnkgVGhlIGZpbGUgZW50cnkgdG8gd3JpdGUgdG9cbiAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgIHRoZSBQcm9taXNlXG4gICAqL1xuICBmdW5jdGlvbiBfY3JlYXRlRmlsZVdyaXRlciggZmlsZUVudHJ5ICkge1xuICAgIGlmICggREVCVUcgKSB7XG4gICAgICBjb25zb2xlLmxvZyggW1wiX2NyZWF0ZUZpbGVXcml0ZXI6XCIsIGZpbGVFbnRyeV0uam9pbiggXCIgXCIgKSApO1xuICAgIH1cbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBmaWxlV3JpdGVyID0gZmlsZUVudHJ5LmNyZWF0ZVdyaXRlciggZnVuY3Rpb24gc3VjY2VzcyggdGhlRmlsZVdyaXRlciApIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlRmlsZVdyaXRlciApO1xuICAgICAgfSwgZnVuY3Rpb24gZmFpbHVyZSggYW5FcnJvciApIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICB9ICk7XG4gICAgfVxuICAgIGNhdGNoICggYW5FcnJvciApIHtcbiAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7e319IEZpbGVXcml0ZXJcbiAgICogSFRNTDUgRmlsZSBBUEkgRmlsZSBXcml0ZXIgVHlwZVxuICAgKi9cbiAgLyoqXG4gICAqIFdyaXRlIHRoZSBjb250ZW50cyB0byB0aGUgZmlsZVdyaXRlcjsgYGNvbnRlbnRzYCBzaG91bGQgYmUgYSBCbG9iLlxuICAgKiBAbWV0aG9kIF93cml0ZUZpbGVDb250ZW50c1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtGaWxlV3JpdGVyfSBmaWxlV3JpdGVyIE9idGFpbmVkIGZyb20gX2NyZWF0ZUZpbGVXcml0ZXJcbiAgICogQHBhcmFtICB7Kn0gY29udGVudHMgICBUaGUgY29udGVudHMgdG8gd3JpdGVcbiAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICB0aGUgUHJvbWlzZVxuICAgKi9cbiAgZnVuY3Rpb24gX3dyaXRlRmlsZUNvbnRlbnRzKCBmaWxlV3JpdGVyLCBjb250ZW50cyApIHtcbiAgICBpZiAoIERFQlVHICkge1xuICAgICAgY29uc29sZS5sb2coIFtcIl93cml0ZUZpbGVDb250ZW50czpcIiwgZmlsZVdyaXRlciwgY29udGVudHNdLmpvaW4oIFwiIFwiICkgKTtcbiAgICB9XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIHRyeSB7XG4gICAgICBmaWxlV3JpdGVyLm9ud3JpdGUgPSBmdW5jdGlvbiAoIGUgKSB7XG4gICAgICAgIGZpbGVXcml0ZXIub253cml0ZSA9IGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCBlICk7XG4gICAgICAgIH07XG4gICAgICAgIGZpbGVXcml0ZXIud3JpdGUoIGNvbnRlbnRzICk7XG4gICAgICB9O1xuICAgICAgZmlsZVdyaXRlci5vbkVycm9yID0gZnVuY3Rpb24gKCBhbkVycm9yICkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgIH07XG4gICAgICBmaWxlV3JpdGVyLnRydW5jYXRlKCAwICk7IC8vIGNsZWFyIG91dCB0aGUgY29udGVudHMsIGZpcnN0XG4gICAgfVxuICAgIGNhdGNoICggYW5FcnJvciApIHtcbiAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3B5IHRoZSBmaWxlIHRvIHRoZSBzcGVjaWZpZWQgcGFyZW50IGRpcmVjdG9yeSwgd2l0aCBhbiBvcHRpb25hbCBuZXcgbmFtZVxuICAgKiBAbWV0aG9kIF9jb3B5RmlsZVxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtGaWxlRW50cnl9IHRoZUZpbGVFbnRyeSAgICAgICAgICAgIFRoZSBmaWxlIHRvIGNvcHlcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5RW50cnl9IHRoZVBhcmVudERpcmVjdG9yeUVudHJ5IFRoZSBwYXJlbnQgZGlyZWN0b3J5IHRvIGNvcHkgdGhlIGZpbGUgdG9cbiAgICogQHBhcmFtICB7U3RyaW5nfSB0aGVOZXdOYW1lICAgICAgICAgICAgICBUaGUgbmV3IG5hbWUgb2YgdGhlIGZpbGUgKCBvciB1bmRlZmluZWQgc2ltcGx5IHRvIGNvcHkgKVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgKi9cbiAgZnVuY3Rpb24gX2NvcHlGaWxlKCB0aGVGaWxlRW50cnksIHRoZVBhcmVudERpcmVjdG9yeUVudHJ5LCB0aGVOZXdOYW1lICkge1xuICAgIGlmICggREVCVUcgKSB7XG4gICAgICBjb25zb2xlLmxvZyggW1wiX2NvcHlGaWxlOlwiLCB0aGVGaWxlRW50cnksIHRoZVBhcmVudERpcmVjdG9yeUVudHJ5LFxuICAgICAgICAgICAgICAgICAgICB0aGVOZXdOYW1lXG4gICAgICAgICAgICAgICAgICAgXS5qb2luKCBcIiBcIiApICk7XG4gICAgfVxuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICB0cnkge1xuICAgICAgdGhlRmlsZUVudHJ5LmNvcHlUbyggdGhlUGFyZW50RGlyZWN0b3J5RW50cnksIHRoZU5ld05hbWUsIGZ1bmN0aW9uIHN1Y2Nlc3MoIHRoZU5ld0ZpbGVFbnRyeSApIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlTmV3RmlsZUVudHJ5ICk7XG4gICAgICB9LCBmdW5jdGlvbiBmYWlsdXJlKCBhbkVycm9yICkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgIH0gKTtcbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vdmUgdGhlIGZpbGUgdG8gdGhlIHNwZWNpZmllZCBwYXJlbnQgZGlyZWN0b3J5LCB3aXRoIGFuIG9wdGlvbmFsIG5ldyBuYW1lXG4gICAqIEBtZXRob2QgX21vdmVGaWxlXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0ZpbGVFbnRyeX0gdGhlRmlsZUVudHJ5ICAgICAgICAgICAgVGhlIGZpbGUgdG8gbW92ZSBvciByZW5hbWVcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5RW50cnl9IHRoZVBhcmVudERpcmVjdG9yeUVudHJ5IFRoZSBwYXJlbnQgZGlyZWN0b3J5IHRvIG1vdmUgdGhlIGZpbGUgdG8gKG9yIHRoZSBzYW1lIGFzIHRoZSBmaWxlIGluIG9yZGVyIHRvIHJlbmFtZSlcbiAgICogQHBhcmFtICB7U3RyaW5nfSB0aGVOZXdOYW1lICAgICAgICAgICAgICBUaGUgbmV3IG5hbWUgb2YgdGhlIGZpbGUgKCBvciB1bmRlZmluZWQgc2ltcGx5IHRvIG1vdmUgKVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgKi9cbiAgZnVuY3Rpb24gX21vdmVGaWxlKCB0aGVGaWxlRW50cnksIHRoZVBhcmVudERpcmVjdG9yeUVudHJ5LCB0aGVOZXdOYW1lICkge1xuICAgIGlmICggREVCVUcgKSB7XG4gICAgICBjb25zb2xlLmxvZyggW1wiX21vdmVGaWxlOlwiLCB0aGVGaWxlRW50cnksIHRoZVBhcmVudERpcmVjdG9yeUVudHJ5LFxuICAgICAgICAgICAgICAgICAgICB0aGVOZXdOYW1lXG4gICAgICAgICAgICAgICAgICAgXS5qb2luKCBcIiBcIiApICk7XG4gICAgfVxuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICB0cnkge1xuICAgICAgdGhlRmlsZUVudHJ5Lm1vdmVUbyggdGhlUGFyZW50RGlyZWN0b3J5RW50cnksIHRoZU5ld05hbWUsIGZ1bmN0aW9uIHN1Y2Nlc3MoIHRoZU5ld0ZpbGVFbnRyeSApIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlTmV3RmlsZUVudHJ5ICk7XG4gICAgICB9LCBmdW5jdGlvbiBmYWlsdXJlKCBhbkVycm9yICkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgIH0gKTtcbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZmlsZSBmcm9tIHRoZSBmaWxlIHN5c3RlbVxuICAgKiBAbWV0aG9kIF9yZW1vdmVGaWxlXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0ZpbGVFbnRyeX0gdGhlRmlsZUVudHJ5IFRoZSBmaWxlIHRvIHJlbW92ZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgVGhlIFByb21pc2VcbiAgICovXG4gIGZ1bmN0aW9uIF9yZW1vdmVGaWxlKCB0aGVGaWxlRW50cnkgKSB7XG4gICAgaWYgKCBERUJVRyApIHtcbiAgICAgIGNvbnNvbGUubG9nKCBbXCJfcmVtb3ZlRmlsZTpcIiwgdGhlRmlsZUVudHJ5XS5qb2luKCBcIiBcIiApICk7XG4gICAgfVxuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICB0cnkge1xuICAgICAgdGhlRmlsZUVudHJ5LnJlbW92ZSggZnVuY3Rpb24gc3VjY2VzcygpIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgfSwgZnVuY3Rpb24gZmFpbHVyZSggYW5FcnJvciApIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICB9ICk7XG4gICAgfVxuICAgIGNhdGNoICggYW5FcnJvciApIHtcbiAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3BpZXMgYSBkaXJlY3RvcnkgdG8gdGhlIHNwZWNpZmllZCBkaXJlY3RvcnksIHdpdGggYW4gb3B0aW9uYWwgbmV3IG5hbWUuIFRoZSBkaXJlY3RvcnlcbiAgICogaXMgY29waWVkIHJlY3Vyc2l2ZWx5LlxuICAgKiBAbWV0aG9kIF9jb3B5RGlyZWN0b3J5XG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeUVudHJ5fSB0aGVEaXJlY3RvcnlFbnRyeSAgICAgICBUaGUgZGlyZWN0b3J5IHRvIGNvcHlcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5RW50cnl9IHRoZVBhcmVudERpcmVjdG9yeUVudHJ5IFRoZSBwYXJlbnQgZGlyZWN0b3J5IHRvIGNvcHkgdGhlIGZpcnN0IGRpcmVjdG9yeSB0b1xuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRoZU5ld05hbWUgICAgICAgICAgICAgIFRoZSBvcHRpb25hbCBuZXcgbmFtZSBmb3IgdGhlIGRpcmVjdG9yeVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICAgICAgICAgICBBIHByb21pc2VcbiAgICovXG4gIGZ1bmN0aW9uIF9jb3B5RGlyZWN0b3J5KCB0aGVEaXJlY3RvcnlFbnRyeSwgdGhlUGFyZW50RGlyZWN0b3J5RW50cnksIHRoZU5ld05hbWUgKSB7XG4gICAgaWYgKCBERUJVRyApIHtcbiAgICAgIGNvbnNvbGUubG9nKCBbXCJfY29weURpcmVjdG9yeTpcIiwgdGhlRGlyZWN0b3J5RW50cnksXG4gICAgICAgICAgICAgICAgICAgIHRoZVBhcmVudERpcmVjdG9yeUVudHJ5LFxuICAgICAgICAgICAgICAgICAgICB0aGVOZXdOYW1lXG4gICAgICAgICAgICAgICAgICAgXS5qb2luKCBcIiBcIiApICk7XG4gICAgfVxuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICB0cnkge1xuICAgICAgdGhlRGlyZWN0b3J5RW50cnkuY29weVRvKCB0aGVQYXJlbnREaXJlY3RvcnlFbnRyeSwgdGhlTmV3TmFtZSwgZnVuY3Rpb24gc3VjY2VzcyggdGhlTmV3RGlyZWN0b3J5RW50cnkgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHRoZU5ld0RpcmVjdG9yeUVudHJ5ICk7XG4gICAgICB9LCBmdW5jdGlvbiBmYWlsdXJlKCBhbkVycm9yICkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgIH0gKTtcbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIGEgZGlyZWN0b3J5IHRvIHRoZSBzcGVjaWZpZWQgZGlyZWN0b3J5LCB3aXRoIGFuIG9wdGlvbmFsIG5ldyBuYW1lLiBUaGUgZGlyZWN0b3J5XG4gICAqIGlzIG1vdmVkIHJlY3Vyc2l2ZWx5LlxuICAgKiBAbWV0aG9kIF9tb3ZlRGlyZWN0b3J5XG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeUVudHJ5fSB0aGVEaXJlY3RvcnlFbnRyeSAgICAgICBUaGUgZGlyZWN0b3J5IHRvIG1vdmVcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5RW50cnl9IHRoZVBhcmVudERpcmVjdG9yeUVudHJ5IFRoZSBwYXJlbnQgZGlyZWN0b3J5IHRvIG1vdmUgdGhlIGZpcnN0IGRpcmVjdG9yeSB0b1xuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRoZU5ld05hbWUgICAgICAgICAgICAgIFRoZSBvcHRpb25hbCBuZXcgbmFtZSBmb3IgdGhlIGRpcmVjdG9yeVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICAgICAgICAgICBBIHByb21pc2VcbiAgICovXG4gIGZ1bmN0aW9uIF9tb3ZlRGlyZWN0b3J5KCB0aGVEaXJlY3RvcnlFbnRyeSwgdGhlUGFyZW50RGlyZWN0b3J5RW50cnksIHRoZU5ld05hbWUgKSB7XG4gICAgaWYgKCBERUJVRyApIHtcbiAgICAgIGNvbnNvbGUubG9nKCBbXCJfbW92ZURpcmVjdG9yeTpcIiwgdGhlRGlyZWN0b3J5RW50cnksXG4gICAgICAgICAgICAgICAgICAgIHRoZVBhcmVudERpcmVjdG9yeUVudHJ5LFxuICAgICAgICAgICAgICAgICAgICB0aGVOZXdOYW1lXG4gICAgICAgICAgICAgICAgICAgXS5qb2luKCBcIiBcIiApICk7XG4gICAgfVxuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICB0cnkge1xuICAgICAgdGhlRGlyZWN0b3J5RW50cnkubW92ZVRvKCB0aGVQYXJlbnREaXJlY3RvcnlFbnRyeSwgdGhlTmV3TmFtZSwgZnVuY3Rpb24gc3VjY2VzcyggdGhlTmV3RGlyZWN0b3J5RW50cnkgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHRoZU5ld0RpcmVjdG9yeUVudHJ5ICk7XG4gICAgICB9LCBmdW5jdGlvbiBmYWlsdXJlKCBhbkVycm9yICkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgIH0gKTtcbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBkaXJlY3RvcnkgZnJvbSB0aGUgZmlsZSBzeXN0ZW0uIElmIHJlY3Vyc2l2ZWx5IGlzIHRydWUsIHRoZSBkaXJlY3RvcnkgaXMgcmVtb3ZlZFxuICAgKiByZWN1cnNpdmVseS5cbiAgICogQG1ldGhvZCBfcmVtb3ZlRGlyZWN0b3J5XG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeUVudHJ5fSB0aGVEaXJlY3RvcnlFbnRyeSBUaGUgZGlyZWN0b3J5IHRvIHJlbW92ZVxuICAgKiBAcGFyYW0gIHtCb29sZWFufSByZWN1cnNpdmVseSAgICAgICBJZiB0cnVlLCByZW1vdmUgcmVjdXJzaXZlbHlcbiAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICAgICAgVGhlIFByb21pc2VcbiAgICovXG4gIGZ1bmN0aW9uIF9yZW1vdmVEaXJlY3RvcnkoIHRoZURpcmVjdG9yeUVudHJ5LCByZWN1cnNpdmVseSApIHtcbiAgICBpZiAoIERFQlVHICkge1xuICAgICAgY29uc29sZS5sb2coIFtcIl9yZW1vdmVEaXJlY3Rvcnk6XCIsIHRoZURpcmVjdG9yeUVudHJ5LCBcInJlY3Vyc2l2ZWx5XCIsXG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZWx5XG4gICAgICAgICAgICAgICAgICAgXS5qb2luKCBcIiBcIiApICk7XG4gICAgfVxuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICB0cnkge1xuICAgICAgaWYgKCAhcmVjdXJzaXZlbHkgKSB7XG4gICAgICAgIHRoZURpcmVjdG9yeUVudHJ5LnJlbW92ZSggZnVuY3Rpb24gc3VjY2VzcygpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIGZhaWx1cmUoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICAgIH0gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoZURpcmVjdG9yeUVudHJ5LnJlbW92ZVJlY3Vyc2l2ZWx5KCBmdW5jdGlvbiBzdWNjZXNzKCkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gZmFpbHVyZSggYW5FcnJvciApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgfSApO1xuICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoIGFuRXJyb3IgKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVhZHMgdGhlIGNvbnRlbnRzIG9mIGEgZGlyZWN0b3J5XG4gICAqIEBtZXRob2QgX3JlYWREaXJlY3RvcnlDb250ZW50c1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtEaXJlY3RvcnlFbnRyeX0gdGhlRGlyZWN0b3J5RW50cnkgVGhlIGRpcmVjdG9yeSB0byBsaXN0XG4gICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICAgICAgIFRoZSBwcm9taXNlXG4gICAqL1xuICBmdW5jdGlvbiBfcmVhZERpcmVjdG9yeUNvbnRlbnRzKCB0aGVEaXJlY3RvcnlFbnRyeSApIHtcbiAgICBpZiAoIERFQlVHICkge1xuICAgICAgY29uc29sZS5sb2coIFtcIl9yZWFkRGlyZWN0b3J5Q29udGVudHM6XCIsIHRoZURpcmVjdG9yeUVudHJ5XS5qb2luKCBcIiBcIiApICk7XG4gICAgfVxuICAgIHZhciBkaXJlY3RvcnlSZWFkZXIgPSB0aGVEaXJlY3RvcnlFbnRyeS5jcmVhdGVSZWFkZXIoKSxcbiAgICAgIGVudHJpZXMgPSBbXSxcbiAgICAgIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gICAgZnVuY3Rpb24gcmVhZEVudHJpZXMoKSB7XG4gICAgICBkaXJlY3RvcnlSZWFkZXIucmVhZEVudHJpZXMoIGZ1bmN0aW9uIHN1Y2Nlc3MoIHRoZUVudHJpZXMgKSB7XG4gICAgICAgIGlmICggIXRoZUVudHJpZXMubGVuZ3RoICkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIGVudHJpZXMgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbnRyaWVzID0gZW50cmllcy5jb25jYXQoIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCB0aGVFbnRyaWVzIHx8IFtdLCAwICkgKTtcbiAgICAgICAgICByZWFkRW50cmllcygpO1xuICAgICAgICB9XG4gICAgICB9LCBmdW5jdGlvbiBmYWlsdXJlKCBhbkVycm9yICkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgIH0gKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcmVhZEVudHJpZXMoKTtcbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBjbGFzcyBGaWxlTWFuYWdlclxuICAgKi9cbiAgdmFyIF9jbGFzc05hbWUgPSBcIlVUSUwuRmlsZU1hbmFnZXJcIixcbiAgICBGaWxlTWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmLFxuICAgICAgLy8gZGV0ZXJtaW5lIGlmIHdlIGhhdmUgYSBgQmFzZU9iamVjdGAgYXZhaWxhYmxlIG9yIG5vdFxuICAgICAgICBoYXNCYXNlT2JqZWN0ID0gKCB0eXBlb2YgQmFzZU9iamVjdCAhPT0gXCJ1bmRlZmluZWRcIiApO1xuICAgICAgaWYgKCBoYXNCYXNlT2JqZWN0ICkge1xuICAgICAgICAvLyBpZiB3ZSBkbywgc3ViY2xhc3MgaXRcbiAgICAgICAgc2VsZiA9IG5ldyBCYXNlT2JqZWN0KCk7XG4gICAgICAgIHNlbGYuc3ViY2xhc3MoIF9jbGFzc05hbWUgKTtcbiAgICAgICAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJjaGFuZ2VkQ3VycmVudFdvcmtpbmdEaXJlY3RvcnlcIiApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gb3RoZXJ3aXNlLCBiYXNlIG9mZiB7fVxuICAgICAgICBzZWxmID0ge307XG4gICAgICB9XG4gICAgICAvLyBnZXQgdGhlIHBlcnNpc3RlbnQgYW5kIHRlbXBvcmFyeSBmaWxlc3lzdGVtIGNvbnN0YW50c1xuICAgICAgc2VsZi5QRVJTSVNURU5UID0gKCB0eXBlb2YgTG9jYWxGaWxlU3lzdGVtICE9PSBcInVuZGVmaW5lZFwiICkgPyBMb2NhbEZpbGVTeXN0ZW0uUEVSU0lTVEVOVCA6IHdpbmRvdy5QRVJTSVNURU5UO1xuICAgICAgc2VsZi5URU1QT1JBUlkgPSAoIHR5cGVvZiBMb2NhbEZpbGVTeXN0ZW0gIT09IFwidW5kZWZpbmVkXCIgKSA/IExvY2FsRmlsZVN5c3RlbS5URU1QT1JBUlkgOiB3aW5kb3cuVEVNUE9SQVJZO1xuICAgICAgLy8gZGV0ZXJtaW5lIHRoZSB2YXJpb3VzIGZpbGUgdHlwZXMgd2Ugc3VwcG9ydFxuICAgICAgc2VsZi5GSUxFVFlQRSA9IHtcbiAgICAgICAgVEVYVDogICAgICAgICBcIlRleHRcIixcbiAgICAgICAgREFUQV9VUkw6ICAgICBcIkRhdGFVUkxcIixcbiAgICAgICAgQklOQVJZOiAgICAgICBcIkJpbmFyeVN0cmluZ1wiLFxuICAgICAgICBBUlJBWV9CVUZGRVI6IFwiQXJyYXlCdWZmZXJcIlxuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIGdsb2JhbCBgREVCVUdgIHZhcmlhYmxlLlxuICAgICAgICogQG1ldGhvZCBnZXRHbG9iYWxEZWJ1Z1xuICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICAgKi9cbiAgICAgIHNlbGYuZ2V0R2xvYmFsRGVidWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBERUJVRztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFNldHMgdGhlIGdsb2JhbCBERUJVRyB2YXJpYWJsZS4gSWYgYHRydWVgLCBkZWJ1ZyBtZXNzYWdlcyBhcmUgbG9nZ2VkIHRvIHRoZSBjb25zb2xlLlxuICAgICAgICogQG1ldGhvZCBzZXRHbG9iYWxEZWJ1Z1xuICAgICAgICogQHBhcmFtIHtCb29sZWFufSBkZWJ1Z1xuICAgICAgICovXG4gICAgICBzZWxmLnNldEdsb2JhbERlYnVnID0gZnVuY3Rpb24gKCBkZWJ1ZyApIHtcbiAgICAgICAgREVCVUcgPSBkZWJ1ZztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEBwcm9wZXJ0eSBnbG9iYWxEZWJ1Z1xuICAgICAgICogQHR5cGUge0Jvb2xlYW59IElmIGB0cnVlYCwgbG9ncyBtZXNzYWdlcyB0byBjb25zb2xlIGFzIG9wZXJhdGlvbnMgb2NjdXIuXG4gICAgICAgKi9cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZiwgXCJnbG9iYWxEZWJ1Z1wiLCB7XG4gICAgICAgIGdldDogICAgICAgICAgc2VsZi5nZXRHbG9iYWxEZWJ1ZyxcbiAgICAgICAgc2V0OiAgICAgICAgICBzZWxmLnNldEdsb2JhbERlYnVnLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0gKTtcbiAgICAgIC8qKlxuICAgICAgICogdGhlIGZpbGVTeXN0ZW1UeXBlIGNhbiBlaXRoZXIgYmUgYHNlbGYuUEVSU0lTVEVOVGAgb3IgYHNlbGYuVEVNUE9SQVJZYCwgYW5kIGlzIG9ubHlcbiAgICAgICAqIHNldCBkdXJpbmcgYW4gYGluaXRgIG9wZXJhdGlvbi4gSXQgY2Fubm90IGJlIHNldCBhdCBhbnkgb3RoZXIgdGltZS5cbiAgICAgICAqIEBwcm9wZXJ0eSBmaWxlU3lzdGVtVHlwZVxuICAgICAgICogQHR5cGUge0ZpbGVTeXN0ZW19XG4gICAgICAgKi9cbiAgICAgIHNlbGYuX2ZpbGVTeXN0ZW1UeXBlID0gbnVsbDsgLy8gY2FuIG9ubHkgYmUgY2hhbmdlZCBkdXJpbmcgSU5JVFxuICAgICAgc2VsZi5nZXRGaWxlU3lzdGVtVHlwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2ZpbGVTeXN0ZW1UeXBlO1xuICAgICAgfTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZiwgXCJmaWxlU3lzdGVtVHlwZVwiLCB7XG4gICAgICAgIGdldDogICAgICAgICAgc2VsZi5nZXRGaWxlU3lzdGVtVHlwZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9ICk7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSByZXF1ZXN0ZWQgcXVvdGEgLS0gc3RvcmVkIGZvciBmdXR1cmUgcmVmZXJlbmNlLCBzaW5jZSB3ZSBhc2sgZm9yIGl0XG4gICAgICAgKiBzcGVjaWZpY2FsbHkgZHVyaW5nIGFuIGBpbml0YCBvcGVyYXRpb24uIEl0IGNhbm5vdCBiZSBjaGFuZ2VkLlxuICAgICAgICogQHByb3BlcnR5IHJlcXVlc3RlZFF1b3RhXG4gICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICovXG4gICAgICBzZWxmLl9yZXF1ZXN0ZWRRdW90YSA9IDA7IC8vIGNhbiBvbmx5IGJlIGNoYW5nZWQgZHVyaW5nIElOSVRcbiAgICAgIHNlbGYuZ2V0UmVxdWVzdGVkUXVvdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzZWxmLl9yZXF1ZXN0ZWRRdW90YTtcbiAgICAgIH07XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIHNlbGYsIFwicmVxdWVzdGVkUXVvdGFcIiwge1xuICAgICAgICBnZXQ6ICAgICAgICAgIHNlbGYuZ2V0UmVxdWVzdGVkUXVvdGEsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSApO1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgYWN0dWFsIHF1b3RhIG9idGFpbmVkIGZyb20gdGhlIHN5c3RlbS4gSXQgY2Fubm90IGJlIGNoYW5nZWQsIGFuZCBpc1xuICAgICAgICogb25seSBvYnRhaW5lZCBkdXJpbmcgYGluaXRgLiBUaGUgcmVzdWx0IGRvZXMgbm90IGhhdmUgdG8gbWF0Y2ggdGhlXG4gICAgICAgKiBgcmVxdWVzdGVkUXVvdGFgLiBJZiBpdCBkb2Vzbid0IG1hdGNoLCBpdCBtYXkgYmUgcmVwcmVzZW50YXRpdmUgb2YgdGhlXG4gICAgICAgKiBhY3R1YWwgc3BhY2UgYXZhaWxhYmxlLCBkZXBlbmRpbmcgb24gdGhlIHBsYXRmb3JtXG4gICAgICAgKiBAcHJvcGVydHkgYWN0dWFsUXVvdGFcbiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgKi9cbiAgICAgIHNlbGYuX2FjdHVhbFF1b3RhID0gMDtcbiAgICAgIHNlbGYuZ2V0QWN0dWFsUXVvdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzZWxmLl9hY3R1YWxRdW90YTtcbiAgICAgIH07XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIHNlbGYsIFwiYWN0dWFsUXVvdGFcIiwge1xuICAgICAgICBnZXQ6ICAgICAgICAgIHNlbGYuZ2V0QWN0dWFsUXVvdGEsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSApO1xuICAgICAgLyoqXG4gICAgICAgKiBAdHlwZWRlZiB7e319IEZpbGVTeXN0ZW1cbiAgICAgICAqIEhUTUw1IEZpbGUgQVBJIEZpbGUgU3lzdGVtXG4gICAgICAgKi9cbiAgICAgIC8qKlxuICAgICAgICogVGhlIGN1cnJlbnQgZmlsZXN5c3RlbSAtLSBlaXRoZXIgdGhlIHRlbXBvcmFyeSBvciBwZXJzaXN0ZW50IG9uZTsgaXQgY2FuJ3QgYmUgY2hhbmdlZFxuICAgICAgICogQHByb3BlcnR5IGZpbGVTeXN0ZW1cbiAgICAgICAqIEB0eXBlIHtGaWxlU3lzdGVtfVxuICAgICAgICovXG4gICAgICBzZWxmLl9maWxlU3lzdGVtID0gbnVsbDtcbiAgICAgIHNlbGYuZ2V0RmlsZVN5c3RlbSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2ZpbGVTeXN0ZW07XG4gICAgICB9O1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLCBcImZpbGVTeXN0ZW1cIiwge1xuICAgICAgICBnZXQ6ICAgICAgICAgIHNlbGYuZ2V0RmlsZVN5c3RlbSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9ICk7XG4gICAgICAvKipcbiAgICAgICAqIEN1cnJlbnQgV29ya2luZyBEaXJlY3RvcnkgRW50cnlcbiAgICAgICAqIEBwcm9wZXJ0eSBjd2RcbiAgICAgICAqIEB0eXBlIHtEaXJlY3RvcnlFbnRyeX1cbiAgICAgICAqL1xuICAgICAgc2VsZi5fcm9vdCA9IG51bGw7XG4gICAgICBzZWxmLl9jd2QgPSBudWxsO1xuICAgICAgc2VsZi5nZXRDdXJyZW50V29ya2luZ0RpcmVjdG9yeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2N3ZDtcbiAgICAgIH07XG4gICAgICBzZWxmLnNldEN1cnJlbnRXb3JraW5nRGlyZWN0b3J5ID0gZnVuY3Rpb24gKCB0aGVDV0QgKSB7XG4gICAgICAgIHNlbGYuX2N3ZCA9IHRoZUNXRDtcbiAgICAgICAgaWYgKCBoYXNCYXNlT2JqZWN0ICkge1xuICAgICAgICAgIHNlbGYubm90aWZ5KCBcImNoYW5nZWRDdXJyZW50V29ya2luZ0RpcmVjdG9yeVwiICk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIHNlbGYsIFwiY3dkXCIsIHtcbiAgICAgICAgZ2V0OiAgICAgICAgICBzZWxmLmdldEN1cnJlbnRXb3JraW5nRGlyZWN0b3J5LFxuICAgICAgICBzZXQ6ICAgICAgICAgIHNlbGYuc2V0Q3VycmVudFdvcmtpbmdEaXJlY3RvcnksXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSApO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLCBcImN1cnJlbnRXb3JraW5nRGlyZWN0b3J5XCIsIHtcbiAgICAgICAgZ2V0OiAgICAgICAgICBzZWxmLmdldEN1cnJlbnRXb3JraW5nRGlyZWN0b3J5LFxuICAgICAgICBzZXQ6ICAgICAgICAgIHNlbGYuc2V0Q3VycmVudFdvcmtpbmdEaXJlY3RvcnksXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSApO1xuICAgICAgLyoqXG4gICAgICAgKiBDdXJyZW50IFdvcmtpbmcgRGlyZWN0b3J5IHN0YWNrXG4gICAgICAgKiBAcHJvcGVydHkgX2N3ZHNcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgKi9cbiAgICAgIHNlbGYuX2N3ZHMgPSBbXTtcbiAgICAgIC8qKlxuICAgICAgICogUHVzaCB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeSBvbiB0byB0aGUgc3RhY2tcbiAgICAgICAqIEBtZXRob2QgcHVzaEN1cnJlbnRXb3JraW5nRGlyZWN0b3J5XG4gICAgICAgKi9cbiAgICAgIHNlbGYucHVzaEN1cnJlbnRXb3JraW5nRGlyZWN0b3J5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLl9jd2RzLnB1c2goIHNlbGYuX2N3ZCApO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUG9wIHRoZSB0b3Btb3N0IGRpcmVjdG9yeSBvbiB0aGUgc3RhY2sgYW5kIGNoYW5nZSB0byBpdFxuICAgICAgICogQG1ldGhvZCBwb3BDdXJyZW50V29ya2luZ0RpcmVjdG9yeVxuICAgICAgICovXG4gICAgICBzZWxmLnBvcEN1cnJlbnRXb3JraW5nRGlyZWN0b3J5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnNldEN1cnJlbnRXb3JraW5nRGlyZWN0b3J5KCBzZWxmLl9jd2RzLnBvcCgpICk7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBSZXNvbHZlcyBhIFVSTCB0byBhIGxvY2FsIGZpbGUgc3lzdGVtLiBJZiB0aGUgVVJMIHNjaGVtZSBpcyBub3QgcHJlc2VudCwgYGZpbGVgXG4gICAgICAgKiBpcyBhc3N1bWVkLlxuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRoZVVSSSBUaGUgVVJJIHRvIHJlc29sdmVcbiAgICAgICAqL1xuICAgICAgc2VsZi5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMID0gZnVuY3Rpb24gKCB0aGVVUkkgKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgX3Jlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoIHRoZVVSSSApLnRoZW4oIGZ1bmN0aW9uIGdvdEVudHJ5KCB0aGVFbnRyeSApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVFbnRyeSApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHRoZSBmaWxlIGVudHJ5IGZvciB0aGUgZ2l2ZW4gcGF0aCAodXNlZnVsIGZvclxuICAgICAgICogZ2V0dGluZyB0aGUgZnVsbCBwYXRoIG9mIGEgZmlsZSkuIGBvcHRpb25zYCBpcyBvZiB0aGVcbiAgICAgICAqIGZvcm0gYHtjcmVhdGU6IHRydWUvZmFsc2UsIGV4Y2x1c2l2ZTogdHJ1ZS9mYWxzZX1gXG4gICAgICAgKiBAbWV0aG9kIGdldEZpbGVFbnRyeVxuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRoZUZpbGVQYXRoIFRoZSBmaWxlIHBhdGggb3IgRmlsZUVudHJ5IG9iamVjdFxuICAgICAgICogQHBhcmFtIHsqfSBvcHRpb25zIGNyZWF0aW9uIG9wdGlvbnNcbiAgICAgICAqL1xuICAgICAgc2VsZi5nZXRGaWxlRW50cnkgPSBmdW5jdGlvbiAoIHRoZUZpbGVQYXRoLCBvcHRpb25zICkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICAgIF9nZXRGaWxlRW50cnkoIHNlbGYuX2N3ZCwgdGhlRmlsZVBhdGgsIG9wdGlvbnMgKS50aGVuKCBmdW5jdGlvbiBnb3RGaWxlRW50cnkoIHRoZUZpbGVFbnRyeSApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVGaWxlRW50cnkgKTtcbiAgICAgICAgfSApLlxuICAgICAgICAgIGNhdGNoKCBmdW5jdGlvbiAoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICAgICAgICAgICAgIH0gKS5kb25lKCk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyB0aGUgZmlsZSBvYmplY3QgZm9yIGEgZ2l2ZW4gZmlsZSAodXNlZnVsIGZvciBnZXR0aW5nXG4gICAgICAgKiB0aGUgc2l6ZSBvZiBhIGZpbGUpOyBgb3B0aW9uYCBpcyBvZiB0aGUgZm9ybSBge2NyZWF0ZTogdHJ1ZS9mYWxzZSwgZXhjbHVzaXZlOiB0cnVlL2ZhbHNlfWBcbiAgICAgICAqIEBtZXRob2QgZ2V0RmlsZVxuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRoZUZpbGVQYXRoXG4gICAgICAgKiBAcGFyYW0geyp9IG9wdGlvblxuICAgICAgICovXG4gICAgICBzZWxmLmdldEZpbGUgPSBmdW5jdGlvbiAoIHRoZUZpbGVQYXRoLCBvcHRpb25zICkge1xuICAgICAgICByZXR1cm4gc2VsZi5nZXRGaWxlRW50cnkoIHRoZUZpbGVQYXRoLCBvcHRpb25zICkudGhlbiggX2dldEZpbGVPYmplY3QgKTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdGhlIGRpcmVjdG9yeSBlbnRyeSBmb3IgYSBnaXZlbiBwYXRoXG4gICAgICAgKiBAbWV0aG9kIGdldERpcmVjdG9yeUVudHJ5XG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlRGlyZWN0b3J5UGF0aFxuICAgICAgICogQHBhcmFtIHsqfSBvcHRpb25zXG4gICAgICAgKi9cbiAgICAgIHNlbGYuZ2V0RGlyZWN0b3J5RW50cnkgPSBmdW5jdGlvbiAoIHRoZURpcmVjdG9yeVBhdGgsIG9wdGlvbnMgKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgX2dldERpcmVjdG9yeUVudHJ5KCBzZWxmLl9jd2QsIHRoZURpcmVjdG9yeVBhdGgsIG9wdGlvbnMgKS50aGVuKCBmdW5jdGlvbiBnb3REaXJlY3RvcnlFbnRyeSggdGhlRGlyZWN0b3J5RW50cnkgKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlRGlyZWN0b3J5RW50cnkgKTtcbiAgICAgICAgfSApLlxuICAgICAgICAgIGNhdGNoKCBmdW5jdGlvbiAoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICAgICAgICAgICAgIH0gKS5kb25lKCk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogcmV0dXJucyB0aGUgVVJMIGZvciBhIGdpdmVuIGZpbGVcbiAgICAgICAqIEBtZXRob2QgZ2V0RmlsZVVSTFxuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRoZUZpbGVQYXRoXG4gICAgICAgKiBAcGFyYW0geyp9IG9wdGlvbnNcbiAgICAgICAqL1xuICAgICAgc2VsZi5nZXRGaWxlVVJMID0gZnVuY3Rpb24gKCB0aGVGaWxlUGF0aCwgb3B0aW9ucyApIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICBfZ2V0RmlsZUVudHJ5KCBzZWxmLl9jd2QsIHRoZUZpbGVQYXRoLCBvcHRpb25zICkudGhlbiggZnVuY3Rpb24gZ290RmlsZUVudHJ5KCB0aGVGaWxlRW50cnkgKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlRmlsZUVudHJ5LnRvVVJMKCkgKTtcbiAgICAgICAgfSApLlxuICAgICAgICAgIGNhdGNoKCBmdW5jdGlvbiAoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICAgICAgICAgICAgIH0gKS5kb25lKCk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyBhIFVSTCBmb3IgdGhlIGdpdmVuIGRpcmVjdG9yeVxuICAgICAgICogQG1ldGhvZCBnZXREaXJlY3RvcnlVUkxcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aGVQYXRoXG4gICAgICAgKiBAcGFyYW0geyp9IG9wdGlvbnNcbiAgICAgICAqL1xuICAgICAgc2VsZi5nZXREaXJlY3RvcnlVUkwgPSBmdW5jdGlvbiAoIHRoZVBhdGgsIG9wdGlvbnMgKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgX2dldERpcmVjdG9yeUVudHJ5KCBzZWxmLl9jd2QsIHRoZVBhdGggfHwgXCIuXCIsIG9wdGlvbnMgKS50aGVuKCBmdW5jdGlvbiBnb3REaXJlY3RvcnlFbnRyeSggdGhlRGlyZWN0b3J5RW50cnkgKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlRGlyZWN0b3J5RW50cnkudG9VUkwoKSApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHRoZSBuYXRpdmUgVVJMIGZvciBhbiBlbnRyeSBieSBjb21iaW5pbmcgdGhlIGBmdWxsUGF0aGAgb2YgdGhlIGVudHJ5XG4gICAgICAgKiB3aXRoIHRoZSBgbmF0aXZlVVJMYCBvZiB0aGUgYHJvb3RgIGRpcmVjdG9yeSBpZiBhYnNvbHV0ZSBvciBvZiB0aGUgYGN1cnJlbnRgXG4gICAgICAgKiBkaXJlY3RvcnkgaWYgbm90IGFic29sdXRlLlxuICAgICAgICogQG1ldGhvZCBnZXROYXRpdmVVUkxcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aGVFbnRyeSBQYXRoIG9mIHRoZSBmaWxlIG9yIGRpcmVjdG9yeTsgY2FuIGFsc28gYmUgYSBGaWxlL0RpcmVjdG9yeUVudHJ5XG4gICAgICAgKi9cbiAgICAgIHNlbGYuZ2V0TmF0aXZlVVJMID0gZnVuY3Rpb24gKCB0aGVFbnRyeSApIHtcbiAgICAgICAgdmFyIHRoZVBhdGggPSB0aGVFbnRyeTtcbiAgICAgICAgaWYgKCB0eXBlb2YgdGhlRW50cnkgIT09IFwic3RyaW5nXCIgKSB7XG4gICAgICAgICAgdGhlUGF0aCA9IHRoZUVudHJ5LmZ1bGxQYXRoKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlzQWJzb2x1dGUgPSAoIHRoZVBhdGguc3Vic3RyKCAwLCAxICkgPT09IFwiL1wiICksXG4gICAgICAgICAgdGhlUm9vdFBhdGggPSBpc0Fic29sdXRlID8gc2VsZi5fcm9vdC5uYXRpdmVVUkwgOiBzZWxmLmN3ZC5uYXRpdmVVUkw7XG4gICAgICAgIHJldHVybiB0aGVSb290UGF0aCArICggaXNBYnNvbHV0ZSA/IFwiXCIgOiBcIi9cIiApICsgdGhlUGF0aDtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIHJldHVybnMgdGhlIG5hdGl2ZSBmaWxlIHBhdGggZm9yIGEgZ2l2ZW4gZmlsZVxuICAgICAgICogQG1ldGhvZCBnZXROYXRpdmVGaWxlVVJMXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlRmlsZVBhdGhcbiAgICAgICAqIEBwYXJhbSB7Kn0gb3B0aW9uc1xuICAgICAgICovXG4gICAgICBzZWxmLmdldE5hdGl2ZUZpbGVVUkwgPSBmdW5jdGlvbiAoIHRoZUZpbGVQYXRoLCBvcHRpb25zICkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICAgIF9nZXRGaWxlRW50cnkoIHNlbGYuX2N3ZCwgdGhlRmlsZVBhdGgsIG9wdGlvbnMgKS50aGVuKCBmdW5jdGlvbiBnb3RGaWxlRW50cnkoIHRoZUZpbGVFbnRyeSApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVGaWxlRW50cnkubmF0aXZlVVJMICk7XG4gICAgICAgIH0gKS5cbiAgICAgICAgICBjYXRjaCggZnVuY3Rpb24gKCBhbkVycm9yICkge1xuICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgICAgICAgICAgICB9ICkuZG9uZSgpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgYSBVUkwgZm9yIHRoZSBnaXZlbiBkaXJlY3RvcnlcbiAgICAgICAqIEBtZXRob2QgZ2V0TmF0aXZlRGlyZWN0b3J5VVJMXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlUGF0aFxuICAgICAgICogQHBhcmFtIHsqfSBvcHRpb25zXG4gICAgICAgKi9cbiAgICAgIHNlbGYuZ2V0TmF0aXZlRGlyZWN0b3J5VVJMID0gZnVuY3Rpb24gKCB0aGVQYXRoLCBvcHRpb25zICkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICAgIF9nZXREaXJlY3RvcnlFbnRyeSggc2VsZi5fY3dkLCB0aGVQYXRoIHx8IFwiLlwiLCBvcHRpb25zICkudGhlbiggZnVuY3Rpb24gZ290RGlyZWN0b3J5RW50cnkoIHRoZURpcmVjdG9yeUVudHJ5ICkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHRoZURpcmVjdG9yeUVudHJ5Lm5hdGl2ZVVSTCApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBDaGFuZ2UgdG8gYW4gYXJiaXRyYXJ5IGRpcmVjdG9yeVxuICAgICAgICogQG1ldGhvZCBjaGFuZ2VEaXJlY3RvcnlcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdGhlTmV3UGF0aCBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5LCByZWxhdGl2ZSB0byBjd2RcbiAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgVGhlIFByb21pc2VcbiAgICAgICAqL1xuICAgICAgc2VsZi5jaGFuZ2VEaXJlY3RvcnkgPSBmdW5jdGlvbiAoIHRoZU5ld1BhdGggKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgX2dldERpcmVjdG9yeUVudHJ5KCBzZWxmLl9jd2QsIHRoZU5ld1BhdGgsIHt9ICkudGhlbiggZnVuY3Rpb24gZ290RGlyZWN0b3J5KCB0aGVOZXdEaXJlY3RvcnkgKSB7XG4gICAgICAgICAgc2VsZi5jd2QgPSB0aGVOZXdEaXJlY3Rvcnk7XG4gICAgICAgIH0gKS50aGVuKCBmdW5jdGlvbiBhbGxEb25lKCkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHNlbGYgKTtcbiAgICAgICAgfSApLlxuICAgICAgICAgIGNhdGNoKCBmdW5jdGlvbiAoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICAgICAgICAgICAgIH0gKS5kb25lKCk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUmVhZCBhbiBhcmJpdHJhcnkgZmlsZSdzIGNvbnRlbnRzLlxuICAgICAgICogQG1ldGhvZCByZWFkRmlsZUNvbnRlbnRzXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRoZUZpbGVQYXRoIFRoZSBwYXRoIHRvIHRoZSBmaWxlLCByZWxhdGl2ZSB0byBjd2RcbiAgICAgICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyAgICAgVGhlIG9wdGlvbnMgdG8gdXNlIHdoZW4gb3BlbmluZyB0aGUgZmlsZSAoc3VjaCBhcyBjcmVhdGluZyBpdClcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gcmVhZEFzS2luZCAgSG93IHRvIHJlYWQgdGhlIGZpbGUgLS0gYmVzdCB0byB1c2Ugc2VsZi5GSUxFVFlQRS5URVhULCBldGMuXG4gICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgICAgICovXG4gICAgICBzZWxmLnJlYWRGaWxlQ29udGVudHMgPSBmdW5jdGlvbiAoIHRoZUZpbGVQYXRoLCBvcHRpb25zLCByZWFkQXNLaW5kICkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICAgIF9nZXRGaWxlRW50cnkoIHNlbGYuX2N3ZCwgdGhlRmlsZVBhdGgsIG9wdGlvbnMgfHwge30gKS50aGVuKCBmdW5jdGlvbiBnb3RUaGVGaWxlRW50cnkoIHRoZUZpbGVFbnRyeSApIHtcbiAgICAgICAgICByZXR1cm4gX2dldEZpbGVPYmplY3QoIHRoZUZpbGVFbnRyeSApO1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gZ290VGhlRmlsZU9iamVjdCggdGhlRmlsZU9iamVjdCApIHtcbiAgICAgICAgICByZXR1cm4gX3JlYWRGaWxlQ29udGVudHMoIHRoZUZpbGVPYmplY3QsIHJlYWRBc0tpbmQgfHwgXCJUZXh0XCIgKTtcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGdldFRoZUZpbGVDb250ZW50cyggdGhlRmlsZUNvbnRlbnRzICkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHRoZUZpbGVDb250ZW50cyApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBSZWFkIGFuIGFyYml0cmFyeSBkaXJlY3RvcnkncyBlbnRyaWVzLlxuICAgICAgICogQG1ldGhvZCByZWFkRGlyZWN0b3J5Q29udGVudHNcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdGhlRGlyZWN0b3J5UGF0aCBUaGUgcGF0aCB0byB0aGUgZGlyZWN0b3J5LCByZWxhdGl2ZSB0byBjd2Q7IFwiLlwiIGlmIG5vdCBzcGVjaWZpZWRcbiAgICAgICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyAgICAgICAgICBUaGUgb3B0aW9ucyB0byB1c2Ugd2hlbiBvcGVuaW5nIHRoZSBkaXJlY3RvcnkgKHN1Y2ggYXMgY3JlYXRpbmcgaXQpXG4gICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgICAgICovXG4gICAgICBzZWxmLnJlYWREaXJlY3RvcnlDb250ZW50cyA9IGZ1bmN0aW9uICggdGhlRGlyZWN0b3J5UGF0aCwgb3B0aW9ucyApIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICBfZ2V0RGlyZWN0b3J5RW50cnkoIHNlbGYuX2N3ZCwgdGhlRGlyZWN0b3J5UGF0aCB8fCBcIi5cIiwgb3B0aW9ucyB8fCB7fSApLnRoZW4oIGZ1bmN0aW9uIGdvdFRoZURpcmVjdG9yeUVudHJ5KCB0aGVEaXJlY3RvcnlFbnRyeSApIHtcbiAgICAgICAgICByZXR1cm4gX3JlYWREaXJlY3RvcnlDb250ZW50cyggdGhlRGlyZWN0b3J5RW50cnkgKTtcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGdvdFRoZURpcmVjdG9yeUVudHJpZXMoIHRoZUVudHJpZXMgKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlRW50cmllcyApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBXcml0ZSBkYXRhIHRvIGFuIGFyYml0cmFyeSBmaWxlXG4gICAgICAgKiBAbWV0aG9kIHdyaXRlRmlsZUNvbnRlbnRzXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRoZUZpbGVQYXRoIFRoZSBmaWxlIG5hbWUgdG8gd3JpdGUgdG8sIHJlbGF0aXZlIHRvIGN3ZFxuICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zICAgICBUaGUgb3B0aW9ucyB0byB1c2Ugd2hlbiBvcGVuaW5nIHRoZSBmaWxlXG4gICAgICAgKiBAcGFyYW0gIHsqfSB0aGVEYXRhICAgICBUaGUgZGF0YSB0byB3cml0ZVxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgVGhlIFByb21pc2VcbiAgICAgICAqL1xuICAgICAgc2VsZi53cml0ZUZpbGVDb250ZW50cyA9IGZ1bmN0aW9uICggdGhlRmlsZVBhdGgsIG9wdGlvbnMsIHRoZURhdGEgKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgX2dldEZpbGVFbnRyeSggc2VsZi5fY3dkLCB0aGVGaWxlUGF0aCwgb3B0aW9ucyB8fCB7XG4gICAgICAgICAgY3JlYXRlOiAgICB0cnVlLFxuICAgICAgICAgIGV4Y2x1c2l2ZTogZmFsc2VcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGdvdFRoZUZpbGVFbnRyeSggdGhlRmlsZUVudHJ5ICkge1xuICAgICAgICAgIHJldHVybiBfY3JlYXRlRmlsZVdyaXRlciggdGhlRmlsZUVudHJ5ICk7XG4gICAgICAgIH0gKS50aGVuKCBmdW5jdGlvbiBnb3RUaGVGaWxlV3JpdGVyKCB0aGVGaWxlV3JpdGVyICkge1xuICAgICAgICAgIHJldHVybiBfd3JpdGVGaWxlQ29udGVudHMoIHRoZUZpbGVXcml0ZXIsIHRoZURhdGEgKTtcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGFsbERvbmUoKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggc2VsZiApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGFuIGFyYml0cmFyeSBkaXJlY3RvcnlcbiAgICAgICAqIEBtZXRob2QgY3JlYXRlRGlyZWN0b3J5XG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRoZURpcmVjdG9yeVBhdGggVGhlIHBhdGgsIHJlbGF0aXZlIHRvIGN3ZFxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgICAgICovXG4gICAgICBzZWxmLmNyZWF0ZURpcmVjdG9yeSA9IGZ1bmN0aW9uICggdGhlRGlyZWN0b3J5UGF0aCApIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICBfZ2V0RGlyZWN0b3J5RW50cnkoIHNlbGYuX2N3ZCwgdGhlRGlyZWN0b3J5UGF0aCwge1xuICAgICAgICAgIGNyZWF0ZTogICAgdHJ1ZSxcbiAgICAgICAgICBleGNsdXNpdmU6IGZhbHNlXG4gICAgICAgIH0gKS50aGVuKCBmdW5jdGlvbiBnb3REaXJlY3RvcnkoIHRoZU5ld0RpcmVjdG9yeSApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVOZXdEaXJlY3RvcnkgKTtcbiAgICAgICAgfSApLlxuICAgICAgICAgIGNhdGNoKCBmdW5jdGlvbiAoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICAgICAgICAgICAgIH0gKS5kb25lKCk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQ29waWVzIGEgZmlsZSB0byBhIG5ldyBkaXJlY3RvcnksIHdpdGggYW4gb3B0aW9uYWwgbmV3IG5hbWVcbiAgICAgICAqIEBtZXRob2QgY29weUZpbGVcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gc291cmNlRmlsZVBhdGggICAgICBQYXRoIHRvIGZpbGUsIHJlbGF0aXZlIHRvIGN3ZFxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSB0YXJnZXREaXJlY3RvcnlQYXRoIFBhdGggdG8gbmV3IGRpcmVjdG9yeSwgcmVsYXRpdmUgdG8gY3dkXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHdpdGhOZXdOYW1lICAgICAgICAgTmV3IG5hbWUsIGlmIGRlc2lyZWRcbiAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICAgICAgICAgVGhlIFByb21pc2VcbiAgICAgICAqL1xuICAgICAgc2VsZi5jb3B5RmlsZSA9IGZ1bmN0aW9uICggc291cmNlRmlsZVBhdGgsIHRhcmdldERpcmVjdG9yeVBhdGgsIHdpdGhOZXdOYW1lICkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCksXG4gICAgICAgICAgdGhlRmlsZVRvQ29weTtcbiAgICAgICAgX2dldEZpbGVFbnRyeSggc2VsZi5fY3dkLCBzb3VyY2VGaWxlUGF0aCwge30gKS50aGVuKCBmdW5jdGlvbiBnb3RGaWxlRW50cnkoIGFGaWxlVG9Db3B5ICkge1xuICAgICAgICAgIHRoZUZpbGVUb0NvcHkgPSBhRmlsZVRvQ29weTtcbiAgICAgICAgICByZXR1cm4gX2dldERpcmVjdG9yeUVudHJ5KCBzZWxmLl9jd2QsIHRhcmdldERpcmVjdG9yeVBhdGgsIHt9ICk7XG4gICAgICAgIH0gKS50aGVuKCBmdW5jdGlvbiBnb3REaXJlY3RvcnlFbnRyeSggdGhlVGFyZ2V0RGlyZWN0b3J5ICkge1xuICAgICAgICAgIHJldHVybiBfY29weUZpbGUoIHRoZUZpbGVUb0NvcHksIHRoZVRhcmdldERpcmVjdG9yeSwgd2l0aE5ld05hbWUgKTtcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGFsbERvbmUoIHRoZU5ld0ZpbGVFbnRyeSApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVOZXdGaWxlRW50cnkgKTtcbiAgICAgICAgfSApLlxuICAgICAgICAgIGNhdGNoKCBmdW5jdGlvbiAoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICAgICAgICAgICAgIH0gKS5kb25lKCk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQ29waWVzIGEgZGlyZWN0b3J5IHRvIGEgbmV3IGRpcmVjdG9yeSwgd2l0aCBhbiBvcHRpb25hbCBuZXcgbmFtZVxuICAgICAgICogQG1ldGhvZCBjb3B5RGlyZWN0b3J5XG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNvdXJjZURpcmVjdG9yeVBhdGggUGF0aCB0byBkaXJlY3RvcnksIHJlbGF0aXZlIHRvIGN3ZFxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSB0YXJnZXREaXJlY3RvcnlQYXRoIFBhdGggdG8gbmV3IGRpcmVjdG9yeSwgcmVsYXRpdmUgdG8gY3dkXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHdpdGhOZXdOYW1lICAgICAgICAgTmV3IG5hbWUsIGlmIGRlc2lyZWRcbiAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICAgICAgICAgVGhlIFByb21pc2VcbiAgICAgICAqL1xuICAgICAgc2VsZi5jb3B5RGlyZWN0b3J5ID0gZnVuY3Rpb24gKCBzb3VyY2VEaXJlY3RvcnlQYXRoLCB0YXJnZXREaXJlY3RvcnlQYXRoLCB3aXRoTmV3TmFtZSApIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpLFxuICAgICAgICAgIHRoZURpcmVjdG9yeVRvQ29weTtcbiAgICAgICAgX2dldERpcmVjdG9yeUVudHJ5KCBzZWxmLl9jd2QsIHNvdXJjZURpcmVjdG9yeVBhdGgsIHt9ICkudGhlbiggZnVuY3Rpb24gZ290U291cmNlRGlyZWN0b3J5RW50cnkoIHNvdXJjZURpcmVjdG9yeUVudHJ5ICkge1xuICAgICAgICAgIHRoZURpcmVjdG9yeVRvQ29weSA9IHNvdXJjZURpcmVjdG9yeUVudHJ5O1xuICAgICAgICAgIHJldHVybiBfZ2V0RGlyZWN0b3J5RW50cnkoIHNlbGYuX2N3ZCwgdGFyZ2V0RGlyZWN0b3J5UGF0aCwge30gKTtcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGdvdFRhcmdldERpcmVjdG9yeUVudHJ5KCB0aGVUYXJnZXREaXJlY3RvcnkgKSB7XG4gICAgICAgICAgcmV0dXJuIF9jb3B5RGlyZWN0b3J5KCB0aGVEaXJlY3RvcnlUb0NvcHksIHRoZVRhcmdldERpcmVjdG9yeSwgd2l0aE5ld05hbWUgKTtcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGFsbERvbmUoIHRoZU5ld0RpcmVjdG9yeUVudHJ5ICkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHRoZU5ld0RpcmVjdG9yeUVudHJ5ICk7XG4gICAgICAgIH0gKS5cbiAgICAgICAgICBjYXRjaCggZnVuY3Rpb24gKCBhbkVycm9yICkge1xuICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgICAgICAgICAgICB9ICkuZG9uZSgpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEBtZXRob2QgbW92ZUZpbGVcbiAgICAgICAqIE1vdmVzIGEgZmlsZSB0byBhIG5ldyBkaXJlY3RvcnksIHdpdGggYW4gb3B0aW9uYWwgbmV3IG5hbWVcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gc291cmNlRmlsZVBhdGggICAgICBQYXRoIHRvIGZpbGUsIHJlbGF0aXZlIHRvIGN3ZFxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSB0YXJnZXREaXJlY3RvcnlQYXRoIFBhdGggdG8gbmV3IGRpcmVjdG9yeSwgcmVsYXRpdmUgdG8gY3dkXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHdpdGhOZXdOYW1lICAgICAgICAgTmV3IG5hbWUsIGlmIGRlc2lyZWRcbiAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICAgICAgICAgVGhlIFByb21pc2VcbiAgICAgICAqL1xuICAgICAgc2VsZi5tb3ZlRmlsZSA9IGZ1bmN0aW9uICggc291cmNlRmlsZVBhdGgsIHRhcmdldERpcmVjdG9yeVBhdGgsIHdpdGhOZXdOYW1lICkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCksXG4gICAgICAgICAgdGhlRmlsZVRvTW92ZTtcbiAgICAgICAgX2dldEZpbGVFbnRyeSggc2VsZi5fY3dkLCBzb3VyY2VGaWxlUGF0aCwge30gKS50aGVuKCBmdW5jdGlvbiBnb3RGaWxlRW50cnkoIGFGaWxlVG9Nb3ZlICkge1xuICAgICAgICAgIHRoZUZpbGVUb01vdmUgPSBhRmlsZVRvTW92ZTtcbiAgICAgICAgICByZXR1cm4gX2dldERpcmVjdG9yeUVudHJ5KCBzZWxmLl9jd2QsIHRhcmdldERpcmVjdG9yeVBhdGgsIHt9ICk7XG4gICAgICAgIH0gKS50aGVuKCBmdW5jdGlvbiBnb3REaXJlY3RvcnlFbnRyeSggdGhlVGFyZ2V0RGlyZWN0b3J5ICkge1xuICAgICAgICAgIHJldHVybiBfbW92ZUZpbGUoIHRoZUZpbGVUb01vdmUsIHRoZVRhcmdldERpcmVjdG9yeSwgd2l0aE5ld05hbWUgKTtcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGFsbERvbmUoIHRoZU5ld0ZpbGVFbnRyeSApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVOZXdGaWxlRW50cnkgKTtcbiAgICAgICAgfSApLlxuICAgICAgICAgIGNhdGNoKCBmdW5jdGlvbiAoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICAgICAgICAgICAgIH0gKS5kb25lKCk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogTW92ZXMgYSBkaXJlY3RvcnkgdG8gYSBuZXcgZGlyZWN0b3J5LCB3aXRoIGFuIG9wdGlvbmFsIG5ldyBuYW1lXG4gICAgICAgKiBAbWV0aG9kIG1vdmVEaXJlY3RvcnlcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gc291cmNlRGlyZWN0b3J5UGF0aCBQYXRoIHRvIGRpcmVjdG9yeSwgcmVsYXRpdmUgdG8gY3dkXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRhcmdldERpcmVjdG9yeVBhdGggUGF0aCB0byBuZXcgZGlyZWN0b3J5LCByZWxhdGl2ZSB0byBjd2RcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gd2l0aE5ld05hbWUgICAgICAgICBOZXcgbmFtZSwgaWYgZGVzaXJlZFxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgICAgICovXG4gICAgICBzZWxmLm1vdmVEaXJlY3RvcnkgPSBmdW5jdGlvbiAoIHNvdXJjZURpcmVjdG9yeVBhdGgsIHRhcmdldERpcmVjdG9yeVBhdGgsIHdpdGhOZXdOYW1lICkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCksXG4gICAgICAgICAgdGhlRGlyZWN0b3J5VG9Nb3ZlO1xuICAgICAgICBfZ2V0RGlyZWN0b3J5RW50cnkoIHNlbGYuX2N3ZCwgc291cmNlRGlyZWN0b3J5UGF0aCwge30gKS50aGVuKCBmdW5jdGlvbiBnb3RTb3VyY2VEaXJlY3RvcnlFbnRyeSggc291cmNlRGlyZWN0b3J5RW50cnkgKSB7XG4gICAgICAgICAgdGhlRGlyZWN0b3J5VG9Nb3ZlID0gc291cmNlRGlyZWN0b3J5RW50cnk7XG4gICAgICAgICAgcmV0dXJuIF9nZXREaXJlY3RvcnlFbnRyeSggc2VsZi5fY3dkLCB0YXJnZXREaXJlY3RvcnlQYXRoLCB7fSApO1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gZ290VGFyZ2V0RGlyZWN0b3J5RW50cnkoIHRoZVRhcmdldERpcmVjdG9yeSApIHtcbiAgICAgICAgICByZXR1cm4gX21vdmVEaXJlY3RvcnkoIHRoZURpcmVjdG9yeVRvTW92ZSwgdGhlVGFyZ2V0RGlyZWN0b3J5LCB3aXRoTmV3TmFtZSApO1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gYWxsRG9uZSggdGhlTmV3RGlyZWN0b3J5RW50cnkgKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlTmV3RGlyZWN0b3J5RW50cnkgKTtcbiAgICAgICAgfSApLlxuICAgICAgICAgIGNhdGNoKCBmdW5jdGlvbiAoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICAgICAgICAgICAgIH0gKS5kb25lKCk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUmVuYW1lcyBhIGZpbGUgdG8gYSBuZXcgbmFtZSwgaW4gdGhlIGN3ZFxuICAgICAgICogQG1ldGhvZCByZW5hbWVGaWxlXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNvdXJjZUZpbGVQYXRoICAgICAgUGF0aCB0byBmaWxlLCByZWxhdGl2ZSB0byBjd2RcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gd2l0aE5ld05hbWUgICAgICAgICBOZXcgbmFtZVxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgICAgICovXG4gICAgICBzZWxmLnJlbmFtZUZpbGUgPSBmdW5jdGlvbiAoIHNvdXJjZUZpbGVQYXRoLCB3aXRoTmV3TmFtZSApIHtcbiAgICAgICAgcmV0dXJuIHNlbGYubW92ZUZpbGUoIHNvdXJjZUZpbGVQYXRoLCBcIi5cIiwgd2l0aE5ld05hbWUgKTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFJlbmFtZXMgYSBkaXJlY3RvcnkgdG8gYSBuZXcgbmFtZSwgaW4gdGhlIGN3ZFxuICAgICAgICogQG1ldGhvZCByZW5hbWVEaXJlY3RvcnlcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gc291cmNlRGlyZWN0b3J5UGF0aCBQYXRoIHRvIGRpcmVjdG9yeSwgcmVsYXRpdmUgdG8gY3dkXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHdpdGhOZXdOYW1lICAgICAgICAgTmV3IG5hbWVcbiAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICAgICAgICAgVGhlIFByb21pc2VcbiAgICAgICAqL1xuICAgICAgc2VsZi5yZW5hbWVEaXJlY3RvcnkgPSBmdW5jdGlvbiAoIHNvdXJjZURpcmVjdG9yeVBhdGgsIHdpdGhOZXdOYW1lICkge1xuICAgICAgICByZXR1cm4gc2VsZi5tb3ZlRGlyZWN0b3J5KCBzb3VyY2VEaXJlY3RvcnlQYXRoLCBcIi5cIiwgd2l0aE5ld05hbWUgKTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIERlbGV0ZXMgYSBmaWxlXG4gICAgICAgKiBAbWV0aG9kIGRlbGV0ZUZpbGVcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdGhlRmlsZVBhdGggUGF0aCB0byBmaWxlLCByZWxhdGl2ZSB0byBjd2RcbiAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgIFRoZSBQcm9taXNlXG4gICAgICAgKi9cbiAgICAgIHNlbGYuZGVsZXRlRmlsZSA9IGZ1bmN0aW9uICggdGhlRmlsZVBhdGggKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgX2dldEZpbGVFbnRyeSggc2VsZi5fY3dkLCB0aGVGaWxlUGF0aCwge30gKS50aGVuKCBmdW5jdGlvbiBnb3RUaGVGaWxlVG9EZWxldGUoIHRoZUZpbGVFbnRyeSApIHtcbiAgICAgICAgICByZXR1cm4gX3JlbW92ZUZpbGUoIHRoZUZpbGVFbnRyeSApO1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gYWxsRG9uZSgpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCBzZWxmICk7XG4gICAgICAgIH0gKS5cbiAgICAgICAgICBjYXRjaCggZnVuY3Rpb24gKCBhbkVycm9yICkge1xuICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgICAgICAgICAgICB9ICkuZG9uZSgpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZXMgYSBkaXJlY3RvcnksIHBvc3NpYmx5IHJlY3Vyc2l2ZWx5XG4gICAgICAgKiBAbWV0aG9kIHJlbW92ZURpcmVjdG9yeVxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSB0aGVEaXJlY3RvcnlQYXRoIHBhdGggdG8gZGlyZWN0b3J5LCByZWxhdGl2ZSB0byBjd2RcbiAgICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IHJlY3Vyc2l2ZWx5ICAgICAgSWYgdHJ1ZSwgcmVjdXJzaXZlIHJlbW92ZVxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICAgICBUaGUgcHJvbWlzZVxuICAgICAgICovXG4gICAgICBzZWxmLnJlbW92ZURpcmVjdG9yeSA9IGZ1bmN0aW9uICggdGhlRGlyZWN0b3J5UGF0aCwgcmVjdXJzaXZlbHkgKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgX2dldERpcmVjdG9yeUVudHJ5KCBzZWxmLl9jd2QsIHRoZURpcmVjdG9yeVBhdGgsIHt9ICkudGhlbiggZnVuY3Rpb24gZ290VGhlRGlyZWN0b3J5VG9EZWxldGUoIHRoZURpcmVjdG9yeUVudHJ5ICkge1xuICAgICAgICAgIHJldHVybiBfcmVtb3ZlRGlyZWN0b3J5KCB0aGVEaXJlY3RvcnlFbnRyeSwgcmVjdXJzaXZlbHkgKTtcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGFsbERvbmUoKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggc2VsZiApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBBc2tzIHRoZSBicm93c2VyIGZvciB0aGUgcmVxdWVzdGVkIHF1b3RhLCBhbmQgdGhlbiByZXF1ZXN0cyB0aGUgZmlsZSBzeXN0ZW1cbiAgICAgICAqIGFuZCBzZXRzIHRoZSBjd2QgdG8gdGhlIHJvb3QgZGlyZWN0b3J5LlxuICAgICAgICogQG1ldGhvZCBfaW5pdGlhbGl6ZUZpbGVTeXN0ZW1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSBUaGUgcHJvbWlzZVxuICAgICAgICovXG4gICAgICBzZWxmLl9pbml0aWFsaXplRmlsZVN5c3RlbSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICBfcmVxdWVzdFF1b3RhKCBzZWxmLmZpbGVTeXN0ZW1UeXBlLCBzZWxmLnJlcXVlc3RlZFF1b3RhICkudGhlbiggZnVuY3Rpb24gZ290UXVvdGEoIHRoZVF1b3RhICkge1xuICAgICAgICAgIHNlbGYuX2FjdHVhbFF1b3RhID0gdGhlUXVvdGE7XG4gICAgICAgICAgcmV0dXJuIF9yZXF1ZXN0RmlsZVN5c3RlbSggc2VsZi5maWxlU3lzdGVtVHlwZSwgc2VsZi5hY3R1YWxRdW90YSApO1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gZ290RlMoIHRoZUZTICkge1xuICAgICAgICAgIHNlbGYuX2ZpbGVTeXN0ZW0gPSB0aGVGUztcbiAgICAgICAgICAvL3NlbGYuX2N3ZCA9IHRoZUZTLnJvb3Q7XG4gICAgICAgICAgcmV0dXJuIF9nZXREaXJlY3RvcnlFbnRyeSggdGhlRlMucm9vdCwgXCJcIiwge30gKTtcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGdvdFJvb3REaXJlY3RvcnkoIHRoZVJvb3REaXJlY3RvcnkgKSB7XG4gICAgICAgICAgc2VsZi5fcm9vdCA9IHRoZVJvb3REaXJlY3Rvcnk7XG4gICAgICAgICAgc2VsZi5fY3dkID0gdGhlUm9vdERpcmVjdG9yeTtcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGFsbERvbmUoKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggc2VsZiApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgaWYgKCBzZWxmLm92ZXJyaWRlU3VwZXIgKSB7XG4gICAgICAgIHNlbGYub3ZlcnJpZGVTdXBlciggc2VsZi5jbGFzcywgXCJpbml0XCIsIHNlbGYuaW5pdCApO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBJbml0aWFsaXplcyB0aGUgZmlsZSBtYW5hZ2VyIHdpdGggdGhlIHJlcXVlc3RlZCBmaWxlIHN5c3RlbSB0eXBlIChzZWxmLlBFUlNJU1RFTlQgb3Igc2VsZi5URU1QT1JBUlkpXG4gICAgICAgKiBhbmQgcmVxdWVzdGVkIHF1b3RhIHNpemUuIEJvdGggbXVzdCBiZSBzcGVjaWZpZWQuXG4gICAgICAgKiBAbWV0aG9kIGluaXRcbiAgICAgICAqIEBwYXJhbSB7RmlsZVN5c3RlbX0gZmlsZVN5c3RlbVR5cGVcbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSByZXF1ZXN0ZWRRdW90YVxuICAgICAgICovXG4gICAgICBzZWxmLmluaXQgPSBmdW5jdGlvbiAoIGZpbGVTeXN0ZW1UeXBlLCByZXF1ZXN0ZWRRdW90YSApIHtcbiAgICAgICAgaWYgKCBzZWxmLnN1cGVyICkge1xuICAgICAgICAgIHNlbGYuc3VwZXIoIF9jbGFzc05hbWUsIFwiaW5pdFwiICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2YgZmlsZVN5c3RlbVR5cGUgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIk5vIGZpbGUgc3lzdGVtIHR5cGUgc3BlY2lmaWVkOyBzcGVjaWZ5IFBFUlNJU1RFTlQgb3IgVEVNUE9SQVJZLlwiICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2YgcmVxdWVzdGVkUXVvdGEgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIk5vIHF1b3RhIHJlcXVlc3RlZC4gSWYgeW91IGRvbid0IGtub3csIHNwZWNpZnkgWkVSTy5cIiApO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuX3JlcXVlc3RlZFF1b3RhID0gcmVxdWVzdGVkUXVvdGE7XG4gICAgICAgIHNlbGYuX2ZpbGVTeXN0ZW1UeXBlID0gZmlsZVN5c3RlbVR5cGU7XG4gICAgICAgIHJldHVybiBzZWxmLl9pbml0aWFsaXplRmlsZVN5c3RlbSgpOyAvLyB0aGlzIHJldHVybnMgYSBwcm9taXNlLCBzbyB3ZSBjYW4gLnRoZW4gYWZ0ZXIuXG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBJbml0aWFsaXplcyB0aGUgZmlsZSBtYW5hZ2VyIHdpdGggdGhlIHJlcXVlc3RlZCBmaWxlIHN5c3RlbSB0eXBlIChzZWxmLlBFUlNJU1RFTlQgb3Igc2VsZi5URU1QT1JBUlkpXG4gICAgICAgKiBhbmQgcmVxdWVzdGVkIHF1b3RhIHNpemUuIEJvdGggbXVzdCBiZSBzcGVjaWZpZWQuXG4gICAgICAgKiBAbWV0aG9kIGluaXRXaXRoT3B0aW9uc1xuICAgICAgICogQHBhcmFtIHsqfSBvcHRpb25zXG4gICAgICAgKi9cbiAgICAgIHNlbGYuaW5pdFdpdGhPcHRpb25zID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJObyBvcHRpb25zIHNwZWNpZmllZC4gTmVlZCB0eXBlIGFuZCBxdW90YS5cIiApO1xuICAgICAgICB9XG4gICAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMuZmlsZVN5c3RlbVR5cGUgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIk5vIGZpbGUgc3lzdGVtIHR5cGUgc3BlY2lmaWVkOyBzcGVjaWZ5IFBFUlNJU1RFTlQgb3IgVEVNUE9SQVJZLlwiICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5yZXF1ZXN0ZWRRdW90YSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiTm8gcXVvdGEgcmVxdWVzdGVkLiBJZiB5b3UgZG9uJ3Qga25vdywgc3BlY2lmeSBaRVJPLlwiICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlbGYuaW5pdCggb3B0aW9ucy5maWxlU3lzdGVtVHlwZSwgb3B0aW9ucy5yZXF1ZXN0ZWRRdW90YSApO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH07XG4gIC8vIG1ldGEgaW5mb3JtYXRpb25cbiAgRmlsZU1hbmFnZXIubWV0YSA9IHtcbiAgICB2ZXJzaW9uOiAgICAgICAgICAgXCIwMC4wNC40NTBcIixcbiAgICBjbGFzczogICAgICAgICAgICAgX2NsYXNzTmFtZSxcbiAgICBhdXRvSW5pdGlhbGl6YWJsZTogZmFsc2UsXG4gICAgY2F0ZWdvcml6YWJsZTogICAgIGZhbHNlXG4gIH07XG4gIC8vIGFzc2lnbiB0byBgd2luZG93YCBpZiBzdGFuZC1hbG9uZVxuICBpZiAoIGdsb2JhbENvbnRleHQgKSB7XG4gICAgZ2xvYmFsQ29udGV4dC5GaWxlTWFuYWdlciA9IEZpbGVNYW5hZ2VyO1xuICB9XG4gIGlmICggbW9kdWxlICkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gRmlsZU1hbmFnZXI7XG4gIH1cbn0pKCBRLCBCYXNlT2JqZWN0LCAoIHR5cGVvZiBJTl9ZQVNNRiAhPT0gXCJ1bmRlZmluZWRcIiApID8gdW5kZWZpbmVkIDogd2luZG93LCBtb2R1bGUgKTtcbiIsIi8qKlxuICpcbiAqIFByb3ZpZGVzIGNvbnZlbmllbmNlIG1ldGhvZHMgZm9yIHBhcnNpbmcgdW5peC1zdHlsZSBwYXRoIG5hbWVzLiBJZiB0aGVcbiAqIHBhdGggc2VwYXJhdG9yIGlzIGNoYW5nZWQgZnJvbSBcIi9cIiB0byBcIlxcXCIsIGl0IHNob3VsZCBwYXJzZSBXaW5kb3dzIHBhdGhzIGFzIHdlbGwuXG4gKlxuICogQG1vZHVsZSBmaWxlbmFtZS5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNFxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKi9cbi8qZ2xvYmFsIG1vZHVsZSovXG5cInVzZSBzdHJpY3RcIjtcbnZhciBQS0ZJTEUgPSB7XG4gIC8qKlxuICAgKiBAcHJvcGVydHkgVmVyc2lvblxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdmVyc2lvbjogICAgICAgICAgICAgIFwiMDAuMDQuMTAwXCIsXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIGNoYXJhY3RlcnMgdGhhdCBhcmUgbm90IGFsbG93ZWQgaW4gZmlsZSBuYW1lcy5cbiAgICogQHByb3BlcnR5IGludmFsaWRDaGFyYWN0ZXJzXG4gICAqIEBkZWZhdWx0IFtcIi9cIixcIlxcXCIsXCI6XCIsXCJ8XCIsXCI8XCIsXCI+XCIsXCIqXCIsXCI/XCIsXCI7XCIsXCIlXCJdXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gIGludmFsaWRDaGFyYWN0ZXJzOiAgICBcIi8sXFxcXCw6LHwsPCw+LCosPyw7LCVcIi5zcGxpdCggXCIsXCIgKSxcbiAgLyoqXG4gICAqIEluZGljYXRlcyB0aGUgY2hhcmFjdGVyIHRoYXQgc2VwYXJhdGVzIGEgbmFtZSBmcm9tIGl0cyBleHRlbnNpb24sXG4gICAqIGFzIGluIFwiZmlsZW5hbWUuZXh0XCIuXG4gICAqIEBwcm9wZXJ0eSBleHRlbnNpb25TZXBhcmF0b3JcbiAgICogQGRlZmF1bHQgXCIuXCJcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGV4dGVuc2lvblNlcGFyYXRvcjogICBcIi5cIixcbiAgLyoqXG4gICAqIEluZGljYXRlcyB0aGUgY2hhcmFjdGVyIHRoYXQgc2VwYXJhdGVzIHBhdGggY29tcG9uZW50cy5cbiAgICogQHByb3BlcnR5IHBhdGhTZXBhcmF0b3JcbiAgICogQGRlZmF1bHQgXCIvXCJcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHBhdGhTZXBhcmF0b3I6ICAgICAgICBcIi9cIixcbiAgLyoqXG4gICAqIEluZGljYXRlcyB0aGUgY2hhcmFjdGVyIHVzZWQgd2hlbiByZXBsYWNpbmcgaW52YWxpZCBjaGFyYWN0ZXJzXG4gICAqIEBwcm9wZXJ0eSByZXBsYWNlbWVudENoYXJhY3RlclxuICAgKiBAZGVmYXVsdCBcIi1cIlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgcmVwbGFjZW1lbnRDaGFyYWN0ZXI6IFwiLVwiLFxuICAvKipcbiAgICogQ29udmVydHMgYSBwb3RlbnRpYWwgaW52YWxpZCBmaWxlbmFtZSB0byBhIHZhbGlkIGZpbGVuYW1lIGJ5IHJlcGxhY2luZ1xuICAgKiBpbnZhbGlkIGNoYXJhY3RlcnMgKGFzIHNwZWNpZmllZCBpbiBcImludmFsaWRDaGFyYWN0ZXJzXCIpIHdpdGggXCJyZXBsYWNlbWVudENoYXJhY3RlclwiLlxuICAgKlxuICAgKiBAbWV0aG9kIG1ha2VWYWxpZFxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRoZUZpbGVOYW1lXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIG1ha2VWYWxpZDogICAgICAgICAgICBmdW5jdGlvbiAoIHRoZUZpbGVOYW1lICkge1xuICAgIHZhciBzZWxmID0gUEtGSUxFO1xuICAgIHZhciB0aGVOZXdGaWxlTmFtZSA9IHRoZUZpbGVOYW1lO1xuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHNlbGYuaW52YWxpZENoYXJhY3RlcnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICB2YXIgZCA9IDA7XG4gICAgICB3aGlsZSAoIHRoZU5ld0ZpbGVOYW1lLmluZGV4T2YoIHNlbGYuaW52YWxpZENoYXJhY3RlcnNbaV0gKSA+IC0xICYmICggZCsrICkgPCA1MCApIHtcbiAgICAgICAgdGhlTmV3RmlsZU5hbWUgPSB0aGVOZXdGaWxlTmFtZS5yZXBsYWNlKCBzZWxmLmludmFsaWRDaGFyYWN0ZXJzW2ldLCBzZWxmLnJlcGxhY2VtZW50Q2hhcmFjdGVyICk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGVOZXdGaWxlTmFtZTtcbiAgfSxcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG5hbWUrZXh0ZW5zaW9uIHBvcnRpb24gb2YgYSBmdWxsIHBhdGguXG4gICAqXG4gICAqIEBtZXRob2QgZ2V0RmlsZVBhcnRcbiAgICogQHBhcmFtICB7U3RyaW5nfSB0aGVGaWxlTmFtZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBnZXRGaWxlUGFydDogICAgICAgICAgZnVuY3Rpb24gKCB0aGVGaWxlTmFtZSApIHtcbiAgICB2YXIgc2VsZiA9IFBLRklMRTtcbiAgICB2YXIgdGhlU2xhc2hQb3NpdGlvbiA9IHRoZUZpbGVOYW1lLmxhc3RJbmRleE9mKCBzZWxmLnBhdGhTZXBhcmF0b3IgKTtcbiAgICBpZiAoIHRoZVNsYXNoUG9zaXRpb24gPCAwICkge1xuICAgICAgcmV0dXJuIHRoZUZpbGVOYW1lO1xuICAgIH1cbiAgICByZXR1cm4gdGhlRmlsZU5hbWUuc3Vic3RyKCB0aGVTbGFzaFBvc2l0aW9uICsgMSwgdGhlRmlsZU5hbWUubGVuZ3RoIC0gdGhlU2xhc2hQb3NpdGlvbiApO1xuICB9LFxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcGF0aCBwb3J0aW9uIG9mIGEgZnVsbCBwYXRoLlxuICAgKiBAbWV0aG9kIGdldFBhdGhQYXJ0XG4gICAqIEBwYXJhbSAge1N0cmluZ30gdGhlRmlsZU5hbWVcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZ2V0UGF0aFBhcnQ6ICAgICAgICAgIGZ1bmN0aW9uICggdGhlRmlsZU5hbWUgKSB7XG4gICAgdmFyIHNlbGYgPSBQS0ZJTEU7XG4gICAgdmFyIHRoZVNsYXNoUG9zaXRpb24gPSB0aGVGaWxlTmFtZS5sYXN0SW5kZXhPZiggc2VsZi5wYXRoU2VwYXJhdG9yICk7XG4gICAgaWYgKCB0aGVTbGFzaFBvc2l0aW9uIDwgMCApIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICByZXR1cm4gdGhlRmlsZU5hbWUuc3Vic3RyKCAwLCB0aGVTbGFzaFBvc2l0aW9uICsgMSApO1xuICB9LFxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZmlsZW5hbWUsIG1pbnVzIHRoZSBleHRlbnNpb24uXG4gICAqIEBtZXRob2QgZ2V0RmlsZU5hbWVQYXJ0XG4gICAqIEBwYXJhbSAge1N0cmluZ30gdGhlRmlsZU5hbWVcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZ2V0RmlsZU5hbWVQYXJ0OiAgICAgIGZ1bmN0aW9uICggdGhlRmlsZU5hbWUgKSB7XG4gICAgdmFyIHNlbGYgPSBQS0ZJTEU7XG4gICAgdmFyIHRoZUZpbGVOYW1lTm9QYXRoID0gc2VsZi5nZXRGaWxlUGFydCggdGhlRmlsZU5hbWUgKTtcbiAgICB2YXIgdGhlRG90UG9zaXRpb24gPSB0aGVGaWxlTmFtZU5vUGF0aC5sYXN0SW5kZXhPZiggc2VsZi5leHRlbnNpb25TZXBhcmF0b3IgKTtcbiAgICBpZiAoIHRoZURvdFBvc2l0aW9uIDwgMCApIHtcbiAgICAgIHJldHVybiB0aGVGaWxlTmFtZU5vUGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIHRoZUZpbGVOYW1lTm9QYXRoLnN1YnN0ciggMCwgdGhlRG90UG9zaXRpb24gKTtcbiAgfSxcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGV4dGVuc2lvbiBvZiBhIGZpbGVuYW1lXG4gICAqIEBtZXRob2QgZ2V0RmlsZUV4dGVuc2lvblBhcnRcbiAgICogQHBhcmFtICB7U3RyaW5nfSB0aGVGaWxlTmFtZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBnZXRGaWxlRXh0ZW5zaW9uUGFydDogZnVuY3Rpb24gKCB0aGVGaWxlTmFtZSApIHtcbiAgICB2YXIgc2VsZiA9IFBLRklMRTtcbiAgICB2YXIgdGhlRmlsZU5hbWVOb1BhdGggPSBzZWxmLmdldEZpbGVQYXJ0KCB0aGVGaWxlTmFtZSApO1xuICAgIHZhciB0aGVEb3RQb3NpdGlvbiA9IHRoZUZpbGVOYW1lTm9QYXRoLmxhc3RJbmRleE9mKCBzZWxmLmV4dGVuc2lvblNlcGFyYXRvciApO1xuICAgIGlmICggdGhlRG90UG9zaXRpb24gPCAwICkge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHJldHVybiB0aGVGaWxlTmFtZU5vUGF0aC5zdWJzdHIoIHRoZURvdFBvc2l0aW9uICsgMSwgdGhlRmlsZU5hbWVOb1BhdGgubGVuZ3RoIC0gdGhlRG90UG9zaXRpb24gLSAxICk7XG4gIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IFBLRklMRTtcbiIsIi8qKlxuICpcbiAqIFByb3ZpZGVzIG1pc2NlbGxhbmVvdXMgZnVuY3Rpb25zIHRoYXQgaGFkIG5vIG90aGVyIGNhdGVnb3J5LlxuICpcbiAqIEBtb2R1bGUgbWlzYy5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNFxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKi9cbi8qZ2xvYmFsIG1vZHVsZSovXG5cInVzZSBzdHJpY3RcIjtcbm1vZHVsZS5leHBvcnRzID0ge1xuICAvKipcbiAgICogUmV0dXJucyBhIHBzZXVkby1VVUlELiBOb3QgZ3VhcmFudGVlZCB0byBiZSB1bmlxdWUgKGZhciBmcm9tIGl0LCBwcm9iYWJseSksIGJ1dFxuICAgKiBjbG9zZSBlbm91Z2ggZm9yIG1vc3QgcHVycG9zZXMuIFlvdSBzaG91bGQgaGFuZGxlIGNvbGxpc2lvbnMgZ3JhY2VmdWxseSBvbiB5b3VyXG4gICAqIG93biwgb2YgY291cnNlLiBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODgwOTQ3MlxuICAgKiBAbWV0aG9kIG1ha2VGYXV4VVVJRFxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBtYWtlRmF1eFVVSUQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHZhciB1dWlkID0gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKCAvW3h5XS9nLCBmdW5jdGlvbiAoIGMgKSB7XG4gICAgICB2YXIgciA9ICggZCArIE1hdGgucmFuZG9tKCkgKiAxNiApICUgMTYgfCAwO1xuICAgICAgZCA9IE1hdGguZmxvb3IoIGQgLyAxNiApO1xuICAgICAgcmV0dXJuICggYyA9PT0gXCJ4XCIgPyByIDogKCByICYgMHg3IHwgMHg4ICkgKS50b1N0cmluZyggMTYgKTtcbiAgICB9ICk7XG4gICAgcmV0dXJuIHV1aWQ7XG4gIH1cbn07XG4iLCIvKipcbiAqXG4gKiAjIEJhc2UgT2JqZWN0XG4gKlxuICogQG1vZHVsZSBvYmplY3QuanNcbiAqIEBhdXRob3IgS2VycmkgU2hvdHRzXG4gKiBAdmVyc2lvbiAwLjVcbiAqIGBgYFxuICogQ29weXJpZ2h0IChjKSAyMDEzIEtlcnJpIFNob3R0cywgcGhvdG9LYW5keSBTdHVkaW9zIExMQ1xuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nXG4gKiBjb25kaXRpb25zOlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllc1xuICogb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUlxuICogUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuICogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVFxuICogT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1JcbiAqIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqIGBgYFxuICovXG4vKmdsb2JhbCBtb2R1bGUsIGNvbnNvbGUsIHNldFRpbWVvdXQqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX2NsYXNzTmFtZSA9IFwiQmFzZU9iamVjdFwiLFxuICAvKipcbiAgICogQmFzZU9iamVjdCBpcyB0aGUgYmFzZSBvYmplY3QgZm9yIGFsbCBjb21wbGV4IG9iamVjdHMgdXNlZCBieSBZQVNNRjtcbiAgICogc2ltcGxlciBvYmplY3RzIHRoYXQgYXJlIHByb3BlcnRpZXMtb25seSBkbyBub3QgaW5oZXJpdCBmcm9tIHRoaXNcbiAgICogY2xhc3MuXG4gICAqXG4gICAqIEJhc2VPYmplY3QgcHJvdmlkZXMgc2ltcGxlIGluaGVyaXRhbmNlLCBidXQgbm90IGJ5IHVzaW5nIHRoZSB0eXBpY2FsXG4gICAqIHByb3RvdHlwYWwgbWV0aG9kLiBSYXRoZXIgaW5oZXJpdGFuY2UgaXMgZm9ybWVkIGJ5IG9iamVjdCBjb21wb3NpdGlvblxuICAgKiB3aGVyZSBhbGwgb2JqZWN0cyBhcmUgaW5zdGFuY2VzIG9mIEJhc2VPYmplY3Qgd2l0aCBtZXRob2RzIG92ZXJyaWRkZW5cbiAgICogaW5zdGVhZC4gQXMgc3VjaCwgeW91IGNhbiAqbm90KiB1c2UgYW55IEphdmFzY3JpcHQgdHlwZSBjaGVja2luZyB0b1xuICAgKiBkaWZmZXJlbnRpYXRlIFBLT2JqZWN0czsgeW91IHNob3VsZCBpbnN0ZWFkIHVzZSB0aGUgYGNsYXNzYFxuICAgKiBwcm9wZXJ0eS5cbiAgICpcbiAgICogQmFzZU9iamVjdCBwcm92aWRlcyBpbmhlcml0YW5jZSB0byBtb3JlIHRoYW4ganVzdCBhIGNvbnN0cnVjdG9yOiBhbnlcbiAgICogbWV0aG9kIGNhbiBiZSBvdmVycmlkZGVuLCBidXQgaXQgaXMgY3JpdGljYWwgdGhhdCB0aGUgc3VwZXItY2hhaW5cbiAgICogYmUgcHJvcGVybHkgaW5pdGlhbGl6ZWQuIFNlZSB0aGUgYHN1cGVyYCBhbmQgYG92ZXJyaWRlU3VwZXJgXG4gICAqIG1ldGhvZHMgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gICAqXG4gICAqIEBjbGFzcyBCYXNlT2JqZWN0XG4gICAqL1xuICBCYXNlT2JqZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAvKipcbiAgICAgKlxuICAgICAqIFdlIG5lZWQgYSB3YXkgdG8gcHJvdmlkZSBpbmhlcml0YW5jZS4gTW9zdCBtZXRob2RzIG9ubHkgcHJvdmlkZVxuICAgICAqIGluaGVyaXRhbmNlIGFjcm9zcyB0aGUgY29uc3RydWN0b3IgY2hhaW4sIG5vdCBhY3Jvc3MgYW55IHBvc3NpYmxlXG4gICAgICogbWV0aG9kLiBCdXQgZm9yIG91ciBwdXJwb3Nlcywgd2UgbmVlZCB0byBiZSBhYmxlIHRvIHByb3ZpZGUgZm9yXG4gICAgICogb3ZlcnJpZGluZyBhbnkgbWV0aG9kIChzdWNoIGFzIGRyYXdpbmcsIHRvdWNoIHJlc3BvbnNlcywgZXRjLiksXG4gICAgICogYW5kIHNvIHdlIGltcGxlbWVudCBpbmhlcml0YW5jZSBpbiBhIGRpZmZlcmVudCB3YXkuXG4gICAgICpcbiAgICAgKiBGaXJzdCwgdGhlIF9jbGFzc0hpZXJhcmNoeSwgYSBwcml2YXRlIHByb3BlcnR5LCBwcm92aWRlcyB0aGVcbiAgICAgKiBpbmhlcml0YW5jZSB0cmVlLiBBbGwgb2JqZWN0cyBpbmhlcml0IGZyb20gXCJCYXNlT2JqZWN0XCIuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwcm9wZXJ0eSBfY2xhc3NIaWVyYXJjaHlcbiAgICAgKiBAdHlwZSBBcnJheVxuICAgICAqIEBkZWZhdWx0IFtcIkJhc2VPYmplY3RcIl1cbiAgICAgKi9cbiAgICBzZWxmLl9jbGFzc0hpZXJhcmNoeSA9IFtfY2xhc3NOYW1lXTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIE9iamVjdHMgYXJlIHN1YmNsYXNzZWQgdXNpbmcgdGhpcyBtZXRob2QuIFRoZSBuZXdDbGFzcyBpcyB0aGVcbiAgICAgKiB1bmlxdWUgY2xhc3MgbmFtZSBvZiB0aGUgb2JqZWN0IChhbmQgc2hvdWxkIG1hdGNoIHRoZSBjbGFzcydcbiAgICAgKiBhY3R1YWwgbmFtZS5cbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc3ViY2xhc3NcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmV3Q2xhc3MgLSB0aGUgbmV3IHVuaXF1ZSBjbGFzcyBvZiB0aGUgb2JqZWN0XG4gICAgICovXG4gICAgc2VsZi5zdWJjbGFzcyA9IGZ1bmN0aW9uICggbmV3Q2xhc3MgKSB7XG4gICAgICBzZWxmLl9jbGFzc0hpZXJhcmNoeS5wdXNoKCBuZXdDbGFzcyApO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBnZXRDbGFzcyByZXR1cm5zIHRoZSBjdXJyZW50IGNsYXNzIG9mIHRoZSBvYmplY3QuIFRoZVxuICAgICAqIGBjbGFzc2AgcHJvcGVydHkgY2FuIGJlIHVzZWQgYXMgd2VsbC4gTm90ZSB0aGF0IHRoZXJlXG4gICAgICogaXMgbm8gYHNldHRlcmAgZm9yIHRoaXMgcHJvcGVydHk7IGFuIG9iamVjdCdzIGNsYXNzXG4gICAgICogY2FuICpub3QqIGJlIGNoYW5nZWQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldENsYXNzXG4gICAgICogQHJldHVybnMge1N0cmluZ30gdGhlIGNsYXNzIG9mIHRoZSBpbnN0YW5jZVxuICAgICAqXG4gICAgICovXG4gICAgc2VsZi5nZXRDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzZWxmLl9jbGFzc0hpZXJhcmNoeVtzZWxmLl9jbGFzc0hpZXJhcmNoeS5sZW5ndGggLSAxXTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogVGhlIGNsYXNzIG9mIHRoZSBpbnN0YW5jZS4gKipSZWFkLW9ubHkqKlxuICAgICAqIEBwcm9wZXJ0eSBjbGFzc1xuICAgICAqIEB0eXBlIFN0cmluZ1xuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZiwgXCJjbGFzc1wiLCB7XG4gICAgICBnZXQ6ICAgICAgICAgIHNlbGYuZ2V0Q2xhc3MsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSApO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJucyB0aGUgc3VwZXIgY2xhc3MgZm9yIHRoZSBnaXZlbiBjbGFzcy4gSWYgdGhlXG4gICAgICogY2xhc3MgaXMgbm90IHN1cHBsaWVkLCB0aGUgY2xhc3MgaXMgYXNzdW1lZCB0byBiZSB0aGVcbiAgICAgKiBvYmplY3QncyBvd24gY2xhc3MuXG4gICAgICpcbiAgICAgKiBUaGUgcHJvcGVydHkgXCJzdXBlckNsYXNzXCIgdXNlcyB0aGlzIHRvIHJldHVybiB0aGVcbiAgICAgKiBvYmplY3QncyBkaXJlY3Qgc3VwZXJjbGFzcywgYnV0IGdldFN1cGVyQ2xhc3NPZkNsYXNzXG4gICAgICogY2FuIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIHN1cGVyY2xhc3NlcyBoaWdoZXIgdXBcbiAgICAgKiB0aGUgaGllcmFyY2h5LlxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRTdXBlckNsYXNzT2ZDbGFzc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbYUNsYXNzPWN1cnJlbnRDbGFzc10gdGhlIGNsYXNzIGZvciB3aGljaCB5b3Ugd2FudCB0aGUgc3VwZXIgY2xhc3MuIElmIG5vdCBzcGVjaWZpZWQsXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGluc3RhbmNlJ3MgY2xhc3MgaXMgdXNlZC5cbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSB0aGUgc3VwZXItY2xhc3Mgb2YgdGhlIHNwZWNpZmllZCBjbGFzcy5cbiAgICAgKi9cbiAgICBzZWxmLmdldFN1cGVyQ2xhc3NPZkNsYXNzID0gZnVuY3Rpb24gKCBhQ2xhc3MgKSB7XG4gICAgICB2YXIgdGhlQ2xhc3MgPSBhQ2xhc3MgfHwgc2VsZi5jbGFzcztcbiAgICAgIHZhciBpID0gc2VsZi5fY2xhc3NIaWVyYXJjaHkuaW5kZXhPZiggdGhlQ2xhc3MgKTtcbiAgICAgIGlmICggaSA+IC0xICkge1xuICAgICAgICByZXR1cm4gc2VsZi5fY2xhc3NIaWVyYXJjaHlbaSAtIDFdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIFRoZSBzdXBlcmNsYXNzIG9mIHRoZSBpbnN0YW5jZS5cbiAgICAgKiBAcHJvcGVydHkgc3VwZXJDbGFzc1xuICAgICAqIEB0eXBlIFN0cmluZ1xuICAgICAqL1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZiwgXCJzdXBlckNsYXNzXCIsIHtcbiAgICAgIGdldDogICAgICAgICAgc2VsZi5nZXRTdXBlckNsYXNzT2ZDbGFzcyxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9ICk7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBfc3VwZXIgaXMgYW4gb2JqZWN0IHRoYXQgc3RvcmVzIG92ZXJyaWRkZW4gZnVuY3Rpb25zIGJ5IGNsYXNzIGFuZCBtZXRob2RcbiAgICAgKiBuYW1lLiBUaGlzIGlzIGhvdyB3ZSBnZXQgdGhlIGFiaWxpdHkgdG8gYXJiaXRyYXJpbHkgb3ZlcnJpZGUgYW55IG1ldGhvZFxuICAgICAqIGFscmVhZHkgcHJlc2VudCBpbiB0aGUgc3VwZXJjbGFzcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHByb3BlcnR5IF9zdXBlclxuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHNlbGYuX3N1cGVyID0ge307XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBNdXN0IGJlIGNhbGxlZCBwcmlvciB0byBkZWZpbmluZyB0aGUgb3ZlcnJpZGRlbiBmdW5jdGlvbiBhcyB0aGlzIG1vdmVzXG4gICAgICogdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIGludG8gdGhlIF9zdXBlciBvYmplY3QuIFRoZSBmdW5jdGlvbk5hbWUgbXVzdFxuICAgICAqIG1hdGNoIHRoZSBuYW1lIG9mIHRoZSBtZXRob2QgZXhhY3RseSwgc2luY2UgdGhlcmUgbWF5IGJlIGEgbG9uZyB0cmVlXG4gICAgICogb2YgY29kZSB0aGF0IGRlcGVuZHMgb24gaXQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG92ZXJyaWRlU3VwZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlQ2xhc3MgIHRoZSBjbGFzcyBmb3Igd2hpY2ggdGhlIGZ1bmN0aW9uIG92ZXJyaWRlIGlzIGRlc2lyZWRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlRnVuY3Rpb25OYW1lICB0aGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gdG8gb3ZlcnJpZGVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB0aGVBY3R1YWxGdW5jdGlvbiAgdGhlIGFjdHVhbCBmdW5jdGlvbiAob3IgcG9pbnRlciB0byBmdW5jdGlvbilcbiAgICAgKlxuICAgICAqL1xuICAgIHNlbGYub3ZlcnJpZGVTdXBlciA9IGZ1bmN0aW9uICggdGhlQ2xhc3MsIHRoZUZ1bmN0aW9uTmFtZSwgdGhlQWN0dWFsRnVuY3Rpb24gKSB7XG4gICAgICB2YXIgc3VwZXJDbGFzcyA9IHNlbGYuZ2V0U3VwZXJDbGFzc09mQ2xhc3MoIHRoZUNsYXNzICk7XG4gICAgICBpZiAoICFzZWxmLl9zdXBlcltzdXBlckNsYXNzXSApIHtcbiAgICAgICAgc2VsZi5fc3VwZXJbc3VwZXJDbGFzc10gPSB7fTtcbiAgICAgIH1cbiAgICAgIHNlbGYuX3N1cGVyW3N1cGVyQ2xhc3NdW3RoZUZ1bmN0aW9uTmFtZV0gPSB0aGVBY3R1YWxGdW5jdGlvbjtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBtZXRob2Qgb3ZlcnJpZGVcbiAgICAgKlxuICAgICAqIE92ZXJyaWRlcyBhbiBleGlzdGluZyBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgYHRoZU5ld0Z1bmN0aW9uYC4gRXNzZW50aWFsbHlcbiAgICAgKiBhIGNhbGwgdG8gYG92ZXJyaWRlU3VwZXIgKHNlbGYuY2xhc3MsIHRoZU5ld0Z1bmN0aW9uLm5hbWUsIHNlbGZbdGhlTmV3RnVuY3Rpb24ubmFtZV0pYFxuICAgICAqIGZvbGxvd2VkIGJ5IHRoZSByZWRlZmluaXRpb24gb2YgdGhlIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBcbiAgICAgKiBvYmoub3ZlcnJpZGUgKCBmdW5jdGlvbiBpbml0V2l0aE9wdGlvbnMgKCBvcHRpb25zIClcbiAgICAgKiAgICAgICAgICAgICAgICB7IC4uLiB9ICk7XG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB0aGVOZXdGdW5jdGlvbiAtIFRoZSBmdW5jdGlvbiB0byBvdmVycmlkZS4gTXVzdCBoYXZlIHRoZSBuYW1lIG9mIHRoZSBvdmVycmlkaW5nIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHNlbGYub3ZlcnJpZGUgPSBmdW5jdGlvbiAoIHRoZU5ld0Z1bmN0aW9uICkge1xuICAgICAgdmFyIHRoZUZ1bmN0aW9uTmFtZSA9IHRoZU5ld0Z1bmN0aW9uLm5hbWUsXG4gICAgICAgIHRoZU9sZEZ1bmN0aW9uID0gc2VsZlt0aGVGdW5jdGlvbk5hbWVdO1xuICAgICAgaWYgKCB0aGVGdW5jdGlvbk5hbWUgIT09IFwiXCIgKSB7XG4gICAgICAgIHNlbGYub3ZlcnJpZGVTdXBlciggc2VsZi5jbGFzcywgdGhlRnVuY3Rpb25OYW1lLCB0aGVPbGRGdW5jdGlvbiApO1xuICAgICAgICBzZWxmW3RoZUZ1bmN0aW9uTmFtZV0gPSBmdW5jdGlvbiBfX3N1cGVyX18oKSB7XG4gICAgICAgICAgdmFyIHJldCxcbiAgICAgICAgICAgIG9sZCRjbGFzcyA9IHNlbGYuJGNsYXNzLFxuICAgICAgICAgICAgb2xkJHN1cGVyY2xhc3MgPSBzZWxmLiRzdXBlcmNsYXNzLFxuICAgICAgICAgICAgb2xkJHN1cGVyID0gc2VsZi4kc3VwZXI7XG4gICAgICAgICAgc2VsZi4kY2xhc3MgPSBzZWxmLmNsYXNzO1xuICAgICAgICAgIHNlbGYuJHN1cGVyY2xhc3MgPSBzZWxmLnN1cGVyQ2xhc3M7XG4gICAgICAgICAgc2VsZi4kc3VwZXIgPSBmdW5jdGlvbiAkc3VwZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhlT2xkRnVuY3Rpb24uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgICAgICAgIH07XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldCA9IHRoZU5ld0Z1bmN0aW9uLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2ggKCBlcnIgKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgc2VsZi4kY2xhc3MgPSBvbGQkY2xhc3M7XG4gICAgICAgICAgICBzZWxmLiRzdXBlcmNsYXNzID0gb2xkJHN1cGVyY2xhc3M7XG4gICAgICAgICAgICBzZWxmLiRzdXBlciA9IG9sZCRzdXBlcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQ2FsbHMgYSBzdXBlciBmdW5jdGlvbiB3aXRoIGFueSBudW1iZXIgb2YgYXJndW1lbnRzLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBzdXBlclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aGVDbGFzcyAgdGhlIGN1cnJlbnQgY2xhc3MgaW5zdGFuY2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlRnVuY3Rpb25OYW1lIHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0byBleGVjdXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gW2FyZ3NdICBBbnkgbnVtYmVyIG9mIHBhcmFtZXRlcnMgdG8gcGFzcyB0byB0aGUgc3VwZXIgbWV0aG9kXG4gICAgICpcbiAgICAgKi9cbiAgICBzZWxmLnN1cGVyID0gZnVuY3Rpb24gKCB0aGVDbGFzcywgdGhlRnVuY3Rpb25OYW1lLCBhcmdzICkge1xuICAgICAgdmFyIHN1cGVyQ2xhc3MgPSBzZWxmLmdldFN1cGVyQ2xhc3NPZkNsYXNzKCB0aGVDbGFzcyApO1xuICAgICAgaWYgKCBzZWxmLl9zdXBlcltzdXBlckNsYXNzXSApIHtcbiAgICAgICAgaWYgKCBzZWxmLl9zdXBlcltzdXBlckNsYXNzXVt0aGVGdW5jdGlvbk5hbWVdICkge1xuICAgICAgICAgIHJldHVybiBzZWxmLl9zdXBlcltzdXBlckNsYXNzXVt0aGVGdW5jdGlvbk5hbWVdLmFwcGx5KCBzZWxmLCBhcmdzICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENhdGVnb3J5IHN1cHBvcnQ7IGZvciBhbiBvYmplY3QgdG8gZ2V0IGNhdGVnb3J5IHN1cHBvcnQgZm9yIHRoZWlyIGNsYXNzLFxuICAgICAqIHRoZXkgbXVzdCBjYWxsIHRoaXMgbWV0aG9kIHByaW9yIHRvIGFueSBhdXRvIGluaXRpYWxpemF0aW9uXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIF9jb25zdHJ1Y3RPYmplY3RDYXRlZ29yaWVzXG4gICAgICpcbiAgICAgKi9cbiAgICBzZWxmLl9jb25zdHJ1Y3RPYmplY3RDYXRlZ29yaWVzID0gZnVuY3Rpb24gX2NvbnN0cnVjdE9iamVjdENhdGVnb3JpZXMoIHByaSApIHtcbiAgICAgIHZhciBwcmlvcml0eSA9IEJhc2VPYmplY3QuT05fQ1JFQVRFX0NBVEVHT1JZO1xuICAgICAgaWYgKCB0eXBlb2YgcHJpICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBwcmlvcml0eSA9IHByaTtcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIEJhc2VPYmplY3QuX29iamVjdENhdGVnb3JpZXNbcHJpb3JpdHldW3NlbGYuY2xhc3NdICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBCYXNlT2JqZWN0Ll9vYmplY3RDYXRlZ29yaWVzW3ByaW9yaXR5XVtzZWxmLmNsYXNzXS5mb3JFYWNoKCBmdW5jdGlvbiAoIGNhdGVnb3J5Q29uc3RydWN0b3IgKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNhdGVnb3J5Q29uc3RydWN0b3IoIHNlbGYgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2ggKCBlICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coIFwiRXJyb3IgZHVyaW5nIGNhdGVnb3J5IGNvbnN0cnVjdGlvbjogXCIgKyBlLm1lc3NhZ2UgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogaW5pdGlhbGl6ZXMgdGhlIG9iamVjdFxuICAgICAqXG4gICAgICogQG1ldGhvZCBpbml0XG4gICAgICpcbiAgICAgKi9cbiAgICBzZWxmLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9jb25zdHJ1Y3RPYmplY3RDYXRlZ29yaWVzKCBCYXNlT2JqZWN0Lk9OX0lOSVRfQ0FURUdPUlkgKTtcbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH07XG4gICAgLypcbiAgICAgKlxuICAgICAqIE9iamVjdHMgaGF2ZSBzb21lIHByb3BlcnRpZXMgdGhhdCB3ZSB3YW50IGFsbCBvYmplY3RzIHRvIGhhdmUuLi5cbiAgICAgKlxuICAgICAqL1xuICAgIC8qKlxuICAgICAqIFN0b3JlcyB0aGUgdmFsdWVzIG9mIGFsbCB0aGUgdGFncyBhc3NvY2lhdGVkIHdpdGggdGhlIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcHJvcGVydHkgX3RhZ1xuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHNlbGYuX3RhZ3MgPSB7fTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIFN0b3JlcyB0aGUgKmxpc3RlbmVycyogZm9yIGFsbCB0aGUgdGFncyBhc3NvY2lhdGVkIHdpdGggdGhlIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcHJvcGVydHkgX3RhZ0xpc3RlbmVyc1xuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHNlbGYuX3RhZ0xpc3RlbmVycyA9IHt9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogU2V0cyB0aGUgdmFsdWUgZm9yIGEgc3BlY2lmaWMgdGFnIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5zdGFuY2UuIElmIHRoZVxuICAgICAqIHRhZyBkb2VzIG5vdCBleGlzdCwgaXQgaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEFueSBsaXN0ZW5lcnMgYXR0YWNoZWQgdG8gdGhlIHRhZyB2aWEgYGFkZFRhZ0xpc3RlbmVyRm9yS2V5YCB3aWxsIGJlXG4gICAgICogbm90aWZpZWQgb2YgdGhlIGNoYW5nZS4gTGlzdGVuZXJzIGFyZSBwYXNzZWQgdGhyZWUgcGFyYW1ldGVyczpcbiAgICAgKiBgc2VsZmAgKHRoZSBvcmlnaW5hdGluZyBpbnN0YW5jZSksXG4gICAgICogYHRoZUtleWAgKHRoZSB0YWcgYmVpbmcgY2hhbmdlZCksXG4gICAgICogYW5kIGB0aGVWYWx1ZWAgKHRoZSB2YWx1ZSBvZiB0aGUgdGFnKTsgdGhlIHRhZyBpcyAqYWxyZWFkeSogY2hhbmdlZFxuICAgICAqXG4gICAgICogQG1ldGhvZCBzZXRUYWdGb3JLZXlcbiAgICAgKiBAcGFyYW0geyp9IHRoZUtleSAgdGhlIG5hbWUgb2YgdGhlIHRhZzsgXCJfX2RlZmF1bHRcIiBpcyBzcGVjaWFsIGFuZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgcmVmZXJzIHRvIHRoZSBkZWZhdWx0IHRhZyB2aXNpYmxlIHZpYSB0aGUgYHRhZ2BcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5LlxuICAgICAqIEBwYXJhbSB7Kn0gdGhlVmFsdWUgIHRoZSB2YWx1ZSB0byBhc3NpZ24gdG8gdGhlIHRhZy5cbiAgICAgKlxuICAgICAqL1xuICAgIHNlbGYuc2V0VGFnRm9yS2V5ID0gZnVuY3Rpb24gKCB0aGVLZXksIHRoZVZhbHVlICkge1xuICAgICAgc2VsZi5fdGFnc1t0aGVLZXldID0gdGhlVmFsdWU7XG4gICAgICB2YXIgbm90aWZ5TGlzdGVuZXIgPSBmdW5jdGlvbiAoIHRoZUxpc3RlbmVyLCB0aGVLZXksIHRoZVZhbHVlICkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoZUxpc3RlbmVyKCBzZWxmLCB0aGVLZXksIHRoZVZhbHVlICk7XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgICAgaWYgKCBzZWxmLl90YWdMaXN0ZW5lcnNbdGhlS2V5XSApIHtcbiAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgc2VsZi5fdGFnTGlzdGVuZXJzW3RoZUtleV0ubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgc2V0VGltZW91dCggbm90aWZ5TGlzdGVuZXIoIHNlbGYuX3RhZ0xpc3RlbmVyc1t0aGVLZXldW2ldLCB0aGVLZXksIHRoZVZhbHVlICksIDAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBrZXkuIElmIHRoZSBrZXkgZG9lcyBub3QgZXhpc3QsIHRoZVxuICAgICAqIHJlc3VsdCBpcyB1bmRlZmluZWQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldFRhZ0ZvcktleVxuICAgICAqIEBwYXJhbSB7Kn0gdGhlS2V5ICB0aGUgdGFnOyBcIl9fZGVmYXVsdFwiIGlzIHNwZWNpYWwgYW5kIHJlZmVycyB0b1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgdGhlIGRlZmF1bHQgdGFnIHZpc2libGUgdmlhIHRoZSBgdGFnYCBwcm9wZXJ0eS5cbiAgICAgKiBAcmV0dXJucyB7Kn0gdGhlIHZhbHVlIG9mIHRoZSBrZXlcbiAgICAgKlxuICAgICAqL1xuICAgIHNlbGYuZ2V0VGFnRm9yS2V5ID0gZnVuY3Rpb24gKCB0aGVLZXkgKSB7XG4gICAgICByZXR1cm4gc2VsZi5fdGFnc1t0aGVLZXldO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBZGQgYSBsaXN0ZW5lciB0byBhIHNwZWNpZmljIHRhZy4gVGhlIGxpc3RlbmVyIHdpbGwgcmVjZWl2ZSB0aHJlZVxuICAgICAqIHBhcmFtZXRlcnMgd2hlbmV2ZXIgdGhlIHRhZyBjaGFuZ2VzICh0aG91Z2ggdGhleSBhcmUgb3B0aW9uYWwpLiBUaGUgdGFnXG4gICAgICogaXRzZWxmIGRvZXNuJ3QgbmVlZCB0byBleGlzdCBpbiBvcmRlciB0byBhc3NpZ24gYSBsaXN0ZW5lciB0byBpdC5cbiAgICAgKlxuICAgICAqIFRoZSBmaXJzdCBwYXJhbWV0ZXIgaXMgdGhlIG9iamVjdCBmb3Igd2hpY2ggdGhlIHRhZyBoYXMgYmVlbiBjaGFuZ2VkLlxuICAgICAqIFRoZSBzZWNvbmQgcGFyYW1ldGVyIGlzIHRoZSB0YWcgYmVpbmcgY2hhbmdlZCwgYW5kIHRoZSB0aGlyZCBwYXJhbWV0ZXJcbiAgICAgKiBpcyB0aGUgdmFsdWUgb2YgdGhlIHRhZy4gKipOb3RlOioqIHRoZSB2YWx1ZSBoYXMgYWxyZWFkeSBjaGFuZ2VkIGJ5XG4gICAgICogdGhlIHRpbWUgdGhlIGxpc3RlbmVyIGlzIGNhbGxlZC5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgYWRkTGlzdGVuZXJGb3JLZXlcbiAgICAgKiBAcGFyYW0geyp9IHRoZUtleSBUaGUgdGFnIGZvciB3aGljaCB0byBhZGQgYSBsaXN0ZW5lcjsgYF9fZGVmYXVsdGBcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgIGlzIHNwZWNpYWwgYW5kIHJlZmVycyB0aGUgZGVmYXVsdCB0YWcgdmlzaWJsZSB2aWFcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgIHRoZSBgdGFnYCBwcm9wZXJ0eS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB0aGVMaXN0ZW5lciAgdGhlIGZ1bmN0aW9uIChvciByZWZlcmVuY2UpIHRvIGNhbGxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICAgKi9cbiAgICBzZWxmLmFkZFRhZ0xpc3RlbmVyRm9yS2V5ID0gZnVuY3Rpb24gKCB0aGVLZXksIHRoZUxpc3RlbmVyICkge1xuICAgICAgaWYgKCAhc2VsZi5fdGFnTGlzdGVuZXJzW3RoZUtleV0gKSB7XG4gICAgICAgIHNlbGYuX3RhZ0xpc3RlbmVyc1t0aGVLZXldID0gW107XG4gICAgICB9XG4gICAgICBzZWxmLl90YWdMaXN0ZW5lcnNbdGhlS2V5XS5wdXNoKCB0aGVMaXN0ZW5lciApO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSBiZWluZyBub3RpZmllZCB3aGVuIGEgdGFnIGNoYW5nZXMuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlbW92ZVRhZ0xpc3RlbmVyRm9yS2V5XG4gICAgICogQHBhcmFtIHsqfSB0aGVLZXkgIHRoZSB0YWcgZnJvbSB3aGljaCB0byByZW1vdmUgdGhlIGxpc3RlbmVyOyBgX19kZWZhdWx0YFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgaXMgc3BlY2lhbCBhbmQgcmVmZXJzIHRvIHRoZSBkZWZhdWx0IHRhZyB2aXNpYmxlIHZpYVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgdGhlIGB0YWdgIHByb3BlcnR5LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHRoZUxpc3RlbmVyICB0aGUgZnVuY3Rpb24gKG9yIHJlZmVyZW5jZSkgdG8gcmVtb3ZlLlxuICAgICAqXG4gICAgICovXG4gICAgc2VsZi5yZW1vdmVUYWdMaXN0ZW5lckZvcktleSA9IGZ1bmN0aW9uICggdGhlS2V5LCB0aGVMaXN0ZW5lciApIHtcbiAgICAgIGlmICggIXNlbGYuX3RhZ0xpc3RlbmVyc1t0aGVLZXldICkge1xuICAgICAgICBzZWxmLl90YWdMaXN0ZW5lcnNbdGhlS2V5XSA9IFtdO1xuICAgICAgfVxuICAgICAgdmFyIGkgPSBzZWxmLl90YWdMaXN0ZW5lcnNbdGhlS2V5XS5pbmRleE9mKCB0aGVMaXN0ZW5lciApO1xuICAgICAgaWYgKCBpID4gLTEgKSB7XG4gICAgICAgIHNlbGYuX3RhZ0xpc3RlbmVyc1t0aGVLZXldLnNwbGljZSggaSwgMSApO1xuICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIHNpbXBsZSB0YWcgKGBfX2RlZmF1bHRgKS4gQW55IGxpc3RlbmVycyBhdHRhY2hlZFxuICAgICAqIHRvIGBfX2RlZmF1bHRgIHdpbGwgYmUgbm90aWZpZWQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNldFRhZ1xuICAgICAqIEBwYXJhbSB7Kn0gdGhlVmFsdWUgIHRoZSB2YWx1ZSBmb3IgdGhlIHRhZ1xuICAgICAqXG4gICAgICovXG4gICAgc2VsZi5zZXRUYWcgPSBmdW5jdGlvbiAoIHRoZVZhbHVlICkge1xuICAgICAgc2VsZi5zZXRUYWdGb3JLZXkoIFwiX19kZWZhdWx0XCIsIHRoZVZhbHVlICk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybnMgdGhlIHZhbHVlIGZvciB0aGUgZ2l2ZW4gdGFnIChgX19kZWZhdWx0YCkuIElmIHRoZSB0YWcgaGFzIG5ldmVyIGJlZW5cbiAgICAgKiBzZXQsIHRoZSByZXN1bHQgaXMgdW5kZWZpbmVkLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRUYWdcbiAgICAgKiBAcmV0dXJucyB7Kn0gdGhlIHZhbHVlIG9mIHRoZSB0YWcuXG4gICAgICovXG4gICAgc2VsZi5nZXRUYWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gc2VsZi5nZXRUYWdGb3JLZXkoIFwiX19kZWZhdWx0XCIgKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogVGhlIGRlZmF1bHQgdGFnIGZvciB0aGUgaW5zdGFuY2UuIENoYW5naW5nIHRoZSB0YWcgaXRzZWxmIChub3QgYW55IHN1Yi1wcm9wZXJ0aWVzIG9mIGFuIG9iamVjdClcbiAgICAgKiB3aWxsIG5vdGlmeSBhbnkgbGlzdGVuZXJzIGF0dGFjaGVkIHRvIGBfX2RlZmF1bHRgLlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHRhZ1xuICAgICAqIEB0eXBlICpcbiAgICAgKlxuICAgICAqL1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZiwgXCJ0YWdcIiwge1xuICAgICAgZ2V0OiAgICAgICAgICBzZWxmLmdldFRhZyxcbiAgICAgIHNldDogICAgICAgICAgc2VsZi5zZXRUYWcsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9ICk7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBBbGwgb2JqZWN0cyBzdWJqZWN0IG5vdGlmaWNhdGlvbnMgZm9yIGV2ZW50c1xuICAgICAqXG4gICAgICovXG4gICAgLyoqXG4gICAgICogU3VwcG9ydHMgbm90aWZpY2F0aW9uIGxpc3RlbmVycy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwcm9wZXJ0eSBfbm90aWZpY2F0aW9uTGlzdGVuZXJzXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgc2VsZi5fbm90aWZpY2F0aW9uTGlzdGVuZXJzID0ge307XG4gICAgLyoqXG4gICAgICogQWRkcyBhIGxpc3RlbmVyIGZvciBhIG5vdGlmaWNhdGlvbi4gSWYgYSBub3RpZmljYXRpb24gaGFzIG5vdCBiZWVuXG4gICAgICogcmVnaXN0ZXJlZCAodmlhIGByZWdpc3Rlck5vdGlmaWNhdGlvbmApLCBhbiBlcnJvciBpcyBsb2dnZWQgb24gdGhlIGNvbnNvbGVcbiAgICAgKiBhbmQgdGhlIGZ1bmN0aW9uIHJldHVybnMgd2l0aG91dCBhdHRhY2hpbmcgdGhlIGxpc3RlbmVyLiBUaGlzIG1lYW5zIGlmXG4gICAgICogeW91IGFyZW4ndCB3YXRjaGluZyB0aGUgY29uc29sZSwgdGhlIGZ1bmN0aW9uIGZhaWxzIG5lYXJseSBzaWxlbnRseS5cbiAgICAgKlxuICAgICAqID4gQnkgZGVmYXVsdCwgbm8gbm90aWZpY2F0aW9ucyBhcmUgcmVnaXN0ZXJlZC5cbiAgICAgKlxuICAgICAqIElmIHRoZSBmaXJzdCBwYXJhbWV0ZXIgaXMgYW4gb2JqZWN0LCBtdWx0aXBsZSBsaXN0ZW5lcnMgY2FuIGJlIHJlZ2lzdGVyZWQ6XG4gICAgICogeyBcInZpZXdXaWxsQXBwZWFyXCI6IGhhbmRsZXIsIFwidmlld0RpZEFwcGVhclwiOiBoYW5kbGVyMn0uXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGFkZExpc3RlbmVyRm9yTm90aWZpY2F0aW9uXG4gICAgICogQGFsaWFzIG9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd8Kn0gdGhlTm90aWZpY2F0aW9uICB0aGUgbmFtZSBvZiB0aGUgbm90aWZpY2F0aW9uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gdGhlTGlzdGVuZXIgIHRoZSBmdW5jdGlvbiAob3IgcmVmZXJlbmNlKSB0byBiZSBjYWxsZWQgd2hlbiB0aGVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uIGlzIHRyaWdnZXJlZC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gcmV0dXJucyBzZWxmIGZvciBjaGFpbmluZ1xuICAgICAqL1xuICAgIHNlbGYuYWRkTGlzdGVuZXJGb3JOb3RpZmljYXRpb24gPSBmdW5jdGlvbiBhZGRMaXN0ZW5lckZvck5vdGlmaWNhdGlvbiggdGhlTm90aWZpY2F0aW9uLCB0aGVMaXN0ZW5lciwgYXN5bmMgKSB7XG4gICAgICBpZiAoIHRoZU5vdGlmaWNhdGlvbiBpbnN0YW5jZW9mIEFycmF5ICkge1xuICAgICAgICB0aGVOb3RpZmljYXRpb24uZm9yRWFjaCggZnVuY3Rpb24gKCBuICkge1xuICAgICAgICAgIGFkZExpc3RlbmVyRm9yTm90aWZpY2F0aW9uKCBuLCB0aGVMaXN0ZW5lciwgYXN5bmMgKTtcbiAgICAgICAgfSApO1xuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIHRoZU5vdGlmaWNhdGlvbiA9PT0gXCJvYmplY3RcIiApIHtcbiAgICAgICAgZm9yICggdmFyIG4gaW4gdGhlTm90aWZpY2F0aW9uICkge1xuICAgICAgICAgIGlmICggdGhlTm90aWZpY2F0aW9uLmhhc093blByb3BlcnR5KCBuICkgKSB7XG4gICAgICAgICAgICBhZGRMaXN0ZW5lckZvck5vdGlmaWNhdGlvbiggbiwgdGhlTm90aWZpY2F0aW9uW25dLCB0aGVMaXN0ZW5lciApOyAvLyBhc3luYyB3b3VsZCBzaGlmdCB1cFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH1cbiAgICAgIGlmICggIXNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVyc1t0aGVOb3RpZmljYXRpb25dICkge1xuICAgICAgICBzZWxmLnJlZ2lzdGVyTm90aWZpY2F0aW9uKCB0aGVOb3RpZmljYXRpb24sICggdHlwZW9mIGFzeW5jICE9PSBcInVuZGVmaW5lZFwiICkgPyBhc3luYyA6IGZhbHNlICk7XG4gICAgICB9XG4gICAgICBzZWxmLl9ub3RpZmljYXRpb25MaXN0ZW5lcnNbdGhlTm90aWZpY2F0aW9uXS5wdXNoKCB0aGVMaXN0ZW5lciApO1xuICAgICAgaWYgKCBzZWxmLl90cmFjZU5vdGlmaWNhdGlvbnMgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCBcIkFkZGluZyBsaXN0ZW5lciBcIiArIHRoZUxpc3RlbmVyICsgXCIgZm9yIG5vdGlmaWNhdGlvbiBcIiArIHRoZU5vdGlmaWNhdGlvbiApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcbiAgICBzZWxmLm9uID0gc2VsZi5hZGRMaXN0ZW5lckZvck5vdGlmaWNhdGlvbjtcbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBsaXN0ZW5lciB2YWxpZCBmb3Igb25lIG5vdGlmaWNhdGlvbiBvbmx5LiBJbW1lZGlhdGVseSBhZnRlclxuICAgICAqIEBtZXRob2Qgb25jZVxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gdGhlTm90aWZpY2F0aW9uIFtkZXNjcmlwdGlvbl1cbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHRoZUxpc3RlbmVyICAgICBbZGVzY3JpcHRpb25dXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSBhc3luYyAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgICBzZWxmLm9uY2UgPSBmdW5jdGlvbiBvbmNlKCB0aGVOb3RpZmljYXRpb24sIHRoZUxpc3RlbmVyLCBhc3luYyApIHtcbiAgICAgIHNlbGYuYWRkTGlzdGVuZXJGb3JOb3RpZmljYXRpb24oIHRoZU5vdGlmaWNhdGlvbiwgZnVuY3Rpb24gb25jZUhhbmRsZXIoIHNlbmRlciwgbm90aWNlLCBhcmdzICkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZUxpc3RlbmVyLmFwcGx5KCBzZWxmLCBbc2VsZiwgdGhlTm90aWZpY2F0aW9uLCBhcmdzXS5jb25jYXQoIGFyZ3VtZW50cyApICk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKCBlcnIgKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coIFwiT05DRSBIYW5kbGVyIGhhZCBhbiBlcnJvclwiLCBlcnIgKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLnJlbW92ZUxpc3RlbmVyRm9yTm90aWZpY2F0aW9uKCB0aGVOb3RpZmljYXRpb24sIG9uY2VIYW5kbGVyICk7XG4gICAgICB9LCBhc3luYyApO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZyb20gYSBub3RpZmljYXRpb24uIElmIGEgbm90aWZpY2F0aW9uIGhhcyBub3QgYmVlblxuICAgICAqIHJlZ2lzdGVyZWQgKHZpYSBgcmVnaXN0ZXJOb3RpZmljYXRpb25gKSwgYW4gZXJyb3IgaXMgbG9nZ2VkIG9uIHRoZSBjb25zb2xlXG4gICAgICogYW5kIHRoZSBmdW5jdGlvbiByZXR1cm5zIHdpdGhvdXQgYXR0YWNoaW5nIHRoZSBsaXN0ZW5lci4gVGhpcyBtZWFucyBpZlxuICAgICAqIHlvdSBhcmVuJ3Qgd2F0Y2hpbmcgdGhlIGNvbnNvbGUsIHRoZSBmdW5jdGlvbiBmYWlscyBuZWFybHkgc2lsZW50bHkuXG4gICAgICpcbiAgICAgKiA+IEJ5IGRlZmF1bHQsIG5vIG5vdGlmaWNhdGlvbnMgYXJlIHJlZ2lzdGVyZWQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlbW92ZUxpc3RlbmVyRm9yTm90aWZpY2F0aW9uXG4gICAgICogQGFsaWFzIG9mZlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aGVOb3RpZmljYXRpb24gIHRoZSBub3RpZmljYXRpb25cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB0aGVMaXN0ZW5lciAgVGhlIGZ1bmN0aW9uIG9yIHJlZmVyZW5jZSB0byByZW1vdmVcbiAgICAgKi9cbiAgICBzZWxmLnJlbW92ZUxpc3RlbmVyRm9yTm90aWZpY2F0aW9uID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXJGb3JOb3RpZmljYXRpb24oIHRoZU5vdGlmaWNhdGlvbiwgdGhlTGlzdGVuZXIgKSB7XG4gICAgICBpZiAoIHRoZU5vdGlmaWNhdGlvbiBpbnN0YW5jZW9mIEFycmF5ICkge1xuICAgICAgICB0aGVOb3RpZmljYXRpb24uZm9yRWFjaCggZnVuY3Rpb24gKCBuICkge1xuICAgICAgICAgIHJlbW92ZUxpc3RlbmVyRm9yTm90aWZpY2F0aW9uKCBuLCB0aGVMaXN0ZW5lciApO1xuICAgICAgICB9ICk7XG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2YgdGhlTm90aWZpY2F0aW9uID09PSBcIm9iamVjdFwiICkge1xuICAgICAgICBmb3IgKCB2YXIgbiBpbiB0aGVOb3RpZmljYXRpb24gKSB7XG4gICAgICAgICAgaWYgKCB0aGVOb3RpZmljYXRpb24uaGFzT3duUHJvcGVydHkoIG4gKSApIHtcbiAgICAgICAgICAgIHNlbGYucmVtb3ZlTGlzdGVuZXJGb3JOb3RpZmljYXRpb24oIG4sIHRoZU5vdGlmaWNhdGlvbltuXSApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH1cbiAgICAgIGlmICggIXNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVyc1t0aGVOb3RpZmljYXRpb25dICkge1xuICAgICAgICBjb25zb2xlLmxvZyggdGhlTm90aWZpY2F0aW9uICsgXCIgaGFzIG5vdCBiZWVuIHJlZ2lzdGVyZWQuXCIgKTtcbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG4gICAgICB2YXIgaSA9IHNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVyc1t0aGVOb3RpZmljYXRpb25dLmluZGV4T2YoIHRoZUxpc3RlbmVyICk7XG4gICAgICBpZiAoIHNlbGYuX3RyYWNlTm90aWZpY2F0aW9ucyApIHtcbiAgICAgICAgY29uc29sZS5sb2coIFwiUmVtb3ZpbmcgbGlzdGVuZXIgXCIgKyB0aGVMaXN0ZW5lciArIFwiIChpbmRleDogXCIgKyBpICsgXCIpIGZyb20gIG5vdGlmaWNhdGlvbiBcIiArIHRoZU5vdGlmaWNhdGlvbiApO1xuICAgICAgfVxuICAgICAgaWYgKCBpID4gLTEgKSB7XG4gICAgICAgIHNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVyc1t0aGVOb3RpZmljYXRpb25dLnNwbGljZSggaSwgMSApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcbiAgICBzZWxmLm9mZiA9IHNlbGYucmVtb3ZlTGlzdGVuZXJGb3JOb3RpZmljYXRpb247XG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgbm90aWZpY2F0aW9uIHNvIHRoYXQgbGlzdGVuZXJzIGNhbiB0aGVuIGJlIGF0dGFjaGVkLiBOb3RpZmljYXRpb25zXG4gICAgICogc2hvdWxkIGJlIHJlZ2lzdGVyZWQgYXMgc29vbiBhcyBwb3NzaWJsZSwgb3RoZXJ3aXNlIGxpc3RlbmVycyBtYXkgYXR0ZW1wdCB0b1xuICAgICAqIGF0dGFjaCB0byBhIG5vdGlmaWNhdGlvbiB0aGF0IGlzbid0IHJlZ2lzdGVyZWQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyTm90aWZpY2F0aW9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRoZU5vdGlmaWNhdGlvbiAgdGhlIG5hbWUgb2YgdGhlIG5vdGlmaWNhdGlvbi5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFzeW5jICBpZiB0cnVlLCBub3RpZmljYXRpb25zIGFyZSBzZW50IHdyYXBwZWQgaW4gc2V0VGltZW91dFxuICAgICAqL1xuICAgIHNlbGYucmVnaXN0ZXJOb3RpZmljYXRpb24gPSBmdW5jdGlvbiAoIHRoZU5vdGlmaWNhdGlvbiwgYXN5bmMgKSB7XG4gICAgICBpZiAoIHR5cGVvZiBzZWxmLl9ub3RpZmljYXRpb25MaXN0ZW5lcnNbdGhlTm90aWZpY2F0aW9uXSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgc2VsZi5fbm90aWZpY2F0aW9uTGlzdGVuZXJzW3RoZU5vdGlmaWNhdGlvbl0gPSBbXTtcbiAgICAgICAgc2VsZi5fbm90aWZpY2F0aW9uTGlzdGVuZXJzW3RoZU5vdGlmaWNhdGlvbl0uX3VzZUFzeW5jTm90aWZpY2F0aW9ucyA9ICggdHlwZW9mIGFzeW5jICE9PSBcInVuZGVmaW5lZFwiID8gYXN5bmMgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlICk7XG4gICAgICB9XG4gICAgICBpZiAoIHNlbGYuX3RyYWNlTm90aWZpY2F0aW9ucyApIHtcbiAgICAgICAgY29uc29sZS5sb2coIFwiUmVnaXN0ZXJpbmcgbm90aWZpY2F0aW9uIFwiICsgdGhlTm90aWZpY2F0aW9uICk7XG4gICAgICB9XG4gICAgfTtcbiAgICBzZWxmLl90cmFjZU5vdGlmaWNhdGlvbnMgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIF9kb05vdGlmaWNhdGlvbiggdGhlTm90aWZpY2F0aW9uLCBvcHRpb25zICkge1xuICAgICAgdmFyIGFyZ3MsXG4gICAgICAgIGxhc3RPbmx5ID0gZmFsc2U7XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBhcmdzID0gKCB0eXBlb2Ygb3B0aW9ucy5hcmdzICE9PSBcInVuZGVmaW5lZFwiICkgPyBvcHRpb25zLmFyZ3MgOiB1bmRlZmluZWQ7XG4gICAgICAgIGxhc3RPbmx5ID0gKCB0eXBlb2Ygb3B0aW9ucy5sYXN0T25seSAhPT0gXCJ1bmRlZmluZWRcIiApID8gb3B0aW9ucy5sYXN0T25seSA6IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCAhc2VsZi5fbm90aWZpY2F0aW9uTGlzdGVuZXJzW3RoZU5vdGlmaWNhdGlvbl0gKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGVOb3RpZmljYXRpb24gKyBcIiBoYXMgbm90IGJlZW4gcmVnaXN0ZXJlZC5cIiApO1xuICAgICAgICAvL3JldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICggc2VsZi5fdHJhY2VOb3RpZmljYXRpb25zICkge1xuICAgICAgICBpZiAoIHNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVyc1t0aGVOb3RpZmljYXRpb25dICkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCBcIk5vdGlmeWluZyBcIiArIHNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVyc1t0aGVOb3RpZmljYXRpb25dLmxlbmd0aCArIFwiIGxpc3RlbmVycyBmb3IgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICB0aGVOb3RpZmljYXRpb24gKyBcIiAoIFwiICsgYXJncyArIFwiICkgXCIgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyggXCJDYW4ndCBub3RpZnkgYW55IGV4cGxpY2l0IGxpc3RlbmVycyBmb3IgXCIsIHRoZU5vdGlmaWNhdGlvbiwgXCJidXQgd2lsZGNhcmRzIHdpbGwgZmlyZS5cIiApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgYXN5bmMgPSBzZWxmLl9ub3RpZmljYXRpb25MaXN0ZW5lcnNbdGhlTm90aWZpY2F0aW9uXSAhPT0gdW5kZWZpbmVkID8gc2VsZi5fbm90aWZpY2F0aW9uTGlzdGVuZXJzW1xuICAgICAgICAgIHRoZU5vdGlmaWNhdGlvbl0uX3VzZUFzeW5jTm90aWZpY2F0aW9ucyA6IHRydWUsXG4gICAgICAgIG5vdGlmeUxpc3RlbmVyID0gZnVuY3Rpb24gKCB0aGVMaXN0ZW5lciwgdGhlTm90aWZpY2F0aW9uLCBhcmdzICkge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB0aGVMaXN0ZW5lci5hcHBseSggc2VsZiwgW3NlbGYsIHRoZU5vdGlmaWNhdGlvbiwgYXJnc10uY29uY2F0KCBhcmd1bWVudHMgKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKCBlcnIgKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIldBUk5JTkdcIiwgdGhlTm90aWZpY2F0aW9uLCBcImV4cGVyaWVuY2VkIGFuIHVuY2F1Z2h0IGVycm9yOlwiLCBlcnIgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBoYW5kbGVycyA9IHNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVyc1t0aGVOb3RpZmljYXRpb25dICE9PSB1bmRlZmluZWQgPyBzZWxmLl9ub3RpZmljYXRpb25MaXN0ZW5lcnNbXG4gICAgICAgICAgdGhlTm90aWZpY2F0aW9uXS5zbGljZSgpIDogW107IC8vIGNvcHkhXG4gICAgICBpZiAoIGxhc3RPbmx5ICYmIGhhbmRsZXJzLmxlbmd0aCA+IDEgKSB7XG4gICAgICAgIGhhbmRsZXJzID0gW2hhbmRsZXJzLnBvcCgpXTtcbiAgICAgIH1cbiAgICAgIC8vIGF0dGFjaCAqIGhhbmRsZXJzXG4gICAgICB2YXIgaGFuZGxlciwgcHVzaCA9IGZhbHNlO1xuICAgICAgZm9yICggdmFyIGxpc3RlbmVyIGluIHNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVycyApIHtcbiAgICAgICAgaWYgKCBzZWxmLl9ub3RpZmljYXRpb25MaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoIGxpc3RlbmVyICkgKSB7XG4gICAgICAgICAgaGFuZGxlciA9IHNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVyc1tsaXN0ZW5lcl07XG4gICAgICAgICAgcHVzaCA9IGZhbHNlO1xuICAgICAgICAgIGlmICggbGlzdGVuZXIuaW5kZXhPZiggXCIqXCIgKSA+IC0xICkge1xuICAgICAgICAgICAgLy8gY2FuZGlkYXRlIGxpc3RlbmVyOyBzZWUgaWYgaXQgbWF0Y2hlc1xuICAgICAgICAgICAgaWYgKCBsaXN0ZW5lciA9PT0gXCIqXCIgKSB7XG4gICAgICAgICAgICAgIHB1c2ggPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggbGlzdGVuZXIuc3Vic3RyKCAwLCAxICkgPT09IFwiKlwiICYmIGxpc3RlbmVyLnN1YnN0ciggMSApID09PSB0aGVOb3RpZmljYXRpb24uc3Vic3RyKCAtMSAqICggbGlzdGVuZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5sZW5ndGggLSAxICkgKSApIHtcbiAgICAgICAgICAgICAgcHVzaCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBsaXN0ZW5lci5zdWJzdHIoIC0xLCAxICkgPT09IFwiKlwiICYmIGxpc3RlbmVyLnN1YnN0ciggMCwgbGlzdGVuZXIubGVuZ3RoIC0gMSApID09PSB0aGVOb3RpZmljYXRpb24uc3Vic3RyKFxuICAgICAgICAgICAgICAgIDAsIGxpc3RlbmVyLmxlbmd0aCAtIDEgKSApIHtcbiAgICAgICAgICAgICAgcHVzaCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgc3RhclBvcyA9IGxpc3RlbmVyLmluZGV4T2YoIFwiKlwiICk7XG4gICAgICAgICAgICAgIGlmICggbGlzdGVuZXIuc3Vic3RyKCAwLCBzdGFyUG9zICkgPT09IHRoZU5vdGlmaWNhdGlvbi5zdWJzdHIoIDAsIHN0YXJQb3MgKSAmJiBsaXN0ZW5lci5zdWJzdHIoIHN0YXJQb3MgKyAxICkgPT09XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVOb3RpZmljYXRpb24uc3Vic3RyKCAtMSAqICggbGlzdGVuZXIubGVuZ3RoIC0gc3RhclBvcyAtIDEgKSApICkge1xuICAgICAgICAgICAgICAgIHB1c2ggPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIHB1c2ggKSB7XG4gICAgICAgICAgICAgIGhhbmRsZXIuZm9yRWFjaCggZnVuY3Rpb24gKCBoYW5kbGVyICkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJzLnB1c2goIGhhbmRsZXIgKTtcbiAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yICggdmFyIGkgPSAwLCBsID0gaGFuZGxlcnMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICBpZiAoIGFzeW5jICkge1xuICAgICAgICAgIHNldFRpbWVvdXQoIG5vdGlmeUxpc3RlbmVyKCBoYW5kbGVyc1tpXSwgdGhlTm90aWZpY2F0aW9uLCBhcmdzICksIDAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAoIG5vdGlmeUxpc3RlbmVyKCBoYW5kbGVyc1tpXSwgdGhlTm90aWZpY2F0aW9uLCBhcmdzICkgKSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTm90aWZpZXMgYWxsIGxpc3RlbmVycyBvZiBhIHBhcnRpY3VsYXIgbm90aWZpY2F0aW9uIHRoYXQgdGhlIG5vdGlmaWNhdGlvblxuICAgICAqIGhhcyBiZWVuIHRyaWdnZXJlZC4gSWYgdGhlIG5vdGlmaWNhdGlvbiBoYXNuJ3QgYmVlbiByZWdpc3RlcmVkIHZpYVxuICAgICAqIGByZWdpc3Rlck5vdGlmaWNhdGlvbmAsIGFuIGVycm9yIGlzIGxvZ2dlZCB0byB0aGUgY29uc29sZSwgYnV0IHRoZSBmdW5jdGlvblxuICAgICAqIGl0c2VsZiByZXR1cm5zIHNpbGVudGx5LCBzbyBiZSBzdXJlIHRvIHdhdGNoIHRoZSBjb25zb2xlIGZvciBlcnJvcnMuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG5vdGlmeVxuICAgICAqIEBhbGlhcyBlbWl0XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRoZU5vdGlmaWNhdGlvbiAgdGhlIG5vdGlmaWNhdGlvbiB0byB0cmlnZ2VyXG4gICAgICogQHBhcmFtIHsqfSBbYXJnc10gIEFyZ3VtZW50cyB0byBwYXNzIHRvIHRoZSBsaXN0ZW5lcjsgdXN1YWxseSBhbiBhcnJheVxuICAgICAqL1xuICAgIHNlbGYubm90aWZ5ID0gZnVuY3Rpb24gKCB0aGVOb3RpZmljYXRpb24sIGFyZ3MgKSB7XG4gICAgICBfZG9Ob3RpZmljYXRpb24oIHRoZU5vdGlmaWNhdGlvbiwge1xuICAgICAgICBhcmdzOiAgICAgYXJncyxcbiAgICAgICAgbGFzdE9ubHk6IGZhbHNlXG4gICAgICB9ICk7XG4gICAgfTtcbiAgICBzZWxmLmVtaXQgPSBzZWxmLm5vdGlmeTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIE5vdGlmaWVzIG9ubHkgdGhlIG1vc3QgcmVjZW50IGxpc3RlbmVyIG9mIGEgcGFydGljdWxhciBub3RpZmljYXRpb24gdGhhdFxuICAgICAqIHRoZSBub3RpZmljYXRpb24gaGFzIGJlZW4gdHJpZ2dlcmVkLiBJZiB0aGUgbm90aWZpY2F0aW9uIGhhc24ndCBiZWVuIHJlZ2lzdGVyZWRcbiAgICAgKiB2aWEgYHJlZ2lzdGVyTm90aWZpY2F0aW9uYCwgYW4gZXJyb3IgaXMgbG9nZ2VkIHRvIHRoZSBjb25zb2xlLCBidXQgdGhlIGZ1bmN0aW9uXG4gICAgICogaXRzZWxmIHJldHVybnMgc2lsZW50bHkuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG5vdGlmeU1vc3RSZWNlbnRcbiAgICAgKiBAYWxpYXMgZW1pdFRvTGFzdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aGVOb3RpZmljYXRpb24gIHRoZSBzcGVjaWZpYyBub3RpZmljYXRpb24gdG8gdHJpZ2dlclxuICAgICAqIEBwYXJhbSB7Kn0gW2FyZ3NdICBBcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgbGlzdGVuZXI7IHVzdWFsbHkgYW4gYXJyYXlcbiAgICAgKi9cbiAgICBzZWxmLm5vdGlmeU1vc3RSZWNlbnQgPSBmdW5jdGlvbiAoIHRoZU5vdGlmaWNhdGlvbiwgYXJncyApIHtcbiAgICAgIF9kb05vdGlmaWNhdGlvbiggdGhlTm90aWZpY2F0aW9uLCB7XG4gICAgICAgIGFyZ3M6ICAgICBhcmdzLFxuICAgICAgICBsYXN0T25seTogdHJ1ZVxuICAgICAgfSApO1xuICAgIH07XG4gICAgc2VsZi5lbWl0VG9MYXN0ID0gc2VsZi5ub3RpZnlNb3N0UmVjZW50O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogRGVmaW5lcyBhIHByb3BlcnR5IG9uIHRoZSBvYmplY3QuIEVzc2VudGlhbGx5IHNob3J0aGFuZCBmb3IgYE9iamVjdC5kZWZpbmVQcm9wZXJ0eWAuIEFuXG4gICAgICogaW50ZXJuYWwgYF9wcm9wZXJ0eU5hbWVgIHZhcmlhYmxlIGlzIGRlY2xhcmVkIHdoaWNoIGdldHRlcnMgYW5kIHNldHRlcnMgY2FuIGFjY2Vzcy5cbiAgICAgKlxuICAgICAqIFRoZSBwcm9wZXJ0eSBjYW4gYmUgcmVhZC13cml0ZSwgcmVhZC1vbmx5LCBvciB3cml0ZS1vbmx5IGRlcGVuZGluZyBvbiB0aGUgdmFsdWVzIGluXG4gICAgICogYHByb3BlcnR5T3B0aW9ucy5yZWFkYCBhbmQgYHByb3BlcnR5T3B0aW9ucy53cml0ZWAuIFRoZSBkZWZhdWx0IGlzIHJlYWQtd3JpdGUuXG4gICAgICpcbiAgICAgKiBHZXR0ZXJzIGFuZCBzZXR0ZXJzIGNhbiBiZSBwcm92aWRlZCBpbiBvbmUgb2YgdHdvIHdheXM6IHRoZXkgY2FuIGJlIGF1dG9tYXRpY2FsbHlcbiAgICAgKiBkaXNjb3ZlcmVkIGJ5IGZvbGxvd2luZyBhIHNwZWNpZmljIG5hbWluZyBwYXR0ZXJuIChgZ2V0UHJvcGVydHlOYW1lYCkgaWZcbiAgICAgKiBgcHJvcGVydHlPcHRpb25zLnNlbGZEaXNjb3ZlcmAgaXMgYHRydWVgICh0aGUgZGVmYXVsdCkuIFRoZXkgY2FuIGFsc28gYmUgZXhwbGljaXRseVxuICAgICAqIGRlZmluZWQgYnkgc2V0dGluZyBgcHJvcGVydHlPcHRpb25zLmdldGAgYW5kIGBwcm9wZXJ0eU9wdGlvbnMuc2V0YC5cbiAgICAgKlxuICAgICAqIEEgcHJvcGVydHkgZG9lcyBub3QgbmVjZXNzYXJpbHkgbmVlZCBhIGdldHRlciBvciBzZXR0ZXIgaW4gb3JkZXIgdG8gYmUgcmVhZGFibGUgb3JcbiAgICAgKiB3cml0YWJsZS4gQSBiYXNpYyBwYXR0ZXJuIG9mIHNldHRpbmcgb3IgcmV0dXJuaW5nIHRoZSBwcml2YXRlIHZhcmlhYmxlIGlzIGltcGxlbWVudGVkXG4gICAgICogZm9yIGFueSBwcm9wZXJ0eSB3aXRob3V0IHNwZWNpZmljIGdldHRlcnMgYW5kIHNldHRlcnMgYnV0IHdobyBoYXZlIGluZGljYXRlIHRoYXQgdGhlXG4gICAgICogcHJvcGVydHkgaXMgcmVhZGFibGUgb3Igd3JpdGFibGUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYFxuICAgICAqIHNlbGYuZGVmaW5lUHJvcGVydHkgKCBcInNvbWVQcm9wZXJ0eVwiICk7ICAgICAgICAvLyBzb21lUHJvcGVydHksIHJlYWQtd3JpdGVcbiAgICAgKiBzZWxmLmRlZmluZVByb3BlcnR5ICggXCJhbm90aGVyUHJvcGVydHlcIiwgeyBkZWZhdWx0OiAyIH0gKTtcbiAgICAgKiBzZWxmLnNldFdpZHRoID0gZnVuY3Rpb24gKCBuZXdXaWR0aCwgb2xkV2lkdGggKVxuICAgICAqIHtcbiAgICAgICAqICAgIHNlbGYuX3dpZHRoID0gbmV3V2lkdGg7XG4gICAgICAgKiAgICBzZWxmLmVsZW1lbnQuc3R5bGUud2lkdGggPSBuZXdXaWR0aCArIFwicHhcIjtcbiAgICAgICAqIH1cbiAgICAgKiBzZWxmLmRlZmluZVByb3BlcnR5ICggXCJ3aWR0aFwiICk7ICAgLy8gYXV0b21hdGljYWxseSBkaXNjb3ZlcnMgc2V0V2lkdGggYXMgdGhlIHNldHRlci5cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGVmaW5lUHJvcGVydHlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlOYW1lICB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHk7IHVzZSBjYW1lbENhc2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydHlPcHRpb25zICB0aGUgdmFyaW91cyBvcHRpb25zIGFzIGRlc2NyaWJlZCBhYm92ZS5cbiAgICAgKi9cbiAgICBzZWxmLmRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gKCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5T3B0aW9ucyApIHtcbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBkZWZhdWx0OiAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgcmVhZDogICAgICAgICAgICB0cnVlLFxuICAgICAgICB3cml0ZTogICAgICAgICAgIHRydWUsXG4gICAgICAgIGdldDogICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgc2V0OiAgICAgICAgICAgICBudWxsLFxuICAgICAgICBzZWxmRGlzY292ZXI6ICAgIHRydWUsXG4gICAgICAgIHByZWZpeDogICAgICAgICAgXCJcIixcbiAgICAgICAgY29uZmlndXJhYmxlOiAgICB0cnVlLFxuICAgICAgICBiYWNraW5nVmFyaWFibGU6IHRydWVcbiAgICAgIH07XG4gICAgICAvLyBwcml2YXRlIHByb3BlcnRpZXMgYXJlIGhhbmRsZWQgZGlmZmVyZW50bHkgLS0gd2Ugd2FudCB0byBiZSBhYmxlIHRvIHNlYXJjaCBmb3JcbiAgICAgIC8vIF9nZXRQcml2YXRlUHJvcGVydHksIG5vdCBnZXRfcHJpdmF0ZVByb3BlcnR5XG4gICAgICBpZiAoIHByb3BlcnR5TmFtZS5zdWJzdHIoIDAsIDEgKSA9PT0gXCJfXCIgKSB7XG4gICAgICAgIG9wdGlvbnMucHJlZml4ID0gXCJfXCI7XG4gICAgICB9XG4gICAgICAvLyBhbGxvdyBvdGhlciBwb3RlbnRpYWwgcHJlZml4ZXNcbiAgICAgIGlmICggb3B0aW9ucy5wcmVmaXggIT09IFwiXCIgKSB7XG4gICAgICAgIGlmICggcHJvcGVydHlOYW1lLnN1YnN0ciggMCwgMSApID09PSBvcHRpb25zLnByZWZpeCApIHtcbiAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyKCAxICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIG1lcmdlIG91ciBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgdXNlciBvcHRpb25zXG4gICAgICBmb3IgKCB2YXIgcHJvcGVydHkgaW4gcHJvcGVydHlPcHRpb25zICkge1xuICAgICAgICBpZiAoIHByb3BlcnR5T3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSggcHJvcGVydHkgKSApIHtcbiAgICAgICAgICBvcHRpb25zW3Byb3BlcnR5XSA9IHByb3BlcnR5T3B0aW9uc1twcm9wZXJ0eV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIENhcGl0YWwgQ2FtZWwgQ2FzZSBvdXIgZnVuY3Rpb24gbmFtZXNcbiAgICAgIHZhciBmbk5hbWUgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyKCAwLCAxICkudG9VcHBlckNhc2UoKSArIHByb3BlcnR5TmFtZS5zdWJzdHIoIDEgKTtcbiAgICAgIHZhciBnZXRGbk5hbWUgPSBvcHRpb25zLnByZWZpeCArIFwiZ2V0XCIgKyBmbk5hbWUsXG4gICAgICAgIHNldEZuTmFtZSA9IG9wdGlvbnMucHJlZml4ICsgXCJzZXRcIiArIGZuTmFtZSxcbiAgICAgICAgX3Byb3BlcnR5TmFtZSA9IG9wdGlvbnMucHJlZml4ICsgXCJfXCIgKyBwcm9wZXJ0eU5hbWUsXG4gICAgICAgIF95X2dldEZuTmFtZSA9IG9wdGlvbnMucHJlZml4ICsgXCJfeV9nZXRcIiArIGZuTmFtZSxcbiAgICAgICAgX3lfc2V0Rm5OYW1lID0gb3B0aW9ucy5wcmVmaXggKyBcIl95X3NldFwiICsgZm5OYW1lLFxuICAgICAgICBfeV9fZ2V0Rm5OYW1lID0gb3B0aW9ucy5wcmVmaXggKyBcIl95X19nZXRcIiArIGZuTmFtZSxcbiAgICAgICAgX3lfX3NldEZuTmFtZSA9IG9wdGlvbnMucHJlZml4ICsgXCJfeV9fc2V0XCIgKyBmbk5hbWU7XG4gICAgICAvLyBpZiBnZXQvc2V0IGFyZSBub3Qgc3BlY2lmaWVkLCB3ZSdsbCBhdHRlbXB0IHRvIHNlbGYtZGlzY292ZXIgdGhlbVxuICAgICAgaWYgKCBvcHRpb25zLmdldCA9PT0gbnVsbCAmJiBvcHRpb25zLnNlbGZEaXNjb3ZlciApIHtcbiAgICAgICAgaWYgKCB0eXBlb2Ygc2VsZltnZXRGbk5hbWVdID09PSBcImZ1bmN0aW9uXCIgKSB7XG4gICAgICAgICAgb3B0aW9ucy5nZXQgPSBzZWxmW2dldEZuTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICggb3B0aW9ucy5zZXQgPT09IG51bGwgJiYgb3B0aW9ucy5zZWxmRGlzY292ZXIgKSB7XG4gICAgICAgIGlmICggdHlwZW9mIHNlbGZbc2V0Rm5OYW1lXSA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICAgIG9wdGlvbnMuc2V0ID0gc2VsZltzZXRGbk5hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBjcmVhdGUgdGhlIHByaXZhdGUgdmFyaWFibGVcbiAgICAgIGlmICggb3B0aW9ucy5iYWNraW5nVmFyaWFibGUgKSB7XG4gICAgICAgIHNlbGZbX3Byb3BlcnR5TmFtZV0gPSBvcHRpb25zLmRlZmF1bHQ7XG4gICAgICB9XG4gICAgICBpZiAoICFvcHRpb25zLnJlYWQgJiYgIW9wdGlvbnMud3JpdGUgKSB7XG4gICAgICAgIHJldHVybjsgLy8gbm90IHJlYWQvd3JpdGUsIHNvIG5vdGhpbmcgbW9yZS5cbiAgICAgIH1cbiAgICAgIHZhciBkZWZQcm9wT3B0aW9ucyA9IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBvcHRpb25zLmNvbmZpZ3VyYWJsZVxuICAgICAgfTtcbiAgICAgIGlmICggb3B0aW9ucy5yZWFkICkge1xuICAgICAgICBzZWxmW195X19nZXRGbk5hbWVdID0gb3B0aW9ucy5nZXQ7XG4gICAgICAgIHNlbGZbX3lfZ2V0Rm5OYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIGdldHRlciwgdXNlIGl0XG4gICAgICAgICAgaWYgKCB0eXBlb2Ygc2VsZltfeV9fZ2V0Rm5OYW1lXSA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGZbX3lfX2dldEZuTmFtZV0oIHNlbGZbX3Byb3BlcnR5TmFtZV0gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gb3RoZXJ3aXNlIHJldHVybiB0aGUgcHJpdmF0ZSB2YXJpYWJsZVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGZbX3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBpZiAoIHR5cGVvZiBzZWxmW2dldEZuTmFtZV0gPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgc2VsZltnZXRGbk5hbWVdID0gc2VsZltfeV9nZXRGbk5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGRlZlByb3BPcHRpb25zLmdldCA9IHNlbGZbX3lfZ2V0Rm5OYW1lXTtcbiAgICAgIH1cbiAgICAgIGlmICggb3B0aW9ucy53cml0ZSApIHtcbiAgICAgICAgc2VsZltfeV9fc2V0Rm5OYW1lXSA9IG9wdGlvbnMuc2V0O1xuICAgICAgICBzZWxmW195X3NldEZuTmFtZV0gPSBmdW5jdGlvbiAoIHYgKSB7XG4gICAgICAgICAgdmFyIG9sZFYgPSBzZWxmW19wcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgIGlmICggdHlwZW9mIHNlbGZbX3lfX3NldEZuTmFtZV0gPT09IFwiZnVuY3Rpb25cIiApIHtcbiAgICAgICAgICAgIHNlbGZbX3lfX3NldEZuTmFtZV0oIHYsIG9sZFYgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZltfcHJvcGVydHlOYW1lXSA9IHY7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICggb2xkViAhPT0gdiApIHtcbiAgICAgICAgICAgIHNlbGYubm90aWZ5RGF0YUJpbmRpbmdFbGVtZW50c0ZvcktleVBhdGgoIHByb3BlcnR5TmFtZSApO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCB0eXBlb2Ygc2VsZltzZXRGbk5hbWVdID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgIHNlbGZbc2V0Rm5OYW1lXSA9IHNlbGZbX3lfc2V0Rm5OYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBkZWZQcm9wT3B0aW9ucy5zZXQgPSBzZWxmW195X3NldEZuTmFtZV07XG4gICAgICB9XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIHNlbGYsIHByb3BlcnR5TmFtZSwgZGVmUHJvcE9wdGlvbnMgKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSBjdXN0b20gcHJvcGVydHksIHdoaWNoIGFsc28gaW1wbGVtZW50cyBhIGZvcm0gb2YgS1ZPLlxuICAgICAqXG4gICAgICogQW55IG9wdGlvbnMgbm90IHNwZWNpZmllZCBhcmUgZGVmYXVsdGVkIGluLiBUaGUgZGVmYXVsdCBpcyBmb3IgYSBwcm9wZXJ0eVxuICAgICAqIHRvIGJlIG9ic2VydmFibGUgKHdoaWNoIGZpcmVzIHRoZSBkZWZhdWx0IHByb3BlcnR5TmFtZUNoYW5nZWQgbm90aWNlKSxcbiAgICAgKiByZWFkL3dyaXRlIHdpdGggbm8gY3VzdG9tIGdldC9zZXQvdmFsaWRhdGUgcm91dGluZXMsIGFuZCBubyBkZWZhdWx0LlxuICAgICAqXG4gICAgICogT2JzZXJ2YWJsZSBQcm9wZXJ0aWVzIGNhbiBoYXZlIGdldHRlcnMsIHNldHRlcnMsIGFuZCB2YWxpZGF0b3JzLiBUaGV5IGNhbiBiZVxuICAgICAqIGF1dG9tYXRpY2FsbHkgZGlzY292ZXJlZCwgYXNzdW1pbmcgdGhleSBmb2xsb3cgdGhlIHBhdHRlcm4gYGdldE9ic2VydmFibGVQcm9wZXJ0eU5hbWVgLFxuICAgICAqIGBzZXRPYnNlcnZhYmxlUHJvcGVydHlOYW1lYCwgYW5kIGB2YWxpZGF0ZU9ic2VydmFibGVQcm9wZXJ0eU5hbWVgLiBUaGV5IGNhbiBhbHNvIGJlXG4gICAgICogc3BlY2lmaWVkIGV4cGxpY2l0bHkgYnkgc2V0dGluZyBgcHJvcGVydHlPcHRpb25zLmdldGAsIGBzZXRgLCBhbmQgYHZhbGlkYXRlYC5cbiAgICAgKlxuICAgICAqIFByb3BlcnRpZXMgY2FuIGJlIHJlYWQtd3JpdGUsIHJlYWQtb25seSwgb3Igd3JpdGUtb25seS4gVGhpcyBpcyBjb250cm9sbGVkIGJ5XG4gICAgICogYHByb3BlcnR5T3B0aW9ucy5yZWFkYCBhbmQgYHdyaXRlYC4gVGhlIGRlZmF1bHQgaXMgcmVhZC13cml0ZS5cbiAgICAgKlxuICAgICAqIFByb3BlcnRpZXMgY2FuIGhhdmUgYSBkZWZhdWx0IHZhbHVlIHByb3ZpZGVkIGFzIHdlbGwsIHNwZWNpZmllZCBieSBzZXR0aW5nXG4gICAgICogYHByb3BlcnR5T3B0aW9ucy5kZWZhdWx0YC5cbiAgICAgKlxuICAgICAqIEZpbmFsbHksIGEgbm90aWZpY2F0aW9uIG9mIHRoZSBmb3JtIGBwcm9wZXJ0eU5hbWVDaGFuZ2VkYCBpcyBmaXJlZCBpZlxuICAgICAqIHRoZSB2YWx1ZSBjaGFuZ2VzLiBJZiB0aGUgdmFsdWUgZG9lcyAqbm90KiBjaGFuZ2UsIHRoZSBub3RpZmljYXRpb24gaXMgbm90IGZpcmVkLlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBub3RpZmljYXRpb24gaXMgY29udHJvbGxlZCBieSBzZXR0aW5nIGBwcm9wZXJ0eU9wdGlvbnMubm90aWZpY2F0aW9uYC5cbiAgICAgKiBJZiB5b3UgbmVlZCBhIG5vdGlmaWNhdGlvbiB0byBmaXJlIHdoZW4gYSBwcm9wZXJ0eSBpcyBzaW1wbHkgc2V0IChyZWdhcmRsZXNzIG9mIHRoZVxuICAgICAqIGNoYW5nZSBpbiB2YWx1ZSksIHNldCBgcHJvcGVydHlPcHRpb25zLm5vdGlmeUFsd2F5c2AgdG8gYHRydWVgLlxuICAgICAqXG4gICAgICogS1ZPIGdldHRlcnMsIHNldHRlcnMsIGFuZCB2YWxpZGF0b3JzIGZvbGxvdyB2ZXJ5IGRpZmZlcmVudCBwYXR0ZXJucyB0aGFuIG5vcm1hbFxuICAgICAqIHByb3BlcnR5IGdldHRlcnMgYW5kIHNldHRlcnMuXG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiBzZWxmLmdldE9ic2VydmFibGVXaWR0aCA9IGZ1bmN0aW9uICggcmV0dXJuVmFsdWUgKSB7IHJldHVybiByZXR1cm5WYWx1ZTsgfTtcbiAgICAgKiBzZWxmLnNldE9ic2VydmFibGVXaWR0aCA9IGZ1bmN0aW9uICggbmV3VmFsdWUsIG9sZFZhbHVlICkgeyByZXR1cm4gbmV3VmFsdWU7IH07XG4gICAgICogc2VsZi52YWxpZGF0ZU9ic2VydmFibGVXaWR0aCA9IGZ1bmN0aW9uICggdGVzdFZhbHVlICkgeyByZXR1cm4gdGVzdFZhbHVlIT09MTA7IH07XG4gICAgICogc2VsZi5kZWZpbmVPYnNlcnZhYmxlUHJvcGVydHkgKCBcIndpZHRoXCIgKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGVmaW5lT2JzZXJ2YWJsZVByb3BlcnR5XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5TmFtZSBUaGUgc3BlY2lmaWMgcHJvcGVydHkgdG8gZGVmaW5lXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb3BlcnR5T3B0aW9ucyB0aGUgb3B0aW9ucyBmb3IgdGhpcyBwcm9wZXJ0eS5cbiAgICAgKlxuICAgICAqL1xuICAgIHNlbGYuZGVmaW5lT2JzZXJ2YWJsZVByb3BlcnR5ID0gZnVuY3Rpb24gKCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5T3B0aW9ucyApIHtcbiAgICAgIC8vIHNldCB0aGUgZGVmYXVsdCBvcHRpb25zIGFuZCBjb3B5IHRoZSBzcGVjaWZpZWQgb3B0aW9uc1xuICAgICAgdmFyIG9yaWdQcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUsXG4gICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgb2JzZXJ2YWJsZTogICB0cnVlLFxuICAgICAgICAgIG5vdGlmaWNhdGlvbjogcHJvcGVydHlOYW1lICsgXCJDaGFuZ2VkXCIsXG4gICAgICAgICAgZGVmYXVsdDogICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgcmVhZDogICAgICAgICB0cnVlLFxuICAgICAgICAgIHdyaXRlOiAgICAgICAgdHJ1ZSxcbiAgICAgICAgICBnZXQ6ICAgICAgICAgIG51bGwsXG4gICAgICAgICAgdmFsaWRhdGU6ICAgICBudWxsLFxuICAgICAgICAgIHNldDogICAgICAgICAgbnVsbCxcbiAgICAgICAgICBzZWxmRGlzY292ZXI6IHRydWUsXG4gICAgICAgICAgbm90aWZ5QWx3YXlzOiBmYWxzZSxcbiAgICAgICAgICBwcmVmaXg6ICAgICAgIFwiXCIsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH07XG4gICAgICAvLyBwcml2YXRlIHByb3BlcnRpZXMgYXJlIGhhbmRsZWQgZGlmZmVyZW50bHkgLS0gd2Ugd2FudCB0byBiZSBhYmxlIHRvIHNlYXJjaCBmb3JcbiAgICAgIC8vIF9nZXRQcml2YXRlUHJvcGVydHksIG5vdCBnZXRfcHJpdmF0ZVByb3BlcnR5XG4gICAgICBpZiAoIHByb3BlcnR5TmFtZS5zdWJzdHIoIDAsIDEgKSA9PT0gXCJfXCIgKSB7XG4gICAgICAgIG9wdGlvbnMucHJlZml4ID0gXCJfXCI7XG4gICAgICB9XG4gICAgICAvLyBhbGxvdyBvdGhlciBwb3RlbnRpYWwgcHJlZml4ZXNcbiAgICAgIGlmICggb3B0aW9ucy5wcmVmaXggIT09IFwiXCIgKSB7XG4gICAgICAgIGlmICggcHJvcGVydHlOYW1lLnN1YnN0ciggMCwgMSApID09PSBvcHRpb25zLnByZWZpeCApIHtcbiAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyKCAxICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBmbk5hbWUgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyKCAwLCAxICkudG9VcHBlckNhc2UoKSArIHByb3BlcnR5TmFtZS5zdWJzdHIoIDEgKTtcbiAgICAgIHZhciBnZXRPYnNlcnZhYmxlRm5OYW1lID0gb3B0aW9ucy5wcmVmaXggKyBcImdldE9ic2VydmFibGVcIiArIGZuTmFtZSxcbiAgICAgICAgc2V0T2JzZXJ2YWJsZUZuTmFtZSA9IG9wdGlvbnMucHJlZml4ICsgXCJzZXRPYnNlcnZhYmxlXCIgKyBmbk5hbWUsXG4gICAgICAgIHZhbGlkYXRlT2JzZXJ2YWJsZUZuTmFtZSA9IG9wdGlvbnMucHJlZml4ICsgXCJ2YWxpZGF0ZU9ic2VydmFibGVcIiArIGZuTmFtZSxcbiAgICAgICAgX3lfcHJvcGVydHlOYW1lID0gb3B0aW9ucy5wcmVmaXggKyBcIl95X1wiICsgcHJvcGVydHlOYW1lLFxuICAgICAgICBfeV9nZXRGbk5hbWUgPSBvcHRpb25zLnByZWZpeCArIFwiX3lfZ2V0XCIgKyBmbk5hbWUsXG4gICAgICAgIF95X3NldEZuTmFtZSA9IG9wdGlvbnMucHJlZml4ICsgXCJfeV9zZXRcIiArIGZuTmFtZSxcbiAgICAgICAgX3lfdmFsaWRhdGVGbk5hbWUgPSBvcHRpb25zLnByZWZpeCArIFwiX3lfdmFsaWRhdGVcIiArIGZuTmFtZSxcbiAgICAgICAgX3lfX2dldEZuTmFtZSA9IG9wdGlvbnMucHJlZml4ICsgXCJfeV9fZ2V0XCIgKyBmbk5hbWUsXG4gICAgICAgIF95X19zZXRGbk5hbWUgPSBvcHRpb25zLnByZWZpeCArIFwiX3lfX3NldFwiICsgZm5OYW1lLFxuICAgICAgICBfeV9fdmFsaWRhdGVGbk5hbWUgPSBvcHRpb25zLnByZWZpeCArIFwiX3lfX3ZhbGlkYXRlXCIgKyBmbk5hbWU7XG4gICAgICBmb3IgKCB2YXIgcHJvcGVydHkgaW4gcHJvcGVydHlPcHRpb25zICkge1xuICAgICAgICBpZiAoIHByb3BlcnR5T3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSggcHJvcGVydHkgKSApIHtcbiAgICAgICAgICBvcHRpb25zW3Byb3BlcnR5XSA9IHByb3BlcnR5T3B0aW9uc1twcm9wZXJ0eV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGlmIGdldC9zZXQgYXJlIG5vdCBzcGVjaWZpZWQsIHdlJ2xsIGF0dGVtcHQgdG8gc2VsZi1kaXNjb3ZlciB0aGVtXG4gICAgICBpZiAoIG9wdGlvbnMuZ2V0ID09PSBudWxsICYmIG9wdGlvbnMuc2VsZkRpc2NvdmVyICkge1xuICAgICAgICBpZiAoIHR5cGVvZiBzZWxmW2dldE9ic2VydmFibGVGbk5hbWVdID09PSBcImZ1bmN0aW9uXCIgKSB7XG4gICAgICAgICAgb3B0aW9ucy5nZXQgPSBzZWxmW2dldE9ic2VydmFibGVGbk5hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIG9wdGlvbnMuc2V0ID09PSBudWxsICYmIG9wdGlvbnMuc2VsZkRpc2NvdmVyICkge1xuICAgICAgICBpZiAoIHR5cGVvZiBzZWxmW3NldE9ic2VydmFibGVGbk5hbWVdID09PSBcImZ1bmN0aW9uXCIgKSB7XG4gICAgICAgICAgb3B0aW9ucy5zZXQgPSBzZWxmW3NldE9ic2VydmFibGVGbk5hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIG9wdGlvbnMudmFsaWRhdGUgPT09IG51bGwgJiYgb3B0aW9ucy5zZWxmRGlzY292ZXIgKSB7XG4gICAgICAgIGlmICggdHlwZW9mIHNlbGZbdmFsaWRhdGVPYnNlcnZhYmxlRm5OYW1lXSA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICAgIG9wdGlvbnMudmFsaWRhdGUgPSBzZWxmW3ZhbGlkYXRlT2JzZXJ2YWJsZUZuTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGlmIHRoZSBwcm9wZXJ0eSBpcyBvYnNlcnZhYmxlLCByZWdpc3RlciBpdHMgbm90aWZpY2F0aW9uXG4gICAgICBpZiAoIG9wdGlvbnMub2JzZXJ2YWJsZSApIHtcbiAgICAgICAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggb3B0aW9ucy5ub3RpZmljYXRpb24gKTtcbiAgICAgIH1cbiAgICAgIC8vIGNyZWF0ZSB0aGUgcHJpdmF0ZSB2YXJpYWJsZTsgX18gaGVyZSB0byBhdm9pZCBzZWxmLWRlZmluZWQgX1xuICAgICAgc2VsZltfeV9wcm9wZXJ0eU5hbWVdID0gb3B0aW9ucy5kZWZhdWx0O1xuICAgICAgaWYgKCAhb3B0aW9ucy5yZWFkICYmICFvcHRpb25zLndyaXRlICkge1xuICAgICAgICByZXR1cm47IC8vIG5vdCByZWFkL3dyaXRlLCBzbyBub3RoaW5nIG1vcmUuXG4gICAgICB9XG4gICAgICB2YXIgZGVmUHJvcE9wdGlvbnMgPSB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfTtcbiAgICAgIGlmICggb3B0aW9ucy5yZWFkICkge1xuICAgICAgICBzZWxmW195X19nZXRGbk5hbWVdID0gb3B0aW9ucy5nZXQ7XG4gICAgICAgIHNlbGZbX3lfZ2V0Rm5OYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIGdldHRlciwgdXNlIGl0XG4gICAgICAgICAgaWYgKCB0eXBlb2Ygc2VsZltfeV9fZ2V0Rm5OYW1lXSA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGZbX3lfX2dldEZuTmFtZV0oIHNlbGZbX3lfcHJvcGVydHlOYW1lXSApO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBvdGhlcndpc2UgcmV0dXJuIHRoZSBwcml2YXRlIHZhcmlhYmxlXG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZltfeV9wcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZGVmUHJvcE9wdGlvbnMuZ2V0ID0gc2VsZltfeV9nZXRGbk5hbWVdO1xuICAgICAgfVxuICAgICAgaWYgKCBvcHRpb25zLndyaXRlICkge1xuICAgICAgICBzZWxmW195X192YWxpZGF0ZUZuTmFtZV0gPSBvcHRpb25zLnZhbGlkYXRlO1xuICAgICAgICBzZWxmW195X19zZXRGbk5hbWVdID0gb3B0aW9ucy5zZXQ7XG4gICAgICAgIHNlbGZbX3lfc2V0Rm5OYW1lXSA9IGZ1bmN0aW9uICggdiApIHtcbiAgICAgICAgICB2YXIgb2xkViA9IHNlbGZbX3lfcHJvcGVydHlOYW1lXSxcbiAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoIHR5cGVvZiBzZWxmW195X192YWxpZGF0ZUZuTmFtZV0gPT09IFwiZnVuY3Rpb25cIiApIHtcbiAgICAgICAgICAgIHZhbGlkID0gc2VsZltfeV9fdmFsaWRhdGVGbk5hbWVdKCB2ICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICggdmFsaWQgKSB7XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBzZWxmW195X19zZXRGbk5hbWVdID09PSBcImZ1bmN0aW9uXCIgKSB7XG4gICAgICAgICAgICAgIHNlbGZbX3lfcHJvcGVydHlOYW1lXSA9IHNlbGZbX3lfX3NldEZuTmFtZV0oIHYsIG9sZFYgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlbGZbX3lfcHJvcGVydHlOYW1lXSA9IHY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIG9sZFYgIT09IHYgKSB7XG4gICAgICAgICAgICAgIHNlbGYubm90aWZ5RGF0YUJpbmRpbmdFbGVtZW50c0ZvcktleVBhdGgoIHByb3BlcnR5TmFtZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCB2ICE9PSBvbGRWIHx8IG9wdGlvbnMubm90aWZ5QWx3YXlzICkge1xuICAgICAgICAgICAgICBpZiAoIG9wdGlvbnMub2JzZXJ2YWJsZSApIHtcbiAgICAgICAgICAgICAgICBzZWxmLm5vdGlmeSggb3B0aW9ucy5ub3RpZmljYXRpb24sIHtcbiAgICAgICAgICAgICAgICAgIFwibmV3XCI6IHYsXG4gICAgICAgICAgICAgICAgICBcIm9sZFwiOiBvbGRWXG4gICAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBkZWZQcm9wT3B0aW9ucy5zZXQgPSBzZWxmW195X3NldEZuTmFtZV07XG4gICAgICB9XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIHNlbGYsIG9yaWdQcm9wZXJ0eU5hbWUsIGRlZlByb3BPcHRpb25zICk7XG4gICAgfTtcbiAgICAvKlxuICAgICAqIGRhdGEgYmluZGluZyBzdXBwb3J0XG4gICAgICovXG4gICAgc2VsZi5fZGF0YUJpbmRpbmdzID0ge307XG4gICAgc2VsZi5fZGF0YUJpbmRpbmdUeXBlcyA9IHt9O1xuICAgIC8vc2VsZi5fZGF0YUJpbmRpbmdFdmVudHMgPSBbIFwiaW5wdXRcIiwgXCJjaGFuZ2VcIiwgXCJrZXl1cFwiLCBcImJsdXJcIiBdO1xuICAgIHNlbGYuX2RhdGFCaW5kaW5nRXZlbnRzID0gW1wiaW5wdXRcIiwgXCJjaGFuZ2VcIiwgXCJibHVyXCJdO1xuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyZSBhIGRhdGEgYmluZGluZyB0byBhbiBIVE1MIGVsZW1lbnQgKGVsKSBmb3JcbiAgICAgKiBhIHBhcnRpY3VsYXIgcHJvcGVydHkgKGtleVBhdGgpLiBSZXR1cm5zIHNlbGYgZm9yIGNoYWluaW5nLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBkYXRhQmluZE9uXG4gICAgICogQHBhcmFtICB7Tm9kZX0gICBlbCAgICAgIHRoZSBET00gZWxlbWVudCB0byBiaW5kIHRvOyBtdXN0IHN1cHBvcnQgdGhlIGNoYW5nZSBldmVudCwgYW5kIG11c3QgaGF2ZSBhbiBJRFxuICAgICAqIEBwYXJhbSAge3N0cmluZ30ga2V5UGF0aCB0aGUgcHJvcGVydHkgdG8gb2JzZXJ2ZSAoc2hhbGxvdyBvbmx5OyBkb2Vzbid0IGZvbGxvdyBkb3RzLilcbiAgICAgKiBAcmV0dXJuIHsqfSAgICAgICAgICAgICAgc2VsZjsgY2hhaW4gYXdheSFcbiAgICAgKi9cbiAgICBzZWxmLmRhdGFCaW5kT24gPSBmdW5jdGlvbiBkYXRhQmluZE9uKCBlbCwga2V5UGF0aCwga2V5VHlwZSApIHtcbiAgICAgIGlmICggc2VsZi5fZGF0YUJpbmRpbmdzW2tleVBhdGhdID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHNlbGYuX2RhdGFCaW5kaW5nc1trZXlQYXRoXSA9IFtdO1xuICAgICAgfVxuICAgICAgc2VsZi5fZGF0YUJpbmRpbmdzW2tleVBhdGhdLnB1c2goIGVsICk7XG4gICAgICBzZWxmLl9kYXRhQmluZGluZ1R5cGVzW2tleVBhdGhdID0ga2V5VHlwZTtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSggXCJkYXRhLXkta2V5UGF0aFwiLCBrZXlQYXRoICk7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoIFwiZGF0YS15LWtleVR5cGVcIiwgKCBrZXlUeXBlICE9PSB1bmRlZmluZWQgPyBrZXlUeXBlIDogXCJzdHJpbmdcIiApICk7XG4gICAgICBzZWxmLl9kYXRhQmluZGluZ0V2ZW50cy5mb3JFYWNoKCBmdW5jdGlvbiAoIGV2dCApIHtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lciggZXZ0LCBzZWxmLnVwZGF0ZVByb3BlcnR5Rm9yS2V5UGF0aCwgZmFsc2UgKTtcbiAgICAgIH0gKTtcbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogVHVybiBvZmYgZGF0YSBiaW5kaW5nIGZvciBhIHBhcnRpY3VsYXIgZWxlbWVudCBhbmRcbiAgICAgKiBrZXlwYXRoLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBkYXRhQmluZE9mZlxuICAgICAqIEBwYXJhbSAge05vZGV9ICAgZWwgICAgICBlbGVtZW50IHRvIHJlbW92ZSBkYXRhIGJpbmRpbmcgZnJvbVxuICAgICAqIEBwYXJhbSAge3N0cmluZ30ga2V5UGF0aCBrZXlwYXRoIHRvIHN0b3Agb2JzZXJ2aW5nXG4gICAgICogQHJldHVybiB7Kn0gICAgICAgICAgICAgIHNlbGY7IGNoYWluIGF3YXkhXG4gICAgICovXG4gICAgc2VsZi5kYXRhQmluZE9mZiA9IGZ1bmN0aW9uIGRhdGFCaW5kT2ZmKCBlbCwga2V5UGF0aCApIHtcbiAgICAgIHZhciBrZXlQYXRoRWxzID0gc2VsZi5fZGF0YUJpbmRpbmdzW2tleVBhdGhdLFxuICAgICAgICBlbFBvcztcbiAgICAgIGlmICgga2V5UGF0aEVscyAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICBlbFBvcyA9IGtleVBhdGhFbHMuaW5kZXhPZiggZWwgKTtcbiAgICAgICAgaWYgKCBlbFBvcyA+IC0xICkge1xuICAgICAgICAgIGtleVBhdGhFbHMuc3BsaWNlKCBlbFBvcywgMSApO1xuICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSggXCJkYXRhLXkta2V5UGF0aFwiICk7XG4gICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCBcImRhdGEteS1rZXlUeXBlXCIgKTtcbiAgICAgICAgICBzZWxmLl9kYXRhQmluZGluZ0V2ZW50cy5mb3JFYWNoKCBmdW5jdGlvbiAoIGV2dCApIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoIGV2dCwgc2VsZi51cGRhdGVQcm9wZXJ0eUZvcktleVBhdGggKTtcbiAgICAgICAgICB9ICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFsbCBkYXRhIGJpbmRpbmdzIGZvciBhIGdpdmVuIHByb3BlcnR5XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGRhdGFCaW5kQWxsT2ZmRm9yS2V5UGF0aFxuICAgICAqIEBwYXJhbSAge1N0cmluZ30ga2V5UGF0aCBrZXlwYXRoIHRvIHN0b3Agb2JzZXJ2aW5nXG4gICAgICogQHJldHVybiB7Kn0gICAgICAgICAgICAgIHNlbGY7IGNoYWluIGF3YXlcbiAgICAgKi9cbiAgICBzZWxmLmRhdGFCaW5kQWxsT2ZmRm9yS2V5UGF0aCA9IGZ1bmN0aW9uIGRhdGFCaW5kQWxsT2ZmRm9yS2V5UGF0aCgga2V5UGF0aCApIHtcbiAgICAgIHZhciBrZXlQYXRoRWxzID0gc2VsZi5fZGF0YUJpbmRpbmdzW2tleVBhdGhdO1xuICAgICAgaWYgKCBrZXlQYXRoRWxzICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIGtleVBhdGhFbHMuZm9yRWFjaCggZnVuY3Rpb24gKCBlbCApIHtcbiAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoIFwiZGF0YS15LWtleVBhdGhcIiApO1xuICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSggXCJkYXRhLXkta2V5VHlwZVwiICk7XG4gICAgICAgICAgc2VsZi5fZGF0YUJpbmRpbmdFdmVudHMuZm9yRWFjaCggZnVuY3Rpb24gKCBldnQgKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCBldnQsIHNlbGYudXBkYXRlUHJvcGVydHlGb3JLZXlQYXRoICk7XG4gICAgICAgICAgfSApO1xuICAgICAgICB9ICk7XG4gICAgICAgIGtleVBhdGhFbHMgPSBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFsbCBkYXRhIGJpbmRpbmdzIGZvciB0aGlzIG9iamVjdFxuICAgICAqXG4gICAgICogQG1ldGhvZCBkYXRhQmluZEFsbE9mZlxuICAgICAqIEByZXR1cm4geyp9ICBzZWxmXG4gICAgICovXG4gICAgc2VsZi5kYXRhQmluZEFsbE9mZiA9IGZ1bmN0aW9uIGRhdGFCaW5kQWxsT2ZmKCkge1xuICAgICAgZm9yICggdmFyIGtleVBhdGggaW4gc2VsZi5fZGF0YUJpbmRpbmdzICkge1xuICAgICAgICBpZiAoIHNlbGYuX2RhdGFCaW5kaW5ncy5oYXNPd25Qcm9wZXJ0eSgga2V5UGF0aCApICkge1xuICAgICAgICAgIHNlbGYuZGF0YUJpbmRBbGxPZmZGb3JLZXlQYXRoKCBrZXlQYXRoICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBhIHByb3BlcnR5IG9uIHRoaXMgb2JqZWN0IGJhc2VkIG9uIHRoZVxuICAgICAqIGtleVBhdGggYW5kIHZhbHVlLiBJZiBjYWxsZWQgYXMgYW4gZXZlbnQgaGFuZGxlciwgYHRoaXNgIHJlZmVycyB0byB0aGVcbiAgICAgKiB0cmlnZ2VyaW5nIGVsZW1lbnQsIGFuZCBrZXlQYXRoIGlzIG9uIGBkYXRhLXkta2V5UGF0aGAgYXR0cmlidXRlLlxuICAgICAqXG4gICAgICogQG1ldGhvZCB1cGRhdGVQcm9wZXJ0eUZvcktleVBhdGhcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGtleVBhdGggcHJvcGVydHkgdG8gc2V0XG4gICAgICogQHBhcmFtICB7Kn0gdmFsdWUgICAgICAgIHZhbHVlIHRvIHNldFxuICAgICAqL1xuICAgIHNlbGYudXBkYXRlUHJvcGVydHlGb3JLZXlQYXRoID0gZnVuY3Rpb24gdXBkYXRlUHJvcGVydHlGb3JLZXlQYXRoKCBpbktleVBhdGgsIGluVmFsdWUsIGluS2V5VHlwZSApIHtcbiAgICAgIHZhciBrZXlUeXBlID0gaW5LZXlUeXBlLFxuICAgICAgICBrZXlQYXRoID0gaW5LZXlQYXRoLFxuICAgICAgICBkYXRhVmFsdWUgPSBpblZhbHVlLFxuICAgICAgICBlbFR5cGU7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIHRoaXMgIT09IHNlbGYgJiYgdGhpcyBpbnN0YW5jZW9mIE5vZGUgKSB7XG4gICAgICAgICAgLy8gd2UndmUgYmVlbiBjYWxsZWQgZnJvbSBhbiBldmVudCBoYW5kbGVyXG4gICAgICAgICAgaWYgKCB0aGlzLmdldEF0dHJpYnV0ZSggXCJkYXRhLXkta2V5VHlwZVwiICkgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIGtleVR5cGUgPSB0aGlzLmdldEF0dHJpYnV0ZSggXCJkYXRhLXkta2V5VHlwZVwiICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGtleVBhdGggPSB0aGlzLmdldEF0dHJpYnV0ZSggXCJkYXRhLXkta2V5UGF0aFwiICk7XG4gICAgICAgICAgZWxUeXBlID0gdGhpcy5nZXRBdHRyaWJ1dGUoIFwidHlwZVwiICk7XG4gICAgICAgICAgZGF0YVZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICBzd2l0Y2ggKCBrZXlUeXBlICkge1xuICAgICAgICAgICAgY2FzZSBcImludGVnZXJcIjpcbiAgICAgICAgICAgICAgc2VsZltrZXlQYXRoXSA9ICggZGF0YVZhbHVlID09PSBcIlwiICkgPyBudWxsIDogcGFyc2VJbnQoIGRhdGFWYWx1ZSwgMTAgKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZmxvYXRcIjpcbiAgICAgICAgICAgICAgc2VsZltrZXlQYXRoXSA9ICggZGF0YVZhbHVlID09PSBcIlwiICkgPyBudWxsIDogcGFyc2VGbG9hdCggZGF0YVZhbHVlICk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgICAgaWYgKCB0aGlzLmNoZWNrZWQgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICBzZWxmW2tleVBhdGhdID0gdGhpcy5jaGVja2VkO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGZba2V5UGF0aF0gPSAoIFwiXCIgKyBkYXRhVmFsdWUgKSA9PT0gXCIxXCIgfHwgZGF0YVZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZGF0ZVwiOlxuICAgICAgICAgICAgICBpZiAoIHRoaXMudHlwZSA9PT0gXCJ0ZXh0XCIgKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcInRyeWluZyB0byBwdWxsIGRhdGUgZnJvbSBcIiwgdGhpcy52YWx1ZSApO1xuICAgICAgICAgICAgICAgICAgc2VsZltrZXlQYXRoXSA9IG5ldyBEYXRlKCB0aGlzLnZhbHVlIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKCBlcnIgKSB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJub3BlOyBzZXQgdG8gbnVsbFwiICk7XG4gICAgICAgICAgICAgICAgICBzZWxmW2tleVBhdGhdID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZltrZXlQYXRoXSA9IHRoaXMudmFsdWVBc0RhdGU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBzZWxmW2tleVBhdGhdID0gZGF0YVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBrZXlUeXBlID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAga2V5VHlwZSA9IHNlbGYuX2RhdGFCaW5kaW5nVHlwZXNba2V5UGF0aF07XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICgga2V5VHlwZSApIHtcbiAgICAgICAgICBjYXNlIFwiaW50ZWdlclwiOlxuICAgICAgICAgICAgc2VsZltrZXlQYXRoXSA9IHBhcnNlSW50KCBkYXRhVmFsdWUsIDEwICk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiZmxvYXRcIjpcbiAgICAgICAgICAgIHNlbGZba2V5UGF0aF0gPSBwYXJzZUZsb2F0KCBkYXRhVmFsdWUgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgICAgICBpZiAoIGRhdGFWYWx1ZSA9PT0gXCIxXCIgfHwgZGF0YVZhbHVlID09PSAxIHx8IGRhdGFWYWx1ZS50b0xvd2VyQ2FzZSgpID09PSBcInRydWVcIiB8fCBkYXRhVmFsdWUgPT09IHRydWUgKSB7XG4gICAgICAgICAgICAgIHNlbGZba2V5UGF0aF0gPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VsZltrZXlQYXRoXSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImRhdGVcIjpcbiAgICAgICAgICAgIHNlbGZba2V5UGF0aF0gPSBuZXcgRGF0ZSggZGF0YVZhbHVlICk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgc2VsZltrZXlQYXRoXSA9IGRhdGFWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY2F0Y2ggKCBlcnIgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCBcIkZhaWxlZCB0byB1cGRhdGVcIiwga2V5UGF0aCwgXCJ3aXRoXCIsIGRhdGFWYWx1ZSwgXCJhbmRcIiwga2V5VHlwZSwgZXJyLCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIG5vdGlmeSBhbGwgZWxlbWVudHMgYXR0YWNoZWQgdG8gYVxuICAgICAqIGtleSBwYXRoIHRoYXQgdGhlIHNvdXJjZSB2YWx1ZSBoYXMgY2hhbmdlZC4gQ2FsbGVkIGJ5IGFsbCBwcm9wZXJ0aWVzIGNyZWF0ZWRcbiAgICAgKiB3aXRoIGRlZmluZVByb3BlcnR5IGFuZCBkZWZpbmVPYnNlcnZhYmxlUHJvcGVydHkuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIEBub3RpZnlEYXRhQmluZGluZ0VsZW1lbnRzRm9yS2V5UGF0aFxuICAgICAqIEBwYXJhbSAge1N0cmluZ30ga2V5UGF0aCBrZXlwYXRoIG9mIGVsZW1lbnRzIHRvIG5vdGlmeVxuICAgICAqL1xuICAgIHNlbGYubm90aWZ5RGF0YUJpbmRpbmdFbGVtZW50c0ZvcktleVBhdGggPSBmdW5jdGlvbiBub3RpZnlEYXRhQmluZGluZ0VsZW1lbnRzRm9yS2V5UGF0aCgga2V5UGF0aCApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBrZXlQYXRoRWxzID0gc2VsZi5fZGF0YUJpbmRpbmdzW2tleVBhdGhdLFxuICAgICAgICAgIGtleVR5cGUgPSBzZWxmLl9kYXRhQmluZGluZ1R5cGVzW2tleVBhdGhdLFxuICAgICAgICAgIGVsLCB2LCBlbFR5cGUsIHQsIGN1cnNvclBvcywgc2VsZWN0aW9uUG9zO1xuICAgICAgICBpZiAoIGtleVR5cGUgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICBrZXlUeXBlID0gXCJzdHJpbmdcIjtcbiAgICAgICAgfVxuICAgICAgICB2ID0gc2VsZltrZXlQYXRoXTtcbiAgICAgICAgaWYgKCB2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gbnVsbCApIHtcbiAgICAgICAgICB2ID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGtleVBhdGhFbHMgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBrZXlQYXRoRWxzLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcbiAgICAgICAgICAgIGVsID0ga2V5UGF0aEVsc1tpXTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmICggdHlwZW9mIGVsLnNlbGVjdGlvblN0YXJ0ID09PSBcIm51bWJlclwiICkge1xuICAgICAgICAgICAgICAgIGN1cnNvclBvcyA9IGVsLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvblBvcyA9IGVsLnNlbGVjdGlvbkVuZDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdXJzb3JQb3MgPSAtMTtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25Qb3MgPSAtMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKCBlcnIgKSB7XG4gICAgICAgICAgICAgIGN1cnNvclBvcyA9IC0xO1xuICAgICAgICAgICAgICBzZWxlY3Rpb25Qb3MgPSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsVHlwZSA9IGVsLmdldEF0dHJpYnV0ZSggXCJ0eXBlXCIgKTtcbiAgICAgICAgICAgIGlmICggZWxUeXBlID09PSBcImRhdGVcIiApIHtcbiAgICAgICAgICAgICAgaWYgKCBlbC50eXBlICE9PSBlbFR5cGUgKSB7XG4gICAgICAgICAgICAgICAgLy8gcHJvYmxlbTsgd2UgYWxtb3N0IGNlcnRhaW5seSBoYXZlIGEgZmllbGQgdGhhdCBkb2Vzbid0IHVuZGVyc3RhbmQgdmFsdWVBc0RhdGVcbiAgICAgICAgICAgICAgICBpZiAoIHYudG9JU09TdHJpbmcgKSB7XG4gICAgICAgICAgICAgICAgICB0ID0gdi50b0lTT1N0cmluZygpLnNwbGl0KCBcIlRcIiApWzBdO1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIFwidHJ5aW5nIHRvIHNldCB2YWx1ZSB0byAgXCIsIHQgKTtcbiAgICAgICAgICAgICAgICAgIGlmICggZWwudmFsdWUgIT09IHQgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcImRvaW5nIGl0ICBcIiwgdCApO1xuICAgICAgICAgICAgICAgICAgICBlbC52YWx1ZSA9IHQ7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJ2IGlzIGFuIHVuZXhwZWN0ZWQgdHlwZTogXCIgKyB0eXBlb2YgdiArIFwiOyBcIiArIHYgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCBlbC52YWx1ZUFzRGF0ZSAhPT0gdiApIHtcbiAgICAgICAgICAgICAgICAgIGVsLnZhbHVlQXNEYXRlID0gdjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGVsLnR5cGUgPT09IFwiY2hlY2tib3hcIiApIHtcbiAgICAgICAgICAgICAgZWwuaW5kZXRlcm1pbmF0ZSA9ICggdiA9PT0gdW5kZWZpbmVkIHx8IHYgPT09IG51bGwgKTtcbiAgICAgICAgICAgICAgaWYgKCBlbC5jaGVja2VkICE9PSB2ICkge1xuICAgICAgICAgICAgICAgIGVsLmNoZWNrZWQgPSB2O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2YgZWwudmFsdWUgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgICAgIGlmICggZWwudmFsdWUgIT0gdiB8fCAodiAhPT0gXCJcIiAmJiBlbC52YWx1ZSA9PT0gXCJcIikgKSB7XG4gICAgICAgICAgICAgICAgZWwudmFsdWUgPSB2O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHYpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIGVsLnRleHRDb250ZW50ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgICAgICBpZiAoIGVsLnRleHRDb250ZW50ICE9IHYgfHwgKHYgIT09IFwiXCIgJiYgZWwudGV4dENvbnRlbnQgIT09IFwiXCIpICkge1xuICAgICAgICAgICAgICAgIGVsLnRleHRDb250ZW50ID0gdjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIGVsLmlubmVyVGV4dCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICAgICAgaWYgKCBlbC5pbm5lclRleHQgIT0gdiB8fCAodiAhPT0gXCJcIiAmJiBlbC5pbm5lclRleHQgIT09IFwiXCIpICkge1xuICAgICAgICAgICAgICAgIGVsLmlubmVyVGV4dCA9IHY7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIkRhdGEgYmluZCBmYWlsdXJlOyBicm93c2VyIGRvZXNuJ3QgdW5kZXJzdGFuZCB2YWx1ZSwgdGV4dENvbnRlbnQsIG9yIGlubmVyVGV4dC5cIiApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCBjdXJzb3JQb3MgPiAtMSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBlbCApIHtcbiAgICAgICAgICAgICAgZWwuc2VsZWN0aW9uU3RhcnQgPSBjdXJzb3JQb3M7XG4gICAgICAgICAgICAgIGVsLnNlbGVjdGlvbkVuZCA9IHNlbGVjdGlvblBvcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNhdGNoICggZXJyICkge1xuICAgICAgICBjb25zb2xlLmxvZyggXCJGYWlsZWQgdG8gdXBkYXRlIGVsZW1lbnRzIGZvciBcIiwga2V5UGF0aCwgZXJyLCBhcmd1bWVudHMgKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEF1dG8gaW5pdGlhbGl6ZXMgdGhlIG9iamVjdCBiYXNlZCBvbiB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgb2JqZWN0IGNvbnN0cnVjdG9yLiBBbnkgb2JqZWN0XG4gICAgICogdGhhdCBkZXNpcmVzIHRvIGJlIGF1dG8taW5pdGlhbGl6YWJsZSBtdXN0IHBlcmZvcm0gdGhlIGZvbGxvd2luZyBwcmlvciB0byByZXR1cm5pbmcgdGhlbXNlbHZlczpcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIHNlbGYuX2F1dG9Jbml0LmFwcGx5IChzZWxmLCBhcmd1bWVudHMpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogRWFjaCBpbml0IG11c3QgY2FsbCB0aGUgc3VwZXIgb2YgaW5pdCwgYW5kIGVhY2ggaW5pdCBtdXN0IHJldHVybiBzZWxmLlxuICAgICAqXG4gICAgICogSWYgdGhlIGZpcnN0IHBhcmFtZXRlciB0byBfYXV0b0luaXQgKGFuZCB0aHVzIHRvIHRoZSBvYmplY3QgY29uc3RydWN0b3IpIGlzIGFuIG9iamVjdCxcbiAgICAgKiBpbml0V2l0aE9wdGlvbnMgaXMgY2FsbGVkIGlmIGl0IGV4aXN0cy4gT3RoZXJ3aXNlIGluaXQgaXMgY2FsbGVkIHdpdGggYWxsIHRoZSBhcmd1bWVudHMuXG4gICAgICpcbiAgICAgKiBJZiBOTyBhcmd1bWVudHMgYXJlIHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IgKGFuZCB0aHVzIHRvIHRoaXMgbWV0aG9kKSwgdGhlbiBub1xuICAgICAqIGF1dG8gaW5pdGlhbGl6YXRpb24gaXMgcGVyZm9ybWVkLiBJZiBvbmUgZGVzaXJlcyBhbiBhdXRvLWluaXQgb24gYW4gb2JqZWN0IHRoYXQgcmVxdWlyZXNcbiAgICAgKiBubyBwYXJhbWV0ZXJzLCBwYXNzIGEgZHVtbXkgcGFyYW1ldGVyIHRvIGVuc3VyZSBpbml0IHdpbGwgYmUgY2FsbGVkXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIF9hdXRvSW5pdFxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHNlbGYuX2F1dG9Jbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCBhcmd1bWVudHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgaWYgKCBhcmd1bWVudHMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAgIC8vIGNoYW5jZXMgYXJlIHRoaXMgaXMgYW4gaW5pdFdpdGhPcHRpb25zLCBidXQgbWFrZSBzdXJlIHRoZSBpbmNvbWluZyBwYXJhbWV0ZXIgaXMgYW4gb2JqZWN0XG4gICAgICAgICAgaWYgKCB0eXBlb2YgYXJndW1lbnRzWzBdID09PSBcIm9iamVjdFwiICkge1xuICAgICAgICAgICAgaWYgKCB0eXBlb2Ygc2VsZi5pbml0V2l0aE9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWxmLmluaXRXaXRoT3B0aW9ucy5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gc2VsZi5pbml0LmFwcGx5KCBzZWxmLCBhcmd1bWVudHMgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuaW5pdC5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzZWxmLmluaXQuYXBwbHkoIHNlbGYsIGFyZ3VtZW50cyApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJlYWRpZXMgYW4gb2JqZWN0IHRvIGJlIGRlc3Ryb3llZC4gVGhlIGJhc2Ugb2JqZWN0IG9ubHkgY2xlYXJzIHRoZSBub3RpZmljYXRpb25zIGFuZFxuICAgICAqIHRoZSBhdHRhY2hlZCBsaXN0ZW5lcnMuXG4gICAgICogQG1ldGhvZCBkZXN0cm95XG4gICAgICovXG4gICAgc2VsZi5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gY2xlYXIgZGF0YSBiaW5kaW5nc1xuICAgICAgc2VsZi5kYXRhQmluZEFsbE9mZigpO1xuICAgICAgLy8gY2xlYXIgYW55IGxpc3RlbmVycy5cbiAgICAgIHNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVycyA9IHt9O1xuICAgICAgc2VsZi5fdGFnTGlzdGVuZXJzID0ge307XG4gICAgICBzZWxmLl9jb25zdHJ1Y3RPYmplY3RDYXRlZ29yaWVzKCBCYXNlT2JqZWN0Lk9OX0RFU1RST1lfQ0FURUdPUlkgKTtcbiAgICAgIC8vIHJlYWR5IHRvIGJlIGRlc3Ryb3llZFxuICAgIH07XG4gICAgLy8gc2VsZi1jYXRlZ29yaXplXG4gICAgc2VsZi5fY29uc3RydWN0T2JqZWN0Q2F0ZWdvcmllcygpO1xuICAgIC8vIGNhbGwgYXV0byBpbml0XG4gICAgc2VsZi5fYXV0b0luaXQuYXBwbHkoIHNlbGYsIGFyZ3VtZW50cyApO1xuICAgIC8vIGRvbmVcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcbi8qKlxuICogUHJvbW90ZXMgYSBub24tQmFzZU9iamVjdCBpbnRvIGEgQmFzZU9iamVjdCBieSBjb3B5aW5nIGFsbCBpdHMgbWV0aG9kcyB0b1xuICogdGhlIG5ldyBvYmplY3QgYW5kIGNvcHlpbmcgYWxsIGl0cyBwcm9wZXJ0aWVzIGFzIG9ic2VydmFibGUgcHJvcGVydGllcy5cbiAqXG4gKiBAbWV0aG9kIHByb21vdGVcbiAqIEBwYXJhbSAgeyp9IG5vbkJhc2VPYmplY3QgVGhlIG5vbi1CYXNlT2JqZWN0IHRvIHByb21vdGVcbiAqIEByZXR1cm4ge0Jhc2VPYmplY3R9ICAgICAgICAgICAgICAgQmFzZU9iamVjdFxuICovXG5CYXNlT2JqZWN0LnByb21vdGUgPSBmdW5jdGlvbiBwcm9tb3RlKCBub25CYXNlT2JqZWN0ICkge1xuICB2YXIgbmV3QmFzZU9iamVjdCwgdGhlUHJvcDtcbiAgaWYgKCBub25CYXNlT2JqZWN0ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgbmV3QmFzZU9iamVjdCA9IG5ldyBCYXNlT2JqZWN0KCk7XG4gICAgZm9yICggdmFyIHByb3AgaW4gbm9uQmFzZU9iamVjdCApIHtcbiAgICAgIGlmICggbm9uQmFzZU9iamVjdC5oYXNPd25Qcm9wZXJ0eSggcHJvcCApICkge1xuICAgICAgICB0aGVQcm9wID0gbm9uQmFzZU9iamVjdFtwcm9wXTtcbiAgICAgICAgaWYgKCB0eXBlb2YgdGhlUHJvcCA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICAgIG5ld0Jhc2VPYmplY3RbcHJvcF0gPSB0aGVQcm9wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0Jhc2VPYmplY3QuZGVmaW5lT2JzZXJ2YWJsZVByb3BlcnR5KCBwcm9wLCB7XG4gICAgICAgICAgICBkZWZhdWx0OiB0aGVQcm9wXG4gICAgICAgICAgfSApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXdCYXNlT2JqZWN0O1xufTtcbi8qKlxuICogT2JqZWN0IGNhdGVnb3JpZXMuIE9mIHRoZSBmb3JtOlxuICpcbiAqIGBgYFxuICogeyBjbGFzc05hbWU6IFsgY29uc3RydWN0b3IxLCBjb25zdHJ1Y3RvcjIsIC4uLiBdLCAuLi4gfVxuICogYGBgXG4gKlxuICogR2xvYmFsIHRvIHRoZSBhcHAgYW5kIGxpYnJhcnkuIEJhc2VPYmplY3QncyBpbml0KCkgbWV0aG9kIHdpbGwgY2FsbCBlYWNoIGNhdGVnb3J5IGluIHRoZSBjbGFzcyBoaWVyYXJjaHkuXG4gKlxuICogQHByb3BlcnR5IF9vYmplY3RDYXRlZ29yaWVzXG4gKiBAdHlwZSB7e319XG4gKiBAcHJpdmF0ZVxuICovXG5CYXNlT2JqZWN0Ll9vYmplY3RDYXRlZ29yaWVzID0gW3t9LCB7fSwge31dO1xuQmFzZU9iamVjdC5PTl9DUkVBVEVfQ0FURUdPUlkgPSAwO1xuQmFzZU9iamVjdC5PTl9JTklUX0NBVEVHT1JZID0gMTtcbkJhc2VPYmplY3QuT05fREVTVFJPWV9DQVRFR09SWSA9IDI7XG4vKipcbiAqIFJlZ2lzdGVyIGEgY2F0ZWdvcnkgY29uc3RydWN0b3IgZm9yIGEgc3BlY2lmaWMgY2xhc3MuIFRoZSBmdW5jdGlvbiBtdXN0IHRha2UgYHNlbGZgIGFzIGEgcGFyYW1ldGVyLCBhbmQgbXVzdFxuICogbm90IGFzc3VtZSB0aGUgcHJlc2VuY2Ugb2YgYW55IG90aGVyIGNhdGVnb3J5XG4gKlxuICogVGhlIG9wdGlvbnMgcGFyYW1ldGVyIHRha2VzIHRoZSBmb3JtOlxuICpcbiAqIGBgYFxuICogeyBjbGFzczogY2xhc3MgbmFtZSB0byByZWdpc3RlciBmb3JcbiAgICogICBtZXRob2Q6IGNvbnN0cnVjdG9yIG1ldGhvZFxuICAgKiAgIHByaW9yaXR5OiBPTl9DUkVBVEVfQ0FURUdPUlkgb3IgT05fSU5JVF9DQVRFR09SWVxuICAgKiB9XG4gKiBgYGBcbiAqXG4gKiBAbWV0aG9kIHJlZ2lzdGVyQ2F0ZWdvcnlDb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuQmFzZU9iamVjdC5yZWdpc3RlckNhdGVnb3J5Q29uc3RydWN0b3IgPSBmdW5jdGlvbiByZWdpc3RlckNhdGVnb3J5Q29uc3RydWN0b3IoIG9wdGlvbnMgKSB7XG4gIGlmICggdHlwZW9mIG9wdGlvbnMgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCBcInJlZ2lzdGVyQ2F0ZWdvcnlDb25zdHJ1Y3RvciByZXF1aXJlcyBhIGNsYXNzIG5hbWUgYW5kIGEgY29uc3RydWN0b3IgbWV0aG9kLlwiICk7XG4gIH1cbiAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5jbGFzcyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoIFwicmVnaXN0ZXJDYXRlZ29yeUNvbnN0cnVjdG9yIHJlcXVpcmVzIG9wdGlvbnMuY2xhc3NcIiApO1xuICB9XG4gIGlmICggdHlwZW9mIG9wdGlvbnMubWV0aG9kICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgIHRocm93IG5ldyBFcnJvciggXCJyZWdpc3RlckNhdGVnb3J5Q29uc3RydWN0b3IgcmVxdWlyZXMgb3B0aW9ucy5tZXRob2RcIiApO1xuICB9XG4gIHZhciBjbGFzc05hbWUgPSBvcHRpb25zLmNsYXNzO1xuICB2YXIgbWV0aG9kID0gb3B0aW9ucy5tZXRob2Q7XG4gIHZhciBwcmlvcml0eSA9IEJhc2VPYmplY3QuT05fQ1JFQVRFX0NBVEVHT1JZO1xuICBpZiAoIHR5cGVvZiBvcHRpb25zLnByaW9yaXR5ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgIHByaW9yaXR5ID0gb3B0aW9ucy5wcmlvcml0eTtcbiAgfVxuICBpZiAoIHR5cGVvZiBCYXNlT2JqZWN0Ll9vYmplY3RDYXRlZ29yaWVzW3ByaW9yaXR5XVtjbGFzc05hbWVdID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgIEJhc2VPYmplY3QuX29iamVjdENhdGVnb3JpZXNbcHJpb3JpdHldW2NsYXNzTmFtZV0gPSBbXTtcbiAgfVxuICBCYXNlT2JqZWN0Ll9vYmplY3RDYXRlZ29yaWVzW3ByaW9yaXR5XVtjbGFzc05hbWVdLnB1c2goIG1ldGhvZCApO1xufTtcbi8qKlxuICogRXh0ZW5kIChzdWJjbGFzcykgYW4gb2JqZWN0LiBgb2Agc2hvdWxkIGJlIG9mIHRoZSBmb3JtOlxuICpcbiAqIHtcbiAgICogICBjbGFzc05hbWU6IFwiTmV3Q2xhc3NcIixcbiAgICogICBwcm9wZXJ0aWVzOiBbXSxcbiAgICogICBvYnNlcnZhYmxlUHJvcGVydGllczogW10sXG4gICAqICAgbWV0aG9kczogW10sXG4gICAqICAgb3ZlcnJpZGVzOiBbXVxuICAgKiB9XG4gKlxuICogQG1ldGhvZCAgIGV4dGVuZFxuICpcbiAqIEBwYXJhbSAgICB7W3R5cGVdfSAgIGNsYXNzT2JqZWN0ICAgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICAgIHtbdHlwZV19ICAgbyAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gKlxuICogQHJldHVybiAgIHtbdHlwZV19ICAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbkJhc2VPYmplY3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kKCBjbGFzc09iamVjdCwgbyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHt9O1xufTtcbkJhc2VPYmplY3QubWV0YSA9IHtcbiAgdmVyc2lvbjogICAgICAgICAgIFwiMDAuMDUuMTAxXCIsXG4gIGNsYXNzOiAgICAgICAgICAgICBfY2xhc3NOYW1lLFxuICBhdXRvSW5pdGlhbGl6YWJsZTogdHJ1ZSxcbiAgY2F0ZWdvcml6YWJsZTogICAgIHRydWVcbn07XG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VPYmplY3Q7XG4iLCIvKipcbiAqXG4gKiAjIHNpbXBsZSByb3V0aW5nXG4gKlxuICogQG1vZHVsZSByb3V0ZXIuanNcbiAqIEBhdXRob3IgS2VycmkgU2hvdHRzXG4gKiBAdmVyc2lvbiAwLjFcbiAqXG4gKiBTaW1wbGUgZXhhbXBsZTpcbiAqIGBgYFxuICogdmFyIHkgPSBmdW5jdGlvbiAodixzLHIsdCx1KSB7IGNvbnNvbGUubG9nKHYscyxyLHQsdSk7IH0sIHJvdXRlciA9IF95LlJvdXRlcjtcbiAqIHJvdXRlci5hZGRVUkwgKCBcIi9cIiwgXCJIb21lXCIgKVxuICogLmFkZFVSTCAoIFwiL3Rhc2tcIiwgXCJUYXNrIExpc3RcIiApXG4gKiAuYWRkVVJMICggXCIvdGFzay86dGFza0lkXCIsIFwiVGFzayBWaWV3XCIgKVxuICogLmFkZEhhbmRsZXIgKCBcIi9cIiwgeSApXG4gKiAuYWRkSGFuZGxlciAoIFwiL3Rhc2tcIiwgeSApXG4gKiAuYWRkSGFuZGxlciAoIFwiL3Rhc2svOnRhc2tJZFwiLCB5IClcbiAqIC5yZXBsYWNlKCBcIi9cIiwgMSlcbiAqIC5saXN0ZW4oKTtcbiAqIGBgYFxuICpcbiAqIGBgYFxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtlcnJpIFNob3R0cywgcGhvdG9LYW5keSBTdHVkaW9zIExMQ1xuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nXG4gKiBjb25kaXRpb25zOlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllc1xuICogb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUlxuICogUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuICogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVFxuICogT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1JcbiAqIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqIGBgYFxuICovXG4vKmdsb2JhbCBtb2R1bGUsIE5vZGUsIGRvY3VtZW50LCBoaXN0b3J5LCB3aW5kb3csIGNvbnNvbGUqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgcm91dGVzID0gW107XG4vKipcbiAqIFBhcnNlcyBhIFVSTCBpbnRvIGl0cyBjb25zdGl0dWVudCBwYXJ0cy4gVGhlIHJldHVybiB2YWx1ZVxuICogaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBhdGgsIHRoZSBxdWVyeSwgYW5kIHRoZSBoYXNoIGNvbXBvbmVudHMuXG4gKiBFYWNoIG9mIHRob3NlIGlzIGFsc28gc3BsaXQgdXAgaW50byBwYXJ0cyAtLSBwYXRoIGFuZCBoYXNoIHNlcGFyYXRlZFxuICogYnkgc2xhc2hlcywgd2hpbGUgcXVlcnkgaXMgc2VwYXJhdGVkIGJ5IGFtcGVyc2FuZHMuIElmIGhhc2ggaXMgZW1wdHlcbiAqIHRoaXMgcm91dGluZSB0cmVhdGVzIGl0IGFzIGEgXCIjL1wiIHVubGVzZSBgcGFyc2VIYXNoYCBpcyBgZmFsc2VgLlxuICogVGhlIGBiYXNlVVJMYCBpcyBhbHNvIHJlbW92ZWQgZnJvbSB0aGUgcGF0aDsgaWYgbm90IHNwZWNpZmllZCBpdFxuICogZGVmYXVsdHMgdG8gYC9gLlxuICpcbiAqIEBtZXRob2QgcGFyc2VVUkxcbiAqIEBwYXJhbSAge1N0cmluZ30gIHVybCAgICAgICAgdXJsIHRvIHBhcnNlXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICBiYXNlVVJMICAgIG9wdGlvbmFsIGJhc2UgdXJsLCBkZWZhdWx0cyB0byBcIi9cIlxuICogQHBhcmFtICB7Qm9vbGVhbn0gcGFyc2VIYXNoICBvcHRpb25hbCwgaW5kaWNhdGVzIGlmIGhhc2ggc2hvdWxkIGJlIHBhcnNlZCB3aXRoIHNsYXNoZXNcbiAqIEByZXR1cm4geyp9ICAgICAgICAgICAgICAgICAgY29tcG9uZW50IHBpZWNlc1xuICovXG5mdW5jdGlvbiBwYXJzZVVSTCggdXJsLCBiYXNlVVJMLCBwYXJzZUhhc2ggKSB7XG4gIGlmICggYmFzZVVSTCA9PT0gdW5kZWZpbmVkICkge1xuICAgIGJhc2VVUkwgPSBcIi9cIjtcbiAgfVxuICBpZiAoIHBhcnNlSGFzaCA9PT0gdW5kZWZpbmVkICkge1xuICAgIHBhcnNlSGFzaCA9IHRydWU7XG4gIH1cbiAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImFcIiApLFxuICAgIHBhdGhTdHJpbmcsXG4gICAgcXVlcnlTdHJpbmcsXG4gICAgaGFzaFN0cmluZyxcbiAgICBxdWVyeVBhcnRzLCBwYXRoUGFydHMsIGhhc2hQYXJ0cztcbiAgLy8gcGFyc2UgdGhlIHVybFxuICBhLmhyZWYgPSB1cmw7XG4gIHBhdGhTdHJpbmcgPSBkZWNvZGVVUklDb21wb25lbnQoIGEucGF0aG5hbWUgKTtcbiAgcXVlcnlTdHJpbmcgPSBkZWNvZGVVUklDb21wb25lbnQoIGEuc2VhcmNoICk7XG4gIGhhc2hTdHJpbmcgPSBkZWNvZGVVUklDb21wb25lbnQoIGEuaGFzaCApO1xuICBpZiAoIGhhc2hTdHJpbmcgPT09IFwiXCIgJiYgcGFyc2VIYXNoICkge1xuICAgIGhhc2hTdHJpbmcgPSBcIiMvXCI7XG4gIH1cbiAgLy8gcmVtb3ZlIHRoZSBiYXNlIHVybFxuICBpZiAoIHBhdGhTdHJpbmcuc3Vic3RyKCAwLCBiYXNlVVJMLmxlbmd0aCApID09PSBiYXNlVVJMICkge1xuICAgIHBhdGhTdHJpbmcgPSBwYXRoU3RyaW5nLnN1YnN0ciggYmFzZVVSTC5sZW5ndGggKTtcbiAgfVxuICAvLyBkb24ndCBuZWVkIHRoZSA/IG9yICMgb24gdGhlIHF1ZXJ5L2hhc2ggc3RyaW5nXG4gIHF1ZXJ5U3RyaW5nID0gcXVlcnlTdHJpbmcuc3Vic3RyKCAxICk7XG4gIGhhc2hTdHJpbmcgPSBoYXNoU3RyaW5nLnN1YnN0ciggMSApO1xuICAvLyBzcGxpdCB0aGUgcXVlcnkgc3RyaW5nXG4gIHF1ZXJ5UGFydHMgPSBxdWVyeVN0cmluZy5zcGxpdCggXCImXCIgKTtcbiAgLy8gYW5kIHNwbGl0IHRoZSBocmVmXG4gIHBhdGhQYXJ0cyA9IHBhdGhTdHJpbmcuc3BsaXQoIFwiL1wiICk7XG4gIC8vIHNwbGl0IHRoZSBoYXNoLCB0b29cbiAgaWYgKCBwYXJzZUhhc2ggKSB7XG4gICAgaGFzaFBhcnRzID0gaGFzaFN0cmluZy5zcGxpdCggXCIvXCIgKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIHBhdGg6ICAgICAgIHBhdGhTdHJpbmcsXG4gICAgcXVlcnk6ICAgICAgcXVlcnlTdHJpbmcsXG4gICAgaGFzaDogICAgICAgaGFzaFN0cmluZyxcbiAgICBxdWVyeVBhcnRzOiBxdWVyeVBhcnRzLFxuICAgIHBhdGhQYXJ0czogIHBhdGhQYXJ0cyxcbiAgICBoYXNoUGFydHM6ICBoYXNoUGFydHNcbiAgfTtcbn1cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBhIHJvdXRlIG1hdGNoZXMsIGFuZCBpZiBpdCBkb2VzLCBjb3BpZXNcbiAqIGFueSB2YXJpYWJsZXMgb3V0IGludG8gYHZhcnNgLiBUaGUgcm91dGVzIG11c3QgaGF2ZSBiZWVuIHByZXZpb3VzbHlcbiAqIHBhcnNlZCB3aXRoIHBhcnNlVVJMLlxuICpcbiAqIEBtZXRob2Qgcm91dGVNYXRjaGVzXG4gKiBAcGFyYW0gIHt0eXBlfSBjYW5kaWRhdGUgY2FuZGlkYXRlIFVSTFxuICogQHBhcmFtICB7dHlwZX0gdGVtcGxhdGUgIHRlbXBsYXRlIHRvIGNoZWNrICh2YXJpYWJsZXMgb2YgdGhlIGZvcm0gOnNvbWVJZClcbiAqIEBwYXJhbSAge3R5cGV9IHZhcnMgICAgICBieXJlZjogdGhpcyBvYmplY3Qgd2lsbCByZWNlaXZlIGFueSB2YXJpYWJsZXNcbiAqIEByZXR1cm4geyp9ICAgICAgICAgICAgICBpZiBtYXRjaGVzLCB0cnVlLlxuICovXG5mdW5jdGlvbiByb3V0ZU1hdGNoZXMoIGNhbmRpZGF0ZSwgdGVtcGxhdGUsIHZhcnMgKSB7XG4gIC8vIHJvdXRlcyBtdXN0IGhhdmUgdGhlIHNhbWUgbnVtYmVyIG9mIHBhcnRzXG4gIGlmICggY2FuZGlkYXRlLmhhc2hQYXJ0cy5sZW5ndGggIT09IHRlbXBsYXRlLmhhc2hQYXJ0cy5sZW5ndGggKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBjcCwgdHA7XG4gIGZvciAoIHZhciBpID0gMCwgbCA9IGNhbmRpZGF0ZS5oYXNoUGFydHMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgIC8vIGVhY2ggcGFydCBuZWVkcyB0byBtYXRjaCBleGFjdGx5LCBPUiBpdCBuZWVkcyB0byBzdGFydCB3aXRoIGEgXCI6XCIgdG8gZGVub3RlIGEgdmFyaWFibGVcbiAgICBjcCA9IGNhbmRpZGF0ZS5oYXNoUGFydHNbaV07XG4gICAgdHAgPSB0ZW1wbGF0ZS5oYXNoUGFydHNbaV07XG4gICAgaWYgKCB0cC5zdWJzdHIoIDAsIDEgKSA9PT0gXCI6XCIgJiYgdHAubGVuZ3RoID4gMSApIHtcbiAgICAgIC8vIHZhcmlhYmxlXG4gICAgICB2YXJzW3RwLnN1YnN0ciggMSApXSA9IGNwOyAvLyByZXR1cm4gdGhlIHZhcmlhYmxlIHRvIHRoZSBjYWxsZXJcbiAgICB9IGVsc2UgaWYgKCBjcCAhPT0gdHAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxudmFyIFJvdXRlciA9IHtcbiAgVkVSU0lPTjogICAgICAgIFwiMC4xLjEwMFwiLFxuICBiYXNlVVJMOiAgICAgICAgXCIvXCIsIC8vIG5vdCBjdXJyZW50bHkgdXNlZFxuICAvKipcbiAgICogcmVnaXN0ZXJzIGEgVVJMIGFuZCBhbiBhc3NvY2lhdGVkIHRpdGxlXG4gICAqXG4gICAqIEBtZXRob2QgYWRkVVJMXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsICAgdXJsIHRvIHJlZ2lzdGVyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGl0bGUgYXNzb2NpYXRlZCB0aXRsZSAobm90IHZpc2libGUgYW55d2hlcmUpXG4gICAqIEByZXR1cm4geyp9ICAgICAgICAgICAgc2VsZlxuICAgKi9cbiAgYWRkVVJMOiAgICAgICAgIGZ1bmN0aW9uIGFkZFVSTCggdXJsLCB0aXRsZSApIHtcbiAgICBpZiAoIHJvdXRlc1t1cmxdID09PSB1bmRlZmluZWQgKSB7XG4gICAgICByb3V0ZXNbdXJsXSA9IFtdO1xuICAgIH1cbiAgICByb3V0ZXNbdXJsXS50aXRsZSA9IHRpdGxlO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICAvKipcbiAgICogQWRkcyBhIGhhbmRsZXIgdG8gdGhlIGFzc29jaWF0ZWQgVVJMLiBIYW5kbGVyc1xuICAgKiBzaG91bGQgYmUgb2YgdGhlIGZvcm0gYGZ1bmN0aW9uKCB2YXJzLCBzdGF0ZSwgdXJsLCB0aXRsZSwgcGFyc2VkVVJMIClgXG4gICAqIHdoZXJlIGB2YXJzYCBjb250YWlucyB0aGUgdmFyaWFibGVzIGluIHRoZSBVUkwsIGBzdGF0ZWAgY29udGFpbnMgYW55XG4gICAqIHN0YXRlIHBhc3NlZCB0byBoaXN0b3J5LCBgdXJsYCBpcyB0aGUgbWF0Y2hlZCBVUkwsIGB0aXRsZWAgaXMgdGhlXG4gICAqIHRpdGxlIG9mIHRoZSBVUkwsIGFuZCBgcGFyc2VkVVJMYCBjb250YWlucyB0aGUgYWN0dWFsIFVSTCBjb21wb25lbnRzLlxuICAgKlxuICAgKiBAbWV0aG9kIGFkZEhhbmRsZXJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmwgICAgICAgdXJsIHRvIHJlZ2lzdGVyIHRoZSBoYW5kbGVyIGZvclxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbn0gaGFuZGxlciBoYW5kbGVyIHRvIGNhbGxcbiAgICogQHJldHVybiB7Kn0gICAgICAgICAgICAgICAgc2VsZlxuICAgKi9cbiAgYWRkSGFuZGxlcjogICAgIGZ1bmN0aW9uIGFkZEhhbmRsZXIoIHVybCwgaGFuZGxlciApIHtcbiAgICByb3V0ZXNbdXJsXS5wdXNoKCBoYW5kbGVyICk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgaGFuZGxlciBmcm9tIHRoZSBzcGVjaWZpZWQgdXJsXG4gICAqXG4gICAqIEBtZXRob2QgcmVtb3ZlSGFuZGxlclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgdXJsICAgICB1cmxcbiAgICogQHBhcmFtICB7ZnVuY3Rpb259IGhhbmRsZXIgaGFuZGxlciB0byByZW1vdmVcbiAgICogQHJldHVybiB7Kn0gICAgICAgIHNlbGZcbiAgICovXG4gIHJlbW92ZUhhbmRsZXI6ICBmdW5jdGlvbiByZW1vdmVIYW5kbGVyKCB1cmwsIGhhbmRsZXIgKSB7XG4gICAgdmFyIGhhbmRsZXJzID0gcm91dGVzW3VybF0sXG4gICAgICBoYW5kbGVySW5kZXg7XG4gICAgaWYgKCBoYW5kbGVycyAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgaGFuZGxlckluZGV4ID0gaGFuZGxlcnMuaW5kZXhPZiggaGFuZGxlciApO1xuICAgICAgaWYgKCBoYW5kbGVySW5kZXggPiAtMSApIHtcbiAgICAgICAgaGFuZGxlcnMuc3BsaWNlKCBoYW5kbGVySW5kZXgsIDEgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIC8qKlxuICAgKiBQYXJzZXMgYSBVUkwgaW50byBpdHMgY29uc3RpdHVlbnQgcGFydHMuIFRoZSByZXR1cm4gdmFsdWVcbiAgICogaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBhdGgsIHRoZSBxdWVyeSwgYW5kIHRoZSBoYXNoIGNvbXBvbmVudHMuXG4gICAqIEVhY2ggb2YgdGhvc2UgaXMgYWxzbyBzcGxpdCB1cCBpbnRvIHBhcnRzIC0tIHBhdGggYW5kIGhhc2ggc2VwYXJhdGVkXG4gICAqIGJ5IHNsYXNoZXMsIHdoaWxlIHF1ZXJ5IGlzIHNlcGFyYXRlZCBieSBhbXBlcnNhbmRzLiBJZiBoYXNoIGlzIGVtcHR5XG4gICAqIHRoaXMgcm91dGluZSB0cmVhdGVzIGl0IGFzIGEgXCIjL1wiIHVubGVzZSBgcGFyc2VIYXNoYCBpcyBgZmFsc2VgLlxuICAgKiBUaGUgYGJhc2VVUkxgIGlzIGFsc28gcmVtb3ZlZCBmcm9tIHRoZSBwYXRoOyBpZiBub3Qgc3BlY2lmaWVkIGl0XG4gICAqIGRlZmF1bHRzIHRvIGAvYC5cbiAgICpcbiAgICogQG1ldGhvZCBwYXJzZVVSTFxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICB1cmwgICAgICAgIHVybCB0byBwYXJzZVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBiYXNlVVJMICAgIG9wdGlvbmFsIGJhc2UgdXJsLCBkZWZhdWx0cyB0byBcIi9cIlxuICAgKiBAcGFyYW0gIHtCb29sZWFufSBwYXJzZUhhc2ggIG9wdGlvbmFsLCBpbmRpY2F0ZXMgaWYgaGFzaCBzaG91bGQgYmUgcGFyc2VkIHdpdGggc2xhc2hlc1xuICAgKiBAcmV0dXJuIHsqfSAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCBwaWVjZXNcbiAgICovXG4gIHBhcnNlVVJMOiAgICAgICBwYXJzZVVSTCxcbiAgLyoqXG4gICAqIEdpdmVuIGEgdXJsIGFuZCBzdGF0ZSwgcHJvY2VzcyB0aGUgdXJsIGhhbmRsZXJzIHRoYXRcbiAgICogYXJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gdXJsLiBEb2VzIG5vdCBhZmZlY3QgaGlzdG9yeSBpbiBhbnkgd2F5LFxuICAgKiBzbyBjYW4gYmUgdXNlZCB0byBjYWxsIGhhbmRsZXIgd2l0aG91dCBhY3R1YWxseSBuYXZpZ2F0aW5nIChtb3N0IHVzZWZ1bFxuICAgKiBkdXJpbmcgdGVzdGluZykuXG4gICAqXG4gICAqIEBtZXRob2QgcHJvY2Vzc1JvdXRlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsICAgdXJsIHRvIHByb2Nlc3NcbiAgICogQHBhcmFtICB7Kn0gc3RhdGUgICAgICBzdGF0ZSB0byBwYXNzIChjYW4gYmUgYW55dGhpbmcgb3Igbm90aGluZylcbiAgICovXG4gIHByb2Nlc3NSb3V0ZTogICBmdW5jdGlvbiBwcm9jZXNzUm91dGUoIHVybCwgc3RhdGUgKSB7XG4gICAgaWYgKCB1cmwgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIH1cbiAgICB2YXIgcGFyc2VkVVJMID0gcGFyc2VVUkwoIHVybCApLFxuICAgICAgdGVtcGxhdGVVUkwsIGhhbmRsZXJzLCB2YXJzLCB0aXRsZTtcbiAgICBmb3IgKCB1cmwgaW4gcm91dGVzICkge1xuICAgICAgaWYgKCByb3V0ZXMuaGFzT3duUHJvcGVydHkoIHVybCApICkge1xuICAgICAgICB0ZW1wbGF0ZVVSTCA9IHBhcnNlVVJMKCBcIiNcIiArIHVybCApO1xuICAgICAgICBoYW5kbGVycyA9IHJvdXRlc1t1cmxdO1xuICAgICAgICB0aXRsZSA9IGhhbmRsZXJzLnRpdGxlO1xuICAgICAgICB2YXJzID0ge307XG4gICAgICAgIGlmICggcm91dGVNYXRjaGVzKCBwYXJzZWRVUkwsIHRlbXBsYXRlVVJMLCB2YXJzICkgKSB7XG4gICAgICAgICAgaGFuZGxlcnMuZm9yRWFjaCggZnVuY3Rpb24gKCBoYW5kbGVyICkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaGFuZGxlciggdmFycywgc3RhdGUsIHVybCwgdGl0bGUsIHBhcnNlZFVSTCApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKCBlcnIgKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIldBUk5JTkchIEZhaWxlZCB0byBwcm9jZXNzIGEgcm91dGUgZm9yXCIsIHVybCApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIHByaXZhdGUgcm91dGUgbGlzdGVuZXI7IGNhbGxzIGBwcm9jZXNzUm91dGVgIHdpdGhcbiAgICogdGhlIGV2ZW50IHN0YXRlIHJldHJpZXZlZCB3aGVuIHRoZSBoaXN0b3J5IGlzIHBvcHBlZC5cbiAgICogQG1ldGhvZCBfcm91dGVMaXN0ZW5lclxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3JvdXRlTGlzdGVuZXI6IGZ1bmN0aW9uIF9yb3V0ZUxpc3RlbmVyKCBlICkge1xuICAgIFJvdXRlci5wcm9jZXNzUm91dGUoIHdpbmRvdy5sb2NhdGlvbi5ocmVmLCBlLnN0YXRlICk7XG4gIH0sXG4gIC8qKlxuICAgKiBDaGVjayB0aGUgY3VycmVudCBVUkwgYW5kIGNhbGwgYW55IGFzc29jaWF0ZWQgaGFuZGxlcnNcbiAgICpcbiAgICogQG1ldGhvZCBjaGVja1xuICAgKiBAcmV0dXJuIHsqfSBzZWxmXG4gICAqL1xuICBjaGVjazogICAgICAgICAgZnVuY3Rpb24gY2hlY2soKSB7XG4gICAgdGhpcy5wcm9jZXNzUm91dGUoIHdpbmRvdy5sb2NhdGlvbi5ocmVmICk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgdGhlIHJvdXRlciBpcyBsaXN0ZW5pbmcgdG8gaGlzdG9yeSBjaGFuZ2VzLlxuICAgKiBAcHJvcGVydHkgbGlzdGVuaW5nXG4gICAqIEB0eXBlIGJvb2xlYW5cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIGxpc3RlbmluZzogICAgICBmYWxzZSxcbiAgLyoqXG4gICAqIFN0YXJ0IGxpc3RlbmluZyBmb3IgaGlzdG9yeSBjaGFuZ2VzXG4gICAqIEBtZXRob2QgbGlzdGVuXG4gICAqL1xuICBsaXN0ZW46ICAgICAgICAgZnVuY3Rpb24gbGlzdGVuKCkge1xuICAgIGlmICggdGhpcy5saXN0ZW5pbmcgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMubGlzdGVuaW5nID0gdHJ1ZTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggXCJwb3BzdGF0ZVwiLCB0aGlzLl9yb3V0ZUxpc3RlbmVyLCBmYWxzZSApO1xuICB9LFxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgZm9yIGhpc3RvcnkgY2hhbmdlc1xuICAgKlxuICAgKiBAbWV0aG9kIHN0b3BMaXN0ZW5pbmdcbiAgICogQHJldHVybiB7dHlwZX0gIGRlc2NyaXB0aW9uXG4gICAqL1xuICBzdG9wTGlzdGVuaW5nOiAgZnVuY3Rpb24gc3RvcExpc3RlbmluZygpIHtcbiAgICBpZiAoICF0aGlzLmxpc3RlbmluZyApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoIFwicG9wc3RhdGVcIiwgdGhpcy5fcm91dGVMaXN0ZW5lciApO1xuICB9LFxuICAvKipcbiAgICogTmF2aWdhdGUgdG8gYSB1cmwgd2l0aCBhIGdpdmVuIHN0YXRlLCBjYWxsaW5nIGhhbmRsZXJzXG4gICAqXG4gICAqIEBtZXRob2QgZ29cbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmwgICB1cmxcbiAgICogQHBhcmFtICB7Kn0gc3RhdGUgICAgICBzdGF0ZSB0byBzdG9yZSBmb3IgdGhpcyBVUkwsIGNhbiBiZSBhbnl0aGluZ1xuICAgKiBAcmV0dXJuIHsqfSAgICAgICAgICAgIHNlbGZcbiAgICovXG4gIGdvOiAgICAgICAgICAgICBmdW5jdGlvbiBnbyggdXJsLCBzdGF0ZSApIHtcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSggc3RhdGUsIG51bGwsIFwiI1wiICsgZW5jb2RlVVJJQ29tcG9uZW50KCB1cmwgKSApO1xuICAgIHJldHVybiB0aGlzLmNoZWNrKCk7XG4gIH0sXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZSB0byB1cmwgd2l0aCBhIGdpdmVuIHN0YXRlLCByZXBsYWNpbmcgaGlzdG9yeVxuICAgKiBhbmQgY2FsbGluZyBoYW5kbGVycy4gU2hvdWxkIGJlIGNhbGxlZCBpbml0aWFsbHkgd2l0aCBcIi9cIiBhbmRcbiAgICogYW55IGluaXRpYWwgc3RhdGUgc2hvdWxkIHlvdSB3YW50IHRvIHJlY2VpdmUgYSBzdGF0ZSB2YWx1ZSB3aGVuXG4gICAqIG5hdmlnYXRpbmcgYmFjayBmcm9tIGEgZnV0dXJlIHBhZ2VcbiAgICpcbiAgICogQG1ldGhvZCByZXBsYWNlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsICAgdXJsXG4gICAqIEBwYXJhbSAgeyp9IHN0YXRlICAgICAgc3RhdGUgdG8gc3RvcmUgZm9yIHRoaXMgVVJMLCBjYW4gYmUgYW55dGhpbmdcbiAgICogQHJldHVybiB7Kn0gICAgICAgICAgICBzZWxmXG4gICAqL1xuICByZXBsYWNlOiAgICAgICAgZnVuY3Rpb24gcmVwbGFjZSggdXJsLCBzdGF0ZSApIHtcbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSggc3RhdGUsIG51bGwsIFwiI1wiICsgZW5jb2RlVVJJQ29tcG9uZW50KCB1cmwgKSApO1xuICAgIHJldHVybiB0aGlzLmNoZWNrKCk7XG4gIH0sXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgYmFjayBpbiBoaXN0b3J5XG4gICAqXG4gICAqIEBtZXRob2QgYmFja1xuICAgKiBAcGFyYW0gIHtudW1iZXJ9IG4gbnVtYmVyIG9mIHBhZ2VzIHRvIG5hdmlnYXRlIGJhY2ssIG9wdGlvbmFsICgxIGlzIGRlZmF1bHQpXG4gICAqL1xuICBiYWNrOiAgICAgICAgICAgZnVuY3Rpb24gYmFjayggbiApIHtcbiAgICBoaXN0b3J5LmJhY2soIG4gKTtcbiAgICBpZiAoICF0aGlzLmxpc3RlbmluZyApIHtcbiAgICAgIHRoaXMucHJvY2Vzc1JvdXRlKCB3aW5kb3cubG9jYXRpb24uaHJlZiwgaGlzdG9yeS5zdGF0ZSApO1xuICAgIH1cbiAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gUm91dGVyO1xuIiwiLyoqXG4gKlxuICogIyBoIC0gc2ltcGxlIERPTSB0ZW1wbGF0aW5nXG4gKlxuICogQG1vZHVsZSBoLmpzXG4gKiBAYXV0aG9yIEtlcnJpIFNob3R0c1xuICogQHZlcnNpb24gMC4xXG4gKlxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKlxuICogR2VuZXJhdGVzIGEgRE9NIHRyZWUgKG9yIGp1c3QgYSBzaW5nbGUgbm9kZSkgYmFzZWQgb24gYSBzZXJpZXMgb2YgbWV0aG9kIGNhbGxzXG4gKiBpbnRvICoqaCoqLiAqKmgqKiBoYXMgb25lIHJvb3QgbWV0aG9kIChgZWxgKSB0aGF0IGNyZWF0ZXMgYWxsIERPTSBlbGVtZW50cywgYnV0IGFsc28gaGFzXG4gKiBoZWxwZXIgbWV0aG9kcyBmb3IgZWFjaCBIVE1MIHRhZy4gVGhpcyBtZWFucyB0aGF0IGEgVUwgY2FuIGJlIGNyZWF0ZWQgc2ltcGx5IGJ5XG4gKiBjYWxsaW5nIGBoLnVsYC5cbiAqXG4gKiBUZWNobmljYWxseSB0aGVyZSdzIG5vIHN1Y2ggdGhpbmcgYXMgYSB0ZW1wbGF0ZSB1c2luZyB0aGlzIGxpYnJhcnksIGJ1dCBmdW5jdGlvbnNcbiAqIGVuY2Fwc3VsYXRpbmcgYSBzZXJpZXMgb2YgaCBjYWxscyBmdW5jdGlvbiBhcyBhbiBlcXVpdmFsZW50IGlmIHByb3Blcmx5IGRlY291cGxlZFxuICogZnJvbSB0aGVpciBzdXJyb3VuZHMuXG4gKlxuICogVGVtcGxhdGVzIGFyZSBlc3NlbnRpYWxseSBtZXRob2RzIGF0dGFjaGVkIHRvIHRoZSBET00gdXNpbmcgYGgucmVuZGVyVG8odGVtcGxhdGVGbihjb250ZXh0LC4uLikpYFxuICogYW5kIHJldHVybiBET00gbm9kZSBlbGVtZW50cyBvciBhcnJheXMuIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYFxuICogZnVuY3Rpb24gYVRlbXBsYXRlICggY29udGV4dCApIHtcbiAqICAgcmV0dXJuIGguZGl2IChcbiAqICAgICBbIGguc3BhbiAoIGNvbnRleHQudGl0bGUgKSwgaC5zcGFuICggY29udGV4dC5kZXNjcmlwdGlvbiApIF1cbiAqICAgKTtcbiAqIH07XG4gKiBgYGBcbiAqXG4gKiBUaGUgcmVzdWx0aW5nIERPTSB0cmVlIGxvb2tzIGxpa2UgdGhpcyAoYXNzdW1pbmcgYGNvbnRleHRgIGlzIGRlZmluZWQgYXNcbiAqIGB7dGl0bGU6IFwiVGl0bGVcIiwgZGVzY3JpcHRpb246IFwiRGVzY3JpcHRpb25cIn1gOlxuICpcbiAqIGBgYFxuICogPGRpdj5cbiAqICAgPHNwYW4+VGl0bGU8L3NwYW4+XG4gKiAgIDxzcGFuPkRlc2NyaXB0aW9uPC9zcGFuPlxuICogPC9kaXY+XG4gKiBgYGBcbiAqXG4gKiBUZW1wbGF0ZSByZXN1bHRzIGFyZSBhZGRlZCB0byB0aGUgRE9NIHVzaW5nIGBoLnJlbmRlclRvYDpcbiAqXG4gKiBgYGBcbiAqIGgucmVuZGVyVG8gKCBhRE9NRWxlbWVudCwgYVRlbXBsYXRlICggY29udGV4dCApICk7XG4gKiBgYGBcbiAqXG4gKiBUZWNobmljYWxseSBgYXBwZW5kQ2hpbGRgIGNvdWxkIGJlIHVzZWQsIGJ1dCBpdCdzIHBvc3NpYmxlIHRoYXQgYW4gYXR0cmlidXRlXG4gKiBtaWdodCBqdXN0IHJldHVybiBhbiBhcnJheSBvZiBET00gbm9kZXMsIGluIHdoaWNoIGNhc2UgYGFwcGVuZENoaWxkYCBmYWlscy5cbiAqXG4gKiBUaGVyZSBhcmUgYWxzbyBhIHZhcmlldHkgb2YgdXRpbGl0eSBtZXRob2RzIGRlZmluZWQgaW4gKipoKiosIHN1Y2ggYXM6XG4gKiAtIGBmb3JFYWNoICggYXJyLCBmbiApYCAtLSB0aGlzIGV4ZWN1dGVzIGBhcnIubWFwKGZuKWAuXG4gKiAtIGBmb3JJbiAoIG9iamVjdCwgZm4gKWAgLS0gaXRlcmF0ZXMgb3ZlciBlYWNoIHByb3BlcnR5IG93bmVkIGJ5IGBvYmplY3RgIGFuZCBjYWxscyBgZm5gXG4gKiAtIGBpZmRlZiAoIGV4cHIsIGEsIGIgKWAgLS0gZGV0ZXJtaW5lcyBpZiBgZXhwcmAgaXMgZGVmaW5lZCwgYW5kIGlmIHNvLCByZXR1cm5zIGBhYCwgb3RoZXJ3aXNlIGBiYFxuICogLSBgaWlmICggZXhwciwgYSwgYiApYCAtLSByZXR1cm5zIGBhYCBpZiBgZXhwcmAgZXZhbHVhdGVzIHRvIHRydWUsIG90aGVyd2lzZSBgYmBcbiAqXG4gKiBXaGVuIGNvbnN0cnVjdGluZyBOb2RlIGVsZW1lbnRzIHVzaW5nIGBoYCwgaXQncyBpbXBvcnRhbnQgdG8gcmVjb2duaXplIHRoYXQgYW4gdW5kZXJseWluZ1xuICogZnVuY3Rpb24gY2FsbGVkIGBlbGAgaXMgYmVpbmcgY2FsbGVkIChhbmQgY2FuIGJlIGNhbGxlZCBkaXJlY3RseSkuIFRoZSBvcmRlciBwYXJhbWV0ZXJzIGhlcmUgaXNcbiAqIHNvbWV3aGF0IG1hbGxlYWJsZSAtIG9ubHkgdGhlIGZpcnN0IHBhcmFtZXRlciBtdXN0IGJlIHRoZSB0YWcgbmFtZSAod2hlbiB1c2luZyBgZWxgKS4gT3RoZXJ3aXNlLFxuICogdGhlIG9wdGlvbnMgZm9yIHRoZSB0YWcgbXVzdCBiZSB3aXRoaW4gdGhlIGZpcnN0IHRocmVlIHBhcmFtZXRlcnMuIFRoZSB0ZXh0IGNvbnRlbnQgb3IgdmFsdWUgY29udGVudFxuICogZm9yIHRoZSB0YWcgbXVzdCBiZSBpbiB0aGUgc2FtZSBmaXJzdCB0aHJlZSBwYXJhbWV0ZXJzLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIHJldHVybiBoLmVsKFwiZGl2XCIsIHsgYXR0cnM6IHsgaWQ6IFwiYW5FbGVtZW50XCIgfSB9LCBcIlRleHQgY29udGVudFwiKTtcbiAqIGBgYFxuICpcbiAqIGlzIGVxdWl2YWxlbnQgdG86XG4gKlxuICogYGBgXG4gKiByZXR1cm4gaC5lbChcImRpdlwiLCBcIlRleHQgQ29udGVudFwiLCB7IGF0dHJzOiB7IGlkOiBcImFuRWxlbWVudFwiIH0gfSApO1xuICogYGBgXG4gKlxuICogd2hpY2ggaXMgYWxzbyBpbiB0dXJuIGVxdWl2YWxlbnQgdG86XG4gKlxuICogYGBgXG4gKiByZXR1cm4gaC5kaXYoXCJUZXh0IENvbnRlbnRcIiwgeyBhdHRyczogeyBpZDogXCJhbkVsZW1lbnRcIiB9IH0gKTtcbiAqIGBgYFxuICpcbiAqIElmIGFuIG9iamVjdCBoYXMgYm90aCB0ZXh0IGFuZCB2YWx1ZSBjb250ZW50IChsaWtlIGJ1dHRvbnMpLCB0aGUgZmlyc3Qgc3RyaW5nIG9yIG51bWJlciBpcyB1c2VkXG4gKiBhcyB0aGUgYHZhbHVlYCBhbmQgdGhlIHNlY29uZCBpcyB1c2VkIGFzIGB0ZXh0Q29udGVudGA6XG4gKlxuICogYGBgXG4gKiByZXR1cm4gaC5idXR0b24oXCJUaGlzIGdvZXMgaW50byB2YWx1ZSBhdHRyaWJ1dGVcIiwgXCJUaGlzIGlzIGluIHRleHRDb250ZW50XCIpO1xuICogYGBgXG4gKlxuICogU28gd2h5IGBlbGAgYW5kIGBoLmRpdmAgZXF1aXZhbGVudHM/IElmIHlvdSBuZWVkIHRvIHNwZWNpZnkgYSBjdXN0b20gdGFnIE9SIHdhbnQgdG8gdXNlIHNob3J0aGFuZFxuICogeW91J2xsIHdhbnQgdG8gdXNlIGBlbGAuIElmIHlvdSBkb24ndCBuZWVkIHRvIHNwZWNpZnkgc2hvcnRoYW5kIHByb3BlcnRpZXMsIHVzZSB0aGUgZWFzaWVyLXRvLXJlYWRcbiAqIGBoLnRhZ05hbWVgLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIHJldHVybiBoLnAgKCBcInBhcmFncmFwaCBjb250ZW50XCIgKTtcbiAqIHJldHVybiBoLmVsICggXCJwXCIsIFwicGFyYWdyYXBoIGNvbnRlbnRcIiApO1xuICpcbiAqIHJldHVybiBoLmVsICggXCJpbnB1dCN0eHRVc2VybmFtZS5iaWdGaWVsZD90eXBlPXRleHQmc2l6ZT0yMFwiLCBcInN0YXJ0aW5nIHZhbHVlXCIgKTtcbiAqIHJldHVybiBoLmlucHV0ICggeyBhdHRyczogeyB0eXBlOiBcInRleHRcIiwgc2l6ZTogXCIyMFwiLCBjbGFzczogXCJiaWdGaWVsZFwiLCBpZDogXCJ0eHRVc2VyTmFtZVwiIH0gfSxcbiAqICAgICAgICAgICAgICAgICAgXCJzdGFydGluZyB2YWx1ZVwiICk7XG4gKiBgYGBcbiAqXG4gKiBXaGVuIHNwZWNpZnlpbmcgdGFnIG9wdGlvbnMsIHlvdSBoYXZlIHNldmVyYWwgb3B0aW9ucyB0aGF0IGNhbiBiZSBzcGVjaWZpZWQ6XG4gKiAqIGF0dHJpYnV0ZXMgdXNpbmcgYGF0dHJzYCBvYmplY3RcbiAqICogc3R5bGVzIHVzaW5nIGBzdHlsZXNgIG9iamVjdFxuICogKiBldmVudCBoYW5kbGVycyB1c2luZyBgb25gIG9iamVjdFxuICogKiBoYW1tZXIgaGFuZGxlcnMgdXNpbmcgYGhhbW1lcmAgb2JqZWN0XG4gKiAqIGRhdGEgYmluZGluZyB1c2luZyBgYmluZGAgb2JqZWN0XG4gKiAqIHN0b3JlIGVsZW1lbnQgcmVmZXJlbmNlcyB0byBhIGNvbnRhaW5lciBvYmplY3QgdXNpbmcgYHN0b3JlVG9gIG9iamVjdFxuICpcbiAqXG4gKi9cbi8qZ2xvYmFsIG1vZHVsZSwgTm9kZSwgZG9jdW1lbnQsIHJlcXVpcmUqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgcGFyc2VUYWcgICAgICA9IHJlcXVpcmUoXCIuL2xpYi9wYXJzZVRhZ1wiKSxcbiAgICBvbkVhY2hEZWZpbmVkID0gcmVxdWlyZShcIi4vbGliL29uRWFjaERlZmluZWRcIik7XG5cbnZhciBnbG9iYWxFdmVudHMgPSB7fSxcbiAgICByZW5kZXJFdmVudHMgPSB7fTtcbnZhciBnbG9iYWxTZXF1ZW5jZSA9IDA7XG5cbi8qKlxuICpcbiAqIGludGVybmFsIHByaXZhdGUgbWV0aG9kIHRvIGhhbmRsZSBwYXJzaW5nIGNoaWxkcmVuXG4gKiBhbmQgYXR0YWNoaW5nIHRoZW0gdG8gdGhlaXIgcGFyZW50c1xuICpcbiAqIElmIHRoZSBjaGlsZCBpcyBhIGBOb2RlYCwgaXQgaXMgYXR0YWNoZWQgZGlyZWN0bHkgdG8gdGhlIHBhcmVudCBhcyBhIGNoaWxkXG4gKiBJZiB0aGUgY2hpbGQgaXMgYSBgZnVuY3Rpb25gLCB0aGUgKnJlc3VsdHMqIGFyZSByZS1wYXJzZWQsIHVsdGltYXRlbHkgdG8gYmUgYXR0YWNoZWQgdG8gdGhlIHBhcmVudFxuICogICBhcyBjaGlsZHJlblxuICogSWYgdGhlIGNoaWxkIGlzIGFuIGBBcnJheWAsIGVhY2ggZWxlbWVudCB3aXRoaW4gdGhlIGFycmF5IGlzIHJlLXBhcnNlZCwgdWx0aW1hdGVseSB0byBiZSBhdHRhY2hlZFxuICogICB0byB0aGUgcGFyZW50IGFzIGNoaWxkcmVuXG4gKlxuICogQG1ldGhvZCBhcHBlbmRDaGlsZFRvUGFyZW50XG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbnxOb2RlfSBjaGlsZCAgICAgICBjaGlsZCB0byBoYW5kbGUgYW5kIGF0dGFjaFxuICogQHBhcmFtIHtOb2RlfSBwYXJlbnQgICAgICAgICAgICAgICAgICAgICBwYXJlbnRcbiAqXG4gKi9cbmZ1bmN0aW9uIGFwcGVuZENoaWxkVG9QYXJlbnQoY2hpbGQsIHBhcmVudCkge1xuICAgIGlmICh0eXBlb2YgY2hpbGQgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGQubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYXBwZW5kQ2hpbGRUb1BhcmVudChjaGlsZFtpXSwgcGFyZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY2hpbGQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBhcHBlbmRDaGlsZFRvUGFyZW50KGNoaWxkKCksIHBhcmVudCk7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIGdldEFuZFNldEVsZW1lbnRJZChlKSB7XG4gICAgdmFyIGlkID0gZS5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCB8fCBpZCA9PT0gbnVsbCkge1xuICAgICAgICBnbG9iYWxTZXF1ZW5jZSsrO1xuICAgICAgICBpZCA9IFwiaC15LVwiICsgZ2xvYmFsU2VxdWVuY2U7XG4gICAgICAgIGUuc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgIH1cbiAgICByZXR1cm4gaWQ7XG59XG5cblxuZnVuY3Rpb24gdHJhbnNmb3JtKHBhcmVudCwgbm9kZUEsIG5vZGVCKSB7XG4gICAgdmFyIGhhc0NoaWxkcmVuID0gW2ZhbHNlLCBmYWxzZV0sXG4gICAgICAgIGNoaWxkTm9kZXMgPSBbW10sIFtdXSxcbiAgICAgICAgX0EgPSAwLFxuICAgICAgICBfQiA9IDEsXG4gICAgICAgIGksIGwsXG4gICAgICAgIGxlbiA9IFswLCAwXSxcbiAgICAgICAgbm9kZXMgPSBbbm9kZUEsIG5vZGVCXSxcbiAgICAgICAgYXR0cnMgPSBbW10sIFtdXSxcbiAgICAgICAgc3R5bGVzID0gW3t9LCB7fV0sXG4gICAgICAgIHN0eWxlS2V5cyA9IFtbXSwgW11dLFxuICAgICAgICBlbGlkID0gW251bGwsIG51bGxdO1xuICAgIGlmICghbm9kZUEgJiYgIW5vZGVCKSB7XG4gICAgICAgIC8vIG5vdGhpbmcgdG8gZG8uXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFub2RlQSAmJiBub2RlQikge1xuICAgICAgICAvLyB0aGVyZSdzIG5vIGNvcnJlc3BvbmRpbmcgZWxlbWVudCBpbiBBOyBqdXN0IGFkZCBCLlxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQobm9kZUIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChub2RlQSAmJiAhbm9kZUIpIHtcbiAgICAgICAgLy8gdGhlcmUncyBubyBjb3JyZXNwb25kaW5nIGVsZW1lbnQgaW4gQjsgcmVtb3ZlIEEncyBlbGVtZW50XG4gICAgICAgIG5vZGVBLnJlbW92ZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgoIG5vZGVBLm5vZGVUeXBlICE9PSBub2RlQi5ub2RlVHlwZSApIHx8ICggbm9kZUIubm9kZVR5cGUgIT09IDEgKSkge1xuICAgICAgICAvLyBpZiB0aGUgbm9kZSB0eXBlcyBhcmUgZGlmZmVyZW50LCB0aGVyZSdzIG5vIHJlYXNvbiB0byB0cmFuc2Zvcm0gdHJlZSBBIC0tIGp1c3QgcmVwbGFjZSB0aGUgd2hvbGUgdGhpbmdcbiAgICAgICAgcGFyZW50LnJlcGxhY2VDaGlsZChub2RlQiwgbm9kZUEpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChub2RlQi5jbGFzc0xpc3QpIHtcbiAgICAgICAgaWYgKCFub2RlQi5jbGFzc0xpc3QuY29udGFpbnMoXCJ1aS1jb250YWluZXJcIikgJiYgIW5vZGVCLmNsYXNzTGlzdC5jb250YWlucyhcInVpLWxpc3RcIikgJiYgIW5vZGVCLmNsYXNzTGlzdC5jb250YWlucyhcInVpLXNjcm9sbC1jb250YWluZXJcIikpIHtcbiAgICAgICAgICAgIC8vIGlmIHRoZSBub2RlIHR5cGVzIGFyZSBkaWZmZXJlbnQsIHRoZXJlJ3Mgbm8gcmVhc29uIHRvIHRyYW5zZm9ybSB0cmVlIEEgLS0ganVzdCByZXBsYWNlIHRoZSB3aG9sZSB0aGluZ1xuICAgICAgICAgICAgcGFyZW50LnJlcGxhY2VDaGlsZChub2RlQiwgbm9kZUEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIHNldCB1cCBmb3IgdHJhbnNmb3JtaW5nIHRoaXMgbm9kZVxuICAgIG5vZGVzLmZvckVhY2goXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0ge3tnZXRBdHRyaWJ1dGU6IGZ1bmN0aW9uLCBjaGlsZE5vZGVzOiBBcnJheTxOb2RlPiwgYXR0cmlidXRlczogb2JqZWN0LCBzdHlsZXM6IG9iamVjdH19IG5vZGVcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGlkeFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW5pdChub2RlLCBpZHgpIHtcbiAgICAgICAgaGFzQ2hpbGRyZW5baWR4XSA9IG5vZGUuaGFzQ2hpbGROb2RlcygpO1xuICAgICAgICBsZW5baWR4XSA9IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7XG4gICAgICAgIGlmIChub2RlLmdldEF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgZWxpZFtpZHhdID0gbm9kZS5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5jaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICBjaGlsZE5vZGVzW2lkeF0gPSBbXS5zbGljZS5jYWxsKG5vZGUuY2hpbGROb2RlcywgMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgYXR0cnNbaWR4XSA9IFtdLnNsaWNlLmNhbGwobm9kZS5hdHRyaWJ1dGVzLCAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5zdHlsZXMpIHtcbiAgICAgICAgICAgIHN0eWxlc1tpZHhdID0gbm9kZS5zdHlsZTtcbiAgICAgICAgICAgIHN0eWxlS2V5c1tpZHhdID0gT2JqZWN0LmtleXMoc3R5bGVzW2lkeF0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy8gdHJhbnNmb3JtIGFsbCBvdXIgY2hpbGRyZW5cbiAgICBmb3IgKGkgPSAwLCBsID0gTWF0aC5tYXgobGVuW19BXSwgbGVuW19CXSk7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdHJhbnNmb3JtKG5vZGVBLCBjaGlsZE5vZGVzW19BXVtpXSwgY2hpbGROb2Rlc1tfQl1baV0pO1xuICAgIH1cbiAgICAvLyBjb3B5IGF0dHJpYnV0ZXNcbiAgICBmb3IgKGkgPSAwLCBsID0gTWF0aC5tYXgoYXR0cnNbX0FdLmxlbmd0aCwgYXR0cnNbX0JdLmxlbmd0aCk7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGF0dHJzW19BXVtpXSkge1xuICAgICAgICAgICAgaWYgKCFub2RlQi5oYXNBdHRyaWJ1dGUoYXR0cnNbX0FdW2ldLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGFueSBhdHRyaWJ1dGVzIHRoYXQgYXJlbid0IHByZXNlbnQgaW4gQlxuICAgICAgICAgICAgICAgIG5vZGVBLnJlbW92ZUF0dHJpYnV0ZShhdHRyc1tfQV1baV0ubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJzW19CXVtpXSkge1xuICAgICAgICAgICAgbm9kZUEuc2V0QXR0cmlidXRlKGF0dHJzW19CXVtpXS5uYW1lLCBhdHRyc1tfQl1baV0udmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGNvcHkgc3R5bGVzXG4gICAgZm9yIChpID0gMCwgbCA9IE1hdGgubWF4KHN0eWxlc1tfQV0ubGVuZ3RoLCBzdHlsZXNbX0JdLmxlbmd0aCk7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKHN0eWxlc1tfQV1baV0pIHtcbiAgICAgICAgICAgIGlmICghKCBzdHlsZUtleXNbX0JdW2ldIGluIHN0eWxlS2V5c1tfQV0gKSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBhbnkgc3R5bGVzIHRoYXQgYXJlbid0IHByZXNlbnQgaW4gQlxuICAgICAgICAgICAgICAgIG5vZGVBLnN0eWxlW3N0eWxlS2V5c1tfQl1baV1dID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc3R5bGVzW19CXVtpXSkge1xuICAgICAgICAgICAgbm9kZUEuc3R5bGVbc3R5bGVLZXlzW19CXVtpXV0gPSBzdHlsZXNbX0JdW3N0eWxlS2V5c1tfQl1baV1dO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGNvcHkgZXZlbnRzLi4uIEkgd2lzaC5cbn1cblxuLyoqXG4gKiBoIHRlbXBsYXRpbmcgZW5naW5lXG4gKi9cbnZhciBoID0ge1xuICAgIFZFUlNJT046ICAgICAgIFwiMC4xLjEwMFwiLFxuICAgIHVzZURvbU1lcmdpbmc6IGZhbHNlLFxuICAgIGRlYnVnOiAgICAgICAgIGZhbHNlLFxuICAgIEhhbW1lcjogICAgICAgIG51bGwsXG4gICAgQmFzZU9iamVjdDogICAgbnVsbCxcbiAgICBfZ2xvYmFsRXZlbnRzOiBnbG9iYWxFdmVudHMsXG4gICAgX3JlbmRlckV2ZW50czogcmVuZGVyRXZlbnRzLFxuICAgIC8qIGV4cGVyaW1lbnRhbCEgKi9cblxuICAgIC8qKlxuICAgICAqIEB0eXBlZGVmIHt7b2JqZWN0Om9iamVjdCwga2V5UGF0aDpzdHJpbmcsIFtrZXlUeXBlXTpzdHJpbmcgfX0gYmluZE9ialxuICAgICAqIEB0eXBlZGVmIHt7b2JqZWN0Om9iamVjdCwga2V5UGF0aDpzdHJpbmcsIFtpZE9ubHldOmJvb2xlYW4gfX0gc3RvcmVPYmpcbiAgICAgKiBAdHlwZWRlZiB7e2hhbmRsZXI6ZnVuY3Rpb24sIFtjYXB0dXJlXTpib29sZWFuIH19IG9uT2JqXG4gICAgICogQHR5cGVkZWYge3toYW5kbGVyOmZ1bmN0aW9uLCBbb3B0aW9uc106b2JqZWN0IH19IGhhbW1lck9ialxuICAgICAqIEB0eXBlZGVmIHt7W2F0dHJzXTpvYmplY3QsIFtzdHlsZXNdOm9iamVjdCwgW29uXTpvYmplY3Q8ZnVuY3Rpb258b25PYmo+LCBbaGFtbWVyXTpvYmplY3Q8ZnVuY3Rpb258aGFtbWVyT2JqPiwgW2JpbmRdOmJpbmRPYmosIFtzdG9yZV06c3RvcmVPYmp9fSB0YWdPcHRzXG4gICAgICovXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIERPTSB0cmVlIGNvbnRhaW5pbmcgdGhlIHJlcXVlc3RlZCBlbGVtZW50IGFuZCBhbnkgZnVydGhlciBjaGlsZFxuICAgICAqIGVsZW1lbnRzIChhcyBleHRyYSBwYXJhbWV0ZXJzKVxuICAgICAqXG4gICAgICogYHRhZ09wdGlvbnNgIHNob3VsZCBiZSBhbiBvYmplY3QgY29uc2lzdGluZyBvZiB0aGUgZm9sbG93aW5nIG9wdGlvbmFsIHNlZ21lbnRzOlxuICAgICAqXG4gICAgICogYGBgXG4gICAgICoge1xuICAgICAgICogICAgYXR0cnM6IHsuLi59ICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyB0byBhZGQgdG8gdGhlIGVsZW1lbnRcbiAgICAgICAqICAgIHN0eWxlczogey4uLn0gICAgICAgICAgICAgICAgICAgIHN0eWxlIGF0dHJpYnV0ZXMgdG8gYWRkIHRvIHRoZSBlbGVtZW50XG4gICAgICAgKiAgICBvbjogey4uLn0gICAgICAgICAgICAgICAgICAgICAgICBldmVudCBoYW5kbGVycyB0byBhdHRhY2ggdG8gdGhlIGVsZW1lbnRcbiAgICAgICAqICAgIGhhbW1lcjogey4uLn0gICAgICAgICAgICAgICAgICAgIGhhbW1lciBoYW5kbGVyc1xuICAgICAgICogICAgYmluZDogeyBvYmplY3Q6LCBrZXlQYXRoOiwga2V5VHlwZTogfSAgICAgIGRhdGEgYmluZGluZ1xuICAgICAgICogICAgc3RvcmU6IHsgb2JqZWN0Oiwga2V5UGF0aDosIGlkT25seTogfSAgICAgc3RvcmUgZWxlbWVudCB0byBvYmplY3Qua2V5UGF0aFxuICAgICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1ldGhvZCBlbFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgICAgICAgICAgICAgICAgICAgICAgIHRhZyBvZiB0aGUgZm9ybSBgdGFnTmFtZS5jbGFzcyNpZGAgb3IgYHRhZ05hbWUjaWQuY2xhc3NgXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnIGNhbiBhbHNvIHNwZWNpZnkgYXR0cmlidXRlczpcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgaW5wdXQ/dHlwZT10ZXh0JnNpemU9MjBgXG4gICAgICogQHBhcmFtIHt0YWdPcHRzfSB0YWdPcHRpb25zICAgICAgICAgICAgICAgb3B0aW9ucyBmb3IgdGhlIHRhZyAoc2VlIGFib3ZlKVxuICAgICAqIEBwYXJhbSB7Li4uKEFycmF5fEZ1bmN0aW9ufFN0cmluZyl9IGFyZ3MgIGNoaWxkcmVuIHRoYXQgc2hvdWxkIGJlIGF0dGFjaGVkXG4gICAgICogQHJldHVybnMge05vZGV9ICAgICAgICAgICAgICAgICAgICAgICAgICAgRE9NIHRyZWVcbiAgICAgKlxuICAgICAqL1xuICAgIGVsOiAgICAgICAgICAgIGZ1bmN0aW9uICh0YWcgLyosIHRhZ09wdGlvbnMsIGFyZ3MgKi8pIHtcbiAgICAgICAgdmFyIGUsIGksIGwsIGYsXG4gICAgICAgICAgICBvcHRpb25zLFxuICAgICAgICAgICAgY29udGVudCA9IFtdLFxuICAgICAgICAgICAgY29udGVudFRhcmdldCA9IFtdLFxuICAgICAgICAgICAgdGFnUGFydHMgPSBwYXJzZVRhZyh0YWcpLFxuICAgICAgICAgICAgZWxpZDtcblxuICAgICAgICAvLyBwYXJzZSB0YWc7IGl0IHNob3VsZCBiZSBvZiB0aGUgZm9ybSBgdGFnWyNpZF1bLmNsYXNzXVs/YXR0cj12YWx1ZVsmYXR0cj12YWx1ZS4uLl1gXG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgZWxlbWVudDsgaWYgYEBERmAgaXMgdXNlZCwgYSBkb2N1bWVudCBmcmFnbWVudCBpcyB1c2VkIGluc3RlYWRcbiAgICAgICAgaWYgKHRhZ1BhcnRzLnRhZyAhPT0gXCJAREZcIikge1xuICAgICAgICAgICAgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnUGFydHMudGFnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXR0YWNoIHRoZSBgY2xhc3NgIGFuZCBgaWRgIGZyb20gdGhlIHRhZyBuYW1lLCBpZiBhdmFpbGFibGVcbiAgICAgICAgaWYgKHRhZ1BhcnRzLmNsYXNzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGUuY2xhc3NOYW1lID0gdGFnUGFydHMuY2xhc3M7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhZ1BhcnRzLmlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGVsaWQgPSB0YWdQYXJ0cy5pZDtcbiAgICAgICAgICAgIGUuc2V0QXR0cmlidXRlKFwiaWRcIiwgdGFnUGFydHMuaWQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGdldCB0aGUgYXJndW1lbnRzIGFzIGFuIGFycmF5LCBpZ25vcmluZyB0aGUgZmlyc3QgcGFyYW1ldGVyXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgLy8gZGV0ZXJtaW5lIHdoYXQgd2UndmUgcGFzc2VkIGluIHRoZSBzZWNvbmQvdGhpcmQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlmIGl0IGlzIGFuIG9iamVjdCAoYnV0IG5vdCBhIG5vZGUgb3IgYXJyYXkpLCBpdCdzIGEgbGlzdCBvZlxuICAgICAgICAvLyBvcHRpb25zIHRvIGF0dGFjaCB0byB0aGUgZWxlbWVudC4gSWYgaXQgaXMgYSBzdHJpbmcsIGl0J3MgdGV4dFxuICAgICAgICAvLyBjb250ZW50IHRoYXQgc2hvdWxkIGJlIGFkZGVkIHVzaW5nIGB0ZXh0Q29udGVudGAgb3IgYHZhbHVlYFxuICAgICAgICAvLyA+IHdlIGNvdWxkIHBhcnNlIHRoZSBlbnRpcmUgYXJndW1lbnQgbGlzdCwgYnV0IHRoYXQgd291bGRcbiAgICAgICAgLy8gPiBhIGJpdCBhYnN1cmQuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJnc1swXSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb3VsZCBiZSBhIERPTSBub2RlLCBhbiBhcnJheSwgb3IgdGFnIG9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoIGFyZ3NbMF0gaW5zdGFuY2VvZiBOb2RlICkgJiYgISggYXJnc1swXSBpbnN0YW5jZW9mIEFycmF5ICkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBhcmdzWzBdID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgdGV4dCBjb250ZW50XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQucHVzaChhcmdzLnNoaWZ0KCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjb3B5IG92ZXIgYW55IGBxdWVyeVBhcnRzYCBhdHRyaWJ1dGVzXG4gICAgICAgIG9uRWFjaERlZmluZWQodGFnUGFydHMucXVlcnlQYXJ0cywgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIHZhciBhcnIgPSB2LnNwbGl0KFwiPVwiKTtcbiAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUoYXJyWzBdLnRyaW0oKSwgYXJyWzFdLnRyaW0oKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGFuIGF0dHIgd2l0aCBubyA9IHdpbGwgYmUgdHJlYXRlZCBhcyByZWFkb25seSA9IHJlYWRvbmx5XG4gICAgICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUoYXJyWzBdLnRyaW0oKSwgYXJyWzBdLnRyaW0oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJvYmplY3RcIiAmJiBvcHRpb25zICE9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBhZGQgYXR0cmlidXRlc1xuICAgICAgICAgICAgb25FYWNoRGVmaW5lZChvcHRpb25zLCBcImF0dHJzXCIsIGZ1bmN0aW9uICh2LCBwKSB7XG4gICAgICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUocCwgdik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGFkZCBzdHlsZXNcbiAgICAgICAgICAgIG9uRWFjaERlZmluZWQob3B0aW9ucywgXCJzdHlsZXNcIiwgZnVuY3Rpb24gKHYsIHApIHtcbiAgICAgICAgICAgICAgICBlLnN0eWxlW3BdID0gdjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gYWRkIGV2ZW50IGhhbmRsZXJzOyBoYW5kbGVyIHByb3BlcnR5IGlzIGV4cGVjdGVkIHRvIGJlIGEgdmFsaWQgRE9NXG4gICAgICAgICAgICAvLyBldmVudCwgaS5lLiBgeyBcImNoYW5nZVwiOiBmdW5jdGlvbi4uLiB9YCBvciBgeyBjaGFuZ2U6IGZ1bmN0aW9uLi4uIH1gXG4gICAgICAgICAgICAvLyBpZiB0aGUgaGFuZGxlciBpcyBhbiBvYmplY3QsIGl0IG11c3QgYmUgb2YgdGhlIGZvcm1cbiAgICAgICAgICAgIC8vIGBgYFxuICAgICAgICAgICAgLy8gICB7IGhhbmRsZXI6IGZ1bmN0aW9uLCBjYXB0dXJlOiB0cnVlL2ZhbHNlIH1cbiAgICAgICAgICAgIC8vIGBgYFxuICAgICAgICAgICAgb25FYWNoRGVmaW5lZChvcHRpb25zLCBcIm9uXCIsXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbnx7aGFuZGxlcjpmdW5jdGlvbiwgW2NhcHR1cmVdOmJvb2xlYW59fSB2XG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHBcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAodiwgcCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHYgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZiA9IHYuYmluZChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuYWRkRXZlbnRMaXN0ZW5lcihwLCBmLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmID0gdi5oYW5kbGVyLmJpbmQoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLmFkZEV2ZW50TGlzdGVuZXIocCwgZiwgdHlwZW9mIHYuY2FwdHVyZSAhPT0gXCJ1bmRlZmluZWRcIiA/IHYuY2FwdHVyZSA6IGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gd2Ugc3VwcG9ydCBoYW1tZXIgdG9vLCBhc3N1bWluZyB3ZSdyZSBnaXZlbiBhIHJlZmVyZW5jZVxuICAgICAgICAgICAgLy8gaXQgbXVzdCBiZSBvZiB0aGUgZm9ybSBgeyBoYW1tZXI6IHsgZ2VzdHVyZTogeyBoYW5kbGVyOiBmbiwgb3B0aW9uczogfSwgaGFtbWVyOiBoYW1tZXIgfSB9YFxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuaGFtbWVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhbW1lciA9IG9wdGlvbnMuaGFtbWVyLmhhbW1lciB8fCBoLkhhbW1lcjtcbiAgICAgICAgICAgICAgICBvbkVhY2hEZWZpbmVkKG9wdGlvbnMsIFwiaGFtbWVyXCIsXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge3toYW5kbGVyOiBmdW5jdGlvbiwgW29wdGlvbnNdOm9iamVjdH19IHZcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHBcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2LCBwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocCAhPT0gXCJoYW1tZXJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbW1lcihlLCB2Lm9wdGlvbnMpLm9uKHAsIHYuaGFuZGxlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYWxsb3cgZWxlbWVudHMgdG8gYmUgc3RvcmVkIGludG8gYSBjb250ZXh0XG4gICAgICAgICAgICAvLyBzdG9yZSBtdXN0IGJlIGFuIG9iamVjdCBvZiB0aGUgZm9ybSBge29iamVjdDpvYmplY3RSZWYsIGtleVBhdGg6IFwia2V5UGF0aFwiLCBbaWRPbmx5OnRydWV8ZmFsc2VdIH1gXG4gICAgICAgICAgICAvLyBpZiBpZE9ubHkgaXMgdHJ1ZSwgb25seSB0aGUgZWxlbWVudCdzIGlkIGlzIHN0b3JlZFxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc3RvcmUpIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5zdG9yZS5pZE9ubHkpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxpZCA9IGdldEFuZFNldEVsZW1lbnRJZChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5zdG9yZS5vYmplY3Rbb3B0aW9ucy5zdG9yZS5rZXlQYXRoXSA9IG9wdGlvbnMuc3RvcmUuaWRPbmx5ID8gZWxpZCA6IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIHdlIGhhdmUgYHZhbHVlYCBhbmQgYHRleHRDb250ZW50YCBvcHRpb25zIG9yIG9ubHlcbiAgICAgICAgLy8gYHRleHRDb250ZW50YCAoYnV0dG9ucyBoYXZlIGJvdGgpIElmIGJvdGggYXJlIHByZXNlbnQsIHRoZSBmaXJzdFxuICAgICAgICAvLyBjb250ZW50IGl0ZW0gaXMgYXBwbGllZCB0byBgdmFsdWVgLCBhbmQgdGhlIHNlY29uZCBpcyBhcHBsaWVkIHRvXG4gICAgICAgIC8vIGB0ZXh0Q29udGVudGB8YGlubmVyVGV4dGBcbiAgICAgICAgLy8gTk9URTogTElzIGhhdmUgdmFsdWVzLiBXaG9kYXRodW5rP1xuICAgICAgICBpZiAoZS52YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHRhZ1BhcnRzLnRhZyAhPT0gXCJsaVwiKSB7XG4gICAgICAgICAgICBjb250ZW50VGFyZ2V0LnB1c2goXCJ2YWx1ZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKCBlLnRleHRDb250ZW50ICE9PSB1bmRlZmluZWQgKSB8fCAoIGUuaW5uZXJUZXh0ICE9PSB1bmRlZmluZWQgKSkge1xuICAgICAgICAgICAgY29udGVudFRhcmdldC5wdXNoKGUudGV4dENvbnRlbnQgIT09IHVuZGVmaW5lZCA/IFwidGV4dENvbnRlbnRcIiA6IFwiaW5uZXJUZXh0XCIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBjb250ZW50VGFyZ2V0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgdmFyIHggPSBjb250ZW50LnNoaWZ0KCk7XG4gICAgICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZVtjb250ZW50VGFyZ2V0W2ldXSA9IHg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGQgY2hpbGRyZW4gdG8gdGhlIHBhcmVudCB0b29cbiAgICAgICAgdmFyIGNoaWxkO1xuICAgICAgICBmb3IgKGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGNoaWxkID0gYXJnc1tpXTtcbiAgICAgICAgICAgIGFwcGVuZENoaWxkVG9QYXJlbnQoY2hpbGQsIGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJvYmplY3RcIiAmJiBvcHRpb25zICE9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBEYXRhIGJpbmRpbmcgb25seSBvY2N1cnMgaWYgdXNpbmcgWUFTTUYncyBCYXNlT2JqZWN0IGZvciBub3cgKGJ1aWx0LWluIHB1YnN1Yi9vYnNlcnZhYmxlcylcbiAgICAgICAgICAgIC8vIGFsb25nIHdpdGggb2JzZXJ2YWJsZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAvLyB0aGUgYmluZGluZyBvYmplY3QgaXMgb2YgdGhlIGZvcm0gYHsgb2JqZWN0OiBvYmplY3RSZWYsIGtleVBhdGg6IFwia2V5UGF0aFwiLCBba2V5VHlwZTpcInN0cmluZ1wiXSB9YFxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYmluZCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaC5CYXNlT2JqZWN0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmJpbmQub2JqZWN0IGluc3RhbmNlb2YgaC5CYXNlT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGlkID0gZ2V0QW5kU2V0RWxlbWVudElkKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UgaGF2ZSBhbiBvYmplY3QgdGhhdCBoYXMgb2JzZXJ2YWJsZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmJpbmQub2JqZWN0LmRhdGFCaW5kT24oZSwgb3B0aW9ucy5iaW5kLmtleVBhdGgsIG9wdGlvbnMuYmluZC5rZXlUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuYmluZC5vYmplY3Qubm90aWZ5RGF0YUJpbmRpbmdFbGVtZW50c0ZvcktleVBhdGgob3B0aW9ucy5iaW5kLmtleVBhdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHJldHVybiB0aGUgZWxlbWVudCAoYW5kIGFzc29jaWF0ZWQgdHJlZSlcbiAgICAgICAgcmV0dXJuIGU7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBtYXBUbyAtIE1hcHMgYSBrZXlwYXRoIHRvIGFub3RoZXIga2V5cGF0aCBiYXNlZCBvbiBgbWFwYC4gYG1hcGAgc2hvdWxkIGxvb2sgbGlrZSB0aGlzOlxuICAgICAqXG4gICAgICogYGBgXG4gICAgICoge1xuICAgICAqICAgXCJtYXBwaW5nX2tleVwiOiBcInRhcmdldF9rZXlcIiwgLi4uXG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogRm9yIGV4YW1wbGUsIGxldCdzIGFzc3VtZSB0aGF0IHNvbWUgb2JqZWN0IGBvYCBoYXMgdGhlIHByb3BlcnRpZXMgYGlkYCBhbmQgYG5hbWVgLiBXZVxuICAgICAqIHdhbnQgdG8gbWFwIHRoZXNlIHRvIGNvbnNpc3RlbnQgdmFsdWVzIGxpa2UgYHZhbHVlYCBhbmQgYGRlc2NyaXB0aW9uYCBmb3IgYSBjb21wb25lbnQuXG4gICAgICogYG1hcGAgc2hvdWxkIGxvb2sgbGlrZSB0aGlzOiBgeyBcInZhbHVlXCI6IFwiaWRcIiwgXCJkZXNjcmlwdGlvblwiOiBcIm5hbWVcIiB9YC4gSW4gdGhpcyBjYXNlXG4gICAgICogY2FsbGluZyBgbWFwVG8oXCJ2YWx1ZVwiLCBtYXApYCB3b3VsZCByZXR1cm4gYGlkYCwgd2hpY2ggY291bGQgdGhlbiBiZSBpbmRleGVkIG9uIGBvYFxuICAgICAqIGxpa2Ugc286IGBvW21hcFRvKFwidmFsdWVcIixtYXApXWAuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIG1hcFRvXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSAgICBrZXlQYXRoIHRvIG1hcFxuICAgICAqIEBwYXJhbSAgeyp9IG1hcCAgICAgbWFwIGRlc2NyaXB0aW9uXG4gICAgICogQHJldHVybiB7U3RyaW5nfSAgICBtYXBwZWQga2V5UGF0aFxuICAgICAqL1xuICAgIG1hcFRvOiAgICAgICAgIGZ1bmN0aW9uIG1hcFRvKGtleVBhdGgsIG1hcCkge1xuICAgICAgICBpZiAobWFwID09PSB1bmRlZmluZWQgfHwgbWFwID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4ga2V5UGF0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKG1hcFtrZXlQYXRoXSAhPT0gdW5kZWZpbmVkKSA/IG1hcFtrZXlQYXRoXSA6IGtleVBhdGg7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBpaWYgLSBldmFsdWF0ZSBgZXhwcmAgYW5kIGlmIGl0IGlzIGB0cnVlYCwgcmV0dXJuIGBhYC4gSWYgaXQgaXMgZmFsc2UsXG4gICAgICogcmV0dXJuIGBiYC4gSWYgYGFgIGlzIG5vdCBzdXBwbGllZCwgYHRydWVgIGlzIHRoZSByZXR1cm4gcmVzdWx0IGlmIGBhYFxuICAgICAqIHdvdWxkIGhhdmUgYmVlbiByZXR1cm5lZC4gSWYgYGJgIGlzIG5vdCBzdXBwbGllZCwgYGZhbHNlYCBpcyB0aGUgcmV0dXJuXG4gICAgICogcmVzdWx0IGlmIGBiYCB3b3VsZCBoYXZlIGJlZW4gcmV0dXJuZWQuIE5vdCBtdWNoIGRpZmZlcmVuY2UgdGhhbiB0aGVcbiAgICAgKiB0ZXJuYXJ5IChgPzpgKSBvcGVyYXRvciwgYnV0IG1pZ2h0IGJlIGVhc2llciB0byByZWFkIGZvciBzb21lLlxuICAgICAqXG4gICAgICogSWYgeW91IG5lZWQgc2hvcnQgY2lyY3VpdGluZywgdGhpcyBmdW5jdGlvbiBpcyBubyB1c2UuIFVzZSA/OiBpbnN0ZWFkLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBpaWZcbiAgICAgKiBAcGFyYW0gIHtib29sZWFufSBleHByIGV4cHJlc3Npb24gdG8gZXZhbHVhdGVcbiAgICAgKiBAcGFyYW0gIHsqfSBhICAgICB2YWx1ZSB0byByZXR1cm4gaWYgYGV4cHJgIGlzIHRydWU7IGB0cnVlYCBpcyB0aGUgZGVmYXVsdCBpZiBub3Qgc3VwcGxpZWRcbiAgICAgKiBAcGFyYW0gIHsqfSBiICAgICB2YWx1ZSB0byByZXR1cm4gaWYgYGV4cHJgIGlzIGZhbHNlOyBgZmFsc2VgIGlzIHRoZSBkZWZhdWx0IGlmIG5vdCBzdXBwbGllZFxuICAgICAqIEByZXR1cm4geyp9ICAgICAgIGBleHByID8gYSA6IGJgXG4gICAgICovXG4gICAgaWlmOiAgICAgICAgICAgZnVuY3Rpb24gaWlmKGV4cHIsIGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGV4cHIgPyAoICggdHlwZW9mIGEgIT09IFwidW5kZWZpbmVkXCIgKSA/IGEgOiB0cnVlICkgOiAoICggdHlwZW9mIGIgIT09IFwidW5kZWZpbmVkXCIgKSA/IGIgOiBmYWxzZSApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogaWZkZWYgLSBDaGVjayBpZiBhbiBleHByZXNzaW9uIGlzIGRlZmluZWQgYW5kIHJldHVybiBgYWAgaWYgaXQgaXMgYW5kIGBiYFxuICAgICAqIGlmIGl0IGlzbid0LiBJZiBgYWAgaXMgbm90IHN1cHBsaWVkLCBgYWAgZXZhbHVhdGVzIHRvIGB0cnVlYCBhbmQgaWYgYGJgXG4gICAgICogaXMgbm90IHN1cHBsaWVkLCBgYmAgZXZhbHVhdGVzIHRvIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGlmZGVmXG4gICAgICogQHBhcmFtICB7Ym9vbGVhbn0gZXhwciBleHByZXNzaW9uIHRvIGNoZWNrXG4gICAgICogQHBhcmFtICB7Kn0gICAgICAgYSAgICB2YWx1ZSB0byByZXR1cm4gaWYgZXhwcmVzc2lvbiBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtICB7Kn0gICAgICAgYiAgICB2YWx1ZSB0byByZXR1cm4gaWYgZXhwcmVzc2lvbiBpcyBub3QgZGVmaW5lZFxuICAgICAqIEByZXR1cm4geyp9ICAgICAgIGEgb3IgYlxuICAgICAqL1xuICAgIGlmZGVmOiAgICAgICAgIGZ1bmN0aW9uIGlmZGVmKGV4cHIsIGEsIGIpIHtcbiAgICAgICAgcmV0dXJuICggdHlwZW9mIGV4cHIgIT09IFwidW5kZWZpbmVkXCIgKSA/ICggKCB0eXBlb2YgYSAhPT0gXCJ1bmRlZmluZWRcIiApID8gYSA6IHRydWUgKSA6ICggKCB0eXBlb2YgYiAhPT0gXCJ1bmRlZmluZWRcIiApID9cbiAgICAgICAgICAgIGIgOiBmYWxzZSApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogZm9ySW4gLSByZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgcmVzdWx0cyBvZiBjYWxsaW5nIGBmbmAgZm9yXG4gICAgICogZWFjaCBwcm9wZXJ0eSB3aXRoaW4gYG9iamVjdGAuIEVxdWl2YWxlbnQgdG8gYG1hcGAgb24gYW4gYXJyYXkuXG4gICAgICpcbiAgICAgKiBUaGUgZnVuY3Rpb24gc2hvdWxkIGhhdmUgdGhlIHNpZ25hdHVyZSBgKCB2YWx1ZSwgb2JqZWN0LCBwcm9wZXJ0eSApYFxuICAgICAqIGFuZCByZXR1cm4gdGhlIHJlc3VsdC4gVGhlIHJlc3VsdHMgd2lsbCBhdXRvbWF0aWNhbGx5IGJlIGNvbGxhdGVkIGluXG4gICAgICogYW4gYXJyYXkuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGZvckluXG4gICAgICogQHBhcmFtICB7Kn0gICAgICAgIG9iamVjdCBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyXG4gICAgICogQHBhcmFtICB7ZnVuY3Rpb259IGZuICAgICBmdW5jdGlvbiB0byBjYWxsXG4gICAgICogQHJldHVybiB7QXJyYXl9ICAgICAgICAgICByZXN1dHNcbiAgICAgKi9cbiAgICBmb3JJbjogICAgICAgICBmdW5jdGlvbiBmb3JJbihvYmplY3QsIGZuKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpLm1hcChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICAgICAgcmV0dXJuIGZuKG9iamVjdFtwcm9wXSwgb2JqZWN0LCBwcm9wKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBmb3JFYWNoIC0gRXhlY3V0ZXMgYG1hcGAgb24gYW4gYXJyYXksIGNhbGxpbmcgYGZuYC4gTmFtZWQgc3VjaCBiZWNhdXNlXG4gICAgICogaXQgbWFrZXMgbW9yZSBzZW5zZSB0aGFuIHVzaW5nIGBtYXBgIGluIGEgdGVtcGxhdGUsIGJ1dCBpdCBtZWFucyB0aGVcbiAgICAgKiBzYW1lIHRoaW5nLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBmb3JFYWNoXG4gICAgICogQHBhcmFtICB7QXJyYXl9ICAgIGFyciBBcnJheSB0byBpdGVyYXRlXG4gICAgICogQHBhcmFtICB7ZnVuY3Rpb259IGZuICBGdW5jdGlvbiB0byBjYWxsXG4gICAgICogQHJldHVybiB7QXJyYXl9ICAgICAgICBBcnJheSBhZnRlciBpdGVyYXRpb25cbiAgICAgKi9cbiAgICBmb3JFYWNoOiAgICAgICBmdW5jdGlvbiBmb3JFYWNoKGFyciwgZm4pIHtcbiAgICAgICAgcmV0dXJuIGFyci5tYXAoZm4pO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogcmVuZGVyVG8gLSBSZW5kZXJzIGEgbm9kZSBvciBhcnJheSBvZiBub2RlcyB0byBhIGdpdmVuIGVsZW1lbnQuIElmIGFuXG4gICAgICogYXJyYXkgaXMgcHJvdmlkZWQsIGVhY2ggaXMgYXBwZW5kZWQgaW4gdHVybi5cbiAgICAgKlxuICAgICAqIFRlY2huaWNhbGx5IHlvdSBjYW4ganVzdCB1c2UgYGFwcGVuZENoaWxkYCBvciBlcXVpdmFsZW50IERPTVxuICAgICAqIG1ldGhvZHMsIGJ1dCB0aGlzIHdvcmtzIG9ubHkgYXMgZmFyIGFzIHRoZSByZXR1cm4gcmVzdWx0IGlzIGEgc2luZ2xlXG4gICAgICogbm9kZS4gT2NjYXNpb25hbGx5IHlvdXIgdGVtcGxhdGUgbWF5IHJldHVybiBhbiBhcnJheSBvZiBub2RlcywgYW5kXG4gICAgICogYXQgdGhhdCBwb2ludCBgYXBwZW5kQ2hpbGRgIGZhaWxzLlxuICAgICAqXG4gICAgICogQG1ldGhvZCByZW5kZXJUb1xuICAgICAqIEBwYXJhbSAge0FycmF5fE5vZGV9IG4gIEFycmF5IG9yIHNpbmdsZSBub2RlIHRvIGFwcGVuZCB0byB0aGUgZWxlbWVudFxuICAgICAqIEBwYXJhbSAge05vZGV9IGVsIEVsZW1lbnQgdG8gYXR0YWNoIHRvXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpZHggIGluZGV4IChvcHRpb25hbClcbiAgICAgKi9cbiAgICByZW5kZXJUbzogICAgICBmdW5jdGlvbiByZW5kZXJUbyhuLCBlbCwgaWR4KSB7XG4gICAgICAgIGlmICghaWR4KSB7XG4gICAgICAgICAgICBpZHggPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAobltpXSAhPT0gdW5kZWZpbmVkICYmIG5baV0gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyVG8obltpXSwgZWwsIGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChuID09PSB1bmRlZmluZWQgfHwgbiA9PT0gbnVsbCB8fCBlbCA9PT0gdW5kZWZpbmVkIHx8IGVsID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGVsaWQgPSBbbnVsbCwgbnVsbF07XG4gICAgICAgICAgICBpZiAoZWwuaGFzQ2hpbGROb2RlcygpICYmIGlkeCA8IGVsLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZWxpZFswXSA9IGVsLmNoaWxkTm9kZXNbaWR4XS5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoaC51c2VEb21NZXJnaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybShlbCwgZWwuY2hpbGROb2Rlc1tpZHhdLCBuKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbC5yZXBsYWNlQ2hpbGQobiwgZWwuY2hpbGROb2Rlc1tpZHhdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKG4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSxcbi8vIGNyZWF0ZSBiaW5kaW5ncyBmb3IgZWFjaCBIVE1MIGVsZW1lbnQgKGZyb206IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvRWxlbWVudClcbmVscyAgID0gW1wiYVwiLCBcImFiYnJcIiwgXCJhY3JvbnltXCIsIFwiYWRkcmVzc1wiLCBcImFwcGxldFwiLCBcImFyZWFcIiwgXCJhcnRpY2xlXCIsIFwiYXNpZGVcIiwgXCJhdWRpb1wiLCBcImJcIiwgXCJiYXNlXCIsIFwiYmFzZWZvbnRcIiwgXCJiZGlcIixcbiAgICBcImJkb1wiLCBcImJnc291bmRcIiwgXCJiaWdcIiwgXCJibGlua1wiLCBcImJsb2NrcXVvdGVcIiwgXCJib2R5XCIsIFwiYnJcIiwgXCJidXR0b25cIiwgXCJjYW52YXNcIiwgXCJjYXB0aW9uXCIsIFwiY2VudGVyXCIsIFwiY2l0ZVwiLCBcImNvZGVcIixcbiAgICBcImNvbFwiLCBcImNvbGdyb3VwXCIsIFwiY29udGVudFwiLCBcImRhdGFcIiwgXCJkYXRhbGlzdFwiLCBcImRkXCIsIFwiZGVjb3JhdG9yXCIsIFwiZGVsXCIsIFwiZGV0YWlsc1wiLCBcImRmblwiLCBcImRpYWxvZ1wiLCBcImRpclwiLCBcImRpdlwiLFxuICAgIFwiZGxcIiwgXCJkdFwiLCBcImVsZW1lbnRcIiwgXCJlbVwiLCBcImVtYmVkXCIsIFwiZmllbGRzZXRcIiwgXCJmaWdjYXB0aW9uXCIsIFwiZmlndXJlXCIsIFwiZm9udFwiLCBcImZvb3RlclwiLCBcImZvcm1cIiwgXCJmcmFtZXNldFwiLCBcImgxXCIsXG4gICAgXCJoMlwiLCBcImgzXCIsIFwiaDRcIiwgXCJoNVwiLCBcImg2XCIsIFwiaGVhZFwiLCBcImhlYWRlclwiLCBcImhncm91cFwiLCBcImhyXCIsIFwiaHRtbFwiLCBcImlcIiwgXCJpZnJhbWVcIiwgXCJpbWdcIiwgXCJpbnB1dFwiLCBcImluc1wiLCBcImlzaW5kZXhcIixcbiAgICBcImtiZFwiLCBcImtleWdlblwiLCBcImxhYmVsXCIsIFwibGVnZW5kXCIsIFwibGlcIiwgXCJsaW5rXCIsIFwibGlzdGluZ1wiLCBcIm1haW5cIiwgXCJtYXBcIiwgXCJtYXJrXCIsIFwibWFycXVlZVwiLCBcIm1lbnVcIiwgXCJtZW51aXRlbVwiLCBcIm1ldGFcIixcbiAgICBcIm1ldGVyXCIsIFwibmF2XCIsIFwibm9iclwiLCBcIm5vZnJhbWVzXCIsIFwibm9zY3JpcHRcIiwgXCJvYmplY3RcIiwgXCJvbFwiLCBcIm9wdGdyb3VwXCIsIFwib3B0aW9uXCIsIFwib3V0cHV0XCIsIFwicFwiLCBcInBhcmFtXCIsIFwicGljdHVyZVwiLFxuICAgIFwicGxhaW50ZXh0XCIsIFwicHJlXCIsIFwicHJvZ3Jlc3NcIiwgXCJxXCIsIFwicnBcIiwgXCJydFwiLCBcInJ1YnlcIiwgXCJzXCIsIFwic2FtcFwiLCBcInNjcmlwdFwiLCBcInNlY3Rpb25cIiwgXCJzZWxlY3RcIiwgXCJzaGFkb3dcIiwgXCJzbWFsbFwiLFxuICAgIFwic291cmNlXCIsIFwic3BhY2VyXCIsIFwic3BhblwiLCBcInN0cmlrZVwiLCBcInN0cm9uZ1wiLCBcInN0eWxlXCIsIFwic3ViXCIsIFwic3VtbWFyeVwiLCBcInN1cFwiLCBcInRhYmxlXCIsIFwidGJvZHlcIiwgXCJ0ZFwiLCBcInRlbXBsYXRlXCIsXG4gICAgXCJ0ZXh0YXJlYVwiLCBcInRmb290XCIsIFwidGhcIiwgXCJ0aGVhZFwiLCBcInRpbWVcIiwgXCJ0aXRsZVwiLCBcInRyXCIsIFwidHJhY2tcIiwgXCJ0dFwiLCBcInVcIiwgXCJ1bFwiLCBcInZhclwiLCBcInZpZGVvXCIsIFwid2JyXCIsIFwieG1wXCJcbl07XG5lbHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICBoW2VsXSA9IGguZWwuYmluZChoLCBlbCk7XG59KTtcbi8vIGJpbmQgZG9jdW1lbnQgZnJhZ21lbnQgdG9vXG5oLkRGID0gaC5lbC5iaW5kKGgsIFwiQERGXCIpO1xuaC5kRiA9IGguREY7XG5tb2R1bGUuZXhwb3J0cyA9IGg7XG4iLCIvKlxuICogX3ktaCAtIHNpbXBsZSBET00gdGVtcGxhdGluZ1xuICpcbiAqIEBhdXRob3IgS2VycmkgU2hvdHRzXG4gKiBAbGljZW5zZSBNSVRcbiAqXG4gKiBgYGBcbiAqIENvcHlyaWdodCAoYykgMjAxNCAtIDIwMTUgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKi9cblxuZnVuY3Rpb24gb25FYWNoRGVmaW5lZCAoIG8sIHByb3AsIGNiICkge1xuICAgIHZhciBvUHJvcCwgcHJvcE5hbWUsIHByb3BWYWx1ZTtcbiAgICBpZiAobyAhPT0gdW5kZWZpbmVkICYmIG8gIT09IG51bGwpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9wID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNiID0gcHJvcDtcbiAgICAgICAgICAgIG9Qcm9wID0gbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9Qcm9wID0gb1twcm9wXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob1Byb3AgIT09IHVuZGVmaW5lZCAmJiBvUHJvcCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKG9Qcm9wIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBvUHJvcC5mb3JFYWNoKGNiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9Qcm9wID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgZm9yIChwcm9wTmFtZSBpbiBvUHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob1Byb3AuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wVmFsdWUgPSBvUHJvcFtwcm9wTmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcFZhbHVlICE9PSB1bmRlZmluZWQgJiYgcHJvcFZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2Iob1Byb3BbcHJvcE5hbWVdLCBwcm9wTmFtZSwgb1Byb3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBjb3B5IHByb3BlcnRpZXNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb25FYWNoRGVmaW5lZDtcbiIsIi8qXG4gKiBfeS1oIC0gc2ltcGxlIERPTSB0ZW1wbGF0aW5nXG4gKlxuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEBsaWNlbnNlIE1JVFxuICpcbiAqIGBgYFxuICogQ29weXJpZ2h0IChjKSAyMDE0IC0gMjAxNSBLZXJyaSBTaG90dHMsIHBob3RvS2FuZHkgU3R1ZGlvcyBMTENcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZ1xuICogY29uZGl0aW9uczpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXNcbiAqIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVJcbiAqIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlRcbiAqIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gKiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKiBgYGBcbiAqL1xuXG4vKipcbiAqIFBhcnNlcyBhIHRhZyBzdHJpbmcgd2l0aCBhIHJlZ3VsYXIgZXhwcmVzc2lvbi4gUmV0dXJucyB1bmRlZmluZWQgaWYgdGhlXG4gKiBtYXRjaCBpcyBub3QgZm91bmQuIElmIGNob3AgaXMgdHJ1ZSwgdGhlIGZpcnN0IGNoYXJhY3RlciBpcyBlbGltaW5hdGVkXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge1JlZ0V4cH0gcmVnZXhwXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtjaG9wXVxuICogQHJldHVybnMgeyp9XG4gKi9cbmZ1bmN0aW9uIHBhcnNlKHN0ciwgcmVnZXhwLCBjaG9wKSB7XG4gICAgdmFyIHJlc3VsdHMgPSBzdHIubWF0Y2gocmVnZXhwKSxcbiAgICAgICAgclN0cjtcbiAgICBpZiAocmVzdWx0cyA9PT0gbnVsbCB8fCByZXN1bHRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHJlc3VsdHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICByU3RyID0gKGNob3AgPyByZXN1bHRzWzBdLnN1YnN0cigxKSA6IHJlc3VsdHNbMF0pLnRyaW0oKTtcbiAgICAgICAgcmV0dXJuIHJTdHIgPT09IFwiXCIgPyB1bmRlZmluZWQgOiByU3RyO1xuICAgIH1cbn1cblxuLyoqXG4gKiBwYXJzZXMgYW4gaW5jb21pbmcgdGFnIGludG8gaXRzIHRhZyBgbmFtZWAsIGBpZGAsIGFuZCBgY2xhc3NgIGNvbnN0aXR1ZW50c1xuICogQSB0YWcgaXMgb2YgdGhlIGZvcm0gYHRhZ05hbWUuY2xhc3MjaWRgIG9yIGB0YWdOYW1lI2lkLmNsYXNzYC4gVGhlIGBpZGAgYW5kIGBjbGFzc2BcbiAqIGFyZSBvcHRpb25hbC5cbiAqXG4gKiBJZiBhdHRyaWJ1dGVzIG5lZWQgdG8gYmUgc3VwcGxpZWQsIGl0J3MgcG9zc2libGUgdmlhIHRoZSBgP2AgcXVlcnkgc3RyaW5nLiBBdHRyaWJ1dGVzXG4gKiBhcmUgb2YgdGhlIGZvcm0gYD9hdHRyPXZhbHVlJmF0dHI9dmFsdWUuLi5gLlxuICpcbiAqXG4gKlxuICogQG1ldGhvZCBwYXJzZVRhZ1xuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgICAgICB0YWcgdG8gcGFyc2VcbiAqIEByZXR1cm4ge3t0YWc6IHN0cmluZywgaWQ6IHN0cmluZywgY2xhc3M6IHN0cmluZywgcXVlcnk6IHN0cmluZywgcXVlcnlQYXJ0czogQXJyYXk8c3RyaW5nPn19IE9iamVjdCBvZiB0aGUgZm9ybSBgeyB0YWc6IHRhZ05hbWUsIGlkOiBpZCwgY2xhc3M6IGNsYXNzLCBxdWVyeTogcXVlcnksIHF1ZXJ5UGFyczogQXJyYXkgfWBcbiAqL1xuZnVuY3Rpb24gcGFyc2VUYWcodGFnKSB7XG4gICAgdmFyIHRhZ1BhcnRzID0ge1xuICAgICAgICB0YWc6ICAgICAgICBcIlwiLFxuICAgICAgICBpZDogICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIGNsYXNzOiAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgcXVlcnk6ICAgICAgdW5kZWZpbmVkLFxuICAgICAgICBxdWVyeVBhcnRzOiBbXVxuICAgIH07XG5cbiAgICAvLyBpZiBubyB0YWcsIHJldHVybiBhIGJsYW5rIHN0cnVjdHVyZVxuICAgIGlmICh0YWcgPT09IHVuZGVmaW5lZCB8fCB0YWcgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRhZ1BhcnRzO1xuICAgIH1cblxuICAgIC8vIHBpY2sgb3V0IHRoZSByZWxldmFudCBwaWVjZXMgb2YgdGhlIHRhZ1xuICAgIC8vIGVsZW1lbnQgdGFnIG5hbWUgaXMgYXQgdGhlIGZyb250XG4gICAgLy8gIyBpZGVudGlmaWVzIElEXG4gICAgLy8gLiBpZGVudGlmaWVzIGNsYXNzXG4gICAgLy8gPyBpZGVudGlmaWVzIGF0dHJpYnV0ZXMgKHF1ZXJ5IHN0cmluZyBmb3JtYXQpXG4gICAgdGFnUGFydHMudGFnID0gcGFyc2UodGFnLCAvLlteXFwjXFwuXFw/XSovKTtcbiAgICB0YWdQYXJ0cy5pZCA9IHBhcnNlKHRhZywgL1xcI1teXFwjXFwuXFw/XSsvLCB0cnVlKTtcbiAgICB0YWdQYXJ0cy5xdWVyeSA9IHBhcnNlKHRhZywgL1xcP1teXFwjXFwuXFw/XSsvLCB0cnVlKTtcbiAgICB0YWdQYXJ0cy5jbGFzcyA9IHBhcnNlKHRhZywgL1xcLlteXFwjXFwuXFw/XSsvLCB0cnVlKTtcblxuICAgIGlmICh0YWdQYXJ0cy5xdWVyeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIHNwbGl0IG9uICYuIFdlIGRvbid0IGRvIGFueXRoaW5nIGZ1cnRoZXIgKGxpa2Ugc3BsaXQgb24gPSlcbiAgICAgICAgdGFnUGFydHMucXVlcnlQYXJ0cyA9IHRhZ1BhcnRzLnF1ZXJ5LnNwbGl0KFwiJlwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFnUGFydHM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VUYWc7XG4iXX0=
