# Create the components directory if it doesn't exist
New-Item -ItemType Directory -Force -Path src\components

# Create the files
New-Item -ItemType File -Force -Path src\components\system-architecture.tsx
New-Item -ItemType File -Force -Path src\components\data-model.tsx
New-Item -ItemType File -Force -Path src\components\app-shell.tsx

Write-Host "system-architecture.tsx, data-model.tsx, and app-shell.tsx files have been created successfully."