'use client';

import { useField, useFormikContext } from 'formik';
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/colors/teal.css'; // Tema

export default function DatePickerField({ name, ...props }) {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(name);

  return (
    <DatePicker
      multiple
      value={field.value || []}
      onChange={(dates) => {
        if (!dates || dates.length === 0) {
          setFieldValue(name, []);
          return;
        }

        const formattedDates = dates.map((date) => date.format('YYYY-MM-DD'));
        setFieldValue(name, formattedDates);
      }}
      format="DD/MM/YYYY"
      weekDays={["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]}
      months={["Jan", "Fev", "Mar", "Abri", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]}
      placeholder="Selecione as datas"
      inputClass="form-control"
      containerClassName="w-100"
      {...props}
    />

  );
}