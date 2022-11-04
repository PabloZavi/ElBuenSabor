import express, { response } from 'express';
import mercadopago from 'mercadopago';
import expressAsyncHandler from 'express-async-handler';
//import { isAuth } from '../utils.js';
//import cors from 'cors';

const pagoMercadoPagoRouter = express.Router();
//pagoMercadoPagoRouter.use(cors); 
pagoMercadoPagoRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    console.log(req.body.orderId)
    console.log(req.body.totalPrice)
    mercadopago.configure({
      access_token: process.env.MP_ACCESS_TOKEN,
    });
    let preference = {
      back_urls: {
        success: `${process.env.HOSTFRONT}/paidok`,
        failure: `${process.env.HOSTFRONT}/order/${req.body.orderId}?paid=false`,
        pending: `${process.env.HOSTFRONT}/order/${req.body.orderId}?paid=pending`,
      },
      auto_return: "approved",
      "payment_methods": {
        "excluded_payment_methods": [
            {
                "id": "master"
            }
        ],
        "excluded_payment_types": [
            {
                "id": "ticket"
            }
        ],
        "installments": 12
      },

      external_reference: req.body.orderId,
      items: [
        {
          title: req.body.orderId,
          //description: req.body.description,
          unit_price: parseFloat(req.body.totalPrice),
          quantity: 1,
        },
      ],
    };

    
    const responseMP = await mercadopago.preferences.create(preference);
    console.log(responseMP.body.init_point)
    //res.redirect(responseMP.body.init_point)
    //redirect(responseMP.body.init_point)
    res.status(200).send({message: responseMP.body.init_point})
    //res.redirect(responseMP.body.init_point)  
  })
 
);

export default pagoMercadoPagoRouter;
