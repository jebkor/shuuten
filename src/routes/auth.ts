import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mailjet from 'node-mailjet'
import { environment } from '../../environtment';
import { User, IUser } from '../models/user';

const mailJetConnection = mailjet.connect('e65e4fd4b85412035999d1dd580b5bf6', 'c0dc4ded2f94691b51ae04e8eac3297f');

const router = express.Router()
router.get('/', (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    message: '👏'
  })
})

// Can login with valid email/password
// Cannot login with blank/missing email
// Cannot login with blank/incorrect password
function validUser(user: IUser) {
  // const validEmail = typeof user.email == 'string' && user.email.trim() != ''
  const validUsername = typeof user.username == 'string' && user.username.trim() != ''

  const validPassword = typeof user.password == 'string' && user.password.trim() != '' && user.password.trim().length > 6

  return validUsername && validPassword
}


function setUserIdCookie(req: Request, res: Response, id: any, rememberMe: any) {
  const isSecure = req.app.get('env') != 'development'

  if (rememberMe) {
    res.cookie('user_id', id, {
      httpOnly: true,
      secure: true,
      signed: true,
      maxAge: 345600000, // 1 week
      expires: new Date(Date.now() + 345600000),// 4 days
      sameSite: 'none'
    })
  } else {
    res.cookie('user_id', id, {
      httpOnly: true,
      secure: true,
      signed: true,
      maxAge: 86400000, // 1 week
      expires: new Date(Date.now() + 86400000), // 1 day
      sameSite: 'none'
    })
  }
}

/**
 * POST request for signing up a user
 */
router.post('/signup', async (req: Request, res: Response, next) => {
  // Get the request parameters
  const _user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })

  // Check if email and/or password is inputted
  if (validUser(req.body)) {

    // Check database for user with input email
    await User.find({ email: _user.email }).then(userEmail => {

      // User is not found, proceed to check username
      if (userEmail.length == 0) {
        User.find({ username: _user.username }).then(userUsername => {

          // username is not found, proceed to create user
          if (userUsername.length == 0) {
            // hash the inputted password
            bcrypt.hash(_user.password, 10).then(hash => {
              // Save user variable with hashed password
              _user.password = hash


              // Attempt to save to user to database
              _user.save().then(newUser => {
                const id = newUser.id
                setUserIdCookie(req, res, id, null)

                jwt.sign({
                  user: id
                },
                  environment.SECRET, {
                  expiresIn: "1d"
                }, (err, emailToken) => {
                  const url = `${process.env.APP_ENDPOINT}/#/confirm/${emailToken}`

                  let username = newUser.username;
                  const request = mailJetConnection
                    .post("send", { 'version': 'v3.1' })
                    .request({
                      "Messages": [
                        {
                          "From": {
                            "Email": "jesper@jebkor.dk",
                            "Name": "Sharlayan Dresser"
                          },
                          "To": [
                            {
                              "Email": newUser.email,
                              "Name": username
                            }
                          ],
                          "Subject": "Confirm email",
                          "TextPart": `Hello ${username}, this is an example welcome mail`,
                          "HTMLPart": `<h3>Hello ${username}, this is an example welcome mail. <br /><br /> Click <a href="${url}">here</a> to activate your account`
                        }
                      ]
                    })
                  request.then((result) => {
                    res.json({
                      message: '🆗'
                    })
                  }).catch((err) => {
                    next(new Error(`Couldn't send mail: ${err}`))
                  })
                })
              }).catch(err => {
                res.json({
                  message: err.message,
                  error: '❌'
                })
              })
            })
          } else {
            // username in use
            next(new Error('Specified username is already in use. Please enter another username'))
          }
        })
      } else {
        // email in use

        next(new Error('Specified email has already been registered. Try again with another email'))
      }
    }).catch(error => {
      console.error('error: ', error)
    })
  } else {
    // send an error
    next(new Error('Invalid user'))
  }
})

/**
 * POST request to try and login a user and send back an auth cookie
 */
router.post('/login', async (req, res, next) => {
  if (validUser(req.body)) {
    // check to see if in db
    await User.find({ username: req.body.username }).then(user => {
      if (user.length == 1 && user[0].is_verified && user[0].is_active) {

        // compare password with hashed password
        bcrypt.compare(req.body.password, user[0].password).then(result => {

          // if passwords match
          if (result) {
            // setting the 'set-cookie' header
            setUserIdCookie(req, res, user[0]._id, req.body.rememberMe)

            // Return the userid
            res.json({
              id: user[0]._id,
              username: user[0].username,
              message: 'Logged in! 🗝'
            })
          } else {
            // The passwords doesn't match
            next(new Error('Invalid login'))
          }
        })
      } else {
        // we did not find user in db
        next(new Error('Invalid login'))
      }
    })
  } else {
    // Either email or password wasn't filled
    next(new Error('Invalid login'))
  }
})

// When the user clicks the confirmation link in the email
router.post('/confirmation/:token', async (req, res, next) => {
  const id: any = jwt.verify(req.params.token, environment.SECRET);
  await User.findById({ _id: id.user }).then(response => {
    if (response?.is_verified) {
      next(new Error('User has already been verified'))
    } else {
      User.findByIdAndUpdate({ _id: id.user }, { is_verified: true, is_active: true }).then(response => {
        return res.json({
          message: '🆗'
        })
      }).catch(error => {
        next(new Error('User has already been verified'))
        return res.json({
          message: error,
          error: '❌'
        })
      });
    }
  })
});

/**
 * PUT request for updating a password
 */
router.put('/update-password', async (req: Request, res: Response, next) => {
  // Get the request parameters
  const passwords = {
    userId: req.body.user_id,
    newPassword: req.body.newPassword,
    oldPassword: req.body.oldPassword
  }

  // Check database for user with input email
  await User.find({ _id: passwords.userId }).then(user => {
    // User is found, proceed to fill const
    if (user.length >= 1) {
      const _user = new User({
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        username: user[0].username,
        email: user[0].email,
        password: user[0].password
      })



      bcrypt.compare(passwords.oldPassword, _user.password).then(compare => {
        bcrypt.hash(passwords.newPassword, 10).then(updatedPassword => {
          _user.password = updatedPassword;

          User.findByIdAndUpdate(passwords.userId, {
            password: _user.password
          }).then(result => {
            res.json({
              message: '🆗'
            })
          }).catch(err => {
            console.error('Error: ', err);
          });
        })
      })
    } else {
      // user is not found
      next(new Error("Couldn't find user."))
    }
  }).catch(error => {
    console.error('error: ', error)
  })
})


/**
 * GET reqyest for logging out a user
 */
router.get('/logout', (req, res, next) => {
  res.clearCookie('user_id')
  res.json({
    message: '🆗'
  })
})

export { router as authRouter }