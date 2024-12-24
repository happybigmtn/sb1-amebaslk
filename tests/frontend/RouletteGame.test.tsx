import { render, screen, fireEvent } from '@testing-library/react';
import { useWallet } from '@solana/wallet-adapter-react';
import RouletteGame from '../../src/components/roulette/RouletteGame';

jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

describe('RouletteGame', () => {
  beforeEach(() => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      publicKey: 'mock-public-key',
    });
  });

  it('renders betting board', () => {
    render(<RouletteGame />);
    expect(screen.getByTestId('betting-board')).toBeInTheDocument();
  });

  it('allows placing straight bets', () => {
    render(<RouletteGame />);
    const number17 = screen.getByTestId('number-17');
    fireEvent.click(number17);
    
    expect(screen.getByText('Straight bet on 17')).toBeInTheDocument();
  });

  it('shows bet list', () => {
    render(<RouletteGame />);
    const number17 = screen.getByTestId('number-17');
    fireEvent.click(number17);
    
    expect(screen.getByTestId('bet-list')).toBeInTheDocument();
    expect(screen.getByText('0.1 SOL on 17')).toBeInTheDocument();
  });

  it('allows spinning the wheel', () => {
    render(<RouletteGame />);
    const number17 = screen.getByTestId('number-17');
    fireEvent.click(number17);
    
    const spinButton = screen.getByRole('button', { name: 'Spin' });
    expect(spinButton).toBeEnabled();
    fireEvent.click(spinButton);
    
    expect(screen.getByTestId('wheel')).toHaveClass('spinning');
  });
});