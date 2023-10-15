import express from 'express';
import AuthRequest from '../middleware/authMiddleware.js';
import { createHumanModel, deleteModel, editHumanModel, getAllHumanModels, getGLB } from '../controllers/humanModelController.js';
import multer from 'multer';

const Router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
      cd(null, 'files')
    },
    filename: (req, file, cd) => {
      cd(null, Date.now() + '-' + file.originalname)
    },
  });

  const upload = multer({ storage: storage });

//   const upload = multer({ storage: storage });
// const upload = multer({ dest: 'uploads/' }); 

Router.get('/getglb/:url',getGLB);
// use middleWare to validate route
Router.use(AuthRequest);

Router.get("/",getAllHumanModels);
Router.post("/add",upload.single('file'),createHumanModel);
Router.delete('/delete/:id',deleteModel);
Router.put("/edit",upload.single('file'),editHumanModel);

export default Router;
