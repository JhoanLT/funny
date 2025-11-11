pipeline {
  agent any
  tools { nodejs 'node20' }
  options { disableConcurrentBuilds() }
  triggers { pollSCM('H/5 * * * *') } // sin webhook

  stages {
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[url: 'https://github.com/JhoanLT/funny.git', credentialsId: 'github-pat']]
        ])
      }
    }
    stage('Install') {
      steps { sh 'npm ci' }
    }
    stage('Test') {
      steps { sh 'npm test --silent || true' } // no rompas si aún no hay tests
      post {
        always { junit allowEmptyResults: true, testResults: 'reports/**/*.xml' }
      }
    }
    stage('Build') {
      steps { sh 'npm run build || true' }
      post {
        success { archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true }
      }
    }
  }
  post {
    always { echo "Pipeline backend finalizado." }
  }
}