/*
/
/ Menu functions.
/
/ In this file you will find functions that build the ESN Menu and the menu specific functions like the showDocumentation function. 
/ It also includes a simple onOpen function for the first time setup menu. The initMenu function requires the authorization of scopes and needs an instalable onOpen Triger to run with out errors.
/
*/

// Custom ESN Menu.
function initMenu()
{
  var ui, menu, submenu, submenuJoinForm, submenuMembers, submenuAlumni, submenuTeamUpdate
  
  ui = SpreadsheetApp.getUi()
  menu = ui.createMenu("🌌 ESN Menu")

  submenuJoinForm = ui.createMenu("1️⃣ Join Form Operations")
  //
    submenuJoinForm.addItem("🦸‍♀️ Accepted to Members", "acceptedFromJoinformToMembers")
    submenuJoinForm.addItem("🚮 Delete Rejected Responses", "deleteRejectedRecruits")

  menu.addSubMenu(submenuJoinForm)

  submenuTeamUpdate = ui.createMenu("2️⃣ Team Update Form Operations")
  //
    submenuTeamUpdate.addItem("🔼 Update Members' Info", "updateTeamMembers")
    submenuTeamUpdate.addItem("🔥 Delete Team Update Updated Responses", "deleteUpdatedResponses")

  menu.addSubMenu(submenuTeamUpdate)
  
  submenuMembers = ui.createMenu("3️⃣ Members Operations")
  //
    
    if (adminRoleCheck() === true)
    {
      submenuMembers.addItem("🔰 Create Google Accounts", "bulkCreateGoogleUsers")
      submenuMembers.addItem("📤 Manually Email Credentials to Users", "manuallyEmailUsersCredentials")
    }
    submenuMembers.addItem("🦖 Members to Alumni", "transferDataFromMembersToAlumni")

  menu.addSubMenu(submenuMembers)


  submenuAlumni = ui.createMenu("4️⃣ Alumni Operations")
  //
    submenuAlumni.addItem("🦕 Alumni to Members", "transferDataFromAlumniToMembers")
    if (adminRoleCheck() === true)
    {
      submenuAlumni.addItem("🚫 Disable Retired Emails", "disableRetiredGoogleAccounts")
    }

  menu.addSubMenu(submenuAlumni)

  menu.addSeparator()

  if (IS_JoinForm_Created == false) {menu.addItem("📝 Create Join the Team Form", "createNewRecruitmentForm")}
  if (IS_TeamUpdateForm_Created == false) {menu.addItem("🎓 Create Team Update Form", "createNewTeamUpdateForm")}

  submenu = ui.createMenu("Options")
  //

    submenu.addItem("🔗 Generate users.csv download link","generateUsersCSVDownloadLink")
  
  menu.addSubMenu(submenu)

  menu.addSeparator()

  menu.addItem("📑 View Documentation","showDocumentation")
  menu.addItem("🕷️ Report a Bug","showBugReport")

  menu.addToUi()
}

function onOpen()
{
  var ui = SpreadsheetApp.getUi() 
  
  if (!(IS_JoinForm_Created == true && IS_TeamUpdateForm_Created == true && IS_Instalable_OnOpenTrigger_Created == true) && IS_Initial_SETUP_DONE == false)
  {
    let setupMenu = ui.createMenu("🌌 ESN Menu")

    setupMenu.addItem("Setup Wizard 🧙‍♂️", "initialSetUp")

    setupMenu.addToUi()
  }
}



