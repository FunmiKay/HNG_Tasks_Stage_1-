const express = require("express");
const StringAnalyzer = require("../utils/stringAnalyzer");
const stringStorage = require("../services/stringStorage");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { value } = req.body;

    if (value === undefined || value === null) {
      return res.status(400).json({
        error: "Bad Request",
        message: 'Missing "value" field in request body',
      });
    }

    if (typeof value !== "string") {
      return res.status(422).json({
        error: "Unprocessable Entity",
        message: 'Invalid data type for "value" (must be string)',
      });
    }

    if (await stringStorage.stringExists(value)) {
      return res.status(409).json({
        error: "Conflict",
        message: "String already exists in the system",
      });
    }

    const properties = StringAnalyzer.analyzeString(value);
    const id = properties.sha256_hash;
    const created_at = new Date().toISOString();

    const stringData = {
      id,
      value,
      properties,
      created_at,
    };

    await stringStorage.storeString(stringData);

    res.status(201).json(stringData);
  } catch (error) {
    console.error("Error creating string:", error);
    if (error.message === "String already exists") {
      return res.status(409).json({
        error: "Conflict",
        message: "String already exists in the system",
      });
    }
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to analyze string",
    });
  }
});

router.get("/:string_value", async (req, res) => {
  try {
    const { string_value } = req.params;
    const stringData = await stringStorage.getStringByValue(string_value);

    if (!stringData) {
      return res.status(404).json({
        error: "Not Found",
        message: "String does not exist in the system",
      });
    }

    res.json(stringData);
  } catch (error) {
    console.error("Error retrieving string:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve string",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const {
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character,
    } = req.query;

    const filters = {};

    if (is_palindrome !== undefined) {
      if (is_palindrome === "true") {
        filters.is_palindrome = true;
      } else if (is_palindrome === "false") {
        filters.is_palindrome = false;
      } else {
        return res.status(400).json({
          error: "Bad Request",
          message:
            "Invalid value for is_palindrome parameter (must be true or false)",
        });
      }
    }

    if (min_length !== undefined) {
      const minLen = parseInt(min_length);
      if (isNaN(minLen) || minLen < 0) {
        return res.status(400).json({
          error: "Bad Request",
          message:
            "Invalid value for min_length parameter (must be a non-negative integer)",
        });
      }
      filters.min_length = minLen;
    }

    if (max_length !== undefined) {
      const maxLen = parseInt(max_length);
      if (isNaN(maxLen) || maxLen < 0) {
        return res.status(400).json({
          error: "Bad Request",
          message:
            "Invalid value for max_length parameter (must be a non-negative integer)",
        });
      }
      filters.max_length = maxLen;
    }

    if (word_count !== undefined) {
      const wordCnt = parseInt(word_count);
      if (isNaN(wordCnt) || wordCnt < 0) {
        return res.status(400).json({
          error: "Bad Request",
          message:
            "Invalid value for word_count parameter (must be a non-negative integer)",
        });
      }
      filters.word_count = wordCnt;
    }

    if (contains_character !== undefined) {
      if (
        typeof contains_character !== "string" ||
        contains_character.length !== 1
      ) {
        return res.status(400).json({
          error: "Bad Request",
          message:
            "Invalid value for contains_character parameter (must be a single character)",
        });
      }
      filters.contains_character = contains_character;
    }

    const filteredStrings = await stringStorage.filterStrings(filters);

    res.json({
      data: filteredStrings,
      count: filteredStrings.length,
      filters_applied: filters,
    });
  } catch (error) {
    console.error("Error filtering strings:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to filter strings",
    });
  }
});

router.get("/filter-by-natural-language", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        error: "Bad Request",
        message: 'Missing "query" parameter',
      });
    }

    const parsedFilters = StringAnalyzer.parseNaturalLanguageQuery(query);

    if (Object.keys(parsedFilters).length === 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Unable to parse natural language query",
      });
    }

    const filteredStrings = await stringStorage.filterStrings(parsedFilters);

    res.json({
      data: filteredStrings,
      count: filteredStrings.length,
      interpreted_query: {
        original: query,
        parsed_filters: parsedFilters,
      },
    });
  } catch (error) {
    console.error("Error processing natural language query:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to process natural language query",
    });
  }
});

router.delete("/:string_value", async (req, res) => {
  try {
    const { string_value } = req.params;
    const deleted = await stringStorage.deleteStringByValue(string_value);

    if (!deleted) {
      return res.status(404).json({
        error: "Not Found",
        message: "String does not exist in the system",
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting string:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to delete string",
    });
  }
});

module.exports = router;
