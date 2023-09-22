/**=========================================================================================================================================================================
 *  
 * Members - Alumni Sheets Functions.
 * 
 * =========================================================================================================================================================================
 */

function transferBetweenMembers_Alumni(e)
{
  var editedrange = e.range
  var column = editedrange.getColumn()
  var row = editedrange.getRow()
  var editedCellValue = editedrange.getValue()
  var sourceSheetName = e.source.getActiveSheet().getSheetName()

  if (sourceSheetName === Members_Sheet_NAME && column === 1 && row >= 2 && editedCellValue === ALUMNI)
  {
    var data = Members_SHEET.getRange( row, 1, 1, Members_SHEET.getLastColumn()).getValues()
    
    Members_SHEET.hideColumn(Members_SHEET.getRange(Query_Formula_Column_Members))
    Alumni_SHEET.hideColumn(Alumni_SHEET.getRange(Query_Formula_Column_Alumni))  
    
    appendRowFromTop(Alumni_SHEET, data[0].length, 2)
    
    setValueToRange(Alumni_SHEET, Alumni_SHEET.getRange(2, 1, 1, Alumni_SHEET.getLastColumn()).getA1Notation(), data[0])
    Members_SHEET.deleteRow(row)
  }
  else if (sourceSheetName === Alumni_Sheet_NAME && column === 1 && row >= 2 && editedCellValue === ACTIVE_AGAIN)
  {
    var data = Alumni_SHEET.getRange( row, 1, 1, Alumni_SHEET.getLastColumn()).getValues()
    
    Members_SHEET.hideColumn(Members_SHEET.getRange(Query_Formula_Column_Members))
    Alumni_SHEET.hideColumn(Alumni_SHEET.getRange(Query_Formula_Column_Alumni))  
    
    appendRowFromTop(Members_SHEET, data[0].length, 2)
    
    setValueToRange(Members_SHEET, Members_SHEET.getRange(2, 1, 1, Members_SHEET.getLastColumn()).getA1Notation(), data[0])
    Alumni_SHEET.deleteRow(row)
  }


}

