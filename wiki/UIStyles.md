# User Interface Styles

## device, form-factor, etc. targeting

## widget styles

In general, the appearance of widgets is accomplished via CSS. As such, in order for a particular element to receive the appearance of a specific widget, it needs to be classed appropriately.

### Global Changes

Use of YASMF applies the following globally:

* No margins on `body`
* Font stack (based on platform)
* Optimize Legibility (except Android)
* All `div`s use `border-box` sizing, `background-position` is set to `center center`, `background-repeat` is set to `no-repeat`, and `background-size` is set to `contain`. Furthermore, `outline` is set to `none`. 
* `input` and `text areas` are given `display:block` and do `outline: none`

### Tint Color

In line with Apple's iOS 7/8 design, YASMF-Next adds the concept of using a key or *tint color* to designate interactive items such as buttons or icons. Although the concept is named after iOS 7's implementation, it looks at home on any number of platforms.

> **Note**: The specific tint color is specific to the platform.

To specify that an element should receive a tint color, use the following classes:

* `ui-tint-color` -- for text-based elements
* `ui-background-tint-color` -- for icons and backgrounds

Elements with these classes automatically receive touch affordances when pressed.

> **Note**: Should the `color` or `background-color` be modified, an animation occurs from the old color to the new color

### Destructive Color

Similar to the tint color, but identifies items that are specifically destructive. Use these class names:

* `ui-destructive-color`
* `ui-background-destructive-color` 

### Glyphs

Glyphs represent small icons. There are several provided with YASMF-Next, though you can utilize your own as long as the images use a single color for the icon and transparency for the background.

> **Note**: Elements with glyphs attached are `mask`ed by the specified icon. For this reason, use `ui-background-tint-color` and `ui-background-destructive-color` to specify colors. If specifying a color directly, use `background-color`.

Glyphs are 30x30 pixels with no image repeating. They will naturally align to the center of any element in which they appear. To specify a glyph, use the `ui-glyph` class along with the specific name of the glyph:

```
<div class="ui-bar-button ui-glyph ui-glyph-camera"></div>
```

> **Note** : Glyphs and text should not be used together on the same elements. If text and icons must be on the same element, use `:before` classes for the icon, as the `ui-back-button` class does.

Currently available glyphs are as follows:

```
arrow-corners-inward, arrow-corners-outward, bookmark, books,
brightness-less, brightness-more, camera-video, camera, checkmark,
chevron-left-thick, chevron-left-thin, chevron-right-thick, chevron-right-thin,
circle-filled, circle-hollow, pause-filled, pause-hollow,
play-filled, play-hollow, clock, delete, gear, list, magnifying-glass,
page-text-new, pencil, plus, tag, trash, sound-wave, circle-filled-checked,
photo, photo-add, film, chat-bubble, chat-bubble-dots, share, download,
circle-info, more, circle-outlined, gps-locate, square-filled, square-hollow,
menu;
```


### Containers

Container classes are just that: classes that contain other elements. The following classes are available:

* `ui-container` -- non-scrolling container attached to the corners of its parent. If the parent fills the screen, so does the element with this class. Automatically pushed to the GPU for hardware acceleration.
* `ui-scroll-container` -- like `ui-container`, but permits native touch scrolling. Not automatically pushed to the GPU.
* `ui-split-view-container`, `ui-off-canvas-view`, and `ui-split-overlay-view` support YASMF's Split View Controller. You can implement the DOM hierarchy manually to create such a view, but it is easier to use `UI.SplitViewController`.

When YASMF initializes, one `ui-container` is always created in the DOM: `rootContainer`. 

> **Note**: A view usually consists of at least one `ui-container`. Scroll containers are almost always embedded inside `ui-container`s.

There's one very specific class applied to view containers:  `ui-root-view`. This indicates that the view is at the root of the view hierarchy. This should only be managed by YASMF's view controllers.

