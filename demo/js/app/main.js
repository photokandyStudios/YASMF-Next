define( [ "yasmf", "app/views/DemoListView" ], function ( _y, DemoListView ) {
  var APP = {};
  APP.start = function () {
    var aDemoListView = new DemoListView();
    aDemoListView.init();
    var aNavigationController = new _y.UI.NavigationController();
    aNavigationController.initWithOptions( {
      rootView: aDemoListView
    } );
    _y.UI.rootView = aNavigationController;
    APP.rootView = aNavigationController;
  };
  return APP;
} );
