(function(global, define) {
  var globalDefine = global.define;

/**
 * almond 0.2.0 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        aps = [].slice;

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (waiting.hasOwnProperty(name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!defined.hasOwnProperty(name) && !defining.hasOwnProperty(name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (defined.hasOwnProperty(depName) ||
                           waiting.hasOwnProperty(depName) ||
                           defining.hasOwnProperty(depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 15);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        waiting[name] = [name, deps, callback];
    };

    define.amd = {
        jQuery: true
    };
}());
define("../vendor/almond", function(){});

/*!
 * Globalize
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

(function( window, undefined ) {

var Globalize,
	// private variables
	regexHex,
	regexInfinity,
	regexParseFloat,
	regexTrim,
	// private JavaScript utility functions
	arrayIndexOf,
	endsWith,
	extend,
	isArray,
	isFunction,
	isObject,
	startsWith,
	trim,
	truncate,
	zeroPad,
	// private Globalization utility functions
	appendPreOrPostMatch,
	expandFormat,
	formatDate,
	formatNumber,
	getTokenRegExp,
	getEra,
	getEraYear,
	parseExact,
	parseNegativePattern;

// Global variable (Globalize) or CommonJS module (globalize)
Globalize = function( cultureSelector ) {
	return new Globalize.prototype.init( cultureSelector );
};

if ( typeof require !== "undefined" &&
	typeof exports !== "undefined" &&
	typeof module !== "undefined" ) {
	// Assume CommonJS
	module.exports = Globalize;
} else {
	// Export as global variable
	window.Globalize = Globalize;
}

Globalize.cultures = {};

Globalize.prototype = {
	constructor: Globalize,
	init: function( cultureSelector ) {
		this.cultures = Globalize.cultures;
		this.cultureSelector = cultureSelector;

		return this;
	}
};
Globalize.prototype.init.prototype = Globalize.prototype;

// 1. When defining a culture, all fields are required except the ones stated as optional.
// 2. Each culture should have a ".calendars" object with at least one calendar named "standard"
//    which serves as the default calendar in use by that culture.
// 3. Each culture should have a ".calendar" object which is the current calendar being used,
//    it may be dynamically changed at any time to one of the calendars in ".calendars".
Globalize.cultures[ "default" ] = {
	// A unique name for the culture in the form <language code>-<country/region code>
	name: "en",
	// the name of the culture in the english language
	englishName: "English",
	// the name of the culture in its own language
	nativeName: "English",
	// whether the culture uses right-to-left text
	isRTL: false,
	// "language" is used for so-called "specific" cultures.
	// For example, the culture "es-CL" means "Spanish, in Chili".
	// It represents the Spanish-speaking culture as it is in Chili,
	// which might have different formatting rules or even translations
	// than Spanish in Spain. A "neutral" culture is one that is not
	// specific to a region. For example, the culture "es" is the generic
	// Spanish culture, which may be a more generalized version of the language
	// that may or may not be what a specific culture expects.
	// For a specific culture like "es-CL", the "language" field refers to the
	// neutral, generic culture information for the language it is using.
	// This is not always a simple matter of the string before the dash.
	// For example, the "zh-Hans" culture is netural (Simplified Chinese).
	// And the "zh-SG" culture is Simplified Chinese in Singapore, whose lanugage
	// field is "zh-CHS", not "zh".
	// This field should be used to navigate from a specific culture to it's
	// more general, neutral culture. If a culture is already as general as it
	// can get, the language may refer to itself.
	language: "en",
	// numberFormat defines general number formatting rules, like the digits in
	// each grouping, the group separator, and how negative numbers are displayed.
	numberFormat: {
		// [negativePattern]
		// Note, numberFormat.pattern has no "positivePattern" unlike percent and currency,
		// but is still defined as an array for consistency with them.
		//   negativePattern: one of "(n)|-n|- n|n-|n -"
		pattern: [ "-n" ],
		// number of decimal places normally shown
		decimals: 2,
		// string that separates number groups, as in 1,000,000
		",": ",",
		// string that separates a number from the fractional portion, as in 1.99
		".": ".",
		// array of numbers indicating the size of each number group.
		// TODO: more detailed description and example
		groupSizes: [ 3 ],
		// symbol used for positive numbers
		"+": "+",
		// symbol used for negative numbers
		"-": "-",
		// symbol used for NaN (Not-A-Number)
		"NaN": "NaN",
		// symbol used for Negative Infinity
		negativeInfinity: "-Infinity",
		// symbol used for Positive Infinity
		positiveInfinity: "Infinity",
		percent: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "-n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %"
			//   positivePattern: one of "n %|n%|%n|% n"
			pattern: [ "-n %", "n %" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent a percentage
			symbol: "%"
		},
		currency: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
			//   positivePattern: one of "$n|n$|$ n|n $"
			pattern: [ "($n)", "$n" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent currency
			symbol: "$"
		}
	},
	// calendars defines all the possible calendars used by this culture.
	// There should be at least one defined with name "standard", and is the default
	// calendar used by the culture.
	// A calendar contains information about how dates are formatted, information about
	// the calendar's eras, a standard set of the date formats,
	// translations for day and month names, and if the calendar is not based on the Gregorian
	// calendar, conversion functions to and from the Gregorian calendar.
	calendars: {
		standard: {
			// name that identifies the type of calendar this is
			name: "Gregorian_USEnglish",
			// separator of parts of a date (e.g. "/" in 11/05/1955)
			"/": "/",
			// separator of parts of a time (e.g. ":" in 05:44 PM)
			":": ":",
			// the first day of the week (0 = Sunday, 1 = Monday, etc)
			firstDay: 0,
			days: {
				// full day names
				names: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
				// abbreviated day names
				namesAbbr: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
				// shortest day names
				namesShort: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
			},
			months: {
				// full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
				names: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
				// abbreviated month names
				namesAbbr: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ]
			},
			// AM and PM designators in one of these forms:
			// The usual view, and the upper and lower case versions
			//   [ standard, lowercase, uppercase ]
			// The culture does not use AM or PM (likely all standard date formats use 24 hour time)
			//   null
			AM: [ "AM", "am", "AM" ],
			PM: [ "PM", "pm", "PM" ],
			eras: [
				// eras in reverse chronological order.
				// name: the name of the era in this culture (e.g. A.D., C.E.)
				// start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
				// offset: offset in years from gregorian calendar
				{
					"name": "A.D.",
					"start": null,
					"offset": 0
				}
			],
			// when a two digit year is given, it will never be parsed as a four digit
			// year greater than this year (in the appropriate era for the culture)
			// Set it as a full year (e.g. 2029) or use an offset format starting from
			// the current year: "+19" would correspond to 2029 if the current year 2010.
			twoDigitYearMax: 2029,
			// set of predefined date and time patterns used by the culture
			// these represent the format someone in this culture would expect
			// to see given the portions of the date that are shown.
			patterns: {
				// short date pattern
				d: "M/d/yyyy",
				// long date pattern
				D: "dddd, MMMM dd, yyyy",
				// short time pattern
				t: "h:mm tt",
				// long time pattern
				T: "h:mm:ss tt",
				// long date, short time pattern
				f: "dddd, MMMM dd, yyyy h:mm tt",
				// long date, long time pattern
				F: "dddd, MMMM dd, yyyy h:mm:ss tt",
				// month/day pattern
				M: "MMMM dd",
				// month/year pattern
				Y: "yyyy MMMM",
				// S is a sortable format that does not vary by culture
				S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"
			}
			// optional fields for each calendar:
			/*
			monthsGenitive:
				Same as months but used when the day preceeds the month.
				Omit if the culture has no genitive distinction in month names.
				For an explaination of genitive months, see http://blogs.msdn.com/michkap/archive/2004/12/25/332259.aspx
			convert:
				Allows for the support of non-gregorian based calendars. This convert object is used to
				to convert a date to and from a gregorian calendar date to handle parsing and formatting.
				The two functions:
					fromGregorian( date )
						Given the date as a parameter, return an array with parts [ year, month, day ]
						corresponding to the non-gregorian based year, month, and day for the calendar.
					toGregorian( year, month, day )
						Given the non-gregorian year, month, and day, return a new Date() object
						set to the corresponding date in the gregorian calendar.
			*/
		}
	},
	// For localized strings
	messages: {}
};

Globalize.cultures[ "default" ].calendar = Globalize.cultures[ "default" ].calendars.standard;

Globalize.cultures.en = Globalize.cultures[ "default" ];

Globalize.cultureSelector = "en";

//
// private variables
//

regexHex = /^0x[a-f0-9]+$/i;
regexInfinity = /^[+\-]?infinity$/i;
regexParseFloat = /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/;
regexTrim = /^\s+|\s+$/g;

//
// private JavaScript utility functions
//

arrayIndexOf = function( array, item ) {
	if ( array.indexOf ) {
		return array.indexOf( item );
	}
	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[i] === item ) {
			return i;
		}
	}
	return -1;
};

endsWith = function( value, pattern ) {
	return value.substr( value.length - pattern.length ) === pattern;
};

extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction(target) ) {
		target = {};
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isObject(copy) || (copyIsArray = isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];

					} else {
						clone = src && isObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

isArray = Array.isArray || function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Array]";
};

isFunction = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Function]";
};

isObject = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Object]";
};

startsWith = function( value, pattern ) {
	return value.indexOf( pattern ) === 0;
};

trim = function( value ) {
	return ( value + "" ).replace( regexTrim, "" );
};

truncate = function( value ) {
	if ( isNaN( value ) ) {
		return NaN;
	}
	return Math[ value < 0 ? "ceil" : "floor" ]( value );
};

zeroPad = function( str, count, left ) {
	var l;
	for ( l = str.length; l < count; l += 1 ) {
		str = ( left ? ("0" + str) : (str + "0") );
	}
	return str;
};

//
// private Globalization utility functions
//

appendPreOrPostMatch = function( preMatch, strings ) {
	// appends pre- and post- token match strings while removing escaped characters.
	// Returns a single quote count which is used to determine if the token occurs
	// in a string literal.
	var quoteCount = 0,
		escaped = false;
	for ( var i = 0, il = preMatch.length; i < il; i++ ) {
		var c = preMatch.charAt( i );
		switch ( c ) {
			case "\'":
				if ( escaped ) {
					strings.push( "\'" );
				}
				else {
					quoteCount++;
				}
				escaped = false;
				break;
			case "\\":
				if ( escaped ) {
					strings.push( "\\" );
				}
				escaped = !escaped;
				break;
			default:
				strings.push( c );
				escaped = false;
				break;
		}
	}
	return quoteCount;
};

expandFormat = function( cal, format ) {
	// expands unspecified or single character date formats into the full pattern.
	format = format || "F";
	var pattern,
		patterns = cal.patterns,
		len = format.length;
	if ( len === 1 ) {
		pattern = patterns[ format ];
		if ( !pattern ) {
			throw "Invalid date format string \'" + format + "\'.";
		}
		format = pattern;
	}
	else if ( len === 2 && format.charAt(0) === "%" ) {
		// %X escape format -- intended as a custom format string that is only one character, not a built-in format.
		format = format.charAt( 1 );
	}
	return format;
};

