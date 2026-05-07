# Cours de guitare — Site web

Site web statique d'un cours de guitare pour débutant : théorie du manche, accords avec schémas SVG, programme d'entraînement quotidien.

## Structure du projet

```
.
├── index.html              # Page d'accueil
├── module-1.html           # Module 1 — Théorie du manche
├── module-2.html           # Module 2 — Accords (avec schémas SVG)
├── module-3.html           # Module 3 — Programme quotidien
├── styles.css              # Feuille de styles unique
├── chord-diagrams.js       # Générateur SVG des schémas d'accords
└── README.md               # Ce fichier
```

Aucune dépendance, aucun build : trois polices Google Fonts chargées via CDN, le reste est en HTML/CSS/JS pur. Le site fonctionne en ouvrant `index.html` directement dans un navigateur.

---

## Déployer le site sur GitHub Pages — étape par étape

GitHub Pages héberge gratuitement les sites statiques. Tu obtiens une URL du type `https://ton-pseudo.github.io/cours-guitare/`.

### Méthode A — Interface web GitHub (la plus simple, sans terminal)

#### Étape 1 — Créer un compte GitHub
1. Va sur [github.com](https://github.com) et clique sur **Sign up**
2. Choisis un nom d'utilisateur (il apparaîtra dans l'URL du site)
3. Confirme ton email

#### Étape 2 — Créer un nouveau repository
1. Clique sur l'icône **+** en haut à droite → **New repository**
2. **Repository name** : `cours-guitare` (ou ce que tu veux — c'est ce qui apparaîtra dans l'URL)
3. **Visibility** : choisis **Public** (GitHub Pages gratuit nécessite un repo public)
4. Coche **Add a README file** (optionnel, on le remplacera)
5. Clique **Create repository**

#### Étape 3 — Uploader les fichiers
1. Sur la page du repo, clique sur **Add file** → **Upload files**
2. Glisse-dépose **tous les fichiers** du dossier `cours-guitare-site/` (les 4 HTML, le CSS, le JS, et ce README)
3. En bas de la page : message de commit (par exemple `Initial upload`)
4. Clique **Commit changes**

#### Étape 4 — Activer GitHub Pages
1. Dans le repo, clique sur **Settings** (onglet en haut à droite)
2. Dans le menu de gauche, clique sur **Pages**
3. Section **Source** :
   - **Branch** : sélectionne `main`
   - **Folder** : `/ (root)`
4. Clique **Save**

#### Étape 5 — Attendre et accéder au site
- Attends environ **1 à 2 minutes** (GitHub déploie le site en arrière-plan)
- Reviens sur la page **Settings → Pages**, tu verras un bandeau vert : *"Your site is live at https://ton-pseudo.github.io/cours-guitare/"*
- Clique sur le lien — ton site est en ligne 🎸

---

### Méthode B — En ligne de commande (Git)

Si tu préfères utiliser Git en local :

```bash
# 1. Installer git si pas déjà fait : https://git-scm.com/

# 2. Aller dans le dossier du projet
cd /chemin/vers/cours-guitare-site

# 3. Initialiser le repo
git init
git branch -M main

# 4. Lier au repo GitHub (créé via l'interface web étape 2)
git remote add origin https://github.com/ton-pseudo/cours-guitare.git

# 5. Ajouter les fichiers et faire un premier commit
git add .
git commit -m "Initial commit"

# 6. Pousser sur GitHub
git push -u origin main
```

Puis active GitHub Pages comme dans l'étape 4 de la méthode A.

---

## Mettre à jour le site après déploiement

### Via l'interface web
1. Va dans le repo sur GitHub
2. Clique sur le fichier que tu veux modifier
3. Clique sur l'icône crayon (**Edit this file**)
4. Modifie, scroll en bas, **Commit changes**
5. Le site se met à jour automatiquement en 1-2 minutes

### Via la ligne de commande
```bash
# Modifier les fichiers en local, puis :
git add .
git commit -m "Description de la modification"
git push
```

---

## Personnaliser le site

| Pour modifier… | Édite ce fichier |
|----------------|------------------|
| Couleurs, polices, mise en page | `styles.css` (variables CSS au début du fichier) |
| Contenu d'un module | Le fichier `module-X.html` correspondant |
| Ajouter un schéma d'accord | Module 2, copie-colle un bloc `chord-card` et change les `data-voicing` / `data-fingers` |
| Page d'accueil | `index.html` |

### Ajouter un nouveau schéma d'accord
Dans `module-2.html`, copie ce bloc et adapte les attributs :

```html
<div class="chord-card">
  <div class="chord-card-name">NomAccord</div>
  <div class="chord-card-subtitle">sous-titre optionnel</div>
  <div class="chord-diagram"
       data-voicing="x,3,2,0,1,0"
       data-fingers="0,3,2,0,1,0"></div>
  <div class="chord-card-notation">x32010</div>
</div>
```

**Format `data-voicing`** : 6 valeurs séparées par virgules, de la corde 6 (basse) à la corde 1 (aiguë).
- `x` = corde non jouée (étouffée)
- `0` = corde à vide
- `1` à `9` = numéro de frette à presser

**Format `data-fingers`** : pareil, mais avec les numéros de doigts.
- `0` = pas de doigt (corde à vide ou muette)
- `1` à `4` = doigt utilisé (1 = index, 2 = majeur, 3 = annulaire, 4 = auriculaire)

Le générateur détecte automatiquement les barrés (même doigt sur plusieurs cordes à la même frette).

---

## Notes techniques

- **Polices** : Fraunces (display) + Manrope (body) + JetBrains Mono (code), chargées depuis Google Fonts
- **Compatibilité** : navigateurs modernes (Chrome, Firefox, Safari, Edge des 3 dernières années)
- **Responsive** : layout adapté mobile/tablette/desktop via media queries CSS
- **Accessibilité** : structure sémantique HTML5, contraste de texte respectant WCAG AA, attribut `aria-label` sur les SVG

---

## Licence et attribution

Document personnel d'apprentissage. Contenu pédagogique original ; aucune ressource tierce sous copyright n'est reproduite. Une seule progression de chanson tierce est citée nominativement (*Let It Be* — The Beatles), à titre d'exemple pédagogique d'une progression I-V-vi-IV vérifiée.
