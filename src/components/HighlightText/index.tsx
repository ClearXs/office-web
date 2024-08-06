import { Typography } from 'antd';
import { BlockProps } from 'antd/es/typography/Base';
import React from 'react';

export interface IHighlightTextProps extends Omit<BlockProps, 'children'> {
  text: string;
  highlight: string;
  highlightColor?: string;
}

const HighlightText: React.FC<IHighlightTextProps> = ({
  text,
  highlight,
  highlightColor = '#175ceb',
  ...props
}) => {
  const Text = Array.from(text).map((c, i) => {
    if (highlight?.includes(c)) {
      return (
        <em key={i} style={{ color: highlightColor }}>
          {c}
        </em>
      );
    }
    return c;
  });

  return <Typography.Text {...props}>{Text}</Typography.Text>;
};

export default HighlightText;
