@echo off
chcp 65001 > nul
title Atualizar Quiz no GitHub e Vercel
cls
echo ========================================================
echo       ENVIAR ATUALIZACOES PARA O GITHUB & VERCEL
echo ========================================================
echo.

git --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] O Git nao foi encontrado no sistema.
    echo Baixe e instale o Git em: https://git-scm.com/download/win
    echo.
    pause
    exit /b
)

echo [1/3] Preparando arquivos alterados...
if not exist ".git" (
    git init
    git branch -M main
)

git add -A

echo.
echo [2/3] Criando pacote de atualizacoes...
git commit -m "Atualizacao: nova VSL, barra de progresso e correcoes"

echo.
echo [3/3] Enviando para o GitHub...
git remote get-url origin > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Informe o link do seu repositorio no GitHub (apenas na 1a vez):
    echo Exemplo: https://github.com/seunome/quiz-calistenia.git
    echo.
    set /p REPO_URL="Cole o link aqui e aperte ENTER: "
    if "%REPO_URL%"=="" (
        echo [AVISO] Nenhum link informado.
        pause
        exit /b
    )
    git remote add origin %REPO_URL%
)

git push origin main

echo.
echo ========================================================
echo   âœ… SUCESSO! ALTERACOES ENVIADAS PARA O GITHUB!
echo ========================================================
echo A Vercel ja esta atualizando o seu site no ar automaticamente!
echo.
pause
