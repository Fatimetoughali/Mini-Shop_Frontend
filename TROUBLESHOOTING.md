# 🔧 Guide de Dépannage - MiniShop Frontend

## Problème : L'application n'affiche rien

### ✅ Solutions par étape

#### 1. Vérifier que le serveur de développement fonctionne

```bash
npm run dev
```

Vous devriez voir :

```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

#### 2. Ouvrir l'application dans le navigateur

- Allez sur `http://localhost:5173`
- Appuyez sur **F12** pour ouvrir les outils développeur
- Allez dans l'onglet **Console**

#### 3. Vérifier les messages dans la console

**✅ Message attendu (API disponible) :**

```
✅ Produits chargés depuis l'API: 6
```

**⚠️ Message attendu (API non disponible - MODE DÉMO) :**

```
⚠️ API non disponible, utilisation des données de démonstration
Erreur API: Network Error
```

**Dans les deux cas, les produits devraient s'afficher !**

#### 4. Problèmes courants

##### A. Page blanche / Rien ne s'affiche

**Cause possible :** Erreur JavaScript

**Solution :**

1. Ouvrez la console (F12)
2. Regardez les erreurs en rouge
3. Partagez-moi le message d'erreur

##### B. "Cannot GET /"

**Cause :** Le serveur Vite n'est pas démarré

**Solution :**

```bash
# Arrêtez le serveur (Ctrl+C)
# Relancez-le
npm run dev
```

##### C. Erreur CORS dans la console

**Cause :** Votre backend Laravel bloque les requêtes

**Solution :** Dans votre backend Laravel, configurez CORS :

**Fichier `config/cors.php` :**

```php
'allowed_origins' => ['http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

**Ou installez le package :**

```bash
composer require fruitcake/laravel-cors
```

##### D. Les images ne s'affichent pas

**Cause :** Problème de connexion internet ou URLs invalides

**Solution :** Les images utilisent des URLs externes (FakeStore API). Vérifiez votre connexion internet.

#### 5. Mode Démo vs Mode Production

**Mode Démo (sans backend) :**

- L'application affiche 6 produits de démonstration
- Le panier fonctionne en local
- Parfait pour tester l'interface

**Mode Production (avec backend) :**

- Assurez-vous que votre backend Laravel tourne sur `http://localhost:8000`
- L'endpoint `GET /api/products` doit retourner un tableau JSON
- Configurez CORS correctement

#### 6. Vérifier la structure des données API

Si vous utilisez votre backend, assurez-vous que l'API retourne :

```json
[
  {
    "id": 1,
    "title": "Nom du produit",
    "description": "Description",
    "price": 99.99,
    "image": "https://url-de-image.com/image.jpg"
  }
]
```

**Champs obligatoires :**

- `id` (number)
- `title` (string)
- `price` (number)
- `image` (string URL)
- `description` (string)

#### 7. Commandes utiles

```bash
# Nettoyer le cache et redémarrer
npm run dev

# Vérifier les erreurs de linting
npm run lint

# Réinstaller les dépendances (si problème)
rm -rf node_modules package-lock.json
npm install
```

#### 8. Vérifier les fichiers critiques

**Fichier `.env` :**

```
VITE_API_URL=http://localhost:8000/api
```

**Si le fichier n'existe pas :**

```bash
cp .env.example .env
```

## 📞 Besoin d'aide supplémentaire ?

Si le problème persiste, partagez :

1. La capture d'écran de la console (F12)
2. Le message d'erreur exact
3. L'URL que vous utilisez

---

**Note :** Depuis la dernière mise à jour, l'application fonctionne **TOUJOURS** même sans backend grâce au système de fallback avec données de démonstration !
