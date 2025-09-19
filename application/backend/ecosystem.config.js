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
      'post-deploy': 'cd application/backend && npm ci --omit=dev && pm2 startOrRestart ecosystem.config.js --only backend',
    }
  }
}