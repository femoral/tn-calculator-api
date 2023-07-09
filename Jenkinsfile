pipeline {
    agent any

    options { skipDefaultCheckout() }

    stages {
        stage('Build Image & Deploy') {
            steps {
                build job: '/common-pipelines/deploy-application/pnpm-node',
                      parameters: [
                        string(name: 'ORGANIZATION', value: 'femoral'),
                        string(name: 'REPOSITORY', value: 'tn-calculator-api'),
                        string(name: 'BRANCH_NAME', value: "${BRANCH_NAME}"),
                        string(name: 'OPEN_API', value: "api.yaml")
                      ]
            }
        }
    }
}