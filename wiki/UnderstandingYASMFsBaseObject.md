# Understanding YASMF's `BaseObject`

Much of YASMF's user interface framework (and a few other objects) inherit from `BaseObject` (defined in `util/object.js`). Although not required, if you want to create your own classes that inherit from this base class, you should understand `BaseObject`.

A `BaseObject` is first, and foremost, a regular JavaScript object. That said, it doesn't rely on prototypal inheritance in order to acheive object inheritance -- rather, it relies on *classical inheritance*.

This choice is certainly polarizing in the JavaScript community, but even ES6 is slowly coming this way (with the addition of the `class` keyword). Although prototypal inheritance is extremely powerful and flexible, most OOP is taught from a classical perspective, and it only makes sense that JavaScript embrace the concept. In that regard, YASMF is early to the party.

That's not to say that YASMF's implementation is perfect or pretty. Short of modifying the language grammar itself (ala CoffeeScript), there's only so much one can do to simulate classical features in a language with no inherent support for them.

## Class Constructor

The class constructor is essentially the class definition written in a function. Typically it is written imperatively (whereas other JavaScript objects might be written in object notation). Furthermore, `self` is used universally instead of `this` when referring to the instantiated object.

A class constructor looks like this:

```
// typically this is wrapped in a define statement
var ANewClass = function () {
  var _className = "ANewClass";
  var self = new _y.BaseObject();
  self.subclass ( _className );
  // continue defining the class
  self._autoInit.apply( self, arguments );  
  return self;  
}
```

An object can be instantiated by doing this:

```
var aNewClassObject = (new ANewClass()).init();
```

## Explicit Initialization

All classes derived from `BaseObject` have an `init` method. Most will have a corresponding `initWithOptions` method as well. An object instance is **not** considered instantiated until `init` or `initWithOptions` is called.

## Automatic Implicit Initialization

If the class is constructed correctly (as above), the constructor will call `init` or `initWithOptions` automatically with any parameters passed to the constructor. For example:

```
var aNewClassObject = new ANewClass( aParameter );
```

In the above case, `init` will be called with `aParameter` if `aParameter` is not an object. If it is an object, `initWithOptions` will be called if it exists. If it doesn't exist, `init` will be called. If multiple parameters are passed, `init` is called regardless of the object types.

If *no* parameter is passed, automatic implicit initialization does *not* occur. In these cases, you can either pass a dummy object if the class supports `initWithOptions` (and can initialize with no options) or call `init` explicitly:

```
var aNewClassObject = new ANewClass ( {} );
var aNewClassObject = (new ANewClass ()).init();
```

## Explicit Destruction

Technically, any instantiated object is garbage collected just like any other JavaScript object. Normally this wouldn't be a problem, except `BaseObject`s need to do cleanup prior to their destruction (removing event listeners, etc.). As such, all classes deriving from `BaseObject` have a `destroy` method, and it should be called prior to marking the object as freeable:

```
aNewClassObject.destroy(); // clean up
aNewClassObject = null;    // release the object to GC
```

## Composition by Combination

Classes subclass other classes by combining the new methods and properties with all the properties and methods that belonged to the prior classes.

## Composition by Categories

Classes can also add other methods and properties by using *categories*. These are equivalent to their Objective-C namesakes -- they allow classes to be extended by other classes without requiring changes to the internal code of the class. This is quite powerful, and can be used to emulate multiple inheritance.

Categories are defined a little differently than classes:

```
function aNewCategory ( self ) {
  self.aNewMethod = function () { ... };
  self.aNewIVar = 3;
}
```

For a category to take effect, it must be registered. To register the category, one must know when the category constructor ought to run. It can be at any one of the following times:

- `ON_CREATE_CATEGORY`: the category constructor is run when the class constructor is called.
- `ON_INIT_CATEGORY`: the category constructor is run when the object instance is initialized (via `init`)
- `ON_DESTROY_CATEGORY`: the category constructor is run when the object instance is destroyed (via `destroy`)

To register a category, use this:

```
_y.BaseObject.registerCategoryConstructor ({
  class: `BaseObject`, // the object this category extends
  method: aNewCategory,
  priority: ON_CREATE_CATEGORY // default if not specified; otherwise ON_INIT_CATEGORY or ON_DESTROY_CATEGORY
})
```

From that point forward, any new `BaseObject` will incorporate the changes made in the category constructor into instantiated object. Unlike prototypal inheritance, this type of categorizing does not impact prior instantiated objects.

> It would not be uncommon for a "category" to be composed of two or three actual categories comprised of several (or all) of the category types.

## Instance Variables

Instance variables are created by assigning them to `self`:

```
self.anInstanceVariable = 0; // default value
```

If no appropriate default value exists, use `undefined`.

> Private instance variables should be marked with an `_`

## Properties

Properties can be constructed in one of two ways: using `Object.defineProperty` or by using `BaseObject`'s `defineProperty`. The first is the standard JavaScript way, and the second is essentially shorthand that incorporates a lot of magic. The upside to the first is that most JavaScript IDEs understand it, while most IDEs will fail to grasp the latter. On the other hand, the latter provides easier property creation, automatic getter/setter discovery, and more.

Using `Object.defineProperty`, the pattern is as follows:

```
self._backingVariable = undefined;
self.getBackingVariable = function () {
  return _backingVariable;
};
self.setBackingVariable = function ( theValue ) {
  self._backingVariable = theValue;
};
Object.defineProperty ( "backingVariable", { get: self.getBackingVariable,
                                             set: self.setBackingVariable,
                                             configurable: true } );
```

Using `BaseObject.defineProperty`, the pattern is as follows:

```
self.defineProperty ( "backingVariable" );
```

That's not *quite* true, but it implements everything exactly as the prior method does. Usually, though one needs a bit more control.

For example, to set a default:

```
self.defineProperty ( "backingVariable", { default: 100 } );
```

Or, perhaps something special needs to happen when the property is changed:

```
self.setBackingVariable = function ( theValue, oldValue )
{
  self._backingVariable = theValue;
  console.log ("Value changed from " + oldValue + " to " + theValue);
}
self.defineProperty ( "backingVariable", { default: 100 } );
```

In the above example, `setBackingVariable` is automatically discovered as the `setter` and is linked to the property. Discovering the `getter` works the same way (except with `get` instead of `set`). If, for some reason, you want to specify the `getter`/`setter` explicitly, you can do this:

```
self.defineProperty ( "backingVariable", { default: 100,
                                           set: self.setBackingVariable } );
```

If you are worried about the property discovering the wrong `getter` or `setter`, turn off automatic discovery:

```
self.defineProperty ( "backingVariable", { selfDiscover: false } );
```

By default, all properties created this way are read/write. If you want to control the access to the property, you can do that like this:

```
self.defineProperty ( "backingVariable", { read: true, write: false } );
```

## Notification Listeners

## Tags

## Observable Properties

## Methods
