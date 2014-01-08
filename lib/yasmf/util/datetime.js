/**
 *
 * Provides date/time convenience methods
 *
 * datetime.js
 * @module datetime.js
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
define (
   function () {
      return {
         /**
          * Returns the current time in the Unix time format
          * @return {UnixTime}
          */
         getUnixTime: function ()
         {
            return (new Date()).getTime();
         }
      };
   });
