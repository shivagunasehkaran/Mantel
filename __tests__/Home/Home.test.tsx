import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Home from '../../src/screens/Home/Home';

describe('display all texts in home screen', () => {
  it('calls onPress function when the write button is pressed', () => {
    const mockOnPress = jest.fn();

    const {getByTestId} = render(<Home />);
    const pressMeButton = getByTestId('button:write');
    fireEvent.press(pressMeButton);

    expect(mockOnPress).toHaveBeenCalled();
  });

  it('displays the number of unique IP addresses title text:', () => {
    const {getByText} = render(<Home />);
    expect(getByText('The number of unique IP addresses :')).toBeTruthy();
  });

  it('displays the number of unique IP addresses output', () => {
    const {getByText} = render(<Home />);
    expect(getByText('0')).toBeTruthy();
  });
});
