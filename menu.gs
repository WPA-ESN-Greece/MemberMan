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


// Initializes the custom menu.
function initMenu() 
{
  var ui = SpreadsheetApp.getUi()
  var menu = ui.createMenu("🌌 ESN Menu")
  
  menu.addItem("📤 Email Credentials to New Users","emailCredentials")
  menu.addItem("🦸‍♀️ Move Accepted to Members","acceptedToMembers")
  menu.addItem("🚮 Delete Rejected Responses","deleteRejected")

  menu.addSeparator()
 /*
  if (settingsSheet.getRange("C15").getValue() === true)
  {
    menu.addItem("👤 Create Google Users for 'Candidate Member'","addCandidateToGoogleWorkspace")
    
    menu.addSeparator()
  }*/

  var submenu = ui.createMenu("🔨 Set Up")
  submenu.addItem("📝 Create New Form","createNewRecruitmentForm")
  submenu.addItem("✨ Format Form responses","oneClickSetUp")
  submenu.addItem("🔗 Generate users Sheet Link","generateUsersLink")

  menu.addSubMenu(submenu)
  
  menu.addItem("📑 View Documentation","showDocumentation")
  
  menu.addToUi()
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






function oneClickSetUp()
{

  var searchText = "Form responses"
  var sheets = ss.getSheets()
  var sheet = sheets.filter(s => s.getSheetName().includes(searchText))

  if (sheet.length > 0)
  {
   var newFormSheet = ss.getSheetByName(sheet[0].getSheetName())
  }

  //For Form responses Sheet
  createRecruitingStatusCol(newFormSheet)
  createAgeCol(newFormSheet)

  deleteBlankColumns(newFormSheet)
  deleteMostBlankRows(newFormSheet)

  formatHeaders(newFormSheet)
  
  renameFormResponses()
  
  //setRangesInSettings()

  refreshData(membersSheet,"B1:C1")
  refreshData(settingsSheet,"J4:K16")
  refreshData(UsersSheet,"A2")
  refreshData(UsersSheet,"H2")
  refreshData(UsersSheet,"K2")
  refreshData(newFormSheet,"O1")

  condtionalFormating(newFormSheet)
  setTrigers()
}


//Documentation Link pop-up
function showDocumentation(){
  var ui = SpreadsheetApp.getUi()
    var documentationMessage = HtmlService.createHtmlOutput(`<p style="font-family: 'Open Sans'">You can find the documentation <a href="${DOCUMENTATION_LINK}"target="_blank">here</a></p>`).setWidth(400).setHeight(60)

    SpreadsheetApp.getUi().showModalDialog(documentationMessage,"Documentation")
}