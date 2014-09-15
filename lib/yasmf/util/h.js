/**
 *
 * h - simple DOM demplating
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
/*global define, Node, document*/
define( [ "yasmf/util/object" ], function ( BaseObject ) {
  /**
   * internal private method to handle parsing children
   * and attaching them to their parents
   *
   * If the child is a NODE, it is attached directly to the parent as a child
   * If the child is a FUNCTION, the RESULTS are re-parsed, ultimately to be attached to the parent
   *   as children
   * If the child is an ARRAY, each element within the array is re-parsed, ultimately to be attached
   *   to the parent as children
   *
   * @param {Array|Function|Node} child       child to handle and attach
   * @param {Node} parent                     parent
   *
   */
  function handleChild( child, parent ) {
    if ( typeof child === "object" ) {
      if ( child instanceof Array ) {
        for ( var i = 0, l = child.length; i < l; i++ ) {
          handleChild( child[ i ], parent );
        }
      }
      if ( child instanceof Node ) {
        parent.appendChild( child );
      }
    }
    if ( typeof child === "function" ) {
      handleChild( child(), parent );
    }
  }
  /**
   * parses an incoming tag into its tag name, id, and class constituents
   * A tag is of the form "tagName.class#id" or "tagName#id.class". The id and class
   * are optional.
   *
   * @param {string} tag      tag to parse
   * @return {*} Object of the form { tag: tagName, id: id, class: class }
   */
  function parseTag( tag ) {
    var tagParts = {
        tag: "",
        id: undefined,
        class: undefined
      },
      hashPos = tag.indexOf( "#" ),
      dotPos = tag.indexOf( "." );
    if ( hashPos < 0 && dotPos < 0 ) {
      tagParts.tag = tag;
      return tagParts;
    }
    if ( hashPos > 0 && dotPos < 0 ) {
      tagParts.tag = tag.substr( 0, hashPos );
      tagParts.id = tag.substr( hashPos + 1, tag.length );
      return tagParts;
    }
    if ( dotPos > 0 && hashPos < 0 ) {
      tagParts.tag = tag.substr( 0, dotPos );
      tagParts.class = tag.substr( dotPos + 1, tag.length );
      return tagParts;
    }
    if ( dotPos > 0 && hashPos > 0 && hashPos < dotPos ) {
      tagParts.tag = tag.substr( 0, hashPos );
      tagParts.id = tag.substr( hashPos + 1, ( dotPos - hashPos ) - 1 );
      tagParts.class = tag.substr( dotPos + 1, tag.length );
      return tagParts;
    }
    if ( dotPos > 0 && hashPos > 0 && dotPos < hashPos ) {
      tagParts.tag = tag.substr( 0, dotPos );
      tagParts.class = tag.substr( dotPos + 1, ( hashPos - dotPos ) - 1 );
      tagParts.id = tag.substr( hashPos + 1, tag.length );
      return tagParts;
    }
    return tagParts;
  }
  /**
   * h templating engine
   *   short for HTML
   *
   * Generates a DOM tree (or just a single node) based on a series of method calls
   * into h. h has one root method (el) that creates all DOM elements, but also has
   * helper methods for each HTML tag. This means that a UL can be created simply by
   * calling h.ul.
   *
   * Technically there's no such thing as a template using this library, but functions
   * encapsulating a series of h calls function as an equivalent if properly decoupled
   * from their surrounds.
   */
  var h = {
      /**
       * Returns a DOM tree containing the requested element and any further child
       * elements (as extra parameters)
       *
       * @param {string} tag                 tag of the form "tagName.class#id" or "tagName#id.class"
       * @param {*} tagOptions               options for the tag
       * @param {Array|Function|String} ...  children that should be attached
       * @returns {Node}                     DOM tree
       *
       * tagOptions should be an object consisting of the following optional segments:
       *
       * {
       *    attrs: {...}                     attributes to add to the element
       *    styles: {...}                    style attributes to add to the element TODO
       *    on: {...}                        event handlers to attach to the element TODO
       *    bind: {...}                      data binding (TODO)
       * }
       *
       */
      el: function ( tag ) {
        var e,
          options,
          content,
          tagParts = parseTag( tag ); // parse tag; it should be of the form tag[#id][.class]
        // create the element; if @DF is used, a document fragment is used instead
        if ( tagParts.tag !== "@DF" ) {
          e = document.createElement( tagParts.tag );
        } else {
          e = document.createDocumentFragment();
        }
        // attach the class and id from the tag name, if available
        if ( tagParts.class !== undefined ) {
          e.className = tagParts.class;
        }
        if ( tagParts.id !== undefined ) {
          e.setAttribute( "id", tagParts.id );
        }
        // get the arguments as an array, ignoring the first parameter
        var args = Array.prototype.slice.call( arguments, 1 );
        // determine what we've passed in the second/third parameter
        // if it is an object (but not a node or array), it's a list of
        // options to attach to the element. If it is a string, it's text
        // content that should be added using .textContent.
        // note: we could parse the entire argument list, but that would
        // a bit absurd.
        for ( var i = 0; i < 2; i++ ) {
          if ( typeof args[ 0 ] !== "undefined" ) {
            if ( typeof args[ 0 ] === "object" ) {
              // could be a DOM node, an array, or tag options
              if ( !( args[ 0 ] instanceof Node ) && !( args[ 0 ] instanceof Array ) ) {
                options = args.shift();
              }
            }
            if ( typeof args[ 0 ] === "string" ) {
              // this is text content
              content = args.shift();
            }
          }
        }
        // copy over any attributes and styles in options.attrs and options.style
        if ( typeof options === "object" ) {
          // add attributes
          if ( typeof options.attrs !== "undefined" ) {
            for ( var attr in options.attrs ) {
              if ( options.attrs.hasOwnProperty( attr ) ) {
                e.setAttribute( attr, options.attrs[ attr ] );
              }
            }
          }
          // add styles
          if ( typeof options.styles !== "undefined" ) {
            for ( var style in options.styles ) {
              if ( options.styles.hasOwnProperty( style ) ) {
                e.style[ style ] = options.styles[ style ];
              }
            }
          }
          // add event handlers; handler property is expected to be a valid DOM
          // event, i.e. { "change": function... } or { change: function... }
          // if the handler is an object, it must be of the form
          //   { handler: function ...,
          //     capture: true/false }
          if ( typeof options.on !== "undefined" ) {
            for ( var evt in options.on ) {
              if ( options.on.hasOwnProperty( evt ) ) {
                if ( typeof options.on[ evt ] === "function" ) {
                  e.addEventListener( evt, options.on[ evt ].bind( e ), false );
                } else {
                  e.addEventListener( evt, options.on[ evt ].handler.bind( e ), typeof options.on[ evt ].capture !== "undefined" ?
                    options.on[ evt ].capture : false );
                }
              }
            }
          }
          // Data binding only occurs if using YASMF's BaseObject for now (built-in pubsub)
          // along with observable properties
          // the binding object is of the form { object: objectRef, keyPath: "keyPath" }
          if ( typeof options.bind !== "undefined" ) {
            if ( typeof BaseObject !== "undefined" ) {
              if ( options.bind.object instanceof BaseObject ) {
                // we have an object that has observable properties
                options.bind.object.dataBindOn( e, options.bind.keyPath );
                // get the current value so it can be displayed
                content = options.bind.object[ options.bind.keyPath ];
              }
            }
          }
          // allow elements to be stored into a context
          // store must be an object of the form {object:objectRef, keyPath: "keyPath" }
          if ( typeof options.store !== "undefined" ) {
            options.store.object[ options.store.keyPath ] = e;
          }
        }
        // if we have content, go ahead and add it
        // if we're an element that has a value, we attach it to the value
        // property instead of textContent. If textContent is not available
        // we use innerText; if that's not available, we complain and do
        // nothing. Falling back to innerHTML isn't an option, as that's what
        // we are explicitly trying to avoid.
        if ( typeof content === "string" || typeof content === "number" ) {
          if ( typeof e.value !== "undefined" ) {
            e.value = content;
          } else {
            if ( typeof e.textContent !== "undefined" ) {
              e.textContent = content;
            } else {
              if ( typeof e.innerText !== "undefined" ) {
                e.innerText = content;
              } else {
                console.log( "WARNING! This browser doesn't support textContent or innerText." );
              }
            }
          }
        }
        // Handle children; handleChild appends each one to the parent
        var child, l;
        for ( i = 0, l = args.length; i < l; i++ ) {
          //console.log(i);
          child = args[ i ];
          handleChild( child, e );
        }
        // return the element (and associated tree)
        return e;
      }
    },
    // create bindings for each HTML element (from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
    els = [ "a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi",
      "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code",
      "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl",
      "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frameset", "h1", "h2", "h3",
      "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "isindex", "kbd",
      "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter",
      "nav", "nobr", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext",
      "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "shadow", "small", "source",
      "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea",
      "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"
    ];
  els.forEach( function ( el ) {
    h[ el ] = h.el.bind( h, el );
  } );
  return h;
} );
