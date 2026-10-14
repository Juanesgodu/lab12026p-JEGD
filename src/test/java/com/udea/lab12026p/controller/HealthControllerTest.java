package com.udea.lab12026p.controller;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class HealthControllerTest {

    private final HealthController controller = new HealthController();

    @Test
    void healthCheck_returnsOk() {
        assertEquals("HEALTH CHECK OK!", controller.healthCheck());
    }

    @Test
    void version_returnsCurrentVersion() {
        assertEquals("The actual version is 1.0.0", controller.version());
    }
}