function acceptedToMembers() {

  var lastRow = formResSheet.getLastRow()
  var lastCol = formResSheet.getLastColumn()
  var range = formResSheet.getRange(2,1,lastRow,lastCol).getValues()


  //var membersSheet2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Copy of Members 2')
  var acceptedText = settingsSheet.getRange('E6').getValue()

  range.forEach(function(row,index){

    if(row[0] == acceptedText && row[1] != ''){

      var targetRow = formResSheet.getRange(index+2,1,1,lastCol).getValues()
     
      var pasteRow = targetRow[0]
      pasteRow.shift(); pasteRow.shift()


      appendRowFromTop(membersSheet,pasteRow,2,3)
      formResSheet.getRange(index+2,1).setValue(settingsSheet.getRange('E8').getValues())

        //https://www.youtube.com/watch?v=ShcdwNh7wD0 how the appending a row works
    }

  })

  }


function appendRowFromTop(sheet, rowData, optIndex, optColIndex){
    
  var index = optIndex || 1
  var vindex = optColIndex || 1
  sheet.insertRowBefore(index).getRange(index,vindex,1,rowData.length).setValues([rowData])

}


function deleteRejected(){
  //Form Responses
  var lastRow = formResSheet.getLastRow()
  var lastCol = formResSheet.getLastColumn()
  var formData = formResSheet.getRange(2,1,lastRow,lastCol).getValues()

  var rejectText = settingsSheet.getRange('E7').getValue()

  formData.forEach(function(row,index){

    if(row[0] == rejectText){
    
      var targetRow = formResSheet.getRange(index+2,1,1,lastCol+1)
      
      targetRow.setValue("")

      formResSheet.moveRows(targetRow, lastRow)

    }

  })
}