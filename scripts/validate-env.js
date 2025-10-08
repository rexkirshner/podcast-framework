#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 *
 * Validates that all required environment variables are set before build/deploy.
 * Run this as a prebuild step to catch missing env vars early.
 *
 * Usage: node scripts/validate-env.js
 */

// Required environment variables for the build
const REQUIRED_PUBLIC_VARS = [
  'PUBLIC_SANITY_PROJECT_ID',
  'PUBLIC_SANITY_DATASET',
];

// Required environment variables for Netlify functions
const REQUIRED_FUNCTION_VARS = [
  'SANITY_PROJECT_ID',
  'SANITY_DATASET',
  'SANITY_API_TOKEN', // Write token for contributions
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'NOTIFICATION_EMAIL',
];

// Optional but recommended variables
const RECOMMENDED_VARS = [
  'ALLOWED_ORIGIN', // Defaults to https://strangewater.xyz but should be set explicitly
];

function validateEnvVars() {
  let hasErrors = false;
  let hasWarnings = false;

  console.log('🔍 Validating environment variables...\n');

  // Check required public variables
  console.log('📦 Checking PUBLIC_ variables (required for build)...');
  for (const varName of REQUIRED_PUBLIC_VARS) {
    if (!process.env[varName]) {
      console.error(`❌ ERROR: Missing required environment variable: ${varName}`);
      hasErrors = true;
    } else {
      console.log(`✅ ${varName}: Set`);
    }
  }

  console.log('\n⚡ Checking Netlify Function variables (required for runtime)...');
  for (const varName of REQUIRED_FUNCTION_VARS) {
    if (!process.env[varName]) {
      console.error(`❌ ERROR: Missing required environment variable: ${varName}`);
      hasErrors = true;
    } else {
      console.log(`✅ ${varName}: Set`);
    }
  }

  console.log('\n💡 Checking recommended variables...');
  for (const varName of RECOMMENDED_VARS) {
    if (!process.env[varName]) {
      console.warn(`⚠️  WARNING: Recommended environment variable not set: ${varName}`);
      hasWarnings = true;
    } else {
      console.log(`✅ ${varName}: Set`);
    }
  }

  console.log('\n' + '='.repeat(60));

  if (hasErrors) {
    console.error('\n❌ VALIDATION FAILED: Missing required environment variables');
    console.error('\nPlease set the missing variables in:');
    console.error('  - Local: .env file');
    console.error('  - Netlify: Site settings > Environment variables');
    console.error('\nSee .env.example for reference.');
    process.exit(1);
  }

  if (hasWarnings) {
    console.warn('\n⚠️  VALIDATION PASSED WITH WARNINGS');
    console.warn('Consider setting recommended variables for production.\n');
  } else {
    console.log('\n✅ VALIDATION PASSED: All required environment variables are set\n');
  }
}

validateEnvVars();
