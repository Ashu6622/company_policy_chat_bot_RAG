/**
 * Implementation plan
 * Stage 1: Indexing
 * 1. Load the document ✅
 * 2. Chuck the document ✅
 * 3. Generate the vector embeddings ✅
 * 4. Store the vector embedding - Vector database ✅
 * 
 * Srage 2: Using the chatbot
 * 1. Setup LLM 
 * 2. Add retrieval step
 * 3. Pass input + relevant information to LLM
 * 4. Congratulations:
 */

import {indexTheDocument} from './prepare.js'

const filePath = './icici_bank.pdf'

indexTheDocument(filePath);