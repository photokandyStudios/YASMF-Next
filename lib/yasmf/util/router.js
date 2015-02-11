/**
 *
 * # simple routing
 *
 * @module router.js
 * @author Kerri Shotts
 * @version 0.1
 *
 * Simple example:
 * ```
 * var y = function (v,s,r,t,u) { console.log(v,s,r,t,u); }, router = _y.Router;
 * router.addURL ( "/", "Home" )
 * .addURL ( "/task", "Task List" )
 * .addURL ( "/task/:taskId", "Task View" )
 * .addHandler ( "/", y )
 * .addHandler ( "/task", y )
 * .addHandler ( "/task/:taskId", y )
 * .replace( "/", 1)
 * .listen();
 * ```
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
/*global module, Node, document, history, window, console*/
"use strict";
var routes = [];
/**
 * Parses a URL into its constituent parts. The return value
 * is an object containing the path, the query, and the hash components.
 * Each of those is also split up into parts -- path and hash separated
 * by slashes, while query is separated by ampersands. If hash is empty
 * this routine treates it as a "#/" unlese `parseHash` is `false`.
 * The `baseURL` is also removed from the path; if not specified it
 * defaults to `/`.
 *
 * @method parseURL
 * @param  {String}  url        url to parse
 * @param  {String}  baseURL    optional base url, defaults to "/"
 * @param  {Boolean} parseHash  optional, indicates if hash should be parsed with slashes
 * @return {*}                  component pieces
 */
function parseURL( url, baseURL, parseHash ) {
  if ( baseURL === undefined ) {
    baseURL = "/";
  }
  if ( parseHash === undefined ) {
    parseHash = true;
  }
  var a = document.createElement( "a" ),
    pathString,
    queryString,
    hashString,
    queryParts, pathParts, hashParts;
  // parse the url
  a.href = url;
  pathString = decodeURIComponent( a.pathname );
  queryString = decodeURIComponent( a.search );
  hashString = decodeURIComponent( a.hash );
  if ( hashString === "" && parseHash ) {
    hashString = "#/";
  }
  // remove the base url
  if ( pathString.substr( 0, baseURL.length ) === baseURL ) {
    pathString = pathString.substr( baseURL.length );
  }
  // don't need the ? or # on the query/hash string
  queryString = queryString.substr( 1 );
  hashString = hashString.substr( 1 );
  // split the query string
  queryParts = queryString.split( "&" );
  // and split the href
  pathParts = pathString.split( "/" );
  // split the hash, too
  if ( parseHash ) {
    hashParts = hashString.split( "/" );
  }
  return {
    path:       pathString,
    query:      queryString,
    hash:       hashString,
    queryParts: queryParts,
    pathParts:  pathParts,
    hashParts:  hashParts
  };
}
/**
 * Determines if a route matches, and if it does, copies
 * any variables out into `vars`. The routes must have been previously
 * parsed with parseURL.
 *
 * @method routeMatches
 * @param  {type} candidate candidate URL
 * @param  {type} template  template to check (variables of the form :someId)
 * @param  {type} vars      byref: this object will receive any variables
 * @return {*}              if matches, true.
 */
