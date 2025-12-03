const Invite = require('../models/Invite');

const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const generateUniqueCode = async () => {
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = generateCode();
    const existing = await Invite.findOne({ code });
    if (!existing) {
      isUnique = true;
    }
  }

  return code;
};

module.exports = { generateUniqueCode };
