package com.fiche.patient.repository;

import com.fiche.patient.domain.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Service entity.
 */
@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    default Optional<Service> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Service> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Service> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select service from Service service left join fetch service.hopital",
        countQuery = "select count(service) from Service service"
    )
    Page<Service> findAllWithToOneRelationships(Pageable pageable);

    @Query("select service from Service service left join fetch service.hopital")
    List<Service> findAllWithToOneRelationships();

    @Query("select service from Service service left join fetch service.hopital where service.id =:id")
    Optional<Service> findOneWithToOneRelationships(@Param("id") Long id);
}
