/**=========================================================================================================================================================================
 *  
 * Config File
 * 
 * =========================================================================================================================================================================
 */


// Documentation Doc URL.
const DOCUMENTATION_LINK = 'https://docs.google.com/document/d/1uCqoSNN5fHieTUz-2lBLeBr2hMXIyG_3NlG9rC10zhM/edit?usp=sharing'




// Join Form's URL.
  const JOIN_FORM_TEMPLATE_URL = "https://docs.google.com/forms/d/1Jqxas_rvNLNRzC70XFeWH2kIRrySNHuZn6uURt3c3mo/edit"
  const JOIN_FORM_TEMPLATE_ID = extractDocumentIdFromUrl(JOIN_FORM_TEMPLATE_URL)
  const JOIN_FORM_NAME = "✨ Join the Team - Application Form | MemberMan"

// Team Update Form
  const TEAM_UPDATE_FORM_TEMPLATE_URL = "https://docs.google.com/forms/d/1vts9Xe5AXn5DvN8YnV_XLkc5YNnlft5NDgDHiZR5v8g/edit"
  const TEAM_UPDATE_FORM_TEMPLATE_ID = extractDocumentIdFromUrl(TEAM_UPDATE_FORM_TEMPLATE_URL)
  const TEAM_UPDATE_FORM_NAME = "✨ Team Update Form | MemberMan"



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
  


// Timezone
let TIMEZONE = Session.getScriptTimeZone()



// Getting Sheets by Name
  let Join_Form_Responses_SHEET = ss.getSheetByName(Join_Form_Responses_Sheet_NAME)
  
    // Join Form Responses Sheet Details
    const Recruitment_Status_Dropdown_Options_RANGE = "A2:A"
    const JoinForm_Studies_Column = "L1"
    const JoinForm_LINK_CELL = "E18"
      
  let Team_Update_Form_SHEET = ss.getSheetByName(Team_Update_Form_Sheet_NAME)
    
    // Team Updateform Details
    const Team_Update_Form_LINK_CELL = "E19"
  
  let Members_SHEET = ss.getSheetByName(Members_Sheet_NAME)
    const Query_Formula_Column_Members = "Q1"
    const Became_Member_Date_CELL = "L2"
    const ESN_Email_Address_CELL = "B2"

  let Alumni_SHEET = ss.getSheetByName(Alumni_Sheet_NAME)
    const Query_Formula_Column_Alumni = Query_Formula_Column_Members
    const Became_Alumni_Date_CELL = "O2"

  let Users_SHEET = ss.getSheetByName(Users_Sheet_NAME)
  let Settings_SHEET = ss.getSheetByName(Settings_Sheet_NAME)

 

// Section's Info
  const SECTION_FULL_NAME_CELL = "E11"
  let SECTION_FULL_NAME = Settings_SHEET.getRange(SECTION_FULL_NAME_CELL).getValue()

  const SECTION_SHORT_NAME_CELL = "E12"
  let SECTION_SHORT_NAME = Settings_SHEET.getRange(SECTION_SHORT_NAME_CELL).getValue()

  const UNIVERSITY_NAME_CELL = "E12"
  let UNIVERSITY_NAME = Settings_SHEET.getRange(UNIVERSITY_NAME_CELL).getValue()
  


  // Section Technical Info
    const SECTION_EMAIL_Admin_CELL = "E2"
    let SECTION_EMAIL_Admin = Settings_SHEET.getRange(SECTION_EMAIL_Admin_CELL).getValue()
    
    const SECTION_EMAIL_DOMAIN_CELL = "E4"
    let SECTION_EMAIL_DOMAIN = Settings_SHEET.getRange(SECTION_EMAIL_DOMAIN_CELL).getValue()

    const SECTION_GOOGLE_Organization_Unit_Path_CELL = "E3"
    let SECTION_GOOGLE_Organization_Unit_Path = Settings_SHEET.getRange(SECTION_GOOGLE_Organization_Unit_Path_CELL).getValue()
    

    // Create Google Accounts option
    const IS_Add_UsersToGoogleWorkplace_Active_CELL = "E5"
    let IS_Add_UsersToGoogleWorkplace_Active = Settings_SHEET.getRange(IS_Add_UsersToGoogleWorkplace_Active_CELL).getValue()


    // Members Group Settings
    const IS_Members_Google_Group_Active_CELL = "E6"
    let IS_Members_Google_Group_Active = Settings_SHEET.getRange(IS_Members_Google_Group_Active_CELL).getValue()
    
    const Members_Google_Group_CELL = "E7"
    let Members_Google_Group = Settings_SHEET.getRange(Members_Google_Group_CELL).getValue()


    // Alumni Group Settings
    const IS_Alumni_Google_Group_Active_CELL = "E8"
    let IS_Alumni_Google_Group_Active = Settings_SHEET.getRange(IS_Alumni_Google_Group_Active_CELL).getValue()

    const Alumni_Google_Group_CELL = "E9"
    let Alumni_Google_Group = Settings_SHEET.getRange(Alumni_Google_Group_CELL).getValue()


    // Secret Status Varibles to  make menu items appear or not deppending on these statuses.
    const IS_JoinForm_Created_CELL = "B1"
    let IS_JoinForm_Created = Settings_SHEET.getRange(IS_JoinForm_Created_CELL).getValue()

    const IS_TeamUpdateForm_Created_CELL = "B2"
    let IS_TeamUpdateForm_Created = Settings_SHEET.getRange(IS_TeamUpdateForm_Created_CELL).getValue()

    // CSV Link Generation
    const IS_CSV_Link_Generated_CELL = "B3"
    let IS_CSV_Link_Generated = Settings_SHEET.getRange(IS_CSV_Link_Generated_CELL).getValue()



