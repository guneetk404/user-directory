const nodemailer = require("nodemailer");




const sendOtp=async (email,otp)=>{ 
          console.log("hello");
          // Generate a random 6-digit OTP
          let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.MAILER_ID,
              pass: process.env.MAILER_PASS,
            },
          });
          // const otp = Math.floor(100000 + Math.random() * 900000);
          // generatedOtps[email] = otp;
          console.log("inside send otp",email);
          const mailOptions = {
            from: 'your-email@gmail.com',
            to: email, // The email address where you want to send the OTP
            subject: 'OTP for Forget Password',
            text: `Your OTP for Forget Password is: ${otp}`,
          };
          mailTransporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error sending OTP:', error);
              res.status(500).json({ message: 'Failed to send OTP' });
            } else {
              console.log('OTP sent:', info.response);
              res.status(200).json({ message: 'OTP sent successfully' });
            }
          });
        };

        module.exports ={sendOtp}