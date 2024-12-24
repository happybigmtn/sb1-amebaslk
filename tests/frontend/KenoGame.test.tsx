import { render, screen, fireEvent } from '@testing-library/react';
import { useWallet } from '@solana/wallet-adapter-react';
import KenoGame from '../../src/components/keno/KenoGame';

jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

describe('KenoGame', () => {
  beforeEach(() => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      publicKey: 'mock-public-key',
    });
  });

  it('renders keno board', () => {
    render(<KenoGame />);
    expect(screen.getByTestId('keno-board')).toBeInTheDocument();
  });

  it('allows selecting numbers', () => {
    render(<KenoGame />);
    const number1 = screen.getByText('1');
    fireEvent.click(number1);
    expect(number1).toHaveClass('selected');
  });

  it('limits number selection', () => {
    render(<KenoGame />);
    // Select 10 numbers
    for (let i = 1; i <= 11; i++) {
      fireEvent.click(screen.getByText(String(i)));
    }
    // 11th number should not be selected
    expect(screen.getByText('11')).not.toHaveClass('selected');
  });

  it('shows potential payout', () => {
    render(<KenoGame />);
    fireEvent.click(screen.getByText('1'));
    expect(screen.getByText(/Potential Win/)).toBeInTheDocument();
  });
});