// Users CSV Cell
const CSV_LINK_CELL = "E20"



// Settings Sheet Recruitment Satus Options Cells and Values.
  const Recruitment_Status_OptionsinSettings_RANGE = "G3:G20"

  const EndColumnofPrimaryMemberData  = "Τμήμα Φοίτησης"

  const REGISTERED_CELL = "G3"
  let REGISTERED = Settings_SHEET.getRange(REGISTERED_CELL).getValue()

  const PENDING_CONTACT_CELL = "G4"
  let PENDING_CONTACT = Settings_SHEET.getRange(PENDING_CONTACT_CELL).getValue()

  const CONTACTED_CELL = "G5"
  let CONTACTED = Settings_SHEET.getRange(CONTACTED_CELL).getValue()

  const CANDIDATE_MEMBER_CELL = "G6"
  let CANDIDATE_MEMBER = Settings_SHEET.getRange(CANDIDATE_MEMBER_CELL).getValue()

  const ACCEPTED_CELL = "G7"
  let ACCEPTED = Settings_SHEET.getRange(ACCEPTED_CELL).getValue()

  const REJECTED_CELL = "G8"
  let REJECTED = Settings_SHEET.getRange(REJECTED_CELL).getValue()

  const ACCEPTED_TRANSFERRED_CELL = "G20"
  let ACCEPTED_TRANSFERRED = Settings_SHEET.getRange(ACCEPTED_TRANSFERRED_CELL).getValue()



// Settings Sheet Membership Satus Options Cells and Values.
  const CREATE_GOOGLE_ACCOUNT_CELL = "I3"
  let CREATE_GOOGLE_ACCOUNT = Settings_SHEET.getRange(CREATE_GOOGLE_ACCOUNT_CELL).getValue()

  const NEWBIE_CELL = "I4"
  let NEWBIE = Settings_SHEET.getRange(NEWBIE_CELL).getValue()

  const ACTIVE_MEMBER_CELL = "I5"
  let ACTIVE_MEMBER = Settings_SHEET.getRange(ACTIVE_MEMBER_CELL).getValue()

  const BOARD_SUPPORTER_CELL = "I6"
  let BOARD_SUPPORTER = Settings_SHEET.getRange(BOARD_SUPPORTER_CELL).getValue()

  const BOARD_MEMBER_CELL = "I7"
  let BOARD_MEMBER = Settings_SHEET.getRange(BOARD_MEMBER_CELL).getValue()

  const INACTIVE_CELL = "I8"
  let INACTIVE = Settings_SHEET.getRange(INACTIVE_CELL).getValue()

  const FROZEN_MEMBERSHIP_CELL = "I9"
  let FROZEN_MEMBERSHIP = Settings_SHEET.getRange(FROZEN_MEMBERSHIP_CELL).getValue()

  const IN_ESN_INT_CELL = "I10"
  let IN_ESN_INT = Settings_SHEET.getRange(IN_ESN_INT_CELL).getValue()

  const ACTIVE_AGAIN_CELL = "I17"
  let ACTIVE_AGAIN = Settings_SHEET.getRange(ACTIVE_AGAIN_CELL).getValue()

  const ALUMNI_CELL = "I18"
  let ALUMNI = Settings_SHEET.getRange(ALUMNI_CELL).getValue()

  const RETIRED_CELL = "I19"
  let RETIRED = Settings_SHEET.getRange(RETIRED_CELL).getValue()

  const RETIRED_Disabled_CELL = "I20"
  let RETIRED_Disabled = Settings_SHEET.getRange(RETIRED_Disabled_CELL).getValue()
  