formatDate = function( value, format, culture ) {
	var cal = culture.calendar,
		convert = cal.convert,
		ret;

	if ( !format || !format.length || format === "i" ) {
		if ( culture && culture.name.length ) {
			if ( convert ) {
				// non-gregorian calendar, so we cannot use built-in toLocaleString()
				ret = formatDate( value, cal.patterns.F, culture );
			}
			else {
				var eraDate = new Date( value.getTime() ),
					era = getEra( value, cal.eras );
				eraDate.setFullYear( getEraYear(value, cal, era) );
				ret = eraDate.toLocaleString();
			}
		}
		else {
			ret = value.toString();
		}
		return ret;
	}

	var eras = cal.eras,
		sortable = format === "s";
	format = expandFormat( cal, format );

	// Start with an empty string
	ret = [];
	var hour,
		zeros = [ "0", "00", "000" ],
		foundDay,
		checkedDay,
		dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
		quoteCount = 0,
		tokenRegExp = getTokenRegExp(),
		converted;

	function padZeros( num, c ) {
		var r, s = num + "";
		if ( c > 1 && s.length < c ) {
			r = ( zeros[c - 2] + s);
			return r.substr( r.length - c, c );
		}
		else {
			r = s;
		}
		return r;
	}

	function hasDay() {
		if ( foundDay || checkedDay ) {
			return foundDay;
		}
		foundDay = dayPartRegExp.test( format );
		checkedDay = true;
		return foundDay;
	}

	function getPart( date, part ) {
		if ( converted ) {
			return converted[ part ];
		}
		switch ( part ) {
			case 0:
				return date.getFullYear();
			case 1:
				return date.getMonth();
			case 2:
				return date.getDate();
			default:
				throw "Invalid part value " + part;
		}
	}

	if ( !sortable && convert ) {
		converted = convert.fromGregorian( value );
	}

	for ( ; ; ) {
		// Save the current index
		var index = tokenRegExp.lastIndex,
			// Look for the next pattern
			ar = tokenRegExp.exec( format );

		// Append the text before the pattern (or the end of the string if not found)
		var preMatch = format.slice( index, ar ? ar.index : format.length );
		quoteCount += appendPreOrPostMatch( preMatch, ret );

		if ( !ar ) {
			break;
		}

		// do not replace any matches that occur inside a string literal.
		if ( quoteCount % 2 ) {
			ret.push( ar[0] );
			continue;
		}

		var current = ar[ 0 ],
			clength = current.length;

		switch ( current ) {
			case "ddd":
				//Day of the week, as a three-letter abbreviation
			case "dddd":
				// Day of the week, using the full name
				var names = ( clength === 3 ) ? cal.days.namesAbbr : cal.days.names;
				ret.push( names[value.getDay()] );
				break;
			case "d":
				// Day of month, without leading zero for single-digit days
			case "dd":
				// Day of month, with leading zero for single-digit days
				foundDay = true;
				ret.push(
					padZeros( getPart(value, 2), clength )
				);
				break;
			case "MMM":
				// Month, as a three-letter abbreviation
			case "MMMM":
				// Month, using the full name
				var part = getPart( value, 1 );
				ret.push(
					( cal.monthsGenitive && hasDay() ) ?
					( cal.monthsGenitive[ clength === 3 ? "namesAbbr" : "names" ][ part ] ) :
					( cal.months[ clength === 3 ? "namesAbbr" : "names" ][ part ] )
				);
				break;
			case "M":
				// Month, as digits, with no leading zero for single-digit months
			case "MM":
				// Month, as digits, with leading zero for single-digit months
				ret.push(
					padZeros( getPart(value, 1) + 1, clength )
				);
				break;
			case "y":
				// Year, as two digits, but with no leading zero for years less than 10
			case "yy":
				// Year, as two digits, with leading zero for years less than 10
			case "yyyy":
				// Year represented by four full digits
				part = converted ? converted[ 0 ] : getEraYear( value, cal, getEra(value, eras), sortable );
				if ( clength < 4 ) {
					part = part % 100;
				}
				ret.push(
					padZeros( part, clength )
				);
				break;
			case "h":
				// Hours with no leading zero for single-digit hours, using 12-hour clock
			case "hh":
				// Hours with leading zero for single-digit hours, using 12-hour clock
				hour = value.getHours() % 12;
				if ( hour === 0 ) hour = 12;
				ret.push(
					padZeros( hour, clength )
				);
				break;
			case "H":
				// Hours with no leading zero for single-digit hours, using 24-hour clock
			case "HH":
				// Hours with leading zero for single-digit hours, using 24-hour clock
				ret.push(
					padZeros( value.getHours(), clength )
				);
				break;
			case "m":
				// Minutes with no leading zero for single-digit minutes
			case "mm":
				// Minutes with leading zero for single-digit minutes
				ret.push(
					padZeros( value.getMinutes(), clength )
				);
				break;
			case "s":
				// Seconds with no leading zero for single-digit seconds
			case "ss":
				// Seconds with leading zero for single-digit seconds
				ret.push(
					padZeros( value.getSeconds(), clength )
				);
				break;
			case "t":
				// One character am/pm indicator ("a" or "p")
			case "tt":
				// Multicharacter am/pm indicator
				part = value.getHours() < 12 ? ( cal.AM ? cal.AM[0] : " " ) : ( cal.PM ? cal.PM[0] : " " );
				ret.push( clength === 1 ? part.charAt(0) : part );
				break;
			case "f":
				// Deciseconds
			case "ff":
				// Centiseconds
			case "fff":
				// Milliseconds
				ret.push(
					padZeros( value.getMilliseconds(), 3 ).substr( 0, clength )
				);
				break;
			case "z":
				// Time zone offset, no leading zero
			case "zz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), clength )
				);
				break;
			case "zzz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), 2 ) +
					// Hard coded ":" separator, rather than using cal.TimeSeparator
					// Repeated here for consistency, plus ":" was already assumed in date parsing.
					":" + padZeros( Math.abs(value.getTimezoneOffset() % 60), 2 )
				);
				break;
			case "g":
			case "gg":
				if ( cal.eras ) {
					ret.push(
						cal.eras[ getEra(value, eras) ].name
					);
				}
				break;
		case "/":
			ret.push( cal["/"] );
			break;
		default:
			throw "Invalid date format pattern \'" + current + "\'.";
		}
	}
	return ret.join( "" );
};

// formatNumber
(function() {
	var expandNumber;

	expandNumber = function( number, precision, formatInfo ) {
		var groupSizes = formatInfo.groupSizes,
			curSize = groupSizes[ 0 ],
			curGroupIndex = 1,
			factor = Math.pow( 10, precision ),
			rounded = Math.round( number * factor ) / factor;

		if ( !isFinite(rounded) ) {
			rounded = number;
		}
		number = rounded;

		var numberString = number+"",
			right = "",
			split = numberString.split( /e/i ),
			exponent = split.length > 1 ? parseInt( split[1], 10 ) : 0;
		numberString = split[ 0 ];
		split = numberString.split( "." );
		numberString = split[ 0 ];
		right = split.length > 1 ? split[ 1 ] : "";

		var l;
		if ( exponent > 0 ) {
			right = zeroPad( right, exponent, false );
			numberString += right.slice( 0, exponent );
			right = right.substr( exponent );
		}
		else if ( exponent < 0 ) {
			exponent = -exponent;
			numberString = zeroPad( numberString, exponent + 1, true );
			right = numberString.slice( -exponent, numberString.length ) + right;
			numberString = numberString.slice( 0, -exponent );
		}

		if ( precision > 0 ) {
			right = formatInfo[ "." ] +
				( (right.length > precision) ? right.slice(0, precision) : zeroPad(right, precision) );
		}
		else {
			right = "";
		}

		var stringIndex = numberString.length - 1,
			sep = formatInfo[ "," ],
			ret = "";

		while ( stringIndex >= 0 ) {
			if ( curSize === 0 || curSize > stringIndex ) {
				return numberString.slice( 0, stringIndex + 1 ) + ( ret.length ? (sep + ret + right) : right );
			}
			ret = numberString.slice( stringIndex - curSize + 1, stringIndex + 1 ) + ( ret.length ? (sep + ret) : "" );

			stringIndex -= curSize;

			if ( curGroupIndex < groupSizes.length ) {
				curSize = groupSizes[ curGroupIndex ];
				curGroupIndex++;
			}
		}

		return numberString.slice( 0, stringIndex + 1 ) + sep + ret + right;
	};

	formatNumber = function( value, format, culture ) {
		if ( !isFinite(value) ) {
			if ( value === Infinity ) {
				return culture.numberFormat.positiveInfinity;
			}
			if ( value === -Infinity ) {
				return culture.numberFormat.negativeInfinity;
			}
			return culture.numberFormat[ "NaN" ];
		}
		if ( !format || format === "i" ) {
			return culture.name.length ? value.toLocaleString() : value.toString();
		}
		format = format || "D";

		var nf = culture.numberFormat,
			number = Math.abs( value ),
			precision = -1,
			pattern;
		if ( format.length > 1 ) precision = parseInt( format.slice(1), 10 );

		var current = format.charAt( 0 ).toUpperCase(),
			formatInfo;

		switch ( current ) {
			case "D":
				pattern = "n";
				number = truncate( number );
				if ( precision !== -1 ) {
					number = zeroPad( "" + number, precision, true );
				}
				if ( value < 0 ) number = "-" + number;
				break;
			case "N":
				formatInfo = nf;
				/* falls through */
			case "C":
				formatInfo = formatInfo || nf.currency;
				/* falls through */
			case "P":
				formatInfo = formatInfo || nf.percent;
				pattern = value < 0 ? formatInfo.pattern[ 0 ] : ( formatInfo.pattern[1] || "n" );
				if ( precision === -1 ) precision = formatInfo.decimals;
				number = expandNumber( number * (current === "P" ? 100 : 1), precision, formatInfo );
				break;
			default:
				throw "Bad number format specifier: " + current;
		}

		var patternParts = /n|\$|-|%/g,
			ret = "";
		for ( ; ; ) {
			var index = patternParts.lastIndex,
				ar = patternParts.exec( pattern );

			ret += pattern.slice( index, ar ? ar.index : pattern.length );

			if ( !ar ) {
				break;
			}

			switch ( ar[0] ) {
				case "n":
					ret += number;
					break;
				case "$":
					ret += nf.currency.symbol;
					break;
				case "-":
					// don't make 0 negative
					if ( /[1-9]/.test(number) ) {
						ret += nf[ "-" ];
					}
					break;
				case "%":
					ret += nf.percent.symbol;
					break;
			}
		}

		return ret;
	};

}());

getTokenRegExp = function() {
	// regular expression for matching date and time tokens in format strings.
	return (/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g);
};

getEra = function( date, eras ) {
	if ( !eras ) return 0;
	var start, ticks = date.getTime();
	for ( var i = 0, l = eras.length; i < l; i++ ) {
		start = eras[ i ].start;
		if ( start === null || ticks >= start ) {
			return i;
		}
	}
	return 0;
};

getEraYear = function( date, cal, era, sortable ) {
	var year = date.getFullYear();
	if ( !sortable && cal.eras ) {
		// convert normal gregorian year to era-shifted gregorian
		// year by subtracting the era offset
		year -= cal.eras[ era ].offset;
	}
	return year;
};

