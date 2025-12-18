#!/bin/bash

# EC2 서버에 Docker 설치 스크립트
# 사용법: ssh [USER]@3.36.113.95 'bash -s' < install-docker.sh

set -e

echo "=== Docker 설치 시작 ==="

# 기존 Docker 제거 (있는 경우)
echo "1. 기존 Docker 제거 중..."
sudo apt-get remove -y docker docker-engine docker.io containerd runc || true

# 필수 패키지 설치
echo "2. 필수 패키지 설치 중..."
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Docker 공식 GPG 키 추가
echo "3. Docker GPG 키 추가 중..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Docker 저장소 추가
echo "4. Docker 저장소 추가 중..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 설치
echo "5. Docker 설치 중..."
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Docker 서비스 시작 및 자동 시작 설정
echo "6. Docker 서비스 시작 중..."
sudo systemctl start docker
sudo systemctl enable docker

# 현재 사용자를 docker 그룹에 추가 (sudo 없이 docker 사용 가능)
echo "7. 현재 사용자를 docker 그룹에 추가 중..."
sudo usermod -aG docker $USER

# Docker 설치 확인
echo "8. Docker 설치 확인 중..."
docker --version
docker compose version

echo "=== Docker 설치 완료 ==="
echo "참고: docker 그룹 변경사항을 적용하려면 로그아웃 후 다시 로그인하거나 'newgrp docker'를 실행하세요."

