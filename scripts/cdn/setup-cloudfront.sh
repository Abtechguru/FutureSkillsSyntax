# scripts/cdn/setup-cloudfront.sh
#!/bin/bash
set -e

echo "☁️ Setting up CloudFront CDN for FutureSkillsSyntax..."

# Load environment
source ../../.env.production

# Create S3 bucket for static assets
create_s3_bucket() {
    echo "🪣 Creating S3 bucket for static assets..."
    
    BUCKET_NAME="futureskills-assets-$(date +%Y%m%d%H%M%S)"
    
    aws s3api create-bucket \
        --bucket $BUCKET_NAME \
        --region $AWS_REGION \
        --create-bucket-configuration LocationConstraint=$AWS_REGION
    
    # Configure bucket policy
    cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
EOF
    
    aws s3api put-bucket-policy \
        --bucket $BUCKET_NAME \
        --policy file://bucket-policy.json
    
    # Enable versioning
    aws s3api put-bucket-versioning \
        --bucket $BUCKET_NAME \
        --versioning-configuration Status=Enabled
    
    # Enable encryption
    aws s3api put-bucket-encryption \
        --bucket $BUCKET_NAME \
        --server-side-encryption-configuration '{
            "Rules": [
                {
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256"
                    }
                }
            ]
        }'
    
    # Configure CORS
    aws s3api put-bucket-cors \
        --bucket $BUCKET_NAME \
        --cors-configuration '{
            "CORSRules": [
                {
                    "AllowedHeaders": ["*"],
                    "AllowedMethods": ["GET", "HEAD"],
                    "AllowedOrigins": ["https://app.futureskillssyntax.com", "https://api.futureskillssyntax.com"],
                    "ExposeHeaders": ["ETag"],
                    "MaxAgeSeconds": 3000
                }
            ]
        }'
    
    # Configure lifecycle rules
    aws s3api put-bucket-lifecycle-configuration \
        --bucket $BUCKET_NAME \
        --lifecycle-configuration '{
            "Rules": [
                {
                    "ID": "TransitionToIA",
                    "Status": "Enabled",
                    "Prefix": "",
                    "Transition": {
                        "Days": 30,
                        "StorageClass": "STANDARD_IA"
                    }
                },
                {
                    "ID": "DeleteOldVersions",
                    "Status": "Enabled",
                    "Prefix": "",
                    "NoncurrentVersionExpiration": {
                        "NoncurrentDays": 90
                    }
                }
            ]
        }'
    
    echo $BUCKET_NAME > .s3-bucket-name
    echo "✅ S3 bucket created: $BUCKET_NAME"
}