// parseExact
(function() {
	var expandYear,
		getDayIndex,
		getMonthIndex,
		getParseRegExp,
		outOfRange,
		toUpper,
		toUpperArray;

	expandYear = function( cal, year ) {
		// expands 2-digit year into 4 digits.
		if ( year < 100 ) {
			var now = new Date(),
				era = getEra( now ),
				curr = getEraYear( now, cal, era ),
				twoDigitYearMax = cal.twoDigitYearMax;
			twoDigitYearMax = typeof twoDigitYearMax === "string" ? new Date().getFullYear() % 100 + parseInt( twoDigitYearMax, 10 ) : twoDigitYearMax;
			year += curr - ( curr % 100 );
			if ( year > twoDigitYearMax ) {
				year -= 100;
			}
		}
		return year;
	};

	getDayIndex = function	( cal, value, abbr ) {
		var ret,
			days = cal.days,
			upperDays = cal._upperDays;
		if ( !upperDays ) {
			cal._upperDays = upperDays = [
				toUpperArray( days.names ),
				toUpperArray( days.namesAbbr ),
				toUpperArray( days.namesShort )
			];
		}
		value = toUpper( value );
		if ( abbr ) {
			ret = arrayIndexOf( upperDays[1], value );
			if ( ret === -1 ) {
				ret = arrayIndexOf( upperDays[2], value );
			}
		}
		else {
			ret = arrayIndexOf( upperDays[0], value );
		}
		return ret;
	};

	getMonthIndex = function( cal, value, abbr ) {
		var months = cal.months,
			monthsGen = cal.monthsGenitive || cal.months,
			upperMonths = cal._upperMonths,
			upperMonthsGen = cal._upperMonthsGen;
		if ( !upperMonths ) {
			cal._upperMonths = upperMonths = [
				toUpperArray( months.names ),
				toUpperArray( months.namesAbbr )
			];
			cal._upperMonthsGen = upperMonthsGen = [
				toUpperArray( monthsGen.names ),
				toUpperArray( monthsGen.namesAbbr )
			];
		}
		value = toUpper( value );
		var i = arrayIndexOf( abbr ? upperMonths[1] : upperMonths[0], value );
		if ( i < 0 ) {
			i = arrayIndexOf( abbr ? upperMonthsGen[1] : upperMonthsGen[0], value );
		}
		return i;
	};

	getParseRegExp = function( cal, format ) {
		// converts a format string into a regular expression with groups that
		// can be used to extract date fields from a date string.
		// check for a cached parse regex.
		var re = cal._parseRegExp;
		if ( !re ) {
			cal._parseRegExp = re = {};
		}
		else {
			var reFormat = re[ format ];
			if ( reFormat ) {
				return reFormat;
			}
		}

		// expand single digit formats, then escape regular expression characters.
		var expFormat = expandFormat( cal, format ).replace( /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1" ),
			regexp = [ "^" ],
			groups = [],
			index = 0,
			quoteCount = 0,
			tokenRegExp = getTokenRegExp(),
			match;

		// iterate through each date token found.
		while ( (match = tokenRegExp.exec(expFormat)) !== null ) {
			var preMatch = expFormat.slice( index, match.index );
			index = tokenRegExp.lastIndex;

			// don't replace any matches that occur inside a string literal.
			quoteCount += appendPreOrPostMatch( preMatch, regexp );
			if ( quoteCount % 2 ) {
				regexp.push( match[0] );
				continue;
			}

			// add a regex group for the token.
			var m = match[ 0 ],
				len = m.length,
				add;
			switch ( m ) {
				case "dddd": case "ddd":
				case "MMMM": case "MMM":
				case "gg": case "g":
					add = "(\\D+)";
					break;
				case "tt": case "t":
					add = "(\\D*)";
					break;
				case "yyyy":
				case "fff":
				case "ff":
				case "f":
					add = "(\\d{" + len + "})";
					break;
				case "dd": case "d":
				case "MM": case "M":
				case "yy": case "y":
				case "HH": case "H":
				case "hh": case "h":
				case "mm": case "m":
				case "ss": case "s":
					add = "(\\d\\d?)";
					break;
				case "zzz":
					add = "([+-]?\\d\\d?:\\d{2})";
					break;
				case "zz": case "z":
					add = "([+-]?\\d\\d?)";
					break;
				case "/":
					add = "(\\/)";
					break;
				default:
					throw "Invalid date format pattern \'" + m + "\'.";
			}
			if ( add ) {
				regexp.push( add );
			}
			groups.push( match[0] );
		}
		appendPreOrPostMatch( expFormat.slice(index), regexp );
		regexp.push( "$" );

		// allow whitespace to differ when matching formats.
		var regexpStr = regexp.join( "" ).replace( /\s+/g, "\\s+" ),
			parseRegExp = { "regExp": regexpStr, "groups": groups };

		// cache the regex for this format.
		return re[ format ] = parseRegExp;
	};

	outOfRange = function( value, low, high ) {
		return value < low || value > high;
	};

	toUpper = function( value ) {
		// "he-IL" has non-breaking space in weekday names.
		return value.split( "\u00A0" ).join( " " ).toUpperCase();
	};

	toUpperArray = function( arr ) {
		var results = [];
		for ( var i = 0, l = arr.length; i < l; i++ ) {
			results[ i ] = toUpper( arr[i] );
		}
		return results;
	};

	parseExact = function( value, format, culture ) {
		// try to parse the date string by matching against the format string
		// while using the specified culture for date field names.
		value = trim( value );
		var cal = culture.calendar,
			// convert date formats into regular expressions with groupings.
			// use the regexp to determine the input format and extract the date fields.
			parseInfo = getParseRegExp( cal, format ),
			match = new RegExp( parseInfo.regExp ).exec( value );
		if ( match === null ) {
			return null;
		}
		// found a date format that matches the input.
		var groups = parseInfo.groups,
			era = null, year = null, month = null, date = null, weekDay = null,
			hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
			pmHour = false;
		// iterate the format groups to extract and set the date fields.
		for ( var j = 0, jl = groups.length; j < jl; j++ ) {
			var matchGroup = match[ j + 1 ];
			if ( matchGroup ) {
				var current = groups[ j ],
					clength = current.length,
					matchInt = parseInt( matchGroup, 10 );
				switch ( current ) {
					case "dd": case "d":
						// Day of month.
						date = matchInt;
						// check that date is generally in valid range, also checking overflow below.
						if ( outOfRange(date, 1, 31) ) return null;
						break;
					case "MMM": case "MMMM":
						month = getMonthIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "M": case "MM":
						// Month.
						month = matchInt - 1;
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "y": case "yy":
					case "yyyy":
						year = clength < 4 ? expandYear( cal, matchInt ) : matchInt;
						if ( outOfRange(year, 0, 9999) ) return null;
						break;
					case "h": case "hh":
						// Hours (12-hour clock).
						hour = matchInt;
						if ( hour === 12 ) hour = 0;
						if ( outOfRange(hour, 0, 11) ) return null;
						break;
					case "H": case "HH":
						// Hours (24-hour clock).
						hour = matchInt;
						if ( outOfRange(hour, 0, 23) ) return null;
						break;
					case "m": case "mm":
						// Minutes.
						min = matchInt;
						if ( outOfRange(min, 0, 59) ) return null;
						break;
					case "s": case "ss":
						// Seconds.
						sec = matchInt;
						if ( outOfRange(sec, 0, 59) ) return null;
						break;
					case "tt": case "t":
						// AM/PM designator.
						// see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
						// the AM tokens. If not, fail the parse for this format.
						pmHour = cal.PM && ( matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2] );
						if (
							!pmHour && (
								!cal.AM || ( matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2] )
							)
						) return null;
						break;
					case "f":
						// Deciseconds.
					case "ff":
						// Centiseconds.
					case "fff":
						// Milliseconds.
						msec = matchInt * Math.pow( 10, 3 - clength );
						if ( outOfRange(msec, 0, 999) ) return null;
						break;
					case "ddd":
						// Day of week.
					case "dddd":
						// Day of week.
						weekDay = getDayIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(weekDay, 0, 6) ) return null;
						break;
					case "zzz":
						// Time zone offset in +/- hours:min.
						var offsets = matchGroup.split( /:/ );
						if ( offsets.length !== 2 ) return null;
						hourOffset = parseInt( offsets[0], 10 );
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						var minOffset = parseInt( offsets[1], 10 );
						if ( outOfRange(minOffset, 0, 59) ) return null;
						tzMinOffset = ( hourOffset * 60 ) + ( startsWith(matchGroup, "-") ? -minOffset : minOffset );
						break;
					case "z": case "zz":
						// Time zone offset in +/- hours.
						hourOffset = matchInt;
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						tzMinOffset = hourOffset * 60;
						break;
					case "g": case "gg":
						var eraName = matchGroup;
						if ( !eraName || !cal.eras ) return null;
						eraName = trim( eraName.toLowerCase() );
						for ( var i = 0, l = cal.eras.length; i < l; i++ ) {
							if ( eraName === cal.eras[i].name.toLowerCase() ) {
								era = i;
								break;
							}
						}
						// could not find an era with that name
						if ( era === null ) return null;
						break;
				}
			}
		}
		var result = new Date(), defaultYear, convert = cal.convert;
		defaultYear = convert ? convert.fromGregorian( result )[ 0 ] : result.getFullYear();
		if ( year === null ) {
			year = defaultYear;
		}
		else if ( cal.eras ) {
			// year must be shifted to normal gregorian year
			// but not if year was not specified, its already normal gregorian
			// per the main if clause above.
			year += cal.eras[( era || 0 )].offset;
		}
		// set default day and month to 1 and January, so if unspecified, these are the defaults
		// instead of the current day/month.
		if ( month === null ) {
			month = 0;
		}
		if ( date === null ) {
			date = 1;
		}
		// now have year, month, and date, but in the culture's calendar.
		// convert to gregorian if necessary
		if ( convert ) {
			result = convert.toGregorian( year, month, date );
			// conversion failed, must be an invalid match
			if ( result === null ) return null;
		}
		else {
			// have to set year, month and date together to avoid overflow based on current date.
			result.setFullYear( year, month, date );
			// check to see if date overflowed for specified month (only checked 1-31 above).
			if ( result.getDate() !== date ) return null;
			// invalid day of week.
			if ( weekDay !== null && result.getDay() !== weekDay ) {
				return null;
			}
		}
		// if pm designator token was found make sure the hours fit the 24-hour clock.
		if ( pmHour && hour < 12 ) {
			hour += 12;
		}
		result.setHours( hour, min, sec, msec );
		if ( tzMinOffset !== null ) {
			// adjust timezone to utc before applying local offset.
			var adjustedMin = result.getMinutes() - ( tzMinOffset + result.getTimezoneOffset() );
			// Safari limits hours and minutes to the range of -127 to 127.  We need to use setHours
			// to ensure both these fields will not exceed this range.	adjustedMin will range
			// somewhere between -1440 and 1500, so we only need to split this into hours.
			result.setHours( result.getHours() + parseInt(adjustedMin / 60, 10), adjustedMin % 60 );
		}
		return result;
	};
}());

parseNegativePattern = function( value, nf, negativePattern ) {
	var neg = nf[ "-" ],
		pos = nf[ "+" ],
		ret;
	switch ( negativePattern ) {
		case "n -":
			neg = " " + neg;
			pos = " " + pos;
			/* falls through */
		case "n-":
			if ( endsWith(value, neg) ) {
				ret = [ "-", value.substr(0, value.length - neg.length) ];
			}
			else if ( endsWith(value, pos) ) {
				ret = [ "+", value.substr(0, value.length - pos.length) ];
			}
			break;
		case "- n":
			neg += " ";
			pos += " ";
			/* falls through */
		case "-n":
			if ( startsWith(value, neg) ) {
				ret = [ "-", value.substr(neg.length) ];
			}
			else if ( startsWith(value, pos) ) {
				ret = [ "+", value.substr(pos.length) ];
			}
			break;
		case "(n)":
			if ( startsWith(value, "(") && endsWith(value, ")") ) {
				ret = [ "-", value.substr(1, value.length - 2) ];
			}
			break;
	}
	return ret || [ "", value ];
};

//
// public instance functions
//

Globalize.prototype.findClosestCulture = function( cultureSelector ) {
	return Globalize.findClosestCulture.call( this, cultureSelector );
};

Globalize.prototype.format = function( value, format, cultureSelector ) {
	return Globalize.format.call( this, value, format, cultureSelector );
};

Globalize.prototype.localize = function( key, cultureSelector ) {
	return Globalize.localize.call( this, key, cultureSelector );
};

Globalize.prototype.parseInt = function( value, radix, cultureSelector ) {
	return Globalize.parseInt.call( this, value, radix, cultureSelector );
};

Globalize.prototype.parseFloat = function( value, radix, cultureSelector ) {
	return Globalize.parseFloat.call( this, value, radix, cultureSelector );
};

Globalize.prototype.culture = function( cultureSelector ) {
	return Globalize.culture.call( this, cultureSelector );
};

//
// public singleton functions
//

Globalize.addCultureInfo = function( cultureName, baseCultureName, info ) {

	var base = {},
		isNew = false;

	if ( typeof cultureName !== "string" ) {
		// cultureName argument is optional string. If not specified, assume info is first
		// and only argument. Specified info deep-extends current culture.
		info = cultureName;
		cultureName = this.culture().name;
		base = this.cultures[ cultureName ];
	} else if ( typeof baseCultureName !== "string" ) {
		// baseCultureName argument is optional string. If not specified, assume info is second
		// argument. Specified info deep-extends specified culture.
		// If specified culture does not exist, create by deep-extending default
		info = baseCultureName;
		isNew = ( this.cultures[ cultureName ] == null );
		base = this.cultures[ cultureName ] || this.cultures[ "default" ];
	} else {
		// cultureName and baseCultureName specified. Assume a new culture is being created
		// by deep-extending an specified base culture
		isNew = true;
		base = this.cultures[ baseCultureName ];
	}

	this.cultures[ cultureName ] = extend(true, {},
		base,
		info
	);
	// Make the standard calendar the current culture if it's a new culture
	if ( isNew ) {
		this.cultures[ cultureName ].calendar = this.cultures[ cultureName ].calendars.standard;
	}
};

Globalize.findClosestCulture = function( name ) {
	var match;
	if ( !name ) {
		return this.findClosestCulture( this.cultureSelector ) || this.cultures[ "default" ];
	}
	if ( typeof name === "string" ) {
		name = name.split( "," );
	}
	if ( isArray(name) ) {
		var lang,
			cultures = this.cultures,
			list = name,
			i, l = list.length,
			prioritized = [];
		for ( i = 0; i < l; i++ ) {
			name = trim( list[i] );
			var pri, parts = name.split( ";" );
			lang = trim( parts[0] );
			if ( parts.length === 1 ) {
				pri = 1;
			}
			else {
				name = trim( parts[1] );
				if ( name.indexOf("q=") === 0 ) {
					name = name.substr( 2 );
					pri = parseFloat( name );
					pri = isNaN( pri ) ? 0 : pri;
				}
				else {
					pri = 1;
				}
			}
			prioritized.push({ lang: lang, pri: pri });
		}
		prioritized.sort(function( a, b ) {
			if ( a.pri < b.pri ) {
				return 1;
			} else if ( a.pri > b.pri ) {
				return -1;
			}
			return 0;
		});
		// exact match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			match = cultures[ lang ];
			if ( match ) {
				return match;
			}
		}

		// neutral language match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			do {
				var index = lang.lastIndexOf( "-" );
				if ( index === -1 ) {
					break;
				}
				// strip off the last part. e.g. en-US => en
				lang = lang.substr( 0, index );
				match = cultures[ lang ];
				if ( match ) {
					return match;
				}
			}
			while ( 1 );
		}

		// last resort: match first culture using that language
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			for ( var cultureKey in cultures ) {
				var culture = cultures[ cultureKey ];
				if ( culture.language == lang ) {
					return culture;
				}
			}
		}
	}
	else if ( typeof name === "object" ) {
		return name;
	}
	return match || null;
};

