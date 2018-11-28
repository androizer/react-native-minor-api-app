const sharedResources = {};

sharedResources.setUsername = function SetUsername(username) {
  sharedResources.setUsername.username = username;
};

sharedResources.getUsername = function GetUsername() {
  return sharedResources.setUsername.username;
};

sharedResources.setUsername.username = 'Default';

export default sharedResources;
