// application/backend/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'index.js',
      cwd: '.', // we're already in application/backend
      env: { NODE_ENV: 'production', PORT: 3000 }
    }
  ],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-3-101-142-73.us-west-1.compute.amazonaws.com',
      key: '~/.ssh/team04-app.pem',
      ref: 'origin/main',
      repo: 'git@github.com:CSC-648-SFSU/csc648-fa25-145-team04.git',
      path: '/home/ubuntu/apps/csc648',     // base deploy dir (PM2 manages current/)
      'post-deploy': [
        'cd application/backend',
        'npm ci',
        // relative to current/application/backend
        'pm2 startOrRestart ecosystem.config.js --only backend',
        'pm2 save'
      ].join(' && ')
    }
  }
}
