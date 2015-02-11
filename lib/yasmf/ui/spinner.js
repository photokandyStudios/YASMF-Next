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
