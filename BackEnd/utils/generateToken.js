const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: username,
      role:role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );
}

module.exports = generateToken;
// The code above is a utility function that generates a JSON Web Token (JWT) for a user. The function takes a user object as an argument and signs the token using the JWT_SECRET environment variable. The token includes the user's id, username, role, and email, and expires after 1 hour. The function returns the generated token.