Electron 보안 및 베스트 프랙티스 가이드라인에 따라 현재 코드를 검토하고 문제를 수정합니다.

## 검토 대상 파일 탐색

먼저 프로젝트에서 Electron 관련 파일을 모두 찾아 읽습니다:
- `src/main/` 디렉토리 전체 (메인 프로세스)
- `src/preload/` 디렉토리 전체 (preload 스크립트)
- `BrowserWindow` 생성 코드
- IPC 핸들러 코드
- renderer에서 IPC 호출하는 서비스 코드

## 보안 체크리스트

### 1. BrowserWindow 보안 설정
다음 3가지가 모두 명시적으로 설정되어 있는지 확인:
- [ ] `contextIsolation: true` — 미설정 시 XSS → RCE 가능
- [ ] `sandbox: true` — 미설정 시 preload에서 Node.js 전체 접근 가능
- [ ] `nodeIntegration: false` — 미설정 시 renderer에서 Node.js 직접 접근 가능

**위반 시 즉시 수정합니다. 이 3가지는 절대 비활성화하면 안 됩니다.**

### 2. Preload 스크립트
- [ ] `contextBridge.exposeInMainWorld()`로만 API 노출
- [ ] `ipcRenderer`를 직접 노출하지 않음 (함수 래퍼로 감싸기)
- [ ] 노출하는 함수에 타입 정의 존재
- [ ] IPC 리스너 등록 시 cleanup 함수 반환

**위반 패턴 예시 (절대 금지):**
```typescript
// ❌ ipcRenderer 직접 노출
contextBridge.exposeInMainWorld('api', { ipcRenderer });
```

### 3. CSP (Content Security Policy)
- [ ] `session.defaultSession.webRequest.onHeadersReceived`로 CSP 헤더 설정
- [ ] `script-src 'self'`만 허용 (인라인 스크립트 차단)
- [ ] `default-src 'self'` 설정

미설정 시 다음 코드를 `app.whenReady()` 내에 추가:
```typescript
session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': ["default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"],
    },
  });
});
```

### 4. IPC 통신 패턴
- [ ] `invoke/handle` 패턴 사용 (send/on은 request-response에 부적합)
- [ ] Result 타입 패턴 사용: `{ success: boolean; data?: T; error?: string }`
  - Electron은 Error 객체의 `message` 속성만 직렬화하므로 에러 컨텍스트 손실 방지
- [ ] IPC 핸들러가 도메인별로 모듈화되어 있는지
- [ ] 모든 IPC 핸들러에 try/catch 적용

**Result 타입 패턴:**
```typescript
interface IpcResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Main process
ipcMain.handle('channel', async (_event, args) => {
  try {
    const result = await doSomething(args);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

// Renderer - unwrap
function unwrap<T>(result: IpcResult<T>): T {
  if (!result.success) throw new Error(result.error);
  return result.data as T;
}
```

### 5. IPC 인자 검증
- [ ] renderer에서 받은 인자를 신뢰하지 않음
- [ ] 문자열 ID 등은 정규식으로 형식 검증 (path traversal 방지)
- [ ] 파일 경로를 받는 경우 허용 디렉토리 외부 접근 차단

**검증 함수 예시:**
```typescript
function sanitizeId(id: unknown): string | null {
  if (typeof id !== 'string') return null;
  if (!/^#Y\d{9}$/.test(id)) return null;
  return id;
}
```

### 6. 외부 링크 처리
- [ ] `webContents.setWindowOpenHandler`로 외부 링크를 `shell.openExternal`로 처리
- [ ] 알 수 없는 URL 네비게이션 차단

### 7. React 통합
- [ ] `useEffect`에서 IPC 리스너 등록 시 cleanup 반환
- [ ] StrictMode 사용 (이중 호출로 리스너 누수 감지)
- [ ] renderer에서 Node.js API 직접 사용 안 함

### 8. 서버 바인딩
- [ ] 로컬 서버 사용 시 `127.0.0.1`에만 바인딩 (`0.0.0.0` 금지)

## 검토 결과 보고

검토 완료 후 다음 형식으로 보고합니다:

```
## Electron 보안 검토 결과

### ✅ 통과 항목
- [항목명]: 상태 설명

### ⚠️ 경고 항목
- [항목명]: 문제 설명 → 권장 조치

### ❌ 위반 항목 (수정 완료)
- [항목명]: 문제 설명 → 수정 내용

### 요약
- 검토 파일: N개
- 통과: N개 / 경고: N개 / 위반: N개
```

## 수정 시 규칙
- 보안 위반(체크리스트 1~5)은 즉시 수정
- 경고 사항은 보고만 하고 사용자 확인 후 수정
- 수정 후 `npm test`와 `npm run build`로 검증

## Quick Reference

| 항목 | 올바른 방법 | 금지 |
|------|------------|------|
| 보안 | `contextBridge.exposeInMainWorld()` | `nodeIntegration: true` |
| IPC | `invoke/handle` 패턴 | `send/on` (request-response) |
| Preload | 타입된 함수 래퍼 | `ipcRenderer` 직접 노출 |
| 빌드 | electron-vite | webpack 기반 |
| 에러 | Result `{success, data, error}` | Error 직접 전달 |
| 테스트 | Playwright E2E | Spectron (deprecated) |
| CSP | HTTP 헤더, `'self'` 전용 | CSP 미설정 |

$ARGUMENTS
