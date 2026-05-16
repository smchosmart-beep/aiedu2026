## 변경 사항 (`src/components/Landing.tsx`)

1. 라인 3 import 수정: `Search` 제거 → `PencilLine` 추가
   ```
   import { ClipboardList, PencilLine, ArrowRight } from "lucide-react";
   ```
2. B모드 Card (라인 35-42):
   - `title`: "공유 코드로 조회하기" → **"컨설팅 기록하기"**
   - `desc`: "6자리 코드로 맞춤 처방전을 확인하세요" → **"6자리 코드로 학교를 찾아 컨설팅 내용을 기록하세요"**
   - `icon`: `<Search ... />` → `<PencilLine className="w-7 h-7" />`

A모드의 `ClipboardList`와 시각적으로 구분되도록 펜 계열 아이콘 `PencilLine` 사용.
