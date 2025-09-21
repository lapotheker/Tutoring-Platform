module.exports = {
  apps: [{
    name: 'backend',
    cwd: "application/backend",
    script: 'index.js',
    env: { NODE_ENV: "production", PORT: "3000" }
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-54-193-205-119.us-west-1.compute.amazonaws.com',
      key: 'credentials/team04-project.pem',
      ref: 'origin/main',
      repo: 'git@github.com:CSC-648-SFSU/csc648-fa25-145-team04.git',
      path: '/home/ubuntu/csc648-fa25-145-team04',
      "post-deploy": 
        // install backend deps
        "npm ci --omit=dev --prefix application/backend && " +
        // build the Vite app
        "npm ci --prefix application/team-info-website && " +
        "npm run --prefix application/team-info-website build && " +
        // publish static files to Nginx root
        "rsync -ah --delete application/team-info-website/dist/ /var/www/team04-frontend/ && " +
        // restart api
        "pm2 startOrRestart ecosystem.config.js --only backend && pm2 save"
    }
  }
}