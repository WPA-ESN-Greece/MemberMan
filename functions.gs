

const ss = SpreadsheetApp.getActiveSpreadsheet()
const UsersSheet = ss.getSheetByName('users')
const settingsSheet = ss.getSheetByName('Settings')
var lastRow = UsersSheet.getLastRow()-1
const RawData = UsersSheet.getRange(2,1,lastRow,26).getValues()
//const userSheeturl = UsersSheet.getUrl()
//settingsSheet.getRange('C10').setValue(userSheeturl)


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
  RawData.forEach(function (row, index) {
  
  if(row[2] == "" && row[3] == ""){return} //Checks if there is an email address in each row.

   member.name = row[0];
   member.lastName = row[1];
   member.esnEmail = row[2];
   member.password = row[3];
   member.recoveryEmail = row[7];


 //var temp = HtmlService.createTemplateFromFile('email')
  

  var message = 
    `<h2>Your New ESN Google Account is Ready!</h2>`+
    `<p><b>ESN Email Address: </b> ${member.esnEmail}</p>` +
    `<p><b>Single-Use Password: </b> ${member.password}</p>`+
    `<p><i>After the first sign in to your new Google Account, you will be asked to change the password above with one only you will know.
     You can sign in <a href="shorturl.at/erBX3">here</a>.</i></p>`;

 //var message = temp.evaluate().getContent()

      

  MailApp.sendEmail(
    {
            to: member.recoveryEmail,
            cc: "",
            subject: subject,
            htmlBody: message,
    }
  )})

}


function generateUsersLink(){

  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings').getRange('C10').setValue(SpreadsheetApp.getActiveSpreadsheet().getUrl()+'#gid='+SpreadsheetApp.getActiveSpreadsheet().getSheetByName('users').getSheetId())
}