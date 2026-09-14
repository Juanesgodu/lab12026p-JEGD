import api from './api';

// POST /api/transactions -> realiza una transferencia real en el backend
export function transferMoney({ senderAccountNumber, receiverAccountNumber, amount }) {
  return api
    .post('/transactions', {
      senderAccountNumber,
      receiverAccountNumber,
      amount,
    })
    .then((response) => response.data);
}

// GET /api/transactions/{accountNumber} -> historial de una cuenta
export function getTransactionsByAccount(accountNumber) {
  return api.get(`/transactions/${accountNumber}`).then((response) => response.data);
}
