import { render, screen, fireEvent } from '@testing-library/react';
import { useWallet } from '@solana/wallet-adapter-react';
import BlackjackTable from '../../src/components/blackjack/Table';

// Mock wallet hook
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

describe('BlackjackTable', () => {
  beforeEach(() => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      publicKey: 'mock-public-key',
    });
  });

  it('renders betting interface when game is not active', () => {
    render(<BlackjackTable />);
    expect(screen.getByText('Place your bet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Deal' })).toBeInTheDocument();
  });

  it('allows setting bet amount', () => {
    render(<BlackjackTable />);
    const input = screen.getByLabelText('Bet Amount') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '0.5' } });
    expect(input.value).toBe('0.5');
  });

  it('shows action buttons during player turn', () => {
    render(<BlackjackTable />);
    // Start game
    fireEvent.click(screen.getByRole('button', { name: 'Deal' }));
    
    expect(screen.getByRole('button', { name: 'Hit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stand' })).toBeInTheDocument();
  });
});