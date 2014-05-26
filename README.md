# YASMF-Next v0.4 - Yet Another Simple Mobile Framework

YASMF-Next, or Yet Another Simple Mobile Framework (Next Generation), provides a simple, lightweight framework for mobile applications, especially those based on webkit browsers.

## Why?

Many of the frameworks that support mobile development are large and bulky, and several tend to have poor performance on actual mobile devices. The goal of YASMF-Next is to be simple and limited in scope while also being performant on mobile devices.

YASMF-Next (v0.4) is based loosely on [iSiteMobile](https://github.com/kerrishotts/iSite-Mobile) and the previous version (0.2 and 0.3) of [YASMF](https://github.com/photokandyStudios/YASMF) and also integrates some ideas from the native iOS SDK, especially with regards to view hierarchy and management. YASMF-Next provides a simple localization library, promise-wrapped file management, and simple view management, and base styles to simplify creating HTML-based widgets that look and feel reasonably native.

> **Note:** YASMF is at version 0.4 and is under heavy development. This means that the underlying API is subject to change at any time.

> YASMF v0.2 has been used in production-level applications, and so is useable in your own application development. v0.4 is more than a little fresh, so take care. There may just be dragons about.

## Platform Support

- **Android:** Android 4.x and higher. Works on phone and tablets. 
- **iOS:** iOS 6.x and higher. Works on iPhone, iPod, and iPad.
- **Webkit:** Chrome, Safari, etc.

> **Note:** Requires Cordova / PhoneGap 3.0 or higher, if the FileManager is used.

## Documentation

Documentation can be found in several locations:

- [Use of YASMF-Next](https://github.com/photokandyStudios/YASMF-Next/wiki)
- [YASMF Documentation](http://photokandystudios.github.io/YASMF-Next/index.html)
- Local YASMF Documentation is under `./doc` and `./wiki`

## Features

- AMD support
- Relatively small code base (easy to grok)
- Performant on mobile devices
- Uses CSS transforms and animations where possible
- Classical Object Inheritance
- KVO-like Observable Properties
- Notifications and Listeners
- Useful utility modules:
    - Date/Time handling
    - File name handling
    - HTML5 File API wrapped with Promises (using Q)
    - Device sniffing / handling
    - Localization (formatting by jQuery/Globalize)
    - DOM convenience methods
- User Interface:
    - Simple View Containers
    - Navigation Controllers (push/pop)
    - Split View Controllers (normal split, off-canvas view, split-overlay)
    - Navigation bars
    - Tool Bars
    - Tinted Glyphs
    - Bar Buttons
    - Scroll containers 

## Plans

- 0.5
    - Routers
    - MVC base objects
    - Object categories
    - Automatic Notification Handler Hookup
    - Additional widgets
- Future
    - Table view w/ infinite scrolling and cell re-use
    - Data binding
    - Enhanced templating

## History

- 0.4 (May 2014)
    - First release of YASMF-Next
- 0.3 (Nov 2013)
    - Refactor attempt of YASMF (aborted in order to start over from scratch)
- 0.2 (Aug 2012)
    - Initial release of YASMF
- 0.1 (May 2011)
    - iSiteMobile release

## License

YASMF-Util is MIT licensed.

Copyright (c) 2013, 2014 Kerri Shotts, photoKandy Studios LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.