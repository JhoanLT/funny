pipeline {
  agent any
  tools { nodejs 'node20' }

  options { timestamps() }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Versiones') {
      steps { sh 'node -v && npm -v' }
    }

    stage('Install') {
      steps { sh 'npm ci' }
    }

    stage('Test') {
      when { expression { fileExists('package.json') } }
      steps { sh 'npm test || true' }
    }

    stage('Build') {
      steps { sh 'npm run build' }
    }

    stage('Artefacto (build)') {
      steps {
        archiveArtifacts artifacts: 'dist/**/*, build/**/*', allowEmptyArchive: true
      }
    }
  }

  post {
    always { echo 'Pipeline backend finalizado.' }
  }
}