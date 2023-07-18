package com.fiche.patient.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.fiche.patient.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FicheTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Fiche.class);
        Fiche fiche1 = new Fiche();
        fiche1.setId(1L);
        Fiche fiche2 = new Fiche();
        fiche2.setId(fiche1.getId());
        assertThat(fiche1).isEqualTo(fiche2);
        fiche2.setId(2L);
        assertThat(fiche1).isNotEqualTo(fiche2);
        fiche1.setId(null);
        assertThat(fiche1).isNotEqualTo(fiche2);
    }
}
