// scripts/createTestAgent.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Agent = require('../src/models/Agent');

dotenv.config();

async function createAgent() {
  await mongoose.connect('mongodb+srv://devwithyvonnie:tZcygeGSxiUPzBcW@pixiepostcluster.eszbi2i.mongodb.net/?retryWrites=true&w=majority&appName=pixiepostcluster');
  const existing = await Agent.findOne({ email: 'y.tran_martinmagicaltravels@yahoo.com' });
  if (existing) {
    console.log('Agent already exists.');
    process.exit(0);
  }

  const agent = new Agent({
    name: 'Yahoo Agent',
    email: 'y.tran_martinmagicaltravels@yahoo.com',
    password: 'test1234',  // <-- plain-text is fine here; pre-save hook will hash it!
    emailProvider: 'yahoo'
  });

  await agent.save();
  console.log('✅ Test agent created!');
  process.exit(0);
}

createAgent().catch(err => {
  console.error(err);
  process.exit(1);
});
