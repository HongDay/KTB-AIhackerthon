#!/bin/bash

# EC2 서버에 Docker 설치 및 설정 스크립트
# 사용법: ./setup-ec2-docker.sh [USER] [SSH_KEY_PATH]

set -e

EC2_HOST="3.36.113.95"
EC2_USER=${1:-ubuntu}
SSH_KEY=${2:-~/.ssh/id_rsa}

echo "=== EC2 서버 Docker 설치 시작 ==="
echo "호스트: ${EC2_USER}@${EC2_HOST}"
echo "SSH 키: ${SSH_KEY}"

# SSH 키 확인
if [ ! -f "$SSH_KEY" ]; then
    echo "오류: SSH 키를 찾을 수 없습니다: $SSH_KEY"
    echo "사용법: ./setup-ec2-docker.sh [USER] [SSH_KEY_PATH]"
    exit 1
fi

# Docker 설치 스크립트를 EC2에 전송하고 실행
echo "Docker 설치 스크립트 전송 및 실행 중..."
cat install-docker.sh | ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} 'bash -s'

echo ""
echo "=== Docker 설치 완료 ==="
echo "다음 명령어로 Docker가 정상 작동하는지 확인하세요:"
echo "ssh -i $SSH_KEY ${EC2_USER}@${EC2_HOST} 'docker --version'"

