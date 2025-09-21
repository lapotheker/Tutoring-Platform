# Credentials (Team 04)

## 1. Server URL or IP
- **Public DNS:** ec2-54-193-205-119.us-west-1.compute.amazonaws.com
## 2. SSH username
- **SSH user:** ubuntu
## 3. SSH key (file inside this folder)
- **Key file:** `credentials/team04-project.pem`
- **How to SSH (macOS/Linux/WSL/Git Bash):**
  ```bash
  chmod 400 credentials/team04-project.pem
  ssh -i credentials/team04-project.pem ubuntu@ec2-54-193-205-119.us-west-1.compute.amazonaws.com
## 4. Database URL/IP and port
- **Host:** 127.0.0.1
- **Port:** 3306
## 5. Database username
- **Grading (full privileges):** class_cto
- **App user (least privilege):** teamapp
## 6. Database passwords
- **class_cto:** CTO_TEMP_PASSWORD
- **teamapp:** APP_STRONG_PASSWORD
## 7. Database name
- **App DB:** teamapp_db
## 8. How to connect
- ### MySQL Workbench (Standard TCP/IP over SSH)
  - **SSH Hostname:** ec2-54-193-205-119.us-west-1.compute.amazonaws.com
  - **SSH Username:** ubuntu
  - **SSH Key File:** credentials/team04-project.pem
  - **MySQL Hostname:** 127.0.0.1
  - **MySQL Server Port:** 3306
  - **Username:** class_cto (or teamapp)
  - **Password:** see section 6
  - **Default Schema:** teamapp_db
