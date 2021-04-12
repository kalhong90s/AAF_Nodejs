node {
  def app

 

  /* withEnv for define jenkinsfile env params */
  withEnv(
    ['DOCKER_IMG_NAME=php7-apache-mysql_pdo',
    'DOCKER_TAG=v4.0.0',
    'DOCKER_REGISTRY=registry.matador.ais.co.th',
    'TARGET_HOST=azdipwvenmayaf004',
    'EXPOSE_PORT=-p 9999:80']) {

 

  /* Pipeline stage */
      stage('Clone git repository') {
        checkout scm
      }

 

      stage('Check files') {
        sh "pwd"
        sh "ls -lh"
      }

 

      stage('Build container image') {
        //app = docker.build("${env.DOCKER_REGISTRY}/${env.DOCKER_IMG_NAME}:${env.DOCKER_TAG}")
        sh 'docker build --build-arg http_proxy=http://10.137.18.77:3128 .' 
      }
/*
      stage('Test container image') {
        app.inside {
          sh 'hostname'
          sh 'echo "Tests container: passed"'
        }
      }

 

      stage('Push image to container registry') {
        withDockerRegistry(credentialsId: 'nexus3-userpasswd',
        url: "http://${env.DOCKER_REGISTRY}") {
          app.push("${env.DOCKER_TAG}")
        }
      }

 

      stage('Deploy to target host') {
        sshPublisher(
          publishers: [
            sshPublisherDesc(
              configName: "${env.TARGET_HOST}", transfers: [
                sshTransfer(
                  excludes: '',
                  execCommand: "sudo docker run -d ${env.EXPOSE_PORT} ${env.DOCKER_REGISTRY}/${env.DOCKER_IMG_NAME}:${env.DOCKER_TAG}",
                  execTimeout: 120000,
                  flatten: false,
                  makeEmptyDirs: false,
                  noDefaultExcludes: false,
                  patternSeparator: '[, ]+',
                  remoteDirectory: '',
                  remoteDirectorySDF: false,
                  removePrefix: '',
                  sourceFiles: ''
                )
              ],
              usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false
            )
          ]
        )
      }*/

 

  }  /* withEnv */
} /* node */
 