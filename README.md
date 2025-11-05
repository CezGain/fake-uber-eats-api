# Backend UberEats API

Express.js backend with MongoDB, JWT authentication, and restaurant management.

## Docker Commands

From root directory:

```bash
make build     # Build Docker image
make start     # Start container (foreground)
make stop      # Stop and remove container
make restart   # Restart container
make logs      # View container logs
make shell     # Access container shell
make seed      # Seed MongoDB with restaurants
```

## Configuration

`.env` file required:

```
MONGODB_URI=mongodb://localhost:27017/ubereats
JWT_SECRET=your_secret_key
PORT=3000
```

MongoDB runs externally (not containerized).

## Docker Details

- Image: `ubereats-backend`
- Container: `ubereats-back`
- Port: `3000`
- Base: Node 22 Alpine
