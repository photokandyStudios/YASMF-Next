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
