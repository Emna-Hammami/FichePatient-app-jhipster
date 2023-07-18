package com.fiche.patient.repository;

import com.fiche.patient.domain.Medecin;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Medecin entity.
 */
@Repository
public interface MedecinRepository extends JpaRepository<Medecin, Long> {
    default Optional<Medecin> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Medecin> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Medecin> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select medecin from Medecin medecin left join fetch medecin.hopital left join fetch medecin.service",
        countQuery = "select count(medecin) from Medecin medecin"
    )
    Page<Medecin> findAllWithToOneRelationships(Pageable pageable);

    @Query("select medecin from Medecin medecin left join fetch medecin.hopital left join fetch medecin.service")
    List<Medecin> findAllWithToOneRelationships();

    @Query("select medecin from Medecin medecin left join fetch medecin.hopital left join fetch medecin.service where medecin.id =:id")
    Optional<Medecin> findOneWithToOneRelationships(@Param("id") Long id);
}
