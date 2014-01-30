define ( ["yasmf", "text!html/DemoListView.html!strip",
          "hammer"], function ( _y, DemoListViewHTML, Hammer ) {

  var _className = "DemoListView";
  var DemoListView = function ()
  {
    var self = new _y.UI.ViewContainer();
    self.subclass ( _className );

    self.title = "Demo";

    self._listContainer = null;
    self._alertButton = null;

    self.testAlerts = function ()
    {
      function logTappedButton ( sender, notice, data )
      {
        var buttonIndex = data[0];
        console.log ("Button tapped in alert (" + sender.title + "): " + buttonIndex);
      }
      // one button alert
      var oneAlert = new _y.UI.Alert();
      oneAlert.initWithOptions (
        { title:   "One Button Alert",
          text:    "This is a multi-line alert.<br/>Line 2 of the alert.",
          buttons: [ _y.UI.Alert.button ( "OK", { type: "bold" } )
                   ] } );
      oneAlert.addListenerForNotification ( "buttonTapped", logTappedButton );
      oneAlert.show();

      // two button alert
      var twoAlert = new _y.UI.Alert();
      twoAlert.initWithOptions (
        { title:   "Two Button Alert",
          text:    "This is a multi-line alert.<br/>Line 2 of the alert.",
          buttons: [ _y.UI.Alert.button ( "Yes" ),
                     _y.UI.Alert.button ( "No", { type: "bold" } )
                   ] } );
      twoAlert.addListenerForNotification ( "buttonTapped", logTappedButton );
      twoAlert.show();

      // three button alert
      var threeAlert = new _y.UI.Alert();
      threeAlert.initWithOptions (
        { title:   "Three Button Alert",
          text:    "This is a multi-line alert.<br/>Line 2 of the alert.",
          buttons: [ _y.UI.Alert.button ( "Yes", { type: "destructive" } ),
                     _y.UI.Alert.button ( "No" ),
                     _y.UI.Alert.button ( "Cancel", { type: "bold", tag: -1 } )
                   ] } );
      threeAlert.addListenerForNotification ( "buttonTapped", logTappedButton );
      threeAlert.show();

      // four button alert
      var fourAlert = new _y.UI.Alert();
      fourAlert.initWithOptions (
        { title:   "Four Button Alert",
          text:    "This is a multi-line alert.<br/>Line 2 of the alert.",
          promise: true,
          buttons: [ _y.UI.Alert.button ( "Delete Draft", { type: "destructive" } ),
                     _y.UI.Alert.button ( "Save Draft" ),
                     _y.UI.Alert.button ( "Auto Reply..." ),
                     _y.UI.Alert.button ( "Cancel", { type: "bold", tag: -1 } )
                   ] } );
      fourAlert.addListenerForNotification ( "buttonTapped", logTappedButton );
      fourAlert.show()
               .then ( function (idx) { console.log ("Promise resolved: " + idx); } )
               .catch ( function ( e ) { console.log ( "Promise rejected: " + e); } )
               .done();

      // change the title of FourAlert after it is shown.
      fourAlert.title = "This is a new title.";
    };


//    self.overrideSuper ( self.class, "render", self.render)
    self.override ( function render ()
                    {
                      return _y.template ( DemoListViewHTML,
                                           { "APP_TITLE": _y.T("APP_TITLE") }
                                         );
                    });

    self.override ( function renderToElement ()
                    {
                      self.super ( _className, "renderToElement" );

                      // find our DOM elements
                      self._listContainer = self.element.querySelector ( ".ui-list" );
                      self._alertButton = self.element.querySelector ( ".ui-tool-bar .ui-bar-button" );

                      // attach handlers
                      Hammer ( self._alertButton ).on ("tap", self.testAlerts );
                    });

    self.override ( function init ()
                    {
                      self.super ( _className, "init", [undefined, "div", "DemoListView ui-container", undefined] );
                    });


    self.override ( function destroy ()
                    {
                      self._listContainer = null;
                      self._alertButton = null;
                      self.super ( _className, "destroy" );
                    });

    return self;
  };

  _y.addTranslations (
  {
    "APP_TITLE":
    {
      "EN": "YASMF-Next Demo"
    },
    "BACK":
    {
      "EN": "Back",
      "ES": "Volver"
    }
  });

  return DemoListView;
});