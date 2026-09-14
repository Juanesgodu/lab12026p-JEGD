import { useState } from 'react';
import { getTransactionsByAccount } from '../services/transactionService';
import { extractErrorMessage } from '../services/errorUtils';
import StatusMessage from '../components/StatusMessage';

function formatTimestamp(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('es-CO');
}

export default function HistoryPage() {
  const [accountNumber, setAccountNumber] = useState('');
  const [searchedAccount, setSearchedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  // 'idle' | 'loading' | 'success' | 'error'
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmed = accountNumber.trim();
    if (!trimmed) {
      setStatus('error');
      setErrorMessage('Ingresa un número de cuenta para consultar.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setSearchedAccount(trimmed);

    getTransactionsByAccount(trimmed)
      .then((data) => {
        setTransactions(Array.isArray(data) ? data : []);
        setStatus('success');
      })
      .catch((error) => {
        setErrorMessage(extractErrorMessage(error, 'No se pudo obtener el histórico.'));
        setStatus('error');
      });
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1>Histórico de transacciones</h1>
      </div>

      <form className="inline-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="accountNumber">Número de cuenta</label>
          <input
            id="accountNumber"
            name="accountNumber"
            type="text"
            placeholder="Ej: 123456789"
            value={accountNumber}
            onChange={(event) => setAccountNumber(event.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Consultar
        </button>
      </form>

      {status === 'loading' && (
        <StatusMessage type="loading">Cargando historial...</StatusMessage>
      )}

      {status === 'error' && <StatusMessage type="error">{errorMessage}</StatusMessage>}

      {status === 'success' && transactions.length === 0 && (
        <StatusMessage type="empty">
          La cuenta {searchedAccount} no tiene transacciones registradas.
        </StatusMessage>
      )}

      {status === 'success' && transactions.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cuenta origen</th>
                <th>Cuenta destino</th>
                <th>Monto</th>
                <th>Fecha/hora</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{tx.senderAccountNumber}</td>
                  <td>{tx.receiverAccountNumber}</td>
                  <td>{tx.amount}</td>
                  <td>{formatTimestamp(tx.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
