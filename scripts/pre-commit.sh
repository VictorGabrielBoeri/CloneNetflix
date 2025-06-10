#!/bin/bash

echo "🔍 Executando verificações pré-commit..."

# Lint
echo "📝 Verificando ESLint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint falhou!"
  exit 1
fi

# Testes
echo "🧪 Executando testes..."
npm run test:ci
if [ $? -ne 0 ]; then
  echo "❌ Testes falharam!"
  exit 1
fi

# Build
echo "🏗️ Verificando build..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build falhou!"
  exit 1
fi

echo "✅ Todas as verificações passaram!"