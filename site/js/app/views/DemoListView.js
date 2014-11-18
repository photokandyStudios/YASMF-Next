define( [ "yasmf", "text!html/DemoListView.html!strip", "hammer" ], function ( _y, DemoListViewHTML, Hammer ) {
  var _className = "DemoListView";
  var DemoListView = function () {
    var self = new _y.UI.ViewContainer();
    self.subclass( _className );
    self.title = "Demo";
    self._listContainer = null;
    self._alertButton = null;
    self._spinnerButton = null;
    self.testAlerts = function () {
      function logTappedButton( sender, notice, data ) {
          var buttonIndex = data[ 0 ];
          console.log( "Button tapped in alert (" + sender.title + "): " + buttonIndex );
        }
        /*
         // one button alert
         var oneAlert = new _y.UI.Alert();
         oneAlert.initWithOptions( {
         title: "One Button Alert",
         text: "This is a multi-line alert.<br/>Line 2 of the alert.",
         buttons: [ _y.UI.Alert.button( "OK", {
         type: "bold"
         } ) ]
         } );
         oneAlert.addListenerForNotification( "buttonTapped", logTappedButton );
         oneAlert.show();
         // two button alert
         var twoAlert = new _y.UI.Alert();
         twoAlert.initWithOptions( {
         title: "Two Button Alert",
         text: "This is a multi-line alert.<br/>Line 2 of the alert.",
         buttons: [ _y.UI.Alert.button( "Yes" ),
         _y.UI.Alert.button( "No", {
         type: "bold"
         } )
         ]
         } );
         twoAlert.addListenerForNotification( "buttonTapped", logTappedButton );
         twoAlert.show();
         // three button alert
         var threeAlert = new _y.UI.Alert();
         threeAlert.initWithOptions( {
         title: "Three Button Alert",
         text: "This is a multi-line alert.<br/>Line 2 of the alert.",
         buttons: [ _y.UI.Alert.button( "Yes", {
         type: "destructive"
         } ),
         _y.UI.Alert.button( "No" ),
         _y.UI.Alert.button( "Cancel", {
         type: "bold",
         tag: -1
         } )
         ]
         } );
         threeAlert.addListenerForNotification( "buttonTapped", logTappedButton );
         threeAlert.show();
         // four button alert
         var fourAlert = new _y.UI.Alert();
         fourAlert.initWithOptions( {
         title: "Four Button Alert",
         text: "This is a multi-line alert.<br/>Line 2 of the alert.",
         promise: true,
         buttons: [ _y.UI.Alert.button( "Delete Draft", {
         type: "destructive"
         } ),
         _y.UI.Alert.button( "Save Draft" ),
         _y.UI.Alert.button( "Auto Reply..." ),
         _y.UI.Alert.button( "Cancel", {
         type: "bold",
         tag: -1
         } )
         ]
         } );
         fourAlert.addListenerForNotification( "buttonTapped", logTappedButton );
         fourAlert.show().then( function ( idx ) {
         console.log( "Promise resolved: " + idx );
         } ).catch( function ( e ) {
         console.log( "Promise rejected: " + e );
         } ).done();
         // change the title of FourAlert after it is shown.
         fourAlert.title = "This is a new title.";
         */
      var years = [],
        months = [],
        days = [],
        dt = new Date(),
        yearSelect, monthSelect, daySelect;
      for ( var y = dt.getUTCFullYear() - 50, yl = dt.getUTCFullYear() + 50; y <= yl; y++ ) {
        years.push( _y.h.option( y, y ) );
      }
      for ( var m = 1, ml = 12; m <= ml; m++ ) {
        months.push( _y.h.option( m, m ) );
      }
      for ( var d = 1, dl = 31; d <= dl; d++ ) {
        days.push( _y.h.option( d, d ) );
      }
      yearSelect = _y.h.el( "select?size=5", years );
      monthSelect = _y.h.el( "select?size=5", months );
      monthSelect.addEventListener( "change", function () {
        for ( var i = 28; i <= 31; i++ ) {
          daySelect.childNodes[ i - 1 ].disabled = ( ( new Date( parseInt( yearSelect.value, 10 ), parseInt(
            monthSelect.value, 10 ) - 1, i ) ).getUTCDate() !== i ) ? "disabled" : undefined
        }
      } );
      daySelect = _y.h.el( "select?size=5", days );
      var anAlertView = new _y.UI.Alert( {
        title: "This is an alert",
        text: _y.h.div( yearSelect, monthSelect, daySelect ),
        promise: true,
        buttons: [
          _y.UI.Alert.button( "Set", {
            type: "bold"
          } ),
          _y.UI.Alert.button( "Don't Set", {
            tag: -1
          } )
        ]
      } );
      anAlertView.show().then( function ( idx ) {
        console.log( idx );
      } ).catch( function ( e ) {
        console.log( e );
      } ).done();
      window._alert = anAlertView;
      setTimeout( function () {
        yearSelect.selectedIndex = 50;
        monthSelect.selectedIndex = dt.getMonth();
        daySelect.selectedIndex = dt.getDate() - 1;
      }, 00 );
    };
    self.testSpinner = function () {
        var s = new _y.UI.Spinner( {
          text: "This is a test...",
          tintedBackground: true
        } );
        s.show();
        setTimeout( function () {
          s.hide( s.destroy );
          s = null;
        }, 30000 );
      }
      //    self.overrideSuper ( self.class, "render", self.render)
    self.override( function render() {
      return _y.template( DemoListViewHTML, {
        "APP_TITLE": _y.T( "APP_TITLE" )
      } );
    } );
    self.override( function renderToElement() {
      self.super( _className, "renderToElement" );
      // find our DOM elements
      self._listContainer = self.element.querySelector( ".ui-list" );
      var buttons = self.element.$$( ".ui-tool-bar .ui-bar-button" );
      self._alertButton = buttons[ 0 ];
      self._spinnerButton = buttons[ 1 ];
      // attach handlers
      Hammer( self._alertButton ).on( "tap", self.testAlerts );
      Hammer( self._spinnerButton ).on( "tap", self.testSpinner );
    } );
    self.override( function init() {
      self.super( _className, "init", [ undefined, "div", "DemoListView ui-container", undefined ] );
    } );
    self.override( function destroy() {
      self._listContainer = null;
      self._alertButton = null;
      self.super( _className, "destroy" );
    } );
    return self;
  };
  _y.addTranslations( {
    "APP_TITLE": {
      "EN": "YASMF-Next Demo"
    },
    "BACK": {
      "EN": "Back",
      "ES": "Volver"
    }
  } );
  return DemoListView;
} );