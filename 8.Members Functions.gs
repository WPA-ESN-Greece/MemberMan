/**=========================================================================================================================================================================
 *  
 * Members - Alumni Sheets Functions.
 * =========================================================================================================================================================================
 */

// Transffers members data between two sheets with the same structure. (Members and Alumni in this case).
function transferDataFromMembersToAlumni()
{
  var startRow = 2
  var statusToCheck = ALUMNI
  var lastRow = Members_SHEET.getLastRow()
  var lastColumn = Members_SHEET.getLastColumn()
  var membersData = Members_SHEET.getRange(startRow,1,lastRow,lastColumn).getValues()
  var rowsIndexToDelete = []

  membersData.forEach(function(row, index) 
  {
    // row[2] = First Name, row[3] = Lastnamw, row[6] = Contact Email, row[11] = Became Member Date, row[12] = ESN Account Link
    if(row[0] === statusToCheck && row[2] != '' && row[3] != '' && row[6] != '' && row[11] != '' && row[12] != '')
    {
      rowsIndexToDelete.push(index + startRow)

      var targetRow = Members_SHEET.getRange(index + startRow, 1, 1, lastColumn).getValues()

      Logger.log("targetRow: " + targetRow)

      appendRowFromTop(Alumni_SHEET, targetRow[0].length, startRow)
      setValueToRange(Alumni_SHEET, Alumni_SHEET.getRange(startRow, 1, 1, Alumni_SHEET.getLastColumn()).getA1Notation(), targetRow[0])
      //Members_SHEET.deleteRow(index + startRow)

      if (row[14].length === 0)
      {
        setValueToRange(Alumni_SHEET, Became_Alumni_Date_CELL, [Utilities.formatDate(new Date(), TIMEZONE, "dd/MM/yyyy")])
      }
      else 
      {
      var alumniDate = String(row[14])
      var outPutDates = String(Utilities.formatDate(new Date(), TIMEZONE, "dd/MM/yyyy")) + ", " + alumniDate
      setValueToRange(Alumni_SHEET, Became_Alumni_Date_CELL, [outPutDates])
      }

      removeUserFromGoogleGroup(row[1], Members_Google_Group)

      if (IS_Alumni_Google_Group_Active == true)
      {
        addUserToGoogleGroup(row[1], Alumni_Google_Group)
      }
    }
  })
  
  rowsIndexToDelete.sort().reverse()
  Logger.log("rowsIndexToDelete " + rowsIndexToDelete)
  for (var i = 0; i < rowsIndexToDelete.length; i++)
  {
    Members_SHEET.deleteRow(rowsIndexToDelete[i])
  }
}

// Transffers members data between two sheets with the same structure. (Members and Alumni in this case).
function transferDataFromSheetToSheet(fromSheet, toSheet, statusToCheck, startRow)
{
  var lastRow = fromSheet.getLastRow()
  var lastColumn = fromSheet.getLastColumn()
  var membersData = fromSheet.getRange(startRow,1,lastRow,lastColumn).getValues()
  var rowsIndexToDelete = []

  membersData.forEach(function(row, index) 
  {
    // row[2] = First Name, row[3] = Lastnamw, row[6] = Contact Email, row[11] = Became Member Date, row[12] = ESN Account Link
    if(row[0] === statusToCheck && row[2] != '' && row[3] != '' && row[6] != '' && row[11] != '' && row[12] != '')
    {
      rowsIndexToDelete.push(index + startRow)

      var targetRow = fromSheet.getRange(index + startRow, 1, 1, lastColumn).getValues()

      Logger.log("targetRow: " + targetRow)

     appendRowFromTop(toSheet, targetRow[0].length, startRow)
     setValueToRange(toSheet, toSheet.getRange(startRow, 1, 1, toSheet.getLastColumn()).getA1Notation(), targetRow[0])
     //fromSheet.deleteRow(index + startRow)

     if (statusToCheck === ALUMNI && fromSheet === Members_SHEET)
     {
      
      if (row[14].length === 0)
      {
        setValueToRange(Alumni_SHEET, Became_Alumni_Date_CELL, [Utilities.formatDate(new Date(), TIMEZONE, "dd/MM/yyyy")])
      }
      else 
      {
      var alumniDate = String(row[14])
      var outPutDates = String(Utilities.formatDate(new Date(), TIMEZONE, "dd/MM/yyyy")) + ", " + alumniDate
      setValueToRange(Alumni_SHEET, Became_Alumni_Date_CELL, [outPutDates])
      }
     }

     if (statusToCheck === ACTIVE_AGAIN && fromSheet === Alumni_SHEET)
     {
      setValueToRange(Members_SHEET, Became_Member_Date_CELL, [Utilities.formatDate(new Date(), TIMEZONE, "dd/MM/yyyy") + ", " + String(row[11])])
     }

    }
  })
  
  rowsIndexToDelete.sort().reverse()
  Logger.log("rowsIndexToDelete " + rowsIndexToDelete)
  for (var i = 0; i < rowsIndexToDelete.length; i++)
  {
    fromSheet.deleteRow(rowsIndexToDelete[i])
  }
}



