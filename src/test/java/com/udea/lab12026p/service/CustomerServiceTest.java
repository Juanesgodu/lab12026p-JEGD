package com.udea.lab12026p.service;

import com.udea.lab12026p.dto.CustomerDTO;
import com.udea.lab12026p.entity.Customer;
import com.udea.lab12026p.mapper.CustomerMapper;
import com.udea.lab12026p.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CustomerMapper customerMapper;

    @InjectMocks
    private CustomerService customerService;

    // OJO: el constructor completo de CustomerDTO tiene el cuerpo vacío en el proyecto,
    // por eso se usa el constructor vacío + setters.
    private CustomerDTO dto(String accountNumber, double balance) {
        CustomerDTO d = new CustomerDTO();
        d.setAccountNumber(accountNumber);
        d.setFirstName("Ana");
        d.setLastName("Gómez");
        d.setBalance(balance);
        return d;
    }

    @Test
    void getAllCustomers_returnsMappedList() {
        Customer entity = new Customer();
        CustomerDTO dto = dto("111", 1000.0);
        when(customerRepository.findAll()).thenReturn(List.of(entity));
        when(customerMapper.toDTO(entity)).thenReturn(dto);

        List<CustomerDTO> result = customerService.getAllCustomers();

        assertEquals(1, result.size());
        assertEquals("111", result.get(0).getAccountNumber());
    }

    @Test
    void getCustomerById_found_returnsDto() {
        Customer entity = new Customer();
        CustomerDTO dto = dto("111", 1000.0);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(customerMapper.toDTO(entity)).thenReturn(dto);

        CustomerDTO result = customerService.getCustomerById(1L);

        assertEquals("111", result.getAccountNumber());
    }

    @Test
    void getCustomerById_notFound_throwsException() {
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> customerService.getCustomerById(99L));

        assertEquals("Cliente no encontrado", ex.getMessage());
    }

    @Test
    void createCustomer_savesAndReturnsDto() {
        CustomerDTO input = dto("333", 250.0);
        Customer entity = new Customer();
        Customer saved = new Customer();
        when(customerMapper.toEntity(input)).thenReturn(entity);
        when(customerRepository.save(entity)).thenReturn(saved);
        when(customerMapper.toDTO(saved)).thenReturn(input);

        CustomerDTO result = customerService.createCustomer(input);

        assertEquals("333", result.getAccountNumber());
        verify(customerRepository, times(1)).save(entity);
    }
}
