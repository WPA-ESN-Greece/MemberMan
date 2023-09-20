


function sendAutoReplyEmail(emailTo)
{
  emailTo = "inikolarakis+esntest@gmail.com" //for testing

  let htmlTemplate = HtmlService.createTemplateFromFile("form auto reply email")

  htmlTemplate.emailTitle = TITLE
  htmlTemplate.signature = SIGNATURE

  htmlTemplate.callToActionButtonHTML = 
  `
  <a href= "${CallToAction_ButtonURL}" style=" display: inline-block; background: #00aeef; color: #ffffff; font-family: Roboto,sans-serif; font-size: 16px; font-weight: bold; line-height: 1.4; letter-spacing: 0; margin: 0; text-decoration: none; text-transform: none; " target="_blank" draggable="false" class="dQm01 OIDgAc zDnK4d sLNPec"><span style="display: block; min-width: 10px" contenteditable="true" >${CallToAction_ButtonText}</span></a>
  ` // end

  let message = htmlTemplate.evaluate().getContent()

  MailApp.sendEmail(
          {
            
              to: String(emailTo),
              cc: "",
              bcc:"",
              subject: EMAIL_SUBJECT,
              htmlBody: message,
              name: Sender_Name
          })
}

