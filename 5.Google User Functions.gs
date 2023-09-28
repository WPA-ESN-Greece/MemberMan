
function insertNewGoogleUser(_esnSection, _primaryEmail, _password, _firstName, _lastName, _recoveryEmail, _phone, _orgUnitPath) 
{
  let GoogleUserOBJ =
  {
    //"id": string,
    primaryEmail: String(_primaryEmail),
    password: String(_password),
    //hashFunction: "MD5",
    //"isAdmin": boolean,
    //"isDelegatedAdmin": boolean,
    //"agreedToTerms": boolean,
    suspended:false,
    changePasswordAtNextLogin: true,
    //"ipWhitelisted": boolean,
    name: {
     fullName: String(_firstName) + " " + String(_lastName),
     familyName: String(_lastName),
     givenName: String(_firstName),
     displayName: String(_firstName) + " " + String(_lastName) + " - " + String(_esnSection)
    },
    //"kind": string,
    //"etag": string,
    emails: [
    {
      type: "home",
      address: String(_recoveryEmail)
    },
    {
      primary: true,
      address: String(_primaryEmail)
    }],
    //"externalIds": value,
    //"relations": value,
    //"aliases": [string],
    //"isMailboxSetup": boolean,
    //"customerId": string,
    //"addresses": value,
    //"organizations": value,
    //"lastLoginTime": string,
    phones: [
    {
      type: "mobile",
      value: String(_phone)
    },
    ],
    //"suspensionReason": string,
    //"thumbnailPhotoUrl": string,
    languages: [
    {
      languageCode: "en-GB",
      preference: "preferred"
    },
    {
      languageCode: "el",
      preference: "preferred"
    }
    ], 
    //English (UK) and Greek 
    //"posixAccounts": value,
    //"creationTime": string,
    //"nonEditableAliases": [string],
    //"sshPublicKeys": value,
    //"notes": value,
    //"websites": value,
    //"locations": value,
    //"includeInGlobalAddressList": boolean,
    /*keywords: [{
        customType: string,
        value: string
      }],*/
    //"deletionTime": string,
    gender: {
      type: "other",
      customGender: "ESNer"
    },
    //"thumbnailPhotoEtag": string,
    //"ims": value,
    //"customSchemas": value,
    isEnrolledIn2Sv: true,
    isEnforcedIn2Sv: true,
    //"archived": boolean,
    orgUnitPath: String(_orgUnitPath), //The full path of the parent organization associated with the user. If the parent organization is the top-level, it is represented as a forward slash (/).
    recoveryEmail: String(_recoveryEmail),
    recoveryPhone: String(_phone) //Recovery phone of the user. The phone number must be in the E.164 format, starting with the plus sign (+). Example: +16506661212
  }

  try {
    user = AdminDirectory.Users.insert(GoogleUserOBJ);
    console.log('User %s created with ID %s.', user.primaryEmail, user.id);
  } catch (err) {
    // TODO (developer)- Handle exception from the API
    console.log('Failed with error %s', err.message);
  }
}




/**
 * Adds a user to a Google Group if the user is not already a member.
 *
 * @param {string} primaryEmail - The primary email address of the user to be added.
 * @param {string} groupEmailAddress - The email address of the Google Group.
 * @throws {Error} Throws an error if there's an issue with the "AdminDirectory" API call.
 */
function addUserToGoogleGroup(primaryEmail, groupEmailAddress)
{ 
  if (!checkGroupMembership(primaryEmail, groupEmailAddress)) //If the user's email IS NOT a member of the group.
  {   
    let memberOBJ =
    {
      kind: "admin#directory#member",
      email: String(primaryEmail),
      role: "MEMBER",
      //"etag": string,
      type: "USER",
      //"status": string,
      delivery_settings: "ALL_MAIL"
      //"id": string
    }
    try 
    {
      AdminDirectory.Members.insert(memberOBJ, groupEmailAddress)
      console.log('User %s added to group %s.', primaryEmail, groupEmailAddress)
    }
    catch (err) 
    {
      console.log('Failed with error %s', err.message)
    }    
  }
}


/**
 * Removes a user from a Google Group if the user is a member.
 *
 * @param {string} primaryEmail - The primary email address of the user to be removed.
 * @param {string} groupEmailAddress - The email address of the Google Group.
 * @throws {Error} Throws an error if there's an issue with the "AdminDirectory" API call.
 */
function removeUserFromGoogleGroup(primaryEmail, groupEmailAddress)
{
  try {
    if (checkGroupMembership(primaryEmail, groupEmailAddress)) //If the user's email IS a member of the group.
    {
      AdminDirectory.Members.remove(primaryEmail, groupEmailAddress)
      console.log('User %s removed from group %s.', primaryEmail, groupEmailAddress)
    }
    else //If the user's email IS NOT a member of the group.
    {
      console.log(primaryEmail + " is not a member in " + groupEmailAddress)
    }
  }
  catch (err) 
  {
    console.log('Failed with error %s', err.message)
  }
}

