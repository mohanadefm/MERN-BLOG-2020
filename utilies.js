const mailjet = require ('node-mailjet')
.connect('9dfbbaf9b192c0eba03513fe67833f1f', 'aa8ffbd30d268501c08af64cb72ce9b3')


const sendEmail = async (to,username) => {

 mailjet
  .post("send", {'version': 'v3.1'})
  .request({
    "Messages":[
      {
        "From": {
          "Email": "mohanadefm@hotmail.com",
          "Name": "Mohanad Blog Team"
        },
        "To": [
          {
            "Email": to,
            "Name": username
          }
        ],
        "Subject": "Mohanad Blog",
        "HTMLPart": `<h2>Dear ${username}, welcome to Mohanad Blog!</h2><br /><h3>We hope you enjoy writing in blog!</h3><br /><img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.iconfinder.com%2Ficons%2F4363845%2Fwriting_article_blog_icon&psig=AOvVaw12HpIif8bzl5_-1myTNugU&ust=1616718049383000&source=images&cd=vfe&ved=0CAYQjRxqFwoTCJiPm5yWyu8CFQAAAAAdAAAAABAw" alt="blog-icon"/>`,
      }
    ]
  }).then((result) => {
      console.log("result ==>", result.body)
    })
    .catch((err) => {
      console.log("err ==>", err.statusCode)
    })

}

module.exports = { sendEmail };








// const nodemailer = require("nodemailer");
// //===================================================================================================
// const sendEmail = async (to,subject,body) => {
//   // Step 1
//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth:{
//         user: "mohanadblog@gmail.com",
//         pass : "Aa123456=="
//     }
//   });
//   // Step 2
//   let mailOptions = {
//     from: "mohanadblog@gmail.com",
//     to: to,
//     subject: "no-reply",
//     text: "Welcome to our blog!"
//   }
//   // Step 3
//   await transporter.sendMail(mailOptions, function(error,data){
//     if(error){
//       console.log("error", error)
//     }else{
//       conaole.log("email sent", data)
//     }
//   });

//   //console.log(`Message sent: ${info.messageId}`);
//   //console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
// }
// //===================================================================================================
// module.exports = { sendEmail };





 // let info = await transporter.sendMail({
  //   from: "mohanadblog@gmail.com",
  //   to: to,
  //   subject: subject,
  //   //text: "Hello world?", // What is the deferrient between html and body?
  //   html: body,
  // });
