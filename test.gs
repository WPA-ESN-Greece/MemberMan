//Connect form with spreadsheet: https://developers.google.com/apps-script/reference/forms/form

function test()
{
  var formID = "141GW2p_rs5h3OtU7gJYn9FXn_JNdjmk4HuSM0FN8DSo"
  var form = FormApp.openById(formID);
  //var formResponsesSheet = SpreadsheetApp.create//.create('Form Resp test');
  //ss.insertSheet('Form Resp test', 0)
  var formResponsesSheet = ss.getId()//.getSheetByName('Form Resp test').getSheetId()
  form.setDestination(FormApp.DestinationType.SPREADSHEET, formResponsesSheet);
}

function test123()
{
  
}