Globalize.format = function( value, format, cultureSelector ) {
	var culture = this.findClosestCulture( cultureSelector );
	if ( value instanceof Date ) {
		value = formatDate( value, format, culture );
	}
	else if ( typeof value === "number" ) {
		value = formatNumber( value, format, culture );
	}
	return value;
};

Globalize.localize = function( key, cultureSelector ) {
	return this.findClosestCulture( cultureSelector ).messages[ key ] ||
		this.cultures[ "default" ].messages[ key ];
};

Globalize.parseDate = function( value, formats, culture ) {
	culture = this.findClosestCulture( culture );

	var date, prop, patterns;
	if ( formats ) {
		if ( typeof formats === "string" ) {
			formats = [ formats ];
		}
		if ( formats.length ) {
			for ( var i = 0, l = formats.length; i < l; i++ ) {
				var format = formats[ i ];
				if ( format ) {
					date = parseExact( value, format, culture );
					if ( date ) {
						break;
					}
				}
			}
		}
	} else {
		patterns = culture.calendar.patterns;
		for ( prop in patterns ) {
			date = parseExact( value, patterns[prop], culture );
			if ( date ) {
				break;
			}
		}
	}

	return date || null;
};

Globalize.parseInt = function( value, radix, cultureSelector ) {
	return truncate( Globalize.parseFloat(value, radix, cultureSelector) );
};

Globalize.parseFloat = function( value, radix, cultureSelector ) {
	// radix argument is optional
	if ( typeof radix !== "number" ) {
		cultureSelector = radix;
		radix = 10;
	}

	var culture = this.findClosestCulture( cultureSelector );
	var ret = NaN,
		nf = culture.numberFormat;

	if ( value.indexOf(culture.numberFormat.currency.symbol) > -1 ) {
		// remove currency symbol
		value = value.replace( culture.numberFormat.currency.symbol, "" );
		// replace decimal seperator
		value = value.replace( culture.numberFormat.currency["."], culture.numberFormat["."] );
	}

	// trim leading and trailing whitespace
	value = trim( value );

	// allow infinity or hexidecimal
	if ( regexInfinity.test(value) ) {
		ret = parseFloat( value );
	}
	else if ( !radix && regexHex.test(value) ) {
		ret = parseInt( value, 16 );
	}
	else {

		// determine sign and number
		var signInfo = parseNegativePattern( value, nf, nf.pattern[0] ),
			sign = signInfo[ 0 ],
			num = signInfo[ 1 ];

		// #44 - try parsing as "(n)"
		if ( sign === "" && nf.pattern[0] !== "(n)" ) {
			signInfo = parseNegativePattern( value, nf, "(n)" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}

		// try parsing as "-n"
		if ( sign === "" && nf.pattern[0] !== "-n" ) {
			signInfo = parseNegativePattern( value, nf, "-n" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}

		sign = sign || "+";

		// determine exponent and number
		var exponent,
			intAndFraction,
			exponentPos = num.indexOf( "e" );
		if ( exponentPos < 0 ) exponentPos = num.indexOf( "E" );
		if ( exponentPos < 0 ) {
			intAndFraction = num;
			exponent = null;
		}
		else {
			intAndFraction = num.substr( 0, exponentPos );
			exponent = num.substr( exponentPos + 1 );
		}
		// determine decimal position
		var integer,
			fraction,
			decSep = nf[ "." ],
			decimalPos = intAndFraction.indexOf( decSep );
		if ( decimalPos < 0 ) {
			integer = intAndFraction;
			fraction = null;
		}
		else {
			integer = intAndFraction.substr( 0, decimalPos );
			fraction = intAndFraction.substr( decimalPos + decSep.length );
		}
		// handle groups (e.g. 1,000,000)
		var groupSep = nf[ "," ];
		integer = integer.split( groupSep ).join( "" );
		var altGroupSep = groupSep.replace( /\u00A0/g, " " );
		if ( groupSep !== altGroupSep ) {
			integer = integer.split( altGroupSep ).join( "" );
		}
		// build a natively parsable number string
		var p = sign + integer;
		if ( fraction !== null ) {
			p += "." + fraction;
		}
		if ( exponent !== null ) {
			// exponent itself may have a number patternd
			var expSignInfo = parseNegativePattern( exponent, nf, "-n" );
			p += "e" + ( expSignInfo[0] || "+" ) + expSignInfo[ 1 ];
		}
		if ( regexParseFloat.test(p) ) {
			ret = parseFloat( p );
		}
	}
	return ret;
};

Globalize.culture = function( cultureSelector ) {
	// setter
	if ( typeof cultureSelector !== "undefined" ) {
		this.cultureSelector = cultureSelector;
	}
	// getter
	return this.findClosestCulture( cultureSelector ) || this.cultures[ "default" ];
};

}( this ));

define("globalize", function(){});

/*
 * Globalize Culture en-US
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

if ( typeof require !== "undefined" &&
	typeof exports !== "undefined" &&
	typeof module !== "undefined" ) {
	// Assume CommonJS
	Globalize = require( "globalize" );
} else {
	// Global variable
	Globalize = window.Globalize;
}

Globalize.addCultureInfo( "en-US", "default", {
	name: "en-US",
	englishName: "English (United States)"
});

}( this ));

define("cultures/globalize.culture.en-US", function(){});

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
/*global define*/

define ( 'yasmf/util/core',["globalize", "cultures/globalize.culture.en-US"], function () {
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
          while (templateHTML.indexOf('%' + theVar.toUpperCase() + '%') > -1)
          {
            templateHTML = templateHTML.replace('%' + theVar.toUpperCase() + '%', replacements[theVar]);
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
            for (var locale in o[key])
            {
               self.addTranslation (locale, key, o[key][locale]);
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
   'yasmf/util/datetime',[],function () {
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

/**
 *
 * Provides convenience methods for parsing unix-style path names. If the 
 * path separator is changed from "/" to "\", it should parse Windows paths as well.
 * 
 * filename.js
 * @module filename.js
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
define(
  'yasmf/util/filename',[],function ()
  {

    var PKFILE = {
      /**
       * Version
       * @type {String}
       */
      version: "00.04.100", 
      /**
       * Specifies the characters that are not allowed in file names.
       * @type {Array}
       */
      invalidCharacters: "/,\\,:,|,<,>,*,?,;,%".split(","),
      /**
       * Indicates the character that separates a name from its extension, 
       * as in "filename.ext".
       * @type {String}
       */
      extensionSeparator: ".",
      /**
       * Indicates the character that separates path components.
       * @type {String}
       */
      pathSeparator: "/", 
      /**
       * Indicates the character used when replacing invalid characters
       * @type {String}
       */
      replacementCharacter: "-",
      /**
       * Converts a potentiall invalid filename to a valid filename by replacing
       * invalid characters (as specified in "invalidCharacters") with "replacementCharacter".
       *  
       * @param  {String} theFileName
       * @return {String} 
       */
      makeValid: function (theFileName)
      {
        var self=PKFILE;
        var theNewFileName = theFileName;
        for (var i = 0; i < self.invalidCharacters.length; i++)
        {
          var d = 0;
          while (theNewFileName.indexOf(self.invalidCharacters[i]) > -1 && (d++) < 50)
          {
            theNewFileName = theNewFileName.replace(self.invalidCharacters[i], self.replacementCharacter);
          }
        }
        return theNewFileName;
      },
      /**
       * Returns the name+extension portion of a full path.
       * 
       * @param  {String} theFileName
       * @return {String}
       */
      getFilePart: function (theFileName)
      {
        var self=PKFILE;
        var theSlashPosition = theFileName.lastIndexOf(self.pathSeparator);
        if (theSlashPosition < 0)
        {
          return theFileName;
        }
        return theFileName.substr(theSlashPosition + 1, theFileName.length - theSlashPosition);
      },
      /**
       * Returns the path portion of a full path.
       * @param  {String} theFileName
       * @return {String}
       */
      getPathPart: function (theFileName)
      {
        var self=PKFILE;
        var theSlashPosition = theFileName.lastIndexOf(self.pathSeparator);
        if (theSlashPosition < 0)
        {
          return "";
        }
        return theFileName.substr(0, theSlashPosition + 1);
      },
      /**
       * Returns the filename, minus the extension.
       * @param  {String} theFileName
       * @return {String}
       */
      getFileNamePart: function (theFileName)
      {
        var self=PKFILE;
        var theFileNameNoPath = self.getFilePart(theFileName);
        var theDotPosition = theFileNameNoPath.lastIndexOf(self.extensionSeparator);
        if (theDotPosition < 0)
        {
          return theFileNameNoPath;
        }
        return theFileNameNoPath.substr(0, theDotPosition);
      },
      /**
       * Returns the extension of a filename
       * @param  {String} theFileName
       * @return {String}
       */
      getFileExtensionPart: function (theFileName)
      {
        var self=PKFILE;
        var theFileNameNoPath = self.getFilePart(theFileName);
        var theDotPosition = theFileNameNoPath.lastIndexOf(self.extensionSeparator);
        if (theDotPosition < 0)
        {
          return "";
        }
        return theFileNameNoPath.substr(theDotPosition + 1, theFileNameNoPath.length - theDotPosition - 1);
      }
    };

    return PKFILE;
  }
);

/**
 *
 * Provides miscellaneous functions that had no other category.
 * 
 * misc.js
 * @module misc.js
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
   'yasmf/util/misc',[],function ()
   {
      return {
        /**
         * Retuns a pseudo-UUID. Not guaranteed to be unique (far from it, probably), but
         * close enough for most purposes. You should handle collisions gracefully on your
         * own, of course. see http://stackoverflow.com/a/8809472
         * @return {String}
         */
         makeFauxUUID: function ()
         {
          var d = new Date().getTime();
          var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = (d + Math.random()*16)%16 | 0;
              d = Math.floor(d/16);
              return (c=='x' ? r : (r&0x7|0x8)).toString(16);
          });
          return uuid;         
         }         
      };
   });

