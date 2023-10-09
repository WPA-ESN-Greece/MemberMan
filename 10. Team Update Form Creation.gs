function createNewTeamUpdateForm() 
{
  var ui = SpreadsheetApp.getUi()
  
  // Gets the parent folder of the MemberMan Spreadsheet. 
  var parentFolderID = DriveApp.getFileById(ss.getId()).getParents().next().getId() //Spreadsheet Parent folder
  var destinationFolder = DriveApp.getFolderById(parentFolderID)

  // Creates a copy of the Join the Team Form Template to the same folder as MemberMan Spreadsheet.
  let newUpdateTeamForm = DriveApp.getFileById(TEAM_UPDATE_FORM_TEMPLATE_ID).makeCopy( TEAM_UPDATE_FORM_NAME, destinationFolder) 

  let newUpdateTeamFormURL = newUpdateTeamForm.getUrl()
  let newUpdateTeamFormID = newUpdateTeamForm.getId()
  var form = FormApp.openById(newUpdateTeamFormID)

  form.setDestination(FormApp.DestinationType.SPREADSHEET, SpreadsheetID)

  // Sets the Team Update Form URL in the Settings Sheet.
  linkCellContents(TEAM_UPDATE_FORM_NAME, newUpdateTeamFormURL, Settings_SHEET, Team_Update_Form_LINK_CELL) 
  
  SpreadsheetApp.flush()

  // Rename the Team Update Form Responses Sheet.
  renameFormResponsesSheet(Team_Update_Form_Sheet_NAME)
  Team_Update_Form_SHEET = ss.getSheetByName(Team_Update_Form_Sheet_NAME)

  deleteMostBlankRows(Team_Update_Form_SHEET)
  deleteBlankColumns(Team_Update_Form_SHEET)
  formatColumnHeaders(Team_Update_Form_SHEET)
  replacePlaceholderTextInForm(newUpdateTeamFormID)
  
}
