# 🇨🇦🇺🇸 Canada-US Trade Tariff Simulator

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

## 📌 Executive Summary
The **Canada-US Trade Tariff Simulator** is a full-stack data visualization dashboard designed to model the economic impact of potential US tariffs on Canadian provincial exports. 

By leveraging historical trade data, this tool allows economic analysts and business leaders to calculate the **Tariff Exposure (Revenue at Risk)** in real-time across different industries, provinces, and fiscal years.

> **View the live demonstration / LinkedIn Post:** [Link to your LinkedIn Post here]

---

## 🏗️ System Architecture & Tech Stack

This project was built using a modern, scalable Full-Stack architecture:

*   **Data Engineering:** Python (Google Colab) & Pandas for extracting, cleaning, and transforming over 133,000 rows of raw export data from Statistics Canada.
*   **Database:** Cloud PostgreSQL (Neon) for secure, high-performance querying of relational data.
*   **Backend (API):** Node.js & Express.js. Engineered a RESTful API to handle dynamic SQL queries with parameters for region and year, ensuring low-latency data delivery.
*   **Frontend (UI/UX):** React.js & Vite. Built a highly interactive, state-driven dashboard utilizing `recharts` for dynamic charting and custom KPI cards for executive-level summaries.

---

## 🚀 Key Features

*   **Real-Time Impact Modeling:** An interactive slider allows users to simulate various tariff rates (0% - 100%) and instantly visualizes the potential revenue squeeze on Canadian exporters.
*   **Dynamic Data Filtering:** Users can drill down into specific data cuts, comparing the National Total against all 13 individual Canadian provinces and territories.
*   **Executive KPI Cards:** Top-level metrics calculating Total Export Volume, Share of National Total, and total Tariff Exposure using asynchronous data fetching (`Promise.all`).
*   **Responsive UI & Glassmorphism Design:** A modern, corporate-grade interface optimized for readability and data comprehension.

---

## 💻 Local Setup & Installation

To run this project locally, you will need Node.js and a PostgreSQL database.

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/tariff-simulator.git](https://github.com/your-username/tariff-simulator.git)
cd tariff-simulator
```

2. Backend Setup
```bash
cd backend
npm install
# Create a .env file and add your database URL:
# DATABASE_URL=postgres://user:password@host/dbname
npm start
```

3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

Navigate to http://localhost:5173 in your browser.

👨‍💻 Author
[Jorge Parra]

Role: Full-Stack Developer / Data Analyst

LinkedIn: [https://www.linkedin.com/in/jorge-parra-67869634a/]

GitHub: [https://github.com/georgepm31-lab]

Data source: Statistics Canada (2020-2026).