/**
 *
 * Provides basic device-handling convenience functions for determining if the device
 * is an iDevice or a Droid Device, and what the orientation is.
 * 
 * device.js
 * @module device.js
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
/*global define, device */
define
(
  'yasmf/util/device',[],function ()
  {
    /**
     *
     * PKDEVICE provides simple methods for getting device information, such as platform,
     * form factor, and orientation.
     *
     * @class PKDEVICE
     */
    var PKDEVICE = {

      /**
       * The version of the class with major, minor, and rev properties.
       *
       * @property version
       * @type Object
       *
       */
      version: "0.4.100",

      /**
       * Permits overriding the platform for testing. Leave set to `false` for
       * production applications.
       *
       * @property platformOverride
       * @type boolean
       * @default false
       */
      platformOverride: false,
      /**
       * Permits overriding the form factor. Usually used for testing.
       *
       * @property formFactorOverride
       * @type boolean
       * @default false
       */
      formFactorOverride: false,

      /**
       *
       * Returns the device platform, lowercased. If PKDEVICE.platformOverride is
       * other than "false", it is returned instead.
       *
       * See PhoneGap's documentation on the full range of platforms that can be
       * returned; without PG available, the method will attemt to determine the
       * platform from `navigator.platform` and the `userAgent`, but only supports
       * iOS and Android in that capacity.
       *
       * @method platform
       * @static
       * @returns {String} the device platform, lowercase.
       */
      platform: function()
      {
        if (PKDEVICE.platformOverride)
        {
          return PKDEVICE.platformOverride.toLowerCase();
        }
        if (typeof device == "undefined" || !device.platform)
        {
          // detect mobile devices first
          if (navigator.platform == "iPad" ||
              navigator.platform == "iPad Simulator" ||
              navigator.platform == "iPhone" || 
              navigator.platform == "iPhone Simulator" ||
              navigator.platform == "iPod" )
          {
            return "ios";
          }
          if ( navigator.userAgent.toLowerCase().indexOf ("android") > -1 )
          {
            return "android";
          }

          // no reason why we can't return other information
          if (navigator.platform.indexOf("Mac" > -1 ))
          {
            return "mac";
          }

          if (navigator.platform.indexOf("Win" > -1 ))
          {
            return "windows";
          }

          if (navigator.platform.indexOf("Linux" > -1 ))
          {
            return "linux";
          }

          return "unknown";
        }
        var thePlatform = device.platform.toLowerCase();
        //
        // turns out that for Cordova > 2.3, deivceplatform now returns iOS, so the
        // following is really not necessary on those versions. We leave it here
        // for those using Cordova <= 2.2.
        if (thePlatform.indexOf("ipad") > -1 || thePlatform.indexOf("iphone") > -1)
        {
          thePlatform = "ios";
        }
        return thePlatform;
      },

      /**
       *
       * Returns the device's form factor. Possible values are "tablet" and
       * "phone". If PKDEVICE.formFactorOverride is not false, it is returned
       * instead.
       *
       * @method formFactor
       * @static
       * @returns {String} `tablet` or `phone`, as appropriate
       */
      formFactor: function()
      {
        if (PKDEVICE.formFactorOverride)
        {
          return PKDEVICE.formFactorOverride.toLowerCase();
        }
        if (navigator.platform == "iPad")
        {
          return "tablet";
        }
        if ((navigator.platform == "iPhone") || (navigator.platform == "iPhone Simulator"))
        {
          return "phone";
        }

        // the following is hacky, and not guaranteed to work all the time,
        // especially as phones get bigger screens with higher DPI.

        if (Math.max(window.screen.width, window.screen.height) < 1024)
        {
          return "phone";
        }
        return "tablet";
      },
      /**
       *
       * Determines if the device is in Portrait orientation.
       *
       * @method isPortrait
       * @static
       * @returns {boolean} `true` if the device is in a Portrait orientation; `false` otherwise
       */
      isPortrait: function()
      {
        return window.orientation === 0 || window.orientation == 180 || window.location.href.indexOf("?portrait") > -1;
      },
      /**
       *
       * Determines if the device is in Landscape orientation.
       *
       * @method isLandscape
       * @static
       * @returns {boolean} `true` if the device is in a landscape orientation; `false` otherwise
       */
      isLandscape: function()
      {
        if (window.location.href.indexOf("?landscape") > -1)
        {
          return true;
        }
        return !PKDEVICE.isPortrait();
      },
      /**
       *
       * Determines if the device is a hiDPI device (aka retina)
       *
       * @method isRetina
       * @static
       * @returns {boolean} `true` if the device has a `window.devicePixelRatio` greater than `1.0`; `false` otherwise
       */
      isRetina: function()
      {
        return window.devicePixelRatio > 1;
      },

      /**
       * Returns `true` if the device is an iPad.
       *
       * @method iPad
       * @static
       * @returns {boolean}
       */
      iPad: function ()
      {
        return PKDEVICE.platform()==="ios" && PKDEVICE.formFactor()==="tablet";
      },

      /**
       * Returns `true` if the device is an iPhone (or iPod).
       *
       * @method iPhone
       * @static
       * @returns {boolean}
       */
      iPhone: function ()
      {
        return PKDEVICE.platform()==="ios" && PKDEVICE.formFactor()==="phone";
      },

      /**
       * Returns `true` if the device is an Android Phone.
       *
       * @method droidPhone
       * @static
       * @returns {boolean}
       */
      droidPhone: function ()
      {
        return PKDEVICE.platform()==="android" && PKDEVICE.formFactor()==="phone";
      },

      /**
       * Returns `true` if the device is an Android Tablet.
       *
       * @method droidTablet
       * @static
       * @returns {boolean}
       */
      droidTablet: function ()
      {
        return PKDEVICE.platform()==="android" && PKDEVICE.formFactor()==="tablet";
      }
    };
    return PKDEVICE;
  }
);

/**
 *
 * Base Object
 * 
 * object.js
 * @module object.js
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
/*global define, console*/

define (
   'yasmf/util/object',[],function () {

/**
 * PKObject is the base object for all complex objects used by YASMF;
 * simpler objects that are properties-only do not inherit from this
 * class.
 *
 * PKObject provides simple inheritance, but not by using the typical
 * prototypal method. Rather inheritance is formed by object composition
 * where all objects are instances of PKObject with methods overridden
 * instead. As such, you can *not* use any Javascript type checking to
 * differentiate PKObjects; you should instead use the `class`
 * property.
 *
 * PKObject provides inheritance to more than just a constructor: any
 * method can be overridden, but it is critical that the super-chain
 * be properly initialized. See the `super` and `overrideSuper`
 * methods for more information.
 *
 * @class PKObject
 */
var PKObject = function ()
{
    var self=this;

    /**
     *
     * We need a way to provide inheritance. Most methods only provide
     * inheritance across the constructor chain, not across any possible
     * method. But for our purposes, we need to be able to provide for
     * overriding any method (such as drawing, touch responses, etc.),
     * and so we implement inheritance in a different way.
     *
     * First, the _classHierarchy, a private property, provides the
     * inheritance tree. All objects inherit from "PKObject".
     *
     * @private
     * @property _classHierarchy
     * @type Array
     * @default ["PKObject"]
     */
    self._classHierarchy = ["BaseObject"];

    /**
     *
     * Objects are subclassed using this method. The newClass is the
     * unique class name of the object (and should match the class'
     * actual name.
     *
     * @method subclass
     * @param {String} newClass - the new unique class of the object
     */
    self.subclass = function ( newClass )
    {
        self._classHierarchy.push (newClass);
    };

    /**
     *
     * getClass returns the current class of the object. The
     * `class` property can be used as well. Note that there
     * is no `setter` for this property; an object's class
     * can *not* be changed.
     * 
     * @method getClass
     * @returns {String} the class of the instance
     *
     */
    self.getClass = function()
    {
        return self._classHierarchy[self._classHierarchy.length-1];
    };
    /**
     *
     * The class of the instance. **Read-only**
     * @property class
     * @type String
     * @readOnly
     */
    self.__defineGetter__("class", self.getClass);

    /**
     *
     * Returns the super class for the given class. If the
     * class is not supplied, the class is assumed to be the
     * object's own class.
     *
     * The property "superClass" uses this to return the
     * object's direct superclass, but getSuperClassOfClass
     * can be used to determine superclasses higher up
     * the hierarchy.
     *
     * @method getSuperClassOfClass
     * @param {String} [aClass=currentClass] the class for which you want the super class. If not specified,
     *                                        the instance's class is used.
     * @returns {String} the super-class of the specified class.
     */
    self.getSuperClassOfClass = function(aClass)
    {
        var theClass = aClass || self.class;
        var i = self._classHierarchy.indexOf ( theClass );
        if (i>-1)
        {
            return self._classHierarchy[i-1];
        }
        else
        {
            return null;
        }
    };
    /**
     *
     * The superclass of the instance.
     * @property superClass
     * @type String
     */
    self.__defineGetter__("superClass", self.getSuperClassOfClass);

    /**
     *
     * _super is an object that stores overridden functions by class and method
     * name. This is how we get the ability to arbitrarily override any method
     * already present in the superclass.
     *
     * @private
     * @property _super
     * @type Object
     */
    self._super = {};

    /**
     *
     * Must be called prior to defining the overridden function as this moves
     * the original function into the _super object. The functionName must
     * match the name of the method exactly, since there may be a long tree
     * of code that depends on it.
     *
     * @method overrideSuper
     * @param theClass {String} the class for which the function override is desired
     * @param theFunctionName {String} the name of the function to override
     * @param theActualFunction {Function} the actual function (or pointer to function)
     *
     */
    self.overrideSuper = function ( theClass, theFunctionName, theActualFunction )
    {
        var superClass = self.getSuperClassOfClass (theClass);
        if (!self._super[superClass])
        {
            self._super[superClass] = {};
        }
        self._super[superClass][theFunctionName] = theActualFunction;
    };

    /**
     *
     * Calls a super function with any number of arguments.
     *
     * @method super
     * @param theClass {String} the current class instance
     * @param theFunctionName {String} the name of the function to execute
     * @param [arg]* {Any} Any number of parameters to pass to the super method
     *
     */
    self.super = function ( theClass, theFunctionName, args )
    {
        var superClass = self.getSuperClassOfClass (theClass);
        if (self._super[superClass])
        {
            if (self._super[superClass][theFunctionName])
            {
                return self._super[superClass][theFunctionName].apply(self, args);
            }
            return null;
        }
        return null;
    };

    /**
     *
     * initializes the object
     * 
     * @method init
     *
     */
    self.init = function ()
    {
        // since we're at the top of the hierarchy, we don't do anything.
    };

    /*
     *
     * Objects have some properties that we want all objects to have...
     *
     */

    /**
     * Stores the values of all the tags associated with the instance.
     *
     * @private
     * @property _tag
     * @type Object
     */
    self._tags = {};
    /**
     *
     * Stores the *listeners* for all the tags associated with the instance.
     *
     * @private
     * @property _tagListeners
     * @type Object
     */
    self._tagListeners = {};
    /**
     *
     * Sets the value for a specific tag associated with the instance. If the
     * tag does not exist, it is created.
     * 
     * Any listeners attached to the tag via `addTagListenerForKey` will be
     * notified of the change. Listeners are passed three parameters:
     * `self` (the originating instance),
     * `theKey` (the tag being changed),
     * and `theValue` (the value of the tag); the tag is *already* changed
     *
     * @method setTagForKey
     * @param theKey {Any} the name of the tag; "__default" is special and
     *                     refers to the default tag visible via the `tag`
     *                     property.
     * @param theValue {Any} the value to assign to the tag.
     *
     */
    self.setTagForKey = function ( theKey, theValue )
    {
        self._tags[theKey] = theValue;
        if (self._tagListeners[theKey])
        {
            for (var i=0; i< self._tagListeners[theKey].length; i++)
            {
                self._tagListeners[theKey][i]( self, theKey, theValue );
            }
        }
    };
    /**
     *
     * Returns the value for a given key. If the key does not exist, the
     * result is undefined.
     *
     * @method getTagForKey
     * @param theKey {Any} the tag; "__default" is special and refers to
     *                     the default tag visible via the `tag` property.
     * @returns {Any} the value of the key
     *
     */
    self.getTagForKey = function ( theKey )
    {
        return self._tags[theKey];
    };
    /**
     *
     * Add a listener to a specific tag. The listener will receive three
     * paramters whenever the tag changes (though they are optional). The tag
     * itself doesn't need to exist in order to assign a listener to it.
     *
     * The first parameter is the object for which the tag has been changed.
     * The second parameter is the tag being changed, and the third parameter
     * is the value of the tag. **Note:** the value has already changed by
     * the time the listener is called.
     *
     * @method addListenerForKey
     * @param theKey {Any} The tag for which to add a listener; `__default`
     *                     is special and refers the default tag visible via
     *                     the `tag` property.
     * @param theListener {Function} the function (or reference) to call
     *                    when the value changes.
     */
    self.addTagListenerForKey = function ( theKey, theListener )
    {
        if (!self._tagListeners[theKey])
        {
            self._tagListeners[theKey] = [];
        }
        self._tagListeners[theKey].push (theListener);
    };
    /**
     *
     * Removes a listener from being notified when a tag changes.
     *
     * @method removeTagListenerForKey
     * @param theKey {Any} the tag from which to remove the listener; `__default`
     *                     is special and refers to the default tag visible via
     *                     the `tag` property.
     * @param theListener {Function} the function (or reference) to remove.
     *
     */
    self.removeTagListenerForKey = function ( theKey, theListener )
    {
        if (!self._tagListeners[theKey])
        {
            self._tagListeners[theKey] = [];
        }
        self._tagListeners[theKey].splice ( self._tagListeners[theKey].indexOf ( theListener ), 1 );
    };
    /**
     *
     * Sets the value for the simple tag (`__default`). Any listeners attached
     * to `__default` will be notified.
     *
     * @method setTag
     * @param theValue {Any} the value for the tag
     * 
     */
    self.setTag = function ( theValue )
    {
        self.setTagForKey ( "__default", theValue );
    };
    /**
     *
     * Returns the value for the given tag (`__default`). If the tag has never been
     * set, the result is undefined.
     *
     * @method getTag
     * @returns {Any} the value of the tag. 
     */
    self.getTag = function ()
    {
        return self.getTagForKey ( "__default" );
    };
    /**
     *
     * The default tag for the instance. Changing the tag itself (not any sub-properties of an object)
     * will notify any listeners attached to `__default`.
     *
     * @property tag
     * @type Any
     *
     */
    self.__defineSetter__("tag", self.setTag);
    self.__defineGetter__("tag", self.getTag);

    /**
     *
     * All objects subject notifications for events
     *
     */

    /**
     * Supports notification listeners.
     * @private
     * @property _notificationListeners
     * @type Object
     */
    self._notificationListeners = {};
    /**
     * Adds a listener for a notification. If a notification has not been
     * registered (via `registerNotification`), an error is logged on the console
     * and the function returns without attaching the listener. This means if
     * you aren't watching the console, the function fails nearly silently.
     *
     * > By default, no notifications are registered.
     *
     * @method addListenerForNotification
     * @param theNotification {String} the name of the notification
     * @param theListener {Function} the function (or reference) to be called when the
     *                                notification is triggered.
     *
     */
    self.addListenerForNotification = function ( theNotification, theListener )
    {
        if (!self._notificationListeners[theNotification])
        {
            console.log ( theNotification + " has not been registered.");
            return;
        }
        self._notificationListeners[ theNotification ].push (theListener);
    };
    /**
     * Removes a listener from a notification. If a notification has not been
     * registered (via `registerNotification`), an error is logged on the console
     * and the function returns without attaching the listener. This means if
     * you aren't watching the console, the function fails nearly silently.
     *
     * > By default, no notifications are registered.
     *
     * @method removeListenerForNotification
     * @param theNotification {String} the notification
     * @param theListener {Function} The function or reference to remove
     */

    self.removeListenerForNotification = function ( theNotification, theListener )
    {
        if (!self._notificationListeners[theNotification])
        {
            console.log ( theNotification + " has not been registered.");
            return;
        }
        self._notificationListeners[theNotification].splice 
        (
            self._notificationListeners[theNotification].indexOf ( theListener ), 1
        );
    }
    /**
     * Registers a notification so that listeners can then be attached. Notifications
     * should be registered as soon as possible, otherwise listeners may attempt to
     * attach to a notification that isn't registered.
     *
     * @method registerNotification
     * @param theNotification {String} the name of the notification.
     */
    self.registerNotification = function ( theNotification )
    {
        self._notificationListeners [ theNotification ] = [];
    }

    self._traceNotifications = false;
    /**
     * Notifies all listeners of a particular notification that the notification
     * has been triggered. If the notification hasn't been registered via 
     * `registerNotification`, an error is logged to the console, but the function
     * itself returns silently, so be sure to watch the console for errors.
     *
     * @method notify
     * @param theNotification {String} the notification to trigger
     */
    self.notify = function ( theNotification, args )
    {
        if (!self._notificationListeners[theNotification])
        {
            console.log ( theNotification + " has not been registered.");
            return;
        }
        if (self._traceNotifications)
        {
          console.log ( "Notifying " + self._notificationListeners[theNotification].length + " listeners for " + theNotification + " ( " + args + " ) " );
        }
        for (var i=0; i< self._notificationListeners[theNotification].length; i++ )
        {
            self._notificationListeners[theNotification][i]( self, theNotification, args );
        }        
    }

    self.destroy = function ()
    {
       // clear any listeners.
       self._notificationListeners = {};
       self._tagListeners = {};

       // ready to be destroyed
    }

    return self;

};

   return PKObject;

   });
