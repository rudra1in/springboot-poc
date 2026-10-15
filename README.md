# GameX — Define Sport Module

End-to-end implementation of the **Define Sport** screen (ORG-03).

## Stack

| Layer    | Tech                                              |
|----------|---------------------------------------------------|
| Backend  | Spring Boot 3.3, Java 21, JPA, Flyway, PostgreSQL |
| Frontend | React 18, Vite, TypeScript, TanStack Query, shadcn/ui |
| Auth     | httpOnly JWT cookie + Spring Security             |

---

## Quick start (Docker)

```bash
docker compose up --build
```

| Service  | URL                              |
|----------|----------------------------------|
| Frontend | http://localhost:3000            |
| Backend  | http://localhost:8080/api/v1     |
| DB       | localhost:5432 (gamex / gamex)   |

---

## Local dev (without Docker)

### Backend

```bash
cd gamex-backend
# Requires PostgreSQL running on localhost:5432 with db=gamex, user=gamex, pass=gamex
./mvnw spring-boot:run
```

### Frontend

```bash
cd gamex-frontend
npm install
npm run dev        # http://localhost:3000
```

The Vite dev server proxies `/api` → `http://localhost:8080` automatically.

---

## Key files

```
gamex-backend/
  src/main/java/com/gamex/
    GamexApplication.java              ← @SpringBootApplication + @EnableJpaAuditing
    common/
      BaseEntity.java                  ← UUID PK + JPA Auditing
      ApiResponse.java                 ← Standard envelope { success, data, message }
      GlobalExceptionHandler.java      ← 400 / 404 / 409 / 500 handlers
      ResourceNotFoundException.java
      DuplicateResourceException.java
    sport/
      Sport.java                       ← @Entity
      SportType.java / SportStatus.java
      SportRepository.java
      SportService.java                ← @Service @Transactional
      SportController.java             ← GET/POST/PUT/DELETE /api/v1/sports
      dto/
        SportRequest.java              ← Java record with Bean Validation
        SportResponse.java             ← Java record with from(Sport) factory
  src/main/resources/
    application.yml
    db/migration/V3__create_sports.sql

gamex-frontend/
  src/
    api/
      client.ts      ← Axios instance (withCredentials, 401 interceptor)
      types.ts        ← ApiResponse<T>, PageResponse<T>
      sports.ts       ← sportsApi CRUD
    pages/org/
      SportPage.tsx   ← Main screen (create + edit mode)
    components/ui/    ← shadcn/ui components
    lib/utils.ts      ← cn() helper
    App.tsx           ← Routes
    main.tsx          ← React + QueryClient bootstrap
```

---

## API reference

| Method | Path                  | Auth               | Description        |
|--------|-----------------------|--------------------|--------------------|
| GET    | /api/v1/sports        | Any authenticated  | Paginated list     |
| GET    | /api/v1/sports/{id}   | Any authenticated  | Get by ID          |
| POST   | /api/v1/sports        | SUPER_ADMIN / ORG_ADMIN | Create sport  |
| PUT    | /api/v1/sports/{id}   | SUPER_ADMIN / ORG_ADMIN | Update sport  |
| DELETE | /api/v1/sports/{id}   | SUPER_ADMIN only   | Delete sport       |
