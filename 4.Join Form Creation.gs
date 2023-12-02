/*
/
/ Creates and formats "Join the Team" form.
/
/
/
*/

// Creates a new form from an existing file 
function createNewRecruitmentForm(_SECTION_SHORT_NAME, _UNIVERSITY_NAME, _SECTION_FULL_NAME) 
{
  var ui = SpreadsheetApp.getUi()
  
  // Gets the parent folder of the MemberMan Spreadsheet. 
  var parentFolderID = DriveApp.getFileById(ss.getId()).getParents().next().getId() //Spreadsheet Parent folder
  var destinationFolder = DriveApp.getFolderById(parentFolderID)

  // Creates a copy of the Join the Team Form Template to the same folder as MemberMan Spreadsheet.
  let newJoinTheTeamForm = DriveApp.getFileById(JOIN_FORM_TEMPLATE_ID).makeCopy( JOIN_FORM_NAME, destinationFolder)

  let newJoinTheTeamFormURL = newJoinTheTeamForm.getUrl()
  let newJoinTheTeamFormID = newJoinTheTeamForm.getId()
  var form = FormApp.openById(newJoinTheTeamFormID)

  form.setDestination(FormApp.DestinationType.SPREADSHEET, SpreadsheetID)

  // Sets the Join Form URL in the Settings Sheet.
  linkCellContents(JOIN_FORM_NAME, newJoinTheTeamFormURL, Settings_SHEET, JoinForm_LINK_CELL)
  
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

  SpreadsheetApp.flush()

  // Replaces Placeholder texts based on given Section's info in the new Join the Team Form.
    var joinForm = FormApp.openById(newJoinTheTeamFormID)

    // Join Form Title Text. 
    joinForm.setTitle( joinForm.getTitle().replace("{{ESN Section's Name}}", _SECTION_SHORT_NAME))

    // Form Description Text
    let joinFormDescription = joinForm.getDescription()

    // Does the text replacements.
    //joinFormDescription = joinFormDescription.replace("{{University Name}}", _UNIVERSITY_NAME)
    //joinFormDescription = joinFormDescription.replace("{{University Name}}", _UNIVERSITY_NAME)
    
    // Sets form final description.
    joinForm.setDescription(joinFormDescription)

    // GDPR Text
    var items = joinForm.getItems()
    let gdprItemID = items[items.length - 1].getId()
    let joinFormgdprText = joinForm.getItemById(gdprItemID).getHelpText()

    //joinFormgdprText = joinFormgdprText.replace("{{ESN Section Full Legal Name}}", _SECTION_FULL_NAME)

    //joinFormgdprText = joinFormgdprText.replace("{{ESN Section's Name}}", _SECTION_SHORT_NAME)
    //joinFormgdprText = joinFormgdprText.replace("{{ESN Section's Name}}", _SECTION_SHORT_NAME)

    // Sets form final gdpr text.
    joinForm.getItemById(gdprItemID).setHelpText(joinFormgdprText)

  
  toast("","Join The Team Form has been customized for your Section")

  // Sets a Query formula at "Query_Formula_Column_Members" cell in Members sheet to automatically get the form questions from the Join Form sheet.
  let joinFormResponsesLastColumnA1Notation = Join_Form_Responses_SHEET.getRange(10, Join_Form_Responses_SHEET.getLastColumn(), 1).getA1Notation().slice(0,2)
  Members_SHEET.getRange(Query_Formula_Column_Members).setFormula(`={"Tempalte Column",QUERY(INDIRECT("'${Join_Form_Responses_Sheet_NAME}'!${JoinForm_Studies_Column}:${joinFormResponsesLastColumnA1Notation}1"),"SELECT *")}`)
  Members_SHEET.hideColumn(Members_SHEET.getRange(Query_Formula_Column_Members))

  // Sets a Query formula at "Query_Formula_Column_Alumni" cell in Alumni sheet to automatically get the form questions from the Join Form sheet.
  Alumni_SHEET.getRange(Query_Formula_Column_Alumni).setFormula(`={"Tempalte Column",QUERY(INDIRECT("'${Join_Form_Responses_Sheet_NAME}'!${JoinForm_Studies_Column}:${joinFormResponsesLastColumnA1Notation}1"),"SELECT *")}`)
  Alumni_SHEET.hideColumn(Alumni_SHEET.getRange(Query_Formula_Column_Alumni))  

  // Sets the is Join Form Created cell in the Settings Sheet to TRUE.
  Settings_SHEET.getRange(IS_JoinForm_Created_CELL).setValue(true)

  // A cuter pop up message on the bottom right. 
  toast("","🎉 Your Join the Team Form is ready!")

  SpreadsheetApp.flush()
}


