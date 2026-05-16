## 삭제 대상

PIN 기능 도입 전 기록(pin_hash가 비어있는 행) 1건을 `consultations` 테이블에서 삭제합니다.

- 김승현, 2026-05-16 10:55:07 (id: 84bf46ea…)

PIN이 설정된 이후 기록(1건)은 유지합니다.

실행 SQL:
```sql
DELETE FROM consultations WHERE pin_hash = '';
```