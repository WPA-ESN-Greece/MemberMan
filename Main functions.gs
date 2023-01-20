//Global Variables
var DOCUMENTATION_LINK = 'https://docs.google.com/document/d/1uQ3Sp9LvT8ORnd1uxYykX4FRxvCn1vkn30Z0HKTUbPA/edit?usp=sharing'
//var ui = SpreadsheetApp.getUi()
const ss = SpreadsheetApp.getActiveSpreadsheet()
const UsersSheet = ss.getSheetByName('users')
const settingsSheet = ss.getSheetByName('Settings')
var membersSheet = ss.getSheetByName('Members')
var formResSheet = ss.getSheetByName('Form responses')
var FORM_ID = settingsSheet.getRange('C3').getValue()
//var lastRow = UsersSheet.getLastRow()-1
//var userData = UsersSheet.getRange(2,1,lastRow,26).getValues()
var PARENT_FOLDER = ""

// Sends Emails to new users with ESN Email, single use password and Google log in link.
function emailCredentials() {

  var member = {
    name:'',
    lastName:'',
    esnEmail:'',
    password:'',
    recoveryEmail:''
    }

  var subject = "Your New ESN Google Account Credentials"

  //Data Loop
  userData.forEach(function (row) {
  
  if(row[2] == "" && row[3] == ""){return} //Checks if there is an email address in each row.

   member.name = row[0];
   member.lastName = row[1];
   member.esnEmail = row[2];
   member.password = row[3];
   member.recoveryEmail = row[7];
  

  var message = 
    `<h2>Your New ESN Google Account is Ready!</h2>`+
    `<p><b>ESN Email Address: </b> ${member.esnEmail}</p>` +
    `<p><b>Single-Use Password: </b> ${member.password}</p>`+
    `<p><i>After the first sign in to your new Google Account, you will be asked to change the password above with one only you will know.
     You can sign in <a href="shorturl.at/erBX3">here</a>.</i></p>`

      
  MailApp.sendEmail(
    {
            to: member.recoveryEmail,
            cc: "",
            subject: subject,
            htmlBody: message,
    }
  )})

}

// Generates the 'users' sheet link in the Settings
function generateUsersLink(){

  settingsSheet.getRange('C10').setValue(ss.getUrl()+'#gid='+UsersSheet.getSheetId())
}


//Creates the "Recruiting Status" as the first Column of the Form responses
function createRecruitingStatusCol() {

  formResSheet.insertColumnBefore(1)
  formResSheet.getRange('A1').setValue('Status')

  var recStatusRange = formResSheet.getRange('A2:A')
  var sourceRange = settingsSheet.getRange('E3:E20')

  var rule = SpreadsheetApp.newDataValidation().requireValueInRange(sourceRange).requireValueInRange(sourceRange, true).build()
  var rules = recStatusRange.getDataValidations()

  for (var i = 0; i < rules.length; i++) {
    for (var j = 0; j < rules[i].length; j++) {
    rules[i][j] = rule}
  }
  recStatusRange.setDataValidations(rules)
  

  //Sets Conditional formating rules
  var statusRangeLC = formResSheet.getLastColumn()
  var statusRangeLR = formResSheet.getLastRow()
  var conditionaFormatRange = formResSheet.getRange(2,1,statusRangeLR-1+1000,statusRangeLC)


  var formatRule1 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$A2=INDIRECT("Settings!E4")') //Contacted
      .setBackground("#c9daf8")
      .setRanges([conditionaFormatRange])
      .build()

  var formatRule2 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$A2=INDIRECT("Settings!E5")') //Pending Coctact
      .setBackground("#fff2cc")
      .setRanges([conditionaFormatRange])
      .build()

  var formatRule3 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$A2=INDIRECT("Settings!E6")') //Accepted
      .setBackground("#d9ead3")
      .setRanges([conditionaFormatRange])
      .build()

  var formatRule4 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$A2=INDIRECT("Settings!E7")') //Rejected
      .setBackground("#f4cccc")
      .setRanges([conditionaFormatRange])
      .build()



  var conditionalFormatRules = formResSheet.getConditionalFormatRules()
  conditionalFormatRules.push(formatRule1, formatRule2, formatRule3, formatRule4)
  formResSheet.setConditionalFormatRules(conditionalFormatRules)

  recStatusRange.setHorizontalAlignment("left")
}


function createAgeCol() {
  var lastColumn = formResSheet.getLastColumn()
  formResSheet.insertColumnAfter(lastColumn)

  formResSheet.getRange(1,lastColumn+1).setFormula(`={"Age";ARRAYFORMULA(IFNA(IF(F2:F<>"",YEAR(TODAY()) - Year(DATE(F2:F*1,1,1)),""),"Error"))}`)

  var a1AgeRange = formResSheet.getRange(1,lastColumn+1,formResSheet.getLastRow()).getA1Notation()
  formResSheet.getRange(a1AgeRange).setHorizontalAlignment("center")
}


//Formats Headers in Form Responses Sheet
function formatHeaders(){

var lastColumn = formResSheet.getLastColumn()
formResSheet.getRange(1,1,1,lastColumn)
.setBackground('#2e3192')
.setFontColor('#ffffff')
.setFontWeight("bold")
.setHorizontalAlignment("center")
.setFontFamily("Roboto")
.setWrap(true)
}

// Creates a new form from an existing file 
function createNewRecruitmentForm() {
  var ui = SpreadsheetApp.getUi()

  var parentFolderID = DriveApp.getFileById(ss.getId()).getParents().next().getId() //Spreadsheet Parent folder
  var destinationFolder = DriveApp.getFolderById(parentFolderID)
  var recruitForm = DriveApp.getFileById(FORM_ID).makeCopy("🦸‍♂️ MemberMan(agement) Form", destinationFolder)
  var formUrl = recruitForm.getUrl()
  //var recruitFormID = recruitForm.getId()

  var formCreationMessage = HtmlService.createHtmlOutput(`<p style="font-family: 'Open Sans'">You can find your new recruiting form <a href="${formUrl+"edit#responses"}"target="_blank">here</a>.
  Don't forget to Link the responses to this sheet from the responses tab and rename the new sheet "Form responses".</p>`).setWidth(400).setHeight(60)

  SpreadsheetApp.getUi().showModalDialog(formCreationMessage,"Your Form is ready!")

  PARENT_FOLDER = parentFolderID
}


function renameFormResponses(){

  var searchText = "Form responses"
  var sheets = ss.getSheets()
  var sheet = sheets.filter(s => s.getSheetName().includes(searchText))
  if (sheet.length > 0){sheet[0].setName("Form responses")}

}



function deleteBlankColumns(){

  var maxColumn = formResSheet.getMaxColumns()
  var lastColumn = formResSheet.getLastColumn()

  formResSheet.deleteColumns(lastColumn+1, maxColumn-lastColumn)

}

function deleteMostBlankRows(){

  var maxRow = formResSheet.getMaxRows()
  var lastRow = formResSheet.getLastRow()

  formResSheet.deleteRows(lastRow+1, maxRow-lastRow -100)

}