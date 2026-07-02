# Self-Healing Task Management System Using DevOps

A full-stack containerized application that demonstrates self-healing infrastructure. The system automatically detects failures in the backend and restarts the container without human intervention.

## 🧩 Architecture

- **Frontend**: React + Vite + Tailwind CSS (Served via Nginx, Port 3000)
- **Backend**: Node.js + Express (In-memory storage, Port 5000)
- **Monitor**: Node.js script (Accesses Docker socket to restart containers)
- **CI/CD**: GitHub Actions pipeline

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- Note: If on Windows, ensure Docker Desktop is configured to use the WSL 2 backend.

### Running the Project

1. Clone or navigate to the project directory.
2. Build and start all services using Docker Compose:

   ```bash
   docker-compose up --build -d
   ```

3. Access the application:
   - **Frontend UI**: `http://localhost:3000`
   - **Backend API**: `http://localhost:5000/tasks`

## 🎬 Demonstration Flow

1. Open the application at `http://localhost:3000`. You will see the system status indicates **Healthy**.
2. Add, toggle, and delete some tasks to verify normal operation.
3. Click the **"Simulate Crash"** button on the UI (or manually access `http://localhost:5000/crash`).
4. The backend server process will immediately exit.
5. Watch the UI: The status indicator will change to **System Down**.
6. Behind the scenes, the `monitor` container detects the `/health` endpoint failure.
7. The monitor issues a command to the Docker socket to restart the `devops_backend` container.
8. Wait ~5 seconds. The UI will automatically detect the backend is back online, and the status will return to **Healthy**.

## 🛠️ Viewing Logs

To see the self-healing process in action, view the monitor logs:

```bash
docker logs -f devops_monitor
```

You should see output similar to:
```
Checking system health... OK
Checking system health... OK
Failure detected!
Attempting to restart container...
System recovered successfully. Backend container restarted.
Checking system health... OK
```
