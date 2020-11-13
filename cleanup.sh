#!/bin/bash
echo "Cleaning up..."

echo "Deleting dev environment"
kubectl delete namespace dev
echo "Deleting prod environment"
kubectl delete namespace prod

echo "Deleting jenkins"
kubectl delete serviceaccount jenkins
kubectl delete clusterrolebinding jenkins
helm uninstall jenkins

echo "Cleanup finished successfully."
