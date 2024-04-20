// when we refresh our maps get empty and generate a new user sessionId as our server restarts
const sessionIdToUserMap = new Map();
// maping user id and data together
function setUser(id, user) {
    sessionIdToUserMap.set(id, user);
}
// if id then by mapping we can get user data
function getUser(id) {
    return sessionIdToUserMap.get(id);
}
module.exports = {
    setUser,
    getUser
}