# Create CloudFront distribution
create_cloudfront_distribution() {
    echo "🌐 Creating CloudFront distribution..."
    
    BUCKET_NAME=$(cat .s3-bucket-name)
    
    # Create OAI (Origin Access Identity)
    OAI_OUTPUT=$(aws cloudfront create-cloud-front-origin-access-identity \
        --cloud-front-origin-access-identity-config \
        'CallerReference'='futureskills-oai-'$(date +%s),'Comment'='FutureSkillsSyntax OAI')
    
    OAI_ID=$(echo $OAI_OUTPUT | jq -r '.CloudFrontOriginAccessIdentity.Id')
    OAI_S3_CANONICAL=$(echo $OAI_OUTPUT | jq -r '.CloudFrontOriginAccessIdentity.S3CanonicalUserId')
    
    # Update bucket policy to allow OAI
    cat > oai-bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCloudFrontAccess",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${OAI_ID}"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
EOF
    
    aws s3api put-bucket-policy \
        --bucket $BUCKET_NAME \
        --policy file://oai-bucket-policy.json
    
    # Get ACM certificate ARN
    ACM_CERT_ARN=$(aws acm list-certificates \
        --query "CertificateSummaryList[?DomainName=='*.futureskillssyntax.com'].CertificateArn" \
        --output text)
    
    # Create CloudFront distribution
    cat > cloudfront-config.json << EOF
{
    "CallerReference": "futureskills-cdn-$(date +%s)",
    "Aliases": {
        "Quantity": 3,
        "Items": ["assets.futureskillssyntax.com", "cdn.futureskillssyntax.com", "static.futureskillssyntax.com"]
    },
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-${BUCKET_NAME}",
                "DomainName": "${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com",
                "OriginPath": "",
                "CustomHeaders": {
                    "Quantity": 0
                },
                "S3OriginConfig": {
                    "OriginAccessIdentity": "origin-access-identity/cloudfront/${OAI_ID}"
                }
            }
        ]
    },
    "OriginGroups": {
        "Quantity": 0
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-${BUCKET_NAME}",
        "ForwardedValues": {
            "QueryString": true,
            "Cookies": {
                "Forward": "none"
            },
            "Headers": {
                "Quantity": 2,
                "Items": ["Origin", "Access-Control-Request-Headers"]
            },
            "QueryStringCacheKeys": {
                "Quantity": 2,
                "Items": ["version", "v"]
            }
        },
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true,
        "LambdaFunctionAssociations": {
            "Quantity": 0
        },
        "FieldLevelEncryptionId": "",
        "ResponseHeadersPolicyId": "67f7725c-6f97-4210-82d7-5512b31e9d03"  # CORS with preflight
    },
    "CacheBehaviors": {
        "Quantity": 0
    },
    "CustomErrorResponses": {
        "Quantity": 2,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            },
            {
                "ErrorCode": 403,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    },
    "Comment": "FutureSkillsSyntax CDN",
    "Logging": {
        "Enabled": true,
        "IncludeCookies": false,
        "Bucket": "${BUCKET_NAME}.s3.amazonaws.com",
        "Prefix": "cloudfront-logs/"
    },
    "PriceClass": "PriceClass_100",
    "Enabled": true,
    "ViewerCertificate": {
        "CloudFrontDefaultCertificate": false,
        "ACMCertificateArn": "${ACM_CERT_ARN}",
        "SSLSupportMethod": "sni-only",
        "MinimumProtocolVersion": "TLSv1.2_2021"
    },
    "Restrictions": {
        "GeoRestriction": {
            "RestrictionType": "none",
            "Quantity": 0
        }
    },
    "WebACLId": "",
    "HttpVersion": "http2",
    "IsIPV6Enabled": true
}
EOF
    
    DISTRIBUTION_OUTPUT=$(aws cloudfront create-distribution \
        --distribution-config file://cloudfront-config.json)
    
    DISTRIBUTION_ID=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.Id')
    DISTRIBUTION_DOMAIN=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.DomainName')
    
    echo $DISTRIBUTION_ID > .cloudfront-distribution-id
    echo "✅ CloudFront distribution created: $DISTRIBUTION_DOMAIN"
    
    # Create invalidation
    aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*"
}

# Create S3 deployment script
create_deployment_script() {
    echo "📦 Creating CDN deployment script..."
    
    cat > deploy-to-cdn.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Deploying to CDN..."

# Load configuration
BUCKET_NAME=$(cat .s3-bucket-name)
DISTRIBUTION_ID=$(cat .cloudfront-distribution-id)
AWS_REGION=${AWS_REGION:-us-east-1}

# Build frontend
echo "🏗️ Building frontend..."
cd ../frontend/web
npm run build

# Sync to S3
echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME/ \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "index.html" \
    --exclude "*.json"

# Upload HTML files with shorter cache
aws s3 cp dist/index.html s3://$BUCKET_NAME/index.html \
    --cache-control "public, max-age=0, must-revalidate"

aws s3 cp dist/error.html s3://$BUCKET_NAME/error.html \
    --cache-control "public, max-age=0, must-revalidate"

# Upload manifest files
aws s3 cp dist/*.json s3://$BUCKET_NAME/ \
    --cache-control "public, max-age=0, must-revalidate"

# Create invalidation
echo "🔄 Creating CloudFront invalidation..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo "⏳ Waiting for invalidation to complete..."
aws cloudfront wait invalidation-completed \
    --distribution-id $DISTRIBUTION_ID \
    --id $INVALIDATION_ID

echo "✅ Deployment complete! Assets available at:"
echo "   https://assets.futureskillssyntax.com"
EOF
    
    chmod +x deploy-to-cdn.sh
    echo "✅ Deployment script created: deploy-to-cdn.sh"
}

# Main execution
main() {
    create_s3_bucket
    create_cloudfront_distribution
    create_deployment_script
    
    echo "🎉 CDN setup complete!"
    echo ""
    echo "📋 Configuration Summary:"
    echo "   S3 Bucket: $(cat .s3-bucket-name)"
    echo "   CloudFront Distribution ID: $(cat .cloudfront-distribution-id)"
    echo ""
    echo "🚀 To deploy assets:"
    echo "   ./deploy-to-cdn.sh"
}

main "$@"