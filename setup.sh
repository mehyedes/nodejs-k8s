#!/bin/bash
set -e

function logMessage() {
  echo
  echo
  echo "--------------------------------------------------------------"
  echo "--------- $1"
  echo "--------------------------------------------------------------"
  echo
}

function installMysql(){
  helm upgrade --install mysql stable/mysql -n $1 -f values/$1/mysql.yaml --wait --create-namespace
}

logMessage "Adding helm repos"
helm repo add jenkinsci https://charts.jenkins.io
helm repo add stable https://charts.helm.sh/stable
helm repo update

logMessage "Installing Jenkins CI/CD Helm chart"
kubectl apply -f values/jenkins_sa.yaml
helm upgrade --install jenkins jenkinsci/jenkins -n default -f values/jenkins.yaml --wait

logMessage "Deploying MySQL to dev environment"
installMysql dev
logMessage "Deploying MySQL to prod environment"
installMysql prod
