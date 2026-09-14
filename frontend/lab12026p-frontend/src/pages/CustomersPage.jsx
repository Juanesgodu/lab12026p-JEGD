import { useEffect, useState } from 'react';
import { getAllCustomers, createCustomer } from '../services/customerService';
import { extractErrorMessage } from '../services/errorUtils';
import StatusMessage from '../components/StatusMessage';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 2,
});

const emptyForm = {
  accountNumber: '',
  firstName: '',
  lastName: '',
  balance: '',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  // 'loading' | 'success' | 'error'
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  // ---- Estado del formulario "nuevo cliente" ----
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  // 'idle' | 'submitting' | 'success' | 'error'
  const [formStatus, setFormStatus] = useState('idle');
  const [formMessage, setFormMessage] = useState('');

  function loadCustomers() {
    setStatus('loading');
    setErrorMessage('');
    getAllCustomers()
      .then((data) => {
        setCustomers(Array.isArray(data) ? data : []);
        setStatus('success');
      })
      .catch((error) => {
        setErrorMessage(extractErrorMessage(error, 'No se pudieron cargar los clientes.'));
        setStatus('error');
      });
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Validación básica en el frontend antes de llamar al backend.
  // El backend solo exige que balance no sea nulo (ver CustomerController),
  // pero la tabla también requiere accountNumber/firstName/lastName no nulos
  // y accountNumber único, así que lo validamos aquí para dar un mensaje claro.
  function validateForm() {
    const accountNumber = form.accountNumber.trim();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const balanceText = form.balance.trim();

    if (!accountNumber || !firstName || !lastName || !balanceText) {
      return 'Todos los campos son obligatorios.';
    }

    const balance = Number(balanceText);
    if (Number.isNaN(balance) || balance < 0) {
      return 'El saldo inicial debe ser un número mayor o igual a cero.';
    }

    return null;
  }

  function handleCreateCustomer(event) {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFormStatus('error');
      setFormMessage(validationError);
      return;
    }

    setFormStatus('submitting');
    setFormMessage('');

    createCustomer({
      accountNumber: form.accountNumber.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      balance: Number(form.balance),
    })
      .then(() => {
        setFormStatus('success');
        setFormMessage('Cliente creado correctamente.');
        setForm(emptyForm);
        loadCustomers(); // refresca la tabla con el cliente recién creado
      })
      .catch((error) => {
        setFormStatus('error');
        setFormMessage(
          extractErrorMessage(
            error,
            'No se pudo crear el cliente. Verifica que el número de cuenta no esté repetido.'
          )
        );
      });
  }

  function toggleForm() {
    setShowForm((prev) => !prev);
    setFormStatus('idle');
    setFormMessage('');
    setForm(emptyForm);
  }

  const isSubmitting = formStatus === 'submitting';

  return (
    <section className="page">
      <div className="page-header">
        <h1>Clientes</h1>
        <div className="page-header-actions">
          <button type="button" className="btn btn-secondary" onClick={loadCustomers}>
            Actualizar
          </button>
          <button type="button" className="btn btn-primary" onClick={toggleForm}>
            {showForm ? 'Cancelar' : '+ Nuevo cliente'}
          </button>
        </div>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleCreateCustomer}>
          <div className="form-field">
            <label htmlFor="accountNumber">Número de cuenta</label>
            <input
              id="accountNumber"
              name="accountNumber"
              type="text"
              placeholder="Ej: 111222333"
              value={form.accountNumber}
              onChange={handleFormChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-field">
            <label htmlFor="firstName">Nombre</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Ej: Ana"
              value={form.firstName}
              onChange={handleFormChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-field">
            <label htmlFor="lastName">Apellido</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Ej: Gómez"
              value={form.lastName}
              onChange={handleFormChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-field">
            <label htmlFor="balance">Saldo inicial</label>
            <input
              id="balance"
              name="balance"
              type="number"
              min="0"
              step="0.01"
              placeholder="Ej: 500000"
              value={form.balance}
              onChange={handleFormChange}
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Crear cliente'}
          </button>

          {formStatus === 'success' && (
            <StatusMessage type="success">{formMessage}</StatusMessage>
          )}
          {formStatus === 'error' && <StatusMessage type="error">{formMessage}</StatusMessage>}
        </form>
      )}

      {status === 'loading' && (
        <StatusMessage type="loading">Cargando clientes...</StatusMessage>
      )}

      {status === 'error' && (
        <StatusMessage type="error">
          {errorMessage}
        </StatusMessage>
      )}

      {status === 'success' && customers.length === 0 && (
        <StatusMessage type="empty">No hay clientes registrados todavía.</StatusMessage>
      )}

      {status === 'success' && customers.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Número de cuenta</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id ?? customer.accountNumber}>
                  <td>{customer.accountNumber}</td>
                  <td>{customer.firstName}</td>
                  <td>{customer.lastName}</td>
                  <td>
                    {typeof customer.balance === 'number'
                      ? currencyFormatter.format(customer.balance)
                      : customer.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
