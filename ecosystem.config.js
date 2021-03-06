module.exports = {
  apps: [
    {
      name: "skyDrop",
      script: "./bin/www",
      env_development: {
        NODE_ENV: "development",
        REMOTE_API_URL: "https://reqres.in/api",
        MONGODB_URI: "mongodb://192.168.68.101:27017/skydrop",
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: "production",
        REMOTE_API_URL: "https://reqres.in/api",
        MONGODB_URI: "mongodb://192.168.68.101:27017/skydrop",
        MONGODB_USER: "",
        MONGODB_PASS: "",
        PORT: 3001,
      },
    },
  ],
};
