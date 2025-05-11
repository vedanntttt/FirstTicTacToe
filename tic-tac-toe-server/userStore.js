// Simple file-based user storage for demo
const fs = require('fs');
const path = require('path');
const USERS_FILE = path.join(__dirname, 'users.json');

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function addUser(email, password) {
  const users = readUsers();
  // Only allow signup if user does not exist
  if (users.find(u => u.email === email)) return false; // already exists
  users.push({ email, password, canLogin: true });
  writeUsers(users);
  return true;
}

function findUser(email, password) {
  const users = readUsers();
  // Only allow login if canLogin is true
  return users.find(u => u.email === email && u.password === password && u.canLogin);
}

module.exports = { addUser, findUser };
