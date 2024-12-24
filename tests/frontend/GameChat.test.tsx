import { render, screen, fireEvent } from '@testing-library/react';
import { useWallet } from '@solana/wallet-adapter-react';
import GameChat from '../../src/components/chat/GameChat';

jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

describe('GameChat', () => {
  beforeEach(() => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      publicKey: 'mock-public-key',
    });
  });

  it('renders chat interface', () => {
    render(<GameChat gameRoom="blackjack" />);
    expect(screen.getByText('Game Chat')).toBeInTheDocument();
    expect(screen.getByPlaceholder('Type a message...')).toBeInTheDocument();
  });

  it('allows sending messages when connected', () => {
    render(<GameChat gameRoom="blackjack" />);
    const input = screen.getByPlaceholder('Type a message...') as HTMLInputElement;
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Hello!' } });
    fireEvent.click(sendButton);

    expect(input.value).toBe('');
  });

  it('disables input when not connected', () => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: false,
    });

    render(<GameChat gameRoom="blackjack" />);
    const input = screen.getByPlaceholder('Connect wallet to chat');
    expect(input).toBeDisabled();
  });
});