!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a){window.Q=a("./q")},{"./q":2}],2:[function(a,b){function c(a){return function(){return Z.apply(a,arguments)}}function d(a){return a===Object(a)}function e(a){return"[object StopIteration]"===fb(a)||a instanceof V}function f(a,b){if(S&&b.stack&&"object"==typeof a&&null!==a&&a.stack&&-1===a.stack.indexOf(hb)){for(var c=[],d=b;d;d=d.source)d.stack&&c.unshift(d.stack);c.unshift(a.stack);var e=c.join("\n"+hb+"\n");a.stack=g(e)}}function g(a){for(var b=a.split("\n"),c=[],d=0;d<b.length;++d){var e=b[d];j(e)||h(e)||!e||c.push(e)}return c.join("\n")}function h(a){return-1!==a.indexOf("(module.js:")||-1!==a.indexOf("(node.js:")}function i(a){var b=/at .+ \((.+):(\d+):(?:\d+)\)$/.exec(a);if(b)return[b[1],Number(b[2])];var c=/at ([^ ]+):(\d+):(?:\d+)$/.exec(a);if(c)return[c[1],Number(c[2])];var d=/.*@(.+):(\d+)$/.exec(a);return d?[d[1],Number(d[2])]:void 0}function j(a){var b=i(a);if(!b)return!1;var c=b[0],d=b[1];return c===U&&d>=W&&mb>=d}function k(){if(S)try{throw new Error}catch(a){var b=a.stack.split("\n"),c=b[0].indexOf("@")>0?b[1]:b[2],d=i(c);if(!d)return;return U=d[0],d[1]}}function l(a,b,c){return function(){return"undefined"!=typeof console&&"function"==typeof console.warn&&console.warn(b+" is deprecated, use "+c+" instead.",new Error("").stack),a.apply(a,arguments)}}function m(a){return t(a)?a:u(a)?F(a):E(a)}function n(){function a(a){b=a,f.source=a,_(c,function(b,c){Y(function(){a.promiseDispatch.apply(a,c)})},void 0),c=void 0,d=void 0}var b,c=[],d=[],e=cb(n.prototype),f=cb(q.prototype);if(f.promiseDispatch=function(a,e,f){var g=$(arguments);c?(c.push(g),"when"===e&&f[1]&&d.push(f[1])):Y(function(){b.promiseDispatch.apply(b,g)})},f.valueOf=l(function(){if(c)return f;var a=s(b);return t(a)&&(b=a),a},"valueOf","inspect"),f.inspect=function(){return b?b.inspect():{state:"pending"}},m.longStackSupport&&S)try{throw new Error}catch(g){f.stack=g.stack.substring(g.stack.indexOf("\n")+1)}return e.promise=f,e.resolve=function(c){b||a(m(c))},e.fulfill=function(c){b||a(E(c))},e.reject=function(c){b||a(D(c))},e.notify=function(a){b||_(d,function(b,c){Y(function(){c(a)})},void 0)},e}function o(a){if("function"!=typeof a)throw new TypeError("resolver must be a function.");var b=n();try{a(b.resolve,b.reject,b.notify)}catch(c){b.reject(c)}return b.promise}function p(a){return o(function(b,c){for(var d=0,e=a.length;e>d;d++)m(a[d]).then(b,c)})}function q(a,b,c){void 0===b&&(b=function(a){return D(new Error("Promise does not support operation: "+a))}),void 0===c&&(c=function(){return{state:"unknown"}});var d=cb(q.prototype);if(d.promiseDispatch=function(c,e,f){var g;try{g=a[e]?a[e].apply(d,f):b.call(d,e,f)}catch(h){g=D(h)}c&&c(g)},d.inspect=c,c){var e=c();"rejected"===e.state&&(d.exception=e.reason),d.valueOf=l(function(){var a=c();return"pending"===a.state||"rejected"===a.state?d:a.value})}return d}function r(a,b,c,d){return m(a).then(b,c,d)}function s(a){if(t(a)){var b=a.inspect();if("fulfilled"===b.state)return b.value}return a}function t(a){return d(a)&&"function"==typeof a.promiseDispatch&&"function"==typeof a.inspect}function u(a){return d(a)&&"function"==typeof a.then}function v(a){return t(a)&&"pending"===a.inspect().state}function w(a){return!t(a)||"fulfilled"===a.inspect().state}function x(a){return t(a)&&"rejected"===a.inspect().state}function y(){kb||"undefined"==typeof window||window.Touch||!window.console||console.warn("[Q] Unhandled rejection reasons (should be empty):",ib),kb=!0}function z(){for(var a=0;a<ib.length;a++){var b=ib[a];b&&"undefined"!=typeof b.stack?console.warn("Unhandled rejection reason:",b.stack):console.warn("Unhandled rejection reason (no stack):",b)}}function A(){ib.length=0,jb.length=0,kb=!1,lb||(lb=!0,"undefined"!=typeof process&&process.on&&process.on("exit",z))}function B(a,b){lb&&(jb.push(a),ib.push(b),y())}function C(a){if(lb){var b=ab(jb,a);-1!==b&&(jb.splice(b,1),ib.splice(b,1))}}function D(a){var b=q({when:function(b){return b&&C(this),b?b(a):this}},function(){return this},function(){return{state:"rejected",reason:a}});return B(b,a),b}function E(a){return q({when:function(){return a},get:function(b){return a[b]},set:function(b,c){a[b]=c},"delete":function(b){delete a[b]},post:function(b,c){return null===b||void 0===b?a.apply(void 0,c):a[b].apply(a,c)},apply:function(b,c){return a.apply(b,c)},keys:function(){return eb(a)}},void 0,function(){return{state:"fulfilled",value:a}})}function F(a){var b=n();return Y(function(){try{a.then(b.resolve,b.reject,b.notify)}catch(c){b.reject(c)}}),b.promise}function G(a){return q({isDef:function(){}},function(b,c){return M(a,b,c)},function(){return m(a).inspect()})}function H(a,b,c){return m(a).spread(b,c)}function I(a){return function(){function b(a,b){var g;if(gb){try{g=c[a](b)}catch(h){return D(h)}return g.done?g.value:r(g.value,d,f)}try{g=c[a](b)}catch(h){return e(h)?h.value:D(h)}return r(g,d,f)}var c=a.apply(this,arguments),d=b.bind(b,"next"),f=b.bind(b,"throw");return d()}}function J(a){m.done(m.async(a)())}function K(a){throw new V(a)}function L(a){return function(){return H([this,N(arguments)],function(b,c){return a.apply(b,c)})}}function M(a,b,c){return m(a).dispatch(b,c)}function N(a){return r(a,function(a){var b=0,c=n();return _(a,function(d,e,f){var g;t(e)&&"fulfilled"===(g=e.inspect()).state?a[f]=g.value:(++b,r(e,function(d){a[f]=d,0===--b&&c.resolve(a)},c.reject,function(a){c.notify({index:f,value:a})}))},void 0),0===b&&c.resolve(a),c.promise})}function O(a){return r(a,function(a){return a=bb(a,m),r(N(bb(a,function(a){return r(a,X,X)})),function(){return a})})}function P(a){return r(a,function(a){return N(bb(a,function(b,c){return r(b,function(b){return a[c]={state:"fulfilled",value:b},a[c]},function(b){return a[c]={state:"rejected",reason:b},a[c]})})).thenResolve(a)})}function Q(a,b){return m(a).then(void 0,void 0,b)}function R(a,b){return m(a).nodeify(b)}var S=!1;try{throw new Error}catch(T){S=!!T.stack}var U,V,W=k(),X=function(){},Y=function(){function a(){for(;b.next;){b=b.next;var c=b.task;b.task=void 0;var e=b.domain;e&&(b.domain=void 0,e.enter());try{c()}catch(g){if(f)throw e&&e.exit(),setTimeout(a,0),e&&e.enter(),g;setTimeout(function(){throw g},0)}e&&e.exit()}d=!1}var b={task:void 0,next:null},c=b,d=!1,e=void 0,f=!1;if(Y=function(a){c=c.next={task:a,domain:f&&process.domain,next:null},d||(d=!0,e())},"undefined"!=typeof process&&process.nextTick)f=!0,e=function(){process.nextTick(a)};else if("function"==typeof setImmediate)e="undefined"!=typeof window?setImmediate.bind(window,a):function(){setImmediate(a)};else if("undefined"!=typeof MessageChannel){var g=new MessageChannel;g.port1.onmessage=a,e=function(){g.port2.postMessage(0)}}else e=function(){setTimeout(a,0)};return Y}(),Z=Function.call,$=c(Array.prototype.slice),_=c(Array.prototype.reduce||function(a,b){var c=0,d=this.length;if(1===arguments.length)for(;;){if(c in this){b=this[c++];break}if(++c>=d)throw new TypeError}for(;d>c;c++)c in this&&(b=a(b,this[c],c));return b}),ab=c(Array.prototype.indexOf||function(a){for(var b=0;b<this.length;b++)if(this[b]===a)return b;return-1}),bb=c(Array.prototype.map||function(a,b){var c=this,d=[];return _(c,function(e,f,g){d.push(a.call(b,f,g,c))},void 0),d}),cb=Object.create||function(a){function b(){}return b.prototype=a,new b},db=c(Object.prototype.hasOwnProperty),eb=Object.keys||function(a){var b=[];for(var c in a)db(a,c)&&b.push(c);return b},fb=c(Object.prototype.toString);V="undefined"!=typeof ReturnValue?ReturnValue:function(a){this.value=a};var gb;try{new Function("(function* (){ yield 1; })"),gb=!0}catch(T){gb=!1}var hb="From previous event:";m.resolve=m,m.nextTick=Y,m.longStackSupport=!1,m.defer=n,n.prototype.makeNodeResolver=function(){var a=this;return function(b,c){b?a.reject(b):arguments.length>2?a.resolve($(arguments,1)):a.resolve(c)}},m.promise=o,m.passByCopy=function(a){return a},q.prototype.passByCopy=function(){return this},m.join=function(a,b){return m(a).join(b)},q.prototype.join=function(a){return m([this,a]).spread(function(a,b){if(a===b)return a;throw new Error("Can't join: not the same: "+a+" "+b)})},m.race=p,q.prototype.race=function(){return this.then(m.race)},m.makePromise=q,q.prototype.toString=function(){return"[object Promise]"},q.prototype.then=function(a,b,c){function d(b){try{return"function"==typeof a?a(b):b}catch(c){return D(c)}}function e(a){if("function"==typeof b){f(a,h);try{return b(a)}catch(c){return D(c)}}return D(a)}function g(a){return"function"==typeof c?c(a):a}var h=this,i=n(),j=!1;return Y(function(){h.promiseDispatch(function(a){j||(j=!0,i.resolve(d(a)))},"when",[function(a){j||(j=!0,i.resolve(e(a)))}])}),h.promiseDispatch(void 0,"when",[void 0,function(a){var b,c=!1;try{b=g(a)}catch(d){if(c=!0,!m.onerror)throw d;m.onerror(d)}c||i.notify(b)}]),i.promise},m.when=r,q.prototype.thenResolve=function(a){return this.then(function(){return a})},m.thenResolve=function(a,b){return m(a).thenResolve(b)},q.prototype.thenReject=function(a){return this.then(function(){throw a})},m.thenReject=function(a,b){return m(a).thenReject(b)},m.nearer=s,m.isPromise=t,m.isPromiseAlike=u,m.isPending=v,q.prototype.isPending=function(){return"pending"===this.inspect().state},m.isFulfilled=w,q.prototype.isFulfilled=function(){return"fulfilled"===this.inspect().state},m.isRejected=x,q.prototype.isRejected=function(){return"rejected"===this.inspect().state};var ib=[],jb=[],kb=!1,lb=!0;m.resetUnhandledRejections=A,m.getUnhandledReasons=function(){return ib.slice()},m.stopUnhandledRejectionTracking=function(){A(),"undefined"!=typeof process&&process.on&&process.removeListener("exit",z),lb=!1},A(),m.reject=D,m.fulfill=E,m.master=G,m.spread=H,q.prototype.spread=function(a,b){return this.all().then(function(b){return a.apply(void 0,b)},b)},m.async=I,m.spawn=J,m["return"]=K,m.promised=L,m.dispatch=M,q.prototype.dispatch=function(a,b){var c=this,d=n();return Y(function(){c.promiseDispatch(d.resolve,a,b)}),d.promise},m.get=function(a,b){return m(a).dispatch("get",[b])},q.prototype.get=function(a){return this.dispatch("get",[a])},m.set=function(a,b,c){return m(a).dispatch("set",[b,c])},q.prototype.set=function(a,b){return this.dispatch("set",[a,b])},m.del=m["delete"]=function(a,b){return m(a).dispatch("delete",[b])},q.prototype.del=q.prototype["delete"]=function(a){return this.dispatch("delete",[a])},m.mapply=m.post=function(a,b,c){return m(a).dispatch("post",[b,c])},q.prototype.mapply=q.prototype.post=function(a,b){return this.dispatch("post",[a,b])},m.send=m.mcall=m.invoke=function(a,b){return m(a).dispatch("post",[b,$(arguments,2)])},q.prototype.send=q.prototype.mcall=q.prototype.invoke=function(a){return this.dispatch("post",[a,$(arguments,1)])},m.fapply=function(a,b){return m(a).dispatch("apply",[void 0,b])},q.prototype.fapply=function(a){return this.dispatch("apply",[void 0,a])},m["try"]=m.fcall=function(a){return m(a).dispatch("apply",[void 0,$(arguments,1)])},q.prototype.fcall=function(){return this.dispatch("apply",[void 0,$(arguments)])},m.fbind=function(a){var b=m(a),c=$(arguments,1);return function(){return b.dispatch("apply",[this,c.concat($(arguments))])}},q.prototype.fbind=function(){var a=this,b=$(arguments);return function(){return a.dispatch("apply",[this,b.concat($(arguments))])}},m.keys=function(a){return m(a).dispatch("keys",[])},q.prototype.keys=function(){return this.dispatch("keys",[])},m.all=N,q.prototype.all=function(){return N(this)},m.allResolved=l(O,"allResolved","allSettled"),q.prototype.allResolved=function(){return O(this)},m.allSettled=P,q.prototype.allSettled=function(){return P(this)},m.fail=m["catch"]=function(a,b){return m(a).then(void 0,b)},q.prototype.fail=q.prototype["catch"]=function(a){return this.then(void 0,a)},m.progress=Q,q.prototype.progress=function(a){return this.then(void 0,void 0,a)},m.fin=m["finally"]=function(a,b){return m(a)["finally"](b)},q.prototype.fin=q.prototype["finally"]=function(a){return a=m(a),this.then(function(b){return a.fcall().then(function(){return b})},function(b){return a.fcall().then(function(){throw b})})},m.done=function(a,b,c,d){return m(a).done(b,c,d)},q.prototype.done=function(a,b,c){var d=function(a){Y(function(){if(f(a,e),!m.onerror)throw a;m.onerror(a)})},e=a||b||c?this.then(a,b,c):this;"object"==typeof process&&process&&process.domain&&(d=process.domain.bind(d)),e.then(void 0,d)},m.timeout=function(a,b,c){return m(a).timeout(b,c)},q.prototype.timeout=function(a,b){var c=n(),d=setTimeout(function(){c.reject(new Error(b||"Timed out after "+a+" ms"))},a);return this.then(function(a){clearTimeout(d),c.resolve(a)},function(a){clearTimeout(d),c.reject(a)},c.notify),c.promise},m.delay=function(a,b){return void 0===b&&(b=a,a=void 0),m(a).delay(b)},q.prototype.delay=function(a){return this.then(function(b){var c=n();return setTimeout(function(){c.resolve(b)},a),c.promise})},m.nfapply=function(a,b){return m(a).nfapply(b)},q.prototype.nfapply=function(a){var b=n(),c=$(a);return c.push(b.makeNodeResolver()),this.fapply(c).fail(b.reject),b.promise},m.nfcall=function(a){var b=$(arguments,1);return m(a).nfapply(b)},q.prototype.nfcall=function(){var a=$(arguments),b=n();return a.push(b.makeNodeResolver()),this.fapply(a).fail(b.reject),b.promise},m.nfbind=m.denodeify=function(a){var b=$(arguments,1);return function(){var c=b.concat($(arguments)),d=n();return c.push(d.makeNodeResolver()),m(a).fapply(c).fail(d.reject),d.promise}},q.prototype.nfbind=q.prototype.denodeify=function(){var a=$(arguments);return a.unshift(this),m.denodeify.apply(void 0,a)},m.nbind=function(a,b){var c=$(arguments,2);return function(){function d(){return a.apply(b,arguments)}var e=c.concat($(arguments)),f=n();return e.push(f.makeNodeResolver()),m(d).fapply(e).fail(f.reject),f.promise}},q.prototype.nbind=function(){var a=$(arguments,0);return a.unshift(this),m.nbind.apply(void 0,a)},m.nmapply=m.npost=function(a,b,c){return m(a).npost(b,c)},q.prototype.nmapply=q.prototype.npost=function(a,b){var c=$(b||[]),d=n();return c.push(d.makeNodeResolver()),this.dispatch("post",[a,c]).fail(d.reject),d.promise},m.nsend=m.nmcall=m.ninvoke=function(a,b){var c=$(arguments,2),d=n();return c.push(d.makeNodeResolver()),m(a).dispatch("post",[b,c]).fail(d.reject),d.promise},q.prototype.nsend=q.prototype.nmcall=q.prototype.ninvoke=function(a){var b=$(arguments,1),c=n();return b.push(c.makeNodeResolver()),this.dispatch("post",[a,b]).fail(c.reject),c.promise},m.nodeify=R,q.prototype.nodeify=function(a){return a?(this.then(function(b){Y(function(){a(null,b)})},function(b){Y(function(){a(b)})}),void 0):this},b.exports=m;var mb=k()},{}]},{},[1]);
define("vendor/q", function(){});

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
/*global define, Q, localFileSystem*/

