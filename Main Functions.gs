


// Automatically runs when the spreadsheet is opened.
function onOpen(e)
{
  initMenu()
}

//Triggers when the linked form gets a new sybmition.
function onFormSubmit(e)
{
  registerdStatus(e)
}


// Generates the 'users' sheet link in the Settings
function generateUsersCSVDownloadLink()
{
  //Settings_SHEET.getRange(CSV_LINK_CELL).setValue(ss.getUrl()+'#gid='+ UsersSheet.getSheetId()) 
  let csvURL = ss.getUrl() + '#gid=' + Users_SHEET.getSheetId() 

  linkCellContents("Download users.csv", csvURL, Settings_SHEET, CSV_LINK_CELL)

  toast("The users sheet link is ready in the Settings.","🎉 Done!")
}


//Authentication Window
function authPopUp()
{
  var ui = SpreadsheetApp.getUi()

  var authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL)
  let authStatus = authInfo.getAuthorizationStatus()

  Logger.log("authStatus " + authStatus)

  if (authStatus === ScriptApp.AuthorizationStatus.REQUIRED)
  {
    var authUrl = authInfo.getAuthorizationUrl()
    
    var message = HtmlService.createHtmlOutput(`<p style="font-family: 'Open Sans'">Authenticate your script.<a href="${authUrl}" target="_blank">here</a></p>`).setWidth(400).setHeight(60)
    ui.showModalDialog(message,"Authentication")

  }
  else if ( authStatus === ScriptApp.AuthorizationStatus.NOT_REQUIRED)
  {
    ui.alert("Your form is all set.", ui.ButtonSet.OK)
  }
}

