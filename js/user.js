function generateId () {
  return Math.random().toString(36).substr(2, 18);
}

const setUserClientId = async () => {
  return localStorage.setItem("clientId", generateId());
};

const getUserClientId = () => {
  return localStorage.getItem("clientId");
};

const cleanUserClientId = () => {
  localStorage.removeItem("clientId");
};
