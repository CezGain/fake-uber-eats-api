# Deployment Documentation

## 🚀 Automated Deployment Process

This document describes the CI/CD pipeline configuration for the UberEats API backend.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Workflows](#workflows)
3. [Secrets Configuration](#secrets-configuration)
4. [Deployment Process](#deployment-process)
5. [Manual Deployment](#manual-deployment)
6. [Rollback Procedure](#rollback-procedure)
7. [Monitoring](#monitoring)

---

## Overview

The project uses GitHub Actions for continuous integration and continuous deployment with the following workflows:

- **CI Pipeline** (`ci.yml`) - Automated testing and quality checks
- **Production Deployment** (`deploy.yml`) - Automated deployment to production
- **Staging Deployment** (`staging.yml`) - Automated deployment to staging
- **Docker Build** (`docker-build.yml`) - Container image building and publishing

---

## Workflows

### 1. CI Pipeline (`ci.yml`)

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop`

**Jobs:**

1. **Lint** - Code quality verification with ESLint
2. **Security Audit** - npm audit for vulnerability detection (non-blocking)
3. **Backend Tests** - Unit and integration tests with MongoDB
4. **Build Check** - Verify build process
5. **Notify Failure** - Automatic notification on failure

**Features:**

- npm dependency caching
- Test coverage reports (30-day retention)
- Parallel job execution for optimization
- MongoDB 6 service container for tests

**Environment Variables:**

```bash
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/ubereats-test
JWT_SECRET=test-secret-key-for-ci
PORT=3000
```

---

### 2. Production Deployment (`deploy.yml`)

**Triggers:**

- Push to `main` branch
- Manual trigger via workflow_dispatch

**Jobs:**

1. **Validate** - Pre-deployment checks (lint, build, tests)
2. **Deploy** - Production deployment
3. **Notify** - Deployment status notification

**Process:**

1. Pre-deployment validation
2. Install production dependencies
3. Build application
4. Run database migrations
5. Deploy to production server
6. Health check verification
7. Send notification

---

### 3. Staging Deployment (`staging.yml`)

**Triggers:**

- Push to `develop` branch

**Process:**

- Quality checks (lint + tests)
- Build verification
- Deploy to staging environment
- Staging health check

---

### 4. Docker Build (`docker-build.yml`)

**Triggers:**

- Git tags matching `v*.*.*` (e.g., v1.0.0)
- Manual trigger

**Features:**

- Multi-platform build (linux/amd64, linux/arm64)
- Multi-stage Dockerfile optimization
- Docker Hub publishing
- Semantic versioning tags
- Build caching with GitHub Actions cache

---

## Secrets Configuration

### Required GitHub Secrets

Configure these secrets in: **Repository Settings > Secrets and variables > Actions**

#### Production Secrets

| Secret Name        | Description                 | Example                                          |
| ------------------ | --------------------------- | ------------------------------------------------ |
| `PROD_API_URL`     | Production API endpoint     | `https://api.example.com`                        |
| `JWT_SECRET_PROD`  | Production JWT secret       | `your-secure-production-secret`                  |
| `DEPLOY_KEY`       | SSH key or deployment token | `-----BEGIN RSA PRIVATE KEY-----`                |
| `MONGODB_URI_PROD` | Production database URI     | `mongodb+srv://user:pass@cluster.mongodb.net/db` |

#### Staging Secrets

| Secret Name           | Description          |
| --------------------- | -------------------- |
| `STAGING_API_URL`     | Staging API endpoint |
| `JWT_SECRET_STAGING`  | Staging JWT secret   |
| `MONGODB_URI_STAGING` | Staging database URI |

#### Docker Secrets

| Secret Name    | Description             |
| -------------- | ----------------------- |
| `DOCKER_TOKEN` | Docker Hub access token |

#### Optional Secrets

| Secret Name           | Description                    |
| --------------------- | ------------------------------ |
| `SLACK_WEBHOOK`       | Slack notification webhook     |
| `EMAIL_SMTP_PASSWORD` | Email notification credentials |

### How to Create Secrets

1. Navigate to repository settings
2. Go to **Secrets and variables > Actions**
3. Click **New repository secret**
4. Enter name and value
5. Click **Add secret**

---

## Deployment Process

### Automatic Deployment to Production

1. **Commit to `main` branch:**

   ```bash
   git checkout main
   git pull origin main
   git merge develop
   git push origin main
   ```

2. **GitHub Actions automatically:**

   - Runs validation checks
   - Executes deployment
   - Performs health checks
   - Sends notifications

3. **Monitor deployment:**
   - Go to **Actions** tab in GitHub
   - Click on the running workflow
   - View real-time logs

### Automatic Deployment to Staging

1. **Commit to `develop` branch:**

   ```bash
   git checkout develop
   git add .
   git commit -m "feat: new feature"
   git push origin develop
   ```

2. **Staging deployment runs automatically**

---

## Manual Deployment

### Trigger Manual Production Deployment

1. Go to **Actions** tab in GitHub
2. Select **Deploy to Production** workflow
3. Click **Run workflow**
4. Select branch (default: main)
5. Optionally specify version
6. Click **Run workflow**

### Docker Image Release

1. **Create and push a version tag:**

   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. **Docker build workflow automatically:**
   - Builds multi-platform images
   - Pushes to Docker Hub
   - Tags with semantic version

---

## Rollback Procedure

### Method 1: Revert Commit

```bash
# Find the last working commit
git log --oneline

# Revert to previous version
git revert <commit-hash>
git push origin main
```

### Method 2: Redeploy Previous Version

1. Go to **Actions** tab
2. Find successful previous deployment
3. Click **Re-run jobs**

### Method 3: Docker Rollback

```bash
# Pull previous version
docker pull your-username/fake-uber-eats-api:v1.0.0

# Stop current container
docker stop ubereats-back

# Run previous version
docker run -d --name ubereats-back \
  -p 3000:3000 \
  -e MONGODB_URI=$MONGODB_URI \
  -e JWT_SECRET=$JWT_SECRET \
  your-username/fake-uber-eats-api:v1.0.0
```

### Emergency Manual Rollback

If automated rollback fails:

1. SSH into production server
2. Navigate to application directory
3. Checkout previous version:
   ```bash
   git checkout <previous-tag-or-commit>
   npm ci --only=production
   pm2 restart ubereats-api
   ```

---

## Monitoring

### GitHub Actions Dashboard

- **Location:** Repository > Actions tab
- **Information available:**
  - Workflow run history
  - Success/failure status
  - Execution time
  - Logs and artifacts
  - Coverage reports

### CI Status Badge

Add to README.md:

```markdown
[![CI Status](https://github.com/CezGain/fake-uber-eats-api/actions/workflows/ci.yml/badge.svg)](https://github.com/CezGain/fake-uber-eats-api/actions/workflows/ci.yml)
```

### Health Check Endpoints

Implement in your application:

```javascript
// routes/health.js
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});
```

### Monitoring Checklist

- [ ] Check GitHub Actions status regularly
- [ ] Monitor deployment notifications
- [ ] Review test coverage reports
- [ ] Check security audit warnings
- [ ] Verify production health checks
- [ ] Monitor server logs

---

## Troubleshooting

### Deployment Fails

1. Check workflow logs in Actions tab
2. Verify all secrets are configured
3. Ensure target server is accessible
4. Check database connectivity
5. Verify environment variables

### Tests Fail in CI

1. Check test logs in Actions tab
2. Verify MongoDB service is running
3. Check environment variables
4. Run tests locally to reproduce
5. Review recent code changes

### Docker Build Fails

1. Verify Dockerfile syntax
2. Check base image availability
3. Ensure all dependencies are in package.json
4. Test build locally:
   ```bash
   docker build -t test-image .
   ```

---

## Best Practices

1. **Never commit secrets** to the repository
2. **Always test locally** before pushing
3. **Use pull requests** for code review
4. **Tag releases** with semantic versioning
5. **Monitor deployments** actively
6. **Keep dependencies updated**
7. **Document all manual steps**
8. **Test rollback procedures** regularly

---

## Support

For issues or questions:

- Create an issue in GitHub repository
- Check Actions logs for detailed error messages
- Review this documentation
- Contact DevOps team

---

**Last Updated:** November 2025
**Maintained By:** DevOps Team
