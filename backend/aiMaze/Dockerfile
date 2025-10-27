FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/aiMaze-0.0.1-SNAPSHOT.jar /app/aiMaze-0.0.1-SNAPSHOT.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","aiMaze-0.0.1-SNAPSHOT.jar"]