// Creates a new form from an existing file 
function createNewRecruitmentForm() 
{
  var ui = SpreadsheetApp.getUi()
  
  // Gets the parent folder of the MemberMan Spreadsheet. 
  var parentFolderID = DriveApp.getFileById(ss.getId()).getParents().next().getId() //Spreadsheet Parent folder
  var destinationFolder = DriveApp.getFolderById(parentFolderID)

  // Creates a copy of the Join the Team Form Template to the same folder as MemberMan Spreadsheet.
  var newJoinTheTeamForm = DriveApp.getFileById(JOIN_FORM_TEMPLATE_ID).makeCopy( JOIN_FORM_NAME, destinationFolder)

  var newJoinTheTeamFormURL = newJoinTheTeamForm.getUrl()
  var newJoinTheTeamFormID = newJoinTheTeamForm.getId()
  var form = FormApp.openById(newJoinTheTeamFormID)

  form.setDestination(FormApp.DestinationType.SPREADSHEET, SpreadsheetID)
  
  SpreadsheetApp.flush();

  // Rename the Join Form Responses Sheet.
  renameFormResponsesSheet(Join_Form_Responses_Sheet_NAME)
  Join_Form_Responses_SHEET = ss.getSheetByName(Join_Form_Responses_Sheet_NAME)
  
  deleteMostBlankRows(Join_Form_Responses_SHEET)
  deleteBlankColumns(Join_Form_Responses_SHEET)
  createRecruitingStatusColumn() 
  createAgeColumn()
  formatColumnHeaders(Join_Form_Responses_SHEET)
  setTrigerForRegisteredStatus()
  replacePlaceholderInGDPRTextInForm(newJoinTheTeamFormID)

  // A pop up message to let the user know that the form is ready while providing a link.
  var formCreationMessage = HtmlService.createHtmlOutput(`<p style="font-family: 'Open Sans'">You can find your new recruiting form <a href="${newJoinTheTeamFormURL}"target="_blank">here</a>.
  Don't forget to Link the responses to this sheet from the responses tab and rename the new sheet "Form responses".</p>`).setWidth(400).setHeight(120)
  ui.showModalDialog(formCreationMessage,"Your 'Join the Team' Form is ready!")

  // A cuter pop up message on the bottom right. 
  toast("","🎉 Your Form is ready!")
}




//Creates the "Recruiting Status" as the first Column of the Form responses
function createRecruitingStatusColumn() 
{
  const Recruitment_Status_Column_Name = "Recruitment Status"
  const Recruitment_Status_Column_Name_Cell = "A1"
  const Recruitment_Status_OptionsinSettings_RANGE = "E3:E20"
 
  
  Join_Form_Responses_SHEET.insertColumnBefore(1) // Column 1 is Column A.
  Join_Form_Responses_SHEET.getRange(Recruitment_Status_Column_Name_Cell).setValue(Recruitment_Status_Column_Name)

  // Creates Dropdown with Recruitment Status Options.
  var recStatusRange = Join_Form_Responses_SHEET.getRange(Recruitment_Status_Dropdown_Options_RANGE)
  var sourceRange = Settings_SHEET.getRange(Recruitment_Status_OptionsinSettings_RANGE)

  var rule = SpreadsheetApp.newDataValidation().requireValueInRange(sourceRange).requireValueInRange(sourceRange, true).build()
  var rules = recStatusRange.getDataValidations()

  for (var i = 0; i < rules.length; i++) 
  {
    for (var j = 0; j < rules[i].length; j++) 
    {
      rules[i][j] = rule
    }
  }
  recStatusRange.setDataValidations(rules)

  Logger.log("Dropdown Recruitment Status Options has been created  in " + Join_Form_Responses_Sheet_NAME)

  // Creates condtional Formating for the Recruitment Status Options Dropdown in Join_Form_Responses_SHEET.
  setsCondtionalFormatingForJoinFormResponses()
}