define ('yasmf/util/fileManager',["vendor/q"], function ( Q ) {

   function requestFileSystem ( fileSystemType, requestedDataSize)
   {
      var deferred = Q.defer();
      window.requestFileSystem ( fileSystemType, requestedDataSize,
         function success ( theFileSystem )
         {
            deferred.resolve ( theFileSystem );
         },
         function error ( anError )
         {
            deferred.reject ( anError );
         }
      );
      return deferred.promise;
   };

   var fileManager = {
      persistentFS: "",
      persistentFSName: "", 
      temporaryFS: "", 
      temporaryFSName: "",
      _initializeFileSystems: function ()
      {
         var self=fileManager;
         return requestFileSystem ( localFileSystem.PERSISTENT, 0 )
                .then ( function ( theFileSystem )
                        {
                           self.persistentFS = theFileSystem.root.fullPath;
                           self.persistentFSName = theFileSystem.root.name;
                           return requestFileSystem ( localFileSystem.TEMPORARY, 0 );
                        })
                .then ( function ( theFileSystem )
                        {
                           self.temporaryFS = theFileSystem.root.fullPath;
                           self.temporaryFSName = theFileSystem.root.name;
                        })
                .catch ( function ( anError )
                         {

                         })
                .done();
      }
   };

   return fileManager;
});
/**
 *
 * Core of YASMF-UI; defines the version and basic UI  convenience methods.
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
/*global define*/

