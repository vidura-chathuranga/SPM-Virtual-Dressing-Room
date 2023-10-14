import path from "path";
import Human from "../models/human.model.js";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getAllHumanModels = async (req, res) => {
  try {
    const Models = await Human.find({});

    res.status(200).json(Models);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
export const createHumanModel = async (req, res) => {
  const { bust, chestWidth, height, hip, name, weist } = req.body;
  const { filename, path } = req.file;

  try {
    const newModel = await Human.create({
      name,
      chestWidth,
      height,
      bust,
      weist,
      hip,
      fileName: filename,
      filePath: path,
    });

    res.status(201).json(newModel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteModel = async (req, res) => {
  const { id } = req.params;

  console.log(id);
  try {
    const deletedModel = await Human.findOneAndDelete({ _id: id });

    console.log(deletedModel);

    const filePath = `../backend/files/${deletedModel.fileName}`;

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        // Handle the error, send an error response to the client, etc.
      } else {
        console.log("File deleted successfully");
        // Perform any additional logic, send a success response to the client, etc.
      }
    });

    res.status(200).json(deletedModel);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getGLB = async (req, res) => {
  const fileName = req.params.url;
  try {
    const filePath = path.join(__dirname, "../files/", fileName);

    res.json(filePath);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const editHumanModel = async (req, res) => {
  const { _id, bust, chestWidth, height, hip, name, weist, existFile } =
    req.body;
    const { filename, path } = req.file;

  try {
    const editedFile = await Human.findByIdAndUpdate(_id, {
      name,
      chestWidth,
      height,
      bust,
      weist,
      hip,
      fileName: filename,
      filePath: path,
    });

    const filePath = `../backend/files/${existFile}`;

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        // Handle the error, send an error response to the client, etc.
      } else {
        console.log("File deleted successfully");
        // Perform any additional logic, send a success response to the client, etc.
      }
    });

    res.status(200).json(editedFile);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({error:error.message});
  }
};