function setsCondtionalFormatingForJoinFormResponses()
{
  //Sets Conditional formating rules
  var lastColumn = Join_Form_Responses_SHEET.getLastColumn()
  var lastRow = Join_Form_Responses_SHEET.getLastRow()
  var conditionaFormatRange = Join_Form_Responses_SHEET.getRange("A1:A")

  var formatRule1 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$A1=INDIRECT("Settings!E4")') //Contacted
      .setBackground("#c9daf8")
      .setRanges([conditionaFormatRange])
      .build()

  var formatRule2 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$A1=INDIRECT("Settings!E5")') //Pending Coctact
      .setBackground("#fff2cc")
      .setRanges([conditionaFormatRange])
      .build()

  var formatRule3 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$A1=INDIRECT("Settings!E6")') //Accepted
      .setBackground("#d9ead3")
      .setRanges([conditionaFormatRange])
      .build()

  var formatRule4 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$A1=INDIRECT("Settings!E7")') //Rejected
      .setBackground("#f4cccc")
      .setRanges([conditionaFormatRange])
      .build()

  var formatRule5 = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$A1=INDIRECT("Settings!E8")') //Accepted & Transferred
    .setBackground("#d9ead3")
    .setFontColor("#274e13")
    .setItalic(true)
    .setRanges([conditionaFormatRange])
    .build()

  var conditionalFormatRules = Join_Form_Responses_SHEET.getConditionalFormatRules()
  conditionalFormatRules.push(formatRule1, formatRule2, formatRule3, formatRule4, formatRule5)
  Join_Form_Responses_SHEET.setConditionalFormatRules(conditionalFormatRules)

  var recStatusRange = Join_Form_Responses_SHEET.getRange(Recruitment_Status_Dropdown_Options_RANGE)
  recStatusRange.setHorizontalAlignment("left")

  Logger.log("Condtional Formating for the Recruitment Status Options Dropdown has been created.")
}



// Creates a Column that calculates Age of a recruit in the right side of birth year column in the Join Form Responses Sheet.
function createAgeColumn() 
{
  var birthYearColumnIndex = searchForColumnNamed("Έτος Γέννησης", Join_Form_Responses_SHEET)
  var birthYearValuesRange = Join_Form_Responses_SHEET.getRange(1, birthYearColumnIndex).getA1Notation().split("1")[0] + "2:" + Join_Form_Responses_SHEET.getRange(1, birthYearColumnIndex).getA1Notation().split("1")[0]

  Join_Form_Responses_SHEET.insertColumnAfter(birthYearColumnIndex)
  Join_Form_Responses_SHEET.getRange(1, birthYearColumnIndex + 1, 1)
  .setFormula(`={"Ηλικία";ARRAYFORMULA(IF(INDIRECT("${birthYearValuesRange}")<>"",YEAR(TODAY()) - Year(DATE(INDIRECT("${birthYearValuesRange}"),1,1)),""))}`)

  Logger.log("Age column created.")
}


// Set "Registered" in the recruiting status column
function registerdStatus(e)
{
  var range = e.range
  var col = range.getColumn()
  var row = range.getRow()

  Join_Form_Responses_SHEET.getRange(row,col-1).setValue("Registered")
}

// Sets Up Registered Status Triger.
function setTrigerForRegisteredStatus()
{
  ScriptApp.newTrigger('registerdStatus')
  .forSpreadsheet(ss)
  .onFormSubmit()
  .create()
}


function replacePlaceholderInGDPRTextInForm(formID)
{
var form = FormApp.openById(formID)

 // GDPR Text
 var items = form.getItems()
 let gdprItemID = items[items.length - 1].getId()
 var gdprText = form.getItemById(gdprItemID).getHelpText()
 gdprText = gdprText.replace("{{ESN Section's Full Name}}", SECTION_FULL_NAME)
 gdprText = gdprText.replace("{{ESN Section's Name}}", SECTION_SHORT_NAME)
 gdprText = gdprText.replace("{{ESN Section's Name}}", SECTION_SHORT_NAME)
 form.getItemById(gdprItemID).setHelpText(gdprText)
}