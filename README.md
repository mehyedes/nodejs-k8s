# NodeJS on k8s

This is a tiny "Hello world" app written in NodeJS for Kubernetes. 

This README includes the necessary instructions to deploy the app along with its dependencies on a Minikube kubernetes cluster.

# Prerequisistes
The following tools must be installed in order to be able to deploy the setup:
- Minikube
- Docker
- kubectl
- Helm

# Clone the repository
First things first, we need to clone this repository on our local machine:
```bash
git clone https://github.com/mehyedes/nodejs-k8s.git
cd nodejs-k8s/
```

# Prepare the minikube cluster
Make sure that the minikube cluster is started with the flag `--vm=true` because we will need to enable the ingress addon:
```bash
minikube start --vm=true
```
Enable the ingress addon:
```bash
minikube addons enable ingress
```
To be able to access the services deployed on minikube later, we need to start by adding an entry to the `/etc/hosts` file with the following command:
```bash
echo "$(minikube ip) jenkins.default.local hello.dev.local hello.prod.local" | sudo tee -a /etc/hosts
```

# Run the app
This section provides instructions for running the app on Minikube. The following guides describe 2 different ways to deploy the nodejs-k8s app on Minikube:

- [Manual Setup](docs/manual-setup.md) provides step-by-step instructions to build and deploy the app manually to Minikube.
- [Automated CI/CD Setup](docs/automated-setup.md) provides instructions for an automated CI/CD setup where Jenkins is deployed and then used to build and deploy the application to Minikube.

# Cleaning up
Simple run the `cleanup.sh` script to delete any resources created in Minikube.
