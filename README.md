# Monitoring & Logging Stack using Prometheus, Grafana, and Loki

This project demonstrates a complete **local monitoring and logging setup** for a containerized application using **Prometheus for metrics**, **Loki for centralized logging**, and **Grafana for visualization**.

The goal of this project is to understand how application health is monitored in real-world environments and how metrics and logs are correlated during troubleshooting and incident analysis.

---

## Architecture Diagram

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/f78d8997-ccba-40b3-8adf-d5102b72cd72" />

---

## Monitoring & Logging Workflow

1. The application runs inside a Docker container and exposes metrics on the `/metrics` endpoint.
2. Prometheus periodically scrapes metrics from the application.
3. The application writes logs to a file inside the container.
4. Promtail reads the log file and forwards logs to Loki.
5. Loki stores logs using filesystem-based storage.
6. Grafana connects to both Prometheus and Loki as data sources.
7. Grafana dashboards visualize metrics and allow querying application logs.
8. Metrics and logs are correlated during troubleshooting.

---

## Tools Used

- Docker & Docker Compose
- Node.js
- Prometheus (Metrics collection)
- Grafana (Visualization)
- Loki (Centralized logging)
- Promtail (Log shipping)
- Linux

---

## Key Learnings

- Difference between **metrics and logs** and their use cases
- How Prometheus scrapes metrics using a pull-based model
- How Loki stores logs efficiently without full-text indexing
- Importance of Docker networking and service discovery
- How Grafana acts as a single observability layer
- Debugging real-world issues in monitoring stacks
- Understanding single-binary vs distributed Loki deployment modes

---

## Issues Faced and Fixes

### Issue 1: Grafana could not connect to Prometheus (Connection Refused)

**Problem:**  
Grafana failed to connect to Prometheus when using `localhost`.

**Root Cause:**  
Grafana was running inside a Docker container, where `localhost` refers to the container itself.

**Solution:**  
Used the Prometheus service name (`http://prometheus:9090`) to enable inter-container communication via Docker networking.

---

### Issue 2: Loki failed to start with schema configuration error

**Problem:**  
Loki failed with: invalid schema config: must specify at least one schema configuration


**Solution:**  
Added a proper `schema_config` using `boltdb-shipper` with filesystem storage.

---

### Issue 3: Loki attempted to connect to Consul (port 8500)

**Problem:**  
Loki tried to start in distributed mode and expected a Consul KV store.

**Root Cause:**  
Default Loki behavior without explicitly defining single-binary mode.

**Solution:**  
Configured Loki to use an **in-memory KV store** (`ring.kvstore.store: inmemory`) and disabled analytics reporting, forcing Loki to run in single-binary local mode.

---

## Screenshots

1. **Docker Compose Services Running**
   - <img width="1227" height="127" alt="image" src="https://github.com/user-attachments/assets/1475cb20-65f6-4b9b-9b85-449b6a255cd1" />

2. **Prometheus Targets Page**
   - <img width="1912" height="334" alt="Screenshot 2026-02-01 115616" src="https://github.com/user-attachments/assets/a50615ae-e715-44f8-88ae-d69b3d6308d2" />

3. **Grafana Prometheus Dashboard**
   - <img width="1179" height="802" alt="Screenshot 2026-02-01 120458" src="https://github.com/user-attachments/assets/ad831794-1ace-4834-9585-4b7c3721d7b1" />

4. **Grafana Loki Logs View**
   - <img width="1177" height="788" alt="Screenshot 2026-02-01 120523" src="https://github.com/user-attachments/assets/1e4ba1d0-a2ee-4153-abac-bfcdd93b50a3" />

5. **Combined Grafana Dashboard**
   - <img width="1559" height="829" alt="Screenshot 2026-02-01 120426" src="https://github.com/user-attachments/assets/56237a83-1423-4eab-93a3-5a234e56ecfa" />

---

## Cleanup Commands

To stop and remove all running containers and volumes:

- docker compose down -v

---

## Conclusion

This project provides hands-on experience with application observability by implementing both monitoring and logging using industry-standard tools. It simulates real-world scenarios where DevOps engineers monitor system health, investigate issues, and correlate metrics with logs to reduce downtime and improve reliability.
