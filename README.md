# HR-Pulse: Full-Stack AI & Cloud Solution

![HR-Pulse Logo](/Users/lait-zet/.gemini/antigravity/brain/83b1fb7d-19c9-4585-bb46-a7a673357eca/hr_pulse_logo_1772315187587.png)

## 🎯 Description
**HR-Pulse** est une solution de Data Engineering et d'IA conçue pour moderniser le processus de recrutement. L'objectif est de transformer une masse de données textuelles brutes (offres d'emploi) en une base de connaissances structurée et exploitable.

Using a combination of **FastAPI**, **Next.js**, **Azure Cloud**, and **Machine Learning**, HR-Pulse simplifies the life of HR professionals by automating data extraction and providing real-time salary predictions.

---

## ✨ Key Features

- **Automated Skill Extraction**: Uses Azure AI Text Analytics to extract key phrases and skills from job descriptions.
- **Salary Prediction**: A custom Scikit-learn model trained on real-world data to estimate salary ranges.
- **Cloud-Native Infrastructure**: Managed Azure SQL Database with automated scaling and cost-saving auto-pause features.
- **End-to-End Observability**: Distributed tracing using OpenTelemetry and Jaeger to monitor every request, database query, and AI call.
- **Containerized Deployment**: Fully Dockerized services orchestratable with a single command.

---

## 🏗️ Architecture

```mermaid
graph TD
    A[Frontend (Next.js/Streamlit)] -->|REST| B[Backend (FastAPI)]
    B -->|SQLAlchemy| C[Azure SQL Database]
    B -->|Inference| D[ML Model - Salary Prediction]
    B -->|NLP| E[Azure AI SDK]
    B -->|OTLP| F[Jaeger Visualization]
```

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Python 3.13+ (if running locally)
- Azure account (for SQL and AI services)

### Installation & Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Lhcenzetta/HR-Pulse-cloud-IA-Devops.git
   cd HR-Pulse-cloud-IA-Devops
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root directory (use `.env.example` as a template).

3. **Launch with Docker Compose**:
   ```bash
   docker compose up --build
   ```

4. **Access the services**:
   - **Frontend**: `http://localhost:3000`
   - **Backend API**: `http://localhost:8000/docs`
   - **Jaeger Monitoring**: `http://localhost:16686`

---

## 📊 Monitoring & Observability
The project is instrumented with **OpenTelemetry**. You can visualize request flows, SQL query latencies, and AI extraction times in the **Jaeger UI**.

To view traces:
1. Open Jaeger at `http://localhost:16686`.
2. Select `backend-hr-pulse` service.
3. Search for traces like `POST /Predict` or `azure_ai_extraction`.

---

## 🛠️ Tech Stack
- **Backend**: FastAPI, SQLAlchemy, Pydantic, Joblib.
- **Frontend**: Next.js, TailWindCSS / Streamlit.
- **Database**: Azure SQL Server / MSSQL.
- **AI/ML**: Scikit-Learn (Random Forest), Azure AI Text Analytics.
- **DevOps**: Docker, Terraform, GitHub Actions, OpenTelemetry, Jaeger.

---

## 📄 Presentation
A more detailed project presentation is available in the [presentation.md](file:///Users/lait-zet/.gemini/antigravity/brain/83b1fb7d-19c9-4585-bb46-a7a673357eca/presentation.md) (Markdown) or as a PDF.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
