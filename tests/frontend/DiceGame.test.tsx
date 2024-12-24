import { render, screen, fireEvent } from '@testing-library/react';
import { useWallet } from '@solana/wallet-adapter-react';
import DiceGame from '../../src/components/dice/DiceGame';

jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

describe('DiceGame', () => {
  beforeEach(() => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      publicKey: 'mock-public-key',
    });
  });

  it('renders betting options', () => {
    render(<DiceGame />);
    expect(screen.getByText('Over 3')).toBeInTheDocument();
    expect(screen.getByText('Under 4')).toBeInTheDocument();
    expect(screen.getByText('Exact')).toBeInTheDocument();
  });

  it('shows number selection for exact bet', () => {
    render(<DiceGame />);
    fireEvent.click(screen.getByText('Exact'));
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it('animates dice roll', () => {
    render(<DiceGame />);
    fireEvent.click(screen.getByText('Roll Dice'));
    expect(screen.getByTestId('dice-roll')).toHaveClass('rolling');
  });
});