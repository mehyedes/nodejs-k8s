# Manual Setup
This section provides step-by-step instructions to run the application on Minikube.

## Build Docker Image
First, in order to ensure that the image will be available to Minikube's kubelet later, we would need to point our Docker client to the Minikube's Docker daemon.
This way we dont't need a Docker registry:
```bash
eval $(minikube -p minikube docker-env)
```
We need to prepare some environment variables that we will use for the build and deployment of our app:
```bash
# Set the Docker image tag
export DOCKER_TAG="v1"
# Choose the environment:
#  - dev
#  or
#  - prod
export ENVIRONMENT="dev"
```

Then we can build a new Docker image for the NodeJS app:
```bash
docker build -t nodejs-k8s:${DOCKER_TAG} .
```
## Configure the application
Our application can be deployed to Kubernetes as a Helm chart. 

Before proceeding to the deployment, we need to configure our application and its dependencies(MySQL).
Since we are using Helm for the installation, we simply need to update the [Values](https://helm.sh/docs/chart_template_guide/values_files/) files for each environment under the `values/${ENVIRONMENT}/` folder.

For the `dev` environment, MySQL can be configured by updating the [`values/dev/mysql.yaml`](../values/dev/mysql.yaml) file, and nodejs-k8s app can be configured by updating the [`values/dev/nodejs-k8s.yaml`](../values/dev/nodejs-k8s.yaml) file.


## Install MySQL
Now that our Docker image is ready, we can install the MySQL Helm chart
```bash
helm repo add stable https://charts.helm.sh/stable
helm upgrade --install mysql stable/mysql \
         -n ${ENVIRONMENT} \
         -f values/${ENVIRONMENT}/mysql.yaml \
         --wait --create-namespace
```
Check that mysql is up and running:
```bash
kubectl get pods -n dev
NAME                    READY   STATUS    RESTARTS   AGE
mysql-67799649d-txsdb   1/1     Running   0          21s
```
## Deploy the NodeJS application:
```bash
helm upgrade --install nodejs-k8s ./chart/nodejs-k8s/ \
         -n ${ENVIRONMENT} \
         --set image.tag=${DOCKER_TAG} \
         -f values/${ENVIRONMENT}/nodejs-k8s.yaml \
         --wait --timeout 1m
```
The helm command should return something similar to the following text:
```
Release "nodejs-k8s" does not exist. Installing it now.
NAME: nodejs-k8s
LAST DEPLOYED: Fri Nov 13 20:49:17 2020
NAMESPACE: dev
STATUS: deployed
REVISION: 1
NOTES:
1. Get the application URL by running these commands:
  http://hello.dev.local/
```
As the command output suggests, we can now access our app by navigating to http://hello.dev.local/ or http://hello.prod.local/ depending on the value of `$ENVIRONMENT`.

> [Proceed with Automated CI/CD Setup](./automated-setup.md)
 
> [Return to README.md](../README.md)
