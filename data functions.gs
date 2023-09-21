function acceptedToMembers() {

  var lastRow = formResSheet.getLastRow()
  var lastCol = formResSheet.getLastColumn()
  var range = formResSheet.getRange(2,1,lastRow,lastCol).getValues()

  var acceptedText = settingsSheet.getRange('E6').getValue()

  range.forEach(function(row,index){

    if(row[0] == acceptedText && row[2] != ''){

      var targetRow = formResSheet.getRange(index+2,1,1,lastCol).getValues()
     
      var pasteRow = targetRow[0]
      pasteRow.shift(); pasteRow.shift()


      appendRowFromTop(membersSheet,pasteRow,2,3)
      formResSheet.getRange(index+2,1).setValue(settingsSheet.getRange('E8').getValues())

        //https://www.youtube.com/watch?v=ShcdwNh7wD0 how the appending a row works
    }

  })
    toast("Accepted entries have been copied to Members Sheet.","🎉 Accepted they were!")
  }





function deleteRejected(){
  var ui = SpreadsheetApp.getUi()
  
  var buttonPressed = ui.alert("This action cannot be undone. Are you sure you want to procceed?",ui.ButtonSet.YES_NO)

  if(buttonPressed == ui.Button.NO){return}
    
  var lastRow = formResSheet.getLastRow()
  var lastCol = formResSheet.getLastColumn()
  var formData = formResSheet.getRange(2,1,lastRow,lastCol).getValues()

  var rejectText = settingsSheet.getRange('E7').getValue()

  var indexToDelete = []

  formData.forEach(function(row,index){

    if(row[0] == rejectText && row[2] != ""){
      
      //var targetRow = formResSheet.getRange(index+2,1,1,lastCol+1)
      var indexPlusTwo = index +2
      //Logger.log(indexPlusTwo)

      indexToDelete.push(indexPlusTwo)

    }

  })

  var indexToDeleteSorted = indexToDelete.sort((a,b)=>b-a)

  for(var i = 0; i < indexToDelete.length; i++){

    formResSheet.deleteRow(indexToDeleteSorted[i])

  }
  toast("..but not for the recruiter.","🎉 Rejecton hurts...")
}




function refreshData(sheet,rangeA1)
{
  spreadsheetInfo()
  var sheetName = ss.getSheetByName(sheet.getName())
  
  var range =  sheetName.getRange(String(rangeA1))
  range.setFormulas(range.getFormulas())
}