// Creates Google users for each row with the "Create Google Account" Status.
function bulkCreateGoogleUsers()
{
  const Google_Workspace_Admin_User_PLACEHOLDER = "[Position Email Address]"
  const Organization_Unit_Path_PLACEHOLDER = "/Sections/[Section Name]"
  const Domain_PLACEHOLDER = "[section].esngreece.gr"
  var ui = SpreadsheetApp.getUi()
  
  if 
  (
    SECTION_GOOGLE_Organization_Unit_Path == Organization_Unit_Path_PLACEHOLDER || 
    SECTION_GOOGLE_Organization_Unit_Path.length == 0 || 
    SECTION_EMAIL_DOMAIN == Domain_PLACEHOLDER ||
    SECTION_EMAIL_DOMAIN.length == 0 ||
    IS_Add_UsersToGoogleWorkplace_Active == false
  )
  {
    ui.alert(`Make sure that "Organization Unit Path", "Domain" are filled out with your Section's information and "Add users directly to Google Workspace" is set to TRUE (is checked).`, ui.ButtonSet.OK)
  }
  else
  {
    
      var lastRow = Members_SHEET.getLastRow() 
      var lastColumn = Members_SHEET.getLastColumn()
      var membersData = Members_SHEET.getRange(2,1,lastRow,lastColumn).getValues()

      membersData.forEach(function(row, index)
      {
        if (row[0] === CREATE_GOOGLE_ACCOUNT)
        {
          // User data.
          var userEmail = row[1]
          var userFirstname = row[2]
          var userLastname = row[3]
          var userPassword = row[2] + "@esn"
          var userRecoveryEmail = row[6]
          var userPhoneNumber = row[7]
          
          try
          {
            // Creating the new user.
            insertNewGoogleUser(SECTION_SHORT_NAME, userEmail, userPassword, userFirstname, userLastname, userRecoveryEmail, userPhoneNumber, SECTION_GOOGLE_Organization_Unit_Path)
          }
          catch(err)
          {
          ui.alert(err.message, ui.ButtonSet.OK)
          Logger.log('Failed with error %s', err.message)
          }

          // Email the Login Credentials to the recovery email address of members.
          emailCredentialsToNewUsers(userEmail, userPassword, userRecoveryEmail)

          
          if (IS_Members_Google_Group_Active == true)
          {
            addUserToGoogleGroup(userEmail, Members_Google_Group)
          }

          // Sets Membe Status to "Newbie"
          setValueToRange(Members_SHEET, Members_SHEET.getRange(index + 2, 1, 1, 1).getA1Notation(), [NEWBIE])
        }
      })
  }
    
    
}


// Sends Emails to new users with ESN Email, single use password and Google log in link.
function emailCredentialsToNewUsers(primaryEmail, password, recoveryEmail) 
{
  var subject = "Your New ESN Google Account Credentials"

  var htmlTemplate = HtmlService.createTemplateFromFile("email_credentials")
  htmlTemplate.esnMail = primaryEmail
  htmlTemplate.esnMailPassword = password

  var message = htmlTemplate.evaluate().getContent()

  
  /*
  var message = 
    `<h2>Your New ESN Google Account is Ready!</h2>`+
    `<p><b>ESN Email Address: </b> ${primaryEmail}</p>` +
    `<p><b>Single-Use Password: </b> ${password}</p>`+
    `<p><i>After the first sign in to your new Google Account, you will be asked to change the password above with one only you will know.
     You can sign in <a href="shorturl.at/erBX3">here</a>.</i></p>`*/


  
  MailApp.sendEmail(
    {
      to: recoveryEmail,
      cc: "",
      subject: subject,
      htmlBody: message,
    })

toast("Now the new ESNers can log in to Google.","🎉 Emails sent")
}


