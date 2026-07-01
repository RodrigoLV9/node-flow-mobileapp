let Notifications: {
  setNotificationHandler: (handler: any) => void;
  requestPermissionsAsync: () => Promise<any>;
  scheduleNotificationAsync: (opts: any) => Promise<any>;
};

try {
  Notifications = require("expo-notifications");
} catch {
  const noop = () => {};
  Notifications = {
    setNotificationHandler: noop,
    requestPermissionsAsync: async () => ({}),
    scheduleNotificationAsync: async () => {},
  };
}

export { Notifications };
