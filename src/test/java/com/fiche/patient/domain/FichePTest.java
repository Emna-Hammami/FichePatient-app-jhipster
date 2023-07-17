package com.fiche.patient.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.fiche.patient.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FichePTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FicheP.class);
        FicheP ficheP1 = new FicheP();
        ficheP1.setId(1L);
        FicheP ficheP2 = new FicheP();
        ficheP2.setId(ficheP1.getId());
        assertThat(ficheP1).isEqualTo(ficheP2);
        ficheP2.setId(2L);
        assertThat(ficheP1).isNotEqualTo(ficheP2);
        ficheP1.setId(null);
        assertThat(ficheP1).isNotEqualTo(ficheP2);
    }
}
