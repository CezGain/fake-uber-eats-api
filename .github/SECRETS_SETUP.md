# Instructions de configuration des secrets GitHub

## Accès aux secrets

1. Aller sur le repository GitHub: https://github.com/CezGain/fake-uber-eats-api
2. Cliquer sur **Settings** (en haut à droite)
3. Dans le menu latéral gauche, aller à **Secrets and variables** > **Actions**
4. Cliquer sur **New repository secret**

## Secrets à configurer

### Production

```
Nom: PROD_API_URL
Valeur: https://votre-api-production.com
Description: URL de l'API en production
```

```
Nom: JWT_SECRET_PROD
Valeur: [générer une clé aléatoire longue et sécurisée]
Description: Secret JWT pour l'environnement de production
```

```
Nom: MONGODB_URI_PROD
Valeur: mongodb+srv://user:password@cluster.mongodb.net/dbname
Description: URI de connexion MongoDB production
```

```
Nom: DEPLOY_KEY
Valeur: [votre clé SSH ou token de déploiement]
Description: Credentials pour le déploiement automatique
```

### Staging

```
Nom: STAGING_API_URL
Valeur: https://staging-api.example.com
Description: URL de l'API staging
```

```
Nom: JWT_SECRET_STAGING
Valeur: [clé différente de production]
Description: Secret JWT pour staging
```

```
Nom: MONGODB_URI_STAGING
Valeur: mongodb+srv://user:password@staging-cluster.mongodb.net/staging-db
Description: URI MongoDB staging
```

### Docker

```
Nom: DOCKER_TOKEN
Valeur: [votre token Docker Hub]
Description: Token d'accès Docker Hub pour push d'images
```

**Comment obtenir le Docker token:**

1. Aller sur https://hub.docker.com/settings/security
2. Cliquer sur "New Access Token"
3. Donner un nom (ex: "GitHub Actions")
4. Copier le token généré

### Optionnel - Notifications

```
Nom: SLACK_WEBHOOK
Valeur: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
Description: Webhook pour notifications Slack
```

## Vérification

Après configuration, vérifier dans **Settings > Secrets and variables > Actions** que tous les secrets apparaissent dans la liste (les valeurs restent masquées).

## Sécurité

- ❌ Ne jamais commiter les secrets dans le code
- ❌ Ne jamais afficher les secrets dans les logs
- ✅ Utiliser des valeurs différentes entre staging et production
- ✅ Régénérer les secrets si compromis
- ✅ Limiter l'accès aux secrets (permissions repository)
