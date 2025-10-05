# Development Setup Guide

## 📁 Target Directory
**Project Location**: `c:\Users\PC\byu classwork\CSE310\module3`

## Prerequisites

### System Requirements
- **Operating System**: Windows 10/11
- **Node.js**: Version 18.0.0 or higher
- **Package Manager**: npm (comes with Node.js) or yarn
- **Editor**: VS Code (recommended)
- **Browser**: Chrome, Firefox, or Edge (latest versions)

### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

## Installation Steps

### 1. Navigate to Project Directory
```powershell
cd "c:\Users\PC\byu classwork\CSE310\module3"
```

### 2. Install Dependencies
```powershell
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Verify Installation
```powershell
# Check if all dependencies are installed
npm list --depth=0

# Verify TypeScript compilation
npx tsc --noEmit
```

### 4. Start Development Server
```powershell
npm run dev
```

The application will be available at `http://localhost:5173`

## Development Commands

### Core Commands
```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit

# Lint code
npx eslint src/

# Format code (if prettier is configured)
npx prettier --write src/
```

### Useful Development Commands
```powershell
# Clear npm cache (if issues arise)
npm cache clean --force

# Reinstall all dependencies
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install

# Check for outdated packages
npm outdated

# Update packages
npm update
```

## Project Configuration

### Environment Variables
Create a `.env.local` file in the project root:
```env
# API Configuration
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=InventoryPro

# Feature Flags
VITE_ENABLE_MOCK_DATA=true
VITE_ENABLE_DEBUG=true

# External Services (Optional)
VITE_FIREBASE_API_KEY=your_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
```

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

## Common Development Issues & Solutions

### Issue 1: Port Already in Use
```powershell
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Or use a different port
npm run dev -- --port 3000
```

### Issue 2: TypeScript Errors
```powershell
# Clear TypeScript cache
Remove-Item .tsbuildinfo -Force

# Restart TypeScript server in VS Code
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### Issue 3: Module Resolution Issues
```powershell
# Clear node modules and reinstall
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

### Issue 4: Tailwind CSS Not Working
```powershell
# Verify Tailwind installation
npx tailwindcss --help

# Rebuild CSS
npm run build
```

## Development Workflow

### Daily Development Process
1. **Pull latest changes** (if using version control)
2. **Install new dependencies** (if package.json changed)
3. **Start development server**
4. **Make changes and test**
5. **Commit changes** (if using version control)

### Code Organization Guidelines
```
src/
├── components/          # Reusable UI components
│   ├── base/           # Basic components (Button, Input, etc.)
│   └── feature/        # Feature-specific components
├── pages/              # Page components and routing
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── services/           # API services and external integrations
└── constants/          # Application constants
```

### Component Creation Template
```typescript
// components/example/ExampleComponent.tsx
import React from 'react';

interface ExampleComponentProps {
  title: string;
  onClick?: () => void;
}

export default function ExampleComponent({ title, onClick }: ExampleComponentProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">{title}</h2>
      {onClick && (
        <button 
          onClick={onClick}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Click me
        </button>
      )}
    </div>
  );
}
```

## Debugging Setup

### Browser DevTools
1. **Install React Developer Tools** extension
2. **Enable source maps** in browser settings
3. **Use console for debugging**:
   ```javascript
   console.log('Debug info:', data);
   console.table(arrayData);
   console.group('Feature Group');
   ```

### VS Code Debugging
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

## Performance Monitoring

### Development Performance
```typescript
// Add performance monitoring in development
if (import.meta.env.DEV) {
  console.time('Component Render');
  // Component logic
  console.timeEnd('Component Render');
}
```

### Bundle Analysis
```powershell
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Analyze bundle size
npm run build
# Check dist/stats.html
```

## Testing Setup

### Unit Testing Configuration
```powershell
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

### Test File Structure
```
src/
├── components/
│   ├── Button.tsx
│   └── __tests__/
│       └── Button.test.tsx
└── utils/
    ├── helpers.ts
    └── __tests__/
        └── helpers.test.ts
```

## Deployment Preparation

### Build Optimization
```powershell
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Check build output
ls dist/
```

### Pre-deployment Checklist
- [ ] All TypeScript errors resolved
- [ ] All tests passing
- [ ] Production build successful
- [ ] Environment variables configured
- [ ] Performance optimized
- [ ] Security considerations addressed

## Troubleshooting

### Common Error Messages

#### "Cannot find module"
```powershell
# Clear node_modules and reinstall
Remove-Item node_modules -Recurse -Force
npm install
```

#### "TypeScript error in ..."
```powershell
# Check TypeScript configuration
npx tsc --noEmit --listFiles
```

#### "Vite build failed"
```powershell
# Clear Vite cache
Remove-Item node_modules/.vite -Recurse -Force
npm run dev
```

### Getting Help
1. **Check console errors** in browser DevTools
2. **Review TypeScript errors** in VS Code
3. **Verify file paths** and imports
4. **Check package.json** for missing dependencies
5. **Restart development server** if needed

---

**Last Updated**: October 5, 2025
**Target Folder**: `c:\Users\PC\byu classwork\CSE310\module3`
