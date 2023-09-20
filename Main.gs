/**
 * @OnlyCurrentDoc
 */


function onOpen(e)
{
  //Custom Menu Item. On Add-on menu. Accessed from the 🧩 icon in the top right of the Google Form UI. 
  FormApp.getUi().createAddonMenu().addItem('🌌 Set-Up','setUpTriggers').addToUi()
}


function onFormSubmit(e)
{
  let responses = e.response
  
  // If all questions are required, getItemResponses returns responses in form-order
  let itemResponses = responses.getItemResponses()
  let email = itemResponses[2].getResponse() // returns a string
  
  Logger.log(email)

  sendConfirmationEmail(email)
  
  Logger.log("Email sent.")
}


function setUpTriggers()
{
  ScriptApp.newTrigger('onFormSubmit')
  .forForm(FormApp.getActiveForm())
  .onFormSubmit()
  .create()

  ScriptApp.newTrigger('onOpen')
  .forForm(FormApp.getActiveForm())
  .onOpen()
  .create()
}