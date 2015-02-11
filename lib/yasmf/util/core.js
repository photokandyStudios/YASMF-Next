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
