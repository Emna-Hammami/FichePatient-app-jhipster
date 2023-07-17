package com.fiche.patient.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.fiche.patient.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HopitalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Hopital.class);
        Hopital hopital1 = new Hopital();
        hopital1.setId(1L);
        Hopital hopital2 = new Hopital();
        hopital2.setId(hopital1.getId());
        assertThat(hopital1).isEqualTo(hopital2);
        hopital2.setId(2L);
        assertThat(hopital1).isNotEqualTo(hopital2);
        hopital1.setId(null);
        assertThat(hopital1).isNotEqualTo(hopital2);
    }
}
