const StringData = require("../models/StringData");

class StringStorage {
  async storeString(stringData) {
    try {
      const stringDoc = new StringData(stringData);
      await stringDoc.save();
      return stringData;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("String already exists");
      }
      throw error;
    }
  }

  async getStringById(id) {
    try {
      const stringDoc = await StringData.findOne({ id });
      return stringDoc ? stringDoc.toObject() : null;
    } catch (error) {
      throw error;
    }
  }

  async getStringByValue(value) {
    try {
      const stringDoc = await StringData.findOne({ value });
      return stringDoc ? stringDoc.toObject() : null;
    } catch (error) {
      throw error;
    }
  }

  async getAllStrings() {
    try {
      const stringDocs = await StringData.find({}).sort({ created_at: -1 });
      return stringDocs.map((doc) => doc.toObject());
    } catch (error) {
      throw error;
    }
  }

  async filterStrings(filters) {
    try {
      const query = {};

      if (filters.is_palindrome !== undefined) {
        query["properties.is_palindrome"] = filters.is_palindrome;
      }

      if (filters.min_length !== undefined) {
        query["properties.length"] = { $gte: filters.min_length };
      }

      if (filters.max_length !== undefined) {
        if (query["properties.length"]) {
          query["properties.length"].$lte = filters.max_length;
        } else {
          query["properties.length"] = { $lte: filters.max_length };
        }
      }

      if (filters.word_count !== undefined) {
        query["properties.word_count"] = filters.word_count;
      }

      if (filters.contains_character !== undefined) {
        const char = filters.contains_character.toLowerCase();
        query[`properties.character_frequency_map.${char}`] = { $exists: true };
      }

      const stringDocs = await StringData.find(query).sort({ created_at: -1 });
      return stringDocs.map((doc) => doc.toObject());
    } catch (error) {
      throw error;
    }
  }

  async deleteString(id) {
    try {
      const result = await StringData.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async deleteStringByValue(value) {
    try {
      const result = await StringData.deleteOne({ value });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async stringExists(value) {
    try {
      const stringDoc = await StringData.findOne({ value });
      return stringDoc !== null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new StringStorage();
