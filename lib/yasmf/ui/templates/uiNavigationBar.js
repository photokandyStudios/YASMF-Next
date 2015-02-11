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
