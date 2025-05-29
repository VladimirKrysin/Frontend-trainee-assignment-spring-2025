# avito_fe_tech_internship_2025_wave2_backend

API для тестового фронтенд задания "Мини-версия системы управления проектами(Project Management Systems)"

## Установка зависимостей

### Установка Docker и Make

#### macOS

1. **Установка Docker Desktop**:
   - Перейдите на [официальный сайт Docker](https://www.docker.com/products/docker-desktop) и скачайте установщик Docker Desktop для macOS.
   - Откройте скачанный файл `.dmg` и перетащите иконку Docker в папку "Программы".
   - Откройте Docker из папки "Программы" и дождитесь, пока он полностью загрузится.

2. **Установка Make**:
   - Откройте терминал и выполните следующую команду для установки Homebrew (если еще не установлен):

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

   - Установите Make:

   ```bash
   brew install make
   ```

#### Linux

1. **Установка Docker**:
   - Откройте терминал и выполните следующие команды:

   ```bash
   sudo apt-get update
   sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
   sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
   sudo apt-get update
   sudo apt-get install -y docker-ce
   ```

2. **Проверьте установку**:
   - Убедитесь, что Docker установлен, выполнив команду:

   ```bash
   docker --version
   ```


3. Удаление контейнера:
   ```bash
   make clean
   ```

4. Полная очистка:
   ```bash
   make clean-all
   ```

### Альтернативный запуск через Go

Если вы хотите запустить приложение напрямую через Go, выполните следующие шаги:

1. Убедитесь, что у вас установлен Go. Вы можете скачать его с [официального сайта Go](https://golang.org/dl/).
2. Из директории, где находится этот файл (README.md), выполните:
   ```bash
   go run сmd/service/main.go
   ```

После этого приложение будет доступно по адресу http://127.0.0.1:8080.

### Документация

После запуска контейнера документация будет доступна по ссылке http://127.0.0.1:8080/swagger/index.html