docker-app:
	-docker ps -a -q --filter "name=gs-app" | xargs -r docker stop
	-docker ps -a -q --filter "name=gs-app" | xargs -r docker rm
	-docker run --name gs-app -p 3020:3000  gs-app


docker-build:
	docker build -t gs-app .