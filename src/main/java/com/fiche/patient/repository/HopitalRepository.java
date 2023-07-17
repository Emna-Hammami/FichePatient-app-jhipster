package com.fiche.patient.repository;

import com.fiche.patient.domain.Hopital;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Hopital entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HopitalRepository extends JpaRepository<Hopital, Long> {}
