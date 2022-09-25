import jwt from 'jsonwebtoken';

//recibimos un usuario y le asignamos un token
//JWT_SECRET es una variable como un 'password' del sistema para encriptar la información
export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      nombreUsuario: user.nombreUsuario,
      emailUsuario: user.emailUsuario,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );
};
