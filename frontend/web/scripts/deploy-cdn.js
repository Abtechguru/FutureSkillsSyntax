// scripts/deploy-cdn.js
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const S3_BUCKET = process.env.S3_BUCKET
const CLOUDFRONT_DISTRIBUTION_ID = process.env.CLOUDFRONT_DISTRIBUTION_ID

if (!S3_BUCKET || !CLOUDFRONT_DISTRIBUTION_ID) {
  console.error('Error: S3_BUCKET and CLOUDFRONT_DISTRIBUTION_ID must be set')
  process.exit(1)
}

console.log('🚀 Starting deployment to CDN...')

try {
  // 1. Build the application
  console.log('📦 Building application...')
  execSync('npm run build', { stdio: 'inherit' })

  // 2. Upload to S3
  console.log('📤 Uploading to S3...')
  const distPath = path.join(process.cwd(), 'dist')
  
  // Upload with proper cache headers
  execSync(
    `aws s3 sync ${distPath}/ s3://${S3_BUCKET}/ --delete --cache-control "public, max-age=31536000" --exclude "index.html" --exclude "*.json"`,
    { stdio: 'inherit' }
  )

  // Upload HTML files with no cache
  execSync(
    `aws s3 cp ${distPath}/index.html s3://${S3_BUCKET}/index.html --cache-control "public, max-age=0, must-revalidate"`,
    { stdio: 'inherit' }
  )

  // Upload manifest files with no cache
  execSync(
    `aws s3 cp ${distPath}/*.json s3://${S3_BUCKET}/ --cache-control "public, max-age=0, must-revalidate"`,
    { stdio: 'inherit' }
  )

  // 3. Create CloudFront invalidation
  console.log('🔄 Creating CloudFront invalidation...')
  const invalidation = JSON.parse(
    execSync(
      `aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths "/*"`,
      { encoding: 'utf-8' }
    )
  )

  console.log(`✅ Invalidation created: ${invalidation.Invalidation.Id}`)
  console.log('🎉 Deployment completed successfully!')

  // 4. Display URLs
  console.log('\n🌐 Your application is available at:')
  console.log(`   https://${S3_BUCKET}.s3-website-${AWS_REGION}.amazonaws.com`)
  console.log(`   https://${CLOUDFRONT_DISTRIBUTION_ID}.cloudfront.net`)

} catch (error) {
  console.error('❌ Deployment failed:', error.message)
  process.exit(1)
}