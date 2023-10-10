

function test123()
{
  var formID = '1FS_z9I-ymp593O5dT6_VGip2L05MEekkgZlkCA9zgBY'
  var form = FormApp.openById(formID)
/*
    // GDPR Text
    var items = form.getItems()
    var gdprItemID = items[items.length - 1].getId()
    var gdprText = form.getItemById(gdprItemID).getHelpText()

    gdprText = gdprText.replace("{{ESN Section's Full Name}}", SECTION_FULL_NAME)
    gdprText = gdprText.replace("{{ESN Section's Name}}", SECTION_SHORT_NAME)
    gdprText = gdprText.replace("{{ESN Section's Name}}", SECTION_SHORT_NAME)
    form.getItemById(gdprItemID).setHelpText(gdprText)

    // Join Form Description Text
    var joinFormDescription = form.getDescription()
    joinFormDescription = joinFormDescription.replace("{{University Name}}", UNIVERSITY_NAME)
    joinFormDescription = joinFormDescription.replace("{{University Name}}", UNIVERSITY_NAME)
    form.setDescription(joinFormDescription)
*/

    //var form = FormApp.openById(formID)

    // GDPR Text
    var items = form.getItems()
    var gdprItemID = items[items.length - 1].getId()
    var gdprText = form.getItemById(gdprItemID).getHelpText()
    Logger.log(gdprText)

    gdprText = gdprText.replace("{{ESN Section Full Legal Name}}", SECTION_FULL_NAME)
    gdprText = gdprText.replace("{{ESN Section's Name}}", SECTION_SHORT_NAME)
    gdprText = gdprText.replace("{{ESN Section's Name}}", SECTION_SHORT_NAME)

    Logger.log(gdprText)

    form.getItemById(gdprItemID).setHelpText(gdprText)

  

    // Join Form Description Text
    var joinFormDescription = form.getDescription()
    joinFormDescription = joinFormDescription.replace("{{Πανεπιστήμιο Σαντορίνης}}", UNIVERSITY_NAME)
    oinFormDescription = joinFormDescription.replace("{{Πανεπιστήμιο Σαντορίνης}}", UNIVERSITY_NAME)
    form.setDescription(joinFormDescription)

    // Join Form Title Text
    form.setTitle( form.getTitle().replace("{{ESN Section's Name}}", SECTION_SHORT_NAME))
}

