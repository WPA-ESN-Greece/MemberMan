// Transffers members data between two sheets with the same structure. (Members and Alumni in this case).
function transferDataFromAlumniToMembers()
{
  var startRow = 2
  var statusToCheck = ACTIVE_AGAIN
  var lastRow = Alumni_SHEET.getLastRow()
  var lastColumn = Alumni_SHEET.getLastColumn()
  var alumniData = Alumni_SHEET.getRange(startRow,1,lastRow,lastColumn).getValues()
  var rowsIndexToDelete = []

  alumniData.forEach(function(row, index) 
  {
    // row[2] = First Name, row[3] = Lastnamw, row[6] = Contact Email, row[11] = Became Member Date, row[12] = ESN Account Link
    if(row[0] === statusToCheck && row[2] != '' && row[3] != '' && row[6] != '' && row[11] != '' && row[12] != '')
    {
      rowsIndexToDelete.push(index + startRow)

      var targetRow = Alumni_SHEET.getRange(index + startRow, 1, 1, lastColumn).getValues()

      Logger.log("targetRow: " + targetRow)

      appendRowFromTop(Members_SHEET, targetRow[0].length, startRow)
      setValueToRange(Members_SHEET, Members_SHEET.getRange(startRow, 1, 1, Members_SHEET.getLastColumn()).getA1Notation(), targetRow[0])
      //Alumni_SHEET.deleteRow(index + startRow)

      if (row[14].length === 0)
      {
        setValueToRange(Members_SHEET, Became_Alumni_Date_CELL, [Utilities.formatDate(new Date(), TIMEZONE, "dd/MM/yyyy")])
      }
      else 
      {
      var alumniDate = String(row[14])
      var outPutDates = String(Utilities.formatDate(new Date(), TIMEZONE, "dd/MM/yyyy")) + ", " + alumniDate
      setValueToRange(Members_SHEET, Became_Alumni_Date_CELL, [outPutDates])
      }
      
      addUserToGoogleGroup(row[1], Members_Google_Group)

      if (IS_Alumni_Google_Group_Active == true)
      {
        removeUserFromGoogleGroup(row[1], Alumni_Google_Group)
      }
    }
  })
  
  rowsIndexToDelete.sort().reverse()
  Logger.log("rowsIndexToDelete " + rowsIndexToDelete)
  for (var i = 0; i < rowsIndexToDelete.length; i++)
  {
    Alumni_SHEET.deleteRow(rowsIndexToDelete[i])
  }
}


function disableRetiredGoogleAccounts()
{
  var startRow = 2
  var statusToCheck = RETIRED
  var lastRow = Alumni_SHEET.getLastRow()
  var lastColumn = Alumni_SHEET.getLastColumn()
  var alumniData = Alumni_SHEET.getRange(startRow,1,lastRow,lastColumn).getValues()

  alumniData.forEach(function(row, index)
  {
    if(row[0] === statusToCheck && row[2] != '' && row[3] != '' && row[6] != '' && row[11] != '' && row[12] != '')
    {
      Logger.log("Email to disable " + row[1])
      try
      {
        suspendGoogleUser(row[1])
      }
      catch(err)
      {
        ui.alert(err.message, ui.ButtonSet.OK)
        Logger.log('Failed with error %s', err.message)
      }

      if (IS_Alumni_Google_Group_Active == true)
      {
        removeUserFromGoogleGroup(row[1], Alumni_Google_Group)
      }

      // Sets Member Status to Retired & Disabled.
      setValueToRange(Alumni_SHEET, Alumni_SHEET.getRange(index + 2, 1, 1, 1).getA1Notation(), [RETIRED_Disabled]) 
    }
  })


}

/*
function transferMembersToAlumni()
{
  transferDataFromSheetToSheet(Members_SHEET, Alumni_SHEET, ALUMNI, 2)

  var lastRow = Alumni_SHEET.getLastRow()
  var lastColumn = Alumni_SHEET.getLastColumn()
  var alumniData = Alumni_SHEET.getRange(2,1,lastRow,lastColumn).getValues()

  alumniData.forEach(function(row, index)
  {

  })
}
*/
/*
function transferAlumniToMembers()
{
  transferDataFromSheetToSheet(Alumni_SHEET, Members_SHEET, ACTIVE_AGAIN, 2)
}
*/