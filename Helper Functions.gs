/**=========================================================================================================================================================================
 *  
 * Helper Functions
 * 
 *=========================================================================================================================================================================
 */



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

/**
 * Inserts a new row at the specified position in a Google Sheets spreadsheet
 * and populates it with data.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The Google Sheets sheet where the row will be inserted.
 * @param {number} rowDataNumber - The number of columns to populate in the new row.
 * @param {number} [rowIndex=1] - The index of the row before which the new row will be inserted. Default is 1 (top).
 * @param {number} [columnIndex=1] - The index of the column where the new row's data will start. Default is 1 (leftmost column).
 * @returns {void}
 *
 * ```javascript
 * // Example usage:
 * var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 * appendRowFromTop(sheet, 3); // Inserts a row at the top with 3 columns.
 * ```
 */
function appendRowFromTop(sheet, rowDataNumber, rowIndex, columnIndex)
{
  var index = rowIndex || 1
  var verticalIndex = columnIndex || 1
  sheet.insertRowBefore(index).getRange(index, verticalIndex, 1, rowDataNumber)
}

/**
 * Sets values to a specified range in a Google Sheets spreadsheet.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The Google Sheets sheet containing the range.
 * @param {string} range - The A1 notation of the range where values will be set (e.g., 'A1:B2').
 * @param {Array<Array<any>>} values - The 2D array of values to set in the specified range.
 * @returns {void}
 *
 * ```
 * // Example usage:
 * var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 * var range = 'A1:B2';
 * var values = [[1, 2], [3, 4]];
 * setValueToRange(sheet, range, values);
 * ```
 */
function setValueToRange(sheet, range, values)
{
  sheet.getRange(range).setValues([values])
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

/**
 * Searches for a column with a specified name in a Google Sheets spreadsheet.
 *
 * @param {string} columnName - The name of the column to search for.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The Google Sheets sheet to search within.
 * @returns {number} The index of the found column (1-based), or -1 if not found.
 *
 * ```
 * // Example usage:
 * var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 * var columnName = "Name"; // Replace with the desired column name.
 * var columnIndex = searchForColumnNamed(columnName, sheet);
 * if (columnIndex !== -1) {
 *   Logger.log("Column '" + columnName + "' found at index: " + columnIndex);
 * } else {
 *   Logger.log("Column '" + columnName + "' not found.");
 * }
 * ```
 */
function searchForColumnNamed(columnName, sheet)
{
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
  .setVerticalAlignment("middle")
  .setFontFamily("Roboto")
  .setWrap(true)

  Logger.log("Column Headers have been formated.")
}


/**
 * Links the contents of a cell in a Google Sheets spreadsheet to a specified URL
 * with custom label and formatting.
 *
 * @param {string} label - The label text that will be displayed in the linked cell.
 * @param {string} url - The URL to which the cell content will be linked.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The Google Sheets sheet containing the cell.
 * @param {string} cell - The cell address (A1 notation) where the linked content will be placed.
 * @returns {void}
 *
 * ```javascript
 * // Example usage:
 * var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 * var label = "Visit Google";
 * var url = "https://www.google.com";
 * var cell = "A1";
 * linkCellContents(label, url, sheet, cell);
 * ```
 */
function linkCellContents(label,url,sheet,cell) 
{
 var range = sheet.getRange(cell)

 var style = SpreadsheetApp.newTextStyle()
      .setItalic(false)
      .setBold(true)
      .setFontFamily("Roboto")
      .setFontSize(10)
      .setForegroundColor("#ffffff")
      .setUnderline(true)
      .build()

 var richValue = SpreadsheetApp.newRichTextValue()
 .setText(label)
 .setLinkUrl(url)
 .setTextStyle(style)
   
 range.setRichTextValue(richValue.build());
}