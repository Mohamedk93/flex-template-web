import CashPaymentForm from './CashPaymentForm';

export const Empty = {
  component: CashPaymentForm,
  props: {
    formId: 'CashPaymentFormExample',
    listingTitle: 'Sauna with a view',
    authorDisplayName: 'Janne',
    onSubmit(values) {
      console.log('submit with values:', values);
    },
  },
  group: 'forms',
};
