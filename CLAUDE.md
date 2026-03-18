# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI 기반 부동산 매물 관리 데스크톱 애플리케이션입니다. Electron + React + TypeScript + Vite 기반입니다.

- GitHub: https://github.com/songchoongseok/ai-real-estate-app
- Branch: main

## Getting Started

- **개발 서버**: `npm run dev` (electron-vite dev)
- **빌드**: `npm run build` (electron-vite build)
- **테스트**: `npm test` (vitest run) / `npm run test:watch` (vitest)
- **프리뷰**: `npm run preview` (electron-vite preview)

## Architecture

- **프레임워크**: Electron + React 18 + TypeScript (strict mode)
- **빌드 도구**: electron-vite + Vite 5 + @vitejs/plugin-react
- **테스트**: Vitest + @testing-library/react + jsdom
- **스타일링**: CSS Modules

### 디렉토리 구조

```
src/
  main/           # Electron 메인 프로세스
  preload/        # Electron preload 스크립트
  renderer/       # React 렌더러 (프론트엔드)
    components/
      common/     # 공용 UI 컴포넌트 (TextInput, SelectInput 등)
      property/   # 매물 관련 비즈니스 컴포넌트
    constants/    # 옵션 상수 (라벨/값 매핑)
    hooks/        # 커스텀 훅 (usePropertyForm)
    services/     # 데이터 서비스 (localStorage 기반)
    types/        # TypeScript 타입 정의
    utils/        # 유틸리티 (ID 생성, 면적 변환, 유효성 검증)
electron/         # Electron 소스 원본 (참조용)
```

### 주요 규칙

- TypeScript strict mode, any 타입 사용 금지
- 모든 컴포넌트는 함수형으로 작성
- 한국어로 라벨과 placeholder 작성
- CSS Modules 사용 (*.module.css)
