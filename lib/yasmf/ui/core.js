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
