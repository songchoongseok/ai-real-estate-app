/**
 * 매물 번호 생성
 * 형식: #Y + 9자리 숫자 (타임스탬프 기반 + 랜덤)
 */
export function generatePropertyId(): string {
  const now = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const digits = String(now).slice(-6) + String(random).padStart(3, '0');
  return `#Y${digits}`;
}
