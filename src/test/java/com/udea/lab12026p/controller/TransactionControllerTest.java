package com.udea.lab12026p.controller;

import com.udea.lab12026p.dto.TransactionDTO;
import com.udea.lab12026p.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// Prueba del controlador SIN levantar Spring completo ni la base de datos (standalone MockMvc).
@ExtendWith(MockitoExtension.class)
class TransactionControllerTest {

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private TransactionController transactionController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(transactionController).build();
    }

    private static final String BODY =
            "{\"senderAccountNumber\":\"111\",\"receiverAccountNumber\":\"222\",\"amount\":100.0}";

    @Test
    void transferMoney_success_returns200() throws Exception {
        TransactionDTO saved = new TransactionDTO();
        saved.setId(1L);
        saved.setSenderAccountNumber("111");
        saved.setReceiverAccountNumber("222");
        saved.setAmount(100.0);
        when(transactionService.transferMoney(any(TransactionDTO.class))).thenReturn(saved);

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(BODY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.senderAccountNumber").value("111"));
    }

    @Test
    void transferMoney_serviceThrows_returns400WithMessage() throws Exception {
        when(transactionService.transferMoney(any(TransactionDTO.class)))
                .thenThrow(new IllegalArgumentException("Saldo insuficiente en la cuenta del remitente."));

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(BODY))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Saldo insuficiente en la cuenta del remitente."));
    }

    @Test
    void getTransactionsByAccount_returnsList() throws Exception {
        TransactionDTO t = new TransactionDTO();
        t.setId(5L);
        t.setSenderAccountNumber("111");
        t.setReceiverAccountNumber("222");
        t.setAmount(50.0);
        when(transactionService.getTransactionsForAccount("111")).thenReturn(List.of(t));

        mockMvc.perform(get("/api/transactions/111"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(5))
                .andExpect(jsonPath("$[0].amount").value(50.0));
    }
}
