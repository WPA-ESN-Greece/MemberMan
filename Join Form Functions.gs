// Creates a new form from an existing file 
function createNewRecruitmentForm() 
{
  var ui = SpreadsheetApp.getUi()

  const Query_Formula_Column_Members = "Q1"
  const JoinForm_Studies_Column = "L1"
  
  // Gets the parent folder of the MemberMan Spreadsheet. 
  var parentFolderID = DriveApp.getFileById(ss.getId()).getParents().next().getId() //Spreadsheet Parent folder
  var destinationFolder = DriveApp.getFolderById(parentFolderID)

  // Creates a copy of the Join the Team Form Template to the same folder as MemberMan Spreadsheet.
  let newJoinTheTeamForm = DriveApp.getFileById(JOIN_FORM_TEMPLATE_ID).makeCopy( JOIN_FORM_NAME, destinationFolder)

  let newJoinTheTeamFormURL = newJoinTheTeamForm.getUrl()
  let newJoinTheTeamFormID = newJoinTheTeamForm.getId()
  var form = FormApp.openById(newJoinTheTeamFormID)

  form.setDestination(FormApp.DestinationType.SPREADSHEET, SpreadsheetID)
  
  SpreadsheetApp.flush()

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

  // Sets a Query formula at "Query_Formula_Column_Members" cell in Members sheet to automatically get the form questions from the Join Form sheet.
  let joinFormResponsesLastColumnA1Notation = Join_Form_Responses_SHEET.getRange(10, Join_Form_Responses_SHEET.getLastColumn(), 1).getA1Notation().slice(0,2)
  Members_SHEET.getRange(Query_Formula_Column_Members).setFormula(`={"Tempalte Column",QUERY(INDIRECT("'${Join_Form_Responses_Sheet_NAME}'!${JoinForm_Studies_Column}:${joinFormResponsesLastColumnA1Notation}1"),"SELECT *")}`)
  Members_SHEET.hideColumn(Query_Formula_Column_Members)

  // A pop up message to let the user know that the form is ready while providing a link.
  let joinFormCreationMessage = HtmlService.createHtmlOutput(`<p style="font-family: 'Open Sans'">You can find your new recruiting form <a href="${newJoinTheTeamFormURL}"target="_blank">here</a>.
  Don't forget to Link the responses to this sheet from the responses tab and rename the new sheet "Form responses".</p>`).setWidth(400).setHeight(120)
  ui.showModalDialog(joinFormCreationMessage,"Your 'Join the Team' Form is ready!")

  // Sets the is Join Form Created cell in the Settings Sheet to TRUE.
  Settings_SHEET.getRange(IS_JoinForm_Created_CELL).setValue(true)

  // A cuter pop up message on the bottom right. 
  toast("","🎉 Your Form is ready!")

  SpreadsheetApp.flush()
}




//Creates the "Recruiting Status" as the first Column of the Form responses
function createRecruitingStatusColumn() 
{
  const Recruitment_Status_Column_Name = "Recruitment Status"
  const Recruitment_Status_Column_Name_Cell = "A1"
  
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
  let conditionaFormatRange = Join_Form_Responses_SHEET.getRange(1, 1, lastRow, lastColumn)

  let formatRule0 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied("=$"+`A1=INDIRECT("Settings!${CANDIDATE_MEMBER_CELL}")`) //Candidate Member
      .setBackground("#d9d2e9")
      .setFontColor("#351c75")
      .setRanges([conditionaFormatRange])
      .build()

  let formatRule1 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied("=$"+`A1=INDIRECT("Settings!${CONTACTED_CELL}")`) //Contacted
      .setBackground("#c9daf8")
      .setFontColor("#1155cc")
      .setRanges([conditionaFormatRange])
      .build()

  let formatRule2 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$'+`A1=INDIRECT("Settings!${PENDING_CONTACT_CELL}")`) //Pending Coctact
      .setBackground("#fff2cc")
      .setFontColor("#bf9000")
      .setRanges([conditionaFormatRange])
      .build()

  let formatRule3 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$'+`A1=INDIRECT("Settings!${ACCEPTED_CELL}")`) //Accepted
      .setBackground("#d9ead3")
      .setFontColor("#38761d")
      .setRanges([conditionaFormatRange])
      .build()

  let formatRule4 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$'+`A1=INDIRECT("Settings!${REJECTED_CELL}")`) //Rejected
      .setBackground("#f4cccc")
      .setFontColor("#990000")
      .setItalic(true)
      .setRanges([conditionaFormatRange])
      .build()

  let formatRule5 = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$'+`A1=INDIRECT("Settings!${ACCEPTED_TRANSFERRED_CELL}")`) //Accepted & Transferred
    .setBackground("#d9ead3")
    .setFontColor("#38761d")
    .setItalic(true)
    .setRanges([conditionaFormatRange])
    .build()

  let conditionalFormatRules = Join_Form_Responses_SHEET.getConditionalFormatRules()
  conditionalFormatRules.push(formatRule0, formatRule1, formatRule2, formatRule3, formatRule4, formatRule5)
  Join_Form_Responses_SHEET.setConditionalFormatRules(conditionalFormatRules)

  Join_Form_Responses_SHEET.getRange(Recruitment_Status_Dropdown_Options_RANGE).setHorizontalAlignment("left")

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

  Join_Form_Responses_SHEET.getRange(row,col-1).setValue(REGISTERED)
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

  // Join Form Description Text
  let joinFormDescription = form.getDescription()
  joinFormDescription = joinFormDescription.replace("{{Πανεπιστήμιο Σαντορίνης}}", UNIVERSITY_NAME)
  oinFormDescription = joinFormDescription.replace("{{Πανεπιστήμιο Σαντορίνης}}", UNIVERSITY_NAME)
  form.setDescription(joinFormDescription)

  // Join Form Title Text
  form.setTitle( form.getTitle().replace("{{ESN Section's Name}}", SECTION_SHORT_NAME))
}



