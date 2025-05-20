'use client';

import { useField, useFormikContext } from 'formik';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/colors/teal.css';
import { parse } from 'date-fns';

export default function DatePickerField({ name, ...props }) {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(name);

  // Converte os valores ISO do Formik para DateObject
  const getFormattedValue = (value) => {
    if (!value || value.length === 0) return [];

    return value.map(dateStr => {
      try {
        return new DateObject({ date: dateStr, format: "YYYY-MM-DD" });
      } catch {
        return null;
      }
    }).filter(Boolean);
  };

  const handleChange = (dates) => {
    if (!dates || dates.length === 0) {
      setFieldValue(name, []);
      return;
    }

    const formattedDates = dates.map(date => {
      if (typeof date === 'string') {
        const parsed = parse(date, 'dd/MM/yyyy', new Date());
        return parsed.toISOString().split('T')[0];
      }

      if (typeof date?.toDate === 'function') {
        return date.toDate().toISOString().split('T')[0];
      }

      return new Date(date).toISOString().split('T')[0];
    }).filter(Boolean);

    setFieldValue(name, formattedDates);
  };

  return (
    <DatePicker
      multiple
      format="DD/MM/YYYY"
      value={getFormattedValue(field.value)}
      onChange={handleChange}
      inputClass="form-control"
      containerClassName="w-100"
      {...props}
    />
  );
}