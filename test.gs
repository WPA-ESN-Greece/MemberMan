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


function getUser(userEmail) 
{
  var userEmail = 'wpa@esngreece.gr'
  try 
  {
    const user = AdminDirectory.Users.get(userEmail)
    console.log('User data:\n %s', JSON.stringify(user, null, 2))
  } 
  catch (err) 
  {
    // TODO (developer)- Handle exception from the API
    console.log('Failed with error %s', err.message)
  }
}
// "isDelegatedAdmin": false,
//  "orgUnitPath": "/Sections/ESN TUC",
//  "isAdmin": true,

function replacePlaceholderInGDPRTextInForm123()
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
    }
    
    // repeats as many times as "{{ESN Section's Name}}" appears in GDPR text.
    for (var i = 0; i < (gdprText.match(/{{ESN Section's Name}}/g) || []).length; i++)
    {
      gdprText = gdprText.replace("{{ESN Section's Name}}", SECTION_SHORT_NAME)
    }

    // Sets the final GDPR text in the form. 
    form.getItemById(gdprItemID).setHelpText(gdprText)

    // Form Description Text
    let formDescription = form.getDescription()

    // repeats as many times as "{{Πανεπιστήμιο Σαντορίνης}}" appears in the form description text.
    for (var i = 0; i < (formDescription.match(/{{Πανεπιστήμιο Σαντορίνης}}/g) || []).length; i++)
    {
      formDescription = formDescription.replace("{{Πανεπιστήμιο Σαντορίνης}}", UNIVERSITY_NAME)
    }
    
    // Sets form final description.
    form.setDescription(formDescription)

    // Form Title Text
    form.setTitle( form.getTitle().replace("{{ESN Section's Name}}", SECTION_SHORT_NAME))
  }