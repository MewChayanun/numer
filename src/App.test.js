import { render, screen } from '@testing-library/react';
import App from './App';

test('renders numerical method description', () => {
  render(<App />);
  const descriptionElement = screen.getByText(/numerical method calculation/i);
  expect(descriptionElement).toBeInTheDocument();
});