function checkGroupMembership(userEmail, groupName) 
{
  //var userEmail = Session.getActiveUser().getEmail();
  //var groupName = "nb@esngreece.gr"; // Replace with your Google Group's email address
  
  //var emails = SECTION_EMAIL_Admin
  //emails.split()

  var groupMembers = GroupsApp.getGroupByEmail(String(groupName)).getUsers()
  Logger.log(groupMembers)

  var isMember = groupMembers.some(element => element.getEmail() === String(userEmail))
  
  Logger.log(isMember + " isMember")
  

  if (isMember) {
    Logger.log(userEmail + " is a member of the group.");
    return true
  } else {
    Logger.log(userEmail + " is not a member of the group.");
    return false
  }
}

/**
 * Creates a new Google user based on the provided user object.
 *
 * @param {GoogleUser} userObj - The GoogleUser object containing user information.
 * 
 * Example usage:
 * ```
 * var userObj = new GoogleUser("ESN Gavdos", "testuser@esngreece.gr", "password123", "Firstname", "Lastname", "recovery@gmail.com", "+306969696969", "/Test/OrgPath");
 * 
 * createNewGoogleUser(userObj);
 * ```
 */
function createNewGoogleUserF(userObj)
{
    var userEmail = userObj.primaryEmail

    if (listAllGoogleUsersEmails().some(email => email === userEmail))
    {
      Logger.log(listAllGoogleUsersEmails().some(email => email === userEmail))

      new GoogleUser(userObj).createNewGoogleUser() 

      toast(`User ${userObj.primaryEmail} was created at ${userObj.orgUnitPath}. It may take a few seconds until the new user appear.`, "New user created", 8)
    }
    else
    {
      toast(`Unable to create new user.`, "Couldn't crete new user", 8)
    }
}

/**
 * Creates a new instance of GoogleUser based on the provided information.
 *
 * @param {string} esnSection - The ESN section associated with the user. 
 * Example:
 * ``` 
 * "ESN Gavdos"
 * ```
 * @param {string} primaryEmail - The primary email address of the user. Example: "testuser@esngreece.gr"
 * @param {string} password - The password for the user. Example: "password123"
 * @param {string} firstName - The first name of the user. Example: "Firstname"
 * @param {string} lastName - The last name of the user. Example: "Lastname"
 * @param {string} recoveryEmail - The recovery email address of the user. Example: "recovery@gmail.com"
 * @param {string} phone - The phone number of the user in E.164 format. Example: "+306969696969"
 * @param {string} orgUnitPath - The organization unit path associated with the user. Example: "/Test/OrgPath"
 * 
 *
 * @example
 * ```
 * // Create a new user object
 * var userObj = newUserObj("ESN Gavdos", "testuser@esngreece.gr", "password123", "Firstname", "Lastname", "recovery@gmail.com", "+306969696969",/Test/OrgPath");
 * 
 * // Create a new Google user using the user object
 * createNewGoogleUser(userObj);
 * ```
 * @returns {GoogleUser} A GoogleUser object representing the new user.
 */
function newUserObj(esnSection, primaryEmail, password, firstName, lastName, recoveryEmail, phone, orgUnitPath)
{
  var userObj = new GoogleUser(esnSection, primaryEmail, password, firstName, lastName, recoveryEmail, phone, orgUnitPath)
  return userObj
}




//Helper Functions

function listAllGoogleUsers() 
{
  var pageToken;
  var allUsers = [];

  do {
    var users = AdminDirectory.Users.list({
      customer: 'my_customer', // Use 'my_customer' for the entire domain
      maxResults: 500,
      pageToken: pageToken,
      fields: 'users(primaryEmail)'
    });

    if (users.users) {
      allUsers = allUsers.concat(users.users);
    }

    pageToken = users.nextPageToken;
  } while (pageToken);

  return allUsers;
}

function listAllGoogleUsersEmails() {
  var users = listAllGoogleUsers();
  var usersEmailAddresses = []
  if (users.length > 0) {
    //console.log('List of all users:');
    for (var i = 0; i < users.length; i++) {
      //console.log(users[i].primaryEmail)
      usersEmailAddresses.push(users[i].primaryEmail)
      
    }
  } else {
    console.log('No users found.')
  }
  Logger.log("Number of users found: " + users.length)
  
  //Logger.log("getemail " +  usersEmailAddresses)
  return usersEmailAddresses
}

function checkIfUserIsAdmin()
{
  var emails = SECTION_EMAIL_Admin
  var currentUser = Session.getActiveUser().getEmail()
  emails = emails.split().join()

  var isAdmin = emails.includes(currentUser)
  
  Logger.log("emails: " + emails)

  Logger.log("isAdmin: " + isAdmin)
}


function suspendGoogleUser()
{
  var userEmail = "testis@esngreece.gr"
  
  var user = AdminDirectory.Users.get(userEmail)

  if (user.suspended == false) 
  {
    user.suspended = true
  }

  AdminDirectory.Users.update(user, userEmail)
  Logger.log(AdminDirectory.Users.get(userEmail))
}