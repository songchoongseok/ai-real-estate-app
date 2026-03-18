import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';

function renderWithRouter(children: React.ReactNode = <div>테스트 콘텐츠</div>) {
  return render(
    <MemoryRouter>
      <Layout>{children}</Layout>
    </MemoryRouter>
  );
}

describe('Layout', () => {
  it('헤더에 앱 제목이 표시되어야 한다', () => {
    renderWithRouter();
    expect(screen.getByText('부동산 매물 관리')).toBeInTheDocument();
  });

  it('사이드바에 네비게이션 메뉴가 표시되어야 한다', () => {
    renderWithRouter();
    expect(screen.getByText('매물 목록')).toBeInTheDocument();
    expect(screen.getByText('매물 등록')).toBeInTheDocument();
  });

  it('children이 렌더링되어야 한다', () => {
    renderWithRouter(<p>자식 컴포넌트 내용</p>);
    expect(screen.getByText('자식 컴포넌트 내용')).toBeInTheDocument();
  });
});
