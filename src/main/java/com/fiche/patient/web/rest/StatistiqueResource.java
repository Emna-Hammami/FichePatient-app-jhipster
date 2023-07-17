package com.fiche.patient.web.rest;

import com.fiche.patient.domain.Statistique;
import com.fiche.patient.repository.StatistiqueRepository;
import com.fiche.patient.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.fiche.patient.domain.Statistique}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StatistiqueResource {

    private final Logger log = LoggerFactory.getLogger(StatistiqueResource.class);

    private static final String ENTITY_NAME = "statistique";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StatistiqueRepository statistiqueRepository;

    public StatistiqueResource(StatistiqueRepository statistiqueRepository) {
        this.statistiqueRepository = statistiqueRepository;
    }

    /**
     * {@code POST  /statistiques} : Create a new statistique.
     *
     * @param statistique the statistique to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new statistique, or with status {@code 400 (Bad Request)} if the statistique has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/statistiques")
    public ResponseEntity<Statistique> createStatistique(@RequestBody Statistique statistique) throws URISyntaxException {
        log.debug("REST request to save Statistique : {}", statistique);
        if (statistique.getId() != null) {
            throw new BadRequestAlertException("A new statistique cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Statistique result = statistiqueRepository.save(statistique);
        return ResponseEntity
            .created(new URI("/api/statistiques/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /statistiques/:id} : Updates an existing statistique.
     *
     * @param id the id of the statistique to save.
     * @param statistique the statistique to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated statistique,
     * or with status {@code 400 (Bad Request)} if the statistique is not valid,
     * or with status {@code 500 (Internal Server Error)} if the statistique couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/statistiques/{id}")
    public ResponseEntity<Statistique> updateStatistique(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Statistique statistique
    ) throws URISyntaxException {
        log.debug("REST request to update Statistique : {}, {}", id, statistique);
        if (statistique.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, statistique.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!statistiqueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        // no save call needed as we have no fields that can be updated
        Statistique result = statistique;
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, statistique.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /statistiques/:id} : Partial updates given fields of an existing statistique, field will ignore if it is null
     *
     * @param id the id of the statistique to save.
     * @param statistique the statistique to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated statistique,
     * or with status {@code 400 (Bad Request)} if the statistique is not valid,
     * or with status {@code 404 (Not Found)} if the statistique is not found,
     * or with status {@code 500 (Internal Server Error)} if the statistique couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/statistiques/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Statistique> partialUpdateStatistique(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Statistique statistique
    ) throws URISyntaxException {
        log.debug("REST request to partial update Statistique partially : {}, {}", id, statistique);
        if (statistique.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, statistique.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!statistiqueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Statistique> result = statistiqueRepository
            .findById(statistique.getId())
            .map(existingStatistique -> {
                return existingStatistique;
            }); // .map(statistiqueRepository::save)

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, statistique.getId().toString())
        );
    }

    /**
     * {@code GET  /statistiques} : get all the statistiques.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of statistiques in body.
     */
    @GetMapping("/statistiques")
    public ResponseEntity<List<Statistique>> getAllStatistiques(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Statistiques");
        Page<Statistique> page = statistiqueRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /statistiques/:id} : get the "id" statistique.
     *
     * @param id the id of the statistique to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the statistique, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/statistiques/{id}")
    public ResponseEntity<Statistique> getStatistique(@PathVariable Long id) {
        log.debug("REST request to get Statistique : {}", id);
        Optional<Statistique> statistique = statistiqueRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(statistique);
    }

    /**
     * {@code DELETE  /statistiques/:id} : delete the "id" statistique.
     *
     * @param id the id of the statistique to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/statistiques/{id}")
    public ResponseEntity<Void> deleteStatistique(@PathVariable Long id) {
        log.debug("REST request to delete Statistique : {}", id);
        statistiqueRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
