










// Sends Emails to new users with ESN Email, single use password and Google log in link.
function emailCredentials() 
{
  spreadsheetInfo()

  var lastRow = UsersSheet.getLastRow()-1
  var userData = UsersSheet.getRange(2,1,lastRow,26).getValues()

  var member = {
    name:'',
    lastName:'',
    esnEmail:'',
    password:'',
    recoveryEmail:''
    }

  var esnMail = ""
  var esnMailPassword = ""
  var subject = "Your New ESN Google Account Credentials"

  //Data Loop
  userData.forEach(function (row) {
  
  if(row[2] == "" && row[3] == ""){return} //Checks if there is an email address in each row.

   member.name = row[0];
   member.lastName = row[1];
   esnMail = row[2];
   esnMailPassword = row[3];
   member.recoveryEmail = row[7];
  
  /*
  var message = 
    `<h2>Your New ESN Google Account is Ready!</h2>`+
    `<p><b>ESN Email Address: </b> ${member.esnEmail}</p>` +
    `<p><b>Single-Use Password: </b> ${member.password}</p>`+
    `<p><i>After the first sign in to your new Google Account, you will be asked to change the password above with one only you will know.
     You can sign in <a href="shorturl.at/erBX3">here</a>.</i></p>`*/


  var htmlTemplate = HtmlService.createTemplateFromFile("email_template")
  htmlTemplate.esnMail = row[2]
  htmlTemplate.esnMailPassword = row[3]

  var message = htmlTemplate.evaluate().getContent()

  MailApp.sendEmail(
    {
            to: member.recoveryEmail,
            cc: "",
            subject: subject,
            htmlBody: message,
    }
  )})

toast("Now the new ESNers can log in to Google.","🎉 Emails sent")
}



