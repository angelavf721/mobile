export const phoneMask = {
    mask: ['(',/\d/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  };

export const maskPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();