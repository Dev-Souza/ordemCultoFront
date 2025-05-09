'use client'

import { useField, useFormikContext } from 'formik';
import DatePicker from 'react-multi-date-picker';

export default function DatePickerField({ name, ...props }) {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(name);

  return (
    <DatePicker
      multiple
      value={field.value || []}
      onChange={(dates) => {
        const formattedDates = dates.map((date) => date.format('YYYY-MM-DD'));
        setFieldValue(name, formattedDates);
      }}
      {...props}
    />
  );
};

DatePickerField;