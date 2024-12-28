/Users/dpadmin/deven/software/sonar-scanner-4.6.2.2472-macosx/bin/sonar-scanner \
  -Dsonar.projectKey=react_dpresume_com \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=59bc678059dbe90231f347932d9f754f76797c78


#docker run --rm -e SONAR_HOST_URL="http://localhost:9000" -e SONAR_LOGIN="188056923c014fdd7d007406af88dd4c5813c18c" -v "/app:/app" sonarsource/sonar-scanner-cli


