const axios = require('axios');
const Docker = require('dockerode');

// Connect to Docker socket (Make sure it's mounted in docker-compose.yml)
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const BACKEND_URL = 'http://backend:5000/health';
const CHECK_INTERVAL = 5000; // 5 seconds
// We will explicitly set container_name to 'devops_backend' in docker-compose
const CONTAINER_NAME = 'devops_backend'; 

console.log('Starting monitoring service...');
console.log(`Will monitor ${BACKEND_URL} every ${CHECK_INTERVAL}ms`);

async function checkHealth() {
  try {
    process.stdout.write('Checking system health... ');
    const response = await axios.get(BACKEND_URL, { timeout: 2000 });
    if (response.status === 200) {
      console.log('OK');
    }
  } catch (error) {
    console.log('\nFailure detected!');
    console.error(`Error details: ${error.message}`);
    await recoverSystem();
  }
}

async function recoverSystem() {
  console.log('Attempting to restart container...');
  try {
    const containers = await docker.listContainers({ all: true });
    // Find the backend container
    const backendContainerInfo = containers.find(c => c.Names.some(name => name.includes(CONTAINER_NAME)));
    
    if (backendContainerInfo) {
      const container = docker.getContainer(backendContainerInfo.Id);
      await container.restart();
      console.log('System recovered successfully. Backend container restarted.');
    } else {
      console.error(`Container containing name '${CONTAINER_NAME}' not found! Cannot restart.`);
      console.log('Available containers:', containers.map(c => c.Names).flat());
    }
  } catch (err) {
    console.error(`Failed to restart container: ${err.message}`);
  }
}

setInterval(checkHealth, CHECK_INTERVAL);
