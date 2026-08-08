# HR-Pulse 💓

**Pipeline IA intelligente & conteneurisation native** — Moderniser le recrutement en transformant des données textuelles brutes (offres d'emploi) en une base de connaissances structurée et exploitable.

HR-Pulse est une solution **Data Engineering + IA + Cloud** qui aide les professionnels des RH à :
- extraire automatiquement les **compétences clés** des offres d'emploi via l'IA Azure ;
- **prédire les salaires** à partir d'un modèle de Machine Learning ;
- rechercher et consulter les offres d'emploi structurées.

Développé dans le cadre de **Projet-11 · Simplon Academy**.

---

## ✨ Fonctionnalités

- 🔐 **Authentification JWT** — inscription / connexion sécurisée (mots de passe hachés avec Argon2).
- 🧠 **Prédiction de salaire** — modèle `RandomForestRegressor` (Scikit-learn) entraîné sur le jeu de données *Kaggle "Data Science Job Postings"*, exposé via un endpoint REST.
- 🔎 **Extraction de compétences** — appel à **Azure AI Text Analytics** pour l'extraction d'entités / mots-clés (NER).
- 💼 **Base de connaissances** — catalogue d'offres d'emploi stocké en base SQL, avec recherche par titre et par ID.
- ☁️ **Cloud-Native** — base de données managée Azure SQL / PostgreSQL.
- 📊 **Observabilité** — tracing distribué **OpenTelemetry** visualisé dans **Jaeger** (chaque requête, requête SQL et appel IA est tracé).
- 🐳 **Dockerisé** — frontend, backend et Jaeger lancés avec une seule commande.
- 🔄 **CI/CD** — GitHub Actions (tests backend, lint + build frontend, build Docker).

---

## 🏗️ Architecture

```mermaid
graph TD
    A[Frontend Next.js] -->|REST / JWT| B[Backend FastAPI]
    B -->|SQLAlchemy| C[(Azure SQL / PostgreSQL)]
    B -->|Inference| D[ML Model - Random Forest]
    B -->|NLP / NER| E[Azure AI Text Analytics]
    B -->|OTLP| F[Jaeger]
    D --> G[ml/model/model_salary_prediction.pkl]
    H[Notebooks Jupyter] -->|joblib| D
```

**Flux d'un prédiction :**
1. L'utilisateur se connecte et reçoit un **JWT**.
2. Le formulaire envoie les caractéristiques de l'entreprise (`rating`, `age`, `size`, `type_of_ownership`, `industry`, `sector`) à `POST /Predict`.
3. FastAPI valide le token, construit un `DataFrame`, et invoque le modèle chargé avec `joblib`.
4. Le salaire annuel estimé est renvoyé à l'UI.

---

## 🛠️ Stack technique

| Domaine | Technologies |
| --- | --- |
| **Backend** | Python 3.13, FastAPI, SQLAlchemy, Pydantic, Uvicorn, JWT (python-jose), Passlib/Argon2 |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **IA / ML** | Scikit-learn (Random Forest), Azure AI Text Analytics, Pandas, Joblib |
| **Base de données** | Azure SQL Server / MSSQL, PostgreSQL (psycopg2), pyodbc |
| **Observabilité** | OpenTelemetry (FastAPI + SQLAlchemy), Jaeger (OTLP/gRPC) |
| **DevOps** | Docker, Docker Compose, GitHub Actions, Terraform (évoqué) |

---

## 📁 Structure du projet

```
.
├── backend/                  # API FastAPI
│   ├── app/
│   │   ├── main.py           # Application, routes, sécurité, OpenTelemetry, client Azure
│   │   ├── database.py       # Moteur SQLAlchemy + instrumentation
│   │   ├── shcema.py         # Schémas Pydantic (CreateUser, Checkuser, listcheck)
│   │   └── models/
│   │       ├── user.py       # Modèle User
│   │       └── job_skills.py # Modèle JobOffer
│   ├── data/jobs.csv         # Jeu de données brut
│   ├── Dockerfile
│   └── pyproject.toml
├── frontend/                 # Application Next.js
│   └── app/
│       ├── app/
│       │   ├── page.tsx      # Landing page
│       │   ├── login/        # Connexion
│       │   ├── Signup/       # Inscription
│       │   ├── dashboard/    # Tableau de bord (prédiction + offres)
│       │   └── components/   # PredictorForm, JobList
│       └── Dockerfile
├── ml/                       # Machine Learning
│   ├── Clean_data.ipynb      # Nettoyage du dataset
│   ├── piplineML.ipynb       # Pipeline de modélisation
│   ├── data_clean.csv        # Données nettoyées
│   └── model/
│       └── model_salary_prediction.pkl   # Modèle entraîné
├── tests/                    # Tests pytest (API + ML)
├── .github/workflows/main.yml # CI/CD
├── docker-compose.yml
└── pyproject.toml            # Dépendances racine (uv)
```

---

## 🚀 Démarrage rapide

### Prérequis
- **Docker** + **Docker Compose** (recommandé)
- **Python 3.13+** et [uv](https://docs.astral.sh/uv/) (exécution locale)
- **Node.js 20+** (exécution locale du frontend)
- Un compte **Azure** (optionnel, uniquement pour SQL et AI)

### 1. Cloner le dépôt

```bash
git clone https://github.com/Lhcenzetta/HR-Pulse-cloud-IA-Devops.git
cd HR-Pulse-cloud-IA-Devops
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine :

```env
# Base de données (Azure SQL ou PostgreSQL)
data_url=postgresql+psycopg2://user:password@host:5432/database
# data_url=mssql+pyodbc://user:password@host:1433/database?driver=ODBC+Driver+18+for+SQL+Server

# Sécurité JWT
SECRET_KEY=votre_cle_secrete

# Chemin du modèle ML (défini par défaut dans Docker)
model_path=ml/model/model_salary_prediction.pkl

# Azure AI Text Analytics (optionnel)
endpoint=https://votre-ressource.cognitiveservices.azure.com/
api_key=votre_cle_azure
```

### 3. Lancer avec Docker Compose

```bash
docker compose up --build
```

### 4. Accès aux services

| Service | URL |
| --- | --- |
| **Frontend** (Next.js) | http://localhost:3000 |
| **Backend API** (Swagger) | http://localhost:8000/docs |
| **Jaeger** (traces) | http://localhost:16686 |

---

## 💻 Développement local

### Backend (uv)

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend/app
npm install
npm run dev        # http://localhost:3000
```

### Tests

```bash
# Depuis la racine, après avoir installé le backend
export PYTHONPATH=$PYTHONPATH:$(pwd)/backend/app
cd backend && uv run pytest ../tests
```

---

## 🔌 API Reference

Tous les endpoints (sauf inscription/connexion) exigent un en-tête `Authorization: Bearer <token>`.

### Authentification

| Méthode | Endpoint | Description | Corps |
| --- | --- | --- | --- |
| `POST` | `/Signup` | Créer un compte | `{"username", "passwordhash", "createdate"}` |
| `POST` | `/login` | Se connecter, renvoie un JWT | `{"username", "passwordhash"}` |

### Prédiction

| Méthode | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/Predict` | Prédire un salaire annuel |

```json
{
  "rating": 4.0,
  "age": 30,
  "size": "1001 to 5000 employees",
  "type_of_ownership": "Private",
  "industry": "Information Technology",
  "sector": "Technology"
}
```

Réponse : `{"Predicted Salary: 137000.0$"}`

### Offres d'emploi

| Méthode | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/get_all_jobs_with_skills` | Toutes les offres avec compétences extraites |
| `GET` | `/jobs/search/?title={title}` | Recherche par titre (insensible à la casse) |
| `GET` | `/jobs/{id}` | Détail d'une offre par ID (404 si absente) |

### Utilisateurs

| Méthode | Endpoint | Description |
| --- | --- | --- |
| `DELETE` | `/delete_user/{user_id}` | Supprimer un utilisateur |

---

## 🤖 Pipeline Machine Learning

Le modèle est entraîné dans les notebooks Jupyter du dossier `ml/` :

1. **`Clean_data.ipynb`** — nettoyage du dataset brut (`jobs.csv`) : imputation des ratings (`-1 → 0`), calcul de l'âge de l'entreprise (`2026 - founded`), remplacement des valeurs manquantes par `Unknown`.
2. **`piplineML.ipynb`** — construction d'un pipeline :
   - `OneHotEncoder` sur les colonnes catégorielles (`size`, `type_of_ownership`, `industry`, `sector`) ;
   - `RandomForestRegressor` (100 arbres) ;
   - séparation train/test (80/20) ;
   - export du modèle en `.pkl` via `joblib`.

Le modèle sérialisé est chargé par le backend à l'import (`joblib.load`) et sert l'endpoint `/Predict`.

---

## 📊 Observabilité

Le backend est instrumenté avec **OpenTelemetry** :
- instrumentation automatique **FastAPI** (`FastAPIInstrumentor`) ;
- instrumentation **SQLAlchemy** (latence des requêtes SQL) ;
- export OTLP/gRPC vers **Jaeger** (`http://jaeger:4317`).

Pour visualiser les traces :

1. Ouvrez http://localhost:16686
2. Sélectionnez le service `backend-hr-pulse`
3. Recherchez des traces comme `POST /Predict` ou `azure_ai_extraction`

---

## 🔄 CI / CD

Le workflow GitHub Actions (`.github/workflows/main.yml`) exécute sur `push` / `pull_request` vers `main` :

- **Backend CI** — install de `uv`, `uv sync`, puis exécution des tests pytest.
- **Frontend CI** — `npm ci`, lint ESLint, build de production.
- **Docker Build Check** — vérifie que `docker compose build` passe (avec un `.env` factice).

---

## 🗺️ Roadmap du projet

1. **Phase 1 — Infrastructure** : provisioning automatique via Terraform & Azure.
2. **Phase 2 — Data & AI** : nettoyage de `jobs.csv` et extraction NER avec Azure AI Language.
3. **Phase 3 — Module Predictor** : modélisation ML pour l'estimation des salaires.
4. **Phase 4 — Conteneurisation** : Docker + orchestration Docker Compose / Terraform.
5. **Phase 5 — Observabilité** : traces distribuées OpenTelemetry + Jaeger.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une *issue* ou à soumettre une *pull request*.

1. Forkez le dépôt.
2. Créez votre branche (`git checkout -b feature/ma-fonctionnalite`).
3. Commitez vos changements.
4. Poussez la branche et ouvrez une PR.

---

## 📄 Licence

Aucune licence spécifiée. © 2026 HR-Pulse — Développé par Yassine Ennaya · Simplon Academy.
