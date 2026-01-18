#!/usr/bin/env node

/**
 * Deployment helper script for Vercel
 * This script helps prepare and deploy the application to Vercel
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

console.log('🚀 Nexus Marketplace Deployment Helper\n');

// Check if we're in the right directory
try {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  if (packageJson.name !== 'nexus-marketplace') {
    console.error('❌ Please run this script from the project root directory');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ package.json not found. Please run from project root.');
  process.exit(1);
}

console.log('✅ Project structure validated');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log('✅ Vercel CLI found');
} catch (error) {
  console.log('📦 Installing Vercel CLI...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed');
  } catch (installError) {
    console.error('❌ Failed to install Vercel CLI. Please install manually:');
    console.error('   npm install -g vercel');
    process.exit(1);
  }
}

// Build the project
console.log('🔨 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful');
} catch (error) {
  console.error('❌ Build failed. Please fix build errors before deploying.');
  process.exit(1);
}

// Deploy to Vercel
console.log('🚀 Deploying to Vercel...');
try {
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('\n✅ Deployment successful!');
  console.log('\n📋 Post-deployment checklist:');
  console.log('   1. Set environment variables in Vercel dashboard');
  console.log('   2. Update Google OAuth settings with your production URL');
  console.log('   3. Test all API endpoints');
  console.log('   4. Test authentication flow');
  console.log('\n🔗 Manage your deployment: https://vercel.com/dashboard');
} catch (error) {
  console.error('❌ Deployment failed. Please check the error above.');
  process.exit(1);
}
