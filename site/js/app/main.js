define ( ["yasmf", "app/views/DemoListView"], function ( _y, DemoListView )
{
  var APP = {};

  APP.start = function ()
  {
    var aDemoListView = new DemoListView ();
    aDemoListView.init();

    var homeTab = new _y.UI.ViewContainer();
    homeTab.initWithOptions ( { tag: "div", class: "ui-container home", title: "Home" } );

    var gettingStartedTab = new _y.UI.ViewContainer();
    gettingStartedTab.initWithOptions ( { tag: "div", class: "ui-container home", title: "Getting Started" } );

    var documentationTab = new _y.UI.ViewContainer();
    documentationTab.initWithOptions ( { tag: "div", class: "ui-container documentation", title: "Documentation" } );

    var downloadTab = new _y.UI.ViewContainer();
    downloadTab.initWithOptions ( { tag: "div", class: "ui-container download", title: "Download" } );

    var aboutTab = new _y.UI.ViewContainer();
    aboutTab.initWithOptions ( { tag: "div", class: "ui-container about", title: "About" } );

    var aTabViewController = new _y.UI.TabViewController();
    aTabViewController.initWithOptions( { barPosition: _y.UI.TabViewController.BAR_POSITION.top,
                                         barAlignment: _y.UI.TabViewController.BAR_ALIGNMENT.left } );

    aTabViewController.addSubview ( aDemoListView );
    aTabViewController.addSubview ( homeTab );
    aTabViewController.addSubview ( gettingStartedTab );
    aTabViewController.addSubview ( documentationTab );
    aTabViewController.addSubview ( downloadTab );
    aTabViewController.addSubview ( aboutTab );

    _y.UI.rootView = aTabViewController;
    APP.rootView = _y.UI.rootView;
  };

  return APP;
});