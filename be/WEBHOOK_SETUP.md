# 노션 웹훅 EC2 설정 가이드

## EC2에서 확인해야 할 사항

### 1. 보안 그룹 설정 (Security Group)
EC2 인스턴스의 보안 그룹에서 **포트 8080 인바운드 규칙**이 열려있는지 확인해야 합니다.

**AWS 콘솔에서 설정:**
1. EC2 → 인스턴스 선택 → 보안 탭 → 보안 그룹 클릭
2. 인바운드 규칙 편집
3. 규칙 추가:
   - 유형: 사용자 지정 TCP
   - 포트: 8080
   - 소스: 0.0.0.0/0 (또는 노션 IP만 허용하려면 특정 IP)
   - 설명: Notion Webhook

### 2. 애플리케이션 실행 확인
EC2에서 애플리케이션이 실행 중인지 확인:

```bash
# 프로세스 확인
ps aux | grep java

# 포트 8080이 열려있는지 확인
netstat -tuln | grep 8080
# 또는
ss -tuln | grep 8080
```

### 3. 애플리케이션 로그 확인
웹훅이 제대로 받아졌는지 확인하기 위해 로그를 모니터링:

```bash
# 애플리케이션 로그 파일이 있다면
tail -f /path/to/application.log

# 또는 System.out.println으로 출력되는 경우
# 애플리케이션을 실행한 터미널에서 확인
```

### 4. 방화벽 확인 (필요시)
EC2 인스턴스에 방화벽이 설정되어 있다면:

```bash
# Ubuntu/Debian
sudo ufw status
sudo ufw allow 8080/tcp

# CentOS/RHEL
sudo firewall-cmd --list-ports
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

## 노션 웹훅 작동 확인 방법

### 1. 헬스체크 엔드포인트로 확인
브라우저나 curl로 엔드포인트가 접근 가능한지 확인:

```bash
# EC2에서 직접 확인
curl http://localhost:8080/api/webhook/notion

# 외부에서 확인 (EC2 퍼블릭 IP 사용)
curl http://43.201.255.165:8080/api/webhook/notion
```

정상 응답 예시:
```json
{
  "status": "ok",
  "message": "Notion webhook endpoint is ready",
  "timestamp": "2024-01-01 12:00:00",
  "endpoint": "POST /api/webhook/notion"
}
```

### 2. 노션 자동화 설정
1. 노션 워크스페이스 → 설정 → 연결 → 자동화
2. 새 자동화 만들기
3. 트리거 설정 (예: 페이지 업데이트 시)
4. 웹훅 액션 추가:
   - URL: `http://43.201.255.165:8080/api/webhook/notion`
   - 메서드: POST
   - 본문: JSON 형식으로 데이터 전송

### 3. 웹훅 수신 확인
노션에서 트리거 이벤트가 발생하면:

**콘솔 출력 예시:**
```
========================================
Notion Webhook Received at 2024-01-01 12:00:00
========================================
Headers: {content-type=application/json, ...}
Payload: {key1=value1, key2=value2, ...}
========================================
```

**로그 파일 확인:**
- 애플리케이션 로그 파일에서 위와 같은 형식의 로그 확인
- 타임스탬프와 함께 요청이 기록됨

### 4. 테스트 방법
노션에서 테스트 이벤트를 발생시키거나, curl로 직접 테스트:

```bash
curl -X POST http://43.201.255.165:8080/api/webhook/notion \
  -H "Content-Type: application/json" \
  -d '{"test": "data", "event": "test"}'
```

EC2 콘솔에서 위와 같은 로그가 출력되면 정상 작동하는 것입니다.

## 문제 해결

### 웹훅이 받아지지 않는 경우
1. **보안 그룹 확인**: 포트 8080이 열려있는지
2. **애플리케이션 실행 확인**: 프로세스가 실행 중인지
3. **포트 확인**: netstat/ss로 8080 포트가 LISTEN 상태인지
4. **방화벽 확인**: 인스턴스 레벨 방화벽 설정
5. **로그 확인**: 애플리케이션 에러 로그 확인

### 로그가 보이지 않는 경우
- 애플리케이션을 백그라운드로 실행했다면 로그 파일 경로 확인
- `nohup`으로 실행했다면 `nohup.out` 파일 확인
- systemd 서비스로 실행했다면 `journalctl -u service-name` 확인

