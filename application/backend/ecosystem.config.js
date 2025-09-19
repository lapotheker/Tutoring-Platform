module.exports = {
  apps: [{
    name: 'backend',
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-3-101-142-73.us-west-1.compute.amazonaws.com',
      key: '~/.ssh/team04-app.pem',
      ref: 'origin/main',
      repo: 'git@github.com:CSC-648-SFSU/csc648-fa25-145-team04.git',
      path: '/home/ubuntu/csc648-fa25-145-team04/application/backend',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}