package com.udea.lab12026p.service;

import com.udea.lab12026p.dto.TransactionDTO;
import com.udea.lab12026p.entity.Customer;
import com.udea.lab12026p.entity.Transaction;
import com.udea.lab12026p.repository.CustomerRepository;
import com.udea.lab12026p.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

// Prueba unitaria pura: no levanta Spring ni MySQL, los repositorios son "mocks".
@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private TransactionService transactionService;

    private Customer customer(String accountNumber, double balance) {
        Customer c = new Customer();
        c.setAccountNumber(accountNumber);
        c.setFirstName("Nombre");
        c.setLastName("Apellido");
        c.setBalance(balance);
        return c;
    }

    private TransactionDTO request(String sender, String receiver, Double amount) {
        TransactionDTO dto = new TransactionDTO();
        dto.setSenderAccountNumber(sender);
        dto.setReceiverAccountNumber(receiver);
        dto.setAmount(amount);
        dto.setTimestamp(LocalDateTime.of(2026, 10, 1, 10, 0));
        return dto;
    }

    @Test
    void transferMoney_success_updatesBalancesAndSavesTransaction() {
        Customer sender = customer("111", 1000.0);
        Customer receiver = customer("222", 500.0);
        when(customerRepository.findByAccountNumber("111")).thenReturn(Optional.of(sender));
        when(customerRepository.findByAccountNumber("222")).thenReturn(Optional.of(receiver));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> {
            Transaction t = inv.getArgument(0);
            t.setId(1L);
            return t;
        });

        TransactionDTO result = transactionService.transferMoney(request("111", "222", 200.0));

        assertEquals(800.0, sender.getBalance());
        assertEquals(700.0, receiver.getBalance());
        assertEquals(1L, result.getId());
        assertEquals("111", result.getSenderAccountNumber());
        assertEquals("222", result.getReceiverAccountNumber());
        assertEquals(200.0, result.getAmount());
        verify(customerRepository, times(2)).save(any(Customer.class));
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    void transferMoney_nullAccountNumber_throwsException() {
        TransactionDTO dto = request(null, "222", 100.0);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> transactionService.transferMoney(dto));

        assertEquals("Los números de cuenta del remitente y receptor son obligatorios.", ex.getMessage());
        verifyNoInteractions(customerRepository, transactionRepository);
    }

    @Test
    void transferMoney_senderNotFound_throwsException() {
        when(customerRepository.findByAccountNumber("111")).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> transactionService.transferMoney(request("111", "222", 100.0)));

        assertEquals("La cuenta del remitente no existe.", ex.getMessage());
    }

    @Test
    void transferMoney_receiverNotFound_throwsException() {
        when(customerRepository.findByAccountNumber("111")).thenReturn(Optional.of(customer("111", 1000.0)));
        when(customerRepository.findByAccountNumber("222")).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> transactionService.transferMoney(request("111", "222", 100.0)));

        assertEquals("La cuenta del receptor no existe.", ex.getMessage());
    }

    @Test
    void transferMoney_insufficientBalance_throwsAndDoesNotSaveAnything() {
        Customer sender = customer("111", 50.0);
        Customer receiver = customer("222", 500.0);
        when(customerRepository.findByAccountNumber("111")).thenReturn(Optional.of(sender));
        when(customerRepository.findByAccountNumber("222")).thenReturn(Optional.of(receiver));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> transactionService.transferMoney(request("111", "222", 200.0)));

        assertEquals("Saldo insuficiente en la cuenta del remitente.", ex.getMessage());
        assertEquals(50.0, sender.getBalance());
        assertEquals(500.0, receiver.getBalance());
        verify(customerRepository, never()).save(any(Customer.class));
        verify(transactionRepository, never()).save(any(Transaction.class));
    }

    @Test
    void getTransactionsForAccount_returnsMappedList() {
        Transaction t = new Transaction(7L, "111", "222", 150.0, LocalDateTime.of(2026, 10, 1, 10, 0));
        when(transactionRepository.findBySenderAccountNumberOrReceiverAccountNumber("111", "111"))
                .thenReturn(List.of(t));

        List<TransactionDTO> result = transactionService.getTransactionsForAccount("111");

        assertEquals(1, result.size());
        assertEquals(7L, result.get(0).getId());
        assertEquals("222", result.get(0).getReceiverAccountNumber());
        assertEquals(150.0, result.get(0).getAmount());
    }

    @Test
    void getTransactionsForAccount_noTransactions_returnsEmptyList() {
        when(transactionRepository.findBySenderAccountNumberOrReceiverAccountNumber("999", "999"))
                .thenReturn(List.of());

        assertTrue(transactionService.getTransactionsForAccount("999").isEmpty());
    }
}
