import jwt from 'jsonwebtoken';
interface decodedToken {
  user: {
    _id: string;
    username: string;
  },
  iat:Number;
}

const verifyToken = (req:any, res:any, next:any) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET environment variable is not defined.');
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err:any, decoded:any) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // If token is valid, attach the decoded payload to the request object
    req.user = decoded;
    next();
  });
};

export default verifyToken;