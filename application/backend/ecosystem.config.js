module.exports = {
  apps: [{
    name: 'backend',
    cwd: "application/backend",
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-54-219-99-133.us-west-1.compute.amazonaws.com',
      key: '~/.ssh/team04-project.pem',
      ref: 'origin/main',
      repo: 'git@github.com:CSC-648-SFSU/csc648-fa25-145-team04.git',
      path: '/home/ubuntu/csc648-fa25-145-team04',
      "post-deploy": "npm ci --omit=dev --prefix application/backend && pm2 startOrRestart application/backend/ecosystem.config.js --only backend"
    }
  }
}