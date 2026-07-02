# 🚀 Quickstart & Operations Guide

Follow these simple, step-by-step instructions to manage your Self-Healing Task Management System.

## 1. 🟢 How to Start the Server

Whenever you want to run your project, open your terminal (Command Prompt, PowerShell, or VS Code Terminal) and follow these steps:

1. Navigate to your project folder:
   ```cmd
   cd /d e:\DevOps
   ```
2. Start all services in the background:
   ```cmd
   docker-compose up -d
   ```
   *(Note: The `-d` flag runs it in the background so you can still use your terminal. You only need to add `--build` if you modified the code. Otherwise, just `up -d` is much faster!)*

## 2. 🌐 Accessing the Application

Once the terminal says "Started", your project is live!

- **Open your Web Browser** (Chrome, Edge, Safari, etc.)
- **Click or go to this link:** [http://localhost:3000](http://localhost:3000)

You can now use the dashboard, add tasks, and test the "Simulate Crash" button.

## 3. 🛑 How to Stop and Close Everything Safely

When you are done working and want to shut down the servers gracefully to save your computer's memory and CPU:

1. Open your terminal.
2. Ensure you are in the project folder:
   ```cmd
   cd /d e:\DevOps
   ```
3. Run the stop command:
   ```cmd
   docker-compose down
   ```
This command safely stops all your Docker containers and cleans up the temporary networks it created.

## 4. 🧹 Total Reset (Optional)
If you ever want to wipe everything and start completely fresh (this removes the built images), run:
```cmd
docker-compose down --rmi all
```
