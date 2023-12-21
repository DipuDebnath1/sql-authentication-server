// Middleware to verify JWT from the cookie
 const verifyToken = async(req, res, next) => {
    // const token = req.cookies?.["test-cookie"];
      const token = await req.cookies?.['test-cookie'];

    console.log(token);
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      req.user = decoded;
      next();
    });
  }

  module.exports=verifyToken