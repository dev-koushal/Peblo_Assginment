import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled' },
  content: { type: String, default: '' },
  tags: [{ type: String }],
  category: { type: String, default: '' },
  archived: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: false },
  publicId: { type: String, default: null, index: true },
}, { timestamps: true });

// Text index for keyword search
noteSchema.index({ title: 'text', content: 'text', tags: 'text', category: 'text' });

const Note = mongoose.model('Note', noteSchema);

export default Note;
