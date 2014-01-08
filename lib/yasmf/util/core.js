/**
 *
 * Core of YASMF-UTIL; defines the version, DOM, and localization convenience methods.
 *
 * core.js
 * @module core.js
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
/*jshint
         asi:true,
         bitwise:true,
         browser:true,
         camelcase:true,
         curly:true,
         eqeqeq:false,
         forin:true,
         noarg:true,
         noempty:true,
         plusplus:false,
         smarttabs:true,
         sub:true,
         trailing:false,
         undef:true,
         white:false,
         onevar:false
 */
/*global define, Globalize, device*/

define ( ["globalize", "cultures/globalize.culture.en-US"], function () {
   var _y =
   {
      VERSION: '0.4.100',
      /**
       * Returns an element from the DOM with the specified
       * ID. Similar to (but not like) jQuery's $(), except
       * that this is a pure DOM element.
       * @param  {string} elementId
       * @return {DOMElement}
       */
      ge: function (elementId)
      {
        return document.getElementById(elementId);
      },
      /**
       * Returns an array of all elements matching a given
       * selector. The array is processed to be a real array,
       * not a nodeList.
       * @param  {string} selector
       * @return {Array} of DOMElements
       */
      gac: function (selector)
      {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      },
      /**
       * Returns a parsed template. The template can be a simple
       * string, in which case the replacement variable are replaced
       * and returned simply, or the template can be a DOMelement,
       * in which case the template is assumed to be the DOM Element's
       * innerHTML, and then the replacement variables are parsed.
       *
       * Replacement variables are of the form %VARIABLE%, and
       * can occur anywhere, not just within strings in HTML.
       *
       * The replacements array is of the form
       *   { "VARIABLE": replacement, "VARIABLE2": replacement, ... }
       *
       * @param  {DOMElement|String} templateElement
       * @param  {Array} replacements
       * @return {String}
       */
      template: function (templateElement, replacements)
      {
        var templateHTML = templateElement.innerHTML || templateElement;

        for (var theVar in replacements)
        {
          if (replacements.hasOwnProperty (theVar))
          {
            while (templateHTML.indexOf('%' + theVar.toUpperCase() + '%') > -1)
            {
              templateHTML = templateHTML.replace('%' + theVar.toUpperCase() + '%', replacements[theVar]);
            }
          }
        }
        return templateHTML;
      },
      /**
       * The following functions are related to globalization and localization, which
       * are now considered to be core functions (previously it was broken out in
       * PKLOC)
       */
      currentUserLocale: "",
      localizedText: {},
      /**
       * Sets the current locale.
       * @param {String} theLocale
       */
      setGlobalizationLocale: function (theLocale)
      {
         var theNewLocale = theLocale;
         // if the specified locale is four characters of the form abcd, convert to ab-cd.
         if (theNewLocale.length == 4)
         {
          theNewLocale = theNewLocale.substr(0,2) + "-" + theNewLocale.substr(2,2);
         }
         // make sure theLocale is in the format ab-CD; ab-cd will not work.
         theNewLocale = theNewLocale.substr(0,3).toLowerCase() + theNewLocale.substr(3,2).toUpperCase();
         Globalize.culture(theNewLocale);
      },
      /**
       * Add a translation to the existing translation matrix
       * @param {String} locale
       * @param {String} key
       * @param {String} value
       */
      addTranslation: function (locale, key, value)
      {
        var self = _y;
        // we'll store translations with upper-case locales, so case never matters
        var theNewLocale = locale.toUpperCase();
         // if the specified locale is four characters of the form abcd, convert to ab-cd.
         if (theNewLocale.length == 4)
         {
          theNewLocale = theNewLocale.substr(0,2) + "-" + theNewLocale.substr(2,2);
         }
        // store the value
        if (self.localizedText[theNewLocale])
        {
          self.localizedText[theNewLocale][key.toUpperCase()] = value;
        } else
        {
          self.localizedText[theNewLocale] =
          {
          };
          self.localizedText[theNewLocale][key.toUpperCase()] = value;
        }
      },
      /**
       * Add translations in batch, as follows:
       *
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
       * @param {[type]} o
       */
      addTranslations: function ( o )
      {
         var self = _y;
         for (var key in o)
         {
            if (o.hasOwnProperty (key))
            {
              for (var locale in o[key])
              {
                if (o[key].hasOwnProperty (locale))
                {
                 self.addTranslation (locale, key, o[key][locale]);
                }
              }
            }
         }
      },
      /**
       * Returns the user's locale (e.g., en-US or fr-FR). If one
       * can't be found, "en-US" is returned.
       * @return {locale}
       */
      getUserLocale: function ()
      {
         var self = _y;
        if (self.currentUserLocale)
        {
          return self.currentUserLocale;
        }
        var currentPlatform = "unknown";
        if ( typeof device != 'undefined')
        {
          currentPlatform = device.platform;
        }
        var userLocale = "en-US";
        // a suitable default

        if (currentPlatform == "Android")
        {
          // parse the navigator.userAgent
          var userAgent = navigator.userAgent;
          // inspired by http://stackoverflow.com/a/7728507/741043
          var tempLocale = userAgent.match(/Android.*([a-zA-Z]{2}-[a-zA-Z]{2})/);
          if (tempLocale)
          {
            userLocale = tempLocale[1];
          }
        } else
        {
          userLocale = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage;
          userLocale = userLocale;
        }

        self.currentUserLocale = userLocale;
        return self.currentUserLocale;
      },
      lookupTranslation: function (key, theLocale)
      {
         var self=_y;
        var userLocale = theLocale || self.getUserLocale();
        userLocale = userLocale.toUpperCase();
         // if the specified locale is four characters of the form abcd, convert to ab-cd.
         if (userLocale.length == 4)
         {
          userLocale = userLocale.substr(0,2) + "-" + userLocale.substr(2,2);
         }

        // look it up by checking if userLocale exists, and then if the key (uppercased) exists
        if (self.localizedText[userLocale])
        {
          if (self.localizedText[userLocale][key.toUpperCase()])
          {
            return self.localizedText[userLocale][key.toUpperCase()];
          }
        }

        // if not found, we don't return anything but null
        return null;
      },
      /**
       * Convenience function for translating text. Key is the only
       * required value and case doesn't matter (it's uppercased). Replacement
       * variables can be specified using parms of the form { "VAR":"VALUE" },
       * using %VAR% in the key/value returned. If locale is specified, it
       * takes precedence over the user's current locale.
       *
       * @param {String} key
       * @param {Array} parms
       * @param {String} locale
       */
      T: function (key, parms, locale)
      {
         var self = _y;
        var userLocale = locale || self.getUserLocale();
        var currentValue = "";

        if (!( currentValue = self.lookupTranslation(key, userLocale)))
        {
          // we haven't found it under the given locale (of form: xx-XX), try the fallback locale (xx)
          userLocale = userLocale.substr(0, 2);
          if (!( currentValue = self.lookupTranslation(key, userLocale)))
          {
            // we haven't found it under any of the given locales; try en-US
            userLocale = "en-US";
            if (!( currentValue = self.lookupTranslation(key, userLocale)))
            {
              // we haven't found it under any of the given locales; try en
              userLocale = "en";
              if (!( currentValue = self.lookupTranslation(key, userLocale)))
              {
                // we didn't find it at all... we'll use the key
                currentValue = key;
              }
            }
          }
        }
        return self.template(currentValue, parms);
      },
      /**
       * Convenience function for localizing numbers according the format (optional) and
       * the locale (optional). theFormat is typicaly the number of places to use; "n" if
       * not specified.
       *
       * @param {Number} theNumber
       * @param {Number/String} theFormat
       * @param {String} theLocale
       */
      N: function (theNumber, theFormat, theLocale)
      {
         var self=_y;
        var iFormat = "n" + theFormat;
        var iLocale = theLocale || self.getUserLocale();

        self.setGlobalizationLocale(iLocale);

        return Globalize.format(theNumber, iFormat);
      },
      /**
       * Convenience function for localizing currency. theFOrmat is the number of decimal places
       * or "2" if not specified. If there are more places than digits, padding is added; if there
       * are fewer places, rounding is performed.
       *
       * @param {Number} theNumber
       * @param {String} theFormat
       * @param {String} theLocale
       */
      C: function (theNumber, theFormat, theLocale)
      {
         var self=_y;
        var iFormat = "c" + theFormat;
        var iLocale = theLocale || self.getUserLocale();

        self.setGlobalizationLocale(iLocale);

        return Globalize.format(theNumber, iFormat);
      },
      /**
       * Convenience function for localizing perentages. theFormat specifies the number of
       * decimal places; two if not specified.
       * @param {Number} theNumber
       * @param {Number} theFormat
       * @param {String} theLocale
       */
      PCT: function (theNumber, theFormat, theLocale)
      {
         var self=_y;
        var iFormat = "p" + theFormat;
        var iLocale = theLocale || self.getUserLocale();

        self.setGlobalizationLocale(iLocale);

        return Globalize.format(theNumber, iFormat);
      },
      /**
       * Convenience function for localizing dates.
       *
       * theFormat specifies the format; "d" is assumed if not provided.
       *
       * @param {Date} theDate
       * @param {String} theFormat
       * @param {String} theLocale
       */
      D: function (theDate, theFormat, theLocale)
      {
         var self=_y;
        var iFormat = theFormat || "d";
        var iLocale = theLocale || self.getUserLocale();

        self.setGlobalizationLocale(iLocale);

        return Globalize.format(theDate, iFormat);
      }
   }

   return _y;
});
