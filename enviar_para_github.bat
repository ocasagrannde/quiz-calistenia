@echo off
chcp 65001 > nul
title Enviar Quiz para o GitHub
cls
echo ========================================================
echo       ENVIAR QUIZ CALISTENIA PARA O GITHUB
echo ========================================================
echo.

git --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] O Git ainda nao foi detectado.
    echo Certifique-se de ter concluido a instalacao do Git e reinicie este arquivo.
    echo.
    pause
    exit /b
)

echo [1/4] Inicializando repositorio Git...
git init
git branch -M main

echo.
echo [2/4] Adicionando todos os 131 arquivos do projeto...
git add -A

echo.
echo [3/4] Criando commit inicial...
git commit -m "Deploy inicial do Quiz Calistenia"

echo.
echo ========================================================
echo Cole abaixo o link do seu repositorio no GitHub
echo Exemplo: https://github.com/seunome/quiz-calistenia.git
echo ========================================================
echo.
set /p REPO_URL="Cole o link aqui e aperte ENTER: "

if "%REPO_URL%"=="" (
    echo [AVISO] Nenhum link informado.
    pause
    exit /b
)

git remote remove origin > nul 2>&1
git remote add origin %REPO_URL%

echo.
echo [4/4] Enviando arquivos para o GitHub...
git push -u origin main --force

echo.
echo ========================================================
echo         SUCESSO! ARQUIVOS ENVIADOS AO GITHUB!
echo ========================================================
echo Agora basta abrir a Vercel e importar o repositorio!
echo.
pause
