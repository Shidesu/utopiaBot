var system = require('system');
var page = require('webpage').create();
try {
  function nextPagePromise() {
    return new Promise(function(resolve, reject) {
      page.onLoadStarted = function () {
        resolve();
      };

      page.onLoadFinished = function () {
        reject();
      };
    }
  }

  function loadConfig( config ) {
    var config = require( './botConfig.json' );
    return {
      name: config.name || "utopiaBot",
      password: config.password,
      link: config.forum.link,
      message: config.message || "voici le token pour Discord : \n \n !UB token {token}"
    };
  }

  function login() {
    page.open( bot.link + '/login', function ( status ) {
      if ( status == 'success' ) {
        console.log( "login" );
        form = document.forms[ "form_login" ];
        form.elements[ "username" ].value = bot.name;
        form.elements[ "password" ].value = bot.password;
        nextPagePromise().then(
          sendMP,
          function () {
            console.log( "fail login" );
            phantom.exit();
          } );
        form.submit();
          console.log( "login submitted" );
      } else {
        console.log( "fail login" );
        phantom.exit();
      }
    } );

  }

  function sendMP() {
    console.log( "send mp load page", bot.link + '/privmsg?mode=post' );
    page.open( bot.link + '/privmsg?mode=post', function ( status ) {
      console.log( "send mp loaded", status, status == 'success' );
      if ( status == 'success' ) {
        form = getFormByAction( '/privmsg?mode=post' );
        if ( form == null ) {
          console.log( "need connexion" );
          login();
        } else {
          console.log( "already connected" );
          form.elements[ "username" ].value = destinataire;
          form.elements[ "message" ].value = bot.message.replace( "{token}", token );
          form.submit();
          phantom.exit();
        }
      } else {
        console.log( "fail sendMP load" );
        phantom.exit();
      }
    } );
  }

  function getFormByAction( action ) {
    for ( var i = 0; i < document.forms.size; i++ ) {
      if ( document.forms[ i ].action == action )
        return document.forms[ i ];
    }
    return null;
  }

  console.log( "args", system.args )

  var token = system.args[ 1 ];
  var destinataire = system.args[ 0 ];
  var bot = loadConfig();
  sendMP();
} catch(e){
  console.log(e);
  phantom.exit();
}