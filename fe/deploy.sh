#!/bin/bash

# Frontend 배포 스크립트
# 사용법: ./deploy.sh [DOCKER_USERNAME]

set -e

DOCKER_USERNAME=${1:-${DOCKER_USERNAME}}
EC2_HOST="3.36.113.95"
IMAGE_NAME="aihkt-fe:latest"

if [ -z "$DOCKER_USERNAME" ]; then
    echo "Error: DOCKER_USERNAME이 필요합니다."
    echo "사용법: ./deploy.sh [DOCKER_USERNAME]"
    exit 1
fi

FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}"

echo "=== Frontend 배포 시작 ==="
echo "Docker 이미지: ${FULL_IMAGE_NAME}"
echo "EC2 호스트: ${EC2_HOST}"

# Docker 이미지 빌드
echo "1. Docker 이미지 빌드 중..."
docker build --platform linux/amd64 -t ${FULL_IMAGE_NAME} -f fe/Dockerfile fe/

# Docker Hub에 푸시
echo "2. Docker Hub에 푸시 중..."
docker push ${FULL_IMAGE_NAME}

# EC2에 배포
echo "3. EC2에 배포 중..."
ssh ${EC2_HOST} << EOF
    docker pull ${FULL_IMAGE_NAME}
    docker stop aihkt-fe || true
    docker rm aihkt-fe || true
    docker run -d --name aihkt-fe -p 80:80 ${FULL_IMAGE_NAME}
EOF

echo "=== 배포 완료 ==="
echo "Frontend가 http://${EC2_HOST} 에서 실행 중입니다."

