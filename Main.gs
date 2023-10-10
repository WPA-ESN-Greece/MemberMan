/**
 * @OnlyCurrentDoc
 */


function onOpen(e)
{
  //Custom Menu Item. On Add-on menu. Accessed from the 🧩 icon in the top right of the Google Form UI. 
  let ui = FormApp.getUi()
  let menu = ui.createAddonMenu()
  
  menu.addItem('🌌 Set-Up','setUp')
  menu.addToUi()
}


function onFormSubmit(e)
{
  let responses = e.response
  
  // If all questions are required, getItemResponses returns responses in form-order
  let itemResponses = responses.getItemResponses()
  let email = itemResponses[2].getResponse() // returns a string
  
  Logger.log(email)

  sendAutoReplyEmail(email)
  
  Logger.log("Email sent.")
}

function setUp()
{
  authPopUp()
  setUpTriggers()
}



function setUpTriggers()
{
  ScriptApp.newTrigger('onFormSubmit')
  .forForm(FormApp.getActiveForm())
  .onFormSubmit()
  .create()

  /*
  ScriptApp.newTrigger('onOpen')
  .forForm(FormApp.getActiveForm())
  .onOpen()
  .create()
  */
}

//Authentication Window
function authPopUp()
{
  var ui = FormApp.getUi()


  var authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL)
  let authStatus = authInfo.getAuthorizationStatus()
  Logger.log("authStatus " + authStatus)

  if (authStatus === ScriptApp.AuthorizationStatus.REQUIRED){

    var authUrl = authInfo.getAuthorizationUrl()
    
    var message = HtmlService.createHtmlOutput(`<p style="font-family: 'Open Sans'">Authenticate your script.<a href="${authUrl}" target="_blank">here</a></p>`).setWidth(400).setHeight(60)
    ui.showModalDialog(message,"Authentication")

  }
  else if ( authStatus === ScriptApp.AuthorizationStatus.NOT_REQUIRED)
  {
    ui.alert("Your form is all set.", ui.ButtonSet.OK)
  }
}