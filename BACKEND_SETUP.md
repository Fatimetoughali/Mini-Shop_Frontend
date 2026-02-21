# 🔗 Configuration Backend Laravel pour MiniShop

## Configuration CORS (Obligatoire)

Pour que votre frontend Vue puisse communiquer avec le backend Laravel, vous devez configurer CORS.

### Méthode 1 : Utiliser le package Laravel CORS (Recommandé)

1. **Installer le package** (si pas déjà installé) :

```bash
composer require fruitcake/laravel-cors
```

2. **Publier la configuration** :

```bash
php artisan vendor:publish --tag="cors"
```

3. **Modifier `config/cors.php`** :

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',  // Frontend Vue en développement
        'http://127.0.0.1:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
```

### Méthode 2 : Middleware personnalisé

Créez `app/Http/Middleware/Cors.php` :

```php
<?php

namespace App\Http\Middleware;

use Closure;

class Cors
{
    public function handle($request, Closure $next)
    {
        return $next($request)
            ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
```

Puis enregistrez-le dans `app/Http/Kernel.php` :

```php
protected $middleware = [
    // ...
    \App\Http\Middleware\Cors::class,
];
```

## Structure des Endpoints API

Votre backend doit exposer ces endpoints :

### 1. Liste des Produits

```
GET /api/products
```

**Réponse attendue :**

```json
[
  {
    "id": 1,
    "title": "Nom du produit",
    "description": "Description du produit",
    "price": 99.99,
    "image": "https://example.com/image.jpg"
  }
]
```

### 2. Détails d'un Produit

```
GET /api/products/{id}
```

**Réponse attendue :**

```json
{
  "id": 1,
  "title": "Nom du produit",
  "description": "Description détaillée",
  "price": 99.99,
  "image": "https://example.com/image.jpg",
  "stock": 10,
  "category": "Électronique"
}
```

### 3. Créer une Commande

```
POST /api/orders
```

**Body attendu :**

```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "total": 199.98
}
```

## Exemple de Controller Laravel

`app/Http/Controllers/Api/ProductController.php` :

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'required|url',
        ]);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'price' => 'numeric|min:0',
            'image' => 'url',
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(null, 204);
    }
}
```

## Routes API

`routes/api.php` :

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{id}', [ProductController::class, 'show']);
    Route::post('/', [ProductController::class, 'store']);
    Route::put('/{id}', [ProductController::class, 'update']);
    Route::delete('/{id}', [ProductController::class, 'destroy']);
});

Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::post('/', [OrderController::class, 'store']);
    Route::get('/{id}', [OrderController::class, 'show']);
});
```

## Migration de la Table Products

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->string('image');
            $table->integer('stock')->default(0);
            $table->string('category')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};
```

## Tester l'API

### Avec curl :

```bash
# Lister les produits
curl http://localhost:8000/api/products

# Obtenir un produit
curl http://localhost:8000/api/products/1
```

### Avec le navigateur :

Ouvrez directement : `http://localhost:8000/api/products`

Vous devriez voir le JSON des produits.

## Démarrer le Backend

```bash
# Démarrer le serveur Laravel
php artisan serve

# Le serveur démarre sur http://localhost:8000
```

## Checklist de Vérification

- [ ] CORS configuré pour `http://localhost:5173`
- [ ] Routes API définies dans `routes/api.php`
- [ ] Controller créé avec méthode `index()`
- [ ] Migration exécutée (`php artisan migrate`)
- [ ] Données de test ajoutées (seeders ou manuellement)
- [ ] Backend démarré (`php artisan serve`)
- [ ] Test manuel de l'endpoint : `http://localhost:8000/api/products`

Une fois tout configuré, votre frontend Vue affichera automatiquement les produits ! 🚀
