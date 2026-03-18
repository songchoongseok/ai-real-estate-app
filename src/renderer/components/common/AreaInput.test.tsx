import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AreaInput from './AreaInput';

describe('AreaInput', () => {
  it('sqm 입력 시 평이 자동으로 표시되어야 한다', () => {
    // Given: 33.0579sqm 값이 주어진 경우
    render(
      <AreaInput
        label="전용면적"
        value={33.0579}
        onChange={() => {}}
      />
    );

    // Then: 평 표시 input에 약 10평이 표시되어야 한다
    const inputs = screen.getAllByRole('spinbutton');
    const textInputs = screen.getAllByRole('textbox');
    // readonly 평 input
    expect(textInputs[0]).toHaveValue('10');
  });

  it('값 변경 시 onChange가 호출되어야 한다', async () => {
    // Given
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <AreaInput
        label="전용면적"
        value={undefined}
        onChange={handleChange}
      />
    );

    // When: sqm input에 값을 입력
    const sqmInput = screen.getByRole('spinbutton');
    await user.type(sqmInput, '50');

    // Then
    expect(handleChange).toHaveBeenCalled();
  });

  it('값이 없을 때 평 표시가 빈 문자열이어야 한다', () => {
    render(
      <AreaInput
        label="전용면적"
        value={undefined}
        onChange={() => {}}
      />
    );

    const textInputs = screen.getAllByRole('textbox');
    expect(textInputs[0]).toHaveValue('');
  });
});
