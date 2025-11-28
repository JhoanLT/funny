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
            ARCH=$(uname -m)
            echo "Detected arch: $ARCH"

            if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
              echo "Using Codecov CLI for linux-arm64"
              curl -Os https://cli.codecov.io/latest/linux-arm64/codecov
            else
              echo "Using Codecov CLI for linux (x86_64)"
              curl -Os https://cli.codecov.io/latest/linux/codecov
            fi

            chmod +x codecov

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