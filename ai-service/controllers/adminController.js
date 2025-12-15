// const { analyzeRequest, summarizeResults } = require('../services/adminAIService');
// const formatResponse = require('../utils/formatResponse');
// const Student = require('../models/Student');
// const Room = require('../models/Room');
// const Attendance = require('../models/Attendance');
// const Complaint = require('../models/Complaint');
// const User = require('../models/User');
// const Fee = require('../models/Fee');
// const Notification = require('../models/Notification');

// const models = { 
//   Student, 
//   Room, 
//   Attendance, 
//   Complaint, 
//   User, 
//   Fee, 
//   Notification 
// };

// Helper: Auto-populate common fields for specific models to give tailored context
// const getPopulateOptions = (collection) => {
//   switch (collection) {
//     case 'Student': return ['room', 'user']; // Shows Room Number & User Name
//     case 'Room': return ['occupants']; // Shows Student details in Room
//     case 'Attendance': return ['student']; // Shows Student Name
//     case 'Complaint': return ['student', 'resolvedBy'];
//     case 'Fee': return ['student'];
//     case 'Notification': return ['student', 'recipient'];
//     default: return [];
//   }
// };

// const handleAdminQuery = async (req, res) => {
//   try {
//     const { prompt, history } = req.body;

//     if (!prompt) {
//       return res.status(400).json(formatResponse('admin', 'Prompt is required', null));
//     }

//     // --- HELPER: Strip Markdown ---
//     const stripMarkdown = (text) => {
//       // Remove ```json ... ``` or just ``` ... ```
//       return text.replace(/```(json)?/g, '').replace(/```/g, '').trim();
//     };

//     // --- STEP 1: ANALYZE REQUEST (Decide if DB is needed) ---
//     const getDecision = async (currentPrompt, attempts = 0) => {
//       const MAX_RETRIES = 2;
      
//       const aiResult = await analyzeRequest(currentPrompt, history);
//       if (!aiResult.success) throw new Error("AI Service Unreachable");

//       let responseText = aiResult.response;

//       // Try to look for JSON command
//       // We first strip markdown to make regex matching easier and more robust
//       const cleanText = stripMarkdown(responseText);
//       const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

//       if (jsonMatch) {
//          try {
//            const command = JSON.parse(jsonMatch[0]);
//            return { type: 'COMMAND', command, raw: responseText };
//          } catch (parseError) {
//             console.error("❌ JSON Parse Error:", parseError.message);
//             if (attempts < MAX_RETRIES) {
//                const retryPrompt = `
// System Error: Your response contained invalid JSON.
// Received: ${jsonMatch[0]}
// Error: ${parseError.message}

// Task: Output ONLY valid JSON, no comments, no extra text.
// `;
//                return await getDecision(retryPrompt, attempts + 1);
//             }
//          }
//       }

//       // If no JSON, treat as conversation
//       return { type: 'TEXT', response: responseText };
//     };

//     const decision = await getDecision(prompt);

//     // --- STEP 2: EXECUTE OR RETURN ---
//     if (decision.type === 'TEXT') {
//       return res.json(formatResponse('admin', 'Query processed', decision.response, { isAction: false }));
//     }

//     if (decision.type === 'COMMAND') {
//        const { command } = decision;

//        if (command.action === 'database_query' && models[command.collection]) {
//           console.log(`🛠 Executing Admin Query: ${command.operation} on ${command.collection}`);
          
//           try {
//               const Model = models[command.collection];
//               let result;

//               // EXECUTE DB OPERATION
//               if (command.operation === 'find') {
//                 const populate = getPopulateOptions(command.collection);
//                 result = await Model.find(command.query).populate(populate).limit(50);
//               } else if (command.operation === 'findOne') {
//                 const populate = getPopulateOptions(command.collection);
//                 result = await Model.findOne(command.query).populate(populate);
//               } else if (command.operation === 'countDocuments') {
//                 result = await Model.countDocuments(command.query);
//               } else if (command.operation === 'aggregate') {
//                 const pipeline = command.pipeline || [];
//                 result = await Model.aggregate(pipeline);
//               } else if (command.operation === 'updateMany') {
//                 result = await Model.updateMany(command.query, command.updateData);
//               } else if (command.operation === 'updateOne') {
//                 result = await Model.updateOne(command.query, command.updateData);
//               } else {
//                 throw new Error(`Unknown operation: ${command.operation}`);
//               }

//               // --- STEP 3: SUMMARIZE RESULTS (Separate Prompt) ---
//               const summaryResult = await summarizeResults(prompt, result);
              
//               let finalOutput = summaryResult.response;

//               // SAFETY CHECK ROBUST: If output contains JSON structure or code blocks
//               // Check for: 
//               // 1. Starts with { (after trimming)
//               // 2. Contains "action": "database_query"
//               // 3. Wrapped in ```json
//               const strippedOutput = stripMarkdown(finalOutput);
              
//               const isJsonMsg = strippedOutput.startsWith('{') && strippedOutput.endsWith('}');
//               const hasRestrictedKeys = finalOutput.includes('"action":') || finalOutput.includes('"database_query"');

//               if (isJsonMsg || hasRestrictedKeys) {
//                  console.warn("⚠️ AI returned JSON during summary phase. Masking output.");
//                  finalOutput = "I have successfully processed your request. Please check the database for details.";
//               }

//               return res.json(formatResponse('admin', 'Query processed', finalOutput, { isAction: true }));

//           } catch (dbError) {
//              console.error("❌ Database Execution Error:", dbError.message);
//              return res.json(formatResponse('admin', 'Database Error', `I attempted to run the query but failed: ${dbError.message}`, { isAction: true }));
//           }
//        } else {
//           return res.json(formatResponse('admin', 'Invalid Command', "I generated an invalid database command. Please try asking differently.", { isAction: false }));
//        }
//     }

//   } catch (error) {
//     console.error('Admin Controller Fatal:', error);
//     res.status(500).json(formatResponse('admin', 'An internal error occurred.', null));
//   }
// };

// module.exports = { handleAdminQuery };
