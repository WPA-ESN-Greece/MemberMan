function addCandidateToGoogleWorkspace()
{
  var lastRow = formResSheet.getLastRow()
  var lastCol = formResSheet.getLastColumn()
  var range = formResSheet.getRange(2,1,lastRow,lastCol).getValues()

  var candidateText = settingsSheet.getRange('G3').getValue()
  var addToWorkspace = settingsSheet.getRange("C15").getValue() 

  range.forEach(function(row,index)
  {

    if(row[0] == candidateText && row[2] != '' && addToWorkspace === true){

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
