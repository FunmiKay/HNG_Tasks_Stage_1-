const mongoose = require('mongoose');

const StringDataSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  value: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  properties: {
    length: {
      type: Number,
      required: true
    },
    is_palindrome: {
      type: Boolean,
      required: true,
      index: true
    },
    unique_characters: {
      type: Number,
      required: true
    },
    word_count: {
      type: Number,
      required: true,
      index: true
    },
    sha256_hash: {
      type: String,
      required: true
    },
    character_frequency_map: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

StringDataSchema.index({ 'properties.length': 1 });
StringDataSchema.index({ 'properties.word_count': 1 });
StringDataSchema.index({ 'properties.is_palindrome': 1 });

module.exports = mongoose.model('StringData', StringDataSchema);