# Stage 1: build the Angular bundle
FROM node:20-alpine AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: build the Spring Boot jar (with the Angular bundle copied into static/)
FROM maven:3.9-eclipse-temurin-17 AS backend
WORKDIR /app
COPY pom.xml ./
RUN mvn -B -q dependency:go-offline
COPY src/ ./src/
COPY --from=frontend /frontend/dist/frontend/browser/ ./src/main/resources/static/
RUN mvn -B -q clean package -DskipTests

# Stage 3: minimal runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
