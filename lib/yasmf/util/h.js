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
/*global module, Node, document*/
"use strict";
var BaseObject = require( "./object" );
/**
 *
 * internal private method to handle parsing children
 * and attaching them to their parents
 *
 * If the child is a `Node`, it is attached directly to the parent as a child
 * If the child is a `function`, the *resuts* are re-parsed, ultimately to be attached to the parent
 *   as children
 * If the child is an `Array`, each element within the array is re-parsed, ultimately to be attached
 *   to the parent as children
 *
 * @method handleChild
 * @private
 * @param {Array|Function|Node} child       child to handle and attach
 * @param {Node} parent                     parent
 *
 */
function handleChild( child, parent ) {
  if ( typeof child === "object" ) {
    if ( child instanceof Array ) {
      for ( var i = 0, l = child.length; i < l; i++ ) {
        handleChild( child[i], parent );
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
 * parses an incoming tag into its tag `name`, `id`, and `class` constituents
 * A tag is of the form `tagName.class#id` or `tagName#id.class`. The `id` and `class`
 * are optional.
 *
 * If attributes need to be supplied, it's possible via the `?` query string. Attributes
 * are of the form `?attr=value&attr=value...`.
 *
 * @method parseTag
 * @private
 * @param {string} tag      tag to parse
 * @return {*} Object of the form `{ tag: tagName, id: id, class: class, query: query, queryPars: Array }`
 */
function parseTag( tag ) {
  var tagParts = {
      tag:        "",
      id:         undefined,
      class:      undefined,
      query:      undefined,
      queryParts: []
    },
    hashPos = tag.indexOf( "#" ),
    dotPos = tag.indexOf( "." ),
    qmPos = tag.indexOf( "?" );
  if ( qmPos >= 0 ) {
    tagParts.query = tag.substr( qmPos + 1 );
    tagParts.queryParts = tagParts.query.split( "&" );
    tag = tag.substr( 0, qmPos );
  }
  if ( hashPos < 0 && dotPos < 0 ) {
    tagParts.tag = tag;
    return tagParts;
  }
  if ( hashPos >= 0 && dotPos < 0 ) {
    tagParts.tag = tag.substr( 0, hashPos );
    tagParts.id = tag.substr( hashPos + 1 );
    return tagParts;
  }
  if ( dotPos >= 0 && hashPos < 0 ) {
    tagParts.tag = tag.substr( 0, dotPos );
    tagParts.class = tag.substr( dotPos + 1 );
    return tagParts;
  }
  if ( dotPos >= 0 && hashPos >= 0 && hashPos < dotPos ) {
    tagParts.tag = tag.substr( 0, hashPos );
    tagParts.id = tag.substr( hashPos + 1, ( dotPos - hashPos ) - 1 );
    tagParts.class = tag.substr( dotPos + 1 );
    return tagParts;
  }
  if ( dotPos >= 0 && hashPos >= 0 && dotPos < hashPos ) {
    tagParts.tag = tag.substr( 0, dotPos );
    tagParts.class = tag.substr( dotPos + 1, ( hashPos - dotPos ) - 1 );
    tagParts.id = tag.substr( hashPos + 1 );
    return tagParts;
  }
  return tagParts;
}
var globalEvents = {},
  renderEvents = {};
var globalSequence = 0;

function getAndSetElementId( e ) {
  var id = e.getAttribute( "id" );
  if ( id === undefined || id === null ) {
    globalSequence++;
    id = "h-y-" + globalSequence;
    e.setAttribute( "id", id );
  }
  return id;
}
/**
 * h templating engine
 */
var h = {
    VERSION:       "0.1.100",
    useDomMerging: false,
    debug:         false,
    _globalEvents: globalEvents,
    _renderEvents: renderEvents,
    /* experimental! */
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
     * @param {string} tag                 tag of the form `tagName.class#id` or `tagName#id.class`
     *                                     tag can also specify attributes:
     *                                        `input?type=text&size=20`
     * @param {*} tagOptions               options for the tag (see above)
     * @param {Array|Function|String} ...  children that should be attached
     * @returns {Node}                     DOM tree
     *
     */
    el:            function ( tag ) {
      var e, i, l, f, evt,
        options,
        content = [],
        contentTarget = [],
        bindValue,
        tagParts = parseTag( tag ),
        elid,
        events = [];

      // parse tag; it should be of the form `tag[#id][.class][?attr=value[&attr=value...]`
      // create the element; if `@DF` is used, a document fragment is used instead
      if ( tagParts.tag !== "@DF" ) {
        e = document.createElement( tagParts.tag );
      } else {
        e = document.createDocumentFragment();
      }
      // attach the `class` and `id` from the tag name, if available
      if ( tagParts.class !== undefined ) {
        e.className = tagParts.class;
      }
      if ( tagParts.id !== undefined ) {
        elid = tagParts.id;
        e.setAttribute( "id", tagParts.id );
      }
      // get the arguments as an array, ignoring the first parameter
      var args = Array.prototype.slice.call( arguments, 1 );
      // determine what we've passed in the second/third parameter
      // if it is an object (but not a node or array), it's a list of
      // options to attach to the element. If it is a string, it's text
      // content that should be added using `textContent` or `value`
      // > note: we could parse the entire argument list, but that would
      // > a bit absurd.
      for ( i = 0; i < 3; i++ ) {
        if ( typeof args[0] !== "undefined" ) {
          if ( typeof args[0] === "object" ) {
            // could be a DOM node, an array, or tag options
            if ( !( args[0] instanceof Node ) && !( args[0] instanceof Array ) ) {
              options = args.shift();
            }
          }
          if ( typeof args[0] === "string" || typeof args[0] === "number" ) {
            // this is text content
            content.push( args.shift() );
          }
        }
      }
      // copy over any `queryParts` attributes
      if ( tagParts.queryParts.length > 0 ) {
        var arr;
        for ( i = 0, l = tagParts.queryParts.length; i < l; i++ ) {
          arr = tagParts.queryParts[i].split( "=" );
          if ( arr.length === 2 ) {
            e.setAttribute( arr[0].trim(), arr[1].trim() );
          }
        }
      }
      // copy over any attributes and styles in `options.attrs` and `options.style`
      if ( typeof options === "object" && options !== null ) {
        // add attributes
        if ( options.attrs ) {
          for ( var attr in options.attrs ) {
            if ( options.attrs.hasOwnProperty( attr ) ) {
              if ( options.attrs[attr] !== undefined && options.attrs[attr] !== null ) {
                e.setAttribute( attr, options.attrs[attr] );
              }
            }
          }
        }
        // add styles
        if ( options.styles ) {
          for ( var style in options.styles ) {
            if ( options.styles.hasOwnProperty( style ) ) {
              if ( options.styles[style] !== undefined && options.styles[style] !== null ) {
                e.style[style] = options.styles[style];
              }
            }
          }
        }
        // add event handlers; handler property is expected to be a valid DOM
        // event, i.e. `{ "change": function... }` or `{ change: function... }`
        // if the handler is an object, it must be of the form
        // ```
        //   { handler: function ...,
        //     capture: true/false }
        // ```
        if ( options.on ) {
          for ( evt in options.on ) {
            if ( options.on.hasOwnProperty( evt ) ) {
              if ( typeof options.on[evt] === "function" ) {
                f = options.on[evt].bind( e );
                /*events.push( {
                 type: "on",
                 evt: evt,
                 handler: f,
                 capture: false
                 } ); */
                e.addEventListener( evt, f, false );
              } else {
                f = options.on[evt].handler.bind( e );
                /*events.push( {
                 type: "on",
                 evt: evt,
                 handler: f,
                 capture: typeof options.on[ evt ].capture !== "undefined" ? options.on[ evt ].capture : false
                 } ); */
                e.addEventListener( evt, f, typeof options.on[evt].capture !== "undefined" ? options.on[evt].capture :
                                            false );
              }
            }
          }
        }
        // we support hammer too, assuming we're given a reference
        // it must be of the form `{ hammer: { gesture: { handler: fn, options: }, hammer: hammer } }`
        if ( options.hammer ) {
          var hammer = options.hammer.hammer;
          for ( evt in options.hammer ) {
            if ( options.hammer.hasOwnProperty( evt ) && evt !== "hammer" ) {
              /*events.push( {
               type: "hammer",
               evt: evt,
               hammer: hammer,
               options: options.hammer[ evt ]
               } );*/
              hammer( e, options.hammer[evt].options ).on( evt, options.hammer[evt].handler );
            }
          }
        }
        // allow elements to be stored into a context
        // store must be an object of the form `{object:objectRef, keyPath: "keyPath", [idOnly:true|false] }`
        // if idOnly is true, only the element's id is stored
        if ( options.store ) {
          if ( options.store.idOnly ) {
            elid = getAndSetElementId( e );
            options.store.object[options.store.keyPath] = elid;
          } else {
            options.store.object[options.store.keyPath] = e;
          }
        }
      }
      // if we have content, go ahead and add it;
      // if we're an element that has a `value`, we attach it to the value
      // property instead of `textContent`. If `textContent` is not available
      // we use `innerText`; if that's not available, we complain and do
      // nothing. Falling back to `innerHTML` isn't an option, as that's what
      // we are explicitly trying to avoid.
      //
      // First, determine if we have `value` and `textContent` options or only
      // `textContent` (buttons have both) If both are present, the first
      // content item is applied to `value`, and the second is applied to
      // `textContent`|`innerText`
      if ( typeof e.value !== "undefined" ) {
        contentTarget.push( "value" );
      }
      if ( ( typeof e.textContent !== "undefined" ) || ( typeof e.innerText !== "undefined" ) ) {
        contentTarget.push( typeof e.textContent !== "undefined" ? "textContent" : "innerText" );
      }
      for ( i = 0, l = contentTarget.length; i < l; i++ ) {
        var x = content.shift();
        if ( typeof x !== "undefined" ) {
          e[contentTarget[i]] = x;
        }
      }
      // Handle children; `handleChild` appends each one to the parent
      var child;
      for ( i = 0, l = args.length; i < l; i++ ) {
        child = args[i];
        handleChild( child, e );
      }
      if ( typeof options === "object" && options !== null ) {
        // Data binding only occurs if using YASMF's BaseObject for now (built-in pubsub/observables)
        // along with observable properties
        // the binding object is of the form `{ object: objectRef, keyPath: "keyPath", [keyType:"string"] }`
        if ( options.bind ) {
          if ( typeof BaseObject !== "undefined" ) {
            if ( options.bind.object instanceof BaseObject ) {
              elid = getAndSetElementId( e );
              // we have an object that has observable properties
              options.bind.object.dataBindOn( e, options.bind.keyPath, options.bind.keyType );
              options.bind.object.notifyDataBindingElementsForKeyPath( options.bind.keyPath );
            }
          }
        }
      }
      //renderEvents[elid] = events;
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
    mapTo:         function mapTo( keyPath, map ) {
      if ( typeof map === "undefined" ) {
        return keyPath;
      }
      if ( typeof map[keyPath] !== "undefined" ) {
        return map[keyPath];
      } else {
        return keyPath;
      }
    },
    /**
     * iif - evaluate `expr` and if it is `true`, return `a`. If it is false,
     * return `b`. If `a` is not supplied, `true` is the return result if `a`
     * would have been returned. If `b` is not supplied, `false` is the return
     * result if `b` would have been returned. Not much difference than the
     * ternary (`?:`) operator, but might be easier to read for some.
     *
     * @method iif
     * @param  {boolean} expr expression to evaluate
     * @param  {*} a     value to return if `expr` is true; `true` is the default if not supplied
     * @param  {*} b     value to return if `expr` is false; `false` is the default if not supplied
     * @return {*}       `expr ? a : b`
     */
    iif:           function iif( expr, a, b ) {
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
    ifdef:         function ifdef( expr, a, b ) {
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
    forIn:         function forIn( object, fn ) {
      var arr = [];
      for ( var prop in object ) {
        if ( object.hasOwnProperty( prop ) ) {
          arr.push( fn( object[prop], object, prop ) );
        }
      }
      return arr;
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
    forEach:       function forEach( arr, fn ) {
      return arr.map( fn );
    },
    /**
     * renderTo - Renders a node or array of nodes to a given element. If an
     * array is provided, each is appended in turn.
     *
     * Note: technically you can just use `appendChild` or equivalent DOM
     * methods, but this works only as far as the return result is a single
     * node. Occasionally your template may return an array of nodes, and
     * at that point `appendChild` fails.
     *
     * @method renderTo
     * @param  {Array|Node} n  Array or single node to append to the element
     * @param  {Node} el Element to attach to
     * @param  {Number} idx  index (optional)
     */
    renderTo:      function renderTo( n, el, idx ) {
      function transform( parent, nodeA, nodeB ) {
        var hasChildren = [false, false],
          childNodes = [
            [],
            []
          ],
          _A = 0,
          _B = 1,
          i, l,
          len = [0, 0],
          nodes = [nodeA, nodeB],
          attrs = [
            [],
            []
          ],
          styles = [{}, {}],
          styleKeys = [
            [],
            []
          ],
          events = [
            [],
            []
          ],
          elid = [null, null];
        if ( !nodeA && !nodeB ) {
          // nothing to do.
          return;
        }
        if ( !nodeA && nodeB ) {
          // there's no corresponding element in A; just add B.
          parent.appendChild( nodeB );
          return;
        }
        if ( nodeA && !nodeB ) {
          // there's no corresponding element in B; remove A's element
          nodeA.remove();
          return;
        }
        if ( ( nodeA.nodeType !== nodeB.nodeType ) || ( nodeB.nodeType !== 1 ) ) {
          // if the node types are different, there's no reason to transform tree A -- just replace the whole thing
          parent.replaceChild( nodeB, nodeA );
          return;
        }
        if ( nodeB.classList ) {
          if ( !nodeB.classList.contains( "ui-container" ) && !nodeB.classList.contains( "ui-list" ) && !nodeB.classList.contains(
              "ui-scroll-container" ) ) {
            // if the node types are different, there's no reason to transform tree A -- just replace the whole thing
            parent.replaceChild( nodeB, nodeA );
            return;
          }
        }
        // set up for transforming this node
        nodes.forEach( function init( node, idx ) {
          hasChildren[idx] = node.hasChildNodes();
          len[idx] = node.childNodes.length;
          if ( node.getAttribute ) {
            elid[idx] = node.getAttribute( "id" );
          }
          if ( node.childNodes ) {
            childNodes[idx] = [].slice.call( node.childNodes, 0 );
          }
          if ( node.attributes ) {
            attrs[idx] = [].slice.call( node.attributes, 0 );
          }
          if ( node.styles ) {
            styles[idx] = node.style;
            styleKeys[idx] = Object.keys( styles[idx] );
          }
        } );
        //events[_A] = globalEvents[elid[_A]] || [];
        //events[_B] = renderEvents[elid[_B]] || [];
        // transform all our children
        for ( i = 0, l = Math.max( len[_A], len[_B] ); i < l; i++ ) {
          transform( nodeA, childNodes[_A][i], childNodes[_B][i] );
        }
        // copy attributes
        for ( i = 0, l = Math.max( attrs[_A].length, attrs[_B].length ); i < l; i++ ) {
          if ( attrs[_A][i] ) {
            if ( !nodeB.hasAttribute( attrs[_A][i].name ) ) {
              // remove any attributes that aren't present in B
              nodeA.removeAttribute( attrs[_A][i].name );
            }
          }
          if ( attrs[_B][i] ) {
            nodeA.setAttribute( attrs[_B][i].name, attrs[_B][i].value );
          }
        }
        // copy styles
        for ( i = 0, l = Math.max( styles[_A].length, styles[_B].length ); i < l; i++ ) {
          if ( styles[_A][i] ) {
            if ( !( styleKeys[_B][i] in styleKeys[_A] ) ) {
              // remove any styles that aren't present in B
              nodeA.style[styleKeys[_B][i]] = null;
            }
          }
          if ( styles[_B][i] ) {
            nodeA.style[styleKeys[_B][i]] = styles[_B][styleKeys[_B][i]];
          }
        }
        // copy events
        /*for ( i = 0, l = Math.max( events[ _A ].length, events[ _B ].length ); i < l; i++ ) {
         [ 0, 1 ].forEach( function doANode( whichNode ) {
         var evt = events[ whichNode ][ i ],
         node = nodes[ whichNode ],
         handler;
         if ( evt ) {
         switch ( evt.type ) {
         case "on":
         handler = whichNode === _A ? "removeEventListener" : "addEventListener";
         nodeA[ handler ]( evt.evt, evt.handler, evt.capture );
         break;
         case "hammer":
         handler = whichNode === _A ? "off" : "on";
         console.log( handler, nodeA, evt.evt, evt.options.handler );
         evt.hammer( nodeA, evt.options.options )[ handler ]( evt.evt, evt.options.handler );
         break;
         default:
         }
         }
         } );
         }
         if ( elid[ _A ] ) {
         globalEvents[ elid[ _A ] ] = null;
         delete globalEvents[ elid[ _A ] ];
         }
         if ( elid[ _B ] ) {
         globalEvents[ elid[ _B ] ] = renderEvents[ elid[ _B ] ];
         renderEvents[ elid[ _B ] ] = null;
         delete renderEvents[ elid[ _B ] ];
         }*/
      }

      if ( !idx ) {
        idx = 0;
      }
      if ( n instanceof Array ) {
        for ( var i = 0, l = n.length; i < l; i++ ) {
          if ( n[i] !== undefined && n[i] !== null ) {
            renderTo( n[i], el, i );
          }
        }
      } else {
        if ( n === undefined || n === null || el === undefined || el === null ) {
          return;
        }
        var elid = [null, null];
        /*if ( n ) {
         elid[1] = n.getAttribute( "id" );
         }*/
        if ( el.hasChildNodes() && idx < el.childNodes.length ) {
          elid[0] = el.childNodes[idx].getAttribute( "id" );
          if ( h.useDomMerging ) {
            transform( el, el.childNodes[idx], n );
          } else {
            el.replaceChild( n, el.childNodes[idx] );
          }
        } else {
          el.appendChild( n );
        }
        /*
         if ( elid[ 0 ] ) {
         globalEvents[ elid[ 0 ] ] = null;
         delete globalEvents[ elid[ 0 ] ];
         }
         if ( elid[ 1 ] ) {
         globalEvents[ elid[ 1 ] ] = renderEvents[ elid[ 1 ] ];
         renderEvents[ elid[ 1 ] ] = null;
         delete renderEvents[ elid[ 1 ] ];
         }*/
      }
    }
  },
// create bindings for each HTML element (from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
  els = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi",
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
els.forEach( function ( el ) {
  h[el] = h.el.bind( h, el );
} );
// bind document fragment too
h.DF = h.el.bind( h, "@DF" );
h.dF = h.DF;
module.exports = h;
