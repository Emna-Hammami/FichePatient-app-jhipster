package com.fiche.patient.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.fiche.patient.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StatistiqueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Statistique.class);
        Statistique statistique1 = new Statistique();
        statistique1.setId(1L);
        Statistique statistique2 = new Statistique();
        statistique2.setId(statistique1.getId());
        assertThat(statistique1).isEqualTo(statistique2);
        statistique2.setId(2L);
        assertThat(statistique1).isNotEqualTo(statistique2);
        statistique1.setId(null);
        assertThat(statistique1).isNotEqualTo(statistique2);
    }
}
