import React from 'react';
import {Button as UIButton, ButtonProps, Text} from '@ui-kitten/components';

class Button extends React.Component<ButtonProps> {
  render() {
    return (
      <UIButton {...this.props}>
        {evaProps => (
          <Text
            {...evaProps}
            style={{
              color: (evaProps?.style as any).color,
              fontSize: (evaProps?.style as any).fontSize,
            }}
            category="c2">
            {this.props.children as string}
          </Text>
        )}
      </UIButton>
    );
  }
}

export default Button;
