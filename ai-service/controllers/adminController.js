const { processAdminQuery } = require('../services/adminAIService');
const formatResponse = require('../utils/formatResponse');
const Student = require('../models/Student');
const Room = require('../models/Room');
const Attendance = require('../models/Attendance');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Fee = require('../models/Fee');
const Notification = require('../models/Notification');

const models = { 
  Student, 
  Room, 
  Attendance, 
  Complaint, 
  User, 
  Fee, 
  Notification 
};

// Helper: Auto-populate common fields for specific models to give tailored context
const getPopulateOptions = (collection) => {
  switch (collection) {
    case 'Student': return ['room', 'user']; // Shows Room Number & User Name
    case 'Room': return ['occupants']; // Shows Student details in Room
    case 'Attendance': return ['student']; // Shows Student Name
    case 'Complaint': return ['student', 'resolvedBy'];
    case 'Fee': return ['student'];
    case 'Notification': return ['student', 'recipient'];
    default: return [];
  }
};

const handleAdminQuery = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json(formatResponse('admin', 'Prompt is required', null));
    }

    // --- RECURSIVE FUNCTION FOR RETRY LOGIC ---
    const executeAIChain = async (currentPrompt, attempts = 0) => {
      const MAX_RETRIES = 2; // Allow 1 initial + 1 retry for errors
      
      // 1. Get AI Response
      const aiResult = await processAdminQuery(currentPrompt);
      if (!aiResult.success) throw new Error("AI Service Unreachable");

      let responseText = aiResult.response;

      // 2. Try to Extract JSON
      // Regex: Matches first '{' ... last '}' across multiple lines
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
         // Potential command found
         const jsonStr = jsonMatch[0];
         
         try {
           const command = JSON.parse(jsonStr);

           // Check if it is a valid database command
           if (command.action === 'database_query' && models[command.collection]) {
             console.log(`🛠 Executing Admin Query (Attempt ${attempts}): ${command.operation} on ${command.collection}`);
             
             const Model = models[command.collection];
             let result;

             // EXECUTE with Safety Wrapper
             try {
                if (command.operation === 'find') {
                  const populate = getPopulateOptions(command.collection);
                  result = await Model.find(command.query).populate(populate).limit(50);
                } else if (command.operation === 'findOne') {
                  const populate = getPopulateOptions(command.collection);
                  result = await Model.findOne(command.query).populate(populate);
                } else if (command.operation === 'countDocuments') {
                  result = await Model.countDocuments(command.query);
                } else if (command.operation === 'aggregate') {
                  const pipeline = command.pipeline || [];
                  result = await Model.aggregate(pipeline);
                } else if (command.operation === 'updateMany') {
                  result = await Model.updateMany(command.query, command.updateData);
                } else if (command.operation === 'updateOne') {
                  result = await Model.updateOne(command.query, command.updateData);
                } else {
                  throw new Error(`Unknown operation: ${command.operation}`);
                }

                // SUCCESS: Re-prompt for Summary
                const resultStr = JSON.stringify(result);
                const truncated = resultStr.length > 5000 ? resultStr.substring(0, 5000) + '...' : resultStr;
                
                const summaryPrompt = `
System Info: Query Executed Successfully.
Command: ${JSON.stringify(command)}
Result: ${truncated}

User Original Prompt: ${prompt}

Task: Summarize the result in natural language. If result is empty, state it clearly.
`;
                return await processAdminQuery(summaryPrompt); // Return the final summary

             } catch (dbError) {
                // DATABASE ERROR (e.g. Invalid query syntax)
                console.error("❌ Database Execution Error:", dbError.message);
                
                if (attempts < MAX_RETRIES) {
                  const retryPrompt = `
System Error: The database command failed.
Command: ${JSON.stringify(command)}
Error Message: ${dbError.message}

Task: Fix the JSON command and try again.
`;
                  return await executeAIChain(retryPrompt, attempts + 1);
                } else {
                  // Retries exhausted
                  return { success: true, response: `I attempted to query the database but encountered an error: ${dbError.message}` };
                }
             }
           }
         } catch (parseError) {
            // JSON PARSE ERROR
            console.error("❌ JSON Parse Error:", parseError.message);
            if (attempts < MAX_RETRIES) {
               const retryPrompt = `
System Error: Your response contained invalid JSON.
Received: ${jsonStr}
Error: ${parseError.message}

Task: Output ONLY valid JSON, no comments, no extra text.
`;
               return await executeAIChain(retryPrompt, attempts + 1);
            }
         }
      }

      // If no JSON found, or it's just text, return it directly
      return aiResult;
    };

    // --- START CHAIN ---
    const finalResult = await executeAIChain(prompt);
    
    // Check if the final result is still just raw JSON (edge case)
    // If it looks like JSON, we mask it to be safe
    let cleanOutput = finalResult.response;
    if (cleanOutput.trim().startsWith('{') && cleanOutput.trim().endsWith('}')) {
       cleanOutput = "I processed the request but could not generate a proper summary.";
    }

    res.json(formatResponse('admin', 'Query processed', cleanOutput, { isAction: true }));

  } catch (error) {
    console.error('Admin Controller Fatal:', error);
    res.status(500).json(formatResponse('admin', 'An internal error occurred.', null));
  }
};

module.exports = { handleAdminQuery };
