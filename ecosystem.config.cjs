module.exports = {
  apps: [
    {
      name: "oymedia-backend",
      script: "dist/index.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
        HOST: "0.0.0.0",
      },
    },
  ],
};
