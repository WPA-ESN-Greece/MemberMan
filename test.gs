//Connect form with spreadsheet: https://developers.google.com/apps-script/reference/forms/form
/*
function test()
{
  var formID = "141GW2p_rs5h3OtU7gJYn9FXn_JNdjmk4HuSM0FN8DSo"
  var form = FormApp.openById(formID);
  //var formResponsesSheet = SpreadsheetApp.create//.create('Form Resp test');
  //ss.insertSheet('Form Resp test', 0)
  var formResponsesSheet = ss.getId()//.getSheetByName('Form Resp test').getSheetId()
  form.setDestination(FormApp.DestinationType.SPREADSHEET, formResponsesSheet);
}
*/

function test123()
{
  //deleteMostBlankRows(Alumni_SHEET)
  
  var log =
  Members_SHEET.getRange(2, 3, 1, searchForColumnNamed("Τμήμα Φοίτησης", Members_SHEET) - 2).getA1Notation() //Alumni_SHEET.getRange(2, 1, 1, Alumni_SHEET.getLastColumn()).getA1Notation()

  Logger.log(log)
}

function test543()
{
  var emails = SECTION_EMAIL_Admin
  var currentUser = Session.getActiveUser().getEmail()
  emails = emails.split().join()

  var isAdmin = emails.includes(currentUser)
  
  Logger.log("emails: " + emails)

  Logger.log("isAdmin: " + isAdmin)
}


function getUser() {
  // TODO (developer) - Replace userEmail value with yours
  const userEmail = 'main-auditor@esngreece.gr';
  try {
    const user = AdminDirectory.Users.get(userEmail);
    console.log('User data:\n %s', JSON.stringify(user, null, 2));
  } catch (err) {
    // TODO (developer)- Handle exception from the API
    console.log('Failed with error %s', err.message);
  }
}

function del()
{
  removeUserFromGoogleGroup("tuser1@esngreece.gr", Members_Google_Group)
}

function createNewUser123()
{
          
  insertNewGoogleUser("ESN Mykonos", "testis@esngreece.gr", "Testis" + "@esn", "Testis", "Useropoulos", "inikolarakis+test@tuc.esngreece.gr", "+306985856489", "/Test") 
}