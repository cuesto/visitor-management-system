# vms

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

# Docker commands
```
docker build -t vms-front .
```
```
docker run -it -p 53745:80 --rm --name vms-front-app vms-front
```
```
http://192.168.99.100:53745/
```
```
docker save -o prod-vms-front.tar vms-front
```
```
docker load -i prod-vms-front.tar
```


### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/)

# Resource
https://es.vuejs.org/v2/cookbook/dockerize-vuejs-app.html
