/**
 * Supabase Authentication Helper
 *
 * To create a reviews table, we need a Supabase access token.
 *
 * Steps to get the token:
 * 1. Go to https://supabase.com/dashboard/account/tokens
 * 2. Click "Generate new token"
 * 3. Name it something like "CLI Token"
 * 4. Copy the token (starts with "sbp_")
 * 5. Paste it when running this script
 *
 * Or run: npx supabase login
 * And it will open a browser for you to authenticate.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

const TOKEN_FILE = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.supabase', 'access-token')

async function main() {
  console.log('═'.repeat(60))
  console.log('SUPABASE AUTHENTICATION')
  console.log('═'.repeat(60))
  console.log()

  // Check if token already exists
  if (fs.existsSync(TOKEN_FILE)) {
    const token = fs.readFileSync(TOKEN_FILE, 'utf8').trim()
    if (token && token.startsWith('sbp_')) {
      console.log('✓ Supabase access token found!')
      console.log('  Token file:', TOKEN_FILE)
      console.log()
      console.log('You can now run migrations with:')
      console.log('  npx supabase db push')
      return
    }
  }

  console.log('No Supabase access token found.')
  console.log()
  console.log('To authenticate, please:')
  console.log()
  console.log('OPTION 1: Generate a token manually')
  console.log('1. Go to: https://supabase.com/dashboard/account/tokens')
  console.log('2. Click "Generate new token"')
  console.log('3. Name it "CLI Token"')
  console.log('4. Copy the token')
  console.log('5. Run: npx supabase login --token YOUR_TOKEN_HERE')
  console.log()
  console.log('OPTION 2: Open browser for authentication')
  console.log('Run: npx supabase login')
  console.log('(This will open a browser window)')
  console.log()
  console.log('─'.repeat(60))
  console.log()

  // If we have a token provided as argument, save it
  const tokenArg = process.argv[2]
  if (tokenArg && tokenArg.startsWith('sbp_')) {
    const tokenDir = path.dirname(TOKEN_FILE)
    if (!fs.existsSync(tokenDir)) {
      fs.mkdirSync(tokenDir, { recursive: true })
    }
    fs.writeFileSync(TOKEN_FILE, tokenArg)
    console.log('✓ Token saved to:', TOKEN_FILE)
    return
  }

  console.log('After authenticating, run:')
  console.log('  npx tsx scripts/run-migration.ts')
}

main().catch(console.error)