function routeMatches( candidate, template, vars ) {
  // routes must have the same number of parts
  if ( candidate.hashParts.length !== template.hashParts.length ) {
    return false;
  }
  var cp, tp;
  for ( var i = 0, l = candidate.hashParts.length; i < l; i++ ) {
    // each part needs to match exactly, OR it needs to start with a ":" to denote a variable
    cp = candidate.hashParts[i];
    tp = template.hashParts[i];
    if ( tp.substr( 0, 1 ) === ":" && tp.length > 1 ) {
      // variable
      vars[tp.substr( 1 )] = cp; // return the variable to the caller
    } else if ( cp !== tp ) {
      return false;
    }
  }
  return true;
}
var Router = {
  VERSION:        "0.1.100",
  baseURL:        "/", // not currently used
  /**
   * registers a URL and an associated title
   *
   * @method addURL
   * @param  {string} url   url to register
   * @param  {string} title associated title (not visible anywhere)
   * @return {*}            self
   */
  addURL:         function addURL( url, title ) {
    if ( routes[url] === undefined ) {
      routes[url] = [];
    }
    routes[url].title = title;
    return this;
  },
  /**
   * Adds a handler to the associated URL. Handlers
   * should be of the form `function( vars, state, url, title, parsedURL )`
   * where `vars` contains the variables in the URL, `state` contains any
   * state passed to history, `url` is the matched URL, `title` is the
   * title of the URL, and `parsedURL` contains the actual URL components.
   *
   * @method addHandler
   * @param  {string} url       url to register the handler for
   * @param  {function} handler handler to call
   * @return {*}                self
   */
  addHandler:     function addHandler( url, handler ) {
    routes[url].push( handler );
    return this;
  },
  /**
   * Removes a handler from the specified url
   *
   * @method removeHandler
   * @param  {string}   url     url
   * @param  {function} handler handler to remove
   * @return {*}        self
   */
  removeHandler:  function removeHandler( url, handler ) {
    var handlers = routes[url],
      handlerIndex;
    if ( handlers !== undefined ) {
      handlerIndex = handlers.indexOf( handler );
      if ( handlerIndex > -1 ) {
        handlers.splice( handlerIndex, 1 );
      }
    }
    return this;
  },
  /**
   * Parses a URL into its constituent parts. The return value
   * is an object containing the path, the query, and the hash components.
   * Each of those is also split up into parts -- path and hash separated
   * by slashes, while query is separated by ampersands. If hash is empty
   * this routine treates it as a "#/" unlese `parseHash` is `false`.
   * The `baseURL` is also removed from the path; if not specified it
   * defaults to `/`.
   *
   * @method parseURL
   * @param  {String}  url        url to parse
   * @param  {String}  baseURL    optional base url, defaults to "/"
   * @param  {Boolean} parseHash  optional, indicates if hash should be parsed with slashes
   * @return {*}                  component pieces
   */
  parseURL:       parseURL,
  /**
   * Given a url and state, process the url handlers that
   * are associated with the given url. Does not affect history in any way,
   * so can be used to call handler without actually navigating (most useful
   * during testing).
   *
   * @method processRoute
   * @param  {string} url   url to process
   * @param  {*} state      state to pass (can be anything or nothing)
   */
  processRoute:   function processRoute( url, state ) {
    if ( url === undefined ) {
      url = window.location.href;
    }
    var parsedURL = parseURL( url ),
      templateURL, handlers, vars, title;
    for ( url in routes ) {
      if ( routes.hasOwnProperty( url ) ) {
        templateURL = parseURL( "#" + url );
        handlers = routes[url];
        title = handlers.title;
        vars = {};
        if ( routeMatches( parsedURL, templateURL, vars ) ) {
          handlers.forEach( function ( handler ) {
            try {
              handler( vars, state, url, title, parsedURL );
            }
            catch ( err ) {
              console.log( "WARNING! Failed to process a route for", url );
            }
          } );
        }
      }
    }
  },
  /**
   * private route listener; calls `processRoute` with
   * the event state retrieved when the history is popped.
   * @method _routeListener
   * @private
   */
  _routeListener: function _routeListener( e ) {
    Router.processRoute( window.location.href, e.state );
  },
  /**
   * Check the current URL and call any associated handlers
   *
   * @method check
   * @return {*} self
   */
  check:          function check() {
    this.processRoute( window.location.href );
    return this;
  },
  /**
   * Indicates if the router is listening to history changes.
   * @property listening
   * @type boolean
   * @default false
   */
  listening:      false,
  /**
   * Start listening for history changes
   * @method listen
   */
  listen:         function listen() {
    if ( this.listening ) {
      return;
    }
    this.listening = true;
    window.addEventListener( "popstate", this._routeListener, false );
  },
  /**
   * Stop listening for history changes
   *
   * @method stopListening
   * @return {type}  description
   */
  stopListening:  function stopListening() {
    if ( !this.listening ) {
      return;
    }
    window.removeEventListener( "popstate", this._routeListener );
  },
  /**
   * Navigate to a url with a given state, calling handlers
   *
   * @method go
   * @param  {string} url   url
   * @param  {*} state      state to store for this URL, can be anything
   * @return {*}            self
   */
  go:             function go( url, state ) {
    history.pushState( state, null, "#" + encodeURIComponent( url ) );
    return this.check();
  },
  /**
   * Navigate to url with a given state, replacing history
   * and calling handlers. Should be called initially with "/" and
   * any initial state should you want to receive a state value when
   * navigating back from a future page
   *
   * @method replace
   * @param  {string} url   url
   * @param  {*} state      state to store for this URL, can be anything
   * @return {*}            self
   */
  replace:        function replace( url, state ) {
    history.replaceState( state, null, "#" + encodeURIComponent( url ) );
    return this.check();
  },
  /**
   * Navigates back in history
   *
   * @method back
   * @param  {number} n number of pages to navigate back, optional (1 is default)
   */
  back:           function back( n ) {
    history.back( n );
    if ( !this.listening ) {
      this.processRoute( window.location.href, history.state );
    }
  }
};
module.exports = Router;
