import { render, screen, fireEvent } from '@testing-library/react';
import { useWallet } from '@solana/wallet-adapter-react';
import CrashGame from '../../src/components/crash/CrashGame';

jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

describe('CrashGame', () => {
  beforeEach(() => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      publicKey: 'mock-public-key',
    });
  });

  it('renders betting panel', () => {
    render(<CrashGame />);
    expect(screen.getByLabelText('Bet Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Auto Cash Out')).toBeInTheDocument();
  });

  it('allows setting bet amount', () => {
    render(<CrashGame />);
    const input = screen.getByLabelText('Bet Amount') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '0.5' } });
    expect(input.value).toBe('0.5');
  });

  it('shows crash graph', () => {
    render(<CrashGame />);
    expect(screen.getByTestId('crash-graph')).toBeInTheDocument();
  });

  it('enables cash out button during game', () => {
    render(<CrashGame />);
    const betButton = screen.getByText('Place Bet');
    fireEvent.click(betButton);
    
    const cashoutButton = screen.getByText(/Cash Out/);
    expect(cashoutButton).toBeEnabled();
  });
});