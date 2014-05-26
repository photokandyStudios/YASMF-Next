# Understanding the View Stack

![View Stack Example](https://raw.githubusercontent.com/photokandyStudios/YASMF-Next/master/wiki/images/view-stack.png)

View stacks are managed by Navigation Controllers, which both contain and manage a series of views. While it is possible to use YASMF without the aid of navigation controllers, one typically needs to specify explicit `z-index`es in order to properly order the views on-screen. Navigation Controllers take care of all that for you.

Typically, a Navigation Controller displays only one view at a time. The other views are still present in the DOM and are stacked below the currently visible view. In order to display multiple views on-screen, one needs to use a Split View Controller or a similar mechanism in conjunction with a Navigation Controller.

Navigation Controllers have several properties, but the most important with regard to the view stack are the following:

`rootView`
: The initial view; assigned when the Navigation Controller is created.

`topView`
: The current visible view. When only one view is present, it is the same as `rootView`.

`subviews`
: The views managed by the Navigation Controller; read-only.

By default, a Navigation Controller is created with an initial view as the `rootView` (as is displayed in the left-most stack in the above image), often as follows:

	var aView = (new _y.UI.ViewContainer()).init();
	var nc = new _y.UI.NavigationController( {
		rootView: aView,
		parent: _y.ge("rootContainer") 	});

> It is *impossible* to create a Navigation Controller without a `rootView`. Any attempt to do so will result in an exception.

Views are added to the Navigation Controller by calling `pushView`. This adds the specific view to the view stack, and (unless otherwise specified) generates a nice animation of the previous view animating off-screen and the new view animating on-screen. An example of this is in the second and third stacks in the image above.

Views can be removed from the Navigation Controller by calling `popView`. This removes the `topView` from the view stack and (unless otherwise specified) generates a nice animation of the top view animating off-screen and the underlying view animating on-screen. An example of this is shown in the fourth and fifth stacks in the image above.

> **Note:** You can only pop views off the stack if there are at least *two* views *on* the stack. 

There are occasions where one needs to change the `rootView` (especially since one can't pop all the views off the stack). In order to do so, one can assign a view to the `rootView` property, like so:

	nc.rootView = anotherView;
	
> If there are other views currently on the view stack (that is, `rootView!=topView`), those views are all popped off the stack with no animation, and the `rootView` is replaced by the new view.

Although it is possible to navigate the hierarchy of a Navigation Controller (and any other view controllers), it's not suggested that you do so. Doing so requires that your code be tightly coupled with the structure of your view hierarchy -- which is far from ideal. Better to use a router or post notifications when you need to talk to other views.


