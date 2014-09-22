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
define( [ "globalize", "cultures/globalize.culture.en-US" ], function () {
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
    [ "$", $ ],
    [ "$$", $$ ],
    [ "$1", $ ],
    [ "$id", $id ],
    [ "gsc", getComputedStyle ],
    [ "gcs", getComputedStyle ],
    [ "getComputedStyle", getComputedStyle ]
  ].forEach( function ( i ) {
    if ( typeof proto[ i[ 0 ] ] === "undefined" ) {
      proto[ i[ 0 ] ] = i[ 1 ];
    }
  } );
  var _y = {
    VERSION: "0.5.142",
    /**
     * Returns an element from the DOM with the specified
     * ID. Similar to (but not like) jQuery's $(), except
     * that this is a pure DOM element.
     * @method ge
     * @alias $id
     * @param  {String} elementId     id to search for, relative to document
     * @return {Node}                 null if no node found
     */
    ge: $id.bind( document ),
    $id: $id.bind( document ),
    /**
     * Returns an element from the DOM using `querySelector`.
     * @method qs
     * @alias $
     * @alias $1
     * @param {String} selector       CSS selector to search, relative to document
     * @returns {Node}                null if no node found that matches search
     */
    $: $.bind( document ),
    $1: $.bind( document ),
    qs: $.bind( document ),
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
    $$: $$.bind( document ),
    gac: $$.bind( document ),
    qsa: $$.bind( document ),
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
    getComputedStyle: getComputedStyle,
    gcs: getComputedStyle,
    gsc: getComputedStyle,
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
    template: function ( templateElement, replacements, addtlOptions ) {
      var brackets = [ "%", "%" ],
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
          thisVar = brackets[ 0 ];
          if ( transform !== "" ) {
            thisVar += theVar[ transform ]();
          } else {
            thisVar += theVar;
          }
          thisVar += brackets[ 1 ];
          while ( templateHTML.indexOf( thisVar ) > -1 ) {
            templateHTML = templateHTML.replace( thisVar, replacements[ theVar ] );
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
    underCordova: false,
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
    executeWhenReady: function ( callback ) {
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
    currentUserLocale: "",
    /**
     * A translation matrix. Used by `addTranslation(s)` and `T`.
     *
     * @property localizedText
     * @type {Object}
     */
    localizedText: {},
    /**
     * Given a locale string, normalize it to the form of `la-RE` or `la`, depending on the length.
     * ```
     *     "enus", "en_us", "en_---__--US", "EN-US" --> "en-US"
     *     "en", "en-", "EN!" --> "en"
     * ```
     * @method normalizeLocale
     * @param {Locale} theLocale
     */
    normalizeLocale: function ( theLocale ) {
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
    addTranslation: function ( locale, key, value ) {
      var self = _y,
        // we'll store translations with upper-case locales, so case never matters
        theNewLocale = self.normalizeLocale( locale ).toUpperCase();
      // store the value
      if ( typeof self.localizedText[ theNewLocale ] === "undefined" ) {
        self.localizedText[ theNewLocale ] = {};
      }
      self.localizedText[ theNewLocale ][ key.toUpperCase() ] = value;
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
    addTranslations: function ( o ) {
      var self = _y;
      for ( var key in o ) {
        if ( o.hasOwnProperty( key ) ) {
          for ( var locale in o[ key ] ) {
            if ( o[ key ].hasOwnProperty( locale ) ) {
              self.addTranslation( locale, key, o[ key ][ locale ] );
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
    getUserLocale: function () {
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
          userLocale = tempLocale[ 1 ];
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
    getDeviceLocale: function ( callback ) {
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
    lookupTranslation: function ( key, theLocale ) {
      var self = _y,
        upperKey = key.toUpperCase(),
        userLocale = theLocale || self.getUserLocale();
      userLocale = self.normalizeLocale( userLocale ).toUpperCase();
      // look it up by checking if userLocale exists, and then if the key (uppercased) exists
      if ( typeof self.localizedText[ userLocale ] !== "undefined" ) {
        if ( typeof self.localizedText[ userLocale ][ upperKey ] !== "undefined" ) {
          return self.localizedText[ userLocale ][ upperKey ];
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
    localeOfLastResort: "en-US",
    /**
     * @property languageOfLastResort
     * @default "en"
     * @type {Locale}
     */
    languageOfLastResort: "en",
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
    T: function ( key, parms, locale ) {
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
    N: function ( theNumber, theFormat, theLocale ) {
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
    C: function ( theNumber, theFormat, theLocale ) {
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
    PCT: function ( theNumber, theFormat, theLocale ) {
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
    D: function ( theDate, theFormat, theLocale ) {
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
    format: function ( theValue, theFormat, theLocale ) {
      var self = _y,
        iFormat = theFormat,
        iLocale = theLocale || self.getUserLocale();
      self.setGlobalizationLocale( iLocale );
      return Globalize.format( theValue, iFormat );
    }
  };
  return _y;
} );
