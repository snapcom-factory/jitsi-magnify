import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import TextField from './TextField';

describe('TextField', () => {
  it('should follow the user typing', async () => {
    const user = userEvent.setup();
    const TestElement = () => {
      const [value, setValue] = React.useState('Hello');
      return (
        <TextField
          label="My input"
          name="my-input"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      );
    };

    render(<TestElement />);

    const input = screen.getByRole<HTMLInputElement>('textbox', { name: 'My input' });

    await user.type(input, ' World');
    expect(input.value).toBe('Hello World');
  });

  it('should apply the margin to the external box', () => {
    const { baseElement } = render(
      <TextField label="My input" margin="large" name="my-input" onChange={() => {}} value="" />,
    );
    expect(baseElement).toHaveStyle('margin: 8px');
  });

  it('should add a star for required fields', () => {
    render(<TextField required label="My input" name="my-input" onChange={() => {}} value="" />);
    screen.getByRole('textbox', { name: 'My input *' });
  });

  it('should render the error messages by default', () => {
    render(
      <TextField
        errors={['This is an error', 'This is another error']}
        label="My input"
        name="my-input"
        onChange={() => {}}
        value=""
      />,
    );

    screen.getByText('This is an error, This is another error');
  });

  it('should not render the error messages if displayErrors is false', () => {
    render(
      <TextField
        displayErrors={false}
        errors={['This is an error', 'This is another error']}
        label="My input"
        name="my-input"
        onChange={() => {}}
        value=""
      />,
    );

    expect(screen.queryByText('This is an error, This is another error')).not.toBeInTheDocument();
  });

  it('should add a button to reveal password if type is password', async () => {
    const user = userEvent.setup();
    render(
      <TextField
        label="My input"
        name="my-input"
        onChange={() => {}}
        type="password"
        value="pass"
      />,
    );

    const input = screen.getByLabelText<HTMLInputElement>('My input') as HTMLInputElement;
    const button = screen.getByTitle('Show');

    expect(input.type).toBe('password');
    await user.click(button);
    expect(input.type).toBe('text');
    await user.click(button);
    expect(input.type).toBe('password');
  });
});
