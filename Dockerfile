FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
COPY target/simulateur_aerien-0.0.1-SNAPSHOT.jar /app.jar
EXPOSE 8084
ENTRYPOINT ["java","-jar","/app.jar"]
