import api from './api';

// GET /api/customers -> obtiene todos los clientes
export function getAllCustomers() {
  return api.get('/customers').then((response) => response.data);
}

// GET /api/customers/{id} -> obtiene un cliente por id
export function getCustomerById(id) {
  return api.get(`/customers/${id}`).then((response) => response.data);
}

// POST /api/customers -> crea un cliente
export function createCustomer(customer) {
  return api.post('/customers', customer).then((response) => response.data);
}
