/**
 *
 * View Containers are simple objects that provide very basic view management with
 * a thin layer over the corresponding DOM element.
 * 
 * viewContainer.js
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
/*global define*/

define ( ["yasmf/util/object"], function ( BaseObject )
{
   var _className = "ViewContainer";
   var ViewContainer = function ()
   {
      var self = new _y.BaseObject();
      self.subclass ( _className );

      self._element = null;
      self._elementClass = null;
      self._elementId = null;
      self._elementTag = "div";
      self._parentElement = null;

      self.getElement = function ()
      {
         if (self._element === null)
         {
            self._element = document.createElement ( self._elementTag );
            if ( self.elementClass !== null) { self._element.className = self.elementClass; };
            if ( self.elementId !== null) { self._element.id = self.elementId; }
         }
         return self._element;
      }
      self.setElement = function ( theElement )
      {
         self._element = theElement;
      }
      self.__defineGetter__ ( "element", self.getElement );
      self.__defineSetter__ ( "element", self.setElement );

      self.getElementClass = function ()
      {
         return self._elementClass;
      }
      self.setElementClass = function ( theClassName )
      {
         self._elementClass = theClassName;
         if (self._element !== null )
         {
            self._element.className = theClassName;
         }
      }
      self.__defineGetter__ ( "elementClass", self.getElementClass );
      self.__defineSetter__ ( "elementClass", self.setElementClass );

      self.getElementId = function ()
      {
         return self._elementId;
      }
      self.setElementId = function ( theElementId )
      {
         self._elementId = theElementId;
         if (self._element !== null )
         {
            self._element.id = theElementId;
         }
      }
      self.__defineGetter__ ( "elementId", self.getElementId );
      self.__defineSetter__ ( "elementId", self.setElementId );

      self.getElementTag = function ()
      {
         return self._elementTag;
      }
      self.setElementTag = function ( theTagName )
      {
         self._elementTag = theTagName;
      }
      self.__defineGetter__ ( "elementTag", self.getElementTag );
      self.__defineSetter__ ( "elementTag", self.setElementTag );

      self.getParentElement = function ()
      {
         return self._parentElement;
      }
      self.setParentElement = function ( theParentElement )
      {
         if (self._parentElement !== null &&
             self._element !== null)
         {
            // remove ourselves from the existing parent element first
            self._parentElement.removeChild ( self._element );
            self._parentElement = null;
         }
         self._parentElement = theParentElement;
         if ( self._element !== null)
         {
            self._parentElement.appendChild ( self._element );
         }
      }
      self.__defineGetter__ ( "parentElement", self.getParentElement );
      self.__defineSetter__ ( "parentElement", self.setParentElement );

      self.render = function ()
      {
         // right now, this doesn't do anything, but it's here for inheritance purposes
         return "Error: Abstract Method";
      }
      self.renderToElement = function ()
      {
         self.element.innerHTML = self.render();
      }

      self.overrideSuper ( self.class, "init", self.init );
      self.init = function ( theElementId, theElementTag, theElementClass, theParentElement )
      {
         self.super ( _className, "init" ); // super has no parameters

         // set our Id, Tag, and Class
         if ( typeof theElementId !== "undefined" ) { self.elementId = theElementId; }
         if ( typeof theElementTag !== "undefined" ) { self.elementTag = theElementTag; }
         if ( typeof theElementClass !== "undefined" ) { self.elementClass = theElementClass; }

         // render ourselves to the element (via render); this implicitly creates the element
         // with the above properties.
         self.renderToElement();

         // add ourselves to our parent.
         if ( typeof theParentElement !== "undefined" ) { self.parentElement = theParentElement; }
      }

      self.initWithOptions = function ( options )
      {
         var theElementId, theElementTag, theElementClass, theParentElement;
         if ( typeof options !== "undefined" )
         {
            if ( typeof options.id !== "undefined" ) { theElementId = options.id; }
            if ( typeof options.tag !== "undefined" ) { theElementTag = options.tag; }
            if ( typeof options.class !== "undefined") { theElementClass = options.class; }
            if ( typeof options.parent !== "undefined") { theParentElement = options.parent; }
         }
         self.init ( theElementId, theElementTag, theElementClass, theParentElement );
      }

      self.overrideSuper ( self.class, "destroy", self.destroy );
      self.destroy = function ()
      {
         // remove ourselves from the parent view, if attached
         if (self._parentElement !== null &&
             self._element !== null)
         {
            // remove ourselves from the existing parent element first
            self._parentElement.removeChild ( self._element );
            self._parentElement = null;
         }
         
         // and let our super know that it can clean p
         self.super ( _className, "destroy" );

      }
      return self;
   }

   return ViewContainer;

   
});