/*****************************************************************************************************************************
 * 
 * Accepted to Members Function.
 * 
 * @see https://www.youtube.com/watch?v=ShcdwNh7wD0 how the appending a row works
 * 
 ****************************************************************************************************************************/


function acceptedFromJoinformToMembers() 
{
  var lastRow = Join_Form_Responses_SHEET.getLastRow()
  var lastColumn = Join_Form_Responses_SHEET.getLastColumn()
  var range = Join_Form_Responses_SHEET.getRange(2,1,lastRow,lastColumn).getValues()

  var acceptedText = Settings_SHEET.getRange(ACCEPTED_CELL).getValue()

  range.forEach(function(row, index)
  {
    if(row[0] === acceptedText && row[2] != '' && row[3] != '' && row[4] != '' && row[5] != '' && row[6] != '' && row[7] != '')
    {
      var targetRow = Join_Form_Responses_SHEET.getRange(index + 2, 1, 1, lastColumn).getValues()
     
      Logger.log(targetRow)

      var pasteRow = targetRow[0]
      // Removes Recruitement Status and Timestamp from the data that's going to be copied to Members Sheet.
      pasteRow.shift(); pasteRow.shift()

      let primaryMemberData = pasteRow.slice(0, 9) //0,7
      let secondaryMemberData = pasteRow.slice(9, pasteRow.length) //9, pasteRow.length

      // Copies Values, all the form questions after the studies, from Join Form Responses to Members Sheet.
      appendRowFromTop(Members_SHEET, pasteRow.length + 1, 2, 3)
      Members_SHEET.getRange(2, searchForColumnNamed("🔰", Members_SHEET) + 2, 1, secondaryMemberData.length).setValues([secondaryMemberData])

      // Copies Values, From First Name till Studies, from Join Form Responses to Members Sheet.
      setValueToRange(Members_SHEET, "C2:I2", primaryMemberData) // From First Name till Studies.

      // Create ESN Email Address and sets value of ESN email to the Members Sheet.
      var firstname = primaryMemberData[0]
      var lastname = primaryMemberData[1]
      setValueToRange(Members_SHEET, "B2", [createESNemailAddress(firstname, lastname)])

      // Creates and sets Became a member date.
      setValueToRange(Members_SHEET, "J2", [Utilities.formatDate(new Date(), TIMEZONE, "dd/MM/yyyy")])

      // Sets Member Status to Create Google Account.
      setValueToRange(Members_SHEET, "A2", [CREATE_GOOGLE_ACCOUNT])

      // Sets Recruitment Status to Accepted & Transferred.
      setValueToRange(Join_Form_Responses_SHEET, "A2", [ACCEPTED_TRANSFERRED])
    }
  })
    toast("Accepted entries have been copied to Members Sheet.","🎉 Accepted they were!")
  }

  function createESNemailAddress(firstName, lastName)
  {
    //var firstName = "Onomas" //for testing
    //var lastName = "Epithetos" //for testing

    // If you want the full first name use firstName.slice(0,firstName.length) in the first part.
    var esnEmail = String(firstName.slice(0,1)).toLowerCase() + String(lastName).toLowerCase() + "@" + SECTION_EMAIL_DOMAIN
    
    return esnEmail
  }


/**
 * Deletes rows of rejected recruits from Join Form Sheet based on their Recruitment Status. If it is "Rejected", it's going to delete them.
 * Prompts the user for confirmation before proceeding with the deletion.
 *
 * @returns {void}
 */
function deleteRejectedRecruits()
{
  var ui = SpreadsheetApp.getUi()
  var indexToDelete = []

  var buttonPressed = ui.alert("You are about to delete rejected recruits. Are you sure you want to procceed?", ui.ButtonSet.YES_NO)

  if(buttonPressed === ui.Button.NO){return}
    
  var lastRow = Join_Form_Responses_SHEET.getLastRow()
  var lastCol = Join_Form_Responses_SHEET.getLastColumn()
  var joinFormData = Join_Form_Responses_SHEET.getRange(2, 1, lastRow - 2, lastCol).getValues()
  Logger.log(joinFormData)

  joinFormData.forEach(function(row,index)
  {
    if(row[0] === REJECTED && row[2] != "" && row[3] != "" && row[6] != "")
    {
      var indexPlusTwo = index + 2
      indexToDelete.push(indexPlusTwo)
    }
  })

  let indexToDeleteSorted = indexToDelete.sort((a,b) => b - a)

  for(var i = 0; i < indexToDelete.length; i++)
  {
    Join_Form_Responses_SHEET.deleteRow(indexToDeleteSorted[i])
  }

  toast("..but not for the recruiter.","🎉 Rejecton hurts...")
}