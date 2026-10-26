.PHONY: run start-db backend

run: start-db
	cd backend && ./mvnw spring-boot:run

start-db:
	./start_db.sh

backend:
	cd backend && ./mvnw spring-boot:run
