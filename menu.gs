// Automatically runs when the spreadsheet is opened.
function onOpen(){

  initMenu()
  runTrigers()

}

//Trigers
function runTrigers(){

  ScriptApp.newTrigger('registerdStatus')
  .forSpreadsheet(formResSheet)
  .onFormSubmit()
  .create()

}


//Triggers when the linked form gets a new sybmition.
function onFormSubmit(e){
  registerdStatus(e)
}



// Initializes the custom menu.
function initMenu() {
  //var ui = SpreadsheetApp.getUi()
  var menu = ui.createMenu("🌌 ESN Menu")
  
  menu.addItem("📤 Email Credentials to New Users","emailCredentials")
  menu.addItem("🦸‍♀️ Move Accepted to Members","acceptedToMembers")
  menu.addItem("🚮 Delete Regected Responses","deleteRejected")

  menu.addSeparator()

  var submenu = ui.createMenu("🔨 Set Up")
  submenu.addItem("🔗 Generate users Link","generateUsersLink")
  //submenu.addItem("")

  menu.addSubMenu(submenu)
  
  menu.addItem("📑 View Documentation","showDocumentation")
  
  menu.addToUi()
}


function oneClickSetUp(){

//For Settings Sheet
generateUsersLink()

//For Form responses Sheet
createRecruitingStatusCol()
createAgeCol()
formatHeaders()


}


//Documentation Link pop-up
function showDocumentation(){
    var DOCUMENTATION_LINK = 'https://docs.google.com/document/d/1uQ3Sp9LvT8ORnd1uxYykX4FRxvCn1vkn30Z0HKTUbPA/edit?usp=sharing'

    var documentationMessage = HtmlService.createHtmlOutput(`<p style="font-family: 'Open Sans'">You can find the documentation <a href="${DOCUMENTATION_LINK}"target="_blank">here</a></p>`).setWidth(400).setHeight(60)

  SpreadsheetApp.getUi().showModalDialog(documentationMessage,"Documentation")
}