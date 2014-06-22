# Understanding YASMF's `BaseObject`

Much of YASMF's user interface framework (and a few other objects) inherit from `BaseObject` (defined in `util/object.js`). Although not required, if you want to create your own classes that inherit from this base class, you should understand `BaseObject`.

A `BaseObject` is first, and foremost, a regular JavaScript object. That said, it doesn't rely on prototypal inheritance in order to achieve object inheritance -- rather, it relies on *classical inheritance*.

This choice is certainly polarizing in the JavaScript community, but even ES6 is slowly coming this way (with the addition of the `class` keyword). Although prototypal inheritance is extremely powerful and flexible, most OOP is taught from a classical perspective, and it only makes sense that JavaScript embrace the concept. In that regard, YASMF is early to the party.

That's not to say that YASMF's implementation is perfect or pretty. Short of modifying the language grammar itself (*a la* CoffeeScript), there's only so much one can do to simulate classical features in a language with no inherent support for them.

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

Technically, any instantiated object is garbage collected just like any other JavaScript object. Normally this wouldn't be a problem, except `BaseObject`s need to do cleanup prior to their destruction (removing event listeners, etc.). As such, all classes deriving from `BaseObject` have a `destroy` method, and it should be called prior to marking the object as free-able:

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

> **Note:** Private instance variables should be marked with an `_`

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

Notifications are a powerful tool: they can be used to notify listeners about important changes in an object's state.

Before a notification may be used, it must be registered:

```
self.registerNotification ( "aNotification" );
```

A listener can be added by calling a specific object's `addListenerForNotification`:

```
self.addListenerForNotification ( "viewWasPopped", self.destroy );
APP.navigationController.addListenerForNotification ( "viewPushed", self.doSomethingInteresting );
```

A listener can be removed by calling `removeListenerForNotification`:

```
self.removeListenerForNotification ( "viewWasPopped", self.destroy );
```

Typically, listeners for an object's own notifications are added in `init` and are cleaned up in `destroy`. Listeners for other object's notifications are added/removed in many different ways (though often in response to `viewWasPushed` and `viewWasPopped`).

Notification listeners are, by default, wrapped in `setTimeout (..., 0)` calls. This means one must not assume the listeners are called in any particular order, nor are they called immediately upon the notification being fired. Should a notification need this treatment, however, one can register a notification as `synchronous`:

```
self.registerNotification ( "aSynchronousNotification", false);
```

To generate a notification, call `notify`:

```
self.notify ( "aNotification" );
```

To generate a notification that calls only the last listener, call `notifyMostRecent`:

```
self.notifyMostRecent ( "aNotification" );
```

Notification listeners always receive the the object making the notification and the notification itself as parameters:

```
self.someListener = function ( sender, notification ) { ... };
```

Parameters can be sent via notifications as well, and the listeners will receive them:

```
self.notify ( "aNotification", [1, 2, 3] );
self.aNotificationListener = function ( sender, notification, args ) {
  // args = [1, 2, 3]
}
```

## Tags

Tags are are, in essence, properties-lite. Any number of tags can be used, and they can all notify listeners of changes.

To set a value for a tag:

```
self.setTagForKey ( "wordType", 0); // assign 0 to wordType key
```

To retrieve the value:

```
var x = self.getTagForKey ( "wordType" );
```

To attach a listener that gets notified when the value of the tag is changed:

```
self.addTagListenerForKey ( "wordType", self.wordTypeChanged );
```

And one can remove a listener using `removeTagListenerForKey`:

```
self.removeTagListenerForKey ( "wordType", self.wordTypeChanged );
```

The listener is passed the object generating the notice, the key of the tag, and the value of the tag:

```
self.wordTypeChanged = function ( sender, key, value ) { ... }
```

## Observable Properties

Observable properties are akin to regular properties, but with a mix of notifications added for good measure. They are called *observable* in that they automatically send notifications when their value is changed, and automatically register those notifications so that other objects can listen for those changes. They also support additional features that standard properties don't automatically support.

