/**=========================================================================================================================================================================
 *  
 * Helper Functions
 * 
 * =========================================================================================================================================================================
 */

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
    ui.alert("Your Spreadsheet is all set.", ui.ButtonSet.OK)
  }
}




function toast(message, tittle, timeoutSeconds)
{
  ss.toast(message, tittle, timeoutSeconds)
}


// Renames the a Form Responses Sheet with a given new name.
function renameFormResponsesSheet(newName)
{
  var sheets = ss.getSheets().filter(sheet => sheet.getSheetName().includes("Form responses"))
  sheets[0].setName(newName)
}


function appendRowFromTop(sheet, rowData, optIndex, optColIndex)
{
  var index = optIndex || 1
  var vindex = optColIndex || 1
  sheet.insertRowBefore(index).getRange(index,vindex,1,rowData.length).setValues([rowData])
}


// Generates the 'users' sheet link in the Settings
function generateUsersLink()
{
  settingsSheet.getRange('C10').setValue(ss.getUrl()+'#gid='+UsersSheet.getSheetId())
  toast("The users sheet link is ready in the Settings.","🎉 Done!")
}


// Gets the ID of a google doc file (Doc, spredsheet, presentation, form), folder or script from its URL.

function extractDocumentIdFromUrl(url) 
{
  var parts = url.split('/')
  //Logger.log(parts[4])

  if (parts[4] == "d")
  {
    var idIndex = parts.indexOf('d') + 1
    //Logger.log(parts = url.split('/'))

    if (idIndex > 0 && idIndex < parts.length) 
    {
      //Logger.log(parts[idIndex])
      return parts[idIndex]
    } 
    else 
    {
      // If the URL doesn't contain the expected parts
      Logger.log("Invalid URL")
      return "Invalid URL"
    }
  }

  if (parts[4] == "folders" || parts[4] == "projects" )
  {
    var idIndex = 5
    //Logger.log(parts = url.split('/'))

    if (idIndex > 0 && idIndex < parts.length) 
    {
      //Logger.log(parts[idIndex])
      return parts[idIndex]
    }
    else 
    {
      // If the URL doesn't contain the expected parts
      Logger.log("Invalid URL")
      return "Invalid URL";
    }
  }

  else
  {
    Logger.log("Unknown type of URL")
    return "Unknown type of URL"
  }
}

function searchForColumnNamed(columnName, sheet)
{
  //Search for the "Completed Tasks" Colimn Index.
  //var columnName = PASSED_TASKS_COLUMN_HEADER
  var firstRowValues = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
  
  var wantedColumnIndex = findArrayIndexOfText(firstRowValues, columnName)
  return wantedColumnIndex
}

/**
 * Finds the index of the first occurrence of a specific text in an array.
 *
 * This function searches for the first occurrence of the specified text within the given array
 * and returns its index. The index is 1-based to match typical user expectations.
 *
 * @function
 * @name findArrayIndexOfText
 * @memberof module:ArrayUtils
 * @param {Array} array - The array in which to search for the text.
 * @param {string} searchText - The text to search for in the array.
 * @returns {number} The index of the first occurrence of the text in the array, or -1 if not found.
 */
function findArrayIndexOfText(array, searchText)
{
  return array.findIndex(function(cellValue)  
  {
    return cellValue === searchText;
  }) + 1; // Adding 1 to convert from 0-based index to 1-based index.
}

// Deletes empty rows below Row 101. Need to be run before creating Age column or recruitment status dropdown.
function deleteMostBlankRows(sheet)
{
  //var sheet = ss.getSheetByName(sheetName)
  var maxRow = sheet.getMaxRows()
  var lastRow = sheet.getLastRow()

  if ( maxRow - lastRow - 100 > 0)
  {
    sheet.deleteRows(lastRow + 1, maxRow - lastRow -100)
  }
  
  Logger.log("Deleted " + (maxRow - lastRow -100) + " empty rowsfrom " + sheet.getSheetName() + " sheet.")
}

// Deletes blank columns from the end of a given sheet.
function deleteBlankColumns(sheet)
{
  //var sheet = ss.getSheetByName(sheetName)
  var maxColumn = sheet.getMaxColumns()
  var lastColumn = sheet.getLastColumn()

  if (maxColumn - lastColumn > 0)
  {
    sheet.deleteColumns(lastColumn + 1, maxColumn - lastColumn)
  }
 
 Logger.log("Deleted " + (maxColumn - lastColumn) + " empty columns from " + sheet.getSheetName() + " sheet.")
}

//Formats Headers in a Form Responses Sheet
function formatColumnHeaders(sheet)
{
  var lastColumn = sheet.getLastColumn()
  
  sheet.getRange(1,1,1,lastColumn)
  .setBackground('#2e3192')
  .setFontColor('#ffffff')
  .setFontWeight("bold")
  .setHorizontalAlignment("left")
  .setVerticalAlignment("top")
  .setFontFamily("Roboto")
  .setWrap(true)

  Logger.log("Column Headers have been formated.")
}

/* NOT SURE IF I NEED THIS ANYMORE.
function setRangesInSettings()
{
  for(var i=4;i < 17;i+=2)
  {

    settingsSheet.getRange(`K${i}`)
  .setFormula(`=LEFT(ADDRESS(1,MATCH(I${i},INDIRECT("Form responses!1:1"),0),4),1)&"2:"&LEFT(ADDRESS(1,MATCH(I${i},INDIRECT("Form responses!1:1"),0),4),1)`)
  Logger.log("K"+i)
  }

}
*/