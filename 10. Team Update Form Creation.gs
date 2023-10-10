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

  // Links the Uodate Form with this Spreadsheet. 
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
  //replacePlaceholderTextInForm(newUpdateTeamFormID)

  // Replaces Placeholder texts based on given Section's info in the new Team Update Form.
    var updateForm = FormApp.openById(newupdateTheTeamFormID)

    // update Form Title Text. 
    updateForm.setTitle( updateForm.getTitle().replace("{{ESN Section's Name}}", SECTION_SHORT_NAME))

    // Form Description Text
    let updateFormDescription = updateForm.getDescription()

    // Does the text replacements.
    updateFormDescription = updateFormDescription.replace("{{ESN Section's Name}}", SECTION_SHORT_NAME)
    updateFormDescription = updateFormDescription.replace("{{ESN Section's Name}}", SECTION_SHORT_NAME)
    
    // Sets form final description.
    updateForm.setDescription(updateFormDescription)

    // GDPR Text
    var items = updateForm.getItems()
    let gdprItemID = items[items.length - 1].getId()
    let updateFormgdprText = updateForm.getItemById(gdprItemID).getHelpText()

    updateFormgdprText = updateFormgdprText.replace("{{ESN Section's Full Name}}", SECTION_FULL_NAME)

    updateFormgdprText = updateFormgdprText.replace("{{ESN Section's Name}}", SECTION_SHORT_NAME)
    updateFormgdprText = updateFormgdprText.replace("{{ESN Section's Name}}", SECTION_SHORT_NAME)

    // Sets form final gdpr text.
    updateForm.getItemById(gdprItemID).setHelpText(updateFormgdprText)

  toast("","Team Update Form has been customized for your Section")

  // Creates a first column with "Update Status" as a name. 
  Team_Update_Form_SHEET.insertColumnBefore(1)
  Team_Update_Form_SHEET.getRange("A1").setValue("Update Status")
  
  // Sets the Team Update Form created status as tru in the settings.
  Settings_SHEET.getRange(IS_TeamUpdateForm_Created_CELL).setValue("TRUE")

  // A cuter pop up message on the bottom right. 
  toast("","🎉 Your Team Update Form is ready!")
}


function updateTeamMembers() 
{
  var lastRow = Team_Update_Form_SHEET.getLastRow()
  var lastColumn = Team_Update_Form_SHEET.getLastColumn()
  var range = Team_Update_Form_SHEET.getRange(2,1,lastRow,lastColumn).getValues()

  let MembersEmailAddresses = Members_SHEET.getRange(2,2, Members_SHEET.getLastRow() - 2, 1).getValues()//.join().split()

  range.forEach(function(row, index)
  {
    let currentEsnEmail = row[4]
    
    if(row[0] === "" && row[1] != '' && row[2] != '' && row[3] != '' && MembersEmailAddresses.join().split().join().includes(currentEsnEmail) && row[5] != '' && row[6] != '')
    {
      let memberSheetRowIndex = MembersEmailAddresses.findIndex(function(element){return element == currentEsnEmail}) + 2
      
      // If Active Member.
      if (row[5] === "Active Member" && row[8] != '' && row[9] != '')
      {
        switch (row[6])
        {
          case "No":
            var memberStatusToCheck = Members_SHEET.getRange(memberSheetRowIndex, 1).getValue()

            // The values in this IF won't change to Active Member during the member update.
            if (!(memberStatusToCheck === NEWBIE || memberStatusToCheck === BOARD_MEMBER || memberStatusToCheck === BOARD_SUPPORTER || memberStatusToCheck === CREATE_GOOGLE_ACCOUNT))
            {
              // Sets Member Status in Members Sheet as ACTIVE_MEMBER. 
              Members_SHEET.getRange(memberSheetRowIndex, 1).setValue(ACTIVE_MEMBER)
            }
          break;
          case "National Level":
            // Sets Member Status in Members Sheet as National. 
            Members_SHEET.getRange(memberSheetRowIndex, 1).setValue(IN_ESN_NATIONAL) 
          break;
          case "International Level":
            // Sets Member Status in Members Sheet as International. 
            Members_SHEET.getRange(memberSheetRowIndex, 1).setValue(IN_ESN_INT) 
          break;
          case "National & International Level":
            // Sets Member Status in Members Sheet as National and International. 
            Members_SHEET.getRange(memberSheetRowIndex, 1).setValue(IN_ESN_NAT_INT) 
          break;
        }
      }
      // If Alumnus.
      else if (row[5] === "Alumnus" && row[8] != '' && row[9] != '')
      { 
        // Sets Member Status in Members Sheet as ALUMNI. 
        Members_SHEET.getRange(memberSheetRowIndex, 1).setValue(ALUMNI)
      }

      // Contact Email
      Members_SHEET.getRange(memberSheetRowIndex, 7).setValue(row[8])

      // Contact Phone
      Members_SHEET.getRange(memberSheetRowIndex, 8).setValue(row[9])

      // Calculates the time in ESN for current member.
        let teamUpdateDate = new Date(row[1].getFullYear(), row[1].getMonth(), row[1].getDate())

        let becameMemberDate = Members_SHEET.getRange(memberSheetRowIndex, How_Long_InESN_COLUMN -1).getValue().split("/")
        becameMemberDate = new Date(becameMemberDate[2], becameMemberDate[1] -1, becameMemberDate[0])

        let monthsInESN = dateDifferenceInMonths(teamUpdateDate, becameMemberDate)

        Logger.log(monthsInESN)

        Members_SHEET.getRange(memberSheetRowIndex, How_Long_InESN_COLUMN).setValue(monthsInESN)

      // Sets current row as UPDATES in Team Update Form Responses Sheet.
      Team_Update_Form_SHEET.getRange(index +2, 1, 1, 1).setValue(UPDATED)
    }
  })
    
  toast("Accepted entries have been copied to Members Sheet.","🎉 Accepted they were!")
}


function deleteUpdatedResponses()
{
  var ui = SpreadsheetApp.getUi()

  var input  = ui.prompt(`Write the word "DELETE" to confirm the process of deleting all the updated responses.`)

  if (!(input.getResponseText() === "DELETE")) {return}
  else
  {
    var indexToDelete = []

    var lastRow = Team_Update_Form_SHEET.getLastRow() 
    var lastCol = Team_Update_Form_SHEET.getLastColumn()
    var updateFormData = Team_Update_Form_SHEET.getRange(2, 1, lastRow, lastCol).getValues()
    
    Logger.log(updateFormData)

    updateFormData.forEach(function(row,index)
    {
      if(row[0] === UPDATED && row[1] != "" && row[4] != "" && row[5] != "")
      {
        var indexPlusTwo = index + 2
        indexToDelete.push(indexPlusTwo)
      }
    })

    let indexToDeleteSorted = indexToDelete.sort((a,b) => b - a)
    
    Logger.log(indexToDeleteSorted)

    for(var i = 0; i < indexToDeleteSorted.length; i++)
    {
      Logger.log(indexToDeleteSorted[i])
      Team_Update_Form_SHEET.deleteRow(indexToDeleteSorted[i])
    }
  }

}