import express from 'express';
import { getAllInvoices } from '../controllers/invoiceController.js';
import AuthRequest from '../middleware/authMiddleware.js';


const Router = express.Router();

Router.use(AuthRequest);

Router.get('/all',getAllInvoices);

export default Router;