define ( 'yasmf/ui/core',["yasmf/util/device", "yasmf/util/object"], function ( theDevice, BaseObject ) {
   var UI = {};

  /**
    * Version of the UI Namespace
    * @property version
    * @type Object
   **/
  UI.version = "0.4.100";

  /**
   *
   * Converts a color object to an rgba(r,g,b,a) string, suitable for applying to
   * any number of CSS styles. If the color's alpha is zero, the return value is
   * "transparent". If the color is null, the return value is "inherit".
   *
   * @method colorToRGBA
   * @static
   * @param {color} theColor - theColor to convert.
   * @returns {string} a CSS value suitable for color properties
   */
  UI.colorToRGBA = function ( theColor )
  {
    if (!theColor)
    {
      return "inherit";
    }
    if (theColor.alpha !== 0)
    {
      return "rgba(" + theColor.red + "," + theColor.green + "," + theColor.blue + "," + theColor.alpha + ")";
    }
    else
    {
      return "transparent";
    }
  }
  /**
   *
   * Creates a color object of the form `{red:r, green:g, blue:b, alpha:a}`.
   *
   * @method makeColor
   * @static
   * @param {Number} r - red component (0-255)
   * @param {Number} g - green component (0-255)
   * @param {Number} b - blue component (0-255)
   * @param {Number} a - alpha component (0.0-1.0)
   * @returns {color}
   *
   */
  UI.makeColor = function ( r, g, b, a )
  {
    return { red: r, green: g, blue: b, alpha: a };
  }
  /**
   *
   * Copies a color and returns it suitable for modification. You should copy
   * colors prior to modification, otherwise you risk modifying the original.
   *
   * @method copyColor
   * @static
   * @param {color} theColor - the color to be duplicated
   * @returns {color} a duplicate color ready to be modified
   *
   */
  UI.copyColor = function (theColor)
  {
    return UI.makeColor ( theColor.red, theColor.green, theColor.blue, theColor.alpha );
  }

  /**
   * UI.COLOR
   * @namespace UI
   * @class COLOR
   */
  UI.COLOR = UI.COLOR || {};
  /** @static 
   * @method blackColor 
   * @returns {color} a black color. 
   */
  UI.COLOR.blackColor     = function () { return UI.makeColor (   0,   0,   0, 1.0 ); }
  /** @static 
   * @method darkGrayColor 
   * @returns {color} a dark gray color. 
   */
  UI.COLOR.darkGrayColor  = function () { return UI.makeColor (  85,  85,  85, 1.0 ); }
  /** @static 
   * @method GrayColor 
   * @returns {color} a gray color. 
   */
  UI.COLOR.GrayColor      = function () { return UI.makeColor ( 127, 127, 127, 1.0 ); }
  /** @static 
   * @method lightGrayColor 
   * @returns {color} a light gray color. 
   */
  UI.COLOR.lightGrayColor = function () { return UI.makeColor ( 170, 170, 170, 1.0 ); }
  /** @static 
   * @method whiteColor 
   * @returns {color} a white color. 
   */
  UI.COLOR.whiteColor     = function () { return UI.makeColor ( 255, 255, 255, 1.0 ); }
  /** @static 
   * @method blueColor 
   * @returns {color} a blue color. 
   */
  UI.COLOR.blueColor      = function () { return UI.makeColor (   0,   0, 255, 1.0 ); }
  /** @static 
   * @method greenColor 
   * @returns {color} a green color. 
   */
  UI.COLOR.greenColor     = function () { return UI.makeColor (   0, 255,   0, 1.0 ); }
  /** @static 
   * @method redColor 
   * @returns {color} a red color. 
   */
  UI.COLOR.redColor       = function () { return UI.makeColor ( 255,   0,   0, 1.0 ); }
  /** @static 
   * @method cyanColor 
   * @returns {color} a cyan color. 
   */
  UI.COLOR.cyanColor      = function () { return UI.makeColor (   0, 255, 255, 1.0 ); }
  /** @static 
   * @method yellowColor 
   * @returns {color} a yellow color. 
   */
  UI.COLOR.yellowColor    = function () { return UI.makeColor ( 255, 255,   0, 1.0 ); }
  /** @static 
   * @method magentaColor 
   * @returns {color} a magenta color. 
   */
  UI.COLOR.magentaColor   = function () { return UI.makeColor ( 255,   0, 255, 1.0 ); }
  /** @static 
   * @method orangeColor 
   * @returns {color} a orange color. 
   */
  UI.COLOR.orangeColor    = function () { return UI.makeColor ( 255, 127,   0, 1.0 ); }
  /** @static 
   * @method purpleColor 
   * @returns {color} a purple color. 
   */
  UI.COLOR.purpleColor    = function () { return UI.makeColor ( 127,   0, 127, 1.0 ); }
  /** @static 
   * @method brownColor 
   * @returns {color} a brown color. 
   */
  UI.COLOR.brownColor     = function () { return UI.makeColor ( 153, 102,  51, 1.0 ); }
  /** @static 
   * @method lightTextColor 
   * @returns {color} a light text color suitable for display on dark backgrounds. 
   */
  UI.COLOR.lightTextColor = function () { return UI.makeColor ( 240, 240, 240, 1.0 ); }
  /** @static 
   * @method darkTextColor 
   * @returns {color} a dark text color suitable for display on light backgrounds. 
   */
  UI.COLOR.darkTextColor  = function () { return UI.makeColor (  15,  15,  15, 1.0 ); }
  /** @static 
   * @method clearColor 
   * @returns {color} a transparent color. 
   */
  UI.COLOR.clearColor     = function () { return UI.makeColor (   0,   0,   0, 0.0 ); }


  /**
   * Manages the root element
   *
   * @property _rootContainer
   * @private
   * @static
   * @type DOMElement
   */
  UI._rootContainer = null;
  /**
   * Creates the root element that contains the view hierarchy
   *
   * @method _createRootContainer
   * @static
   * @private
   */
  UI._createRootContainer = function ()
  {
    UI._rootElement = document.createElement ("div");
    UI._rootElement.className = "ui-container";
    UI._rootElement.id = "rootContainer";
    document.body.appendChild (UI._rootElement);
  }

  /**
   * Mangage the element used to prevent unwanted clicks
   *
   * @property _clickPreventionElement
   * @private
   * @static
   * @type DOMElement
   */
  UI._clickPreventionElement = null;
  /**
   * Creates the Click Prevention element
   *
   * @method _createClickPreventionElement
   * @private
   * @static
   */
  UI._createClickPreventionElement = function ()
  {
    UI._clickPreventionElement = document.createElement ("div");
    UI._clickPreventionElement.id = "uiPreventClicks";
    document.body.appendChild (UI._clickPreventionElement);
  }

  /**
   * Manages the root view (topmost)
   *
   * @property _rootView
   * @private
   * @static
   * @type View
   * @default null
   */
  UI._rootView = null;

  /**
   * Assigns a view to be the top view in the hierarchy
   *
   * @method setRootView
   * @static
   * @param theView {View}
   */
  UI.setRootView = function ( theView )
  {
    if (!UI._rootContainer)
    {
      UI._createRootContainer();
      UI._createClickPreventionElement();
    }
    if (UI._rootView)
    {
      UI.removeRootView();
    }
    UI._rootView = theView;
    UI._rootContainer.appendChild(theView.element);
  }

  /**
   * Removes a view from the root view
   *
   * @method removeRootView
   * @static
   */
  UI.removeRootView = function ()
  {
    UI._rootContainer.removeChild(UI._rootView.element);
    UI._rootView = null;
  }

  /**
   *
   * Returns the root view
   *
   * @method getRootView
   * @static
   * @returns {View}
   */
  UI.getRootView = function ()
  {
    return UI._rootView;
  }

  UI._BackButtonHandler = function ()
  {
    var self = new BaseObject();
    self.subclass ( "BackButtonHandler" );
    self.registerNotification ( "backButtonPressed" );
    self.handleBackButton = function ()
    {
      self.notify ("backButtonPressed");
    }
    document.addEventListener('backbutton', self.handleBackButton, false);
    return self;
  }
  /**
   *
   * Global Back Button Handler Object
   *
   * Register a listener for the backButtonPressed notification in order
   * to be notified when the back button is pressed.
   *
   * Applies only to a physical back button, not one on the screen.
   *
   * @property backButton
   * @static
   * @final
   * @type _BackButtonHandler
   */
  UI.backButton = new UI._BackButtonHandler();

  UI._OrientationHandler = function ()
  {
    var self = new BaseObject();
    self.subclass ( "OrientationHandler" );
    self.registerNotification ( "orientationChanged" );
    self.handleOrientationChange = function ()
    {
      var curDevice;
      var curOrientation;
      var curFormFactor;
      var curScale;
      var curConvenience;

      curDevice = theDevice.platform();
      if (curDevice == "ios")
      {
        if (navigator.userAgent.indexOf("OS 7") > -1 ) { curDevice += " ios7"; }
        if (navigator.userAgent.indexOf("OS 6") > -1 ) { curDevice += " ios6"; }
        if (navigator.userAgent.indexOf("OS 5") > -1 ) { curDevice += " ios5"; }
      }
      curFormFactor = theDevice.formFactor();
      curOrientation = theDevice.isPortrait() ? "portrait" : "landscape";
      curScale = theDevice.isRetina() ? "hiDPI" : "loDPI";
      curConvenience = "";
      if (theDevice.iPad()) { curConvenience = "ipad"; }
      if (theDevice.iPhone()) { curConvenience = "iphone"; }
      if (theDevice.droidTablet()) { curConvenience = "droid-tablet"; }
      if (theDevice.droidPhone()) { curConvenience = "droid-phone"; }

      document.body.setAttribute("class", curDevice + " " + curFormFactor + " " + curOrientation + " " + curScale + " " + curConvenience);

      self.notify ("orientationChanged");
    }
    window.addEventListener('orientationchange', self.handleOrientationChange, false);
    self.handleOrientationChange();
    return self;
  }
  /**
   *
   * Global Orientation Handler Object
   *
   * Register a listener for the orientationChanged notification in order
   * to be notified when the orientation changes.
   *
   * @property orientationHandler
   * @static
   * @final
   * @type _OrientationHandler
   */
  UI.orientationHandler = new UI._OrientationHandler();

  /** 
   * Create the root container and click prevention div
   */
  UI._createRootContainer();
  UI._createClickPreventionElement();


  return UI;
});

/**
 *
 * Basic cross-platform mobile Event Handling for YASMF
 * 
 * events.js
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

define ( 'yasmf/ui/event',["yasmf/util/device"], function ( theDevice )
{

   /**
    * Translates touch events to mouse events if the platform doesn't support
    * touch events. Leaves other events unaffected.
    *
    * @method _translateEvent
    * @static
    * @private
    * @param theEvent {String} the event name to translate
    */
   var _translateEvent = function ( theEvent )
   {
     var theTranslatedEvent = theEvent;
     if (!theTranslatedEvent) { return theTranslatedEvent; }
     var platform = theDevice.platform();
     var nonTouchPlatform = ( platform == "wince" || platform == "unknown" || platform == "mac" || platform =="windows" || platform == "linux" );
     if (nonTouchPlatform && theTranslatedEvent.toLowerCase().indexOf("touch") > -1 )
     {
       theTranslatedEvent = theTranslatedEvent.replace("touch", "mouse");
       theTranslatedEvent = theTranslatedEvent.replace("start", "down");
       theTranslatedEvent = theTranslatedEvent.replace("end", "up");
     }
     return theTranslatedEvent;  
   }

   var event = {};

   /**
    *
    * Creates an event object from a DOM event.
    *
    * The event returned contains all the touches from the DOM event in an array of {x,y} objects.
    * The event also contains the first touch as x,y properties and the average of all touches
    * as avgX,avgY. If no touches are in the event, these values will be -1.
    *
    * @method makeEvent
    * @static
    * @param {DOMEvent} e - the DOM event
    * @returns {event}
    *
    */
   event.convert = function ( that, e )
   {
     if (typeof e === "undefined")
     {
      e = window.event;
     }
     var newEvent = { _originalEvent: e, touches: [], x: -1, y: -1, avgX: -1, avgY: -1, element: e.target || e.srcElement, target: that };
     if (e.touches)
     {
       var avgXTotal = 0;
       var avgYTotal = 0;
       for (var i=0; i<e.touches.length; i++)
       {
         newEvent.touches.push ( { x: e.touches[i].clientX, y: e.touches[i].clientY } );
         avgXTotal += e.touches[i].clientX;
         avgYTotal += e.touches[i].clientY;
         if (i===0)
         {
           newEvent.x = e.touches[i].clientX;
           newEvent.y = e.touches[i].clientY;
         }
       }
       if (e.touches.length>0)
       {
         newEvent.avgX = avgXTotal / e.touches.length;
         newEvent.avgY = avgYTotal / e.touches.length;
       }
     }
     else
     {
       if (event.pageX)
       {
         newEvent.touches.push ( { x: e.pageX, y: e.pageY } );
         newEvent.x = e.pageX;
         newEvent.y = e.pageY;
         newEvent.avgX = e.pageX;
         newEvent.avgY = e.pageY;
       }
     }
     return newEvent;
   }

   /**
    *
    * Cancels an event that's been created using {@link UI.makeEvent}.
    *
    * @method cancelEvent
    * @static
    * @param {event} e - the event to cancel
    *
    */
   event.cancel = function ( e )
   {
     if (e._originalEvent.cancelBubble)
     {
       e._originalEvent.cancelBubble();
     }
     if (e._originalEvent.stopPropagation)
     {
       e._originalEvent.stopPropagation();
     }
     if (e._originalEvent.preventDefault)
     {
       e._originalEvent.preventDefault();
     } else
     {
       e._originalEvent.returnValue = false;
     }
   }


   /**
    * Adds a touch listener to theElement, converting touch events for WP7.
    *
    * @method addEventListener
    * @param theElement {DOMElement} the element to attach the event to
    * @param theEvent {String} the event to handle
    * @param theFunction {Function} the function to call when the event is fired
    *
    */
   event.addListener = function(theElement, theEvent, theFunction)
   {
     var theTranslatedEvent = _translateEvent(theEvent.toLowerCase());
     theElement.addEventListener(theTranslatedEvent, theFunction, false);
   }

   /**
    * Removes a touch listener added by addTouchListener
    *
    * @method removeEventListener
    * @param theElement {DOMElement} the element to remove an event from
    * @param theEvent {String} the event to remove
    * @param theFunction {Function} the function to remove
    *
    */
   event.removeListener = function(theElement, theEvent, theFunction)
   {
     var theTranslatedEvent = _translateEvent(theEvent.toLowerCase());
     theElement.removeEventListener(theTranslatedEvent, theFunction);
   }

   return event;
});

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

define ( 'yasmf/ui/viewContainer',["yasmf/util/object"], function ( BaseObject )
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

/**
 *
 * YASMF-UTIL (Yet Another Simple Mobile Framework Utilities) provides basic utilities
 * for working on mobile devices.
 *
 * It provides several convenience functions (such as _y.ge) and various modules (such
 * as device, filename, etc).
 * 
 * yasmf-util.js
 * @module yasmf-util.js
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

define ( 'yasmf',['require','yasmf/util/core','yasmf/util/datetime','yasmf/util/filename','yasmf/util/misc','yasmf/util/device','yasmf/util/object','yasmf/util/fileManager','yasmf/ui/core','yasmf/ui/event','yasmf/ui/viewContainer'],function ( require ) {
  var _y = require('yasmf/util/core');
  _y.datetime = require ('yasmf/util/datetime');
  _y.filename = require ('yasmf/util/filename');
  _y.misc = require ('yasmf/util/misc');
  _y.device = require ('yasmf/util/device');
  _y.BaseObject = require ('yasmf/util/object');
  _y.fileManager = require ('yasmf/util/fileManager');

  _y.UI = require ('yasmf/ui/core');
  _y.UI.event = require ('yasmf/ui/event');
  _y.UI.ViewContainer = require ('yasmf/ui/viewContainer');
  return _y;
});

  var library = require('yasmf');
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = library;
  } else if(globalDefine) {
    (function (define) {
      define(function () { return library; });
    }(globalDefine));
  } else {
    global['_y'] = library;
  }
}(this));
