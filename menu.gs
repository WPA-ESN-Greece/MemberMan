function onOpen(){
initMenu()
}


function initMenu(){//onOpen() {
  var ui = SpreadsheetApp.getUi()
  var menu = ui.createMenu("ESN Menu")
  
  
  menu.addItem("📤 Email Credentials to New Users","emailCredentials")//.addToUi()
  menu.addSeparator()

  var submenu = ui.createMenu("🔨 Set Up")
  submenu.addItem("🔗 Generate users Link","generateUsersLink")
  menu.addSubMenu(submenu)
  
  menu.addToUi()
}