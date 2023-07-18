package com.fiche.patient.web.rest;

import com.fiche.patient.domain.Fiche;
import com.fiche.patient.repository.FicheRepository;
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
 * REST controller for managing {@link com.fiche.patient.domain.Fiche}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FicheResource {

    private final Logger log = LoggerFactory.getLogger(FicheResource.class);

    private static final String ENTITY_NAME = "fiche";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FicheRepository ficheRepository;

    public FicheResource(FicheRepository ficheRepository) {
        this.ficheRepository = ficheRepository;
    }

    /**
     * {@code POST  /fiches} : Create a new fiche.
     *
     * @param fiche the fiche to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fiche, or with status {@code 400 (Bad Request)} if the fiche has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fiches")
    public ResponseEntity<Fiche> createFiche(@RequestBody Fiche fiche) throws URISyntaxException {
        log.debug("REST request to save Fiche : {}", fiche);
        if (fiche.getId() != null) {
            throw new BadRequestAlertException("A new fiche cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Fiche result = ficheRepository.save(fiche);
        return ResponseEntity
            .created(new URI("/api/fiches/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fiches/:id} : Updates an existing fiche.
     *
     * @param id the id of the fiche to save.
     * @param fiche the fiche to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fiche,
     * or with status {@code 400 (Bad Request)} if the fiche is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fiche couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fiches/{id}")
    public ResponseEntity<Fiche> updateFiche(@PathVariable(value = "id", required = false) final Long id, @RequestBody Fiche fiche)
        throws URISyntaxException {
        log.debug("REST request to update Fiche : {}, {}", id, fiche);
        if (fiche.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fiche.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ficheRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Fiche result = ficheRepository.save(fiche);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, fiche.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fiches/:id} : Partial updates given fields of an existing fiche, field will ignore if it is null
     *
     * @param id the id of the fiche to save.
     * @param fiche the fiche to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fiche,
     * or with status {@code 400 (Bad Request)} if the fiche is not valid,
     * or with status {@code 404 (Not Found)} if the fiche is not found,
     * or with status {@code 500 (Internal Server Error)} if the fiche couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fiches/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Fiche> partialUpdateFiche(@PathVariable(value = "id", required = false) final Long id, @RequestBody Fiche fiche)
        throws URISyntaxException {
        log.debug("REST request to partial update Fiche partially : {}, {}", id, fiche);
        if (fiche.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fiche.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ficheRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Fiche> result = ficheRepository
            .findById(fiche.getId())
            .map(existingFiche -> {
                return existingFiche;
            })
            .map(ficheRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, fiche.getId().toString())
        );
    }

    /**
     * {@code GET  /fiches} : get all the fiches.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fiches in body.
     */
    @GetMapping("/fiches")
    public ResponseEntity<List<Fiche>> getAllFiches(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of Fiches");
        Page<Fiche> page;
        if (eagerload) {
            page = ficheRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = ficheRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /fiches/:id} : get the "id" fiche.
     *
     * @param id the id of the fiche to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fiche, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fiches/{id}")
    public ResponseEntity<Fiche> getFiche(@PathVariable Long id) {
        log.debug("REST request to get Fiche : {}", id);
        Optional<Fiche> fiche = ficheRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(fiche);
    }

    /**
     * {@code DELETE  /fiches/:id} : delete the "id" fiche.
     *
     * @param id the id of the fiche to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fiches/{id}")
    public ResponseEntity<Void> deleteFiche(@PathVariable Long id) {
        log.debug("REST request to delete Fiche : {}", id);
        ficheRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
