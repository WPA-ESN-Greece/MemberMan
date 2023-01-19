function myFunction() {



}

function deleteRejected(){
  //Form Responses
  var lastRow = formResSheet.getLastRow()
  var lastCol = formResSheet.getLastColumn()
  var formData = formResSheet.getRange(2,1,lastRow,lastCol).getValues()

  var rejectText = settingsSheet.getRange('F7').getValue()

  formData.forEach(function(row,index){

    if(row[0] == "Rejected"){
    
      var targetRow = formResSheet.getRange(index+2,1,1,lastCol+1)
      
      targetRow.setValue("")

      //formResSheet.moveRows(targetRow, lastRow)

    }

})

/*
 recruitData.forEach(function(row,index){

  if(row[0] == rejectText){
    Logger.log(row[2] +" with Index: "+ index)

    formData.forEach(function(rowForm,indexForm){
      
      if(row[2] === rowForm[1] && rowForm[1] != null ) {
        var targetRow = formResSheet.getRange(indexForm+2,1,1,lastColform)
        targetRow.deleteCells(SpreadsheetApp.Dimension.COLUMNS)//.setValue("")//.setBackground("red")
        
        var targetRowRec = recruitSheet.getRange(index+2,1)
        targetRowRec.setValue("")

        //recruitSheet.deleteRow(index+2)
        Logger.log(lastRowRec)
        recruitSheet.moveRows(targetRowRec,index+2)//.moveRows(recruitData,indexForm+2)//.insertRowAfter(lastRowRec-1)

        //formResSheet.sort(1,true)
        //recruitSheet.sort(2,true)
        formResSheet.deleteRow(indexForm+2)
        Logger.log(lastRowform)
        formResSheet.moveRows(targetRow,indexForm+2)//.insertRowAfter(lastColform-1)

      }
    
    })
   }
 })*/

//Logger

}