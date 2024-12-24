import { render, screen, fireEvent } from '@testing-library/react';
import { useWallet } from '@solana/wallet-adapter-react';
import MinesGame from '../../src/components/mines/MinesGame';

jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
}));

describe('MinesGame', () => {
  beforeEach(() => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      publicKey: 'mock-public-key',
    });
  });

  it('renders game setup options', () => {
    render(<MinesGame />);
    expect(screen.getByText('Grid Size')).toBeInTheDocument();
    expect(screen.getByText('Number of Mines')).toBeInTheDocument();
  });

  it('allows selecting grid size', () => {
    render(<MinesGame />);
    fireEvent.click(screen.getByText('6x6'));
    expect(screen.getByTestId('mines-grid')).toHaveStyle({
      gridTemplateColumns: 'repeat(6, minmax(0, 1fr))'
    });
  });

  it('reveals cells on click', () => {
    render(<MinesGame />);
    const cells = screen.getAllByTestId('grid-cell');
    fireEvent.click(cells[0]);
    expect(cells[0]).toHaveClass('revealed');
  });

  it('shows current multiplier', () => {
    render(<MinesGame />);
    expect(screen.getByText(/Current Multiplier/)).toBeInTheDocument();
  });
});