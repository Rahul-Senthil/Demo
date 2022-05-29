const Joi = require('joi');
const {joiPassword} = require('joi-password');
const nodeMailer = require('nodemailer');
const randomNumber = require('randomatic');

//Validate User
const validateUser = (req, res, next) => {
    const userValidateSchema = Joi.object({
        email_id: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .required()
                .label("Email"),
        username: Joi.string()
                .min(3)
                .max(20) 
                .required()
                .label("Username"),
        password: joiPassword.string()
                .min(8)
                .max(18)
                .minOfSpecialCharacters(1)
                .minOfLowercase(1)
                .minOfUppercase(1)
                .minOfNumeric(1)
                .noWhiteSpaces()
                .required()
                .label("Password")
    })
    const {error} = userValidateSchema.validate(req.body);
    if(error){
        res.status(200).send(error.message);
        console.log(error.message);
    }
    else{
        console.log("Validation is Done");
        res.status(200).send({loggedIn: true});
    }
}

const validateEmail =(req, res, next) => {
    let transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tenantapp11@gmail.com',
            pass: 'tenantAppiii'
        }
    });

    const sixDigitCode = randomNumber('0', 6);
    let mailOptions = {
        from: 'tenantapp11@gmail.com',
        to: req.body.email_id,
        subject: 'Your 6 digit code is',
        text: sixDigitCode
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        }
        else{
            console.log('Mail Sent: ', info.response);
            res.status(200).send({...req.body, sixDigitCode});
            next();
        }
    })
    res.status(200).send({...req.body, sixDigitCode});
}

//Validate Post
const validatePost = (req, res, next) => {
    const postValidateSchema = Joi.object({
        author_id: Joi.string().required(),
        imgUrl: Joi.array().min(1).required().label("Image"),
        address: Joi.string().required().label("Address"),
        mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required().label("Mobile Number"),
        rent: Joi.number().min(0).required().label("Rent"),
        description: Joi.string().required().label("Description"),
        date: Joi.string().required()
    })

    const {error} = postValidateSchema.validate(req.body);
    if(error){
        res.status(200).send({error: error.message});
        console.log(error.message);
    }
    else{
        next();
    }
}

module.exports = {validateUser, validateEmail, validatePost};