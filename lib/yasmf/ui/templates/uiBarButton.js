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
