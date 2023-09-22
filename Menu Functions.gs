

// Custom ESN Menu.

function initMenu()
{
  var ui, menu, submenu
  
  ui = SpreadsheetApp.getUi()

  menu = ui.createMenu("🌌 ESN Menu")

  menu.addItem("🦸‍♀️ Move Accepted to Members", "acceptedFromJoinformToMembers")
  menu.addItem("🚮 Delete Rejected Responses", "deleteRejectedRecruits")

  menu.addSeparator()

  //menu.addItem("Setup Wizard 🧙‍♂️", "")
  if (IS_JoinForm_Created == false) { menu.addItem("📝 Create Join the Team Form", "createNewRecruitmentForm")}

  submenu = ui.createMenu("Options")

    if (IS_CSV_Link_Generated == false) {submenu.addItem("🔗 Generate users.csv download link","generateUsersCSVDownloadLink")}

  menu.addSubMenu(submenu)

  menu.addSeparator()
  
  menu.addItem("📑 View Documentation","showDocumentation")

  menu.addToUi()
}


/*
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
  }

  var submenu = ui.createMenu("🔨 Set Up")
  submenu.addItem("📝 Create New Form","createNewRecruitmentForm")
  submenu.addItem("✨ Format Form responses","oneClickSetUp")
  submenu.addItem("🔗 Generate users Sheet Link","generateUsersLink")

  menu.addSubMenu(submenu)
  
  menu.addItem("📑 View Documentation","showDocumentation")
  
  menu.addToUi()
}

*/





//Documentation Link pop-up
function showDocumentation()
{
  let documentationMessage = HtmlService.createHtmlOutput(`<p style="font-family: 'Open Sans'">You can find the documentation <a href="${DOCUMENTATION_LINK}"target="_blank">here</a>.</p>`).setWidth(400).setHeight(60)

  SpreadsheetApp.getUi().showModalDialog(documentationMessage,"📚 MemberMan Documentation")
}