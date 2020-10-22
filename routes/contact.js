const router = new require("express").Router();
const nodemailer = require("nodemailer");
const mail_host = "smtp.mailtrap.io";
const mail_host_port = 2525;
const mail_user_address = "2c1a98f06c-e0f39a@inbox.mailtrap.io";
const mail_user_name = "196650f4ea6674";
const mail_user_pass = "4e2aa5b6b34bf5";

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(infos) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: mail_host,
      port: mail_host_port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: mail_user_name, // generated ethereal user
        pass: mail_user_pass, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `👻 ${infos.from} 👻`, // sender address
      to: mail_user_address, // list of receivers
      pseudo: infos.pseudo, // name
      subject: infos.subject, // Subject line
      text: infos.message, // plain text body
      html: `<h1>${infos.from} - ${infos.pseudo}</h1>
      <p><b>Sujet :</b> ${infos.subject}</p> 
      <p><b>Message :</b> ${infos.message}</p>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
  }
  
  router.post("/", async (req, res, next) => {
    console.log(req.body);
    sendMail(req.body)
      .then(() => {
        console.log("?? mail res");
        res.status(200).json("Le message a bien été envoyé, merci.");
      })
      .catch((err) => {
        console.error("???", err);
        res.status(500).json("Une erreur est survenue, le message n'a pu être envoyé.");
      });
  });
  
  module.exports = router;