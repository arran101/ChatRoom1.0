const usersArray = [];

//join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  usersArray.push(user);

  return user;
}

//get current user
function getCurrentUser(id) {
  return usersArray.find((user) => user.id === id);
}

//user leaves chat
function userLeave(id) {
  const index = usersArray.findIndex(user => user.id === id);
  if (index !== -1) {
    return usersArray.splice(index, 1)[0];
  }
}

//get room Array
function getRoomUsers(room) {
  return usersArray.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
