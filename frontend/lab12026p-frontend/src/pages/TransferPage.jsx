import { useState } from 'react';
import { transferMoney } from '../services/transactionService';
import { extractErrorMessage } from '../services/errorUtils';
import StatusMessage from '../components/StatusMessage';

const initialForm = {
  senderAccountNumber: '',
  receiverAccountNumber: '',
  amount: '',
};

export default function TransferPage() {
  const [form, setForm] = useState(initialForm);
  // 'idle' | 'submitting' | 'success' | 'error'
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Validaciones que hacemos en el frontend ANTES de llamar al backend.
  // La transferencia real siempre la ejecuta el backend; esto solo evita
  // peticiones innecesarias con datos claramente inválidos.
  function validate() {
    const sender = form.senderAccountNumber.trim();
    const receiver = form.receiverAccountNumber.trim();
    const amountText = form.amount.trim();

    if (!sender || !receiver || !amountText) {
      return 'Todos los campos son obligatorios.';
    }

    if (sender === receiver) {
      return 'La cuenta de origen y la cuenta de destino no pueden ser la misma.';
    }

    const amount = Number(amountText);
    if (Number.isNaN(amount) || amount <= 0) {
      return 'El monto debe ser un número mayor que cero.';
    }

    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setStatus('error');
      setMessage(validationError);
      return;
    }

    setStatus('submitting');
    setMessage('');

    transferMoney({
      senderAccountNumber: form.senderAccountNumber.trim(),
      receiverAccountNumber: form.receiverAccountNumber.trim(),
      amount: Number(form.amount),
    })
      .then(() => {
        setStatus('success');
        setMessage('Transferencia realizada correctamente.');
        setForm(initialForm);
      })
      .catch((error) => {
        setStatus('error');
        setMessage(extractErrorMessage(error, 'No se pudo realizar la transferencia.'));
      });
  }

  const isSubmitting = status === 'submitting';

  return (
    <section className="page">
      <div className="page-header">
        <h1>Realizar transferencia</h1>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="senderAccountNumber">Cuenta de origen</label>
          <input
            id="senderAccountNumber"
            name="senderAccountNumber"
            type="text"
            placeholder="Ej: 123456789"
            value={form.senderAccountNumber}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-field">
          <label htmlFor="receiverAccountNumber">Cuenta de destino</label>
          <input
            id="receiverAccountNumber"
            name="receiverAccountNumber"
            type="text"
            placeholder="Ej: 987654321"
            value={form.receiverAccountNumber}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-field">
          <label htmlFor="amount">Monto</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="Ej: 100.00"
            value={form.amount}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Procesando...' : 'Transferir'}
        </button>
      </form>

      {status === 'success' && <StatusMessage type="success">{message}</StatusMessage>}
      {status === 'error' && <StatusMessage type="error">{message}</StatusMessage>}
    </section>
  );
}
