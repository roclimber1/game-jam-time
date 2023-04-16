# game-jam-time
'Time battle' - a simple game for Gamedev.js Jam 2023


### To start debugging use command

```sh
npm run start
```

### To create a bundle use command

```sh
npm run build
```

### Docker

```sh
# build docker
docker build -f ./docker/Dockerfile -t game-jam-time .

# run docker
docker run -p 0.0.0.0:8080:8080 -d game-jam-time
```
