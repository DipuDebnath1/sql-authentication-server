const express = require('express')
const cors = require('cors')
const app = express()
const User = require("./models/Users")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
// const verifyToken = require('./tokenvaryfy/TokenVeryfy')
app.use(express.json())

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}))

app.use(cookieParser())
const jwtSec = "token"

// Middleware to verify JWT from the cookie
const verifyToken = async (req, res, next) => {
  // const token = req.cookies?.["test-cookie"];
  const token = await req.cookies?.['test-cookie'];

  console.log(token);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, jwtSec, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log(decoded.dataValues);
    req.user = decoded;
    next();
  });
}


app.get('/', (req, res) => {
  res.send('working server ')
})

app.post('/signup', async (req, res) => {

  try {
    const user = await req.body;
    const isAvailable = await User.findOne({ where: { email: user.email } })
    console.log(isAvailable);

    if (!isAvailable) {
      const setuser = await User.create(req.body)
      const token = jwt.sign(user, jwtSec, { expiresIn: '1h' })
      res.cookie('test-cookie', token, { httpOnly: true })
      return res.json({ message: 'signup success', data: { email: setuser.email, name: setuser.name }, token: token, signup: true })
    }
    return res.json({ message: 'this email already  added !!! ', signup: false })
  }
  catch (err) {
    console.log('error:', err);
  }

  // const user = await User.create(req.body);
  // res.json(user)
})

app.post('/login', async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email: email } })

    if (user?.password === password) {
      var token = jwt.sign({ user: user.dataValues }, jwtSec, { expiresIn: '1h' });
      res.cookie('test-cookie', token, { httpOnly: true });
      return res.json({ message: "login success !!!", token: token, data: { name: user.name, email: user.email } })
    }
    return res.json({ message: "Wrong password", signup: false })
    // return res.json({message:'this email already  added !!! ', signup:false})
    // 
  }
  catch (error) {
    return res.json({ message: "login filed" })
  }
})

app.get("/asdf", verifyToken, (req, res) => {

  console.log(req.user)

  res.json({ user: req.user })
})

app.get('/logout',(req,res)=>{
  console.log("hello");
  res.clearCookie('test-cookie');
  res.json({ success: true });
})

app.get('/getuser', verifyToken, async (req, res) => {
  //  // Access cookies from the request object
  //   const cookies = await req.cookies?.['test-cookie'];
  //   const cookies = req.cookies?.['test-cookie'];

  // if (!cookies) {
  //     console.log('data not found ');
  //     return res.status(401).json({ message: 'Unauthorized' });
  //   }

  // // //  Verify the JWT token

  //   jwt.verify(cookies, jwtSec, (err, decoded) => {
  //     if (err) {
  //         console.log('please login');
  //       return res.status(401).json({ message: 'Unauthorized' });
  //     }

  //     // The token is valid, you can use the decoded information (user object in this case)
  //     console.log('Decoded JWT:', decoded.dataValues);
  //     // res.json({ message: 'Protected route accessed' })

  //         res.json({message:decoded.dataValues})
  //   })

  const user = await User.findAll()
  res.json(user);

  console.log('varyfy success!!!');
  // res.json(req.body)
  //
})

app.listen(5000, () => {
  console.log('server is runing ');
})

