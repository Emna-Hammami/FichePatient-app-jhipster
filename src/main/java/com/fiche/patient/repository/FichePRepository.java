package com.fiche.patient.repository;

import com.fiche.patient.domain.FicheP;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the FicheP entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FichePRepository extends JpaRepository<FicheP, Long> {}
