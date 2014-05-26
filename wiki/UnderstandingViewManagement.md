# Understanding View Management

Views are central to YASMF's user-interface philosophy. It is therefore critical to understand the view lifecycle and how to manage them properly.

Typically one will create a new view by inheriting from `UI.ViewContainer`. For example, the shell of a new view would typically look like this:

	define( [ "yasmf", "text!html/viewTemplate.html!strip", "hammer" ], 
	function( _y, viewHTML, Hammer ) {
	  var _className = "AView";
	  var AView = function() {
	    var self = new _y.UI.ViewContainer();
	    self.subclass( _className ); 
	    // override render (required)
	    // override renderToElement, if necessary
	    // override init, if necessary
	    // override initWithOptions, if necessary
	    self.goBack = function() {
	      self.navigationController.popView()
	    };
	    self.captureBackButton = function() {
	      _y.UI.backButton.addListenerForNotification( "backButtonPressed"), self.goBack ); 
	    };
	    self.releaseBackButton = function() {
	      _y.UI.backButton.removeListenerForNotification( "backButtonPressed", self.goBack );
	    };
	    // automatically call init/initWithOptions if
	    // the constructor was passed parameters
	    self._autoInit.apply( self, arguments );
	    return self;
	  });
	  return AView;
	});

## View Notifications (from Controllers)

The `NavigationController` sends notifications to the view (and to anyone else who is listening) when views are pushed and popped (or when the `rootView` is changed). Any other controller will do the same.

`viewWasPushed`
: Fired when `pushView` is called (or when the view is assigned to the Navigation Controller's `rootView`.) No change has occurred visually, but it does mean that the view can now access properties that are specific to the controller (such as `navigationController`).

`viewWillAppear`
: Fired when the view is about to appear on-screen. Try to avoid any significant DOM changes during this event as any changes to the DOM might cause hiccups in the animation.

`viewDidAppear`
: Fired when the view is completely on-screen and any animation (if present) is complete. 

`viewWillDisappear`
: Fired when the view is about to be pushed off-screen. This is called regardless of whether or not the view is being pushed off-screen or being popped off-screen, so do not rely on this event to perform any destructive actions with regard to the view (such as calling `destroy`). As with `viewWillAppear`, avoid doing any major changes to the DOM during this event.

`viewDidDisappear`
: Fired when the view is completely off-screen and any animation (if present) is complete. 

`viewWasPopped`
: Fired when the view is popped from the navigation controller's stack. This is a perfect time to release any memory occupied by the view by calling `destroy` as well as releasing any event handlers.

In order to attach handlers to these notifications, one typically uses `addListenerForNotification` in `init`, like so:

	self.addListenerForNotification ( "viewWasPushed", self.loadViewData );
	self.addListenerForNotification ( "viewWasPopped", self.destroy );
	
If listeners are registered in `init`, they are typically deregistered in `destroy`:

	self.removeListenerForNotification ( "viewWasPushed", self.loadViewData );
	self.removeListenerForNotification ( "viewWasPopped", self.destroy );

## View Lifecycle

The view lifecycle is pretty simple:

- `init` (or `initWithOptions`)
    - called by the instantiating code to attach the view to the parent element and perform any initialization code.
- `renderToElement`
    - called during the initialization process to render the view template, look up any DOM elements, and attach any DOM element event handlers.
- `render`
    - called during the initialization process to render the template, replacing any substitution variables with actual data. 
- `destroy`
    - called when the view no longer needs to remain in memory. Typically registered for the `viewWasPopped` notification.

Neither `init`/`initWithOptions` or `destroy` is automatic -- that is, they must be performed manually. `destroy` will not be automatically called when nothing references the view -- so it is critical that you call it when a particular view is no longer needed.

### `init` / `initWithOptions`

`init` is called manually by the instantiating code. Its purpose is as follows:

- call `super init`, which:
    - calls `renderToElement` (which calls `render`)
    - attaches to a `parentElement` if specified
- perform any additional initialization such as:
    - registering listeners for specific notifications

A typical `init` looks like this:

	    self.override( function init( theParentElement ) {
	      // call super
	      self.super( _className, "init", [ undefined, "div", 
	        self.class + " ui-container", theParentElement
	      ] );
	      // do other initialization
	      self.addListenerForNotification( "viewWasPushed", self.captureBackButton );
	      self.addListenerForNotification( "viewWasPopped", self.releaseBackButton );
	      self.addListenerForNotification( "viewWasPopped", self.destroy );
	      return self;
	    });

Generally you should supply an appropriate `initWithOptions` method as well, especially if your `init` takes additional parameters:

	    self.override( function initWithOptions ( options ) {
	      var theParentElement;
	      if ( typeof options !== "undefined" ) {
	        if ( typeof options.parent !== "undefined" ) {
	          theParentElement = options.parent;
	        }
	      }
	      return self.init( theParentElement );
	    });


### `destroy`

`destroy` should always be called in order to clean up any loose ends and free up memory. Deregistering for notifications is also typically done at this point to ensure that the destroyed view can no longer respond to any notifications.

Typically, it performs the following:

- deregisters listeners for specific notifications
- calls `destroy` on any owned objects that support `destroy`
- nulls object references (so they can be freed)
- calls `super destroy` which allows each level in the object hierarchy to clean up after itself.

A `destroy` method typically looks like this:

	    self.override( function destroy() {
	      self.releaseBackButton();
	      self.removeListenerForNotification ( "viewWasPushed", self.captureBackButton );
	      // Stop listening for our disappearance
	      self.removeListenerForNotification( "viewWasPopped", self.releaseBackButton );
	      self.removeListenerForNotification( "viewWasPopped", self.destroy );
	      // release our objects
	      self._backButton = null;
	      self._deleteButton = null;
	      self._shareButton = null;
	      self.super( _className, "destroy" );
	    };

### `render`

`render` is called during the initialization process. Its purpose is to render the template for the view and replace any substitution variables with actual text. For cases when the appropriate values may not yet be known (for example, the view may only load data from the database when it is presented on-screen), substitution variables should not be used and instead the appropriate DOM elements should have `class`es or `id`s that can later be looked up and set accordingly.

A typical method looks like this:

	    self.overrideSuper( function render() {
	      return _y.template( viewHTML, {
	        "VIEW_TITLE": "The view title",
	        "VIEW_CONTENTS": "Hello!",
	        "BACK": "Back",
	        "DELETE": "Delete"
	      });
	    });
	    
### `renderToElement`

`renderToElement` is called during the initialization process, but it can be called any time after as well. As such, no action should be taken during this method that can't be repeated multiple times (though in practice, the method is only called once.

The purpose of `renderToElement` is to:

- call `super renderToElement` (which calls `render` and inserts the results into the DOM)
- look up any DOM elements that need to be used by other methods in the view
- attach any event handlers for DOM elements that need to be interactive

> **Note:** Registering listeners for notifications should never be performed in this method, since it can be called more than once.

A typical `renderToElement` might look like this:

	    self.override( function renderToElement() {
	      self.super( _className, "renderToElement" );
	      self._backButton = self.element.querySelector(
	        ".ui-navigation-bar .ui-bar-button-group.ui-align-left .ui-back-button" );
	      self._deleteButton = self.element.querySelector(
	        ".ui-navigation-bar .ui-bar-button-group.ui-align-right .ui-bar-button" );
	      Hammer( self._backButton ).on( "tap", self.goBack );
	      Hammer( self._deleteButton ).on( "tap", self.delete );
	      self._shareButton = self.element.querySelector( ".share-button" );
	      Hammer( self._shareButton ).on( "tap", self.share );
	    });
