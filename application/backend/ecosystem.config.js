module.exports = {
  apps: [{
    name: 'backend',
    cwd: ".",
    script: 'index.js',
    env: { NODE_ENV: "production", PORT: "3000" }
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: '50.18.23.168',
      ssh_options: 'StrictHostKeyChecking=no',
      key: '~/.ssh/team04-project.pem',
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
        "pm2 startOrRestart application/backend/ecosystem.config.js --only backend && pm2 save"

    }
  }
}