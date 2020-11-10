pipeline {
    parameters {
        string(name: 'VERSION',            defaultValue: 'latest',                 description: 'App version')
    }
    agent {
        kubernetes {
            defaultContainer 'jnlp'
            yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    type: jenkins-runner
spec:
  serviceAccountName: jenkins
  containers:
    - name: docker
      image: docker:19.03
      command:
        - cat
      tty: true
      privileged: true
      volumeMounts:
        - name: dockersock
          mountPath: /var/run/docker.sock
    - name: helm
      image: lachlanevenson/k8s-helm:v3.1.1
      command:
        - cat
      tty: true
  volumes:
    - name: dockersock
      hostPath:
        path: /var/run/docker.sock
"""
        }
    }
    stages {
        stage('Build Docker Image') {
            steps {
                container('docker') {
                    sh "docker build -t nodejs-k8s:${VERSION} ."
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                container('helm') {
                    sh """
                        helm upgrade --install \
                        --set image.tag=${VERSION} \
                        nodejs-k8s \
                        ./chart/nodejs-k8s/ \
                        -f values/dev/nodejs-k8s.yaml \
                        -n dev
                    """
                }
            }
        }
    }
}
