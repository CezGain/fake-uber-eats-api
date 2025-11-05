# Backend UberEats API

[![CI Status](https://github.com/CezGain/fake-uber-eats-api/actions/workflows/ci.yml/badge.svg)](https://github.com/CezGain/fake-uber-eats-api/actions/workflows/ci.yml)
[![Deploy](https://github.com/CezGain/fake-uber-eats-api/actions/workflows/deploy.yml/badge.svg)](https://github.com/CezGain/fake-uber-eats-api/actions/workflows/deploy.yml)

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

## CI/CD Pipeline

Automated workflows configured with GitHub Actions:

- **CI Pipeline**: Automated testing, linting, and security audits
- **Production Deployment**: Automated deployment to production on `main` branch
- **Staging Deployment**: Automated deployment to staging on `develop` branch
- **Docker Build**: Automated multi-platform image building on version tags

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete documentation.

## Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests with coverage
npm run test:watch # Run tests in watch mode
npm run lint       # Check code quality
npm run lint:fix   # Fix linting issues
npm run build      # Verify build process
```

## Health Check

API health endpoint available at: `GET /api/health`

Response:

```json
{
  "status": "OK",
  "timestamp": "2025-11-05T10:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```
