import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils.js';
import expressAsyncHandler from 'express-async-handler'

const userRouter = express.Router();

//Con asyncHandler podemos manejar excepciones dentro de las rutas async de express
//sin tener que usar .then y catch. Las manejaremos en server.js
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ emailUsuario: req.body.emailUsuario });
    if (user) {
      if (bcrypt.compareSync(req.body.passwordUsuario, user.passwordUsuario)) {
        res.send({
          _id: user._id,
          nombreUsuario: user.nombreUsuario,
          emailUsuario: user.emailUsuario,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Email o password inválido' });
  })
);

export default userRouter;