### Bars

There are several classes of bars, though in general, they behave very similarly:

* `ui-navigation-bar` -- a bar attached to the top of the parent container that contains navigation elements. Automatic support for `ui-back-button`.
* `ui-tool-bar` -- a bar attached to the bottom of the parent container that contains interactive elements.
* `ui-tab-bar` -- can be displayed in multiple positions; text only tabs at the moment.

> **Note**: Whereas navigation and tool bars can be created and managed manually, tab bars should be managed by the `TabViewController`.  

#### Navigation Bar

The navigation bar has support for two internal elements beyond that supported by the other bars: the view title and the back button.

The title is specified by the `ui-title` class. The appearance and location of this title is platform dependent. 

The back button is specified by the `ui-back-button` class. The appearance and location of the back button is also platform dependent.

> **Note**: Don't worry about hiding the back button when it shouldn't be visible. The CSS rules automatically hide `ui-back-button` elements when they are with a `ui-root-view`.

A typical navigation bar might look something like this:

```
<div class="ui-navigation-bar">
    <div class="ui-bar-button-group ui-align-left">
        <div class="ui-back-button ui-bar-button ui-tint-color">Back</div>
    </div>
    <div class="ui-title">View Title</div>
</div>
```

#### Avoiding Bars

By default, content does *not* avoid the on-screen bars. When declaring a list within a scroll container, if one needs it to avoid a navigation and tool bar, the following can be used (note `ui-avoid-...` classes on the `ul`):

```
<div class="ui-navigation-bar">
</div>
<div class="ui-scroll-container">
    <ul class="ui-list ui-avoid-navigation-bar ui-avoid-tool-bar"></ul>
</div>
<div class="ui-tool-bar">
</div>
```

### Bar Buttons and Button Groups

Bar buttons are interactive controls that are present on bars, whether navigation, tool, or tab bars. Bar buttons are positioned by being grouped together with specific class names.

Bar Button Groups are given the `ui-bar-button-group` class. The location of the group within the navigation bar is determined by the bar alignment: `ui-align-left`, `ui-align-right`, and `ui-align-center`. If one intends on using `ui-align-right` bar button groups, a left- and center-aligned group must also be present. (In a navigation bar, if `ui-title` is present, it acts as `ui-align-center` button group.)

> **Note:** When a back button is present, it should appear in the `ui-align-left` bar button group.

```
<div class="ui-tool-bar">
    <div class="ui-bar-button-group ui-align-left">
    </div>
    <div class="ui-bar-button-group ui-align-center">
    </div>
    <div class="ui-bar-button-group ui-align-right">
    </div>
</div>
```

Bar Buttons are specified using `ui-bar-button` and the text within can also be aligned `ui-align-left`, `ui-align-right`, or `ui-align-center`. Bar Buttons inherit the alignment of their group.

```
<div class="ui-tool-bar">
    <div class="ui-bar-button-group ui-align-center">
        <div class="ui-bar-button ui-background-tint-color ui-glyph ui-glyph-camera"></div>
        <div class="ui-bar-button ui-background-tint-color ui-glyph ui-glyph-camera-video"></div>
        <div class="ui-bar-button ui-tint-color">Save</div>
    </div>
</div>
```

### Tables

YASMF has basic support for table-like lists. Lists typically use `ul` and `li` elements rather than `div` elements.

A typical list looks like this:

```
<ul class="ui-list">
    <li class="ui-list-item"></li>
</ul>
```

If a list can have actions hidden behind the content, one should use this structure:

```
 <div class="ui-list-item-contents">
  </div>
  <div class="ui-list-action-group">
    <div class="ui-list-action ui-background-destructive-color">
      <div>TRASH</div>
    </div>
  </div>
```

Should one desire an arrow indicator, add a `div` to the `ui-list-item-contents` like this:

```
<div class="ui-indicator ui-arrow-direction-right"></div>
```
