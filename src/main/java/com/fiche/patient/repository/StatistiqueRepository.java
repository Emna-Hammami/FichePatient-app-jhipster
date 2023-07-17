package com.fiche.patient.repository;

import com.fiche.patient.domain.Statistique;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Statistique entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StatistiqueRepository extends JpaRepository<Statistique, Long> {}
