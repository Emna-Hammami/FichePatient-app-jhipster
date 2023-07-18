package com.fiche.patient.repository;

import com.fiche.patient.domain.Fiche;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Fiche entity.
 */
@Repository
public interface FicheRepository extends JpaRepository<Fiche, Long> {
    default Optional<Fiche> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Fiche> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Fiche> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select fiche from Fiche fiche left join fetch fiche.hopital left join fetch fiche.service left join fetch fiche.medecin",
        countQuery = "select count(fiche) from Fiche fiche"
    )
    Page<Fiche> findAllWithToOneRelationships(Pageable pageable);

    @Query("select fiche from Fiche fiche left join fetch fiche.hopital left join fetch fiche.service left join fetch fiche.medecin")
    List<Fiche> findAllWithToOneRelationships();

    @Query(
        "select fiche from Fiche fiche left join fetch fiche.hopital left join fetch fiche.service left join fetch fiche.medecin where fiche.id =:id"
    )
    Optional<Fiche> findOneWithToOneRelationships(@Param("id") Long id);
}
