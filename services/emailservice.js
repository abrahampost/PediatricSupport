
const nodemailer = require("nodemailer");

// sets up info for email medium being used
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// helper function: actually delivers email
async function deliver(mail){
  try {
    let info = await transporter.sendMail(mail);
    console.log("Message sent: %s", info.messageId);
  } catch (e) {
    console.error(e);
  }
}

// functions for sending specific email types
function sendSignupEmail(user, email, pass){
  let mail = {
      from: '"UNC Hospitals" <523pediatrics@gmail.com>',
      to: email,
      subject: "UNC Pediatrics - Account Created",
      text: "Hello; you have successfully registered with UNC Pediatrics! Your account username is " 
            + user + ", and your password is " + pass + ".",
      html: "<p>Hello; you have successfully registered with UNC Pediatrics!</p><p>Your account username is " 
            + user + ", and your password is " + pass + ".</p>"
  };
  deliver(mail);
}
function sendPasswordChangeEmail(user, email, pass) {
  let mail = {
      from: '"UNC Hospitals" <523pediatrics@gmail.com>',
      to: email,
      subject: "UNC Pediatrics - Password Changed",
      text: "Hello; you have successfully changed the password of your UNC Pediatrics account, " 
            + user + ". Your new password is " + pass + ".",
      html: "<p>Hello; you have successfully changed the password of your UNC Pediatrics account, " 
            + user + ".</p><p>Your new password is " + pass + ".</p>"
  };
  deliver(mail);
}
