const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Guest = require('../src/models/Guest');
const Agent = require('../src/models/Agent');

dotenv.config();

async function seedGuests() {
  await mongoose.connect('mongodb+srv://devwithyvonnie:tZcygeGSxiUPzBcW@pixiepostcluster.eszbi2i.mongodb.net/?retryWrites=true&w=majority&appName=pixiepostcluster');
  
  const agent = await Agent.findOne({ email: 'y.tran_martinmagicaltravels@yahoo.com' });
  if (!agent) {
    console.log('Agent not found.');
    process.exit(1);
  }

  const guests = [
    { name: 'Mickey Mouse', email: 'mickey@example.com', phone: '555-1234', agentId: agent._id },
    { name: 'Donald Duck', email: 'donald@example.com', phone: '555-5678', agentId: agent._id },
    { name: 'Goofy Goof', email: 'goofy@example.com', phone: '555-9012', agentId: agent._id },
    { name: 'Minnie Mouse', email: 'minnie@example.com', phone: '555-3456', agentId: agent._id }
  ];

  await Guest.insertMany(guests);

  console.log('✅ Seeded fake guests!');
  process.exit(0);
}

seedGuests().catch(err => {
  console.error(err);
  process.exit(1);
});