// Functions used for the creation of Join The Team Form.
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
    var lastRow = Join_Form_Responses_SHEET.getMaxRows()
    let conditionaFormatRange = Join_Form_Responses_SHEET.getRange(1, 1, lastRow, lastColumn)

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
      .whenFormulaSatisfied('=$'+`A1=INDIRECT("Settings!${TRANSFERRED_CELL}")`) //Accepted & Transferred
      .setBackground("#d9ead3")
      .setFontColor("#38761d")
      .setItalic(true)
      .setRanges([conditionaFormatRange])
      .build()

    let formatRule6 = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied("=$"+`A1=INDIRECT("Settings!${CANDIDATE_MEMBER_CELL}")`) //Candidate Member
    .setBackground("#d9d2e9")
    .setFontColor("#351c75")
    .setRanges([conditionaFormatRange])
    .build()

    let conditionalFormatRules = Join_Form_Responses_SHEET.getConditionalFormatRules()
    conditionalFormatRules.push(formatRule1, formatRule2, formatRule3, formatRule4, formatRule5, formatRule6)
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

  function replacePlaceholderTextInForm(formID)
  {
    var form = FormApp.openById(formID)

    // GDPR Text
    var items = form.getItems()
    let gdprItemID = items[items.length - 1].getId()
    var gdprText = form.getItemById(gdprItemID).getHelpText()

    // repeats as many times as "{{ESN Section's Full Name}}" appears in GDPR text.
    for (var i = 0; i < (gdprText.match(/{{ESN Section's Full Name}}/g) || []).length; i++)
    {
      gdprText = gdprText.replace("{{ESN Section's Full Name}}", SECTION_FULL_NAME)
      Logger.log((gdprText.match(/{{ESN Section's Full Name}}/g) || []).length + " {{ESN Section's Full Name}}/GDPR")

      form.getItemById(gdprItemID).setHelpText(gdprText)
    }
    
    // repeats as many times as "{{ESN Section's Name}}" appears in GDPR text.
    for (var i = 0; i < (gdprText.match(/{{ESN Section's Name}}/g) || []).length; i++)
    {     
      gdprText = gdprText.replace("{{ESN Section's Name}}", SECTION_SHORT_NAME)
      Logger.log((gdprText.match(/{{ESN Section's Name}}/g) || []).length + " {{ESN Section's Name}}/GDPR")

      form.getItemById(gdprItemID).setHelpText(gdprText)
    }

    // Sets the final GDPR text in the form. 
    form.getItemById(gdprItemID).setHelpText(gdprText)

    // Form Description Text
    let formDescription = form.getDescription()

    // repeats as many times as "{{University Name}}" appears in the form description text.
    for (var i = 0; i < (formDescription.match(/{{University Name}}/g) || []).length; i++)
    {
      formDescription = formDescription.replace("{{University Name}}", UNIVERSITY_NAME)
      Logger.log((formDescription.match(/{{University Name}}/g) || []).length + " {{University Name}}/Description")

      form.setDescription(formDescription)
    }
    
    // Sets form final description.
    form.setDescription(formDescription)

    // Form Title Text
    form.setTitle( form.getTitle().replace("{{ESN Section's Name}}", SECTION_SHORT_NAME))
  }

