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


function appendRowFromTop(sheet, rowData, optIndex, optColIndex){
    
  var index = optIndex || 1
  var vindex = optColIndex || 1
  sheet.insertRowBefore(index).getRange(index,vindex,1,rowData.length).setValues([rowData])

}



//var rowCount = 0
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


// Set "Registered" in the recruiting status column
function registerdStatus(e){

  var range = e.range
  var col = range.getColumn()
  var row = range.getRow()

  formResSheet.getRange(row,col-1).setValue("Registered")

}

/*function refreshDataSettings()
{
  spreadsheetInfo()

  var range = settingsSheet.getRange('J4:K16')
  range.setFormulas(myRange.getFormulas())
}

function refreshDataMembers()
{
  spreadsheetInfo()

  var range =     sheetName = membersSheet.getName()
.getRange('J4:K16')
  range.setFormulas(myRange.getFormulas())
}*/

function refreshData(sheet) {
  
  var sheetName = sheet.getName()

  switch(sheetName){

    case 0:
    sheetName = formResSheet.getName()
    break
    case 1:
    sheetName = settingsSheet.getName()
    var range = settingsSheet.getRange('J4:K16')
    range.setFormulas(range.getFormulas())
    break
    case 2:
    sheetName = membersSheet.getName()
    var range = settingsSheet.getRange('B1:C1')
    range.setFormulas(range.getFormulas())
    break

  }
  //var myRange = settingsSheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn())

  //myRange.setFormulas(myRange.getFormulas())
}