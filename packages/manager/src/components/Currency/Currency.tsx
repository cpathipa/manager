import { isNumber } from 'lodash';
import * as React from 'react';

interface CurrencyFormatterProps {
  dataAttrs?: Record<string, any>;
  decimalPlaces?: number;
  quantity: number | string;
  wrapInParentheses?: boolean;
}

export const Currency = (props: CurrencyFormatterProps) => {
  const { dataAttrs, quantity, wrapInParentheses } = props;

  const formatter = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    minimumFractionDigits: props.decimalPlaces ?? 2,
    style: 'currency',
  });

  const formattedQuantity =
    quantity !== 'unknown' && isNumber(quantity)
      ? formatter.format(Math.abs(quantity))
      : quantity;
  const isNegative = quantity < 0;

  let output;

  if (wrapInParentheses) {
    output = isNegative ? `-(${formattedQuantity})` : `(${formattedQuantity})`;
  } else {
    output = isNegative ? `-${formattedQuantity}` : formattedQuantity;
  }

  return (
    <span className="notranslate" {...dataAttrs}>
      {output}
    </span>
  );
};
