import { askai } from "../utils/ai.js";
import Note from "../models/noteModel.js";

export const generateAI = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    const note = await Note.findOne({
      _id: id,
      owner: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    let prompt = "";

    if (type === "summary") {
      prompt = `
      Summarize this note clearly in short:

      ${note.content}
      `;
    }

    if (type === "actions") {
      prompt = `
      Extract actionable tasks from this note.
      Return bullet points only.

      ${note.content}
      `;
    }

    if (type === "title") {
      prompt = `
      Generate a short professional title for this note:

      ${note.content}
      `;
    }

    const result = await askai(prompt);

    return res.json({
      result,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "AI generation failed",
    });
  }
};