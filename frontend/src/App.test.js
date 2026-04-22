import { render, screen } from '@testing-library/react';

jest.mock('./components/Register', () => () => <div>Register</div>);
jest.mock('./components/Login', () => () => <div>Login</div>);
jest.mock('./components/Home', () => () => <div>Home</div>);
jest.mock('./components/Transactions', () => () => <div>Transactions</div>);
jest.mock('./components/Budget', () => () => <div>Budget</div>);
jest.mock('./components/Goals', () => () => <div>Goals</div>);
jest.mock('./components/Reports', () => () => <div>Reports</div>);
jest.mock('./components/Chatbot', () => () => <div>Chatbot</div>);

import App from './App';

test('renders launching screen branding', () => {
  render(<App />);
  expect(screen.getByText('MONIVUE')).toBeInTheDocument();
  expect(screen.getByText('TRACK. SAVE. GROW.')).toBeInTheDocument();
});
