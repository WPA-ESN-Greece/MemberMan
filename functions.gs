//Global Variables
var ui = SpreadsheetApp.getUi()
const ss = SpreadsheetApp.getActiveSpreadsheet()
const UsersSheet = ss.getSheetByName('users')
const settingsSheet = ss.getSheetByName('Settings')
var membersSheet = ss.getSheetByName('Members')
var formResSheet = ss.getSheetByName('Form responses')
//var lastRow = UsersSheet.getLastRow()-1
//var userData = UsersSheet.getRange(2,1,lastRow,26).getValues()


// Sends Emails to new users with ESN Email, single use password and Google log in link.
function emailCredentials() {

  var member = {
    name:'',
    lastName:'',
    esnEmail:'',
    password:'',
    recoveryEmail:''
    }

  var subject = "ESN Google Account Credentials"
  

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
  var sourceRange = settingsSheet.getRange('F3:F20')

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
      .whenFormulaSatisfied('=$A2=INDIRECT("Settings!F4")') //Contacted
      .setBackground("#c9daf8")
      .setRanges([conditionaFormatRange])
      .build()

  var formatRule2 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$A2=INDIRECT("Settings!F5")') //Pending Coctact
      .setBackground("#fff2cc")
      .setRanges([conditionaFormatRange])
      .build()

  var formatRule3 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$A2=INDIRECT("Settings!F6")') //Accepted
      .setBackground("#d9ead3")
      .setRanges([conditionaFormatRange])
      .build()

  var formatRule4 = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$A2=INDIRECT("Settings!F7")') //Rejected
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

  formResSheet.getRange(1,lastColumn+1).setFormula(`={"Age";ARRAYFORMULA(IFNA(IF(F2:F<>"",YEAR(TODAY()) - Year(DATE('Recruiting Form'!F2:F*1,1,1)),""),"Error"))}`)

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
