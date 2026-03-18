import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabSelector from './TabSelector';

const options = [
  { label: '매매', value: 'SALE' },
  { label: '전세', value: 'JEONSE' },
  { label: '월세', value: 'MONTHLY' },
];

describe('TabSelector', () => {
  it('탭 클릭 시 onChange가 호출되어야 한다', async () => {
    // Given
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <TabSelector
        label="거래유형"
        value="SALE"
        onChange={handleChange}
        options={options}
      />
    );

    // When
    await user.click(screen.getByText('월세'));

    // Then
    expect(handleChange).toHaveBeenCalledWith('MONTHLY');
  });

  it('선택된 탭이 활성화 표시되어야 한다', () => {
    // Given & When
    render(
      <TabSelector
        label="거래유형"
        value="JEONSE"
        onChange={() => {}}
        options={options}
      />
    );

    // Then
    const activeButton = screen.getByText('전세');
    expect(activeButton.className).toContain('tabActive');
  });

  it('선택되지 않은 탭은 활성화 표시가 없어야 한다', () => {
    render(
      <TabSelector
        label="거래유형"
        value="SALE"
        onChange={() => {}}
        options={options}
      />
    );

    const inactiveButton = screen.getByText('월세');
    expect(inactiveButton.className).not.toContain('tabActive');
  });
});
