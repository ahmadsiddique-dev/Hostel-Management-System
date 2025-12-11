const { processAdminQuery } = require('../services/adminAIService');
const formatResponse = require('../utils/formatResponse');

const handleAdminQuery = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json(formatResponse('admin', 'Prompt is required', null));
    }

    const aiResult = await processAdminQuery(prompt);

    if (aiResult.success) {
      // Check if response is JSON (database query) or Text
      let finalResponse = aiResult.response;
      let isAction = false;

      // Try to parse if it looks like JSON
      try {
        if (finalResponse.includes('```json')) {
            const cleanJson = finalResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            finalResponse = JSON.parse(cleanJson);
            isAction = true;
        }
      } catch (e) {
        // Not JSON, continue as text
        isAction = false;
      }

      res.json(formatResponse('admin', 'Query processed', finalResponse, { isAction }));
    } else {
      res.status(500).json(formatResponse('admin', 'AI Service failed', null));
    }
  } catch (error) {
    console.error('Admin Controller Error:', error);
    res.status(500).json(formatResponse('admin', 'Server error', null));
  }
};

module.exports = { handleAdminQuery };
