pipeline {
  agent any
  tools { nodejs 'node20' }

  options { timestamps() }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Versiones') {
      steps {
        sh 'node -v && npm -v'
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Test') {
      when { expression { fileExists('package.json') } }
      steps {
        // Ejecuta Jest con coverage (definido en package.json)
        sh 'npm test'
      }
    }

    stage('Coverage (Codecov)') {
      steps {
        withCredentials([string(credentialsId: 'codecov-token', variable: 'CODECOV_TOKEN')]) {
          sh '''
            # Descargar Codecov CLI (Linux estándar)
            curl -Os https://cli.codecov.io/latest/linux/codecov
            chmod +x codecov

            # Subir el reporte de coverage
            ./codecov upload-process \
              --fail-on-error \
              -t "$CODECOV_TOKEN" \
              -f coverage/lcov.info
          '''
        }
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Artefacto (build)') {
      steps {
        archiveArtifacts artifacts: 'dist/**/*, build/**/*',
                         allowEmptyArchive: true
      }
    }
  }

  post {
    always { echo 'Pipeline backend finalizado.' }
  }
}