An observable property is defined similar to a regular property:

```
self.defineObservableProperty ( "userName" );
```

The above creates a new property called `userName`, registers a `userNameChanged` notification, and will send a `userNameChanged` notice whenever the value changes.

In order to control this behavior, you can pass additional options:

```
self.defineObservableProperty ( "userName", options );
```

The options are as follows:

`observable`
: Automatically registers a notification if `true`; `true` by default. If `false`, changes to the value will not fire a notification.

`notification`
: The name of the notification to register and send when the value changes. By default it is the property name followed by `Changed`.

`default`
: The default value; defaults to `undefined`

`read`/`write`
: Indicates if the value can be read (`get`) or `set`. Defaults to `true` for both, thus read/write.

`get`
: Specifies the `get` method. Default is `null`.

`set`
: Specifies the `set` method. Default is `null`.

`validate`
: Specifies the method that validates incoming changes. Default is `null`.

`selfDiscover`
: If `true`, the `get`, `set`, and `validate` methods are self-discovered assuming the follow the naming convention of `getObservable<PropertyName>`, `setObservable<PropertyName>`, and `validateObservable<PropertyName>`. Default is `true`.

`notifyAlways`
: If `true`, a notification is sent whenever the `set`ter is called, even if the value doesn't change. Default is `false`.

If no `get` or `set` method is provided or discovered, standard methods are provided. If `validate` is not provided or discovered, no validation is performed.

The `validation` method determines if the incoming data is valid -- no more. It should not attempt to assign the data to the property or do anything else with the property:

```
self.validateObservableUserName = function ( value ) {
  return (value !== "Sparky"); // We don't like Sparky, so it can't be assigned.
}
```

> **Note:** If a validation fails, it does so silently.

The `get` method is written a little different than most `get`ters -- it is passed the value of the property:

```
self.getObservableUserName = function ( value ) {
  return value;
}
```

The `set` method is also written differently:

```
self.setObservableUserName = function ( value, oldValue ) {
  return value; // returning the value will cause the property to be set to this value.
}
```

Finally, any notifications that are sent when the value is changed also pass along the new and old values:

```
self.anObservablePropertyListener = function ( sender, notification, args ) {
  // args: { new: value, old: oldValue }
}
```

## Methods

Methods can be defined as usual:

```
self.aMethod = function ( [args] ) { ... };
```

However, should you need to override a method provided in a parent class, you should call `overrideSuper` or `override`. Which you call is up to you.

```
self.overrideSuper ( self.class, "init", self.init);
self.init = function ( args ) {
  self.super(_className, "init", [args]); // arguments should work instead of [args] if all arguments should be passed
  // carry on
}
```

OR

```
self.override ( function init ( args ) {
  self.super(_className, "init", [args]); // arguments should work instead of [args] if all arguments should be passed
  // carry on
});
```

In both the above examples, we call `super` in order to call the overridden method. If your method needs to add to the behavior of the object, you should call `super` -- but if the method should completely replace the behavior of the object, there is no need.

> **Note:** `super` only works for methods that have been overridden with `overrideSuper` or `override`.

The first parameter to `super` must always be the class name -- but should *never* be `self.class` -- this will break the `super` chain in children descendants. The second parameter must be the name of the overridden function. The final optional parameter is an array of arguments to pass to the overridden method, and is typically an array. Alternatively, the function's `arguments` list can be passed along instead.

## Property Overrides

It is possible to override property `get`ters and `set`ters, but it is important to recognize that overriding the `get` or `set` method will not update the property.

If calling `Object.defineProperty`, the desired `get` and/or `set` method needs to be overridden, and then `Object.defineProperty` called again with the same `get` and `set` methods. This only works if the property is set to be configurable.

If using `BaseObject.defineProperty` or `defineObservableProperty`, you should override the `get` or `set` method (or `validate` method) and then redefine the property again. These properties are always configurable by child classes.
