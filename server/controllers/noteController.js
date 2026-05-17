import Note from "../models/noteModel.js";
import crypto from "crypto";

export const createNote = async (req, res) => {
  try {
    const { title, content, tags, category } = req.body;

    const note = await Note.create({
      title: title || "Untitled",
      content: content || "",
      tags: tags || [],
      category: category || "",
      owner: req.user._id,
    });

    return res.status(201).json({ note });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const note = await Note.findOneAndUpdate(
      {
        _id: id,
        owner: req.user._id,
      },
      updates,
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.json({ note });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { tags, category, archived, q, sort } = req.query;

    const filter = {
      owner: req.user._id,
    };

    if (archived !== undefined) {
      filter.archived = archived === "true";
    }

    if (category) {
      filter.category = category;
    }

    if (tags) {
      filter.tags = {
        $in: tags.split(",").map((tag) => tag.trim()),
      };
    }

    let query;

    if (q) {
      query = Note.find({
        ...filter,
        $text: {
          $search: q,
        },
      });
    } else {
      query = Note.find(filter);
    }

    if (sort === "recent") {
      query = query.sort({ updatedAt: -1 });
    } else {
      query = query.sort({ updatedAt: -1 });
    }

    const notes = await query.exec();

    return res.json({ notes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({
      _id: id,
      owner: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.json({ note });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const archiveNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndUpdate(
      {
        _id: id,
        owner: req.user._id,
      },
      {
        archived: true,
      },
      {
        new: true,
      }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.json({ note });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.json({ message: "Note deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const shareNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({
      _id: id,
      owner: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!note.publicId) {
      note.publicId = crypto.randomBytes(6).toString("hex");
    }

    note.isPublic = true;

    await note.save();

    return res.json({
      publicId: note.publicId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const unshareNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({
      _id: id,
      owner: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.isPublic = false;
    note.publicId = null;

    await note.save();

    return res.json({
      message: "Unshared",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPublicNote = async (req, res) => {
  try {
    const { publicId } = req.params;

    const note = await Note.findOne({
      publicId,
      isPublic: true,
    }).populate("owner", "name");

    if (!note) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    return res.json({ note });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const getInsights = async (req, res) => {
  try {
    const owner = req.user._id;

    const totalNotes = await Note.countDocuments({
      owner,
    });

    const recent = await Note.find({
      owner,
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title updatedAt");

    const tagsAgg = await Note.aggregate([
      {
        $match: {
          owner,
        },
      },
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    const since = new Date();
    since.setDate(since.getDate() - 6);

    const weekly = await Note.aggregate([
      {
        $match: {
          owner,
          updatedAt: {
            $gte: since,
          },
        },
      },
      {
        $project: {
          day: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$updatedAt",
            },
          },
        },
      },
      {
        $group: {
          _id: "$day",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    return res.json({
      totalNotes,
      recent,
      mostUsedTags: tagsAgg,
      aiUsage: {
        calls: 0,
      },
      weeklyActivity: weekly,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
