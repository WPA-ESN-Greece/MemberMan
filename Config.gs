/**=========================================================================================================================================================================
 *  
 * Config File
 * 
 * =========================================================================================================================================================================
 */

// Section's Info
  const SECTION_FULL_NAME = "Erasmus Student Network of Salamina"
  const SECTION_SHORT_NAME = "ESN Salamina"
  const UNIVERSITY_GREEK_NAME = "Πανεπηστήμιο Σαλαμίνας"

// Documentation Doc URL.
const DOCUMENTATION_LINK = 'https://docs.google.com/document/d/1uCqoSNN5fHieTUz-2lBLeBr2hMXIyG_3NlG9rC10zhM/edit?usp=sharing'

// Join Form's URL.
  const JOIN_FORM_TEMPLATE_URL = "https://docs.google.com/forms/d/1Jqxas_rvNLNRzC70XFeWH2kIRrySNHuZn6uURt3c3mo/edit"
  const JOIN_FORM_TEMPLATE_ID = extractDocumentIdFromUrl(JOIN_FORM_TEMPLATE_URL)
  const JOIN_FORM_NAME = "✨ Join the Team - Application Form | MemberMan"

// Team Update Form
  const TEAM_UPDATE_FORM_TEMPLATE_URL = ""
  //const TEAM_UPDATE_FORM_TEMPLATE_ID = extractDocumentIdFromUrl(TEAM_UPDATE_FORM_TEMPLATE_URL)
  const TEAM_UPDATE_FORM_NAME = "Join the Team Form | MemberMan"

// Active Spreadsheet. Spreadsheet is the whole file with all Sheets.
const ss = SpreadsheetApp.getActiveSpreadsheet()
const SpreadsheetID = ss.getId()

// Sheets Names
  const Join_Form_Responses_Sheet_NAME = 'Join Form Responses'
  const Team_Update_Form_Sheet_NAME = 'Team Update Form Responses'

  const Members_Sheet_NAME = 'Members'
  const Alumni_Sheet_NAME = 'Alumni'

  const Users_Sheet_NAME = 'users'
  const Settings_Sheet_NAME = 'Settings'
  
  

// Getting Sheets by Name
  let Join_Form_Responses_SHEET = ss.getSheetByName(Join_Form_Responses_Sheet_NAME)
    // Join Form Responses Sheet Details
      const Recruitment_Status_Dropdown_Options_RANGE = "A2:A"
  let Team_Update_Form_SHEET = ss.getSheetByName(Team_Update_Form_Sheet_NAME)
  
  let Members_SHEET = ss.getSheetByName(Members_Sheet_NAME)
  let Alumni_SHEET = ss.getSheetByName(Alumni_Sheet_NAME)
  
  let Users_SHEET = ss.getSheetByName(Users_Sheet_NAME)
  let Settings_SHEET = ss.getSheetByName(Settings_Sheet_NAME)


  