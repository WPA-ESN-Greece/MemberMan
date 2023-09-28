

/*****************************************************************************************************************************
 * 
 * Accepted to Members Function.
 * 
 * @see https://www.youtube.com/watch?v=ShcdwNh7wD0 how the appending a row works
 * 
 ****************************************************************************************************************************/


function acceptedFromJoinformToMembers() 
{
  var lastRow = Join_Form_Responses_SHEET.getLastRow()
  var lastColumn = Join_Form_Responses_SHEET.getLastColumn()
  var range = Join_Form_Responses_SHEET.getRange(2,1,lastRow,lastColumn).getValues()
  var rowsIndexToDelete = []

  var acceptedText = Settings_SHEET.getRange(ACCEPTED_CELL).getValue()

  range.forEach(function(row, index)
  {
    if(row[0] === acceptedText && row[2] != '' && row[3] != '' && row[4] != '' && row[5] != '' && row[6] != '' && row[7] != '')
    {
      var targetRow = Join_Form_Responses_SHEET.getRange(index + 2, 1, 1, lastColumn).getValues()
      rowsIndexToDelete.push(index + 2)
     
      Logger.log(targetRow)

      var pasteRow = targetRow[0]
      // Removes Recruitement Status and Timestamp from the data that's going to be copied to Members Sheet.
      pasteRow.shift(); pasteRow.shift()

      let primaryMemberData = pasteRow.slice(0, 9) //0,7
      let secondaryMemberData = pasteRow.slice(9, pasteRow.length) //9, pasteRow.length

      // Copies Values, all the form questions after the studies, from Join Form Responses to Members Sheet.
      appendRowFromTop(Members_SHEET, pasteRow.length + 1, 2, 3)
      Members_SHEET.getRange(2, searchForColumnNamed("🔰", Members_SHEET) + 2, 1, secondaryMemberData.length).setValues([secondaryMemberData])

      // Copies Values, From First Name till Studies, from Join Form Responses to Members Sheet. From First Name till Studies.
      setValueToRange(Members_SHEET, Members_SHEET.getRange(2, 3, 1, searchForColumnNamed(EndColumnofPrimaryMemberData, Members_SHEET) - 2).getA1Notation(), primaryMemberData) 
      //  searchForColumnNamed("Τμήμα Φοίτησης", Members_SHEET) //C2:K2

      // Create ESN Email Address and sets value of ESN email to the Members Sheet.
      var firstname = primaryMemberData[0]
      var lastname = primaryMemberData[1]
      setValueToRange(Members_SHEET, ESN_Email_Address_CELL, [createESNemailAddress(firstname, lastname, 1)])

      // Creates and sets Became a member date.
      setValueToRange(Members_SHEET, Became_Member_Date_CELL, [Utilities.formatDate(new Date(), TIMEZONE, "dd/MM/yyyy")])

      // Sets Member Status to Create Google Account.
      setValueToRange(Members_SHEET, "A2", [CREATE_GOOGLE_ACCOUNT])

      // Sets Recruitment Status to Accepted & Transferred.
      setValueToRange(Join_Form_Responses_SHEET, Join_Form_Responses_SHEET.getRange(index + 2, 1, 1, 1).getA1Notation(), [ACCEPTED_TRANSFERRED]) 
    }
  })
    
    rowsIndexToDelete.sort().reverse()
    Logger.log("rowsIndexToDelete " + rowsIndexToDelete)
    for (var i = 0; i < rowsIndexToDelete.length; i++)
  {
    Join_Form_Responses_SHEET.deleteRow(rowsIndexToDelete[i])
  }
    
    toast("Accepted entries have been copied to Members Sheet.","🎉 Accepted they were!")
  }


  function createESNemailAddress(firstName, lastName, firstNameLettersNum, lastNameLettersNum)
  {
    //var firstName = "Onomas" //for testing
    //var lastName = "Epithetos" //for testing
    
    if (!firstNameLettersNum) {firstNameLettersNum = firstName.length}
    if (!lastNameLettersNum) {lastNameLettersNum = lastName.length}

    // If you want the full first name use firstName.slice(0,firstName.length) in the first part.
    var esnEmail = String(firstName.slice(0, firstNameLettersNum)).toLowerCase() + String(lastName.slice(0, lastNameLettersNum)).toLowerCase() + "@" + SECTION_EMAIL_DOMAIN
    
    //Logger.log(esnEmail) 
    return esnEmail
  }


/**
 * Deletes rows of rejected recruits from Join Form Sheet based on their Recruitment Status. If it is "Rejected", it's going to delete them.
 * Prompts the user for confirmation before proceeding with the deletion.
 *
 * @returns {void}
 */
function deleteRejectedRecruits()
{
  var ui = SpreadsheetApp.getUi()
  var indexToDelete = []

  var buttonPressed = ui.alert("You are about to delete rejected recruits. Are you sure you want to procceed?", ui.ButtonSet.YES_NO)

  if(buttonPressed === ui.Button.NO){return}
    
  var lastRow = Join_Form_Responses_SHEET.getLastRow()
  var lastCol = Join_Form_Responses_SHEET.getLastColumn()
  var joinFormData = Join_Form_Responses_SHEET.getRange(2, 1, lastRow - 2, lastCol).getValues()
  Logger.log(joinFormData)

  joinFormData.forEach(function(row,index)
  {
    if(row[0] === REJECTED && row[2] != "" && row[3] != "" && row[6] != "")
    {
      var indexPlusTwo = index + 2
      indexToDelete.push(indexPlusTwo)
    }
  })

  let indexToDeleteSorted = indexToDelete.sort((a,b) => b - a)

  for(var i = 0; i < indexToDelete.length; i++)
  {
    Join_Form_Responses_SHEET.deleteRow(indexToDeleteSorted[i])
  }

  toast("..but not for the recruiter.","🎉 Rejecton hurts...")
}