// Set Up this tool for the end user.
function initialSetUp()
{
  var ui = SpreadsheetApp.getUi()
  
  // Authorizes the script.
  authPopUp()

  SpreadsheetApp.flush()

  // Prompts for admin user's email address.
  var adminEmail = ui.prompt("⚠️ Input the Admin's Email Address of your Section. By admin It's meant the person that has the permission to create Google users in your Google Workspace. Most likely your WPA.").getResponseText()
  Settings_SHEET.getRange(SECTION_EMAIL_Admin_CELL).setValue(String(adminEmail))

  // Gets the active users Organization Unit Path.
  var orgPath = getUser(Session.getActiveUser().getEmail()).orgUnitPath
  Settings_SHEET.getRange(SECTION_GOOGLE_Organization_Unit_Path_CELL).setValue(String(orgPath))

  // Gets the Section's Domain.
  var sectionDomain = adminEmail.split("@")[1]
  Settings_SHEET.getRange(SECTION_EMAIL_DOMAIN_CELL).setValue(String(sectionDomain))
  toast(`Admin's Email has been set in the Settings.
  Organization Unit Path has been set in the Settings.
  Section's Domain has been set in the Settings.
  `,"Section's Info has been set in the Settings.")

  // Prompts user for creating Google Users directly.
  var createUsers = ui.alert("⚠️ Would you like to create Google Users (ESN Email) directly to new members?", ui.ButtonSet.YES_NO)
  if (createUsers === ui.Button.YES)
  {
    Settings_SHEET.getRange(IS_Add_UsersToGoogleWorkplace_Active_CELL).setValue(true)
    toast("","Creating Google Users preference has been set in the Settings.")
  }
  else {}

  // Prompts user for adding new members to a members Google Group. 
  var membersGroupResponse = ui.alert("⚠️ Would you like to add new members to a Google Group just for members? (Only personal ESN emails)", ui.ButtonSet.YES_NO)
  if (membersGroupResponse === ui.Button.YES)
  {
    Settings_SHEET.getRange(IS_Members_Google_Group_Active_CELL).setValue(true)
    toast("","Adding Members to Group preference has been set in the Settings.")

    var  membersGroupAddress = ui.prompt("Type the Google Group Email Address for the members. Make sure it exist and you are owner or manager of it. Example of the email address: members@mit.esngreece.gr").getResponseText()

    Settings_SHEET.getRange(Members_Google_Group_CELL).setValue(membersGroupAddress)
    toast("","Members Group Email has been set in the Settings.")
  }
  else {}

  // Prompts user for adding alumni to a alumni Google Group. 
  var alumniGroupResponse = ui.alert("⚠️ Would you like to add alumni members to a Google Group just for alumni members? (Only personal ESN emails)", ui.ButtonSet.YES_NO)
  if (alumniGroupResponse === ui.Button.YES)
  {
    Settings_SHEET.getRange(IS_Alumni_Google_Group_Active_CELL).setValue(true) 
    toast("","Adding Alumni Members to Group preference has been set in the Settings.")

    var  alumniGroupAddress = ui.prompt("Type the Google Group Email Address for the alumni members. Make sure it exist and you are owner or manager of it. Example of the email address: alumni@mit.esngreece.gr").getResponseText()

    Settings_SHEET.getRange(Alumni_Google_Group_CELL).setValue(alumniGroupAddress) 
    toast("","Alumni Members Group Email has been set in the Settings.")
  }
  else {}

  // Prompts user for ESN Section's Full Legal Name.
  var  sectionFullName = ui.prompt("⚠️ Type your Section's Full Name as it appears in your Legal Documents. Example: Erasmus Student Network of University of Mykonos (Probably in your mother language)").getResponseText()
  Settings_SHEET.getRange(SECTION_FULL_NAME_CELL).setValue(sectionFullName)
  toast("","Section's Full Name has been set in the Settings.")

  // Prompts user for ESN Section's Short Name.
  var  sectionShortName = ui.prompt("⚠️ Type your Section's Short Name. Example: ESN Mykonos").getResponseText()
  Settings_SHEET.getRange(SECTION_SHORT_NAME_CELL).setValue(sectionShortName)
  toast("","Section's Short Name has been set in the Settings.")

  // Prompts user for ESN Section's University Name.
  var  sectionUniName = ui.prompt("⚠️ Type your Section's University Name. Example: Technical University of Mykonos (Probably in your mother language)").getResponseText()
  Settings_SHEET.getRange(UNIVERSITY_NAME_CELL).setValue(sectionUniName)
  toast("","Section's University Name has been set in the Settings.")

  SpreadsheetApp.flush();

  // Creates Join The Team Form.
  toast("","Creating Join the team Form...")
  createNewRecruitmentForm(sectionShortName , sectionUniName, sectionFullName) 

  // Creates Team Update Form.
  toast("","Creating Team Update Form...")
  createNewTeamUpdateForm(sectionShortName , sectionFullName) 

  // Generates a URL to download user.CSV file. 
  generateUsersCSVDownloadLink()
  toast("","Removing the bad attitude...")

  // Creates a trigger to automatically open the custom menu.
  toast("","🕷️ Adding bugs to fix later...")
  setOnOpenTrigger()

  Settings_SHEET.getRange(IS_Initial_SETUP_DONE_CELL).setValue("TRUE")

  SpreadsheetApp.flush()
  toast("Your MemberMan instance is ready for use!","🎉 MemberMan is Ready 🦸‍♂️")

  // A pop up message to let the user know that the form is ready while providing a link.
  var newJoinTheTeamFormURL = Settings_SHEET.getRange(JoinForm_LINK_CELL).getRichTextValue().getLinkUrl()
  var newTeamUpdateFormURL = Settings_SHEET.getRange(Team_Update_Form_LINK_CELL).getRichTextValue().getLinkUrl() 

  let joinFormCreationMessage = HtmlService.createHtmlOutput(`
  <p style="font-family: 'Open Sans'">
  You can find your new recruiting form <a href="${newJoinTheTeamFormURL}"target="_blank">here</a>.
  Don't forget to enable the Auto-Reply email for submitions from the Add-On Menu 🧩 from the Form UI AND make sure that the questions are updated to match your needs and your information.
  </p>
  <hr>
  <p style="font-family: 'Open Sans'">
  Also check the questions in the Team Update Form <a href="${newTeamUpdateFormURL}"target="_blank">here</a>.
  </p>
  `).setWidth(400).setHeight(250)
  ui.showModalDialog(joinFormCreationMessage,"Your 'Join the Team' Form is ready!")
}


//Documentation Link pop-up
function showDocumentation()
{
  let documentationMessage = HtmlService.createHtmlOutput(`<p style="font-family: 'Open Sans'">You can find the documentation <a href="${DOCUMENTATION_LINK}"target="_blank">here</a>.</p>`).setWidth(400).setHeight(60)

  SpreadsheetApp.getUi().showModalDialog(documentationMessage,"📚 MemberMan Documentation")
}


//Bug Report Link pop-up
function showBugReport()
{
  let bugReportMessage = HtmlService.createHtmlOutput(`<p style="font-family: 'Open Sans'">You can find the Bug report Form <a href="${BUG_REPORT_FORM_URL}"target="_blank">here</a>.</p>`).setWidth(400).setHeight(60)

  SpreadsheetApp.getUi().showModalDialog(bugReportMessage,"🕷️ MemberMan 2.0 - Report a Bug")
}