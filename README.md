[![CI/CD Pipeline](https://github.com/Juanesgodu/lab12026p-JEGD/actions/workflows/build.yml/badge.svg)](https://github.com/Juanesgodu/lab12026p-JEGD/actions/workflows/build.yml)
[![Quality gate status](https://sonarcloud.io/api/project_badges/measure?project=Juanesgodu_lab12026p-JEGD&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Juanesgodu_lab12026p-JEGD)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Juanesgodu_lab12026p-JEGD&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Juanesgodu_lab12026p-JEGD)
[![Known Vulnerabilities](https://snyk.io/test/github/Juanesgodu/lab12026p-JEGD/badge.svg)](https://snyk.io/test/github/Juanesgodu/lab12026p-JEGD)

# Banco UdeA - Laboratorio de Arquitectura de Software

Aplicación bancaria con backend en Spring Boot (API REST) y frontend en React.

Operaciones disponibles:

* Consultar clientes y crear nuevos clientes
* Realizar transferencias de dinero entre cuentas
* Consultar el histórico de transacciones de una cuenta

Incluye integración continua con GitHub Actions.

## Tecnologías

* Backend: Java 17, Spring Boot 3.5, Spring Data JPA, MySQL, MapStruct, Lombok
* Frontend: React, Vite, Axios
* Pruebas: JUnit 5, Mockito
* CI/CD: GitHub Actions

## Estructura de carpetas

* `src/main` contiene el código del backend
* `src/test` contiene las pruebas unitarias
* `frontend/lab12026p-frontend` contiene el frontend en React (ver su README)
* `.github/workflows` contiene el pipeline de CI/CD

## Endpoints principales

| Método | Ruta                                | Descripción                         |
|--------|-------------------------------------|-------------------------------------|
| GET    | `/api/customers`                    | Lista todos los clientes            |
| GET    | `/api/customers/{id}`               | Obtiene un cliente por ID           |
| POST   | `/api/customers`                    | Crea un cliente                     |
| POST   | `/api/transactions`                 | Realiza una transferencia           |
| GET    | `/api/transactions/{accountNumber}` | Histórico de transacciones de cuenta|

## Cómo ejecutar el backend

Requisitos: JDK 17 y MySQL en `localhost:3306` con una base de datos llamada `lab12026p`.

```shell
mysql -u root -p -e "CREATE DATABASE lab12026p;"
./mvnw spring-boot:run
```

La API queda en `http://localhost:8080`.

### Configuración de la base de datos

Por defecto la aplicación usa `root` / `root` contra `localhost:3306/lab12026p` (ver `application.properties`).
Si tu MySQL tiene otras credenciales, no edites el archivo: sobrescríbelas con variables de entorno.

**PowerShell (Windows):**

```powershell
$env:SPRING_DATASOURCE_USERNAME = "root"
$env:SPRING_DATASOURCE_PASSWORD = Read-Host "Introduce tu contraseña de MySQL"
java -jar .\lab12026p-0.0.1-SNAPSHOT.jar
```

**Linux / macOS:**

```shell
export SPRING_DATASOURCE_USERNAME=root
read -s -p "Contraseña de MySQL: " SPRING_DATASOURCE_PASSWORD && export SPRING_DATASOURCE_PASSWORD
java -jar lab12026p-0.0.1-SNAPSHOT.jar
```

También se puede sobrescribir la URL con `SPRING_DATASOURCE_URL` (por ejemplo, para apuntar a una base en la nube).
Las variables solo viven en esa terminal. Estas mismas variables funcionan con `./mvnw spring-boot:run`.

## Cómo ejecutar las pruebas

```shell
./mvnw test
```

Las pruebas unitarias no necesitan base de datos (los repositorios se simulan con Mockito).

## Cómo ejecutar el frontend

Ver `frontend/lab12026p-frontend/README.md`.